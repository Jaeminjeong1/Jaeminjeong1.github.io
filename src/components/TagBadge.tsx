import Link from 'next/link';

export function TagBadge({ name, count }: { name: string; count?: number }) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(name)}`}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#1f2330] text-muted hover:text-accent hover:bg-[#2a2f3f]"
    >
      <span>#{name}</span>
      {typeof count === 'number' && <span className="text-[10px] opacity-70">{count}</span>}
    </Link>
  );
}
