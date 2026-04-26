'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [pw, setPw] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pw }),
        });
        setLoading(false);
        if (res.ok) router.refresh();
        else {
          const data = await res.json().catch(() => ({}));
          setErr(data?.error ?? '로그인 실패');
        }
      }}
      className="bg-panel border border-border rounded-xl p-4 space-y-3"
    >
      <input
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        placeholder="비밀번호"
        className="w-full bg-[#0f1115] border border-border rounded-lg px-3 py-2 text-sm"
      />
      {err && <p className="text-xs text-red-400">{err}</p>}
      <button
        disabled={loading || !pw}
        className="w-full px-3 py-2 rounded-lg bg-accent text-white text-sm disabled:opacity-50"
      >
        {loading ? '로그인 중…' : '로그인'}
      </button>
    </form>
  );
}
