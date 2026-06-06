import { CategoryRepository } from '../../domain/repositories/CategoryRepository';
import { Category } from '../../domain/entities/Category';
import { prisma } from '../database/prisma';

export class CategoryRepositoryImpl implements CategoryRepository {
  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  async findAll(): Promise<Category[]> {
    return prisma.category.findMany();
  }

  async save(category: Omit<Category, 'id'>): Promise<Category> {
    return prisma.category.create({
      data: category,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }
}
