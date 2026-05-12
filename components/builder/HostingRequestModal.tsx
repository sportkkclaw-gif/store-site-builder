'use client';

import { useMemo, useState } from 'react';
import type { SiteData } from '@/types/site';
import { downloadText } from '@/lib/storage';
import { getTemplateById } from '@/lib/templateCatalog';
import { Button, Input, Textarea } from '@/components/ui';

type HostingForm = {
  contactName: string;
  email: string;
  lineId: string;
  storeName: string;
  preferredSlug: string;
  hasDomain: string;
  note: string;
};

function buildRequest(data: SiteData, form: HostingForm) {
  return {
    type: 'denmeipian-hosting-request',
    generatedAt: new Date().toISOString(),
    contact: {
      name: form.contactName,
      email: form.email,
      lineId: form.lineId,
    },
    request: {
      storeName: form.storeName || data.store.name,
      preferredSlug: form.preferredSlug,
      hasOwnDomain: form.hasDomain,
      note: form.note,
    },
    siteDataSummary: {
      storeName: data.store.name,
      tagline: data.store.tagline,
      phone: data.store.phone,
      address: data.store.address,
      line: data.links.line,
      googleMap: data.links.googleMap,
      templateId: data.galleryTemplateId || data.visual?.selectedTemplateId,
      templateName: getTemplateById(data.galleryTemplateId || data.visual?.selectedTemplateId)?.name,
      menuItems: data.menu.categories.reduce((sum, category) => sum + category.items.length, 0),
    },
  };
}

export function HostingRequestModal({ data, open, onClose }: { data: SiteData; open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<HostingForm>({ contactName: '', email: '', lineId: '', storeName: data.store.name, preferredSlug: data.seo.slug || '', hasDomain: '尚未有網域', note: '' });
  const [generated, setGenerated] = useState('');
  const requestText = useMemo(() => JSON.stringify(buildRequest(data, form), null, 2), [data, form]);
  if (!open) return null;
  const update = (key: keyof HostingForm, value: string) => setForm(prev => ({ ...prev, [key]: value }));
  const generate = () => setGenerated(requestText);
  const download = () => {
    const text = generated || requestText;
    setGenerated(text);
    downloadText('hosting-request.json', text, 'application/json');
  };
  const copy = async () => {
    const text = generated || requestText;
    setGenerated(text);
    await navigator.clipboard?.writeText(text);
  };
  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" data-testid="hosting-request-modal">
      <div className="mx-auto my-6 w-full max-w-3xl rounded-[2rem] bg-white p-5 shadow-2xl md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-teal-600">Hosting Request</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">申請店名片代管發布</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">目前先不接後端。你可以下載 hosting-request.json 或複製申請內容交給店名片團隊。</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-600">關閉</button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input label="聯絡人姓名" value={form.contactName} onChange={e => update('contactName', e.target.value)} />
          <Input label="Email" value={form.email} onChange={e => update('email', e.target.value)} />
          <Input label="LINE ID" value={form.lineId} onChange={e => update('lineId', e.target.value)} />
          <Input label="店家名稱" value={form.storeName} onChange={e => update('storeName', e.target.value)} />
          <Input label="想使用的網址名稱，例如：my-tea-shop" value={form.preferredSlug} onChange={e => update('preferredSlug', e.target.value)} />
          <label className="grid gap-2 text-sm font-black text-slate-700">是否已有自己的網域
            <select className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base font-bold text-slate-900" value={form.hasDomain} onChange={e => update('hasDomain', e.target.value)}>
              <option>尚未有網域</option>
              <option>已有網域，需要協助 DNS</option>
              <option>不確定，想先詢問</option>
            </select>
          </label>
          <Textarea className="md:col-span-2" label="備註" value={form.note} onChange={e => update('note', e.target.value)} />
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button onClick={download}>下載 hosting-request.json</Button>
          <Button variant="secondary" onClick={copy}>複製申請內容</Button>
          <Button variant="ghost" onClick={generate}>預覽申請內容</Button>
        </div>
        {generated && <pre data-testid="hosting-request-generated" className="mt-5 max-h-72 overflow-auto whitespace-pre-wrap rounded-3xl bg-slate-950 p-4 text-xs leading-6 text-emerald-100">{generated}</pre>}
      </div>
    </div>
  );
}
