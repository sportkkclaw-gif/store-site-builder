'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { SiteData } from '@/types/site';

type PreviewMode = 'desktop' | 'mobile';
type ZoomMode = 'fit' | '100' | '75' | '50';

const desktopViewports = [1440, 1280, 1024] as const;
const mobileViewports = [390, 375, 320] as const;
const zoomOptions: { value: ZoomMode; label: string }[] = [
  { value: 'fit', label: 'Fit' },
  { value: '100', label: '100%' },
  { value: '75', label: '75%' },
  { value: '50', label: '50%' },
];

function fixedScale(zoom: ZoomMode) {
  if (zoom === '100') return 1;
  if (zoom === '75') return 0.75;
  if (zoom === '50') return 0.5;
  return 1;
}

function SitePreview({ data }: { data: SiteData }) {
  const products = data.menu.categories.flatMap(category => category.items).slice(0, 6);
  return (
    <main className="min-h-[900px] bg-[#f8fafc] text-slate-950">
      <section className="grid min-h-[520px] items-center gap-8 bg-gradient-to-br from-teal-50 via-white to-amber-50 px-[7vw] py-20 md:grid-cols-[1.1fr_.9fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[.28em] text-teal-700">Fullscreen Desktop Preview</p>
          <h1 className="mt-5 text-5xl font-black leading-tight md:text-7xl">{data.store.name}</h1>
          <p className="mt-5 max-w-2xl text-2xl font-bold text-slate-600">{data.store.tagline || data.hero.title}</p>
          <p className="mt-5 max-w-2xl text-lg text-slate-500">{data.store.description || data.hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="rounded-full bg-slate-950 px-6 py-4 font-black text-white" href={data.links.line || '#'}>LINE</a>
            <a className="rounded-full border border-slate-300 bg-white px-6 py-4 font-black text-slate-900" href={data.links.googleMap || '#'}>Google Maps</a>
          </div>
        </div>
        <div className="rounded-[44px] bg-white/80 p-6 shadow-2xl shadow-teal-900/10">
          <div className="aspect-[4/3] rounded-[32px] bg-gradient-to-br from-teal-200 via-amber-100 to-rose-100" />
        </div>
      </section>
      <section className="px-[7vw] py-16">
        <p className="text-sm font-black uppercase tracking-[.24em] text-teal-700">Featured</p>
        <h2 className="mt-2 text-4xl font-black">招牌商品</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {products.map(item => <article key={item.id} className="rounded-[32px] bg-white p-6 shadow-lg shadow-slate-200/70"><div className="mb-5 aspect-[4/3] rounded-[24px] bg-slate-100" /><h3 className="text-2xl font-black">{item.name}</h3><p className="mt-2 text-slate-500">{item.description}</p><strong className="mt-4 block text-xl text-teal-700">${item.price}</strong></article>)}
        </div>
      </section>
      <section className="bg-white px-[7vw] py-16">
        <p className="text-sm font-black uppercase tracking-[.24em] text-teal-700">Menu</p>
        <h2 className="mt-2 text-4xl font-black">菜單總覽</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {data.menu.categories.map(category => <article key={category.id} className="rounded-[28px] border border-slate-200 p-6"><h3 className="mb-4 text-2xl font-black">{category.name}</h3>{category.items.map(item => <div key={item.id} className="flex justify-between gap-4 border-t border-slate-100 py-3"><span><b>{item.name}</b><small className="block text-slate-500">{item.description}</small></span><strong>${item.price}</strong></div>)}</article>)}
        </div>
      </section>
      <footer className="flex flex-wrap justify-between gap-4 bg-slate-950 px-[7vw] py-10 font-bold text-white"><span>© {new Date().getFullYear()} {data.store.name}</span><span>{data.store.address}</span></footer>
    </main>
  );
}

export function FullscreenPreviewShell({ data }: { data: SiteData }) {
  const [mode, setMode] = useState<PreviewMode>('desktop');
  const [viewport, setViewport] = useState(1440);
  const [zoom, setZoom] = useState<ZoomMode>('fit');
  const [fitScale, setFitScale] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportOptions = useMemo(() => mode === 'desktop' ? desktopViewports : mobileViewports, [mode]);
  const scale = zoom === 'fit' ? fitScale : fixedScale(zoom);
  const canvasHeight = mode === 'desktop' ? 1200 : 900;
  const scaledHeight = Math.ceil(canvasHeight * scale) + 80;

  useEffect(() => {
    if (!viewportOptions.includes(viewport as never)) setViewport(viewportOptions[0]);
  }, [mode, viewport, viewportOptions]);

  useEffect(() => {
    const updateFit = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const available = Math.max(stage.clientWidth - 48, 280);
      setFitScale(Number(Math.min(1, Math.max(0.2, available / viewport)).toFixed(3)));
    };
    updateFit();
    window.addEventListener('resize', updateFit);
    return () => window.removeEventListener('resize', updateFit);
  }, [viewport, mode]);

  const goBuilder = () => { window.location.href = '/builder'; };
  const frameClass = mode === 'desktop' ? 'fullscreen-preview-canvas fullscreen-preview-canvas--desktop' : 'fullscreen-preview-canvas fullscreen-preview-canvas--mobile';

  return (
    <div className="fullscreen-preview-shell" data-testid="fullscreen-preview-shell">
      <header className="fullscreen-preview-toolbar">
        <div className="fullscreen-toolbar-left">
          <button type="button" data-testid="preview-back-to-builder" onClick={goBuilder} className="fullscreen-primary-button">← 返回 Builder</button>
          <div className="fullscreen-template-name">目前模板：<b>{data.visual?.selectedTemplateId || data.galleryTemplateId || data.template}</b></div>
        </div>
        <div className="fullscreen-toolbar-controls" aria-label="全螢幕預覽控制列">
          <div className="fullscreen-control-group" role="group" aria-label="模式切換">{(['desktop', 'mobile'] as PreviewMode[]).map(item => <button key={item} type="button" onClick={() => setMode(item)} className={mode === item ? 'fullscreen-control active' : 'fullscreen-control'}>{item === 'desktop' ? '桌機' : '手機'}</button>)}</div>
          <div className="fullscreen-control-group" role="group" aria-label="Viewport 切換">{viewportOptions.map(size => <button key={size} type="button" data-testid={`preview-viewport-${size}`} onClick={() => setViewport(size)} className={viewport === size ? 'fullscreen-control active' : 'fullscreen-control'}>{size}</button>)}</div>
          <div className="fullscreen-control-group" role="group" aria-label="Zoom 切換">{zoomOptions.map(item => <button key={item.value} type="button" data-testid={`preview-zoom-${item.value}`} onClick={() => setZoom(item.value)} className={zoom === item.value ? 'fullscreen-control active' : 'fullscreen-control'}>{item.label}</button>)}</div>
          <button type="button" onClick={goBuilder} className="fullscreen-secondary-button">關閉</button>
        </div>
      </header>
      <section ref={stageRef} className="fullscreen-preview-stage" data-preview-mode={mode} data-viewport={viewport} data-zoom={zoom}>
        <div className="fullscreen-preview-meta">{mode === 'desktop' ? '桌機' : '手機'}虛擬畫布：{viewport}px｜縮放：{zoom === 'fit' ? `Fit ${Math.round(scale * 100)}%` : `${Math.round(scale * 100)}%`}</div>
        <div className="fullscreen-preview-scroll" style={{ minHeight: scaledHeight }}>
          <div className={frameClass} data-testid="fullscreen-preview-canvas" data-mode={mode} data-viewport-width={viewport} style={{ width: viewport, transform: `scale(${scale})`, transformOrigin: 'top center' }}>
            {mode === 'mobile' && <div className="fullscreen-mobile-notch" />}
            <SitePreview data={data} />
          </div>
        </div>
      </section>
    </div>
  );
}
