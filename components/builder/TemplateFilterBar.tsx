import { Input, Select } from '@/components/ui';
import type { TemplateSort } from '@/types/template';
import { templateSortLabels } from '@/types/template';

export function TemplateFilterBar({
  query,
  onQuery,
  tag,
  onTag,
  sort,
  onSort,
  tags,
}: {
  query: string;
  onQuery: (value: string) => void;
  tag: string;
  onTag: (value: string) => void;
  sort: TemplateSort;
  onSort: (value: TemplateSort) => void;
  tags: string[];
}) {
  return (
    <div className="grid gap-4 rounded-[32px] border border-slate-200 bg-white/90 p-4 shadow-sm md:p-5">
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <Input label="搜尋模板" value={query} onChange={e => onQuery(e.target.value)} placeholder="搜尋名稱、風格、產業、標籤…" />
        <Select label="排序" value={sort} onChange={e => onSort(e.target.value as TemplateSort)}>
          {(Object.keys(templateSortLabels) as TemplateSort[]).map(key => <option key={key} value={key}>{templateSortLabels[key]}</option>)}
        </Select>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1" aria-label="風格篩選">
        <button type="button" onClick={() => onTag('all')} className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${tag === 'all' ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>全部風格</button>
        {tags.map(item => <button type="button" key={item} onClick={() => onTag(item)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${tag === item ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{item}</button>)}
      </div>
    </div>
  );
}
