'use client';

import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import type { SiteData } from '@/types/site';
import { StoreWebsiteRenderer } from '@/components/templates/StoreWebsiteRenderer';
import { getCurrentTemplate, getCurrentTemplateId } from '@/lib/currentTemplate';
import { getTemplateArtwork } from '@/lib/templateArtworkResolver';
import { getTemplateSkin } from '@/lib/templateSkinEngine';
import {
  BROWSER_FRAME_CHROME_HEIGHT,
  PHONE_FRAME_CHROME_HEIGHT,
  getPhoneViewportHeight,
  getPreviewGeometry,
} from '@/lib/previewGeometry';

export type PreviewCanvasMode = 'desktop' | 'mobile';
export type PreviewCanvasZoom = 'fit' | '100' | '75' | '50';
export type PreviewCanvasFrame = 'browser' | 'phone' | 'none';
export type PreviewCanvasViewport = 1440 | 1280 | 1024 | 390 | 375 | 320;
export type PreviewCanvasContext = 'builder-panel' | 'fullscreen';

type PreviewCanvasProps = {
  siteData: SiteData;
  mode: PreviewCanvasMode;
  viewportWidth: PreviewCanvasViewport;
  zoom: PreviewCanvasZoom;
  frame: PreviewCanvasFrame;
  context: PreviewCanvasContext;
  fitContainerRef?: RefObject<HTMLElement | null>;
  className?: string;
  scrollClassName?: string;
  minCanvasHeight?: number;
};

type PreviewFrameShellProps = {
  frame: PreviewCanvasFrame;
  mode: PreviewCanvasMode;
  viewportWidth: PreviewCanvasViewport;
  frameOuterWidth: number;
  children: ReactNode;
};

function minimumContentHeight(mode: PreviewCanvasMode, viewportWidth: PreviewCanvasViewport, minCanvasHeight?: number) {
  if (mode === 'mobile') return getPhoneViewportHeight(viewportWidth);
  return minCanvasHeight || 1200;
}

function PreviewFrameShell({ frame, mode, viewportWidth, frameOuterWidth, children }: PreviewFrameShellProps) {
  if (frame === 'phone') {
    return (
      <div
        className="preview-frame-shell preview-frame-shell--phone preview-canvas--frame-phone"
        data-testid="preview-phone-frame"
        data-frame="phone"
        data-mode={mode}
        data-viewport-width={viewportWidth}
        style={{ width: frameOuterWidth, height: getPhoneViewportHeight(viewportWidth) + PHONE_FRAME_CHROME_HEIGHT }}
      >
        <div className="fullscreen-mobile-notch" aria-hidden="true" />
        {children}
      </div>
    );
  }

  if (frame === 'browser') {
    return (
      <div
        className="preview-frame-shell preview-frame-shell--browser preview-canvas--frame-browser"
        data-testid="preview-browser-frame"
        data-frame="browser"
        data-mode={mode}
        data-viewport-width={viewportWidth}
        style={{ width: frameOuterWidth }}
      >
        <div className="preview-canvas-browser-bar" aria-hidden="true"><span /><span /><span /><b /></div>
        {children}
      </div>
    );
  }

  return (
    <div
      className="preview-frame-shell preview-frame-shell--none"
      data-testid="preview-none-frame"
      data-frame="none"
      data-mode={mode}
      data-viewport-width={viewportWidth}
      style={{ width: frameOuterWidth }}
    >
      {children}
    </div>
  );
}

export function PreviewCanvas({
  siteData,
  mode,
  viewportWidth,
  zoom,
  frame,
  context,
  fitContainerRef,
  className = '',
  scrollClassName = '',
  minCanvasHeight,
}: PreviewCanvasProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentHeight, setContentHeight] = useState(minimumContentHeight(mode, viewportWidth, minCanvasHeight));
  const templateId = getCurrentTemplateId(siteData);
  const template = getCurrentTemplate(siteData);
  const skin = getTemplateSkin(siteData);
  const artwork = getTemplateArtwork(siteData);
  const measuredFrameHeight = mode === 'mobile'
    ? getPhoneViewportHeight(viewportWidth) + (frame === 'phone' ? PHONE_FRAME_CHROME_HEIGHT : 0)
    : contentHeight + (frame === 'browser' ? BROWSER_FRAME_CHROME_HEIGHT : 0);
  const geometry = getPreviewGeometry({
    mode,
    viewportWidth,
    frame,
    zoom,
    containerWidth,
    containerHeight: measuredFrameHeight,
    context,
  });
  const scalePercent = Math.round(geometry.scale * 100);
  const stageTestId = context === 'fullscreen' ? 'desktop-preview-scroll-viewport' : 'preview-fit-container';

  useLayoutEffect(() => {
    const target = fitContainerRef?.current || stageRef.current;
    if (!target) return;
    let raf = 0;
    const update = () => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        setContainerWidth(Math.ceil(target.getBoundingClientRect().width || target.clientWidth || 0));
      });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(target);
    window.addEventListener('resize', update);
    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [fitContainerRef, mode, viewportWidth, zoom, context]);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    let raf = 0;
    const minHeight = minimumContentHeight(mode, viewportWidth, minCanvasHeight);
    const update = () => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        const renderer = el.querySelector('[data-testid="site-renderer"]') as HTMLElement | null;
        const root = el.querySelector('[data-testid="site-root"]') as HTMLElement | null;
        const nextHeight = Math.ceil(Math.max(minHeight, el.scrollHeight, renderer?.scrollHeight || 0, root?.scrollHeight || 0));
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
    const timeout = window.setTimeout(update, 300);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
      observer.disconnect();
      images.forEach((img) => img.removeEventListener('load', update));
    };
  }, [siteData, mode, viewportWidth, geometry.scale, zoom, minCanvasHeight]);

  return (
    <div
      ref={stageRef}
      className={`preview-stage preview-canvas-scroll ${scrollClassName}`}
      data-testid="preview-stage"
      data-stage-testid={stageTestId}
      data-preview-mode={mode}
      data-preview-context={context}
      data-container-width={containerWidth}
      data-virtual-width={geometry.virtualCanvasWidth}
      data-frame-outer-width={geometry.frameOuterWidth}
      data-target-width={geometry.frameOuterWidth}
      data-preview-scale={geometry.scale.toFixed(3)}
      data-fit-scale={geometry.fitScale.toFixed(3)}
      data-scaled-width={geometry.scaledWidth}
      data-scaled-height={geometry.scaledHeight}
      data-zoom={zoom}
    >
      {context === 'builder-panel' && (
        <div className="preview-scale-indicator" data-testid="preview-scale-indicator">
          scale: {scalePercent}%
        </div>
      )}
      <div
        className="preview-centered-spacer preview-scaled-spacer desktop-preview-scaled-spacer"
        data-testid="preview-centered-spacer"
        data-legacy-testid="preview-scaled-spacer desktop-preview-scaled-spacer"
        data-content-height={geometry.frameOuterHeight}
        data-measured-content-height={contentHeight}
        data-scaled-spacer-height={geometry.scaledHeight}
        style={{ width: geometry.scaledWidth, height: geometry.scaledHeight, position: 'relative', flex: '0 0 auto' }}
      >
        <div
          className="preview-scale-wrapper"
          data-testid="preview-scale-wrapper"
          data-legacy-testid="desktop-preview-scale-wrapper"
          style={{ width: geometry.frameOuterWidth, transform: `scale(${geometry.scale})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}
        >
          <PreviewFrameShell frame={frame} mode={mode} viewportWidth={viewportWidth} frameOuterWidth={geometry.frameOuterWidth}>
            <div
              ref={contentRef}
              className={`preview-virtual-canvas preview-canvas preview-canvas--${mode} preview-mode-${mode} ${className}`}
              data-testid="preview-virtual-canvas"
              data-template-id={templateId}
              data-template-name={template.name}
              data-skin-family={skin.family}
              data-artwork-src={artwork.gallerySrc}
              data-mode={mode}
              data-viewport-width={viewportWidth}
              data-virtual-width={viewportWidth}
              data-target-width={geometry.frameOuterWidth}
              data-zoom={zoom}
              data-preview-scale={geometry.scale.toFixed(3)}
              data-content-height={contentHeight}
              style={{ width: viewportWidth, minHeight: minimumContentHeight(mode, viewportWidth, minCanvasHeight), overflow: mode === 'desktop' ? 'visible' : undefined }}
            >
              <div
                className={mode === 'mobile' ? 'preview-phone-viewport' : 'preview-content-viewport'}
                data-testid={mode === 'mobile' ? 'mobile-preview-canvas' : 'desktop-preview-canvas'}
                data-viewport-width={viewportWidth}
                data-preview-scale={geometry.scale.toFixed(3)}
                style={{ width: viewportWidth, height: mode === 'mobile' ? getPhoneViewportHeight(viewportWidth) : undefined, minHeight: mode === 'mobile' ? getPhoneViewportHeight(viewportWidth) : contentHeight, overflow: mode === 'desktop' ? 'visible' : undefined }}
              >
                <StoreWebsiteRenderer data={siteData} previewMode={mode} />
              </div>
            </div>
          </PreviewFrameShell>
        </div>
      </div>
    </div>
  );
}
