import type { SiteData } from '@/types/site';
import { StoreWebsiteRenderer } from '@/components/templates/StoreWebsiteRenderer';
import { getTemplateBackplate } from '@/lib/templateBackplateStyles';

export function MobilePreview({ data }: { data: SiteData }) {
  const backplate = getTemplateBackplate(data);
  return (
    <div className="mx-auto w-[390px] max-w-full rounded-[2.5rem] border-8 border-slate-900 bg-white p-2 shadow-xl" style={{ background: backplate.preset.page.background }}>
      <div className="mx-auto mb-2 h-5 w-28 rounded-b-2xl bg-slate-900" />
      <div className="mobile-preview-window h-[620px] overflow-y-auto overflow-x-hidden rounded-[1.7rem] overscroll-contain">
        <StoreWebsiteRenderer data={data} />
      </div>
    </div>
  );
}
