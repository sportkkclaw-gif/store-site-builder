import { Badge, Button } from '@/components/ui';
import type { SiteData } from '@/types/site';

export function BuilderTopbar({ data, status, onSave, onExportJson, onExportZip }: { data: SiteData; status: string; onSave: () => void; onExportJson: () => void; onExportZip: () => void }) {
  return <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur md:px-6"><div className="flex flex-col justify-between gap-3 md:flex-row md:items-center"><div><div className="flex flex-wrap items-center gap-2"><h1 className="text-lg font-black text-slate-950">{data.store.name || '未命名店家'}</h1><Badge tone="green">{status}</Badge></div><p className="mt-1 text-xs font-medium text-slate-500">編輯內容會自動儲存在本機 localStorage，匯出前可手動保存草稿。</p></div><div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={onSave}>儲存草稿</Button><Button variant="secondary" onClick={onExportJson}>匯出 JSON</Button><Button onClick={onExportZip}>匯出 ZIP</Button></div></div></header>;
}
