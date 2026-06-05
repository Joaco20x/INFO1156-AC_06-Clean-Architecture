import type { Like } from '../entities/Like';

export interface LikeRepository {
  findByPostId(postId: string): Promise<Like[]>;
  save(like: Omit<Like, 'id' | 'createdAt'>): Promise<Like>;
}
