import { Module } from "@nestjs/common"
import { APP_FILTER } from "@nestjs/core"

import { PrismaModule } from "@/shared/prisma.module"
import { DomainExceptionFilter } from "@/presentation/filters"
import {
    CategoriesRoutesModule,
    ModerationRoutesModule,
    PostsRoutesModule,
} from "@/presentation/routes"

@Module({
    imports: [
        PrismaModule,
        PostsRoutesModule,
        CategoriesRoutesModule,
        ModerationRoutesModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: DomainExceptionFilter,
        },
    ],
})
export class AppModule {}
