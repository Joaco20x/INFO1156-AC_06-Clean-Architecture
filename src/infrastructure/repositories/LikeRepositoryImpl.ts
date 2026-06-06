import { LikeRepository } from '../../domain/repositories/LikeRepository';
import { Like } from '../../domain/entities/Like';
import { prisma } from '../database/prisma';

export class LikeRepositoryImpl implements LikeRepository {
  async findByPostId(postId: string): Promise<Like[]> {
    return prisma.like.findMany({ where: { postId } });
  }

  async save(like: Omit<Like, 'id' | 'createdAt'>): Promise<Like> {
    return prisma.like.create({
      data: like,
    });
  }
}
