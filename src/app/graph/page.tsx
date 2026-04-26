import { GraphView } from '@/components/GraphView';
import { buildGraph } from '@/lib/graph';

export const dynamic = 'force-static';
export const metadata = { title: '학습 마인드맵 | 정재민의 블로그' };

export default async function GraphPage() {
  const data = await buildGraph();
  const counts = data.nodes.reduce<Record<string, number>>((acc, n) => {
    acc[n.type] = (acc[n.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-3xl font-bold text-white">
          <span className="gradient-text">학습 마인드맵</span>
        </h1>
        <p className="text-sm text-muted mt-2">
          나(Me)를 중심으로 태그·글·개념이 신경망처럼 연결된 지식 그래프입니다.
          노드를 클릭하면 해당 페이지로 이동하고, 호버하면 연결된 노드만 강조됩니다.
        </p>
        <div className="flex gap-2 mt-3 text-xs text-muted">
          <span className="glass-soft rounded-md px-2 py-0.5">태그 {counts.tag ?? 0}</span>
          <span className="glass-soft rounded-md px-2 py-0.5">글 {counts.post ?? 0}</span>
          <span className="glass-soft rounded-md px-2 py-0.5">개념 {counts.concept ?? 0}</span>
        </div>
      </div>
      <GraphView data={data} />
    </div>
  );
}
