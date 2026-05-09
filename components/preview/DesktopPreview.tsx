import type { SiteData } from '@/types/site';
import { StoreWebsiteRenderer } from '@/components/templates/StoreWebsiteRenderer';
import { getTemplateBackplate } from '@/lib/templateBackplateStyles';

export function DesktopPreview({ data }: { data: SiteData }) {
  const backplate = getTemplateBackplate(data);
  return (
    <div className="desktop-preview-frame overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70" style={{ background: backplate.preset.page.background }}>
      <div className="flex items-center gap-2 bg-slate-100/90 px-4 py-3 backdrop-blur">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span className="h-3 w-3 rounded-full bg-green-400" />
        <span className="ml-3 h-6 flex-1 rounded-full bg-white" />
      </div>
      <div className="desktop-preview-window max-h-[720px] overflow-auto">
        <div className="desktop-preview-canvas">
          <StoreWebsiteRenderer data={data} />
        </div>
      </div>
    </div>
  );
}
