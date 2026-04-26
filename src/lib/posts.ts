import { prisma } from './db';
import type { PostListItem, PostDetail } from '@/types/post';

function serialize<T extends { createdAt: Date; updatedAt?: Date }>(p: T) {
  return {
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt ? p.updatedAt.toISOString() : undefined,
  };
}

export async function listPosts(): Promise<PostListItem[]> {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { tags: true },
  });
  return posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    createdAt: p.createdAt.toISOString(),
    tags: p.tags.map((t) => ({ id: t.id, name: t.name })),
  }));
}

export async function getPost(slug: string): Promise<PostDetail | null> {
  const p = await prisma.post.findUnique({
    where: { slug },
    include: { tags: true },
  });
  if (!p || !p.published) return null;
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    tags: p.tags.map((t) => ({ id: t.id, name: t.name })),
  };
}

export async function listTags(): Promise<{ name: string; count: number }[]> {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: 'asc' },
  });
  return tags
    .map((t) => ({ name: t.name, count: t._count.posts }))
    .filter((t) => t.count > 0);
}

export async function postsByTag(name: string): Promise<PostListItem[]> {
  const posts = await prisma.post.findMany({
    where: { published: true, tags: { some: { name } } },
    orderBy: { createdAt: 'desc' },
    include: { tags: true },
  });
  return posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    createdAt: p.createdAt.toISOString(),
    tags: p.tags.map((t) => ({ id: t.id, name: t.name })),
  }));
}
