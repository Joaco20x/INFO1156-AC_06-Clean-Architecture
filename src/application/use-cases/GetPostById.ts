import type { Post } from "@/domain/entities"
import type { PostRepository } from "@/domain/repositories"
import type { UseCase } from "./UseCase"

interface GetPostByIdInput {
    id: string
}

export class GetPostById implements UseCase<GetPostByIdInput, Post | null> {
    constructor(private readonly postRepository: PostRepository) {}

    async execute({ id }: GetPostByIdInput): Promise<Post | null> {
        return this.postRepository.findById(id)
    }
}
