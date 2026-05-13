import type { PreviewCanvasContext, PreviewCanvasFrame, PreviewCanvasMode, PreviewCanvasViewport, PreviewCanvasZoom } from '@/components/preview/PreviewCanvas';

export const PHONE_FRAME_CHROME_WIDTH = 56;
export const PHONE_FRAME_CHROME_HEIGHT = 74;
export const BROWSER_FRAME_CHROME_HEIGHT = 46;

export type PreviewGeometryInput = {
  mode: PreviewCanvasMode;
  viewportWidth: PreviewCanvasViewport;
  frame: PreviewCanvasFrame;
  zoom: PreviewCanvasZoom;
  containerWidth: number;
  containerHeight: number;
  context: PreviewCanvasContext;
};

export type PreviewGeometry = {
  virtualCanvasWidth: number;
  frameOuterWidth: number;
  frameOuterHeight: number;
  scale: number;
  fitScale: number;
  scaledWidth: number;
  scaledHeight: number;
  stagePadding: number;
  shouldCenter: boolean;
};

export function getPhoneViewportHeight(viewportWidth: PreviewCanvasViewport) {
  if (viewportWidth === 320) return 720;
  if (viewportWidth === 375) return 812;
  if (viewportWidth === 390) return 844;
  return 844;
}

function fixedZoomScale(zoom: PreviewCanvasZoom) {
  if (zoom === '100') return 1;
  if (zoom === '75') return 0.75;
  if (zoom === '50') return 0.5;
  return 1;
}

export function getPreviewGeometry({
  mode,
  viewportWidth,
  frame,
  zoom,
  containerWidth,
  containerHeight,
  context,
}: PreviewGeometryInput): PreviewGeometry {
  const virtualCanvasWidth = viewportWidth;
  const stagePadding = context === 'builder-panel' ? 8 : 24;
  const frameOuterWidth = mode === 'mobile' && frame === 'phone'
    ? viewportWidth + PHONE_FRAME_CHROME_WIDTH
    : viewportWidth;
  const minimumFrameHeight = mode === 'mobile'
    ? getPhoneViewportHeight(viewportWidth) + (frame === 'phone' ? PHONE_FRAME_CHROME_HEIGHT : 0)
    : 900 + (frame === 'browser' ? BROWSER_FRAME_CHROME_HEIGHT : 0);
  const frameOuterHeight = Math.max(minimumFrameHeight, Math.ceil(containerHeight || minimumFrameHeight));
  const measuredWidth = containerWidth > 0 ? containerWidth : frameOuterWidth + stagePadding * 2;
  const availableWidth = Math.max(1, measuredWidth - stagePadding * 2);
  const fitScale = Math.min(availableWidth / frameOuterWidth, 1);
  const scale = zoom === 'fit' ? fitScale : fixedZoomScale(zoom);

  return {
    virtualCanvasWidth,
    frameOuterWidth,
    frameOuterHeight,
    scale,
    fitScale,
    scaledWidth: Math.ceil(frameOuterWidth * scale),
    scaledHeight: Math.ceil(frameOuterHeight * scale),
    stagePadding,
    shouldCenter: true,
  };
}
