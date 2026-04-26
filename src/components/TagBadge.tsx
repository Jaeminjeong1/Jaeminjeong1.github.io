import Link from 'next/link';

export function TagBadge({ name, count }: { name: string; count?: number }) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(name)}`}
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs glass-soft text-muted hover:text-accent hover:border-accent/40 transition"
    >
      <span>#{name}</span>
      {typeof count === 'number' && <span className="text-[10px] opacity-70">{count}</span>}
    </Link>
  );
}
