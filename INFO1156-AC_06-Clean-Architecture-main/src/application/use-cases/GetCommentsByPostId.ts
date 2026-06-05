import type { Comment } from '@/domain/entities';
import type { CommentRepository } from '@/domain/repositories';
import type { PostRepository } from '@/domain/repositories';
import { NotFoundError } from '@/domain/errors';
import type { UseCase } from './UseCase';

interface GetCommentsByPostIdInput {
  postId: string;
}

interface GetCommentsByPostIdOutput {
  total_comments: number;
  comments: Comment[];
}

export class GetCommentsByPostId
  implements UseCase<GetCommentsByPostIdInput, GetCommentsByPostIdOutput>
{
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async execute({ postId }: GetCommentsByPostIdInput): Promise<GetCommentsByPostIdOutput> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundError('Post', postId);
    }

    const comments = await this.commentRepository.findByPostId(postId);
    return {
      total_comments: comments.length,
      comments,
    };
  }
}
