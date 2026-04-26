import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { isAuthed } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { blockOnStatic } from '@/lib/static-guard';
import { PostForm } from '../../post-form';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  blockOnStatic();
  if (!isAuthed()) redirect('/admin');

  const id = Number(params.id);
  const post = await prisma.post.findUnique({ where: { id }, include: { tags: true } });
  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin" className="text-xs text-muted hover:text-accent">← 어드민</Link>
      <h1 className="text-2xl font-semibold text-white mt-3 mb-6">글 편집</h1>
      <PostForm
        initial={{
          id: post.id,
          title: post.title,
          excerpt: post.excerpt ?? '',
          content: post.content,
          tags: post.tags.map((t) => t.name).join(', '),
          published: post.published,
        }}
      />
    </div>
  );
}
