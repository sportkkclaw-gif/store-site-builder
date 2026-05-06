import type { BuilderSection } from '@/types/site';

const items: { id: BuilderSection; label: string }[] = [
  { id: 'overview', label: '總覽' },
  { id: 'basic', label: '基本資料' },
  { id: 'template', label: '模板選擇' },
  { id: 'brand', label: '品牌樣式' },
  { id: 'media', label: '圖片媒體' },
  { id: 'menu', label: '菜單 / 商品' },
  { id: 'links', label: '連結設定' },
  { id: 'seo', label: 'SEO 設定' },
  { id: 'modules', label: '功能模組' },
  { id: 'json', label: '匯入匯出' },
  { id: 'export', label: '匯出網站' },
];

export function BuilderSidebar({ active, onChange }: { active: BuilderSection; onChange: (s: BuilderSection) => void }) {
  return (
    <nav className="builder-sidebar" data-testid="builder-sidebar" aria-label="Builder 功能選單">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-500">StoreSite</p>
        <h2 className="text-xl font-black text-slate-950">Builder</h2>
      </div>
      <div className="grid gap-1">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            data-sidebar-button={item.id}
            onClick={() => onChange(item.id)}
            className={`builder-sidebar-button ${active === item.id ? 'builder-sidebar-button--active' : ''}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
