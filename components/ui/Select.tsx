import type { ReactNode, SelectHTMLAttributes } from 'react';

export function Select({ label, helperText, children, className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label?: string; helperText?: ReactNode; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
      {label && <span>{label}</span>}
      <select className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100 ${className}`} {...props}>{children}</select>
      {helperText && <span className="text-xs font-medium text-slate-500">{helperText}</span>}
    </label>
  );
}
