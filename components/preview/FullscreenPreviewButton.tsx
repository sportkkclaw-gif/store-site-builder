'use client';

import { useRouter } from 'next/navigation';
import type { SiteData } from '@/types/site';
import { saveSiteData, migrateSiteData } from '@/lib/storage';
import { createPreviewSession, savePreviewSession } from '@/lib/previewSession';
import { getCurrentSkinFamily, getCurrentTemplateId } from '@/lib/getCurrentTemplate';

export type FullscreenPreviewButtonMode = 'desktop' | 'mobile';
export type FullscreenPreviewButtonViewport = 1440 | 1280 | 1024 | 390 | 375 | 320;

export function FullscreenPreviewButton({
  mode,
  viewport,
  siteData,
  variant = 'primary',
}: {
  mode: FullscreenPreviewButtonMode;
  viewport: FullscreenPreviewButtonViewport;
  siteData: SiteData;
  variant?: 'primary' | 'compact';
}) {
  const router = useRouter();

  const openPreview = () => {
    const latestSiteData = migrateSiteData(siteData);
    const templateId = getCurrentTemplateId(latestSiteData);
    const skinFamily = getCurrentSkinFamily(latestSiteData);
    const session = createPreviewSession({ siteData: latestSiteData, mode, viewport, templateId, skinFamily });
    const previewUrl = `/preview?sessionId=${encodeURIComponent(session.sessionId)}&templateId=${encodeURIComponent(templateId)}&mode=${mode}&viewport=${viewport}&t=${Date.now()}`;
    try {
      saveSiteData(latestSiteData);
      savePreviewSession(session);
      router.push(previewUrl);
    } catch {
      try {
        saveSiteData(latestSiteData);
        savePreviewSession(session);
      } catch {}
      window.location.assign(previewUrl);
    }
  };

  return (
    <button
      type="button"
      data-testid="fullscreen-preview-button"
      aria-label="全螢幕預覽"
      onClick={openPreview}
      className={`fullscreen-preview-button fullscreen-preview-button--${variant}`}
    >
      全螢幕預覽
    </button>
  );
}
