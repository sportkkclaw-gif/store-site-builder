'use client';

import { useMemo, useState } from 'react';
import type { SiteData } from '@/types/site';
import { Button, Input, Textarea } from '@/components/ui';
import { downloadText } from '@/lib/storage';

type RequestState = {
  contactName: string;
  email: string;
  lineId: string;
  storeName: string;
  requestedSlug: string;
  hasCustomDomain: boolean;
  notes: string;
};

const initialState: RequestState = { contactName: '', email: '', lineId: '', storeName: '', requestedSlug: '', hasCustomDomain: false, notes: '' };

export function buildHostingRequest(form: RequestState, siteData?: SiteData) {
  return {
    type: 'denmeipian-hosting-request',
    version: '0.3.0',
    generatedAt: new Date().toISOString(),
    contact: { name: form.contactName, email: form.email, lineId: form.lineId },
    store: { name: form.storeName || siteData?.store.name || '', requestedSlug: form.requestedSlug, hasCustomDomain: form.hasCustomDomain },
    site: { templateId: siteData?.galleryTemplateId || siteData?.visual?.selectedTemplateId || '', industry: siteData?.industry || '', summary: siteData ? `${siteData.store.name}｜${siteData.store.tagline}｜${siteData.menu.categories.length} 個菜單分類` : '首頁代管方案諮詢' },
    notes: form.notes,
  };
}

export function HostingRequestModal({ open, onClose, siteData }: { open: boolean; onClose: () => void; siteData?: SiteData }) {
  const [form, setForm] = useState<RequestState>(() => ({ ...initialState, storeName: siteData?.store.name || '' }));
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);
  const requestText = useMemo(() => generated || JSON.stringify(buildHostingRequest(form, siteData), null, 2), [form, generated, siteData]);
  if (!open) return null;
  const update = (key: keyof RequestState, value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }));
  const submit = () => {
    const text = JSON.stringify(buildHostingRequest(form, siteData), null, 2);
    setGenerated(text);
    downloadText('hosting-request.json', text);
  };
  const copy = async () => {
    await navigator.clipboard?.writeText(requestText);
    setCopied(true);
  };
  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm" data-testid="hosting-request-modal">
      <div className="mx-auto my-6 w-full max-w-3xl rounded-[2rem] bg-white p-5 shadow-2xl md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-teal-600">Hosting Request</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">申請店名片代管發布</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">不會架站也沒關係。店名片可以協助你代管發布，提供公開網址、SSL 與網站維護。</p>
          </div>
          <button className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-600" onClick={onClose} type="button">關閉</button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input label="聯絡人姓名" value={form.contactName} onChange={e => update('contactName', e.target.value)} />
          <Input label="Email" type="email" value={form.email} onChange={e => update('email', e.target.value)} />
          <Input label="LINE ID" value={form.lineId} onChange={e => update('lineId', e.target.value)} />
          <Input label="店家名稱" value={form.storeName} onChange={e => update('storeName', e.target.value)} />
          <Input label="想使用的網址名稱" placeholder="my-tea-shop" value={form.requestedSlug} onChange={e => update('requestedSlug', e.target.value)} />
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700"><input type="checkbox" checked={form.hasCustomDomain} onChange={e => update('hasCustomDomain', e.target.checked)} /> 已有自己的網域</label>
          <div className="md:col-span-2"><Textarea label="備註" value={form.notes} onChange={e => update('notes', e.target.value)} /></div>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row"><Button onClick={submit} data-testid="generate-hosting-request">產生 hosting-request.json</Button><Button variant="secondary" onClick={copy} data-testid="copy-hosting-request">{copied ? '已複製申請內容' : '複製申請內容'}</Button></div>
        {generated && <pre className="mt-5 max-h-64 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-teal-100" data-testid="hosting-request-output">{generated}</pre>}
      </div>
    </div>
  );
}

export function HostingRequestButton({ siteData, children = '申請店名片代管發布', className = '' }: { siteData?: SiteData; children?: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  return <>{<button type="button" onClick={() => setOpen(true)} className={className || 'rounded-full bg-slate-950 px-7 py-4 text-center font-black text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-teal-700'}>{children}</button>}<HostingRequestModal open={open} onClose={() => setOpen(false)} siteData={siteData} /></>;
}
