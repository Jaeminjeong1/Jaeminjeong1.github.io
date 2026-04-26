export type PostListItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  createdAt: string;
  tags: { id: number; name: string }[];
};

export type PostDetail = PostListItem & {
  content: string;
  updatedAt: string;
};
