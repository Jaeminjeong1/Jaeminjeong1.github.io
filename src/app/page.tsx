import Link from 'next/link';
import { ProfileCard } from '@/components/ProfileCard';
import { PostCard } from '@/components/PostCard';
import { TagBadge } from '@/components/TagBadge';
import { listPosts, listTags } from '@/lib/posts';

export const dynamic = 'force-static';

export default async function HomePage() {
  const [posts, tags] = await Promise.all([listPosts(), listTags()]);
  const recent = posts.slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8">
      <ProfileCard />

      <div>
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">최근 글</h2>
            <Link href="/posts" className="text-sm text-muted hover:text-accent">
              전체 보기 →
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-muted bg-panel border border-border rounded-xl p-6">
              아직 작성된 글이 없습니다.
            </p>
          ) : (
            <div className="grid gap-4">
              {recent.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          )}
        </section>

        {tags.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-white mb-4">태그</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <TagBadge key={t.name} name={t.name} count={t.count} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          <Link
            href="/graph"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25"
          >
            🕸 그래프뷰로 둘러보기
          </Link>
        </section>
      </div>
    </div>
  );
}
