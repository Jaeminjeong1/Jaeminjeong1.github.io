import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: '정재민의 블로그',
  description: '예측 가능한 시스템에 대한 기록',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-bg text-[#e7eaf2] font-sans">
        <header className="border-b border-border bg-panel/60 backdrop-blur sticky top-0 z-30">
          <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold text-white">정재민의 블로그</Link>
            <div className="flex items-center gap-5 text-sm text-muted">
              <Link href="/posts" className="hover:text-white">글</Link>
              <Link href="/tags" className="hover:text-white">태그</Link>
              <Link href="/graph" className="hover:text-white">그래프</Link>
            </div>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
        <footer className="border-t border-border mt-16">
          <div className="max-w-5xl mx-auto px-6 py-6 text-xs text-muted flex justify-between">
            <span>© {new Date().getFullYear()} 정재민</span>
            <span>built with Next.js</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
