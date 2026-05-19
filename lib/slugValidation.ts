export type RequestedSlugValidation = {
  ok: boolean;
  normalized: string;
  errors: string[];
};

const ERR_CHARS = '網址名稱只能使用小寫英文、數字與連字號。';
const ERR_LENGTH = '網址名稱長度需為 3 到 32 個字元。';
const ERR_NUMERIC = '網址名稱不可只有數字。';
const ERR_EDGE_DASH = '網址名稱不可用連字號開頭或結尾。';

export function normalizeRequestedSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function validateRequestedSlug(slug: string): RequestedSlugValidation {
  const raw = slug.trim().toLowerCase().replace(/\s+/g, '-');
  const normalized = normalizeRequestedSlug(slug);
  const errors: string[] = [];

  if (!normalized || /[^a-z0-9-]/.test(raw)) errors.push(ERR_CHARS);
  if (normalized.length < 3 || normalized.length > 32) errors.push(ERR_LENGTH);
  if (/^\d+$/.test(normalized)) errors.push(ERR_NUMERIC);
  if (/^-|-$/.test(raw)) errors.push(ERR_EDGE_DASH);

  return { ok: errors.length === 0, normalized, errors };
}
