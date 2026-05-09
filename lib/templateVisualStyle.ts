import type { SiteData } from '@/types/site';
import type { TemplateCatalogItem, TemplateGalleryItem } from '@/types/template';
import { getEnrichedTemplateById, enrichTemplateItem } from './enrichTemplate';
import { templateCatalog } from './templateCatalog';
import { getTemplateImageTreatment, type TemplateImageTreatmentKind } from './templateImageTreatment';
import { getTemplateBackplate } from './templateBackplateStyles';

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
  ctaBackground: string;
  ctaTextColor: string;
  overlayColor: string;
  decorativeTextOpacity: number;
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function readableButtonText(background: string) {
  const rgb = hexToRgb(background);
  if (!rgb) return '#FFFFFF';
  const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
  return luminance > 0.62 ? '#0F172A' : '#FFFFFF';
}

export function getReadableHeroTextStyle(template: TemplateCatalogItem) {
  const darkBackground = template.backgroundPreset.mode === 'dark-premium' || template.backgroundPreset.useArtworkAsHeroBackground;
  const playful = template.backgroundPreset.mode === 'playful-pattern';
  const neonCampaign = template.slug === 'drink-boba-neon' || template.palette[0] === '#12051F';
  const ctaBackground = neonCampaign ? '#06B6D4' : darkBackground ? (template.themePreset.secondaryColor || '#F4C27A') : template.themePreset.primaryColor;

  if (neonCampaign) {
    return {
      headingColor: '#FFFFFF',
      subtitleColor: 'rgba(255,255,255,.88)',
      eyebrowColor: '#7DD3FC',
      overlay: 'linear-gradient(135deg, rgba(6,8,26,.82), rgba(36,10,64,.62), rgba(6,182,212,.18))',
      overlayColor: 'rgba(6,8,26,.62)',
      textShadow: '0 4px 28px rgba(0,0,0,.58)',
      panelBackground: 'rgba(15,23,42,.78)',
      ctaBackground,
      ctaTextColor: readableButtonText(ctaBackground),
      decorativeTextOpacity: 0.09,
    };
  }

  if (darkBackground) {
    const bg = ctaBackground;
    return {
      headingColor: '#FFFFFF',
      subtitleColor: 'rgba(255,255,255,.88)',
      eyebrowColor: '#FFFFFF',
      overlay: template.backgroundPreset.overlayColor || 'linear-gradient(90deg, rgba(2,6,23,.84), rgba(2,6,23,.46))',
      overlayColor: 'rgba(2,6,23,.58)',
      textShadow: '0 3px 26px rgba(0,0,0,.50)',
      panelBackground: 'rgba(2,6,23,.68)',
      ctaBackground: bg,
      ctaTextColor: readableButtonText(bg),
      decorativeTextOpacity: 0.08,
    };
  }

  const bg = ctaBackground;
  return {
    headingColor: '#0F172A',
    subtitleColor: 'rgba(15,23,42,.78)',
    eyebrowColor: template.themePreset.primaryColor,
    overlay: template.backgroundPreset.overlayColor || 'linear-gradient(90deg, rgba(255,255,255,.94), rgba(255,255,255,.60))',
    overlayColor: 'rgba(255,255,255,.60)',
    textShadow: playful ? '0 2px 18px rgba(255,255,255,.72)' : 'none',
    panelBackground: playful ? 'rgba(255,255,255,.92)' : 'rgba(255,255,255,.78)',
    ctaBackground: bg,
    ctaTextColor: readableButtonText(bg),
    decorativeTextOpacity: playful ? 0.08 : 0.06,
  };
}

function fromTemplate(template: TemplateCatalogItem): TemplateVisualStyle {
  const treatment = getTemplateImageTreatment(template);
  const backplate = getTemplateBackplate(template);
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
    pageBackgroundStyle: backplate.preset.page.background,
    heroBackgroundStyle: backplate.preset.hero.background,
    sectionBackgroundStyle: backplate.preset.sections.surface,
    imageTreatment: treatment.imageTreatment,
    heroLayout: treatment.heroLayout,
    artworkPosition: treatment.artworkPosition,
    objectFit: treatment.objectFit,
    overlay: readable.overlay || treatment.overlay,
    heroMinHeight: treatment.heroMinHeight,
    mobileHeroLayout: treatment.mobileHeroLayout,
    textContrastMode: treatment.textContrast || (dark ? 'light-on-dark' : 'dark-on-light'),
    cardBackground: backplate.preset.sections.cardSurface,
    cardBorder: backplate.preset.sections.border,
    cardShadow: backplate.shadowCss,
    buttonCss: `background:${readable.ctaBackground};color:${readable.ctaTextColor};border:1px solid rgba(255,255,255,.18)`,
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
    ctaBackground: readable.ctaBackground,
    ctaTextColor: readable.ctaTextColor,
    overlayColor: readable.overlayColor,
    decorativeTextOpacity: readable.decorativeTextOpacity,
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
      panelBackground: 'rgba(255,255,255,.78)',
      ctaBackground: input.theme.primaryColor,
      ctaTextColor: readableButtonText(input.theme.primaryColor),
      overlayColor: 'rgba(255,255,255,.62)',
      decorativeTextOpacity: 0.06,
    };
  }
  return fromTemplate('themePreset' in input ? input : enrichTemplateItem(input));
}
