import type { ChangeEvent } from 'react';
import type { MediaAsset, SiteData } from '@/types/site';
import { Button, Card, Input, SectionHeader, Textarea } from '@/components/ui';
import { validateImage } from '@/lib/validators';
import { getHeroImageSource, getHeroImageMode, getCustomHeroMedia } from '@/lib/heroImage';

const selectableTypes: MediaAsset['type'][] = ['hero', 'product', 'store', 'other'];

export function BasicInfoForm({ data, onChange }: { data: SiteData; onChange: (d: SiteData) => void }) {
  const setStore = (key: keyof SiteData['store'], value: string) => onChange({ ...data, store: { ...data.store, [key]: value } });
  const setHero = (key: keyof SiteData['hero'], value: string) => onChange({ ...data, hero: { ...data.hero, [key]: value } });
  const heroMode = getHeroImageMode(data);
  const heroSource = getHeroImageSource(data);
  const customMedia = getCustomHeroMedia(data);
  const mediaChoices = data.media.filter(m => selectableTypes.includes(m.type));

  const setHeroMode = (mode: 'template' | 'custom') => onChange({ ...data, hero: { ...data.hero, imageMode: mode } });
  const selectHeroImage = (id: string) => onChange({ ...data, hero: { ...data.hero, imageMode: 'custom', imageId: id } });
  const clearCustomHero = () => onChange({ ...data, hero: { ...data.hero, imageMode: 'template', imageId: undefined } });
  const uploadHero = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const err = validateImage(file);
    if (err) { alert(err); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const media: MediaAsset = { id: `hero-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: file.name, type: 'hero', mimeType: file.type, dataUrl: String(reader.result) };
      onChange({ ...data, media: [...data.media, media], hero: { ...data.hero, imageMode: 'custom', imageId: media.id } });
    };
    reader.readAsDataURL(file);
  };
  const resetFileInput = (e: ChangeEvent<HTMLInputElement>) => { uploadHero(e.target.files); e.currentTarget.value = ''; };

  return (
    <div className="grid gap-5">
      <Card><SectionHeader eyebrow="Basic" title="基本資料" description="店名、聯絡資訊與營業資訊會同步顯示在模板與匯出網站。" /><div className="grid gap-4 md:grid-cols-2"><Input label="店名" placeholder="日沐茶飲" value={data.store.name} onChange={e => setStore('name', e.target.value)} helperText="會顯示於 Header / Footer" /><Input label="品牌標語" placeholder="每天一杯，日常更美好" value={data.store.tagline} onChange={e => setStore('tagline', e.target.value)} /><Input label="電話" placeholder="02-1234-5678" value={data.store.phone} onChange={e => setStore('phone', e.target.value)} /><Input label="Email" placeholder="hello@example.com" value={data.store.email} onChange={e => setStore('email', e.target.value)} /><Input label="地址" className="md:col-span-2" placeholder="台北市大安區..." value={data.store.address} onChange={e => setStore('address', e.target.value)} /><Input label="營業時間" className="md:col-span-2" placeholder="每日 10:00 - 22:00" value={data.store.businessHours} onChange={e => setStore('businessHours', e.target.value)} /><Textarea label="店家簡介" className="md:col-span-2" value={data.store.description} onChange={e => setStore('description', e.target.value)} helperText="建議 60–120 字，作為品牌故事區塊。" /></div></Card>
      <Card><SectionHeader eyebrow="Hero" title="首頁主視覺文案" description="第一眼看到的標題、副標與行動按鈕。" /><div className="grid gap-4"><Input label="Hero 標題" value={data.hero.title} onChange={e => setHero('title', e.target.value)} /><Textarea label="Hero 副標" value={data.hero.subtitle} onChange={e => setHero('subtitle', e.target.value)} /><div className="grid gap-4 md:grid-cols-2"><Input label="CTA 文字" value={data.hero.ctaText} onChange={e => setHero('ctaText', e.target.value)} /><Input label="CTA 連結" value={data.hero.ctaUrl} onChange={e => setHero('ctaUrl', e.target.value)} /></div></div></Card>
      <Card><SectionHeader eyebrow="Hero Image" title="Hero 主視覺圖片" description="你可以使用模板預設主視覺，也可以上傳自己的店面照、商品照或品牌主圖。" />
        <div data-testid="hero-image-settings" className="grid gap-5">
          <div className="grid gap-3 md:grid-cols-2" role="radiogroup" aria-label="Hero 主視覺圖片模式">
            <button type="button" data-testid="hero-mode-template" role="radio" aria-checked={heroMode === 'template'} onClick={() => setHeroMode('template')} className={`rounded-3xl border p-4 text-left transition ${heroMode === 'template' ? 'border-teal-400 bg-teal-50 ring-4 ring-teal-100' : 'border-slate-200 bg-white hover:border-teal-200'}`}><b className="block text-slate-900">使用模板主視覺</b><span className="mt-1 block text-sm text-slate-500">使用目前模板的 AI artwork / backplate。</span></button>
            <button type="button" data-testid="hero-mode-custom" role="radio" aria-checked={heroMode === 'custom'} onClick={() => setHeroMode('custom')} className={`rounded-3xl border p-4 text-left transition ${heroMode === 'custom' ? 'border-teal-400 bg-teal-50 ring-4 ring-teal-100' : 'border-slate-200 bg-white hover:border-teal-200'}`}><b className="block text-slate-900">使用自訂 Hero 圖</b><span className="mt-1 block text-sm text-slate-500">從媒體庫選擇，或直接上傳店面照 / 商品照。</span></button>
          </div>
          <div className="grid gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-4 md:grid-cols-[180px_1fr]" data-testid="hero-current-preview">
            <img src={heroSource.src} alt={heroSource.alt} className="h-36 w-full rounded-3xl object-cover shadow-sm" data-testid="hero-current-image" />
            <div className="min-w-0"><p className="text-xs font-black uppercase tracking-[0.28em] text-teal-600">目前圖片預覽</p><h3 className="mt-2 text-xl font-black text-slate-950">{heroMode === 'custom' && customMedia ? '目前使用自訂 Hero 圖' : '目前使用模板主視覺'}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{heroMode === 'custom' && !customMedia ? '已切到自訂 Hero 圖，但尚未選擇圖片；Preview 會安全 fallback 到模板主視覺。' : heroMode === 'custom' ? customMedia?.name : '切換模板時會自動跟著換成新模板主視覺。'}</p><div className="mt-4 flex flex-wrap gap-2"><label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-teal-200 bg-white px-4 py-2.5 text-sm font-bold text-teal-700 shadow-sm hover:bg-teal-50"><input data-testid="hero-upload-input" type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={resetFileInput} />上傳 Hero 圖</label><Button type="button" variant="secondary" onClick={() => document.querySelector<HTMLElement>('[data-sidebar-button="media"]')?.click()}>前往圖片媒體庫</Button>{heroMode === 'custom' && <Button type="button" variant="ghost" onClick={clearCustomHero} data-testid="clear-custom-hero">清除自訂圖片</Button>}</div></div>
          </div>
          <div data-testid="hero-media-library"><div className="mb-3 flex items-center justify-between"><b className="text-slate-900">從媒體庫選擇</b><span className="text-xs font-bold text-slate-400">Hero / 商品 / 門市 / 其他</span></div>{mediaChoices.length === 0 ? <p className="rounded-3xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-500">媒體庫尚無可選圖片，請先上傳 Hero 圖。</p> : <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{mediaChoices.map(m => <button type="button" key={m.id} data-testid="hero-media-choice" data-media-id={m.id} onClick={() => selectHeroImage(m.id)} className={`rounded-3xl border bg-white p-2 text-left transition ${data.hero.imageId === m.id && heroMode === 'custom' ? 'border-teal-400 ring-4 ring-teal-100' : 'border-slate-200 hover:border-teal-200'}`}><img src={m.dataUrl} alt={m.name} className="h-24 w-full rounded-2xl object-cover" /><span className="mt-2 block truncate text-xs font-bold text-slate-700">{m.name}</span></button>)}</div>}</div>
        </div>
      </Card>
    </div>
  );
}
