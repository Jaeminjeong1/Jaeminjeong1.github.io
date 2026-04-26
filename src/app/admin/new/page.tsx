import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/auth';
import { blockOnStatic } from '@/lib/static-guard';
import { PostForm } from '../post-form';

export const dynamic = 'force-dynamic';

export default function NewPostPage() {
  blockOnStatic();
  if (!isAuthed()) redirect('/admin');

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin" className="text-xs text-muted hover:text-accent">← 어드민</Link>
      <h1 className="text-2xl font-semibold text-white mt-3 mb-6">새 글 작성</h1>
      <PostForm
        initial={{ title: '', excerpt: '', content: '', tags: '', published: true }}
      />
    </div>
  );
}
