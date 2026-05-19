'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import type { SiteData } from '@/types/site';
import { StoreWebsiteRenderer } from '@/components/templates/StoreWebsiteRenderer';
import { getCurrentTemplate, getCurrentTemplateId } from '@/lib/currentTemplate';
import { getTemplateArtwork } from '@/lib/templateArtworkResolver';
import { getTemplateSkin } from '@/lib/templateSkinEngine';
import type { PreviewCanvasFrame, PreviewCanvasMode, PreviewCanvasViewport, PreviewCanvasZoom } from './PreviewCanvas';

type ScaledPreviewCanvasProps = {
  siteData: SiteData;
  mode: PreviewCanvasMode;
  viewportWidth: PreviewCanvasViewport;
  zoom: PreviewCanvasZoom;
  scale: number;
  frame?: PreviewCanvasFrame;
  className?: string;
  scrollClassName?: string;
  minCanvasHeight?: number;
};

export function ScaledPreviewCanvas({
  siteData,
  mode,
  viewportWidth,
  zoom,
  scale,
  frame = 'none',
  className = '',
  scrollClassName = '',
  minCanvasHeight = 900,
}: ScaledPreviewCanvasProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(minCanvasHeight);
  const templateId = getCurrentTemplateId(siteData);
  const template = getCurrentTemplate(siteData);
  const skin = getTemplateSkin(siteData);
  const artwork = getTemplateArtwork(siteData);
  const measuredHeight = Math.max(minCanvasHeight, contentHeight || 0);
  const browserBarHeight = frame === 'browser' ? 46 : 0;
  const scaledSpacerHeight = Math.ceil((measuredHeight + browserBarHeight) * scale);
  const scaledSpacerWidth = Math.ceil(viewportWidth * scale);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    let frameId = 0;
    const update = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const renderer = el.querySelector('[data-testid="site-renderer"]') as HTMLElement | null;
        const root = el.querySelector('[data-testid="site-root"]') as HTMLElement | null;
        const nextHeight = Math.ceil(Math.max(
          minCanvasHeight,
          el.scrollHeight,
          renderer?.scrollHeight || 0,
          root?.scrollHeight || 0,
        ));
        setContentHeight((previous) => previous === nextHeight ? previous : nextHeight);
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    const renderer = el.querySelector('[data-testid="site-renderer"]');
    const root = el.querySelector('[data-testid="site-root"]');
    if (renderer) observer.observe(renderer);
    if (root) observer.observe(root);

    const images = Array.from(el.querySelectorAll('img'));
    images.forEach((img) => img.addEventListener('load', update));
    const timeout = window.setTimeout(update, 250);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeout);
      observer.disconnect();
      images.forEach((img) => img.removeEventListener('load', update));
    };
  }, [siteData, viewportWidth, scale, mode, zoom, minCanvasHeight]);

  return (
    <div className={`preview-canvas-scroll ${scrollClassName}`} data-testid="desktop-preview-scroll-viewport">
      <div
        className="desktop-preview-scaled-spacer"
        data-testid="desktop-preview-scaled-spacer"
        data-content-height={measuredHeight}
        data-scaled-spacer-height={scaledSpacerHeight}
        style={{ width: scaledSpacerWidth, height: scaledSpacerHeight, position: 'relative', flex: '0 0 auto' }}
      >
        <div
          className="preview-scale-wrapper"
          data-testid="desktop-preview-scale-wrapper"
          style={{ width: viewportWidth, transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}
        >
          <div
            className={`preview-canvas preview-canvas--${mode} preview-canvas--frame-${frame} ${className}`}
            data-testid="desktop-preview-canvas"
            data-template-id={templateId}
            data-template-name={template.name}
            data-skin-family={skin.family}
            data-artwork-src={artwork.gallerySrc}
            data-mode={mode}
            data-viewport-width={viewportWidth}
            data-zoom={zoom}
            data-content-height={measuredHeight}
            style={{ width: viewportWidth, minHeight: measuredHeight + browserBarHeight, overflow: 'visible' }}
          >
            {frame === 'browser' && <div className="preview-canvas-browser-bar" aria-hidden="true"><span /><span /><span /><b /></div>}
            <div ref={contentRef} data-testid="desktop-preview-content" style={{ width: viewportWidth, minHeight: measuredHeight, overflow: 'visible' }}>
              <StoreWebsiteRenderer data={siteData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
