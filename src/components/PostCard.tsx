import Link from 'next/link';
import { TagBadge } from './TagBadge';
import type { PostListItem } from '@/types/post';

export function PostCard({ post }: { post: PostListItem }) {
  return (
    <article className="bg-panel border border-border rounded-xl p-5 hover:border-accent/50 transition">
      <Link href={`/posts/${post.slug}`} className="block">
        <h3 className="text-lg font-semibold text-white">{post.title}</h3>
        {post.excerpt && (
          <p className="text-sm text-muted mt-2 line-clamp-2">{post.excerpt}</p>
        )}
      </Link>
      <div className="flex items-center justify-between mt-4">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <TagBadge key={t.id} name={t.name} />
          ))}
        </div>
        <time className="text-xs text-muted">
          {new Date(post.createdAt).toLocaleDateString('ko-KR')}
        </time>
      </div>
    </article>
  );
}
