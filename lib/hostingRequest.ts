import type { SiteData } from '@/types/site';
import type { PublishReadinessResult } from './publishReadiness';
import { checkPublishReadiness } from './publishReadiness';
import { normalizeRequestedSlug, validateRequestedSlug } from './slugValidation';

export type HostingRequestForm = {
  contactName: string;
  email: string;
  lineId: string;
  storeName: string;
  requestedSlug: string;
  hasCustomDomain: boolean;
  customDomain?: string;
  notes: string;
};

export type HostingRequestValidation = {
  ok: boolean;
  errors: string[];
  normalizedSlug: string;
};

const hasText = (value?: string) => Boolean(value && value.trim().length > 0);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateHostingRequestForm(form: HostingRequestForm): HostingRequestValidation {
  const errors: string[] = [];
  const name = form.contactName.trim();
  const email = form.email.trim();
  const lineId = form.lineId.trim();
  const storeName = form.storeName.trim();
  const slug = validateRequestedSlug(form.requestedSlug);

  if (name.length < 2) errors.push('請填寫聯絡人姓名。');
  if (!email && !lineId) errors.push('請至少填寫 Email 或 LINE ID，方便我們聯絡你。');
  if (email && !emailPattern.test(email)) errors.push('Email 格式不正確。');
  if (lineId && lineId.length < 3) errors.push('LINE ID 至少需要 3 個字元。');
  if (!storeName) errors.push('請填寫店家名稱。');
  errors.push(...slug.errors);

  return { ok: errors.length === 0, errors: Array.from(new Set(errors)), normalizedSlug: slug.normalized };
}

export function summarizeSite(data?: SiteData) {
  const productCount = data?.menu.categories.reduce((sum, category) => sum + category.items.length, 0) || 0;
  return {
    menuCategoryCount: data?.menu.categories.length || 0,
    productCount,
    hasLine: hasText(data?.links.line),
    hasGoogleMaps: hasText(data?.links.googleMap),
    hasHeroImage: hasText(data?.hero.imageId) || data?.hero.imageMode === 'template',
    hasSeo: hasText(data?.seo.title) && hasText(data?.seo.description),
  };
}

export function buildHostingRequest(form: HostingRequestForm, siteData?: SiteData, readiness?: PublishReadinessResult) {
  const activeReadiness = readiness || (siteData ? checkPublishReadiness(siteData) : { score: 0, status: 'blocked' as const, requiredIssues: [], recommendedIssues: [] });
  const normalized = normalizeRequestedSlug(form.requestedSlug);
  const storeName = form.storeName.trim() || siteData?.store.name || '';
  return {
    type: 'denmeipian-hosting-request',
    version: '0.3.1',
    generatedAt: new Date().toISOString(),
    contact: {
      name: form.contactName.trim(),
      email: form.email.trim(),
      lineId: form.lineId.trim(),
    },
    store: {
      name: storeName,
      requestedSlug: normalized,
      hasCustomDomain: form.hasCustomDomain,
      customDomain: form.customDomain?.trim() || '',
    },
    site: {
      templateId: siteData?.galleryTemplateId || siteData?.visual?.selectedTemplateId || siteData?.template || '',
      industry: siteData?.industry || '',
      summary: siteData ? `${siteData.store.name}｜${siteData.store.tagline}｜${siteData.menu.categories.length} 個菜單分類` : '首頁代管方案諮詢',
      ...summarizeSite(siteData),
    },
    publishReadiness: {
      score: activeReadiness.score,
      status: activeReadiness.status,
      requiredIssues: activeReadiness.requiredIssues,
      recommendedIssues: activeReadiness.recommendedIssues,
    },
    deployment: {
      requestedSubdomain: normalized,
      requestedUrlPreview: normalized ? `https://${normalized}.denmeipian.app` : '',
      hasCustomDomain: form.hasCustomDomain,
      customDomain: form.customDomain?.trim() || '',
    },
    notes: form.notes,
  };
}

export function defaultHostingRequestForm(siteData?: SiteData): HostingRequestForm {
  return {
    contactName: '',
    email: '',
    lineId: '',
    storeName: siteData?.store.name || '',
    requestedSlug: normalizeRequestedSlug(siteData?.seo.slug || siteData?.store.name || ''),
    hasCustomDomain: false,
    customDomain: '',
    notes: '',
  };
}
