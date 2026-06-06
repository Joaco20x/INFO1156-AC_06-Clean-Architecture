## Reglas de dependencia — Clean Architecture

[Presentation] → [Application] → [Domain] ← [Infrastructure]

- Domain: no importa nada de otras capas.
- Application: solo importa de Domain.
- Infrastructure: implementa interfaces de Domain.
- Presentation: solo llama a casos de uso de Application.