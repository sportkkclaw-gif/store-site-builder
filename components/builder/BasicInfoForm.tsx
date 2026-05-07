import type { SiteData } from '@/types/site';
import { Card, Input, SectionHeader, Textarea } from '@/components/ui';

export function BasicInfoForm({ data, onChange }: { data: SiteData; onChange: (d: SiteData) => void }) {
  const setStore = (key: keyof SiteData['store'], value: string) => onChange({ ...data, store: { ...data.store, [key]: value } });
  const setHero = (key: keyof SiteData['hero'], value: string) => onChange({ ...data, hero: { ...data.hero, [key]: value } });
  return (
    <div className="grid gap-5">
      <Card><SectionHeader eyebrow="Basic" title="基本資料" description="店名、聯絡資訊與營業資訊會同步顯示在模板與匯出網站。" /><div className="grid gap-4 md:grid-cols-2"><Input label="店名" placeholder="日沐茶飲" value={data.store.name} onChange={e => setStore('name', e.target.value)} helperText="會顯示於 Header / Footer" /><Input label="品牌標語" placeholder="每天一杯，日常更美好" value={data.store.tagline} onChange={e => setStore('tagline', e.target.value)} /><Input label="電話" placeholder="02-1234-5678" value={data.store.phone} onChange={e => setStore('phone', e.target.value)} /><Input label="Email" placeholder="hello@example.com" value={data.store.email} onChange={e => setStore('email', e.target.value)} /><Input label="地址" className="md:col-span-2" placeholder="台北市大安區..." value={data.store.address} onChange={e => setStore('address', e.target.value)} /><Input label="營業時間" className="md:col-span-2" placeholder="每日 10:00 - 22:00" value={data.store.businessHours} onChange={e => setStore('businessHours', e.target.value)} /><Textarea label="店家簡介" className="md:col-span-2" value={data.store.description} onChange={e => setStore('description', e.target.value)} helperText="建議 60–120 字，作為品牌故事區塊。" /></div></Card>
      <Card><SectionHeader eyebrow="Hero" title="首頁主視覺文案" description="第一眼看到的標題、副標與行動按鈕。" /><div className="grid gap-4"><Input label="Hero 標題" value={data.hero.title} onChange={e => setHero('title', e.target.value)} /><Textarea label="Hero 副標" value={data.hero.subtitle} onChange={e => setHero('subtitle', e.target.value)} /><div className="grid gap-4 md:grid-cols-2"><Input label="CTA 文字" value={data.hero.ctaText} onChange={e => setHero('ctaText', e.target.value)} /><Input label="CTA 連結" value={data.hero.ctaUrl} onChange={e => setHero('ctaUrl', e.target.value)} /></div></div></Card>
    </div>
  );
}
