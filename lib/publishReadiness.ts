import type { SiteData } from '@/types/site';

export interface PublishReadinessResult {
  score: number;
  status: 'ready' | 'warning' | 'blocked';
  requiredIssues: string[];
  recommendedIssues: string[];
}

const hasText = (value?: string) => Boolean(value && value.trim().length > 0);
const productCount = (data: SiteData) => data.menu.categories.reduce((sum, category) => sum + category.items.length, 0);
const ctaLinks = (data: SiteData) => [data.hero.ctaUrl, data.links.line, data.links.googleMap, data.links.ubereats, data.links.foodpanda, data.links.orderForm, data.links.reservation].filter(hasText);

export function checkPublishReadiness(data: SiteData): PublishReadinessResult {
  const requiredIssues: string[] = [];
  const recommendedIssues: string[] = [];

  if (!hasText(data.store.name)) requiredIssues.push('請填寫店名。');
  if (!hasText(data.store.tagline)) requiredIssues.push('請填寫品牌標語。');
  if (!hasText(data.store.phone) && !hasText(data.links.line)) requiredIssues.push('請填寫電話或 LINE');
  if (!hasText(data.store.address) && !hasText(data.links.googleMap)) requiredIssues.push('請填寫地址或 Google Maps');
  if (productCount(data) < 3) requiredIssues.push('菜單至少需要 3 個商品。');
  if (ctaLinks(data).length < 1) requiredIssues.push('至少需要一個 CTA / 聯絡 / 外送連結。');

  if (!hasText(data.seo.title)) recommendedIssues.push('建議補 SEO title。');
  if (!hasText(data.seo.description)) recommendedIssues.push('建議補 SEO description。');
  if (!hasText(data.hero.imageId)) recommendedIssues.push('建議設定 Hero 圖或套用模板主視覺。');
  if (!data.media.some(asset => asset.type === 'product')) recommendedIssues.push('建議至少上傳一張商品圖。');
  if (data.faq.length < 2) recommendedIssues.push('建議 FAQ 至少 2 題。');
  recommendedIssues.push('建議發布前查看手機預覽 390 / 375 / 320。');

  const requiredTotal = 6;
  const recommendedTotal = 6;
  const requiredPassed = requiredTotal - requiredIssues.length;
  const recommendedPassed = recommendedTotal - recommendedIssues.length;
  const score = Math.max(0, Math.min(100, Math.round((requiredPassed / requiredTotal) * 70 + (recommendedPassed / recommendedTotal) * 30)));
  const status: PublishReadinessResult['status'] = requiredIssues.length > 0 ? 'blocked' : recommendedIssues.length > 0 ? 'warning' : 'ready';

  return { score, status, requiredIssues, recommendedIssues };
}
