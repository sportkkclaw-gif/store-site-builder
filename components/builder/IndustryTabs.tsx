import type { TemplateIndustry } from '@/types/template';
import { templateIndustryLabels } from '@/types/template';
import { templateCatalog } from '@/lib/templateCatalog';

export function IndustryTabs({ value, onChange }: { value: TemplateIndustry; onChange: (industry: TemplateIndustry) => void }) {
  const counts = templateCatalog.reduce<Record<TemplateIndustry, number>>((acc, item) => {
    acc[item.industry] += 1;
    return acc;
  }, { 'drink-shop': 0, restaurant: 0, cafe: 0 });

  return (
    <div className="overflow-x-auto pb-1" role="tablist" aria-label="模板產業分類">
      <div className="inline-flex min-w-full gap-2 rounded-[28px] bg-slate-100 p-2 md:min-w-0">
        {(Object.keys(templateIndustryLabels) as TemplateIndustry[]).map(industry => {
          const active = value === industry;
          return (
            <button
              type="button"
              role="tab"
              aria-selected={active}
              key={industry}
              onClick={() => onChange(industry)}
              className={`whitespace-nowrap rounded-3xl px-5 py-3 text-sm font-black transition ${active ? 'bg-slate-950 text-white shadow-lg shadow-slate-900/20' : 'text-slate-600 hover:bg-white hover:text-slate-950'}`}
            >
              {templateIndustryLabels[industry]} <span className="ml-1 opacity-70">{counts[industry]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
