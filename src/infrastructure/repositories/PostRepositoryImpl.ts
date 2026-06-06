import { PostRepository } from '../../domain/repositories/PostRepository';
import { Post, PostFeed } from '../../domain/entities/Post';
import { prisma } from '../database/prisma';

export class PostRepositoryImpl implements PostRepository {
  async findById(id: string): Promise<Post | null> {
    return prisma.post.findUnique({ where: { id } });
  }

  async findAll(): Promise<Post[]> {
    return prisma.post.findMany();
  }

  async getFeed(categoryId?: string): Promise<PostFeed[]> {
    const posts = await prisma.post.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: {
        category: true,
        _count: {
          select: { likes: true, comments: true },
        },
        likes: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return posts.map(post => {
      const relevanceScore = post.likes.reduce((acc, like) => acc + like.weight, 0);

      return {
        id: post.id,
        title: post.title,
        description: post.description,
        imageUrl: post.imageUrl,
        categoryId: post.categoryId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        category: post.category?.name || null,
        likesCount: post._count.likes,
        commentsCount: post._count.comments,
        relevanceScore,
      };
    });
  }

  async save(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    return prisma.post.create({
      data: post,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.post.delete({ where: { id } });
  }
}
