'use client';

import { useEffect, useState } from 'react';
import type { BuilderSection, SiteData } from '@/types/site';
import { createDefaultSiteData } from '@/lib/defaultSiteData';
import { exportSiteDataAsJson, loadSiteData, resetToDefault, saveSiteData } from '@/lib/storage';
import { exportZip } from '@/lib/exportZip';
import { BuilderLayout } from '@/components/builder/BuilderLayout';
import { BasicInfoForm } from '@/components/builder/BasicInfoForm';
import { TemplateSelector } from '@/components/builder/TemplateSelector';
import { BrandStyleForm } from '@/components/builder/BrandStyleForm';
import { MediaManager } from '@/components/builder/MediaManager';
import { MenuManager } from '@/components/builder/MenuManager';
import { LinksForm } from '@/components/builder/LinksForm';
import { SeoForm } from '@/components/builder/SeoForm';
import { ModuleToggleForm } from '@/components/builder/ModuleToggleForm';
import { ImportExportJson } from '@/components/builder/ImportExportJson';
import { ExportPanel } from '@/components/builder/ExportPanel';
import { Badge, Button, Card, SectionHeader } from '@/components/ui';
import { getTemplateById } from '@/lib/templateCatalog';

const templateNames: Record<SiteData['template'], string> = { 'fresh-japanese': '清新日系', 'premium-minimal': '質感極簡', 'playful-colorful': '活潑可愛' };

function Overview({ data, onStart, onReset }: { data: SiteData; onStart: () => void; onReset: () => void }) {
  const productCount = data.menu.categories.reduce((sum, category) => sum + category.items.length, 0);
  const selectedTemplateName = getTemplateById(data.galleryTemplateId)?.name || templateNames[data.template];
  return <div className="grid gap-5"><Card className="bg-gradient-to-br from-white to-teal-50"><SectionHeader eyebrow="Overview" title="網站總覽" description="從左側選單編輯資料，右側正式 Preview 會即時同步。" /><div className="grid gap-3 md:grid-cols-4">{[['模板', selectedTemplateName], ['商品', `${productCount} 項`], ['圖片', `${data.media.length} 張`], ['模組', `${Object.values(data.modules).filter(Boolean).length}/9 開啟`]].map(([label, value]) => <div key={label} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200"><p className="text-xs font-black text-slate-400">{label}</p><b className="mt-1 block text-slate-900">{value}</b></div>)}</div><div className="mt-5 flex flex-wrap gap-2"><Button onClick={onStart}>開始編輯基本資料</Button><Button variant="secondary" onClick={onReset}>重設預設資料</Button><Badge tone="green">localStorage 自動儲存</Badge></div></Card><Card><SectionHeader title="交付檢查" description="此版本不新增登入、付款、資料庫或自訂網域，只改善視覺產品化與模板品質。" /><div className="grid gap-3 md:grid-cols-2">{['siteData 單一資料來源', '30 套 AI 模板連接 Preview', 'JSON 匯入匯出', 'ZIP 靜態網站匯出', '離線 index.html', '390px RWD'].map(item => <div key={item} className="rounded-2xl bg-slate-50 p-4 font-bold text-slate-700 ring-1 ring-slate-200">✓ {item}</div>)}</div></Card></div>;
}

export default function BuilderPage() {
  const [data, setData] = useState<SiteData>(createDefaultSiteData());
  const [loaded, setLoaded] = useState(false);
  const [section, setSection] = useState<BuilderSection>('overview');
  const [status, setStatus] = useState('尚未載入');

  useEffect(() => { setData(loadSiteData()); setLoaded(true); setStatus('已載入草稿'); }, []);
  useEffect(() => { if (!loaded) return; setStatus('自動儲存中…'); const timer = setTimeout(() => { saveSiteData(data); setStatus('已自動儲存'); }, 300); return () => clearTimeout(timer); }, [data, loaded]);

  const content = section === 'overview' ? <Overview data={data} onStart={() => setSection('basic')} onReset={() => setData(resetToDefault())} /> : section === 'basic' ? <BasicInfoForm data={data} onChange={setData} /> : section === 'template' ? <TemplateSelector data={data} onChange={setData} /> : section === 'brand' ? <BrandStyleForm data={data} onChange={setData} /> : section === 'media' ? <MediaManager data={data} onChange={setData} /> : section === 'menu' ? <MenuManager data={data} onChange={setData} /> : section === 'links' ? <LinksForm data={data} onChange={setData} /> : section === 'seo' ? <SeoForm data={data} onChange={setData} /> : section === 'modules' ? <ModuleToggleForm data={data} onChange={setData} /> : section === 'json' ? <ImportExportJson data={data} onImport={setData} /> : <ExportPanel data={data} onExportZip={() => exportZip(data)} />;

  return <BuilderLayout data={data} section={section} setSection={setSection} status={status} onSave={() => { saveSiteData(data); setStatus('已手動儲存'); }} onExportJson={() => exportSiteDataAsJson(data)} onExportZip={() => exportZip(data)}>{content}</BuilderLayout>;
}
