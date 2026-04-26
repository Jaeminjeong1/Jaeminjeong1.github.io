import { prisma } from './db';
import { extractWikilinks } from './wikilink';

export type GraphNode = {
  id: string;
  label: string;
  type: 'me' | 'tag' | 'post' | 'concept';
  href?: string;
  val?: number;
};

export type GraphLink = { source: string; target: string };

export type GraphData = { nodes: GraphNode[]; links: GraphLink[] };

const ME_ID = 'me';

export async function buildGraph(): Promise<GraphData> {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { tags: true },
  });
  const tagsAll = await prisma.tag.findMany({
    include: { _count: { select: { posts: true } } },
  });

  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const seen = new Set<string>();
  const add = (n: GraphNode) => {
    if (seen.has(n.id)) return;
    seen.add(n.id);
    nodes.push(n);
  };

  add({ id: ME_ID, label: '정재민', type: 'me', val: 12 });

  for (const t of tagsAll) {
    if (t._count.posts === 0) continue;
    const id = `tag:${t.name}`;
    add({
      id,
      label: `#${t.name}`,
      type: 'tag',
      href: `/tags/${encodeURIComponent(t.name)}`,
      val: 4 + t._count.posts,
    });
    links.push({ source: ME_ID, target: id });
  }

  for (const p of posts) {
    const id = `post:${p.slug}`;
    add({
      id,
      label: p.title,
      type: 'post',
      href: `/posts/${p.slug}`,
      val: 3,
    });
    for (const t of p.tags) {
      links.push({ source: `tag:${t.name}`, target: id });
    }
    const concepts = extractWikilinks(p.content);
    for (const c of concepts) {
      const cid = `concept:${c}`;
      add({
        id: cid,
        label: c,
        type: 'concept',
        href: `/concepts/${encodeURIComponent(c)}`,
        val: 2,
      });
      links.push({ source: id, target: cid });
    }
  }

  return { nodes, links };
}

export async function postsByConcept(name: string) {
  const all = await prisma.post.findMany({
    where: { published: true },
    include: { tags: true },
    orderBy: { createdAt: 'desc' },
  });
  return all
    .filter((p) => extractWikilinks(p.content).includes(name))
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      createdAt: p.createdAt.toISOString(),
      tags: p.tags.map((t) => ({ id: t.id, name: t.name })),
    }));
}

export async function listAllConcepts(): Promise<string[]> {
  const all = await prisma.post.findMany({ select: { content: true } });
  const set = new Set<string>();
  for (const p of all) for (const c of extractWikilinks(p.content)) set.add(c);
  return [...set];
}
