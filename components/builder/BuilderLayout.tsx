'use client';

import { useState } from 'react';
import type { BuilderSection, SiteData } from '@/types/site';
import { BuilderSidebar } from './BuilderSidebar';
import { BuilderTopbar } from './BuilderTopbar';
import { PreviewFrame } from '@/components/preview/PreviewFrame';
import { Tabs } from '@/components/ui';

const mobileSections: { value: BuilderSection; label: string }[] = [
  { value: 'overview', label: '總覽' },
  { value: 'basic', label: '基本資料' },
  { value: 'template', label: '模板選擇' },
  { value: 'brand', label: '品牌樣式' },
  { value: 'media', label: '圖片媒體' },
  { value: 'menu', label: '菜單 / 商品' },
  { value: 'links', label: '連結設定' },
  { value: 'seo', label: 'SEO 設定' },
  { value: 'modules', label: '功能模組' },
  { value: 'json', label: '匯入匯出' },
  { value: 'export', label: '匯出網站' },
];

export function BuilderLayout({
  data,
  section,
  setSection,
  children,
  onSave,
  onExportJson,
  onExportZip,
  status,
}: {
  data: SiteData;
  section: BuilderSection;
  setSection: (s: BuilderSection) => void;
  children: React.ReactNode;
  onSave: () => void;
  onExportJson: () => void;
  onExportZip: () => void;
  status: string;
}) {
  const [mobileMode, setMobileMode] = useState<'edit' | 'preview'>('edit');

  return (
    <div className="builder-shell" data-testid="builder-shell">
      <BuilderSidebar active={section} onChange={setSection} />

      <main className={`builder-main ${mobileMode === 'preview' ? 'builder-main--mobile-hidden' : ''}`} data-testid="builder-main">
        <div className="builder-mobile-controls" data-testid="builder-mobile-controls">
          <Tabs value={mobileMode} onChange={setMobileMode} items={[{ value: 'edit', label: '編輯' }, { value: 'preview', label: '預覽' }]} />
          <label className="mt-3 grid gap-1 text-sm font-semibold text-slate-700">
            功能選單
            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2"
              value={section}
              onChange={(event) => setSection(event.target.value as BuilderSection)}
            >
              {mobileSections.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>
        </div>

        <BuilderTopbar data={data} status={status} onSave={onSave} onExportJson={onExportJson} onExportZip={onExportZip} />
        <div className="builder-content" data-testid="builder-content">
          {children}
        </div>
      </main>

      <aside className={`builder-preview-column ${mobileMode === 'edit' ? 'builder-preview-column--mobile-hidden' : ''}`} data-testid="builder-preview-column">
        <PreviewFrame data={data} />
      </aside>
    </div>
  );
}
