import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { wikilinkToMarkdown } from '@/lib/wikilink';

export function MarkdownRenderer({ source }: { source: string }) {
  const transformed = wikilinkToMarkdown(source);
  return (
    <div className="prose-blog">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => {
            const isWiki = typeof href === 'string' && href.startsWith('/concepts/');
            const isInternal = typeof href === 'string' && href.startsWith('/');
            return (
              <a
                href={href}
                className={isWiki ? 'wikilink' : undefined}
                target={isInternal ? undefined : '_blank'}
                rel={isInternal ? undefined : 'noreferrer'}
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {transformed}
      </ReactMarkdown>
    </div>
  );
}
