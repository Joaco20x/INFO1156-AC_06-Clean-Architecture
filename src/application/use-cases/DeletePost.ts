import type { PostRepository } from '@/domain/repositories';
import type { UseCase } from './UseCase';

interface DeletePostInput {
  id: string;
}

export class DeletePost implements UseCase<DeletePostInput, void> {
  constructor(private readonly postRepository: PostRepository) {}

  async execute({ id }: DeletePostInput): Promise<void> {
    return this.postRepository.delete(id);
  }
}
