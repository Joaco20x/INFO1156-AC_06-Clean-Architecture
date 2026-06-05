import type { Post } from '@/domain/entities';
import type { PostRepository } from '@/domain/repositories';
import type { ProhibitedWordRepository } from '@/domain/repositories';
import { DomainError } from '@/domain/errors';
import type { UseCase } from './UseCase';

interface CreatePostInput {
  title: string;
  description: string;
  imageUrl: string;
  categoryId?: string | null;
}

export class ModerationBlockedError extends DomainError {
  constructor(
    public readonly reason: string,
    public readonly category?: string,
  ) {
    super(reason);
    this.name = 'ModerationBlockedError';
  }
}

const buildFuzzyRegex = (word: string): RegExp => {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(escaped.split('').join('[^a-zA-Z0-9]*'), 'gi');
};

export class CreatePost implements UseCase<CreatePostInput, Post> {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly prohibitedWordRepository: ProhibitedWordRepository,
  ) {}

  async execute(input: CreatePostInput): Promise<Post> {
    const words = await this.prohibitedWordRepository.findAll();
    const text = `${input.title} ${input.description}`;

    for (const pw of words) {
      if (buildFuzzyRegex(pw.word).test(text)) {
        throw new ModerationBlockedError(
          `Contiene palabra prohibida: "${pw.word}"`,
          pw.category,
        );
      }
    }

    return this.postRepository.save({
      title: input.title,
      description: input.description,
      imageUrl: input.imageUrl,
      categoryId: input.categoryId ?? null,
    });
  }
}
