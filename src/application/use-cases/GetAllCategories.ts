import type { Category } from '@/domain/entities';
import type { CategoryRepository } from '@/domain/repositories';
import type { UseCase } from './UseCase';

export class GetAllCategories implements UseCase<void, Category[]> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}
