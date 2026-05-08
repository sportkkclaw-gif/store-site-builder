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

export interface TemplateCatalogItem extends TemplateGalleryItem {
  aiArtwork: {
    key: string;
    gallerySrc: string;
    heroSrc: string;
    alt: string;
  };
  layoutFamily: TemplateLayoutFamily;
  themePreset: TemplateThemePreset;
  backgroundPreset: TemplateBackgroundPreset;
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
  status: 'mock-svg-ready' | 'ai-generated-ready';
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
