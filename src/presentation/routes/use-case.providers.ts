import type { Provider } from "@nestjs/common"

import {
    AddLike,
    AddProhibitedWord,
    CreateComment,
    CreatePost,
    DeleteProhibitedWord,
    GetAllCategories,
    GetAllPosts,
    GetAllProhibitedWords,
    GetCommentsByPostId,
    GetFeedPosts,
} from "@/application/use-cases"
import * as deps from "@/infrastructure/dependencies"

export const postUseCaseProviders: Provider[] = [
    { provide: CreatePost, useValue: deps.createPost },
    { provide: GetAllPosts, useValue: deps.getAllPosts },
    { provide: GetFeedPosts, useValue: deps.getFeedPosts },
]

export const commentUseCaseProviders: Provider[] = [
    { provide: GetCommentsByPostId, useValue: deps.getCommentsByPostId },
    { provide: CreateComment, useValue: deps.createComment },
]

export const likeUseCaseProviders: Provider[] = [
    { provide: AddLike, useValue: deps.addLike },
]

export const categoryUseCaseProviders: Provider[] = [
    { provide: GetAllCategories, useValue: deps.getAllCategories },
]

export const moderationUseCaseProviders: Provider[] = [
    { provide: GetAllProhibitedWords, useValue: deps.getAllProhibitedWords },
    { provide: AddProhibitedWord, useValue: deps.addProhibitedWord },
    { provide: DeleteProhibitedWord, useValue: deps.deleteProhibitedWord },
]
