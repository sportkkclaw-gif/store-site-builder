import type { SiteData } from '@/types/site';
import type { TemplateCatalogItem, TemplateGalleryItem } from '@/types/template';
import { getEnrichedTemplateById, enrichTemplateItem } from './enrichTemplate';
import { templateCatalog } from './templateCatalog';

export interface TemplateVisualStyle {
  pageBackgroundStyle: string;
  heroBackgroundStyle: string;
  sectionBackgroundStyle: string;
  imageTreatment: 'split-image'|'full-bleed-overlay'|'floating-artwork'|'minimal-crop';
  textContrastMode: 'light-on-dark'|'dark-on-light';
  cardBackground: string;
  cardBorder: string;
  cardShadow: string;
  buttonCss: string;
  navCss: string;
  radius: number;
  headingScale: number;
  layoutFamily: string;
  styleLabel: string;
}

function fromTemplate(template: TemplateCatalogItem): TemplateVisualStyle {
  const dark = template.themePreset.textColor === '#F8FAFC' || template.backgroundPreset.mode === 'dark-premium';
  const shadow = template.componentStylePreset.shadow === 'dramatic' ? '0 26px 70px rgba(15,23,42,.24)' : template.componentStylePreset.shadow === 'none' ? 'none' : '0 18px 45px rgba(15,23,42,.12)';
  const buttonCss = template.componentStylePreset.buttonStyle === 'premium-line'
    ? `background:transparent;color:${template.themePreset.primaryColor};border:1px solid ${template.themePreset.primaryColor}`
    : `background:${template.themePreset.primaryColor};color:${dark ? '#111827' : '#fff'};border:1px solid transparent`;
  const navCss = template.componentStylePreset.navStyle === 'dark'
    ? 'background:rgba(15,23,42,.92);color:#fff;border:1px solid rgba(255,255,255,.16)'
    : template.componentStylePreset.navStyle === 'transparent'
      ? 'background:transparent;color:inherit;border:1px solid transparent'
      : `background:${template.themePreset.surfaceColor};color:${template.themePreset.textColor};border:1px solid ${template.themePreset.borderColor}`;
  return {
    pageBackgroundStyle: template.backgroundPreset.pageBackground,
    heroBackgroundStyle: template.backgroundPreset.heroBackground,
    sectionBackgroundStyle: template.backgroundPreset.sectionBackground,
    imageTreatment: template.backgroundPreset.useArtworkAsHeroBackground ? 'full-bleed-overlay' : template.backgroundPreset.mode === 'minimal-white' ? 'minimal-crop' : template.baseTemplate === 'playful-colorful' ? 'floating-artwork' : 'split-image',
    textContrastMode: dark ? 'light-on-dark' : 'dark-on-light',
    cardBackground: template.themePreset.surfaceColor,
    cardBorder: template.themePreset.borderColor,
    cardShadow: shadow,
    buttonCss,
    navCss,
    radius: template.componentStylePreset.radius,
    headingScale: template.typographyPreset.headingScale === 'dramatic' ? 1.12 : template.typographyPreset.headingScale === 'compact' ? .92 : 1,
    layoutFamily: template.layoutFamily,
    styleLabel: `${template.styleTags.slice(0, 3).join(' / ')} / ${template.industry === 'cafe' ? '咖啡廳' : template.industry === 'restaurant' ? '餐飲店' : '飲料店'}`,
  };
}

export function getTemplateVisualStyle(input: SiteData | TemplateGalleryItem | TemplateCatalogItem): TemplateVisualStyle {
  if ('store' in input) {
    const template = input.galleryTemplateId ? getEnrichedTemplateById(input.galleryTemplateId, templateCatalog) : undefined;
    if (template) return fromTemplate(template);
    return {
      pageBackgroundStyle: input.theme.backgroundColor,
      heroBackgroundStyle: `linear-gradient(135deg, ${input.theme.backgroundColor}, ${input.theme.secondaryColor}33)`,
      sectionBackgroundStyle: 'rgba(255,255,255,.88)',
      imageTreatment: input.visual?.heroTreatment || 'split-image',
      textContrastMode: 'dark-on-light',
      cardBackground: 'rgba(255,255,255,.88)',
      cardBorder: 'rgba(15,23,42,.10)',
      cardShadow: '0 18px 45px rgba(15,23,42,.12)',
      buttonCss: `background:${input.theme.primaryColor};color:#fff;border:1px solid transparent`,
      navCss: 'background:rgba(255,255,255,.88);color:inherit;border:1px solid rgba(15,23,42,.10)',
      radius: input.theme.sectionRadius,
      headingScale: 1,
      layoutFamily: input.visual?.layoutFamily || input.template,
      styleLabel: input.visual?.templatePreset?.styleLabel || input.visual?.layoutFamily || input.template,
    };
  }
  return fromTemplate('themePreset' in input ? input : enrichTemplateItem(input));
}
