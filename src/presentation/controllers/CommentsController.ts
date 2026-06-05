import { Body, Controller, Get, Param, Post } from "@nestjs/common"

import { CreateComment, GetCommentsByPostId } from "@/application/use-cases"
import type { Comment } from "@/domain/entities"
import { CreateCommentDto } from "@/presentation/dtos"

@Controller("api/posts/:id/comments")
export class CommentsController {
    constructor(
        private readonly getCommentsByPostId: GetCommentsByPostId,
        private readonly createComment: CreateComment,
    ) {}

    @Get()
    async list(
        @Param("id") postId: string,
    ): Promise<{ total_comments: number; comments: Comment[] }> {
        return this.getCommentsByPostId.execute({ postId })
    }

    @Post()
    async create(@Param("id") postId: string, @Body() body: CreateCommentDto) {
        return this.createComment.execute({
            postId,
            content: body.content,
        })
    }
}
