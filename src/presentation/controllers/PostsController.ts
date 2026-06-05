import { Body, Controller, Get, Post, Query } from "@nestjs/common"

import {
    CreatePost,
    GetAllPosts,
    GetFeedPosts,
    type FeedMode,
} from "@/application/use-cases"
import type { PostFeed } from "@/domain/entities"
import { CreatePostDto, FeedQueryDto } from "@/presentation/dtos"

@Controller("api/posts")
export class PostsController {
    constructor(
        private readonly createPost: CreatePost,
        private readonly getAllPosts: GetAllPosts,
        private readonly getFeedPosts: GetFeedPosts,
    ) {}

    @Post()
    async create(@Body() body: CreatePostDto) {
        const payload = await this.createPost.execute({
            title: body.title,
            description: body.description,
            imageUrl: body.imageUrl,
            categoryId: body.categoryId ?? null,
        })

        return { ok: true, payload }
    }

    @Get()
    async findAll() {
        const items = await this.getAllPosts.execute()

        return { total: items.length, items }
    }

    @Get("feed")
    async getFeed(
        @Query() query: FeedQueryDto,
    ): Promise<{ mode: FeedMode; count: number; rows: PostFeed[] }> {
        return this.getFeedPosts.execute({
            categoryId: query.categoryId,
            mode: query.mode as FeedMode | undefined,
        })
    }
}
