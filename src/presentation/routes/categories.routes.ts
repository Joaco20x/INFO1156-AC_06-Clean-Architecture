import { Module } from "@nestjs/common"

import { CategoriesController } from "@/presentation/controllers/CategoriesController"

import { categoryUseCaseProviders } from "./use-case.providers"

/** Rutas de categorías (`api/categories`). */
@Module({
    controllers: [CategoriesController],
    providers: [...categoryUseCaseProviders],
})
export class CategoriesRoutesModule {}
