import type { Post } from "@/domain/entities"
import type { PostRepository } from "@/domain/repositories"
import type { UseCase } from "./UseCase"

export class GetAllPosts implements UseCase<void, Post[]> {
    constructor(private readonly postRepository: PostRepository) {}

    async execute(): Promise<Post[]> {
        return this.postRepository.findAll()
    }
}
