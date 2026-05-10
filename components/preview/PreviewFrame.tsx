'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { SiteData } from '@/types/site';
import { DesktopPreview } from './DesktopPreview';
import { MobilePreview } from './MobilePreview';
import { Tabs } from '@/components/ui';
import { getCurrentTemplate } from '@/lib/currentTemplate';
import { getTemplateVisualStyle } from '@/lib/templateVisualStyle';
import { saveSiteData, migrateSiteData, PREVIEW_SESSION_KEY } from '@/lib/storage';

export function PreviewFrame({ data, onBackToEdit }: { data: SiteData; onBackToEdit?: () => void }) {
  const router = useRouter();
  const [mode, setMode] = useState<'desktop' | 'mobile'>('desktop');
  const selectedTemplateName = getCurrentTemplate(data).name;
  const visual = getTemplateVisualStyle(data);
  const openFullscreenPreview = (targetMode: 'desktop' | 'mobile' = mode) => {
    const safeData = migrateSiteData(data);
    const viewport = targetMode === 'mobile' ? 390 : 1440;
    const previewUrl = `/preview?mode=${targetMode}&viewport=${viewport}&from=builder&t=${Date.now()}`;
    try {
      saveSiteData(safeData);
      window.sessionStorage.setItem(PREVIEW_SESSION_KEY, JSON.stringify(safeData));
      router.push(previewUrl);
    } catch {
      window.location.assign(previewUrl);
    }
  };
  return (
    <div className="preview-panel" data-testid="preview-panel">
      <div className="preview-mobile-toolbar mb-3" data-testid="mobile-preview-toolbar">
        <button type="button" data-testid="back-to-edit-button" onClick={onBackToEdit} className="mobile-preview-back-button">← 返回編輯</button>
        <div className="mobile-preview-template-label">目前模板：<b>{selectedTemplateName}</b></div>
        <button type="button" data-testid="mobile-fullscreen-preview-button" onClick={() => openFullscreenPreview('mobile')} className="mobile-fullscreen-preview-button">全螢幕預覽</button>
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
        <p className="mt-1 text-xs font-bold text-slate-500">虛擬畫布：{mode === 'mobile' ? '390px' : '1440px'}</p>
        <p className="text-xs font-bold text-slate-500">縮放：Fit</p>
        <button type="button" data-testid="fullscreen-preview-button" onClick={() => openFullscreenPreview(mode)} className="fullscreen-preview-button mt-3 w-full rounded-full bg-slate-950 px-4 text-sm font-black text-white shadow-lg shadow-slate-900/20 hover:bg-teal-700">全螢幕預覽</button>
      </div>
      <div className="mt-4" data-testid="preview-viewport">{mode === 'desktop' ? <DesktopPreview data={data} /> : <MobilePreview data={data} />}</div>
    </div>
  );
}
