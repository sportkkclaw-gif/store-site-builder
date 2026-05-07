import type { SiteData } from '@/types/site';
import { Button, Card, SectionHeader } from '@/components/ui';
import { exportSiteDataAsJson, importSiteDataFromJson } from '@/lib/storage';

export function ImportExportJson({ data, onImport }: { data: SiteData; onImport: (d: SiteData) => void }) {
  return <div className="grid gap-5"><Card><SectionHeader eyebrow="JSON" title="匯入 / 匯出 siteData.json" description="JSON 用於備份與交接內容資料，不包含登入、資料庫或雲端設定。" /><div className="grid gap-3 md:grid-cols-2"><Button onClick={() => exportSiteDataAsJson(data)}>匯出 siteData.json</Button><label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-teal-50 hover:ring-4 hover:ring-teal-100"><input type="file" accept="application/json" hidden onChange={e => { const file = e.target.files?.[0]; if (file) importSiteDataFromJson(file).then(onImport).catch(() => alert('JSON 格式錯誤，未覆蓋目前資料')); }} />匯入 siteData.json</label></div></Card><Card><SectionHeader title="JSON 用途" /><div className="grid gap-3 md:grid-cols-3">{['備份草稿內容', '搬到另一台電腦編輯', '交給店家留存資料'].map(x => <div key={x} className="rounded-3xl bg-slate-50 p-4 font-bold text-slate-700 ring-1 ring-slate-200">{x}</div>)}</div></Card></div>;
}
