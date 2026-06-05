import type { Comment } from '../entities/Comment';

export interface CommentRepository {
  findById(id: string): Promise<Comment | null>;
  findByPostId(postId: string): Promise<Comment[]>;
  save(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment>;
  delete(id: string): Promise<void>;
}
