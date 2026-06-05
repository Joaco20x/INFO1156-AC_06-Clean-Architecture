import type { PostFeed } from "@/domain/entities"
import type { PostRepository } from "@/domain/repositories"
import type { UseCase } from "./UseCase"

export type FeedMode = "latest" | "mostLiked" | "mostCommented" | "relevance"

interface GetFeedPostsInput {
    categoryId?: string
    mode?: FeedMode
}

interface GetFeedPostsOutput {
    mode: FeedMode
    count: number
    rows: PostFeed[]
}

const rank = (posts: PostFeed[], mode: FeedMode): PostFeed[] => {
    const sorted = [...posts]

    if (mode === "mostLiked") {
        return sorted.sort((a, b) => b.likesCount - a.likesCount)
    }
    if (mode === "mostCommented") {
        return sorted.sort((a, b) => b.commentsCount - a.commentsCount)
    }
    if (mode === "relevance") {
        return sorted.sort((a, b) => b.relevanceScore - a.relevanceScore)
    }
    // default: 'latest'
    return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export class GetFeedPosts implements UseCase<
    GetFeedPostsInput,
    GetFeedPostsOutput
> {
    constructor(private readonly postRepository: PostRepository) {}

    async execute({
        categoryId,
        mode = "latest",
    }: GetFeedPostsInput): Promise<GetFeedPostsOutput> {
        const posts = await this.postRepository.getFeed(categoryId)
        const rows = rank(posts, mode)

        return {
            mode,
            count: rows.length,
            rows,
        }
    }
}
