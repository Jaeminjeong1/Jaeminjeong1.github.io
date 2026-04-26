import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_session';
const SECRET = process.env.ADMIN_PASSWORD ?? '';

export function isAuthed(): boolean {
  if (!SECRET) return false;
  const c = cookies().get(COOKIE_NAME);
  return c?.value === SECRET;
}

export function setAuthCookie(value: string) {
  cookies().set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearAuthCookie() {
  cookies().delete(COOKIE_NAME);
}

export function checkPassword(input: string): boolean {
  return SECRET.length > 0 && input === SECRET;
}
