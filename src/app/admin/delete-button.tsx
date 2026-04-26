'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      disabled={loading}
      onClick={async () => {
        if (!confirm('정말 삭제할까요? 되돌릴 수 없습니다.')) return;
        setLoading(true);
        const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
        setLoading(false);
        if (res.ok) router.refresh();
        else alert('삭제 실패');
      }}
      className="px-3 py-1 rounded-lg bg-red-500/15 text-red-400 text-sm hover:bg-red-500/25 disabled:opacity-50"
    >
      {loading ? '삭제 중…' : '삭제'}
    </button>
  );
}
