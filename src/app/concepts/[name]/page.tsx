import Link from 'next/link';
import { PostCard } from '@/components/PostCard';
import { listAllConcepts, postsByConcept } from '@/lib/graph';

export const dynamicParams = false;

export async function generateStaticParams() {
  const concepts = await listAllConcepts();
  return concepts.map((name) => ({ name }));
}

export async function generateMetadata({ params }: { params: { name: string } }) {
  return { title: `${decodeURIComponent(params.name)} | 개념 | 정재민의 블로그` };
}

export default async function ConceptPage({ params }: { params: { name: string } }) {
  const name = decodeURIComponent(params.name);
  const posts = await postsByConcept(name);
  return (
    <div>
      <Link href="/graph" className="text-xs text-muted hover:text-accent">← 그래프로 돌아가기</Link>
      <h1 className="text-2xl font-semibold text-white mt-3">
        <span className="text-muted">개념 ·</span> {name}
      </h1>
      <p className="text-sm text-muted mt-2 mb-6">
        본문에서 <code className="text-accent">[[{name}]]</code>로 언급된 글 ({posts.length})
      </p>
      {posts.length === 0 ? (
        <p className="text-sm text-muted">아직 이 개념을 언급한 글이 없습니다.</p>
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
