import { CommentRepository } from '../../domain/repositories/CommentRepository';
import { Comment } from '../../domain/entities/Comment';
import { prisma } from '../database/prisma';

export class CommentRepositoryImpl implements CommentRepository {
  async findById(id: string): Promise<Comment | null> {
    return prisma.comment.findUnique({ where: { id } });
  }

  async findByPostId(postId: string): Promise<Comment[]> {
    return prisma.comment.findMany({ where: { postId } });
  }

  async save(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    return prisma.comment.create({
      data: comment,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.comment.delete({ where: { id } });
  }
}
