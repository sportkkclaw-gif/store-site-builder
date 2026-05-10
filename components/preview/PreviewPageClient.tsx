'use client';

import { useEffect, useState } from 'react';
import type { SiteData } from '@/types/site';
import { FullscreenPreviewShell } from '@/components/preview/FullscreenPreviewShell';
import { STORAGE_KEY, migrateSiteData } from '@/lib/storage';

type LoadState =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'ready'; data: SiteData };

export function PreviewPageClient() {
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setState({ status: 'missing' });
        return;
      }
      setState({ status: 'ready', data: migrateSiteData(JSON.parse(raw)) });
    } catch {
      setState({ status: 'missing' });
    }
  }, []);

  if (state.status === 'loading') {
    return <main className="fullscreen-preview-loading">載入全螢幕預覽中…</main>;
  }

  if (state.status === 'missing') {
    return <main className="fullscreen-preview-loading"><div className="text-center"><p>尚未載入 Builder 資料，請返回 Builder 建立網站。</p><a className="mt-5 inline-flex min-h-11 items-center rounded-full bg-slate-950 px-5 text-sm font-black text-white" href="/builder">← 返回 Builder</a></div></main>;
  }

  return <FullscreenPreviewShell data={state.data} />;
}
