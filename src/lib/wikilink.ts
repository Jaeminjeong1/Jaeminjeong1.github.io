const WIKILINK_RE = /\[\[([^\[\]\|]+?)(?:\|([^\[\]]+))?\]\]/g;

export function extractWikilinks(content: string): string[] {
  const out = new Set<string>();
  let m: RegExpExecArray | null;
  WIKILINK_RE.lastIndex = 0;
  while ((m = WIKILINK_RE.exec(content)) !== null) {
    out.add(m[1].trim());
  }
  return [...out];
}

export function wikilinkToMarkdown(content: string): string {
  return content.replace(WIKILINK_RE, (_full, target: string, label?: string) => {
    const t = target.trim();
    const text = (label ?? t).trim();
    const slug = encodeURIComponent(t);
    return `[${text}](/concepts/${slug})`;
  });
}
