import type { TemplateCatalogItem, TemplateGalleryItem, TemplateLayoutFamily, TemplateBackgroundMode } from '@/types/template';
import { getTemplateBackplatePreset } from './templateBackplateStyles';
import { getTemplateArtwork } from './templateArtworkResolver';

function layoutFamilyFor(template: TemplateGalleryItem): TemplateLayoutFamily {
  if (template.industry === 'drink-shop') {
    if (template.baseTemplate === 'playful-colorful') return 'drink-campaign';
    if (template.baseTemplate === 'premium-minimal') return 'drink-premium-tea';
    return 'drink-soft-brand';
  }
  if (template.industry === 'restaurant') {
    if (template.baseTemplate === 'playful-colorful') return 'restaurant-fast-order';
    if (template.baseTemplate === 'premium-minimal') return 'restaurant-premium';
    return 'restaurant-family';
  }
  if (template.baseTemplate === 'playful-colorful') return 'cafe-artistic';
  if (template.baseTemplate === 'premium-minimal') return 'cafe-minimal';
  return 'cafe-editorial';
}

function backgroundModeFor(template: TemplateGalleryItem): TemplateBackgroundMode {
  const tags = template.styleTags.join(' ');
  if (template.baseTemplate === 'premium-minimal' && /黑白|奢華|深焙|晚宴/.test(tags)) return 'dark-premium';
  if (template.baseTemplate === 'premium-minimal') return 'minimal-white';
  if (template.baseTemplate === 'playful-colorful') return 'playful-pattern';
  if (/書房|藝術|街區/.test(tags)) return 'editorial-split';
  if (/溫暖|甜點|黑糖|焦糖/.test(tags)) return 'warm-paper';
  if (/霓光|市集|派對/.test(tags)) return 'image-hero';
  return 'soft-gradient';
}

function textColorFor(template: TemplateGalleryItem, mode: TemplateBackgroundMode) {
  if (mode === 'dark-premium' || template.palette[0] === '#12051F') return '#F8FAFC';
  return template.palette[3] || '#0F172A';
}

function fontFor(template: TemplateGalleryItem): 'sans'|'serif'|'rounded' {
  if (template.styleTags.some(tag => ['日式','書房','高質感','奢華','深焙','手沖','黑白'].includes(tag))) return 'serif';
  if (template.styleTags.some(tag => ['活潑','水果','霓光','促銷','蜜桃','市集','派對'].includes(tag))) return 'rounded';
  return 'sans';
}

export function enrichTemplateItem(template: TemplateGalleryItem): TemplateCatalogItem {
  const [p0 = '#14B8A6', p1 = '#F4C27A', p2 = '#FFFDF7', p3 = '#0F172A'] = template.palette;
  const mode = backgroundModeFor(template);
  const layoutFamily = layoutFamilyFor(template);
  const isDark = mode === 'dark-premium' || p0 === '#12051F';
  const primaryColor = isDark ? (p1 || '#F8FAFC') : p0;
  const accentColor = p3 || p1;
  const backgroundColor = mode === 'minimal-white' ? '#FFFFFF' : mode === 'dark-premium' ? '#111827' : p2;
  const surfaceColor = isDark ? 'rgba(17,24,39,.82)' : mode === 'minimal-white' ? 'rgba(255,255,255,.94)' : 'rgba(255,255,255,.86)';
  const borderColor = isDark ? 'rgba(255,255,255,.18)' : 'rgba(15,23,42,.10)';
  const heroSrc = template.artworkSrc;
  const artwork = getTemplateArtwork(template);
  const radius = template.baseTemplate === 'playful-colorful' ? 36 : template.baseTemplate === 'premium-minimal' ? 16 : 28;

  return {
    ...template,
    aiArtwork: { key: template.aiArtworkKey, gallerySrc: template.artworkSrc, heroSrc, alt: `${template.name} AI 主視覺` },
    artworkBackplate: artwork.backplate,
    layoutFamily,
    themePreset: {
      primaryColor,
      secondaryColor: p1,
      accentColor,
      backgroundColor,
      surfaceColor,
      textColor: textColorFor(template, mode),
      mutedTextColor: isDark ? '#CBD5E1' : '#64748B',
      borderColor,
    },
    backgroundPreset: {
      mode,
      pageBackground: mode === 'playful-pattern'
        ? `radial-gradient(circle at 18% 10%, ${accentColor}44, transparent 22%), linear-gradient(135deg, ${backgroundColor}, ${p1})`
        : mode === 'dark-premium'
          ? `linear-gradient(135deg, rgba(0,0,0,.68), rgba(17,24,39,.92)), ${p0}`
          : mode === 'minimal-white'
            ? `linear-gradient(135deg, #ffffff, ${p2})`
            : `radial-gradient(circle at 16% 6%, ${p1}44, transparent 30%), linear-gradient(180deg, ${backgroundColor}, #ffffff)`,
      heroBackground: mode === 'image-hero' || mode === 'dark-premium'
        ? `linear-gradient(135deg, ${isDark ? 'rgba(0,0,0,.62)' : 'rgba(255,255,255,.72)'}, ${isDark ? 'rgba(0,0,0,.28)' : 'rgba(255,255,255,.36)'})`
        : `linear-gradient(135deg, ${backgroundColor}, ${p1}33)`,
      sectionBackground: surfaceColor,
      overlayColor: isDark ? 'rgba(0,0,0,.52)' : 'rgba(255,255,255,.68)',
      useArtworkAsHeroBackground: mode === 'image-hero' || mode === 'dark-premium',
      useArtworkAsSectionAccent: mode !== 'minimal-white',
    },
    backplatePreset: getTemplateBackplatePreset(template),
    typographyPreset: {
      headingStyle: fontFor(template) === 'serif' ? 'editorial-serif' : fontFor(template) === 'rounded' ? 'rounded-friendly' : template.baseTemplate === 'premium-minimal' ? 'minimal-sans' : 'bold-modern',
      bodyStyle: template.styleTags.some(tag => ['高質感','奢華','黑白','手沖'].includes(tag)) ? 'premium' : template.styleTags.some(tag => ['溫暖','甜點','日式'].includes(tag)) ? 'warm' : 'clean',
      headingScale: template.baseTemplate === 'playful-colorful' ? 'dramatic' : template.baseTemplate === 'premium-minimal' ? 'compact' : 'balanced',
    },
    componentStylePreset: {
      buttonStyle: template.baseTemplate === 'premium-minimal' ? 'premium-line' : template.baseTemplate === 'playful-colorful' ? 'pill' : 'rounded',
      cardStyle: isDark ? 'dark' : template.baseTemplate === 'playful-colorful' ? 'playful' : mode === 'minimal-white' ? 'minimal' : 'soft',
      radius,
      shadow: template.baseTemplate === 'premium-minimal' ? 'soft' : template.baseTemplate === 'playful-colorful' ? 'dramatic' : 'medium',
      navStyle: isDark ? 'dark' : template.baseTemplate === 'premium-minimal' ? 'solid' : 'floating',
    },
    exportStylePreset: { assetStrategy: 'embed-artwork', mobileDensity: template.baseTemplate === 'playful-colorful' ? 'compact' : 'balanced', offlineSafe: true },
  };
}

export function enrichAllTemplates(catalog: TemplateGalleryItem[]): TemplateCatalogItem[] { return catalog.map(enrichTemplateItem); }
export function getEnrichedTemplateById(id: string, catalog: TemplateGalleryItem[]): TemplateCatalogItem | undefined { const item = catalog.find(t => t.id === id); return item ? enrichTemplateItem(item) : undefined; }
