import type { SiteData, TemplateStyle } from '@/types/site';
import { Badge, Card, SectionHeader } from '@/components/ui';

const templates: { id: TemplateStyle; name: string; fit: string; desc: string; className: string }[] = [
  { id: 'fresh-japanese', name: '清新日系', fit: '飲料店、甜點店、咖啡廳', desc: '米白、抹茶綠、柔和留白，適合日常清爽品牌。', className: 'bg-gradient-to-br from-teal-50 via-white to-amber-50' },
  { id: 'premium-minimal', name: '質感極簡', fit: '餐廳、咖啡廳、高質感品牌', desc: '炭黑、咖啡棕與大圖排版，營造精品餐飲感。', className: 'bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-white' },
  { id: 'playful-colorful', name: '活潑可愛', fit: '手搖飲、小吃、年輕品牌', desc: '珊瑚、黃色、薄荷綠，強調人氣商品與社群導流。', className: 'bg-gradient-to-br from-orange-100 via-yellow-100 to-teal-100' },
];

export function TemplateSelector({ data, onChange }: { data: SiteData; onChange: (d: SiteData) => void }) {
  return <Card><SectionHeader eyebrow="Template" title="模板選擇" description="三個模板不只是換色，而是各自對應不同產業與品牌氣質。" /><div className="grid gap-4">{templates.map(t => <button type="button" key={t.id} onClick={() => onChange({ ...data, template: t.id })} className={`rounded-[28px] border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${data.template === t.id ? 'border-teal-400 ring-4 ring-teal-100' : 'border-slate-200'}`}><div className={`h-40 rounded-3xl p-4 ${t.className}`}><div className="flex items-center justify-between"><span className="h-8 w-24 rounded-full bg-white/80"/><span className="h-8 w-8 rounded-full bg-white/60"/></div><div className="mt-8 h-5 w-3/4 rounded-full bg-current opacity-70"/><div className="mt-3 h-3 w-1/2 rounded-full bg-current opacity-30"/><div className="mt-5 grid grid-cols-3 gap-2">{[1,2,3].map(i => <span key={i} className="h-10 rounded-2xl bg-white/70" />)}</div></div><div className="mt-4 flex items-start justify-between gap-3"><div><h3 className="text-lg font-black text-slate-950">{t.name}</h3><p className="mt-1 text-sm text-slate-500">{t.desc}</p><p className="mt-2 text-xs font-semibold text-slate-500">適合：{t.fit}</p></div>{data.template === t.id && <Badge>已選擇</Badge>}</div></button>)}</div></Card>;
}
