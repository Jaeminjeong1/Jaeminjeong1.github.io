import { NextResponse } from 'next/server';
import { checkPassword, setAuthCookie, clearAuthCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (process.env.BUILD_TARGET === 'static') {
    return NextResponse.json({ error: 'disabled' }, { status: 404 });
  }
  const body = await req.json().catch(() => null);
  const password = body?.password;
  if (typeof password !== 'string' || !checkPassword(password)) {
    return NextResponse.json({ ok: false, error: '비밀번호가 올바르지 않습니다' }, { status: 401 });
  }
  setAuthCookie(password);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  clearAuthCookie();
  return NextResponse.json({ ok: true });
}
