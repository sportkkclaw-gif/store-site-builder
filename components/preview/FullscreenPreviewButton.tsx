'use client';

import { useRouter } from 'next/navigation';
import type { SiteData } from '@/types/site';
import { saveSiteData, migrateSiteData } from '@/lib/storage';
import { createPreviewSession, savePreviewSession } from '@/lib/previewSession';
import { getCurrentTemplateId } from '@/lib/getCurrentTemplate';

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
    const safeData = migrateSiteData(siteData);
    const templateId = getCurrentTemplateId(safeData);
    const session = createPreviewSession(safeData);
    const previewUrl = `/preview?sessionId=${encodeURIComponent(session.sessionId)}&templateId=${encodeURIComponent(templateId)}&mode=${mode}&viewport=${viewport}&from=builder`;
    try {
      saveSiteData(safeData);
      savePreviewSession(session);
      router.push(previewUrl);
    } catch {
      try {
        saveSiteData(safeData);
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
