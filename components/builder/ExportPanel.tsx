'use client';

import { useMemo, useState } from 'react';
import type { SiteData } from '@/types/site';
import { Button, Card, SectionHeader, Badge } from '@/components/ui';
import { checkPublishReadiness } from '@/lib/publishReadiness';
import { exportSiteDataAsJson } from '@/lib/storage';
import { HostingRequestModal } from '@/components/hosting/HostingRequestModal';

export function ExportPanel({ data, onExportZip }: { data: SiteData; onExportZip: () => void }) {
  const readiness = useMemo(() => checkPublishReadiness(data), [data]);
  const [hostingOpen, setHostingOpen] = useState(false);
  const tone = readiness.status === 'ready' ? 'green' : readiness.status === 'warning' ? 'amber' : 'red';
  return (
    <div className="grid gap-5" data-testid="publish-center">
      <Card className="bg-gradient-to-br from-white to-teal-50">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <SectionHeader eyebrow="Publish Center" title="發布中心" description="發布前檢查不會強制阻止匯出；它會提醒你哪些資訊還沒補齊。" />
          <div className="rounded-[1.5rem] bg-white p-5 text-center shadow-sm ring-1 ring-slate-200"><p className="text-xs font-black text-slate-400">完成度</p><p className="text-5xl font-black text-teal-700" data-testid="publish-readiness-score">{readiness.score}</p><Badge tone={tone}>{readiness.status}</Badge></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200"><h3 className="font-black text-slate-900">必填缺失</h3>{readiness.requiredIssues.length ? <ul className="mt-3 grid gap-2 text-sm font-bold text-red-700">{readiness.requiredIssues.map(issue => <li key={issue}>• {issue}</li>)}</ul> : <p className="mt-3 text-sm font-bold text-emerald-700">必填項目已完成。</p>}</div>
          <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200"><h3 className="font-black text-slate-900">建議補充</h3>{readiness.recommendedIssues.length ? <ul className="mt-3 grid gap-2 text-sm font-bold text-amber-700">{readiness.recommendedIssues.map(issue => <li key={issue}>• {issue}</li>)}</ul> : <p className="mt-3 text-sm font-bold text-emerald-700">建議項目已完成。</p>}</div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card><SectionHeader eyebrow="Self Export" title="自行匯出" description="下載 JSON 備份與可部署的 generated-site.zip。" /><div className="flex flex-col gap-3 sm:flex-row"><Button onClick={() => exportSiteDataAsJson(data)} data-testid="publish-json-export">匯出 JSON</Button><Button size="lg" onClick={onExportZip} data-testid="publish-zip-export">下載 generated-site.zip</Button></div><p className="mt-4 text-sm leading-6 text-slate-500">自行部署時，請將 index.html 與 assets/ 一起上傳到靜態主機。</p></Card>
        <Card><SectionHeader eyebrow="Managed Hosting" title="店名片代管" description="不會架站也沒關係。店名片可以協助代管發布，提供公開網址、SSL 與網站維護。" /><Button onClick={() => setHostingOpen(true)} data-testid="open-hosting-request">申請店名片代管發布</Button><p className="mt-4 text-sm leading-6 text-slate-500">目前不接後端，送出後會產生 hosting-request.json，並可複製申請內容。</p></Card>
      </div>

      <Card><SectionHeader title="ZIP 結構" description="既有 ZIP 主流程維持不變。" /><div className="grid gap-3 md:grid-cols-4">{['index.html｜正式店家名片頁', 'assets/｜圖片資源', 'siteData.json｜內容備份', 'README.txt｜使用說明'].map(x => <div key={x} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700">{x}</div>)}</div></Card>
      <HostingRequestModal open={hostingOpen} onClose={() => setHostingOpen(false)} siteData={data} />
    </div>
  );
}
