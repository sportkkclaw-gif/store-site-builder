'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) setMode('mobile');
  }, []);

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
      <div className="preview-control-panel" data-testid="preview-control-panel">
        <div className="preview-control-header">
          <div className="min-w-0">
            <p className="preview-control-eyebrow">目前模板</p>
            <b data-testid="preview-template-name" className="preview-control-title">{selectedTemplateName}</b>
            <p className="preview-control-style">風格：{visual.styleLabel}</p>
          </div>
          <span className="preview-live-badge">即時更新</span>
        </div>
        <div className="preview-control-actions" data-testid="mobile-preview-toolbar">
          <button type="button" data-testid="back-to-edit-button" onClick={onBackToEdit} className="mobile-preview-back-button">返回編輯</button>
          <div className="preview-mode-tabs"><Tabs value={mode} onChange={setMode} items={[{ value: 'desktop', label: '桌機' }, { value: 'mobile', label: '手機' }]} /></div>
          <button type="button" data-testid="fullscreen-preview-button" onClick={() => openFullscreenPreview(mode)} className="fullscreen-preview-button">全螢幕預覽</button>
        </div>
        <div className="preview-mode-summary" data-testid="preview-panel-scale-note">
          <b>{mode === 'mobile' ? '手機預覽' : '桌機預覽'}｜縮放顯示</b>
          <span>虛擬畫布：{mode === 'mobile' ? '390px' : '1440px'}</span>
          <span>縮放：Fit</span>
        </div>
      </div>
      <div className="mt-4" data-testid="preview-viewport">{mode === 'desktop' ? <DesktopPreview data={data} /> : <MobilePreview data={data} />}</div>
    </div>
  );
}
