import { GraphView } from '@/components/GraphView';
import { buildGraph } from '@/lib/graph';

export const dynamic = 'force-static';
export const metadata = { title: '그래프뷰 | 정재민의 블로그' };

export default async function GraphPage() {
  const data = await buildGraph();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-2">그래프뷰</h1>
      <p className="text-sm text-muted mb-5">
        Me를 중심으로 태그·글·개념을 잇는 지식 그래프입니다. 노드를 클릭하면 해당 페이지로 이동합니다.
      </p>
      <GraphView data={data} />
    </div>
  );
}
