import type { CommentRepository } from '@/domain/repositories';
import type { UseCase } from './UseCase';

interface DeleteCommentInput {
  id: string;
}

export class DeleteComment implements UseCase<DeleteCommentInput, void> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute({ id }: DeleteCommentInput): Promise<void> {
    return this.commentRepository.delete(id);
  }
}
