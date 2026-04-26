'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { GraphData, GraphNode, GraphLink } from '@/lib/graph';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

const COLORS = {
  me: '#f43f5e',      // rose-500
  tag: '#fb923c',     // orange-400
  post: '#fda4af',    // rose-300
  concept: '#a1a1aa', // gray
} as const;

export function GraphView({ data }: { data: GraphData }) {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [hovered, setHovered] = useState<string | null>(null);

  // 호버된 노드의 인접 노드 집합
  const neighbors = useMemo(() => {
    const n = new Map<string, Set<string>>();
    for (const node of data.nodes) n.set(node.id, new Set([node.id]));
    for (const l of data.links) {
      const s = typeof l.source === 'string' ? l.source : (l.source as { id: string }).id;
      const t = typeof l.target === 'string' ? l.target : (l.target as { id: string }).id;
      n.get(s)?.add(t);
      n.get(t)?.add(s);
    }
    return n;
  }, [data]);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setSize({ w: r.width, h: Math.max(540, window.innerHeight - 240) });
    });
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative glass-card rounded-2xl overflow-hidden"
      style={{ background: 'rgba(10,2,2,0.45)' }}
    >
      <Legend />
      <ForceGraph2D
        graphData={data as never}
        width={size.w}
        height={size.h}
        backgroundColor="rgba(0,0,0,0)"
        nodeRelSize={5}
        nodeVal={((n: GraphNode) => n.val ?? 3) as never}
        nodeLabel={((n: GraphNode) => n.label) as never}
        linkColor={
          ((l: GraphLink) => {
            if (!hovered) return 'rgba(244, 63, 94, 0.18)';
            const s = typeof l.source === 'string' ? l.source : (l.source as { id: string }).id;
            const t = typeof l.target === 'string' ? l.target : (l.target as { id: string }).id;
            const active = s === hovered || t === hovered;
            return active ? 'rgba(244, 63, 94, 0.85)' : 'rgba(244, 63, 94, 0.05)';
          }) as never
        }
        linkWidth={
          ((l: GraphLink) => {
            if (!hovered) return 1;
            const s = typeof l.source === 'string' ? l.source : (l.source as { id: string }).id;
            const t = typeof l.target === 'string' ? l.target : (l.target as { id: string }).id;
            return s === hovered || t === hovered ? 2.5 : 0.5;
          }) as never
        }
        cooldownTicks={150}
        onNodeHover={((n: GraphNode | null) => setHovered(n?.id ?? null)) as never}
        onNodeClick={((n: GraphNode) => {
          if (n.href) router.push(n.href);
        }) as never}
        nodeCanvasObject={
          ((node: GraphNode & { x: number; y: number }, ctx: CanvasRenderingContext2D, scale: number) => {
            const r = Math.sqrt(node.val ?? 3) * 4;
            const isHovered = hovered === node.id;
            const isNeighbor = hovered ? neighbors.get(hovered)?.has(node.id) ?? false : true;
            const dim = hovered && !isNeighbor;
            const alpha = dim ? 0.12 : 1;

            // 발광 효과
            if (isHovered || node.type === 'me') {
              ctx.beginPath();
              ctx.arc(node.x, node.y, r * 1.8, 0, 2 * Math.PI);
              const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 1.8);
              glow.addColorStop(0, 'rgba(244,63,94,0.45)');
              glow.addColorStop(1, 'rgba(244,63,94,0)');
              ctx.fillStyle = glow;
              ctx.fill();
            }

            ctx.beginPath();
            ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
            ctx.fillStyle = withAlpha(COLORS[node.type], alpha);
            ctx.fill();
            ctx.strokeStyle = `rgba(255,255,255,${0.15 * alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            const showLabel = isHovered || node.type === 'me' || scale > 1.4;
            if (showLabel) {
              const fontSize = Math.max(11, 13 / Math.max(scale * 0.7, 1));
              ctx.font = `${isHovered ? 'bold ' : ''}${fontSize}px Pretendard, sans-serif`;
              ctx.fillStyle = isHovered
                ? '#ffffff'
                : `rgba(231,234,242,${0.85 * alpha})`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'top';
              ctx.shadowColor = 'rgba(0,0,0,0.9)';
              ctx.shadowBlur = 4;
              ctx.fillText(node.label, node.x, node.y + r + 3);
              ctx.shadowBlur = 0;
            }
          }) as never
        }
      />
      <div className="absolute bottom-3 right-3 text-[10px] text-muted/70 glass-soft rounded-md px-2 py-1">
        드래그·휠로 이동·확대 · 노드 클릭 시 이동
      </div>
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
    <div className="absolute top-3 left-3 z-10 glass-soft rounded-lg px-3 py-2 text-xs flex gap-3">
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full" style={{ background: it.color, boxShadow: `0 0 8px ${it.color}` }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
