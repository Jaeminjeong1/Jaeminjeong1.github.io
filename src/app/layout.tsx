import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { NeuralBackground } from '@/components/NeuralBackground';

export const metadata: Metadata = {
  title: '정재민의 블로그',
  description: '예측 가능한 시스템에 대한 기록 — 신경망처럼 뻗어가는 지식의 숲',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen text-[#e7eaf2] font-sans">
        <NeuralBackground />

        <header className="glass sticky top-0 z-40">
          <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="size-2.5 rounded-full bg-accent shadow-glow-rose group-hover:scale-125 transition" />
              <span className="font-bold tracking-wider gradient-text">JAEMIN.BLOG</span>
            </Link>
            <div className="flex items-center gap-6 text-sm font-medium text-muted">
              <Link href="/posts" className="hover:text-white transition">글</Link>
              <Link href="/tags" className="hover:text-white transition">태그</Link>
              <Link href="/graph" className="hover:text-white transition">학습 마인드맵</Link>
            </div>
          </nav>
        </header>

        <main className="relative z-10 max-w-6xl mx-auto px-6 py-10">{children}</main>

        <footer className="relative z-10 border-t border-border mt-16">
          <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-muted flex justify-between">
            <span>© {new Date().getFullYear()} 정재민</span>
            <span>built with Next.js · Three.js</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
