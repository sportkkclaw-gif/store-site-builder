import type { SiteData } from '@/types/site';
import { Card, SectionHeader, Toggle } from '@/components/ui';

const modules: { key: keyof SiteData['modules']; label: string; desc: string }[] = [
  { key: 'hero', label: '首頁主視覺 Hero', desc: '第一屏標題、圖片與 CTA。' },
  { key: 'featuredProducts', label: '招牌商品', desc: '顯示 featured 商品卡片。' },
  { key: 'menu', label: '菜單區塊', desc: '完整分類與商品列表。' },
  { key: 'brandStory', label: '品牌故事', desc: '店家簡介與品牌敘事。' },
  { key: 'storeInfo', label: '門市資訊', desc: '地址、電話、Email 與營業時間。' },
  { key: 'map', label: 'Google Maps', desc: '顯示地圖導流按鈕。' },
  { key: 'faq', label: 'FAQ', desc: '常見問題摺疊區。' },
  { key: 'socialLinks', label: '社群連結', desc: 'LINE、社群、外送與訂位入口。' },
  { key: 'footer', label: 'Footer', desc: '版權與品牌收尾。' },
];

export function ModuleToggleForm({ data, onChange }: { data: SiteData; onChange: (d: SiteData) => void }) {
  return <Card><SectionHeader eyebrow="Modules" title="功能模組" description="關閉後右側 Preview 與匯出的 index.html 都會同步隱藏。" /><div className="grid gap-3 md:grid-cols-2">{modules.map(m => <Toggle key={m.key} label={m.label} description={m.desc} checked={data.modules[m.key]} onChange={v => onChange({ ...data, modules: { ...data.modules, [m.key]: v } })} />)}</div></Card>;
}
