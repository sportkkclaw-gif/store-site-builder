import type { SiteData } from '@/types/site';
import { Badge, Card, Input, SectionHeader } from '@/components/ui';

const groups: { title: string; desc: string; fields: [keyof SiteData['links'], string, string][] }[] = [
  { title: '社群連結', desc: '導流到品牌社群與客服。', fields: [['line', 'LINE', 'https://line.me/...'], ['instagram', 'Instagram', 'https://instagram.com/...'], ['facebook', 'Facebook', 'https://facebook.com/...'], ['threads', 'Threads', 'https://threads.net/...'], ['tiktok', 'TikTok', 'https://tiktok.com/...']] },
  { title: '訂購 / 外送連結', desc: '讓客人快速訂購。', fields: [['ubereats', 'Uber Eats', 'https://...'], ['foodpanda', 'foodpanda', 'https://...'], ['orderForm', '訂購表單', 'https://forms.gle/...']] },
  { title: '地圖 / 訂位連結', desc: '門市查找與預約入口。', fields: [['googleMap', 'Google Maps', 'https://maps.google.com/...'], ['reservation', '訂位連結', 'https://...']] },
];

export function LinksForm({ data, onChange }: { data: SiteData; onChange: (d: SiteData) => void }) {
  return <div className="grid gap-5">{groups.map(group => <Card key={group.title}><SectionHeader title={group.title} description={group.desc} /><div className="grid gap-4">{group.fields.map(([key, label, placeholder]) => <div key={key} className="grid gap-2 md:grid-cols-[1fr_auto] md:items-end"><Input label={label} placeholder={placeholder} value={data.links[key] || ''} onChange={e => onChange({ ...data, links: { ...data.links, [key]: e.target.value || undefined } })} />{data.links[key] ? <Badge tone="green">已設定</Badge> : <Badge tone="slate">未設定</Badge>}</div>)}</div></Card>)}</div>;
}
