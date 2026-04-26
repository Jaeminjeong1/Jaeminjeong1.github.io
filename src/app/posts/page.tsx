import { PostCard } from '@/components/PostCard';
import { listPosts } from '@/lib/posts';

export const dynamic = 'force-static';
export const metadata = { title: '글 목록 | 정재민의 블로그' };

export default async function PostsPage() {
  const posts = await listPosts();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">전체 글 ({posts.length})</h1>
      {posts.length === 0 ? (
        <p className="text-sm text-muted">아직 작성된 글이 없습니다.</p>
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
