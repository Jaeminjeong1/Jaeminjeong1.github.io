import slugify from 'slugify';

export function makeSlug(title: string): string {
  const base = slugify(title, { lower: true, strict: true, locale: 'ko' });
  if (base) return base;
  return Buffer.from(title).toString('hex').slice(0, 16);
}

export function parseTags(input: string): string[] {
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
