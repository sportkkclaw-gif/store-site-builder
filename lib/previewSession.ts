import type { SiteData } from '@/types/site';
import { migrateSiteData, saveSiteData, STORAGE_KEY } from './storage';
import { getCurrentSkinFamily, getCurrentTemplateId, normalizeCurrentTemplateFields } from './getCurrentTemplate';

export type PreviewSession = {
  sessionId: string;
  createdAt: number;
  siteData: SiteData;
  templateId: string;
  skinFamily: string;
  source: 'builder';
};

export const PREVIEW_SESSION_KEY_PREFIX = 'store-site-builder-preview-session:';

function storageKey(sessionId: string) {
  return `${PREVIEW_SESSION_KEY_PREFIX}${sessionId}`;
}

export function createPreviewSession(siteData: SiteData): PreviewSession {
  const normalized = normalizeCurrentTemplateFields(migrateSiteData(siteData));
  const templateId = getCurrentTemplateId(normalized);
  const skinFamily = getCurrentSkinFamily(normalized);
  const sessionId = `${Date.now().toString(36)}-${templateId}-${Math.random().toString(36).slice(2, 10)}`;
  return { sessionId, createdAt: Date.now(), siteData: normalized, templateId, skinFamily, source: 'builder' };
}

export function savePreviewSession(session: PreviewSession): void {
  if (typeof window === 'undefined') return;
  const payload = JSON.stringify(session);
  window.sessionStorage.setItem(storageKey(session.sessionId), payload);
  window.localStorage.setItem(storageKey(session.sessionId), payload);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session.siteData));
  saveSiteData(session.siteData);
}

export function loadPreviewSession(sessionId: string): PreviewSession | null {
  if (typeof window === 'undefined' || !sessionId) return null;
  const raw = window.sessionStorage.getItem(storageKey(sessionId)) || window.localStorage.getItem(storageKey(sessionId));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PreviewSession;
    const siteData = normalizeCurrentTemplateFields(migrateSiteData(parsed.siteData));
    return {
      ...parsed,
      siteData,
      templateId: getCurrentTemplateId(siteData),
      skinFamily: getCurrentSkinFamily(siteData),
      source: 'builder',
    };
  } catch {
    return null;
  }
}

export { getCurrentTemplateId, getCurrentSkinFamily } from './getCurrentTemplate';
