'use client';

import { useEffect, useRef, useState } from 'react';
import type { SiteData } from '@/types/site';
import { StoreWebsiteRenderer } from '@/components/templates/StoreWebsiteRenderer';
import { getCurrentTemplate, getCurrentTemplateId } from '@/lib/currentTemplate';
import { getTemplateArtwork } from '@/lib/templateArtworkResolver';
import { getTemplateSkin } from '@/lib/templateSkinEngine';

export type PreviewCanvasMode = 'desktop' | 'mobile';
export type PreviewCanvasZoom = 'fit' | '100' | '75' | '50';
export type PreviewCanvasFrame = 'browser' | 'phone' | 'none';
export type PreviewCanvasViewport = 1440 | 1280 | 1024 | 390 | 375 | 320;

type PreviewCanvasProps = {
  siteData: SiteData;
  mode: PreviewCanvasMode;
  viewportWidth: PreviewCanvasViewport;
  zoom: PreviewCanvasZoom;
  frame?: PreviewCanvasFrame;
  fitContainerRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  scrollClassName?: string;
  minCanvasHeight?: number;
};

function fixedScale(zoom: PreviewCanvasZoom) {
  if (zoom === '100') return 1;
  if (zoom === '75') return 0.75;
  if (zoom === '50') return 0.5;
  return 1;
}

export function PreviewCanvas({ siteData, mode, viewportWidth, zoom, frame = 'none', fitContainerRef, className = '', scrollClassName = '', minCanvasHeight }: PreviewCanvasProps) {
  const ownRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const templateId = getCurrentTemplateId(siteData);
  const template = getCurrentTemplate(siteData);
  const skin = getTemplateSkin(siteData);
  const artwork = getTemplateArtwork(siteData);
  const scale = zoom === 'fit' ? fitScale : fixedScale(zoom);
  const height = minCanvasHeight || (mode === 'desktop' ? 1200 : 900);
  const scaledHeight = Math.ceil(height * scale) + (frame === 'phone' ? 120 : 80);

  useEffect(() => {
    const updateFit = () => {
      const container = fitContainerRef?.current || ownRef.current?.parentElement?.parentElement;
      if (!container) return;
      const available = Math.max(container.clientWidth - 48, 280);
      setFitScale(Number(Math.min(1, Math.max(0.2, available / viewportWidth)).toFixed(3)));
    };
    updateFit();
    window.addEventListener('resize', updateFit);
    return () => window.removeEventListener('resize', updateFit);
  }, [fitContainerRef, viewportWidth, mode]);

  return (
    <div className={`preview-canvas-scroll ${scrollClassName}`} data-testid="preview-stage" style={{ minHeight: scaledHeight }}>
      <div
        ref={ownRef}
        className="preview-scale-wrapper"
        data-testid="preview-scale-wrapper"
        style={{ width: viewportWidth, transform: `scale(${scale})`, transformOrigin: 'top center' }}
      >
        <div
          className={`preview-canvas preview-canvas--${mode} preview-canvas--frame-${frame} ${className}`}
          data-testid={mode === 'desktop' ? 'desktop-preview-canvas' : 'mobile-preview-canvas'}
          data-template-id={templateId}
          data-template-name={template.name}
          data-skin-family={skin.family}
          data-artwork-src={artwork.gallerySrc}
          data-mode={mode}
          data-viewport-width={viewportWidth}
          data-zoom={zoom}
          style={{ width: viewportWidth }}
        >
          {frame === 'browser' && <div className="preview-canvas-browser-bar" aria-hidden="true"><span /><span /><span /><b /></div>}
          {frame === 'phone' && <div className="fullscreen-mobile-notch" aria-hidden="true" />}
          <StoreWebsiteRenderer data={siteData} />
        </div>
      </div>
    </div>
  );
}
