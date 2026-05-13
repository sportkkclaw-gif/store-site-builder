'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import type { SiteData } from '@/types/site';
import { StoreWebsiteRenderer } from '@/components/templates/StoreWebsiteRenderer';
import { getCurrentTemplate, getCurrentTemplateId } from '@/lib/currentTemplate';
import { getTemplateArtwork } from '@/lib/templateArtworkResolver';
import { getTemplateSkin } from '@/lib/templateSkinEngine';

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
  frame?: PreviewCanvasFrame;
  context?: PreviewCanvasContext;
  fitContainerRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  scrollClassName?: string;
  minCanvasHeight?: number;
};

const PHONE_CHROME_X = 36;
const PHONE_CHROME_Y = 58;
const BROWSER_BAR_HEIGHT = 46;

function fixedScale(zoom: PreviewCanvasZoom) {
  if (zoom === '100') return 1;
  if (zoom === '75') return 0.75;
  if (zoom === '50') return 0.5;
  return 1;
}

function phoneViewportHeight(width: PreviewCanvasViewport) {
  if (width === 320) return 720;
  if (width === 375) return 812;
  if (width === 390) return 844;
  return 844;
}

function targetOuterWidth(mode: PreviewCanvasMode, frame: PreviewCanvasFrame, viewportWidth: PreviewCanvasViewport) {
  if (mode === 'mobile' && frame === 'phone') return viewportWidth + PHONE_CHROME_X;
  return viewportWidth;
}

function minimumContentHeight(mode: PreviewCanvasMode, viewportWidth: PreviewCanvasViewport, minCanvasHeight?: number) {
  if (mode === 'mobile') return phoneViewportHeight(viewportWidth);
  return minCanvasHeight || 1200;
}

export function PreviewCanvas({
  siteData,
  mode,
  viewportWidth,
  zoom,
  frame = 'none',
  context = 'builder-panel',
  fitContainerRef,
  className = '',
  scrollClassName = '',
  minCanvasHeight,
}: PreviewCanvasProps) {
  const fitRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentHeight, setContentHeight] = useState(minimumContentHeight(mode, viewportWidth, minCanvasHeight));
  const templateId = getCurrentTemplateId(siteData);
  const template = getCurrentTemplate(siteData);
  const skin = getTemplateSkin(siteData);
  const artwork = getTemplateArtwork(siteData);
  const isPhoneFrame = frame === 'phone';
  const isBrowserFrame = frame === 'browser';
  const targetWidth = targetOuterWidth(mode, frame, viewportWidth);
  const targetHeight = mode === 'mobile'
    ? phoneViewportHeight(viewportWidth) + (isPhoneFrame ? PHONE_CHROME_Y : 0)
    : Math.max(minimumContentHeight(mode, viewportWidth, minCanvasHeight), contentHeight) + (isBrowserFrame ? BROWSER_BAR_HEIGHT : 0);
  const paddingX = context === 'builder-panel' ? 16 : 32;
  const availableWidth = Math.max(0, (containerWidth || targetWidth) - paddingX * 2);
  const fitScale = Math.min(1, Math.max(0.12, availableWidth / targetWidth));
  const scale = zoom === 'fit' ? fitScale : fixedScale(zoom);
  const scaledWidth = Math.ceil(targetWidth * scale);
  const scaledHeight = Math.ceil(targetHeight * scale);
  const scalePercent = Math.round(scale * 100);
  const scrollTestId = context === 'fullscreen' ? 'desktop-preview-scroll-viewport' : 'preview-fit-container';

  useLayoutEffect(() => {
    const target = fitContainerRef?.current || fitRef.current;
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
  }, [siteData, mode, viewportWidth, scale, zoom, minCanvasHeight]);

  return (
    <div
      ref={fitRef}
      className={`preview-fit-container preview-canvas-scroll ${scrollClassName}`}
      data-testid={scrollTestId}
      data-preview-testid="preview-fit-container"
      data-preview-mode={mode}
      data-preview-context={context}
      data-container-width={containerWidth}
      data-target-width={targetWidth}
      data-preview-scale={scale.toFixed(3)}
      data-scaled-width={scaledWidth}
      data-zoom={zoom}
    >
      {context === 'builder-panel' && (
        <div className="preview-scale-indicator" data-testid="preview-scale-indicator">
          scale: {scalePercent}%
        </div>
      )}
      <div
        className="preview-scaled-spacer desktop-preview-scaled-spacer"
        data-testid="preview-scaled-spacer"
        data-legacy-testid="desktop-preview-scaled-spacer"
        data-content-height={targetHeight}
        data-scaled-spacer-height={scaledHeight}
        style={{ width: scaledWidth, height: scaledHeight, position: 'relative', flex: '0 0 auto' }}
      >
        <div
          className="preview-scale-wrapper"
          data-testid="preview-scale-wrapper"
          data-legacy-testid="desktop-preview-scale-wrapper"
          style={{ width: targetWidth, transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}
        >
          <div
            className={`preview-canvas preview-canvas--${mode} preview-mode-${mode} preview-canvas--frame-${frame} ${className}`}
            data-testid="preview-virtual-canvas"
            data-legacy-testid={mode === 'desktop' ? 'desktop-preview-canvas' : 'mobile-preview-canvas'}
            data-template-id={templateId}
            data-template-name={template.name}
            data-skin-family={skin.family}
            data-artwork-src={artwork.gallerySrc}
            data-mode={mode}
            data-viewport-width={viewportWidth}
            data-virtual-width={viewportWidth}
            data-target-width={targetWidth}
            data-zoom={zoom}
            data-preview-scale={scale.toFixed(3)}
            data-content-height={targetHeight}
            style={{ width: viewportWidth, height: mode === 'mobile' ? targetHeight : undefined, minHeight: mode === 'mobile' ? targetHeight : targetHeight, overflow: mode === 'desktop' ? 'visible' : 'hidden' }}
          >
            {isBrowserFrame && <div className="preview-canvas-browser-bar" aria-hidden="true"><span /><span /><span /><b /></div>}
            {isPhoneFrame && <div className="fullscreen-mobile-notch" aria-hidden="true" />}
            <div
              ref={contentRef}
              className={isPhoneFrame ? 'preview-phone-viewport' : 'preview-content-viewport'}
              data-testid={mode === 'desktop' ? 'desktop-preview-canvas' : 'mobile-preview-canvas'}
              data-viewport-width={viewportWidth}
              data-preview-scale={scale.toFixed(3)}
              style={{ width: viewportWidth, height: mode === 'mobile' ? phoneViewportHeight(viewportWidth) : undefined, minHeight: mode === 'mobile' ? phoneViewportHeight(viewportWidth) : contentHeight, overflow: mode === 'desktop' ? 'visible' : undefined }}
            >
              <StoreWebsiteRenderer data={siteData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
