import { Module } from "@nestjs/common"

import { CommentsController } from "@/presentation/controllers/CommentsController"
import { LikesController } from "@/presentation/controllers/LikesController"
import { PostsController } from "@/presentation/controllers/PostsController"

import {
    commentUseCaseProviders,
    likeUseCaseProviders,
    postUseCaseProviders,
} from "./use-case.providers"

@Module({
    controllers: [PostsController, CommentsController, LikesController],
    providers: [
        ...postUseCaseProviders,
        ...commentUseCaseProviders,
        ...likeUseCaseProviders,
    ],
})
export class PostsRoutesModule {}
