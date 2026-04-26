import Link from 'next/link';
import { PostCard } from '@/components/PostCard';
import { listTags, postsByTag } from '@/lib/posts';

export const dynamicParams = false;

export async function generateStaticParams() {
  const tags = await listTags();
  return tags.map((t) => ({ tag: t.name }));
}

export async function generateMetadata({ params }: { params: { tag: string } }) {
  return { title: `#${decodeURIComponent(params.tag)} | 정재민의 블로그` };
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const posts = await postsByTag(tag);
  return (
    <div>
      <Link href="/tags" className="text-xs text-muted hover:text-accent">← 태그 목록</Link>
      <h1 className="text-2xl font-semibold text-white mt-3 mb-6">
        #{tag} <span className="text-muted text-base">({posts.length})</span>
      </h1>
      {posts.length === 0 ? (
        <p className="text-sm text-muted">이 태그에 해당하는 글이 없습니다.</p>
      ) : (
        <div className="grid gap-4">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
