'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { SiteData } from '@/types/site';
import { Button, Card, SectionHeader, Badge } from '@/components/ui';
import { checkPublishReadiness } from '@/lib/publishReadiness';
import { exportSiteDataAsJson } from '@/lib/storage';
import { HostingRequestModal } from '@/components/hosting/HostingRequestModal';
import { defaultHostingRequestForm, buildHostingRequest } from '@/lib/hostingRequest';
import { generateManagedHostingPackage } from '@/lib/managedHostingPackage';

const statusLabel = { ready: '可以發布', warning: '建議補充', blocked: '缺少必要資料' } as const;

function HelpDiagnostics() {
  const items = [
    ['我不會架站', '選擇店名片代管發布。'],
    ['我想自己上傳', '下載 ZIP，參考自行部署教學。'],
    ['我的圖片看起來怪', '回圖片媒體重新上傳或更換 Hero 圖。'],
    ['我沒有網域', '先使用店名片代管子網域。'],
    ['我有自己的網域', '申請自訂網域代管，後續協助 DNS 設定。'],
    ['我只是想放 LINE / IG', '使用店名片名片式網頁即可，不需要完整電商。'],
  ];
  return <div className="grid gap-3 md:grid-cols-2">{items.map(([q, a]) => <div key={q} className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><b className="block text-slate-900">{q}</b><p className="mt-2 text-sm font-bold leading-6 text-slate-500">建議：{a}</p></div>)}</div>;
}

export function ExportPanel({ data, onExportZip }: { data: SiteData; onExportZip: () => void }) {
  const readiness = useMemo(() => checkPublishReadiness(data), [data]);
  const [hostingOpen, setHostingOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const tone = readiness.status === 'ready' ? 'green' : readiness.status === 'warning' ? 'amber' : 'red';
  const draftForm = useMemo(() => defaultHostingRequestForm(data), [data]);
  const copyRequest = async () => {
    await navigator.clipboard?.writeText(JSON.stringify(buildHostingRequest(draftForm, data, readiness), null, 2));
    setCopied(true);
  };
  const openPackageFlow = () => setHostingOpen(true);
  return (
    <div className="grid gap-5" data-testid="publish-center">
      <Card className="bg-gradient-to-br from-white to-teal-50">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <SectionHeader eyebrow="一、網站完成度" title="發布中心" description="發布前檢查不會強制阻止匯出；它會提醒你哪些資訊還沒補齊。" />
          <div className="rounded-[1.5rem] bg-white p-5 text-center shadow-sm ring-1 ring-slate-200"><p className="text-xs font-black text-slate-400">完成度</p><p className="text-5xl font-black text-teal-700" data-testid="publish-readiness-score">{readiness.score}</p><Badge tone={tone}>{statusLabel[readiness.status]}</Badge></div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200"><h3 className="font-black text-slate-900">必填缺失</h3>{readiness.requiredIssues.length ? <ul className="mt-3 grid gap-2 text-sm font-bold text-red-700">{readiness.requiredIssues.map(issue => <li key={issue}>• {issue}</li>)}</ul> : <p className="mt-3 text-sm font-bold text-emerald-700">必填項目已完成。</p>}</div>
          <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200"><h3 className="font-black text-slate-900">建議補充</h3>{readiness.recommendedIssues.length ? <ul className="mt-3 grid gap-2 text-sm font-bold text-amber-700">{readiness.recommendedIssues.map(issue => <li key={issue}>• {issue}</li>)}</ul> : <p className="mt-3 text-sm font-bold text-emerald-700">建議項目已完成。</p>}</div>
          <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200"><h3 className="font-black text-slate-900">快速修正提示</h3><p className="mt-3 text-sm font-bold leading-6 text-slate-500">先補聯絡方式、地址或 Google Maps、菜單商品與 SEO，再匯出或申請代管。</p></div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card><SectionHeader eyebrow="二、自行匯出" title="下載 ZIP 後自行部署" description="下載 ZIP 後，你可以自行上傳到任何靜態網站主機。適合懂網站部署的人。" /><div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Button onClick={() => exportSiteDataAsJson(data)} data-testid="publish-json-export">匯出 JSON</Button><Button size="lg" onClick={onExportZip} data-testid="publish-zip-export">匯出 ZIP</Button><Link href="/deploy-guide" className="rounded-full bg-slate-100 px-6 py-3 text-center font-black text-slate-700">自行部署教學</Link></div><p className="mt-4 text-sm leading-6 text-slate-500">自行部署時，請將 index.html 與 assets/ 一起上傳到靜態主機。</p></Card>
        <Card><SectionHeader eyebrow="三、申請代管" title="店名片代管發布" description="不會架站也沒關係。你可以提交代管申請，我們協助處理網址、SSL 與網站發布。適合不想處理架站的小店家。" /><div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Button onClick={() => setHostingOpen(true)} data-testid="open-hosting-request">申請店名片代管發布</Button><Button variant="secondary" onClick={openPackageFlow} data-testid="publish-managed-package">產生代管交付包</Button><Button variant="secondary" onClick={copyRequest} data-testid="publish-copy-hosting-request">{copied ? '已複製申請內容' : '複製申請內容'}</Button></div><p className="mt-4 text-sm leading-6 text-slate-500">目前不做後端、不登入、不付款；只產生可交付的申請資料包。</p></Card>
      </div>

      <Card><SectionHeader title="問題診斷 / Help" description="不知道該選哪一種發布方式時，先看這裡。" /><HelpDiagnostics /></Card>
      <Card><SectionHeader title="ZIP 結構" description="既有 ZIP 主流程維持不變。" /><div className="grid gap-3 md:grid-cols-4">{['index.html｜正式店家名片頁', 'assets/｜圖片資源', 'siteData.json｜內容備份', 'README.txt｜使用說明'].map(x => <div key={x} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700">{x}</div>)}</div></Card>
      <HostingRequestModal open={hostingOpen} onClose={() => setHostingOpen(false)} siteData={data} />
    </div>
  );
}
