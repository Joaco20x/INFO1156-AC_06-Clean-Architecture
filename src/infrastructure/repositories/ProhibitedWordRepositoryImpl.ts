import { ProhibitedWordRepository } from "../../domain/repositories/ProhibitedWordRepository"
import { ProhibitedWord } from "../../domain/entities/ProhibitedWord"
import { prisma } from "../database/prisma"

export class ProhibitedWordRepositoryImpl implements ProhibitedWordRepository {
    async findAll(): Promise<ProhibitedWord[]> {
        return prisma.prohibitedWord.findMany()
    }

    async save(
        word: Omit<ProhibitedWord, "id" | "createdAt">,
    ): Promise<ProhibitedWord> {
        return prisma.prohibitedWord.create({
            data: word,
        })
    }

    async delete(id: string): Promise<void> {
        await prisma.prohibitedWord.delete({ where: { id } })
    }
}
