import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { TagBadge } from '@/components/TagBadge';
import { getPost, listPosts } from '@/lib/posts';

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await listPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(decodeURIComponent(params.slug));
  return { title: post ? `${post.title} | 정재민의 블로그` : '글을 찾을 수 없습니다' };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(decodeURIComponent(params.slug));
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto">
      <Link href="/posts" className="text-xs text-muted hover:text-accent">
        ← 글 목록
      </Link>
      <header className="mt-4 mb-8">
        <h1 className="text-3xl font-bold text-white">{post.title}</h1>
        <div className="flex items-center gap-3 mt-3 text-xs text-muted">
          <time>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</time>
          {post.updatedAt && post.updatedAt !== post.createdAt && (
            <span>· 수정 {new Date(post.updatedAt).toLocaleDateString('ko-KR')}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {post.tags.map((t) => (
            <TagBadge key={t.id} name={t.name} />
          ))}
        </div>
      </header>
      <MarkdownRenderer source={post.content} />
    </article>
  );
}
