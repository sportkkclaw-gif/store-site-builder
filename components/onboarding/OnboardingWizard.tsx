'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import type { SiteData } from '@/types/site';
import { createDefaultSiteData } from '@/lib/defaultSiteData';
import { saveSiteData } from '@/lib/storage';
import { applyTemplatePresetSync } from '@/lib/applyTemplatePreset';
import { getTemplateById } from '@/lib/templateCatalog';
import { getOnboardingRecommendations, getPrimaryRecommendedTemplate, industryToSiteIndustry, type OnboardingIndustry, type OnboardingStyle } from '@/lib/onboardingRecommendations';
import { validateOnboardingBasicInfo, type OnboardingBasicInfoErrors } from '@/lib/onboardingValidation';

const industries: OnboardingIndustry[] = ['飲料店', '餐飲店', '咖啡廳', '小吃店', '其他'];
const styles: OnboardingStyle[] = ['清新日系', '高級質感', '活潑可愛', '溫暖手作', '極簡精品', '促銷活動感'];
const usageModes = ['我要自行匯出 ZIP', '我要申請店名片代管發布', '我先試用看看'];

export function OnboardingWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [industry, setIndustry] = useState<OnboardingIndustry>('飲料店');
  const [style, setStyle] = useState<OnboardingStyle>('清新日系');
  const [usage, setUsage] = useState('我先試用看看');
  const [basic, setBasic] = useState({ name: '', tagline: '', phone: '', address: '', line: '', googleMap: '' });
  const [basicErrors, setBasicErrors] = useState<OnboardingBasicInfoErrors>({});
  const [showBasicSummary, setShowBasicSummary] = useState(false);

  if (!open) return null;

  const recommended = getOnboardingRecommendations(industry, style);
  const setBasicField = (field: keyof typeof basic, value: string) => {
    const nextBasic = { ...basic, [field]: value };
    setBasic(nextBasic);
    if (showBasicSummary) {
      const validation = validateOnboardingBasicInfo(nextBasic);
      setBasicErrors(validation.errors);
      if (validation.ok) setShowBasicSummary(false);
    }
  };
  const validateStep3 = () => {
    const validation = validateOnboardingBasicInfo(basic);
    setBasicErrors(validation.errors);
    setShowBasicSummary(!validation.ok);
    return validation;
  };
  const goNext = () => {
    if (step === 3) {
      const validation = validateStep3();
      if (!validation.ok) return;
      setBasic(validation.normalized);
    }
    setStep(step + 1);
  };
  const finish = () => {
    const validation = validateOnboardingBasicInfo(basic);
    if (!validation.ok) {
      setStep(3);
      setBasicErrors(validation.errors);
      setShowBasicSummary(true);
      return;
    }
    const normalizedBasic = validation.normalized;
    const templateId = getPrimaryRecommendedTemplate(industry, style);
    const template = getTemplateById(templateId);
    const defaults = createDefaultSiteData();
    const fallbackName = normalizedBasic.name;
    let data: SiteData = {
      ...defaults,
      id: `denmeipian-${Date.now()}`,
      industry: industryToSiteIndustry[industry],
      store: { ...defaults.store, name: fallbackName, tagline: normalizedBasic.tagline, phone: normalizedBasic.phone, address: normalizedBasic.address },
      hero: { ...defaults.hero, title: normalizedBasic.tagline, subtitle: '選模板、填資料、放菜單、加 LINE 與外送連結。', ctaText: normalizedBasic.line ? '加入 LINE' : '查看地圖', ctaUrl: normalizedBasic.line || normalizedBasic.googleMap || '#contact' },
      links: { ...defaults.links, line: normalizedBasic.line, googleMap: normalizedBasic.googleMap },
      seo: { ...defaults.seo, title: `${fallbackName}｜店名片`, description: `${fallbackName} 的菜單、地址、LINE 與店家資訊。`, slug: fallbackName.toLowerCase().replace(/\s+/g, '-') },
    };
    if (template) data = applyTemplatePresetSync(data, template);
    saveSiteData(data);
    sessionStorage.setItem('denmeipian-onboarding', JSON.stringify({ industry, style, usage, recommended, templateId, createdAt: new Date().toISOString() }));
    router.push('/builder');
  };
  const option = (selected: boolean) => `rounded-3xl border p-4 text-left font-black transition ${selected ? 'border-teal-500 bg-teal-50 text-teal-800 ring-4 ring-teal-100' : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300'}`;
  const currentStep3Invalid = step === 3 && showBasicSummary && !validateOnboardingBasicInfo(basic).ok;
  const errorText = (message?: string) => message ? <p className="mt-2 text-sm font-black text-red-600" role="alert">{message}</p> : null;

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm" data-testid="onboarding-wizard">
      <div className="mx-auto my-6 w-full max-w-4xl rounded-[2rem] bg-white p-5 shadow-2xl md:p-8">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.24em] text-teal-600">Denmeipian Onboarding</p><h2 className="mt-2 text-2xl font-black md:text-4xl">開始建立店名片</h2><p className="mt-2 text-sm leading-6 text-slate-600">5 步驟完成初始資料與推薦模板，你可以稍後在模板庫中更換模板。</p></div><button type="button" onClick={onClose} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-600">關閉</button></div>
        <div className="mt-5 grid grid-cols-5 gap-2">{[1, 2, 3, 4, 5].map(n => <div key={n} className={`h-2 rounded-full ${n <= step ? 'bg-teal-500' : 'bg-slate-200'}`} />)}</div>
        {step === 1 && <section className="mt-7" data-testid="onboarding-step-1"><h3 className="text-xl font-black">Step 1：選擇店家類型</h3><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{industries.map(item => <button key={item} type="button" onClick={() => setIndustry(item)} className={option(industry === item)}>{item}</button>)}</div></section>}
        {step === 2 && <section className="mt-7" data-testid="onboarding-step-2"><h3 className="text-xl font-black">Step 2：選擇品牌風格</h3><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{styles.map(item => <button key={item} type="button" onClick={() => setStyle(item)} className={option(style === item)}>{item}</button>)}</div></section>}
        {step === 3 && <section className="mt-7" data-testid="onboarding-step-3"><h3 className="text-xl font-black">Step 3：填入基本資料</h3><div className="mt-4 grid gap-4 md:grid-cols-2"><div><Input label="店名" value={basic.name} onChange={e => setBasicField('name', e.target.value)} placeholder="QA 茶飲" />{errorText(basicErrors.storeName)}</div><div><Input label="品牌標語" value={basic.tagline} onChange={e => setBasicField('tagline', e.target.value)} placeholder="每天一杯，日常更美好" />{errorText(basicErrors.tagline)}</div><div><Input label="電話" value={basic.phone} onChange={e => setBasicField('phone', e.target.value)} placeholder="02-2345-6789" />{errorText(basicErrors.phoneOrLine)}</div><div><Input label="地址" value={basic.address} onChange={e => setBasicField('address', e.target.value)} placeholder="台北市中正區開封街一段 1 號" />{errorText(basicErrors.addressOrMap)}</div><div><Input label="LINE 連結" value={basic.line} onChange={e => setBasicField('line', e.target.value)} placeholder="qa-line 或 https://line.me/R/ti/p/@qa" />{errorText(basicErrors.line)}</div><div><Input label="Google Maps 連結" value={basic.googleMap} onChange={e => setBasicField('googleMap', e.target.value)} placeholder="https://maps.google.com/..." />{errorText(basicErrors.googleMap)}</div></div>{showBasicSummary && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-700" role="alert">請先補齊必要資料，才能繼續建立店名片。</p>}</section>}
        {step === 4 && <section className="mt-7" data-testid="onboarding-step-4"><h3 className="text-xl font-black">Step 4：選擇使用方式</h3><div className="mt-4 grid gap-3 md:grid-cols-3">{usageModes.map(item => <button key={item} type="button" onClick={() => setUsage(item)} className={option(usage === item)}>{item}</button>)}</div></section>}
        {step === 5 && <section className="mt-7" data-testid="onboarding-step-5"><h3 className="text-xl font-black">Step 5：自動建立</h3><div className="mt-4 rounded-3xl bg-teal-50 p-5 ring-1 ring-teal-100"><p className="font-bold text-slate-700">推薦模板：</p><p className="mt-2 text-2xl font-black text-teal-800">{recommended.join(' / ')}</p><p className="mt-3 text-sm font-bold text-slate-600">會自動套用第一推薦模板並進入 Builder。你可以稍後在模板庫中更換模板。</p></div></section>}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-between"><Button variant="secondary" onClick={() => step === 1 ? onClose() : setStep(step - 1)}>{step === 1 ? '取消' : '上一步'}</Button>{step < 5 ? <Button onClick={goNext} disabled={currentStep3Invalid} aria-disabled={currentStep3Invalid} className={currentStep3Invalid ? 'border-slate-200 bg-slate-200 text-slate-500 shadow-none hover:bg-slate-200 hover:translate-y-0' : ''}>下一步</Button> : <Button onClick={finish} data-testid="complete-onboarding">建立店名片並進入 Builder</Button>}</div>
      </div>
    </div>
  );
}

export function OnboardingStartButton({ className, children = '開始建立店名片' }: { className?: string; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <button type="button" data-testid="home-start-onboarding" onClick={() => setOpen(true)} className={className || 'rounded-full bg-teal-600 px-7 py-4 text-center font-black text-white shadow-2xl shadow-teal-700/25 transition hover:-translate-y-0.5 hover:bg-teal-700'}>{children}</button>
      {mounted ? createPortal(<OnboardingWizard open={open} onClose={() => setOpen(false)} />, document.body) : null}
    </>
  );
}
