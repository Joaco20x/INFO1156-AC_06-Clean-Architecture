export interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostFeed extends Post {
  category: string | null;
  likesCount: number;
  commentsCount: number;
  relevanceScore: number;
}
