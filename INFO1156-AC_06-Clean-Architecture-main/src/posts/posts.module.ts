import { Module } from "@nestjs/common"
import { FeedRankingStrategyFactory } from "@/posts/feed-ranking.strategy"
import { ModerationAdapter } from "@/posts/moderation/moderation-adapter"
import { ModerationModule } from "@/moderation/moderation.module"
import { PostsController } from "@/posts/posts.controller"
import { PostsService } from "@/posts/posts.service"

@Module({
    imports: [ModerationModule],
    controllers: [PostsController],
    providers: [PostsService, FeedRankingStrategyFactory, ModerationAdapter],
    exports: [PostsService],
})
export class PostsModule {}
