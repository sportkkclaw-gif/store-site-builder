import type { BuilderSection } from '@/types/site';

const items: { id: BuilderSection; label: string; icon: string }[] = [
  { id: 'overview', label: '總覽', icon: '⌂' }, { id: 'basic', label: '基本資料', icon: '✎' }, { id: 'template', label: '模板選擇', icon: '▦' }, { id: 'brand', label: '品牌樣式', icon: '◐' }, { id: 'media', label: '圖片媒體', icon: '◧' }, { id: 'menu', label: '菜單 / 商品', icon: '☰' }, { id: 'links', label: '連結設定', icon: '↗' }, { id: 'seo', label: 'SEO 設定', icon: '◎' }, { id: 'modules', label: '功能模組', icon: '◈' }, { id: 'json', label: '匯入匯出', icon: '{}' }, { id: 'export', label: '發布中心', icon: '⇩' },
];

export function BuilderSidebar({ active, onChange }: { active: BuilderSection; onChange: (s: BuilderSection) => void }) {
  return <nav className="builder-sidebar" data-testid="builder-sidebar" aria-label="Builder 功能選單"><div className="mb-7 rounded-[28px] bg-slate-950 p-5 text-white shadow-xl shadow-slate-300/40"><div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-teal-500 font-black">店</div><p className="text-xs font-black uppercase tracking-[0.24em] text-teal-200">店名片</p><h2 className="text-2xl font-black">Builder</h2><p className="mt-2 text-xs leading-5 text-slate-300">小店家的 AI 名片式網頁產生器</p></div><div className="grid gap-1.5">{items.map(item => <button key={item.id} type="button" data-sidebar-button={item.id} onClick={() => onChange(item.id)} className={`builder-sidebar-button ${active === item.id ? 'builder-sidebar-button--active' : ''}`}><span className="builder-sidebar-icon">{item.icon}</span><span>{item.label}</span></button>)}</div></nav>;
}
