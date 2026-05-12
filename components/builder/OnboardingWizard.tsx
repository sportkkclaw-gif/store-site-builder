'use client';

import { useState } from 'react';
import type { SiteData, IndustryType } from '@/types/site';
import { Button, Input } from '@/components/ui';
import { createDemoSiteData, type DemoKind } from '@/lib/demoSiteData';
import { getPrimaryRecommendedTemplate, getRecommendedTemplateIds, industryLabelToType, industryTypeToLabel, type BrandStyle } from '@/lib/onboardingRecommendations';
import { applyTemplatePresetSync } from '@/lib/applyTemplatePreset';
import { getTemplateById } from '@/lib/templateCatalog';

const industries = ['飲料店', '餐飲店', '咖啡廳', '小吃店', '其他'];
const styles: BrandStyle[] = ['清新日系', '高級質感', '活潑可愛', '溫暖手作', '極簡精品', '促銷活動感'];
const usageModes = ['我要自行匯出 ZIP', '我要申請店名片代管發布', '我先試用看看'];

function demoKindFromIndustry(industry: IndustryType): DemoKind {
  if (industry === 'restaurant' || industry === 'snack-shop') return 'restaurant';
  if (industry === 'cafe') return 'cafe';
  return 'drink';
}

function buildOnboardingData(base: SiteData, values: { industry: IndustryType; style: BrandStyle; storeName: string; tagline: string; phone: string; address: string; line: string; googleMap: string; usageMode: string }) {
  const demo = createDemoSiteData(demoKindFromIndustry(values.industry));
  let data: SiteData = {
    ...demo,
    industry: values.industry,
    store: {
      ...demo.store,
      name: values.storeName || demo.store.name,
      tagline: values.tagline || demo.store.tagline,
      phone: values.phone || demo.store.phone,
      address: values.address || demo.store.address,
    },
    hero: {
      ...demo.hero,
      title: values.tagline || demo.hero.title,
      subtitle: demo.hero.subtitle,
      ctaText: values.usageMode === '我要申請店名片代管發布' ? '申請代管發布' : '立即聯絡',
      ctaUrl: values.line || demo.links.line || '#contact',
    },
    links: { ...demo.links, line: values.line || demo.links.line, googleMap: values.googleMap || demo.links.googleMap },
    seo: { ...demo.seo, title: `${values.storeName || demo.store.name}｜${values.tagline || demo.store.tagline}`, description: demo.store.description },
  };
  const template = getPrimaryRecommendedTemplate(values.industry, values.style) || getTemplateById(getRecommendedTemplateIds(values.industry, values.style)[0]);
  if (template) data = applyTemplatePresetSync(data, template);
  return data;
}

export function OnboardingWizard({ open, initialData, onComplete, onClose }: { open: boolean; initialData: SiteData; onComplete: (data: SiteData) => void; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [industry, setIndustry] = useState<IndustryType>('drink-shop');
  const [style, setStyle] = useState<BrandStyle>('清新日系');
  const [storeName, setStoreName] = useState(initialData.store.name || '日沐茶飲');
  const [tagline, setTagline] = useState(initialData.store.tagline || '每天一杯，日常更美好');
  const [phone, setPhone] = useState(initialData.store.phone || '02-1234-5678');
  const [address, setAddress] = useState(initialData.store.address || '台北市大安區和平東路一段 100 號');
  const [line, setLine] = useState(initialData.links.line || 'https://line.me/R/ti/p/@qa');
  const [googleMap, setGoogleMap] = useState(initialData.links.googleMap || 'https://maps.google.com/');
  const [usageMode, setUsageMode] = useState('我先試用看看');
  if (!open) return null;
  const recommendedIds = getRecommendedTemplateIds(industry, style);
  const recommendedTemplates = recommendedIds.map(id => getTemplateById(id)).filter(Boolean);
  const finish = () => {
    const next = buildOnboardingData(initialData, { industry, style, storeName, tagline, phone, address, line, googleMap, usageMode });
    onComplete(next);
  };
  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" data-testid="onboarding-wizard">
      <div className="mx-auto my-6 w-full max-w-4xl rounded-[2rem] bg-white p-5 shadow-2xl md:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-teal-600">Step {step} / 5</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">開始建立店名片</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">回答幾個問題，系統會推薦模板、套用範例資料，並建立你的初始網站內容。</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-600">稍後再說</button>
        </div>
        <div className="mt-5 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${step * 20}%` }} /></div>

        {step === 1 && <div className="mt-7" data-testid="onboarding-step-1-industry"><h3 className="text-xl font-black">選擇店家類型</h3><div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-5">{industries.map(label => <button key={label} type="button" onClick={() => setIndustry(industryLabelToType(label))} className={`min-h-20 rounded-3xl border px-4 py-3 text-base font-black ${industryTypeToLabel(industry) === label ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-700'}`}>{label}</button>)}</div></div>}
        {step === 2 && <div className="mt-7" data-testid="onboarding-step-2-style"><h3 className="text-xl font-black">選擇品牌風格</h3><div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">{styles.map(item => <button key={item} type="button" onClick={() => setStyle(item)} className={`min-h-20 rounded-3xl border px-4 py-3 text-base font-black ${style === item ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-700'}`}>{item}</button>)}</div><div className="mt-5 rounded-3xl bg-slate-50 p-4"><b>推薦模板：</b><span data-testid="recommended-templates"> {recommendedTemplates.map(t => t?.name).join(' / ')}</span><p className="mt-1 text-sm text-slate-500">完成後會自動套用第一推薦模板，你也可以稍後在模板庫中更換。</p></div></div>}
        {step === 3 && <div className="mt-7" data-testid="onboarding-step-3-basic-info"><h3 className="text-xl font-black">填入基本資料</h3><div className="mt-4 grid gap-4 md:grid-cols-2"><Input label="店名" value={storeName} onChange={e => setStoreName(e.target.value)} /><Input label="一句話標語" value={tagline} onChange={e => setTagline(e.target.value)} /><Input label="電話" value={phone} onChange={e => setPhone(e.target.value)} /><Input label="地址" value={address} onChange={e => setAddress(e.target.value)} /><Input label="LINE 連結" value={line} onChange={e => setLine(e.target.value)} /><Input label="Google Maps 連結" value={googleMap} onChange={e => setGoogleMap(e.target.value)} /></div></div>}
        {step === 4 && <div className="mt-7" data-testid="onboarding-step-4-usage-mode"><h3 className="text-xl font-black">選擇使用方式</h3><div className="mt-4 grid gap-3 md:grid-cols-3">{usageModes.map(item => <button key={item} type="button" onClick={() => setUsageMode(item)} className={`min-h-24 rounded-3xl border px-4 py-3 text-base font-black ${usageMode === item ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-700'}`}>{item}</button>)}</div></div>}
        {step === 5 && <div className="mt-7" data-testid="onboarding-step-5-create"><h3 className="text-xl font-black">自動建立</h3><div className="mt-4 grid gap-3 md:grid-cols-2">{['推薦模板', '套用範例資料', '建立初始 siteData', '進入 Builder'].map(item => <div key={item} className="rounded-3xl bg-emerald-50 p-4 font-black text-emerald-800 ring-1 ring-emerald-100">✓ {item}</div>)}</div><p className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm font-bold text-slate-600">你選擇了 {industryTypeToLabel(industry)} / {style} / {usageMode}，系統會套用 {recommendedTemplates[0]?.name || '推薦模板'}。</p></div>}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button variant="secondary" onClick={() => step === 1 ? onClose() : setStep(step - 1)}>{step === 1 ? '稍後再說' : '上一步'}</Button>
          {step < 5 ? <Button onClick={() => setStep(step + 1)}>下一步</Button> : <Button onClick={finish}>建立並進入 Builder</Button>}
        </div>
      </div>
    </div>
  );
}
