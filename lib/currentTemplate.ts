import type { SiteData } from '@/types/site';
import { getTemplateById, templateCatalog } from './templateCatalog';

export function getCurrentTemplateId(siteData?: Partial<SiteData> | null): string {
  return (
    siteData?.visual?.selectedTemplateId ||
    siteData?.galleryTemplateId ||
    siteData?.template ||
    templateCatalog[0].id
  );
}

export function getCurrentTemplate(siteData?: Partial<SiteData> | null) {
  return getTemplateById(getCurrentTemplateId(siteData)) || templateCatalog[0];
}
