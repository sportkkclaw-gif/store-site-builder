import type { SiteData } from '@/types/site';
import { getTemplateBackplate } from '@/lib/templateBackplateStyles';
import { PreviewCanvas } from './PreviewCanvas';

export function DesktopPreview({ data }: { data: SiteData }) {
  const backplate = getTemplateBackplate(data);
  return (
    <div className="desktop-preview-frame overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70" style={{ background: backplate.preset.page.background }}>
      <div className="desktop-preview-window max-h-[720px] overflow-auto">
        <PreviewCanvas siteData={data} mode="desktop" viewportWidth={1440} zoom="fit" frame="browser" minCanvasHeight={1680} />
      </div>
    </div>
  );
}
