import type { IndustryType, TemplateStyle } from './site';

export type TemplateIndustry = 'drink-shop' | 'restaurant' | 'cafe';
export type TemplateSort = 'recommended' | 'popular' | 'newest' | 'beginner';

export type TemplateLayoutFamily =
  | 'drink-soft-brand'
  | 'drink-campaign'
  | 'drink-premium-tea'
  | 'restaurant-premium'
  | 'restaurant-family'
  | 'restaurant-fast-order'
  | 'cafe-minimal'
  | 'cafe-editorial'
  | 'cafe-artistic';

export type TemplateBackgroundMode =
  | 'soft-gradient'
  | 'image-hero'
  | 'editorial-split'
  | 'dark-premium'
  | 'playful-pattern'
  | 'warm-paper'
  | 'minimal-white';

export interface TemplateThemePreset {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  mutedTextColor: string;
  borderColor: string;
}

export interface TemplateBackgroundPreset {
  mode: TemplateBackgroundMode;
  pageBackground: string;
  heroBackground: string;
  sectionBackground: string;
  overlayColor?: string;
  useArtworkAsHeroBackground: boolean;
  useArtworkAsSectionAccent: boolean;
}


export type TemplateBackplateTexture = 'none' | 'noise' | 'paper' | 'grain' | 'glass' | 'neon-glow' | 'botanical' | 'luxury-dark';
export type TemplateBackplateHeroMode = 'artwork-full-bleed' | 'artwork-split' | 'artwork-card' | 'artwork-poster' | 'gradient-stage' | 'dark-neon-stage' | 'editorial-paper' | 'luxury-photo-backdrop';
export type TemplateBackplatePattern = 'none' | 'dots' | 'waves' | 'botanical' | 'neon-grid' | 'paper-grain';
export type TemplateBackplateShadow = 'none' | 'soft' | 'glow' | 'premium' | 'neon';

export interface TemplateBackplatePreset {
  page: {
    background: string;
    texture?: TemplateBackplateTexture;
    overlay?: string;
  };
  hero: {
    mode: TemplateBackplateHeroMode;
    background: string;
    overlay?: string;
    artworkOpacity: number;
    artworkBlendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light';
    artworkPosition: 'center' | 'right' | 'left' | 'top' | 'bottom';
    artworkSize: 'cover' | 'contain' | 'large' | 'medium';
  };
  sections: {
    surface: string;
    alternateSurface: string;
    cardSurface: string;
    border: string;
    shadow: TemplateBackplateShadow;
  };
  decorative: {
    glow?: string;
    radialGradient?: string;
    pattern?: TemplateBackplatePattern;
    cornerAccent?: string;
  };
}

export interface TemplateTypographyPreset {
  headingStyle: 'bold-modern' | 'editorial-serif' | 'rounded-friendly' | 'minimal-sans';
  bodyStyle: 'clean' | 'warm' | 'premium';
  headingScale: 'compact' | 'balanced' | 'dramatic';
}

export interface TemplateComponentStylePreset {
  buttonStyle: 'pill' | 'rounded' | 'square' | 'premium-line';
  cardStyle: 'soft' | 'glass' | 'minimal' | 'dark' | 'playful';
  radius: number;
  shadow: 'none' | 'soft' | 'medium' | 'dramatic';
  navStyle: 'floating' | 'solid' | 'transparent' | 'dark';
}

export interface TemplateExportStylePreset {
  assetStrategy: 'embed-artwork';
  mobileDensity: 'compact' | 'balanced' | 'airy';
  offlineSafe: true;
}

export interface TemplateGalleryItem {
  id: string;
  industry: TemplateIndustry;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  suitableFor: string[];
  styleTags: string[];
  badges: string[];
  palette: string[];
  aiArtworkKey: string;
  artworkSrc: string;
  recommended: boolean;
  popularityRank: number;
  newbieFriendly: boolean;
  baseTemplate: TemplateStyle;
  recommendationReason: string;
}

export interface TemplateArtworkBackplate {
  enabled: true;
  assetPath: string;
  mobileAssetPath?: string;
  desktopAssetPath?: string;
  cropMode: 'cover' | 'contain' | 'top-cover' | 'center-cover';
  overlay: string;
  textPanelMode: 'glass' | 'solid' | 'dark' | 'light' | 'none';
  textPanelPosition: 'left' | 'center' | 'bottom' | 'floating';
  textContrast: 'light' | 'dark';
  heroHeightDesktop: string;
  heroHeightMobile: string;
}

export interface TemplateSkinPreset {
  id: string;
  nav: { mode: 'floating-pill' | 'dark-bar' | 'minimal-line' | 'glass' | 'editorial'; background: string; textColor: string; accentColor: string; radius: number; border?: string; shadow?: string };
  page: { background: string; texture?: 'none' | 'grain' | 'paper' | 'neon-grid' | 'botanical' | 'soft-bubbles' | 'monochrome'; textColor: string; mutedTextColor: string };
  hero: { useArtworkBackplate: boolean; overlay: string; contentPanel: 'dark-glass' | 'light-glass' | 'solid-light' | 'solid-dark' | 'editorial-card'; contentPanelBackground: string; headingColor: string; subtitleColor: string; ctaStyle: 'neon' | 'matcha' | 'fruit' | 'amber' | 'premium-gold' | 'minimal-black' | 'coffee' };
  section: { background: string; alternateBackground: string; headingColor: string; eyebrowColor: string; dividerStyle: 'none' | 'soft-line' | 'bold-line' | 'glow-line' | 'editorial-rule'; spacing: 'compact' | 'balanced' | 'spacious' };
  productCard: { mode: 'soft-card' | 'dark-glass' | 'neon-card' | 'editorial-card' | 'minimal-line' | 'warm-paper' | 'playful'; background: string; textColor: string; priceColor: string; border: string; radius: number; shadow: string; imageTreatment: 'theme-placeholder' | 'artwork-crop' | 'soft-blob' | 'dark-frame' | 'minimal-frame' };
  menuList: { mode: 'clean-list' | 'dark-list' | 'premium-menu' | 'playful-menu' | 'editorial-menu'; background: string; rowBackground: string; rowBorder: string; categoryColor: string; priceColor: string };
  placeholder: { mode: 'themed-abstract' | 'artwork-crop' | 'icon-pattern' | 'minimal-shape'; background: string; accentShape: string; labelColor: string; showStoreSiteText: boolean };
  footer: { background: string; textColor: string; accentColor: string };
}

export interface TemplateCatalogItem extends TemplateGalleryItem {
  artworkBackplate: TemplateArtworkBackplate;
  skinPreset?: TemplateSkinPreset;
  aiArtwork: {
    key: string;
    gallerySrc: string;
    heroSrc: string;
    alt: string;
  };
  layoutFamily: TemplateLayoutFamily;
  themePreset: TemplateThemePreset;
  backgroundPreset: TemplateBackgroundPreset;
  backplatePreset: TemplateBackplatePreset;
  typographyPreset: TemplateTypographyPreset;
  componentStylePreset: TemplateComponentStylePreset;
  exportStylePreset: TemplateExportStylePreset;
}

export interface TemplateArtworkManifestItem {
  key: string;
  src: string;
  alt: string;
  industry: TemplateIndustry;
  slug: string;
  status: 'mock-svg-ready' | 'visual-ready';
}

export interface TemplateFilterState {
  industry: TemplateIndustry;
  query: string;
  tag: string;
  sort: TemplateSort;
}

export const templateIndustryLabels: Record<TemplateIndustry, string> = {
  'drink-shop': '飲料店',
  restaurant: '餐飲店',
  cafe: '咖啡廳',
};

export const templateSortLabels: Record<TemplateSort, string> = {
  recommended: '推薦優先',
  popular: '熱門優先',
  newest: '最新優先',
  beginner: '適合新手',
};

export function industryToSiteIndustry(industry: TemplateIndustry): IndustryType {
  return industry;
}
