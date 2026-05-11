'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { SiteData } from '@/types/site';
import { FullscreenPreviewShell } from '@/components/preview/FullscreenPreviewShell';
import { STORAGE_KEY, migrateSiteData } from '@/lib/storage';
import { getCurrentTemplateId, getCurrentSkinFamily } from '@/lib/getCurrentTemplate';
import { loadPreviewSession, type PreviewSession } from '@/lib/previewSession';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: SiteData; session: PreviewSession | null; templateId: string; skinFamily: string; sessionId: string };

function PreviewError({ message }: { message: string }) {
  return <main className="fullscreen-preview-loading" data-testid="preview-error"><div className="text-center"><p>{message}</p><a data-testid="preview-back-to-builder" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-slate-950 px-5 text-sm font-black text-white" href="/builder">← 返回 Builder</a></div></main>;
}

export function PreviewPageClient() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    const sessionId = searchParams?.get('sessionId') || '';
    const queryTemplateId = searchParams?.get('templateId') || '';
    try {
      if (sessionId) {
        const session = loadPreviewSession(sessionId);
        if (!session) {
          setState({ status: 'error', message: '預覽資料遺失，請返回 Builder 重新開啟預覽。' });
          return;
        }
        const data = migrateSiteData(session.siteData);
        const loadedTemplateId = getCurrentTemplateId(data);
        const skinFamily = getCurrentSkinFamily(data);
        if (queryTemplateId && queryTemplateId !== loadedTemplateId) {
          setState({ status: 'error', message: '預覽模板與 Builder 狀態不一致，請返回 Builder 重新開啟預覽。' });
          return;
        }
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setState({ status: 'ready', data, session, templateId: loadedTemplateId, skinFamily, sessionId });
        return;
      }

      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setState({ status: 'error', message: '尚未載入 Builder 資料，請返回 Builder 後重新開啟預覽。' });
        return;
      }
      const data = migrateSiteData(JSON.parse(raw));
      const loadedTemplateId = getCurrentTemplateId(data);
      const skinFamily = getCurrentSkinFamily(data);
      if (queryTemplateId && queryTemplateId !== loadedTemplateId) {
        setState({ status: 'error', message: '預覽模板與 Builder 狀態不一致，請返回 Builder 重新開啟預覽。' });
        return;
      }
      setState({ status: 'ready', data, session: null, templateId: loadedTemplateId, skinFamily, sessionId: '' });
    } catch {
      setState({ status: 'error', message: '預覽資料讀取失敗，請返回 Builder 重新開啟預覽。' });
    }
  }, [searchParams]);

  if (state.status === 'loading') return <main className="fullscreen-preview-loading">載入全螢幕預覽中…</main>;
  if (state.status === 'error') return <PreviewError message={state.message} />;

  return <FullscreenPreviewShell data={state.data} sessionId={state.sessionId} templateId={state.templateId} skinFamily={state.skinFamily} />;
}
