'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { SiteData } from '@/types/site';
import { FullscreenPreviewShell } from '@/components/preview/FullscreenPreviewShell';
import {
  loadPreviewFallback,
  reconcilePreviewSession,
  type PreviewMode,
  type PreviewSession,
  type PreviewSessionDataSource,
} from '@/lib/previewSession';

const LOST_MESSAGE = '預覽資料遺失，請返回 Builder 重新開啟預覽。';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | {
      status: 'ready';
      data: SiteData;
      session: PreviewSession;
      templateId: string;
      skinFamily: string;
      sessionId: string;
      dataSource: PreviewSessionDataSource;
    };

function PreviewError({ message }: { message: string }) {
  return <main className="fullscreen-preview-loading" data-testid="preview-error"><div className="text-center"><p>{message}</p><a data-testid="preview-back-to-builder" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-slate-950 px-5 text-sm font-black text-white" href="/builder">← 返回 Builder</a></div></main>;
}

function parseMode(value: string | null): PreviewMode | undefined {
  return value === 'desktop' || value === 'mobile' ? value : undefined;
}

function parseViewport(value: string | null): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function PreviewPageClient() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    const sessionId = searchParams?.get('sessionId') || '';
    const queryTemplateId = searchParams?.get('templateId') || '';
    const queryMode = parseMode(searchParams?.get('mode') || null);
    const queryViewport = parseViewport(searchParams?.get('viewport') || null);

    try {
      const loaded = loadPreviewFallback(sessionId);
      if (!loaded) {
        setState({ status: 'error', message: LOST_MESSAGE });
        return;
      }

      const reconciled = reconcilePreviewSession(loaded, queryTemplateId, queryMode, queryViewport);
      if (!reconciled) {
        setState({ status: 'error', message: LOST_MESSAGE });
        return;
      }

      const { session, dataSource } = reconciled;
      setState({
        status: 'ready',
        data: session.siteData,
        session,
        templateId: session.templateId,
        skinFamily: session.skinFamily,
        sessionId: session.sessionId || sessionId,
        dataSource,
      });
    } catch {
      setState({ status: 'error', message: LOST_MESSAGE });
    }
  }, [searchParams]);

  if (state.status === 'loading') return <main className="fullscreen-preview-loading">載入全螢幕預覽中…</main>;
  if (state.status === 'error') return <PreviewError message={state.message} />;

  return (
    <FullscreenPreviewShell
      data={state.data}
      sessionId={state.sessionId}
      templateId={state.templateId}
      skinFamily={state.skinFamily}
      dataSource={state.dataSource}
    />
  );
}
