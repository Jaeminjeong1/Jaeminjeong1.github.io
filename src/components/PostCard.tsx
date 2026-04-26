import Link from 'next/link';
import { TagBadge } from './TagBadge';
import type { PostListItem } from '@/types/post';

export function PostCard({ post }: { post: PostListItem }) {
  return (
    <article className="glass-card rounded-2xl p-6 hover:-translate-y-1 hover:border-accent/40 transition-all group">
      <Link href={`/posts/${post.slug}`} className="block">
        {post.tags[0] && (
          <div className="text-[11px] mb-2 font-semibold tracking-wider text-accent uppercase">
            {post.tags[0].name}
          </div>
        )}
        <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-sm text-gray-400 mt-2 line-clamp-3 leading-6">{post.excerpt}</p>
        )}
      </Link>
      <div className="flex items-center justify-between mt-4">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((t) => (
            <TagBadge key={t.id} name={t.name} />
          ))}
        </div>
        <time className="text-xs text-gray-500">
          {new Date(post.createdAt).toLocaleDateString('ko-KR')}
        </time>
      </div>
    </article>
  );
}
