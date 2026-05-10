'use client';

import { useState } from 'react';
import type { SiteData } from '@/types/site';
import { DesktopPreview } from './DesktopPreview';
import { MobilePreview } from './MobilePreview';
import { Tabs } from '@/components/ui';
import { getTemplateById } from '@/lib/templateCatalog';
import { getTemplateVisualStyle } from '@/lib/templateVisualStyle';
import { saveSiteData } from '@/lib/storage';

const names: Record<SiteData['template'], string> = { 'fresh-japanese': '清新日系', 'premium-minimal': '質感極簡', 'playful-colorful': '活潑可愛' };

export function PreviewFrame({ data, onBackToEdit }: { data: SiteData; onBackToEdit?: () => void }) {
  const [mode, setMode] = useState<'desktop' | 'mobile'>('desktop');
  const selectedTemplateName = getTemplateById(data.galleryTemplateId)?.name || names[data.template];
  const visual = getTemplateVisualStyle(data);
  const openFullscreenPreview = () => {
    saveSiteData(data);
    window.location.href = '/preview';
  };
  return (
    <div className="preview-panel" data-testid="preview-panel">
      <div className="preview-mobile-back mb-3">
        <button type="button" onClick={onBackToEdit} className="min-h-11 rounded-full bg-slate-950 px-4 text-sm font-black text-white shadow-lg">← 返回編輯</button>
      </div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-slate-500">目前模板</p>
          <b data-testid="preview-template-name">{selectedTemplateName}</b>
          <p className="mt-1 text-xs font-bold text-slate-500">風格：{visual.styleLabel}</p>
        </div>
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">即時更新</span>
      </div>
      <Tabs value={mode} onChange={setMode} items={[{ value: 'desktop', label: '桌機' }, { value: 'mobile', label: '手機' }]} />
      <div className="mt-3 rounded-[24px] border border-teal-200 bg-white/90 p-3 shadow-sm" data-testid="preview-panel-scale-note">
        <p className="text-xs font-black text-slate-900">桌機預覽｜縮放顯示</p>
        <p className="mt-1 text-xs font-bold text-slate-500">虛擬畫布：1440px</p>
        <p className="text-xs font-bold text-slate-500">縮放：Fit</p>
        <button type="button" data-testid="fullscreen-preview-button" onClick={openFullscreenPreview} className="mt-3 min-h-11 w-full rounded-full bg-slate-950 px-4 text-sm font-black text-white shadow-lg shadow-slate-900/20 hover:bg-teal-700">全螢幕預覽</button>
      </div>
      <div className="mt-4" data-testid="preview-viewport">{mode === 'desktop' ? <DesktopPreview data={data} /> : <MobilePreview data={data} />}</div>
    </div>
  );
}
