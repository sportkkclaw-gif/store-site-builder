'use client';

import { useEffect, useState } from 'react';
import type { SiteData } from '@/types/site';
import { createDefaultSiteData } from '@/lib/defaultSiteData';
import { loadSiteData } from '@/lib/storage';
import { FullscreenPreviewShell } from '@/components/preview/FullscreenPreviewShell';

export function PreviewPageClient() {
  const [data, setData] = useState<SiteData>(createDefaultSiteData());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setData(loadSiteData());
    setReady(true);
  }, []);

  if (!ready) {
    return <main className="fullscreen-preview-loading">載入全螢幕預覽中…</main>;
  }

  return <FullscreenPreviewShell data={data} />;
}
