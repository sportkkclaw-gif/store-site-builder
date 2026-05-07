import type { SiteData } from '@/types/site';
import { Button, Card, SectionHeader } from '@/components/ui';

export function ExportPanel({ data, onExportZip }: { data: SiteData; onExportZip: () => void }) {
  return <div className="grid gap-5"><Card><SectionHeader eyebrow="Export" title="匯出靜態網站 ZIP" description="產出的網站不依賴 Next.js runtime、localhost 或資料庫，可離線開啟 index.html。" /><Button size="lg" onClick={onExportZip}>下載 generated-site.zip</Button></Card><Card><SectionHeader title="ZIP 結構" description="請將 index.html 與 assets/ 一起上傳到靜態主機。" /><div className="grid gap-3 md:grid-cols-3">{['index.html｜正式店家官網', 'assets/｜圖片資源', 'siteData.json｜內容備份', 'README.txt｜使用說明'].map(x => <div key={x} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700">{x}</div>)}</div></Card></div>;
}
