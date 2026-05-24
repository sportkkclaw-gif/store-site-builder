'use client';

import { useMemo, useState } from 'react';
import type { SiteData } from '@/types/site';
import { Button, Input, Textarea } from '@/components/ui';
import { createDefaultSiteData } from '@/lib/defaultSiteData';
import { defaultHostingRequestForm, validateHostingRequestForm, buildHostingRequest, type HostingRequestForm } from '@/lib/hostingRequest';
import { normalizeContactFields } from '@/lib/contactValidation';
import { normalizeRequestedSlug } from '@/lib/slugValidation';
import { downloadHostingRequestJson, generateManagedHostingPackage } from '@/lib/managedHostingPackage';
import { checkPublishReadiness } from '@/lib/publishReadiness';

export { buildHostingRequest } from '@/lib/hostingRequest';

export function HostingRequestModal({ open, onClose, siteData }: { open: boolean; onClose: () => void; siteData?: SiteData }) {
  const activeSiteData = siteData || createDefaultSiteData();
  const [form, setForm] = useState<HostingRequestForm>(() => defaultHostingRequestForm(activeSiteData));
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const readiness = useMemo(() => checkPublishReadiness(activeSiteData), [activeSiteData]);
  const slugSuggestion = useMemo(() => normalizeRequestedSlug(form.requestedSlug), [form.requestedSlug]);
  const requestText = useMemo(() => generated || JSON.stringify(buildHostingRequest(form, activeSiteData, readiness), null, 2), [form, generated, activeSiteData, readiness]);
  if (!open) return null;
  const update = (key: keyof HostingRequestForm, value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }));
  const normalizedForm = () => {
    const contact = normalizeContactFields({ name: form.contactName, email: form.email, lineId: form.lineId });
    return {
      ...form,
      contactName: contact.name,
      email: contact.email,
      lineId: contact.lineId,
      storeName: form.storeName.trim(),
      requestedSlug: normalizeRequestedSlug(form.requestedSlug),
      customDomain: form.customDomain?.trim() || '',
      notes: form.notes.trim(),
    };
  };
  const validate = () => {
    const validation = validateHostingRequestForm(form);
    setErrors(validation.errors);
    if (validation.normalizedSlug && validation.normalizedSlug !== form.requestedSlug) setForm(prev => ({ ...prev, requestedSlug: validation.normalizedSlug }));
    return validation.ok;
  };
  const submit = () => {
    if (!validate()) return;
    const text = downloadHostingRequestJson(normalizedForm(), activeSiteData);
    setGenerated(text);
  };
  const packageZip = async () => {
    if (!validate()) return;
    await generateManagedHostingPackage(normalizedForm(), activeSiteData);
  };
  const copy = async () => {
    await navigator.clipboard?.writeText(requestText);
    setCopied(true);
  };
  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-4" data-testid="hosting-request-modal">
      <div className="mx-auto my-4 w-full max-w-3xl overflow-hidden rounded-[1.5rem] bg-white p-4 shadow-2xl sm:my-6 sm:rounded-[2rem] sm:p-5 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-teal-600">Hosting Request</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">申請店名片代管發布</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">不會架站也沒關係。店名片可以協助你處理公開網址、SSL、網站空間與發布流程。</p>
          </div>
          <button className="shrink-0 rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-600" onClick={onClose} type="button">關閉</button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input label="聯絡人姓名" value={form.contactName} onChange={e => update('contactName', e.target.value)} />
          <Input label="Email" type="email" value={form.email} onChange={e => update('email', e.target.value)} />
          <Input label="LINE ID" value={form.lineId} onChange={e => update('lineId', e.target.value)} />
          <Input label="店家名稱" value={form.storeName} onChange={e => update('storeName', e.target.value)} />
          <div>
            <Input label="想使用的網址名稱" placeholder="my-tea-shop" value={form.requestedSlug} onChange={e => update('requestedSlug', e.target.value)} />
            <p className="mt-2 break-all text-xs font-bold text-teal-700" data-testid="requested-slug-preview">建議網址：https://{slugSuggestion || '你的名稱'}.denmeipian.app</p>
          </div>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700"><input type="checkbox" checked={form.hasCustomDomain} onChange={e => update('hasCustomDomain', e.target.checked)} /> 已有自己的網域</label>
          {form.hasCustomDomain && <Input label="自訂網域（示意）" placeholder="www.example.com" value={form.customDomain || ''} onChange={e => update('customDomain', e.target.value)} />}
          <div className="md:col-span-2"><Textarea label="備註" value={form.notes} onChange={e => update('notes', e.target.value)} /></div>
        </div>
        {errors.length > 0 && <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700" role="alert" data-testid="hosting-request-error"><ul className="grid gap-1">{errors.map(error => <li key={error}>{error}</li>)}</ul></div>}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Button onClick={submit} data-testid="generate-hosting-request">產生 hosting-request.json</Button><Button variant="secondary" onClick={packageZip} data-testid="generate-managed-package">產生代管交付包</Button><Button variant="secondary" onClick={copy} data-testid="copy-hosting-request">{copied ? '已複製申請內容' : '複製申請內容'}</Button></div>
        {generated && <pre className="mt-5 max-h-64 max-w-full overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-teal-100" data-testid="hosting-request-output">{generated}</pre>}
      </div>
    </div>
  );
}

export function HostingRequestButton({ siteData, children = '申請代管發布', className = '' }: { siteData?: SiteData; children?: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  return <>{<button type="button" onClick={() => setOpen(true)} className={className || 'rounded-full bg-slate-950 px-7 py-4 text-center font-black text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-teal-700'}>{children}</button>}<HostingRequestModal open={open} onClose={() => setOpen(false)} siteData={siteData} /></>;
}
