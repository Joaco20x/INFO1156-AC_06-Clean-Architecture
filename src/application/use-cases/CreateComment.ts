import type { Comment } from "@/domain/entities"
import type { CommentRepository } from "@/domain/repositories"
import type { PostRepository } from "@/domain/repositories"
import type { ProhibitedWordRepository } from "@/domain/repositories"
import { NotFoundError } from "@/domain/errors"
import type { UseCase } from "./UseCase"
import { ModerationBlockedError } from "./CreatePost"

interface CreateCommentInput {
    postId: string
    content: string
    source?: string
}

export { ModerationBlockedError }

const buildFuzzyRegex = (word: string): RegExp => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    return new RegExp(escaped.split("").join("[^a-zA-Z0-9]*"), "gi")
}

export class CreateComment implements UseCase<CreateCommentInput, Comment> {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly postRepository: PostRepository,
        private readonly prohibitedWordRepository: ProhibitedWordRepository,
    ) {}

    async execute(input: CreateCommentInput): Promise<Comment> {
        const post = await this.postRepository.findById(input.postId)
        if (!post) {
            throw new NotFoundError("Post", input.postId)
        }

        const words = await this.prohibitedWordRepository.findAll()
        for (const pw of words) {
            if (buildFuzzyRegex(pw.word).test(input.content)) {
                throw new ModerationBlockedError(
                    `Contiene palabra prohibida: "${pw.word}"`,
                    pw.category,
                )
            }
        }

        return this.commentRepository.save({
            postId: input.postId,
            content: input.content,
            source: input.source ?? "comments-module",
        })
    }
}
