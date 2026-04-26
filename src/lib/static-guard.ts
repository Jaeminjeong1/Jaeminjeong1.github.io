import { notFound } from 'next/navigation';

export function blockOnStatic() {
  if (process.env.BUILD_TARGET === 'static') notFound();
}
