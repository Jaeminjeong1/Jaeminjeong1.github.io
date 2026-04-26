import Link from 'next/link';
import { ProfileCard } from '@/components/ProfileCard';
import { PostCard } from '@/components/PostCard';
import { TagBadge } from '@/components/TagBadge';
import { listPosts, listTags } from '@/lib/posts';

export const dynamic = 'force-static';

export default async function HomePage() {
  const [posts, tags] = await Promise.all([listPosts(), listTags()]);
  const recent = posts.slice(0, 6);

  return (
    <div className="space-y-16">
      <section className="pt-8">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight max-w-3xl">
          나의 생각이
          <br />
          <span className="gradient-text">신경망처럼 뻗어가는 곳</span>
        </h1>
        <p className="text-gray-300 text-lg leading-relaxed mt-6 max-w-2xl">
          예측 가능한 시스템과 안정적인 백엔드를 고민하며, 배우고 경험한 모든 것을
          하나의 유기적인 지식 그래프로 엮어내는 공간입니다.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/graph"
            className="px-5 py-2.5 rounded-full bg-accent/15 hover:bg-accent/25 border border-accent/40 text-accent font-semibold transition shadow-glow-rose"
          >
            학습 마인드맵 탐색
          </Link>
          <Link
            href="/posts"
            className="px-5 py-2.5 rounded-full glass-card text-white/80 hover:text-white transition"
          >
            전체 글 보기
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8">
        <ProfileCard />

        <div className="space-y-12">
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-white">
                <span className="gradient-text">최근</span> 자라난 생각들
              </h2>
              <Link href="/posts" className="text-sm text-muted hover:text-accent">
                전체 보기 →
              </Link>
            </div>
            {recent.length === 0 ? (
              <p className="text-sm text-muted glass-card rounded-xl p-6">
                아직 작성된 글이 없습니다.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {recent.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            )}
          </section>

          {tags.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-5">태그</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <TagBadge key={t.name} name={t.name} count={t.count} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
