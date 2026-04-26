import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAuthed } from '@/lib/auth';
import { parseTags } from '@/lib/slug';

export const dynamic = 'force-dynamic';

function disabled() {
  return process.env.BUILD_TARGET === 'static';
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (disabled()) return NextResponse.json({ error: 'disabled' }, { status: 404 });
  if (!isAuthed()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const id = Number(params.id);
  const post = await prisma.post.findUnique({ where: { id }, include: { tags: true } });
  if (!post) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (disabled()) return NextResponse.json({ error: 'disabled' }, { status: 404 });
  if (!isAuthed()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const id = Number(params.id);
  const body = await req.json();
  const title = String(body.title ?? '').trim();
  const content = String(body.content ?? '');
  const excerpt = body.excerpt ? String(body.excerpt) : null;
  const published = body.published !== false;
  const tags = parseTags(String(body.tags ?? ''));
  const updated = await prisma.post.update({
    where: { id },
    data: {
      title,
      content,
      excerpt,
      published,
      tags: {
        set: [],
        connectOrCreate: tags.map((name) => ({ where: { name }, create: { name } })),
      },
    },
    include: { tags: true },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (disabled()) return NextResponse.json({ error: 'disabled' }, { status: 404 });
  if (!isAuthed()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const id = Number(params.id);
  await prisma.post.delete({ where: { id } });
  await prisma.tag.deleteMany({ where: { posts: { none: {} } } });
  return NextResponse.json({ ok: true });
}
