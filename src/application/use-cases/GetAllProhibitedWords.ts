import type { ProhibitedWord } from "@/domain/entities"
import type { ProhibitedWordRepository } from "@/domain/repositories"
import type { UseCase } from "./UseCase"

export class GetAllProhibitedWords implements UseCase<void, ProhibitedWord[]> {
    constructor(
        private readonly prohibitedWordRepository: ProhibitedWordRepository,
    ) {}

    async execute(): Promise<ProhibitedWord[]> {
        return this.prohibitedWordRepository.findAll()
    }
}
