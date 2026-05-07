import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; children: ReactNode }) {
  const variants: Record<Variant, string> = {
    primary: 'border-transparent bg-teal-500 text-white shadow-lg shadow-teal-500/20 hover:bg-teal-600 focus:ring-teal-200',
    secondary: 'border-slate-200 bg-white text-slate-700 shadow-sm hover:border-teal-200 hover:bg-teal-50 focus:ring-teal-100',
    danger: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100 focus:ring-red-100',
    ghost: 'border-transparent bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-100',
  };
  const sizes: Record<Size, string> = { sm: 'px-3 py-2 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3.5 text-base' };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border font-bold transition duration-200 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
