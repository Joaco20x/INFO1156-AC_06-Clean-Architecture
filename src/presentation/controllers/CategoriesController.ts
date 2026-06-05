import { Controller, Get } from "@nestjs/common"

import { GetAllCategories } from "@/application/use-cases"

@Controller("api/categories")
export class CategoriesController {
    constructor(private readonly getAllCategories: GetAllCategories) {}

    @Get()
    async findAll() {
        return this.getAllCategories.execute()
    }
}
