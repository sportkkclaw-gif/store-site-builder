import type { ReactNode, TextareaHTMLAttributes } from 'react';

export function Textarea({ label, helperText, className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; helperText?: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
      {label && <span>{label}</span>}
      <textarea className={`min-h-32 w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 ${className}`} {...props} />
      {helperText && <span className="text-xs font-medium text-slate-500">{helperText}</span>}
    </label>
  );
}
