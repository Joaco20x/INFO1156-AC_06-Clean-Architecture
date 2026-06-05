import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common"

import {
    AddProhibitedWord,
    DeleteProhibitedWord,
    GetAllProhibitedWords,
} from "@/application/use-cases"
import { CreateProhibitedWordDto } from "@/presentation/dtos"

@Controller("api/admin/prohibited-words")
export class ModerationController {
    constructor(
        private readonly getAllProhibitedWords: GetAllProhibitedWords,
        private readonly addProhibitedWord: AddProhibitedWord,
        private readonly deleteProhibitedWord: DeleteProhibitedWord,
    ) {}

    @Get()
    async findAll() {
        return this.getAllProhibitedWords.execute()
    }

    @Post()
    async create(@Body() body: CreateProhibitedWordDto) {
        return this.addProhibitedWord.execute({
            word: body.word,
            category: body.category,
        })
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        await this.deleteProhibitedWord.execute({ id })
    }
}
