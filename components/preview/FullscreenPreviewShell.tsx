'use client';

import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { SiteData } from '@/types/site';
import { getCurrentTemplate } from '@/lib/currentTemplate';
import { getTemplateArtwork } from '@/lib/templateArtworkResolver';
import { getTemplateSkin } from '@/lib/templateSkinEngine';
import { PreviewCanvas, type PreviewCanvasMode, type PreviewCanvasViewport, type PreviewCanvasZoom } from './PreviewCanvas';

const desktopViewports = [1440, 1280, 1024] as const;
const mobileViewports = [390, 375, 320] as const;
const zoomOptions: { value: PreviewCanvasZoom; label: string }[] = [
  { value: 'fit', label: 'Fit' },
  { value: '100', label: '100%' },
  { value: '75', label: '75%' },
  { value: '50', label: '50%' },
];

function parseMode(value: string | null): PreviewCanvasMode { return value === 'mobile' ? 'mobile' : 'desktop'; }
function parseViewport(mode: PreviewCanvasMode, value: string | null): PreviewCanvasViewport {
  const parsed = Number(value);
  const allowed = mode === 'mobile' ? mobileViewports : desktopViewports;
  return (allowed as readonly number[]).includes(parsed) ? parsed as PreviewCanvasViewport : mode === 'mobile' ? 390 : 1440;
}

export function FullscreenPreviewShell({ data }: { data: SiteData }) {
  const searchParams = useSearchParams();
  const initialMode = parseMode(searchParams?.get('mode') || null);
  const [mode, setMode] = useState<PreviewCanvasMode>(initialMode);
  const [viewport, setViewport] = useState<PreviewCanvasViewport>(parseViewport(initialMode, searchParams?.get('viewport') || null));
  const [zoom, setZoom] = useState<PreviewCanvasZoom>('fit');
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportOptions = useMemo(() => mode === 'desktop' ? desktopViewports : mobileViewports, [mode]);
  const template = getCurrentTemplate(data);
  const skin = getTemplateSkin(data);
  const artwork = getTemplateArtwork(data);

  const setModeAndViewport = (nextMode: PreviewCanvasMode) => {
    setMode(nextMode);
    setViewport(nextMode === 'desktop' ? 1440 : 390);
  };

  const goBuilder = () => { window.location.href = '/builder'; };

  return (
    <div className="fullscreen-preview-shell" data-testid="fullscreen-preview-shell">
      <header className="fullscreen-preview-toolbar">
        <div className="fullscreen-toolbar-left">
          <button type="button" data-testid="preview-back-to-builder" onClick={goBuilder} className="fullscreen-primary-button">← 返回 Builder</button>
          <div className="fullscreen-template-name">
            目前模板：<b data-testid="fullscreen-preview-template-name">{template.name}</b>
            <small>templateId：<span data-testid="fullscreen-preview-template-id">{template.id}</span>｜skinFamily：<span data-testid="fullscreen-preview-skin-family">{skin.family}</span></small>
          </div>
        </div>
        <div className="fullscreen-toolbar-controls" aria-label="全螢幕預覽控制列">
          <div className="fullscreen-control-group" role="group" aria-label="模式切換">
            {(['desktop', 'mobile'] as PreviewCanvasMode[]).map(item => <button key={item} type="button" onClick={() => setModeAndViewport(item)} className={mode === item ? 'fullscreen-control active' : 'fullscreen-control'}>{item === 'desktop' ? '桌機' : '手機'}</button>)}
          </div>
          <div className="fullscreen-control-group" role="group" aria-label="Viewport 切換">
            {viewportOptions.map(size => <button key={size} type="button" data-testid={`preview-viewport-${size}`} onClick={() => setViewport(size)} className={viewport === size ? 'fullscreen-control active' : 'fullscreen-control'}>{size}</button>)}
          </div>
          <div className="fullscreen-control-group" role="group" aria-label="Zoom 切換">
            {zoomOptions.map(item => <button key={item.value} type="button" data-testid={`preview-zoom-${item.value}`} onClick={() => setZoom(item.value)} className={zoom === item.value ? 'fullscreen-control active' : 'fullscreen-control'}>{item.label}</button>)}
          </div>
          <button type="button" onClick={goBuilder} className="fullscreen-secondary-button">關閉</button>
        </div>
      </header>
      <section ref={stageRef} className="fullscreen-preview-stage" data-preview-mode={mode} data-viewport={viewport} data-zoom={zoom} data-template-id={template.id} data-skin-family={skin.family} data-artwork-src={artwork.gallerySrc}>
        <div className="fullscreen-preview-meta">全螢幕{mode === 'desktop' ? '桌機' : '手機'}預覽｜虛擬畫布：{viewport}px｜縮放：{zoom === 'fit' ? 'Fit' : `${zoom}%`}｜artwork：{artwork.gallerySrc}</div>
        <PreviewCanvas siteData={data} mode={mode} viewportWidth={viewport} zoom={zoom} frame={mode === 'desktop' ? 'none' : 'phone'} context="fullscreen" fitContainerRef={stageRef} className="fullscreen-preview-canvas" scrollClassName="fullscreen-preview-scroll" />
      </section>
    </div>
  );
}
