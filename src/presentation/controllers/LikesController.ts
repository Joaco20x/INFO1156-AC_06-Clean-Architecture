import { Body, Controller, Param, Post } from "@nestjs/common"

import { AddLike } from "@/application/use-cases"
import { AddLikeDto } from "@/presentation/dtos"

@Controller("api/posts/:id/likes")
export class LikesController {
    constructor(private readonly addLike: AddLike) {}

    @Post()
    async create(@Param("id") postId: string, @Body() body: AddLikeDto) {
        return this.addLike.execute({
            postId,
            reactionType: body.reactionType,
            weight: body.weight,
        })
    }
}
