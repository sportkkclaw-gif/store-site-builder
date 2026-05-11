import type { SiteData } from '@/types/site';
import { migrateSiteData, saveSiteData, STORAGE_KEY } from './storage';
import { getTemplateById } from './templateCatalog';
import {
  getCurrentSkinFamily,
  getCurrentTemplateId,
  normalizeCurrentTemplateFields,
  setCurrentTemplateId,
} from './getCurrentTemplate';

export type PreviewMode = 'desktop' | 'mobile';
export type PreviewSessionDataSource = 'sessionStorage' | 'localStorage-session' | 'preview-current' | 'builder-data';

export type PreviewSession = {
  sessionId: string;
  createdAt: number;
  expiresAt: number;
  source: 'builder';
  siteData: SiteData;
  templateId: string;
  skinFamily: string;
  mode: PreviewMode;
  viewport: number;
};

export type LoadedPreviewSession = {
  session: PreviewSession;
  dataSource: PreviewSessionDataSource;
};

export const PREVIEW_SESSION_PREFIX = 'store-site-builder-preview-session:';
export const PREVIEW_SESSION_KEY_PREFIX = PREVIEW_SESSION_PREFIX;
export const PREVIEW_CURRENT_KEY = 'store-site-builder-preview-current';
export const BUILDER_DATA_KEY = STORAGE_KEY;

const PREVIEW_TTL_MS = 1000 * 60 * 60 * 24;

function storageKey(sessionId: string) {
  return `${PREVIEW_SESSION_PREFIX}${sessionId}`;
}

function canUseBrowserStorage() {
  return typeof window !== 'undefined';
}

function safeSet(storage: Storage | undefined, key: string, value: string) {
  try {
    storage?.setItem(key, value);
  } catch {}
}

function safeGet(storage: Storage | undefined, key: string): string | null {
  try {
    return storage?.getItem(key) || null;
  } catch {
    return null;
  }
}

function safeKeys(storage: Storage | undefined): string[] {
  try {
    if (!storage) return [];
    return Array.from({ length: storage.length }, (_, index) => storage.key(index)).filter(Boolean) as string[];
  } catch {
    return [];
  }
}

function parseSession(raw: string | null): PreviewSession | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<PreviewSession>;
    if (!parsed.siteData) return null;
    const siteData = normalizeCurrentTemplateFields(migrateSiteData(parsed.siteData));
    const templateId = getCurrentTemplateId(siteData);
    const skinFamily = getCurrentSkinFamily(siteData);
    const createdAt = typeof parsed.createdAt === 'number' ? parsed.createdAt : Date.now();
    return {
      sessionId: String(parsed.sessionId || `fallback-${createdAt}`),
      createdAt,
      expiresAt: typeof parsed.expiresAt === 'number' ? parsed.expiresAt : createdAt + PREVIEW_TTL_MS,
      source: 'builder',
      siteData,
      templateId,
      skinFamily,
      mode: parsed.mode === 'desktop' || parsed.mode === 'mobile' ? parsed.mode : 'mobile',
      viewport: typeof parsed.viewport === 'number' ? parsed.viewport : 390,
    };
  } catch {
    return null;
  }
}

function sessionFromSiteData(siteData: SiteData, dataSource: PreviewSessionDataSource): LoadedPreviewSession {
  const normalized = normalizeCurrentTemplateFields(migrateSiteData(siteData));
  const templateId = getCurrentTemplateId(normalized);
  const createdAt = Date.now();
  return {
    dataSource,
    session: {
      sessionId: dataSource,
      createdAt,
      expiresAt: createdAt + PREVIEW_TTL_MS,
      source: 'builder',
      siteData: normalized,
      templateId,
      skinFamily: getCurrentSkinFamily(normalized),
      mode: 'mobile',
      viewport: 390,
    },
  };
}

function loadBuilderData(): LoadedPreviewSession | null {
  if (!canUseBrowserStorage()) return null;
  const raw = safeGet(window.localStorage, BUILDER_DATA_KEY);
  if (!raw) return null;
  try {
    return sessionFromSiteData(JSON.parse(raw) as SiteData, 'builder-data');
  } catch {
    return null;
  }
}

function loadLatestStoredSession(storage: Storage | undefined, dataSource: PreviewSessionDataSource): LoadedPreviewSession | null {
  const sessions = safeKeys(storage)
    .filter((key) => key.startsWith(PREVIEW_SESSION_PREFIX))
    .map((key) => parseSession(safeGet(storage, key)))
    .filter(Boolean) as PreviewSession[];
  sessions.sort((a, b) => b.createdAt - a.createdAt);
  return sessions[0] ? { session: sessions[0], dataSource } : null;
}

export function createPreviewSession(input: SiteData | {
  siteData: SiteData;
  mode?: PreviewMode;
  viewport?: number;
  templateId?: string;
  skinFamily?: string;
}): PreviewSession {
  const siteData = 'siteData' in input ? input.siteData : input;
  const normalized = normalizeCurrentTemplateFields(migrateSiteData(siteData));
  const templateId = ('siteData' in input && input.templateId) || getCurrentTemplateId(normalized);
  const repairedData = getTemplateById(templateId) ? setCurrentTemplateId(normalized, templateId) : normalized;
  const skinFamily = ('siteData' in input && input.skinFamily) || getCurrentSkinFamily(repairedData);
  const createdAt = Date.now();
  const sessionId = `${createdAt.toString(36)}-${templateId}-${Math.random().toString(36).slice(2, 10)}`;
  return {
    sessionId,
    createdAt,
    expiresAt: createdAt + PREVIEW_TTL_MS,
    source: 'builder',
    siteData: repairedData,
    templateId,
    skinFamily,
    mode: 'siteData' in input && input.mode ? input.mode : 'mobile',
    viewport: 'siteData' in input && input.viewport ? input.viewport : 390,
  };
}

export function savePreviewSession(session: PreviewSession): void {
  if (!canUseBrowserStorage()) return;
  const normalizedSession: PreviewSession = {
    ...session,
    siteData: normalizeCurrentTemplateFields(migrateSiteData(session.siteData)),
    templateId: getCurrentTemplateId(session.siteData),
    skinFamily: getCurrentSkinFamily(session.siteData),
  };
  const payload = JSON.stringify(normalizedSession);
  safeSet(window.sessionStorage, storageKey(normalizedSession.sessionId), payload);
  safeSet(window.localStorage, storageKey(normalizedSession.sessionId), payload);
  safeSet(window.localStorage, PREVIEW_CURRENT_KEY, payload);
  safeSet(window.localStorage, BUILDER_DATA_KEY, JSON.stringify(normalizedSession.siteData));
  saveSiteData(normalizedSession.siteData);
}

export function loadPreviewSessionWithSource(sessionId: string): LoadedPreviewSession | null {
  if (!canUseBrowserStorage() || !sessionId) return null;
  const sessionStorageSession = parseSession(safeGet(window.sessionStorage, storageKey(sessionId)));
  if (sessionStorageSession) return { session: sessionStorageSession, dataSource: 'sessionStorage' };

  const localStorageSession = parseSession(safeGet(window.localStorage, storageKey(sessionId)));
  if (localStorageSession) return { session: localStorageSession, dataSource: 'localStorage-session' };

  return null;
}

export function loadPreviewSession(sessionId: string): PreviewSession | null {
  return loadPreviewSessionWithSource(sessionId)?.session || null;
}

export function loadPreviewFallback(sessionId?: string): LoadedPreviewSession | null {
  if (!canUseBrowserStorage()) return null;

  if (sessionId) {
    const bySessionId = loadPreviewSessionWithSource(sessionId);
    if (bySessionId) return bySessionId;
  } else {
    const latestSessionStorage = loadLatestStoredSession(window.sessionStorage, 'sessionStorage');
    if (latestSessionStorage) return latestSessionStorage;

    const latestLocalStorageSession = loadLatestStoredSession(window.localStorage, 'localStorage-session');
    if (latestLocalStorageSession) return latestLocalStorageSession;
  }

  const previewCurrent = parseSession(safeGet(window.localStorage, PREVIEW_CURRENT_KEY));
  if (previewCurrent) return { session: previewCurrent, dataSource: 'preview-current' };

  return loadBuilderData();
}

export function reconcilePreviewSession(
  loaded: LoadedPreviewSession,
  queryTemplateId?: string | null,
  mode?: PreviewMode,
  viewport?: number,
): LoadedPreviewSession | null {
  const requestedTemplateId = queryTemplateId || '';
  let data = normalizeCurrentTemplateFields(migrateSiteData(loaded.session.siteData));
  let templateId = getCurrentTemplateId(data);

  if (requestedTemplateId && requestedTemplateId !== templateId) {
    if (!getTemplateById(requestedTemplateId)) return null;
    data = setCurrentTemplateId(data, requestedTemplateId);
    templateId = getCurrentTemplateId(data);
  }

  const nextSession: PreviewSession = {
    ...loaded.session,
    siteData: data,
    templateId,
    skinFamily: getCurrentSkinFamily(data),
    mode: mode || loaded.session.mode,
    viewport: viewport || loaded.session.viewport,
  };
  savePreviewSession(nextSession);
  return { ...loaded, session: nextSession };
}

export { getCurrentTemplateId, getCurrentSkinFamily } from './getCurrentTemplate';
