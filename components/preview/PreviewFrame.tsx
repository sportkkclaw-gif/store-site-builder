'use client';

import { useState } from 'react';
import type { SiteData } from '@/types/site';
import { DesktopPreview } from './DesktopPreview';
import { MobilePreview } from './MobilePreview';
import { Tabs } from '@/components/ui';

const names: Record<SiteData['template'], string> = {
  'fresh-japanese': '清新日系',
  'premium-minimal': '質感極簡',
  'playful-colorful': '活潑可愛',
};

export function PreviewFrame({ data }: { data: SiteData }) {
  const [mode, setMode] = useState<'desktop' | 'mobile'>('desktop');
  return (
    <div className="preview-panel" data-testid="preview-panel">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">目前模板</p>
          <b data-testid="preview-template-name">{names[data.template]}</b>
        </div>
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">即時更新</span>
      </div>
      <Tabs value={mode} onChange={setMode} items={[{ value: 'desktop', label: '桌機' }, { value: 'mobile', label: '手機' }]} />
      <div className="mt-4" data-testid="preview-viewport">
        {mode === 'desktop' ? <DesktopPreview data={data} /> : <MobilePreview data={data} />}
      </div>
    </div>
  );
}
