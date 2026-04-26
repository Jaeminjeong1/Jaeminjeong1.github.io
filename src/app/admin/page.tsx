import Link from 'next/link';
import { isAuthed } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { blockOnStatic } from '@/lib/static-guard';
import { LoginForm } from './login-form';
import { DeleteButton } from './delete-button';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  blockOnStatic();
  if (!isAuthed()) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <h1 className="text-xl font-semibold text-white mb-4">어드민 로그인</h1>
        <LoginForm />
        <p className="text-xs text-muted mt-4">
          .env.local의 <code className="text-accent">ADMIN_PASSWORD</code> 값을 입력하세요.
        </p>
      </div>
    );
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { tags: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">어드민 · 글 관리 ({posts.length})</h1>
        <Link
          href="/admin/new"
          className="px-3 py-1.5 rounded-lg bg-accent text-white text-sm hover:bg-accent/80"
        >
          + 새 글
        </Link>
      </div>
      <div className="grid gap-3">
        {posts.map((p) => (
          <div
            key={p.id}
            className="bg-panel border border-border rounded-xl p-4 flex items-center justify-between"
          >
            <div>
              <Link href={`/posts/${p.slug}`} className="font-semibold text-white hover:text-accent">
                {p.title}
              </Link>
              <div className="flex items-center gap-2 text-xs text-muted mt-1">
                <span>{new Date(p.createdAt).toLocaleDateString('ko-KR')}</span>
                <span>· {p.tags.map((t) => `#${t.name}`).join(' ')}</span>
                {!p.published && <span className="text-yellow-500">· 비공개</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/edit/${p.id}`}
                className="px-3 py-1 rounded-lg bg-[#1f2330] text-sm hover:bg-[#2a2f3f]"
              >
                편집
              </Link>
              <DeleteButton id={p.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
