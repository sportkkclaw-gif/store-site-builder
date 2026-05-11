'use client';

import { useRef } from 'react';
import type { SiteData } from '@/types/site';
import { getTemplateBackplate } from '@/lib/templateBackplateStyles';
import { PreviewCanvas } from './PreviewCanvas';

export function MobilePreview({ data }: { data: SiteData }) {
  const backplate = getTemplateBackplate(data);
  const fitRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={fitRef} className="mobile-preview-fit-shell mx-auto w-full max-w-[390px]" style={{ background: backplate.preset.page.background }}>
      <PreviewCanvas siteData={data} mode="mobile" viewportWidth={390} zoom="fit" frame="phone" fitContainerRef={fitRef} />
    </div>
  );
}
