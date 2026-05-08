import type { SiteData } from '@/types/site';
import type { TemplateGalleryItem } from '@/types/template';
import { applyTemplatePreset, selectedTemplateDisplayName } from './applyTemplatePreset';

export async function createTemplateAppliedSiteData(data: SiteData, template: TemplateGalleryItem): Promise<SiteData> {
  return applyTemplatePreset(data, template);
}

export { selectedTemplateDisplayName };
