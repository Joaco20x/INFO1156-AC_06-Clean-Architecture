import type { Like } from "@/domain/entities"
import type { LikeRepository } from "@/domain/repositories"
import type { PostRepository } from "@/domain/repositories"
import { DomainError, NotFoundError } from "@/domain/errors"
import type { UseCase } from "./UseCase"

interface AddLikeInput {
    postId: string
    reactionType?: string
    weight?: number
    source?: string
}

export class InvalidLikeWeightError extends DomainError {
    constructor() {
        super("El peso debe ser al menos 1")
        this.name = "InvalidLikeWeightError"
    }
}

export class AddLike implements UseCase<AddLikeInput, Like> {
    constructor(
        private readonly likeRepository: LikeRepository,
        private readonly postRepository: PostRepository,
    ) {}

    async execute(input: AddLikeInput): Promise<Like> {
        const post = await this.postRepository.findById(input.postId)
        if (!post) {
            throw new NotFoundError("Post", input.postId)
        }

        const weight = input.weight ?? 1
        if (weight < 1) {
            throw new InvalidLikeWeightError()
        }

        return this.likeRepository.save({
            postId: input.postId,
            reactionType: input.reactionType ?? "like",
            weight,
            source: input.source ?? "likes-module",
        })
    }
}
