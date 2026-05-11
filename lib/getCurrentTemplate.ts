import type { SiteData } from '@/types/site';
import type { TemplateGalleryItem } from '@/types/template';
import { getTemplateById, templateCatalog } from './templateCatalog';

function isCatalogTemplateId(value?: string | null): value is string {
  return Boolean(value && getTemplateById(value));
}

export function getCurrentTemplateId(siteData?: Partial<SiteData> | null): string {
  const visualId = siteData?.visual?.selectedTemplateId;
  const presetId = siteData?.visual?.templatePreset?.selectedTemplateId;
  const galleryId = siteData?.galleryTemplateId;
  const candidates = [visualId, presetId, galleryId];
  return candidates.find(isCatalogTemplateId) || galleryId || visualId || presetId || templateCatalog[0].id;
}

export function getCurrentTemplateItem(siteData?: Partial<SiteData> | null): TemplateGalleryItem {
  return getTemplateById(getCurrentTemplateId(siteData)) || templateCatalog[0];
}

export const getCurrentTemplate = getCurrentTemplateItem;

export function getCurrentSkinFamily(siteData?: Partial<SiteData> | null): string {
  const template = getCurrentTemplateItem(siteData);
  return template.skinFamily || template.skinId || template.id;
}

export function setCurrentTemplateId(siteData: SiteData, templateId: string): SiteData {
  const template = getTemplateById(templateId) || getCurrentTemplateItem(siteData);
  const next: SiteData = {
    ...siteData,
    template: template.baseTemplate,
    galleryTemplateId: template.id,
    visual: {
      ...siteData.visual!,
      selectedTemplateId: template.id,
      layoutFamily: siteData.visual?.layoutFamily || `${template.id}-layout`,
      aiArtworkKey: siteData.visual?.aiArtworkKey || template.id,
      templatePreset: {
        ...siteData.visual?.templatePreset!,
        selectedTemplateId: template.id,
        layoutFamily: siteData.visual?.templatePreset?.layoutFamily || `${template.id}-layout`,
        aiArtworkKey: siteData.visual?.templatePreset?.aiArtworkKey || template.id,
      },
    },
  };
  return next;
}

export function normalizeCurrentTemplateFields(siteData: SiteData): SiteData {
  return setCurrentTemplateId(siteData, getCurrentTemplateId(siteData));
}
