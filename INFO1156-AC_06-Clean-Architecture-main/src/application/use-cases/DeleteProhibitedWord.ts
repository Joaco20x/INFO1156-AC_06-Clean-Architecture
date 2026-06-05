import type { ProhibitedWordRepository } from '@/domain/repositories';
import type { UseCase } from './UseCase';

interface DeleteProhibitedWordInput {
  id: string;
}

export class DeleteProhibitedWord implements UseCase<DeleteProhibitedWordInput, void> {
  constructor(private readonly prohibitedWordRepository: ProhibitedWordRepository) {}

  async execute({ id }: DeleteProhibitedWordInput): Promise<void> {
    return this.prohibitedWordRepository.delete(id);
  }
}
