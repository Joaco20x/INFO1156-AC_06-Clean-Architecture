import type { ProhibitedWord } from "@/domain/entities"
import type { ProhibitedWordRepository } from "@/domain/repositories"
import type { UseCase } from "./UseCase"

interface AddProhibitedWordInput {
    word: string
    category: string
}

export class AddProhibitedWord implements UseCase<
    AddProhibitedWordInput,
    ProhibitedWord
> {
    constructor(
        private readonly prohibitedWordRepository: ProhibitedWordRepository,
    ) {}

    async execute(input: AddProhibitedWordInput): Promise<ProhibitedWord> {
        return this.prohibitedWordRepository.save({
            word: input.word,
            category: input.category,
        })
    }
}
