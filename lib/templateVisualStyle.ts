import type { SiteData } from '@/types/site';
import type { TemplateCatalogItem, TemplateGalleryItem } from '@/types/template';
import { getEnrichedTemplateById, enrichTemplateItem } from './enrichTemplate';
import { templateCatalog } from './templateCatalog';
import { getTemplateImageTreatment, type TemplateImageTreatmentKind } from './templateImageTreatment';

export interface TemplateVisualStyle {
  pageBackgroundStyle: string;
  heroBackgroundStyle: string;
  sectionBackgroundStyle: string;
  imageTreatment: TemplateImageTreatmentKind | 'split-image'|'full-bleed-overlay'|'floating-artwork'|'minimal-crop';
  heroLayout: string;
  artworkPosition: string;
  objectFit: 'cover' | 'contain';
  overlay: string;
  heroMinHeight: string;
  mobileHeroLayout: string;
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
  headingColor: string;
  subtitleColor: string;
  eyebrowColor: string;
  textShadow: string;
  panelBackground: string;
}

export function getReadableHeroTextStyle(template: TemplateCatalogItem) {
  const darkBackground = template.backgroundPreset.mode === 'dark-premium' || template.backgroundPreset.useArtworkAsHeroBackground;
  const playful = template.backgroundPreset.mode === 'playful-pattern';
  const paleText = ['#FFFFFF', '#F8FAFC', '#FFF7ED'].includes(template.themePreset.textColor.toUpperCase());
  const needsPanel = playful || (!darkBackground && paleText);
  if (darkBackground) {
    return {
      headingColor: '#FFFFFF',
      subtitleColor: 'rgba(255,255,255,.86)',
      eyebrowColor: '#FFFFFF',
      overlay: template.backgroundPreset.overlayColor || 'linear-gradient(90deg, rgba(2,6,23,.84), rgba(2,6,23,.46))',
      textShadow: '0 3px 26px rgba(0,0,0,.48)',
      panelBackground: 'rgba(2,6,23,.32)',
    };
  }
  return {
    headingColor: template.themePreset.textColor === '#FFFFFF' ? '#0F172A' : template.themePreset.textColor,
    subtitleColor: template.themePreset.mutedTextColor || 'rgba(15,23,42,.72)',
    eyebrowColor: template.themePreset.primaryColor,
    overlay: template.backgroundPreset.overlayColor || 'linear-gradient(90deg, rgba(255,255,255,.92), rgba(255,255,255,.58))',
    textShadow: needsPanel ? '0 2px 18px rgba(255,255,255,.72)' : 'none',
    panelBackground: needsPanel ? 'rgba(255,255,255,.82)' : 'transparent',
  };
}

function fromTemplate(template: TemplateCatalogItem): TemplateVisualStyle {
  const treatment = getTemplateImageTreatment(template);
  const readable = getReadableHeroTextStyle(template);
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
    imageTreatment: treatment.imageTreatment,
    heroLayout: treatment.heroLayout,
    artworkPosition: treatment.artworkPosition,
    objectFit: treatment.objectFit,
    overlay: readable.overlay || treatment.overlay,
    heroMinHeight: treatment.heroMinHeight,
    mobileHeroLayout: treatment.mobileHeroLayout,
    textContrastMode: treatment.textContrast || (dark ? 'light-on-dark' : 'dark-on-light'),
    cardBackground: template.themePreset.surfaceColor,
    cardBorder: template.themePreset.borderColor,
    cardShadow: shadow,
    buttonCss,
    navCss,
    radius: template.componentStylePreset.radius,
    headingScale: template.typographyPreset.headingScale === 'dramatic' ? 1.12 : template.typographyPreset.headingScale === 'compact' ? .92 : 1,
    layoutFamily: template.layoutFamily,
    styleLabel: `${template.styleTags.slice(0, 3).join(' / ')} / ${template.industry === 'cafe' ? '咖啡廳' : template.industry === 'restaurant' ? '餐飲店' : '飲料店'}`,
    headingColor: readable.headingColor,
    subtitleColor: readable.subtitleColor,
    eyebrowColor: readable.eyebrowColor,
    textShadow: readable.textShadow,
    panelBackground: readable.panelBackground,
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
      heroLayout: 'split',
      artworkPosition: 'right',
      objectFit: 'cover',
      overlay: 'linear-gradient(90deg, rgba(255,255,255,.94), rgba(255,255,255,.42))',
      heroMinHeight: '500px',
      mobileHeroLayout: 'stacked',
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
      headingColor: input.theme.textColor,
      subtitleColor: 'rgba(15,23,42,.72)',
      eyebrowColor: input.theme.primaryColor,
      textShadow: 'none',
      panelBackground: 'transparent',
    };
  }
  return fromTemplate('themePreset' in input ? input : enrichTemplateItem(input));
}
