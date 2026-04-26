import { TagBadge } from '@/components/TagBadge';
import { listTags } from '@/lib/posts';

export const dynamic = 'force-static';
export const metadata = { title: '태그 | 정재민의 블로그' };

export default async function TagsPage() {
  const tags = await listTags();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">태그 ({tags.length})</h1>
      {tags.length === 0 ? (
        <p className="text-sm text-muted">아직 태그가 없습니다.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <TagBadge key={t.name} name={t.name} count={t.count} />
          ))}
        </div>
      )}
    </div>
  );
}
