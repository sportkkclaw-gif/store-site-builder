import type { MediaAsset, SiteData, SiteVisual } from '@/types/site';
import type { TemplateCatalogItem, TemplateGalleryItem } from '@/types/template';
import { enrichTemplateItem } from './enrichTemplate';
import { getTemplateArtwork } from './templateArtworkResolver';

const TEMPLATE_MEDIA_PREFIX = 'template-artwork-';

async function imageToDataUrl(src: string): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  try {
    const response = await fetch(src, { cache: 'force-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn('[applyTemplatePreset] Template artwork could not be embedded.', error);
    return null;
  }
}

function siteButtonStyle(template: TemplateCatalogItem): SiteData['theme']['buttonStyle'] {
  if (template.componentStylePreset.buttonStyle === 'pill') return 'pill';
  if (template.componentStylePreset.buttonStyle === 'square') return 'square';
  return 'rounded';
}

function siteFontFamily(template: TemplateCatalogItem): SiteData['theme']['fontFamily'] {
  if (template.typographyPreset.headingStyle === 'editorial-serif') return 'serif';
  if (template.typographyPreset.headingStyle === 'rounded-friendly') return 'rounded';
  return 'sans';
}

function layoutDensity(template: TemplateCatalogItem): SiteData['theme']['layoutDensity'] {
  if (template.exportStylePreset.mobileDensity === 'compact') return 'compact';
  if (template.typographyPreset.headingScale === 'dramatic') return 'spacious';
  return 'comfortable';
}

function heroTreatment(template: TemplateCatalogItem): SiteVisual['heroTreatment'] {
  if (template.backgroundPreset.useArtworkAsHeroBackground) return 'full-bleed-overlay';
  if (template.backgroundPreset.mode === 'minimal-white') return 'minimal-crop';
  if (template.baseTemplate === 'playful-colorful') return 'floating-artwork';
  return 'split-image';
}

function buildVisual(template: TemplateCatalogItem, previousIndustry: SiteData['industry']): SiteVisual {
  const crossIndustryNotice = previousIndustry !== template.industry
    ? '你正在套用跨產業模板，內容仍會保留，但部分區塊語氣會依模板調整。'
    : undefined;
  const preset = {
    selectedTemplateId: template.id,
    layoutFamily: template.layoutFamily,
    backgroundMode: template.backgroundPreset.mode,
    aiArtworkKey: template.aiArtworkKey,
    heroTreatment: heroTreatment(template),
    navStyle: template.componentStylePreset.navStyle,
    cardStyle: template.componentStylePreset.cardStyle,
    styleLabel: `${template.styleTags.slice(0, 3).join(' / ')} / ${templateIndustryName(template.industry)}`,
  };
  return { ...preset, templatePreset: preset, appliedAt: new Date().toISOString(), crossIndustryNotice };
}

function templateIndustryName(industry: TemplateGalleryItem['industry']) {
  if (industry === 'restaurant') return '餐飲店';
  if (industry === 'cafe') return '咖啡廳';
  return '飲料店';
}

export async function applyTemplatePreset(data: SiteData, templateItem: TemplateGalleryItem): Promise<SiteData> {
  const template = enrichTemplateItem(templateItem);
  const mediaId = `${TEMPLATE_MEDIA_PREFIX}${template.id}`;
  const artwork = getTemplateArtwork(template);
  const embeddedHero = await imageToDataUrl(artwork.gallerySrc);
  const templateMedia: MediaAsset = {
    id: mediaId,
    name: `${template.name} 模板主視覺`,
    type: 'hero',
    mimeType: embeddedHero ? 'image/png' : 'image/png',
    dataUrl: embeddedHero || artwork.gallerySrc,
  };
  const media = [templateMedia, ...data.media.filter(asset => !asset.id.startsWith(TEMPLATE_MEDIA_PREFIX))];
  return applyTemplatePresetToData(data, template, mediaId, media);
}

export function applyTemplatePresetSync(data: SiteData, templateItem: TemplateGalleryItem): SiteData {
  const template = enrichTemplateItem(templateItem);
  const mediaId = `${TEMPLATE_MEDIA_PREFIX}${template.id}`;
  const artwork = getTemplateArtwork(template);
  const templateMedia: MediaAsset = {
    id: mediaId,
    name: `${template.name} 模板主視覺`,
    type: 'hero',
    mimeType: 'image/png',
    dataUrl: artwork.gallerySrc,
  };
  const media = [templateMedia, ...data.media.filter(asset => !asset.id.startsWith(TEMPLATE_MEDIA_PREFIX))];
  return applyTemplatePresetToData(data, template, mediaId, media);
}

function applyTemplatePresetToData(data: SiteData, template: TemplateCatalogItem, mediaId: string, media: MediaAsset[]): SiteData {
  return {
    ...data,
    industry: template.industry,
    template: template.baseTemplate,
    galleryTemplateId: template.id,
    theme: {
      ...data.theme,
      primaryColor: template.themePreset.primaryColor,
      secondaryColor: template.themePreset.secondaryColor,
      backgroundColor: template.themePreset.backgroundColor,
      textColor: template.themePreset.textColor,
      fontFamily: siteFontFamily(template),
      buttonStyle: siteButtonStyle(template),
      sectionRadius: template.componentStylePreset.radius,
      layoutDensity: layoutDensity(template),
    },
    visual: buildVisual(template, data.industry),
    hero: { ...data.hero, imageId: mediaId },
    seo: { ...data.seo, ogImageId: mediaId },
    media,
  };
}

export function selectedTemplateDisplayName(data: SiteData, fallbackName: string, lookup: (id?: string) => TemplateGalleryItem | undefined) {
  return lookup(data.galleryTemplateId)?.name || fallbackName;
}
