'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { wikilinkToMarkdown } from '@/lib/wikilink';

type Initial = {
  id?: number;
  title: string;
  excerpt: string;
  content: string;
  tags: string;
  published: boolean;
};

export function PostForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setErr(null);
        const url = initial.id ? `/api/posts/${initial.id}` : '/api/posts';
        const method = initial.id ? 'PUT' : 'POST';
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        setLoading(false);
        if (res.ok) {
          router.push('/admin');
          router.refresh();
        } else {
          const data = await res.json().catch(() => ({}));
          setErr(data?.error ?? '저장 실패');
        }
      }}
      className="space-y-4"
    >
      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="제목"
        className="w-full bg-panel border border-border rounded-lg px-4 py-2.5 text-lg"
      />
      <input
        value={form.excerpt}
        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        placeholder="요약 (선택)"
        className="w-full bg-panel border border-border rounded-lg px-4 py-2 text-sm"
      />
      <input
        value={form.tags}
        onChange={(e) => setForm({ ...form, tags: e.target.value })}
        placeholder="태그 (쉼표로 구분: 백엔드, 안정성)"
        className="w-full bg-panel border border-border rounded-lg px-4 py-2 text-sm"
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          공개
        </label>
        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          className="px-3 py-1 rounded-lg bg-[#1f2330] text-sm hover:bg-[#2a2f3f]"
        >
          {preview ? '에디터' : '미리보기'}
        </button>
      </div>

      {preview ? (
        <div className="bg-panel border border-border rounded-lg p-5 min-h-[400px] prose-blog">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {wikilinkToMarkdown(form.content)}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="본문 (Markdown 지원, [[개념]] 형식으로 위키링크 가능)"
          rows={20}
          className="w-full bg-panel border border-border rounded-lg px-4 py-3 font-mono text-sm leading-6 resize-y"
        />
      )}

      {err && <p className="text-sm text-red-400">{err}</p>}

      <div className="flex gap-2">
        <button
          disabled={loading || !form.title || !form.content}
          className="px-4 py-2 rounded-lg bg-accent text-white text-sm disabled:opacity-50"
        >
          {loading ? '저장 중…' : initial.id ? '수정 저장' : '발행'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="px-4 py-2 rounded-lg bg-[#1f2330] text-sm"
        >
          취소
        </button>
      </div>
    </form>
  );
}
