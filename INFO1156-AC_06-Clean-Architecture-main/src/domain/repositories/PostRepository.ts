import type { Post, PostFeed } from '../entities/Post';

export interface PostRepository {
  findById(id: string): Promise<Post | null>;
  findAll(): Promise<Post[]>;
  getFeed(categoryId?: string): Promise<PostFeed[]>;
  save(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post>;
  delete(id: string): Promise<void>;
}
