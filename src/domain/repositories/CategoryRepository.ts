import type { Category } from '../entities/Category';

export interface CategoryRepository {
  findById(id: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  save(category: Omit<Category, 'id'>): Promise<Category>;
  delete(id: string): Promise<void>;
}
