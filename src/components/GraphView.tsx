'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { GraphData, GraphNode } from '@/lib/graph';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

const COLORS = {
  me: '#ff6b6b',
  tag: '#4dabf7',
  post: '#51cf66',
  concept: '#adb5bd',
} as const;

export function GraphView({ data }: { data: GraphData }) {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });

  useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setSize({ w: r.width, h: Math.max(500, window.innerHeight - 220) });
    });
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="relative bg-panel border border-border rounded-2xl overflow-hidden">
      <Legend />
      <ForceGraph2D
        graphData={data as never}
        width={size.w}
        height={size.h}
        backgroundColor="#171a21"
        nodeRelSize={5}
        nodeVal={((n: GraphNode) => n.val ?? 3) as never}
        nodeColor={((n: GraphNode) => COLORS[n.type]) as never}
        nodeLabel={((n: GraphNode) => n.label) as never}
        linkColor={() => 'rgba(140,150,170,0.35)'}
        linkWidth={1}
        cooldownTicks={120}
        onNodeClick={((n: GraphNode) => {
          if (n.href) router.push(n.href);
        }) as never}
        nodeCanvasObject={((node: GraphNode & { x: number; y: number }, ctx: CanvasRenderingContext2D, scale: number) => {
          const r = Math.sqrt(node.val ?? 3) * 4;
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
          ctx.fillStyle = COLORS[node.type];
          ctx.fill();
          if (scale > 1.2 || node.type === 'me') {
            ctx.font = `${Math.max(10, 12 / Math.max(scale, 1)) * 1.2}px Pretendard, sans-serif`;
            ctx.fillStyle = '#e7eaf2';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(node.label, node.x, node.y + r + 2);
          }
        }) as never}
      />
    </div>
  );
}

function Legend() {
  const items: { label: string; color: string }[] = [
    { label: 'Me', color: COLORS.me },
    { label: '태그', color: COLORS.tag },
    { label: '글', color: COLORS.post },
    { label: '개념', color: COLORS.concept },
  ];
  return (
    <div className="absolute top-3 left-3 z-10 bg-[#0f1115]/80 border border-border rounded-lg px-3 py-2 text-xs flex gap-3">
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full" style={{ background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}
