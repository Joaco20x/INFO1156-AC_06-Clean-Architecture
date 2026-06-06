import { CategoryRepositoryImpl } from './repositories/CategoryRepositoryImpl';
import { CommentRepositoryImpl } from './repositories/CommentRepositoryImpl';
import { LikeRepositoryImpl } from './repositories/LikeRepositoryImpl';
import { PostRepositoryImpl } from './repositories/PostRepositoryImpl';
import { ProhibitedWordRepositoryImpl } from './repositories/ProhibitedWordRepositoryImpl';

import {
  GetAllPosts,
  GetPostById,
  GetFeedPosts,
  CreatePost,
  DeletePost,
  GetCommentsByPostId,
  CreateComment,
  DeleteComment,
  AddLike,
  GetAllCategories,
  GetAllProhibitedWords,
  AddProhibitedWord,
  DeleteProhibitedWord,
} from '../application/use-cases';

// Repositorios
export const categoryRepository = new CategoryRepositoryImpl();
export const commentRepository = new CommentRepositoryImpl();
export const likeRepository = new LikeRepositoryImpl();
export const postRepository = new PostRepositoryImpl();
export const prohibitedWordRepository = new ProhibitedWordRepositoryImpl();

// Casos de uso - Posts
export const getAllPosts = new GetAllPosts(postRepository);
export const getPostById = new GetPostById(postRepository);
export const getFeedPosts = new GetFeedPosts(postRepository);
export const createPost = new CreatePost(postRepository, prohibitedWordRepository);
export const deletePost = new DeletePost(postRepository);

// Casos de uso - Comments
export const getCommentsByPostId = new GetCommentsByPostId(commentRepository);
export const createComment = new CreateComment(commentRepository, postRepository, prohibitedWordRepository);
export const deleteComment = new DeleteComment(commentRepository);

// Casos de uso - Likes
export const addLike = new AddLike(likeRepository, postRepository);

// Casos de uso - Categories
export const getAllCategories = new GetAllCategories(categoryRepository);

// Casos de uso - Moderation
export const getAllProhibitedWords = new GetAllProhibitedWords(prohibitedWordRepository);
export const addProhibitedWord = new AddProhibitedWord(prohibitedWordRepository);
export const deleteProhibitedWord = new DeleteProhibitedWord(prohibitedWordRepository);
