import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/70 md:p-6 ${className}`}>{children}</section>;
}

export function SectionHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-5">
      {eyebrow && <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-teal-500">{eyebrow}</p>}
      <h2 className="text-2xl font-black tracking-tight text-slate-950">{title}</h2>
      {description && <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>}
    </div>
  );
}

export function Badge({ children, tone = 'teal' }: { children: ReactNode; tone?: 'teal' | 'slate' | 'green' | 'amber' | 'red' }) {
  const tones = { teal: 'bg-teal-50 text-teal-700 ring-teal-200', slate: 'bg-slate-100 text-slate-600 ring-slate-200', green: 'bg-emerald-50 text-emerald-700 ring-emerald-200', amber: 'bg-amber-50 text-amber-700 ring-amber-200', red: 'bg-red-50 text-red-700 ring-red-200' };
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black ring-1 ${tones[tone]}`}>{children}</span>;
}

export function EmptyState({ title, description, icon = '✨' }: { title: string; description?: string; icon?: string }) {
  return <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center"><div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-white text-2xl shadow-sm">{icon}</div><b className="text-slate-800">{title}</b>{description && <p className="mt-1 text-sm text-slate-500">{description}</p>}</div>;
}
