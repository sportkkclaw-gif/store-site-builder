import type { SiteData } from '@/types/site';

export type PublishReadinessStatus = 'ready' | 'warning' | 'blocked';

export interface PublishReadinessResult {
  score: number;
  status: PublishReadinessStatus;
  requiredIssues: string[];
  recommendedIssues: string[];
}

function productCount(data: SiteData) {
  return data.menu.categories.reduce((sum, category) => sum + category.items.length, 0);
}

function hasAnyProductImage(data: SiteData) {
  const productImageIds = new Set(data.menu.categories.flatMap(category => category.items.map(item => item.imageId).filter(Boolean)) as string[]);
  return data.media.some(asset => asset.type === 'product' || productImageIds.has(asset.id));
}

export function getPublishReadiness(data: SiteData, opts?: { mobilePreviewSeen?: boolean }): PublishReadinessResult {
  const requiredChecks: [boolean, string][] = [
    [Boolean(data.store.name.trim()), '店名尚未填寫'],
    [Boolean(data.store.tagline.trim() || data.hero.title.trim()), '品牌標語尚未填寫'],
    [Boolean(data.store.phone.trim() || data.links.line?.trim()), '電話或 LINE 至少需要一個'],
    [Boolean(data.store.address.trim() || data.links.googleMap?.trim()), '地址或 Google Maps 至少需要一個'],
    [productCount(data) >= 3, '菜單至少需要 3 個商品'],
    [Boolean(data.hero.ctaUrl.trim() || data.links.line || data.links.orderForm || data.links.reservation || data.links.ubereats || data.links.foodpanda), '至少需要一個 CTA 或聯絡連結'],
  ];
  const recommendedChecks: [boolean, string][] = [
    [Boolean(data.seo.title.trim()), '建議填寫 SEO title'],
    [Boolean(data.seo.description.trim()), '建議填寫 SEO description'],
    [Boolean(data.hero.imageId || data.media.some(asset => asset.type === 'hero')), '建議加入 Hero 圖'],
    [hasAnyProductImage(data), '建議至少加入一張商品圖'],
    [data.faq.length >= 2, '建議 FAQ 至少 2 題'],
    [Boolean(opts?.mobilePreviewSeen), '建議先查看手機預覽'],
  ];
  const requiredIssues = requiredChecks.filter(([ok]) => !ok).map(([, issue]) => issue);
  const recommendedIssues = recommendedChecks.filter(([ok]) => !ok).map(([, issue]) => issue);
  const requiredPass = requiredChecks.length - requiredIssues.length;
  const recommendedPass = recommendedChecks.length - recommendedIssues.length;
  const score = Math.round(((requiredPass * 2 + recommendedPass) / (requiredChecks.length * 2 + recommendedChecks.length)) * 100);
  const status: PublishReadinessStatus = requiredIssues.length > 0 ? 'blocked' : recommendedIssues.length > 0 ? 'warning' : 'ready';
  return { score, status, requiredIssues, recommendedIssues };
}

export function publishReadinessLabel(status: PublishReadinessStatus) {
  if (status === 'ready') return '可以發布';
  if (status === 'warning') return '建議補充';
  return '缺少必要資料';
}
