import type { ProhibitedWord } from '../entities/ProhibitedWord';

export interface ProhibitedWordRepository {
  findAll(): Promise<ProhibitedWord[]>;
  save(word: Omit<ProhibitedWord, 'id' | 'createdAt'>): Promise<ProhibitedWord>;
  delete(id: string): Promise<void>;
}
