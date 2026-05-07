import type { SiteData } from '@/types/site';

export const esc = (s?: string | number) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
export const mediaById = (data: SiteData, id?: string) => data.media.find(m => m.id === id);
export const imageSrc = (data: SiteData, id?: string) => mediaById(data, id)?.dataUrl || placeholderSvg(data.theme.primaryColor);
export function placeholderSvg(color = '#14B8A6') {
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="600" fill="#fff7ed"/><circle cx="680" cy="150" r="120" fill="${color}" opacity=".22"/><rect x="160" y="170" width="300" height="250" rx="36" fill="${color}" opacity=".75"/><text x="450" y="480" text-anchor="middle" font-family="Arial" font-size="42" fill="#0f172a">StoreSite Builder</text></svg>`)}`;
}
export function dataUrlToFile(dataUrl: string) {
  const [head, data] = dataUrl.split(',');
  const mime = head.match(/data:(.*?);/)?.[1] || 'application/octet-stream';
  const ext = mime.split('/')[1]?.replace('jpeg', 'jpg') || 'bin';
  return { mime, ext, buffer: data, base64: true };
}
