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
import { OnboardingWizard } from '@/components/builder/OnboardingWizard';
import { DemoDataPanel } from '@/components/builder/DemoDataPanel';
import { Badge, Button, Card, SectionHeader } from '@/components/ui';
import { getTemplateById } from '@/lib/templateCatalog';
import { getPublishReadiness } from '@/lib/publishReadiness';

const templateNames: Record<SiteData['template'], string> = { 'fresh-japanese': '清新日系', 'premium-minimal': '質感極簡', 'playful-colorful': '活潑可愛' };

function Overview({ data, onStart, onReset, onOpenWizard, onApplyDemo }: { data: SiteData; onStart: () => void; onReset: () => void; onOpenWizard: () => void; onApplyDemo: (data: SiteData) => void }) {
  const productCount = data.menu.categories.reduce((sum, category) => sum + category.items.length, 0);
  const selectedTemplateName = getTemplateById(data.galleryTemplateId)?.name || templateNames[data.template];
  const readiness = getPublishReadiness(data);
  return <div className="grid gap-5">
    <Card className="bg-gradient-to-br from-white to-teal-50"><SectionHeader eyebrow="店名片 Builder" title="網站總覽" description="從左側選單編輯資料，右側正式 Preview 會即時同步。" /><div className="grid gap-3 md:grid-cols-5">{[['模板', selectedTemplateName], ['商品', `${productCount} 項`], ['圖片', `${data.media.length} 張`], ['模組', `${Object.values(data.modules).filter(Boolean).length}/9 開啟`], ['發布檢查', `${readiness.score}%`]].map(([label, value]) => <div key={label} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200"><p className="text-xs font-black text-slate-400">{label}</p><b className="mt-1 block text-slate-900">{value}</b></div>)}</div><div className="mt-5 flex flex-wrap gap-2"><Button onClick={onOpenWizard}>重新開始 5 步導引</Button><Button variant="secondary" onClick={onStart}>開始編輯基本資料</Button><Button variant="ghost" onClick={onReset}>重設預設資料</Button><Badge tone={readiness.status === 'ready' ? 'green' : readiness.status === 'warning' ? 'amber' : 'red'}>{readiness.status === 'ready' ? '可發布' : '需補資料'}</Badge></div></Card>
    <DemoDataPanel onApply={onApplyDemo} />
    <Card><SectionHeader title="v0.3.0 本輪範圍" description="只做品牌改名、導引、範例資料、發布檢查與代管申請入口。" /><div className="grid gap-3 md:grid-cols-2">{['不新增登入 / 資料庫 / 金流', '不做多專案管理', 'ZIP 與 JSON 匯出保留', '390px 手機導引不可破版', '代管申請以 JSON 半自動流轉', '發布檢查只警告不阻擋'].map(item => <div key={item} className="rounded-2xl bg-slate-50 p-4 font-bold text-slate-700 ring-1 ring-slate-200">✓ {item}</div>)}</div></Card>
  </div>;
}

export default function BuilderPage() {
  const [data, setData] = useState<SiteData>(createDefaultSiteData());
  const [loaded, setLoaded] = useState(false);
  const [section, setSection] = useState<BuilderSection>('overview');
  const [status, setStatus] = useState('尚未載入');
  const [wizardOpen, setWizardOpen] = useState(false);

  useEffect(() => {
    setData(loadSiteData());
    setLoaded(true);
    setStatus('已載入草稿');
    const params = new URLSearchParams(window.location.search);
    if (params.get('onboarding') === '1') setWizardOpen(true);
  }, []);
  useEffect(() => { if (!loaded) return; setStatus('自動儲存中…'); const timer = setTimeout(() => { saveSiteData(data); setStatus('已自動儲存'); }, 300); return () => clearTimeout(timer); }, [data, loaded]);

  const applyData = (next: SiteData) => { setData(next); saveSiteData(next); setStatus('已套用資料'); setSection('overview'); };
  const completeWizard = (next: SiteData) => { applyData(next); setWizardOpen(false); setStatus('已完成 5 步導引'); };
  const content = section === 'overview' ? <Overview data={data} onStart={() => setSection('basic')} onReset={() => applyData(resetToDefault())} onOpenWizard={() => setWizardOpen(true)} onApplyDemo={applyData} /> : section === 'basic' ? <div className="grid gap-5"><DemoDataPanel onApply={applyData} /><BasicInfoForm data={data} onChange={setData} /></div> : section === 'template' ? <TemplateSelector data={data} onChange={setData} /> : section === 'brand' ? <BrandStyleForm data={data} onChange={setData} /> : section === 'media' ? <MediaManager data={data} onChange={setData} /> : section === 'menu' ? <MenuManager data={data} onChange={setData} /> : section === 'links' ? <LinksForm data={data} onChange={setData} /> : section === 'seo' ? <SeoForm data={data} onChange={setData} /> : section === 'modules' ? <ModuleToggleForm data={data} onChange={setData} /> : section === 'json' ? <ImportExportJson data={data} onImport={setData} /> : <ExportPanel data={data} onExportZip={() => exportZip(data)} />;

  return <><BuilderLayout data={data} section={section} setSection={setSection} status={status} onSave={() => { saveSiteData(data); setStatus('已手動儲存'); }} onExportJson={() => exportSiteDataAsJson(data)} onExportZip={() => exportZip(data)}>{content}</BuilderLayout><OnboardingWizard open={wizardOpen} initialData={data} onComplete={completeWizard} onClose={() => setWizardOpen(false)} /></>;
}
