const hardBreakTitles: Record<string, string[]> = {
  '每天一杯，日常更美好': ['每天一杯，', '日常更美好'],
};

function normalizeTitle(title: string) {
  return title.replace(/\s+/g, ' ').trim();
}

function splitByPunctuation(title: string): string[] | null {
  const punct = title.match(/^(.{2,8}[，、｜・:：-])(.{2,12})$/);
  if (punct) return [punct[1], punct[2]];
  const comma = title.indexOf('，');
  if (comma >= 2 && comma <= 8 && title.length - comma - 1 >= 2) {
    return [title.slice(0, comma + 1), title.slice(comma + 1)];
  }
  return null;
}

function splitBalanced(title: string): string[] {
  if (title.length <= 8) return [title];
  if (title.length <= 14) {
    const mid = Math.ceil(title.length / 2);
    return [title.slice(0, mid), title.slice(mid)];
  }
  const target = Math.ceil(title.length / 3);
  return [title.slice(0, target), title.slice(target, target * 2), title.slice(target * 2)];
}

export function getHeroTitleLines(rawTitle?: string, fallback = ''): string[] {
  const title = normalizeTitle(rawTitle || fallback || '');
  if (!title) return [];
  if (hardBreakTitles[title]) return hardBreakTitles[title];
  const punctuation = splitByPunctuation(title);
  const lines = punctuation || splitBalanced(title);
  return lines
    .map(line => line.trim())
    .filter(Boolean)
    .slice(0, 4);
}

export function renderHeroTitleLinesHtml(rawTitle?: string, fallback = ''): string {
  return getHeroTitleLines(rawTitle, fallback)
    .map(line => `<span class="hero-title-line">${escapeHtml(line)}</span>`)
    .join('');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
