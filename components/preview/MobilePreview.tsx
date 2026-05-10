import type { SiteData } from '@/types/site';
import { getTemplateBackplate } from '@/lib/templateBackplateStyles';
import { PreviewCanvas } from './PreviewCanvas';

export function MobilePreview({ data }: { data: SiteData }) {
  const backplate = getTemplateBackplate(data);
  return (
    <div className="mx-auto w-[390px] max-w-full rounded-[2.5rem] border-8 border-slate-900 bg-white p-2 shadow-xl" style={{ background: backplate.preset.page.background }}>
      <div className="mobile-preview-window h-[620px] overflow-y-auto overflow-x-hidden rounded-[1.7rem] overscroll-contain">
        <PreviewCanvas siteData={data} mode="mobile" viewportWidth={390} zoom="100" frame="none" minCanvasHeight={900} />
      </div>
    </div>
  );
}
