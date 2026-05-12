import { useState } from 'react';
import type { SiteData } from '@/types/site';
import { Button, Card, SectionHeader, Badge } from '@/components/ui';
import { getPublishReadiness, publishReadinessLabel } from '@/lib/publishReadiness';
import { HostingRequestModal } from './HostingRequestModal';

export function ExportPanel({ data, onExportZip }: { data: SiteData; onExportZip: () => void }) {
  const [hostingOpen, setHostingOpen] = useState(false);
  const readiness = getPublishReadiness(data);
  const tone = readiness.status === 'ready' ? 'green' : readiness.status === 'warning' ? 'amber' : 'red';
  return (
    <div className="grid gap-5" data-testid="publish-center">
      <Card>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <SectionHeader eyebrow="Publish Readiness" title="發布前檢查" description="檢查結果只提醒風險，不會阻擋 ZIP 匯出。" />
          <div className="rounded-3xl bg-slate-50 p-4 text-center ring-1 ring-slate-200" data-testid="publish-readiness-score">
            <p className="text-4xl font-black text-slate-950">{readiness.score}%</p>
            <Badge tone={tone}>{publishReadinessLabel(readiness.status)}</Badge>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <h3 className="font-black text-slate-900">必要項目</h3>
            {readiness.requiredIssues.length === 0 ? <p className="mt-3 text-sm font-bold text-emerald-700">✓ 必要資料已完成</p> : <ul className="mt-3 grid gap-2 text-sm font-bold text-red-700">{readiness.requiredIssues.map(issue => <li key={issue}>• {issue}</li>)}</ul>}
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <h3 className="font-black text-slate-900">建議項目</h3>
            {readiness.recommendedIssues.length === 0 ? <p className="mt-3 text-sm font-bold text-emerald-700">✓ 建議項目已完成</p> : <ul className="mt-3 grid gap-2 text-sm font-bold text-amber-700">{readiness.recommendedIssues.map(issue => <li key={issue}>• {issue}</li>)}</ul>}
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader eyebrow="Export" title="匯出靜態網站 ZIP" description="產出的網站不依賴 Next.js runtime、localhost 或資料庫，可離線開啟 index.html。" />
        <div className="flex flex-col gap-3 sm:flex-row"><Button size="lg" onClick={onExportZip}>下載 generated-site.zip</Button><Button size="lg" variant="secondary" onClick={() => setHostingOpen(true)}>申請店名片代管發布</Button></div>
      </Card>

      <Card>
        <SectionHeader title="ZIP 結構與代管交付物" description="自行匯出或送交代管，都保留 siteData.json 作為內容備份。" />
        <div className="grid gap-3 md:grid-cols-3">{['index.html｜正式店家官網', 'assets/｜圖片資源', 'siteData.json｜內容備份', 'README.txt｜使用說明', 'hosting-request.json｜代管申請', '發布前檢查結果｜人工確認'].map(x => <div key={x} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700">{x}</div>)}</div>
      </Card>
      <HostingRequestModal data={data} open={hostingOpen} onClose={() => setHostingOpen(false)} />
    </div>
  );
}
