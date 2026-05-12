import type { SiteData } from '@/types/site';
import { Button, Card, SectionHeader } from '@/components/ui';
import { createDemoSiteData, type DemoKind } from '@/lib/demoSiteData';

const demos: { kind: DemoKind; label: string; desc: string }[] = [
  { kind: 'drink', label: '套用飲料店範例', desc: '日沐茶飲｜茶飲、奶茶、水果茶' },
  { kind: 'restaurant', label: '套用餐飲店範例', desc: '暖巷食堂｜主餐、套餐、小菜、飲品' },
  { kind: 'cafe', label: '套用咖啡廳範例', desc: '日常一隅｜咖啡、甜點、早午餐' },
];

export function DemoDataPanel({ onApply, compact = false }: { onApply: (data: SiteData) => void; compact?: boolean }) {
  const apply = (kind: DemoKind) => {
    const ok = window.confirm('這會覆蓋目前編輯內容，建議先匯出 JSON 備份。確定要套用範例資料嗎？');
    if (!ok) return;
    onApply(createDemoSiteData(kind));
  };
  const body = <div className="grid gap-3 md:grid-cols-3">{demos.map(demo => <button key={demo.kind} type="button" onClick={() => apply(demo.kind)} className="rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"><b className="text-slate-900">{demo.label}</b><p className="mt-1 text-sm leading-6 text-slate-500">{demo.desc}</p></button>)}</div>;
  if (compact) return body;
  return <div data-testid="demo-data-panel"><Card><SectionHeader eyebrow="Demo Data" title="一鍵套用範例資料" description="先用完整範例理解流程；套用前請先匯出 JSON 備份，目前內容會被覆蓋。" />{body}</Card></div>;
}
