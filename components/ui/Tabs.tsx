export function Tabs<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: { value: T; label: string }[] }) {
  return <div className="flex rounded-2xl bg-slate-100 p-1 ring-1 ring-slate-200/80">{items.map((item) => <button type="button" key={item.value} onClick={() => onChange(item.value)} className={`flex-1 rounded-xl px-3 py-2 text-sm font-black transition ${value === item.value ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>{item.label}</button>)}</div>;
}
