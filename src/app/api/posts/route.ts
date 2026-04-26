import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAuthed } from '@/lib/auth';
import { makeSlug, parseTags } from '@/lib/slug';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (process.env.BUILD_TARGET === 'static') {
    return NextResponse.json({ error: 'disabled' }, { status: 404 });
  }
  if (!isAuthed()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { tags: true },
  });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  if (process.env.BUILD_TARGET === 'static') {
    return NextResponse.json({ error: 'disabled' }, { status: 404 });
  }
  if (!isAuthed()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json();
  const title = String(body.title ?? '').trim();
  const content = String(body.content ?? '');
  const excerpt = body.excerpt ? String(body.excerpt) : null;
  const published = body.published !== false;
  const tagsInput = String(body.tags ?? '');
  if (!title || !content) {
    return NextResponse.json({ error: '제목과 본문은 필수입니다' }, { status: 400 });
  }
  const tags = parseTags(tagsInput);
  let slug = body.slug ? String(body.slug) : makeSlug(title);
  let n = 1;
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${makeSlug(title)}-${++n}`;
  }
  const created = await prisma.post.create({
    data: {
      slug,
      title,
      content,
      excerpt,
      published,
      tags: {
        connectOrCreate: tags.map((name) => ({ where: { name }, create: { name } })),
      },
    },
    include: { tags: true },
  });
  return NextResponse.json(created);
}
