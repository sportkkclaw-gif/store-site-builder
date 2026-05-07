export function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className={`flex w-full items-center justify-between gap-4 rounded-3xl border p-4 text-left transition ${checked ? 'border-teal-200 bg-teal-50/80 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
      <span><span className="block text-sm font-black text-slate-800">{label}</span>{description && <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>}</span>
      <span className={`h-7 w-12 rounded-full p-1 transition ${checked ? 'bg-teal-500' : 'bg-slate-300'}`}><span className={`block h-5 w-5 rounded-full bg-white shadow transition ${checked ? 'translate-x-5' : ''}`} /></span>
    </button>
  );
}
