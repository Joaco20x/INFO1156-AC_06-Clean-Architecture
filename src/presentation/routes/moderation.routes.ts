import { Module } from "@nestjs/common"

import { ModerationController } from "@/presentation/controllers/ModerationController"

import { moderationUseCaseProviders } from "./use-case.providers"

/** Rutas de administración de palabras prohibidas (`api/admin/prohibited-words`). */
@Module({
    controllers: [ModerationController],
    providers: [...moderationUseCaseProviders],
})
export class ModerationRoutesModule {}
