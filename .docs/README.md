# Refactorización a Clean Architecture

Documentación del proceso de refactorización del proyecto **Feed de Publicaciones** (NestJS + Prisma + SQLite) hacia una arquitectura limpia por capas.

## 1. Problemas identificados en el código original

El proyecto original seguía la estructura por *features* de NestJS (`posts/`, `comments/`, `likes/`, `categories/`, `moderation/`), donde cada módulo mezclaba responsabilidades:

- **Lógica de negocio mezclada con la infraestructura.** Los *services* (p. ej. `PostsService`) contenían reglas de negocio (moderación, validación de likes, cálculo del feed) **y al mismo tiempo** accedían directamente a la base de datos con `this.prisma.post...`. No había forma de probar la lógica sin levantar Prisma.
- **Sin separación de capas.** No existían entidades de dominio ni contratos (interfaces) de repositorio. El modelo de datos era directamente el de Prisma, por lo que toda la aplicación quedaba acoplada al ORM.
- **Dependencia directa hacia el detalle.** Los controladores dependían de servicios concretos y estos de `PrismaService`. La regla de dependencia apuntaba "hacia afuera" (hacia el framework y el ORM), justo lo contrario a lo que propone Clean Architecture.
- **Reglas duplicadas y dispersas.** La moderación por palabras prohibidas estaba implementada en un servicio y era invocada desde varios lugares, sin un punto único de verdad a nivel de negocio.

## 2. Solución aplicada y decisiones arquitectónicas

Se reorganizó el código en cuatro capas con una regla de dependencia estricta:

```
src/
├── domain/          (entidades + contratos de repositorio + errores)
├── application/     (casos de uso = reglas de negocio)
├── infrastructure/  (Prisma + implementaciones de repositorio)
└── presentation/    (controladores, DTOs, rutas y filtros HTTP)
```

Decisiones tomadas:

- **El dominio no depende de nadie.** En `domain/` viven las entidades (`Post`, `Comment`, `Like`, `Category`, `ProhibitedWord`) como interfaces puras de TypeScript y los **contratos** de repositorio (`PostRepository`, etc.). No importan ni NestJS ni Prisma.
- **Inversión de dependencias (DIP).** Los casos de uso de `application/` dependen de las **interfaces** de repositorio del dominio, nunca de las implementaciones. Reciben el repositorio por **inyección de dependencias** en su constructor.
- **La infraestructura implementa los contratos.** En `infrastructure/repositories/` están las clases `...RepositoryImpl` que cumplen las interfaces del dominio usando Prisma. La conexión a la base de datos queda aislada en `infrastructure/database/`.
- **Controladores delgados.** En `presentation/controllers/` los controladores solo reciben la request, llaman al caso de uso correspondiente y devuelven la respuesta. No contienen lógica de negocio.
- **Validación y traducción de errores en presentación.** Los DTOs (`presentation/dtos/`) validan la entrada HTTP con `class-validator`. Un *exception filter* (`DomainExceptionFilter`) traduce los errores de dominio a códigos HTTP (`NotFoundError` → 404, resto de `DomainError` → 400), de modo que el dominio no sabe nada de HTTP y los controladores quedan libres de `try/catch`.
- **Composition root.** El "cableado" concreto (qué implementación de repositorio recibe cada caso de uso) se centraliza en `infrastructure/dependencies.ts` y se expone a NestJS mediante *providers* en los módulos de `presentation/routes/`.

## 3. Diagrama de capas

```
        [Presentation]  →  [Application]  →  [Domain]  ←  [Infrastructure]
        controladores       casos de uso     entidades       repos Prisma
        DTOs, filtros                         contratos
```

Reglas de dependencia:

- **Domain**: no importa nada de otras capas.
- **Application**: solo importa de Domain.
- **Infrastructure**: implementa las interfaces de Domain.
- **Presentation**: solo llama a casos de uso de Application (y conoce tipos del Domain).

## 4. Ejemplo de código: antes y después

### Antes — lógica de negocio y acceso a datos mezclados en el service

```ts
// posts/posts.service.ts (ANTES)
@Injectable()
export class PostsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly moderationService: ModerationService,
    ) {}

    async create(data: CreatePostDto) {
        const text = `${data.title} ${data.description}`
        const moderation = await this.moderationService.moderate(text)

        if (!moderation.approved) {
            throw new BadRequestException(
                moderation.reason ?? "Post bloqueado por moderación",
            )
        }

        // Acceso directo a la base de datos desde la lógica de negocio
        return this.prisma.post.create({ data })
    }
}
```

### Después — regla de negocio en el caso de uso, controlador delgado

```ts
// application/use-cases/CreatePost.ts (DESPUÉS)
// Reglas de negocio puras: dependen solo de contratos del dominio.
export class CreatePost implements UseCase<CreatePostInput, Post> {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly prohibitedWordRepository: ProhibitedWordRepository,
    ) {}

    async execute(input: CreatePostInput): Promise<Post> {
        const words = await this.prohibitedWordRepository.findAll()
        const text = `${input.title} ${input.description}`

        for (const pw of words) {
            if (buildFuzzyRegex(pw.word).test(text)) {
                throw new ModerationBlockedError(
                    `Contiene palabra prohibida: "${pw.word}"`,
                    pw.category,
                )
            }
        }

        return this.postRepository.save({
            title: input.title,
            description: input.description,
            imageUrl: input.imageUrl,
            categoryId: input.categoryId ?? null,
        })
    }
}
```

```ts
// presentation/controllers/PostsController.ts (DESPUÉS)
// Solo orquesta: recibe la request, llama al caso de uso y responde.
@Controller("api/posts")
export class PostsController {
    constructor(private readonly createPost: CreatePost) {}

    @Post()
    async create(@Body() body: CreatePostDto) {
        const payload = await this.createPost.execute({
            title: body.title,
            description: body.description,
            imageUrl: body.imageUrl,
            categoryId: body.categoryId ?? null,
        })

        return { ok: true, payload }
    }
}
```

La diferencia clave: la regla de negocio (moderación + persistencia) ya **no** vive en el controlador ni acoplada a Prisma. Vive en un caso de uso que depende de **abstracciones**, y la base de datos es un detalle intercambiable detrás de una interfaz.

## 5. Correcciones de integración

Durante la integración de la capa de presentación se detectaron y corrigieron problemas que impedían compilar o ejecutar la aplicación:

- Se completó el *barrel* `domain/errors/index.ts`, que estaba vacío y rompía la compilación.
- Se configuró el cliente Prisma standalone (`infrastructure/database/prisma.ts`) con el adaptador libSQL, necesario para conectar en Prisma 7.
- Se corrigió la construcción de `GetCommentsByPostId` en `dependencies.ts`, al que le faltaba el repositorio de posts.
- En `PostRepositoryImpl.getFeed`, el conteo de likes (`likesCount`) ahora suma los **pesos** de cada like en lugar de contar filas, reflejando correctamente la popularidad ponderada del feed.