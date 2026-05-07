import type { IndustryType, TemplateStyle } from './site';

export type TemplateIndustry = 'drink-shop' | 'restaurant' | 'cafe';
export type TemplateSort = 'recommended' | 'popular' | 'newest' | 'beginner';

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
  prompt: string;
  recommended: boolean;
  popularityRank: number;
  newbieFriendly: boolean;
  baseTemplate: TemplateStyle;
  recommendationReason: string;
}

export interface TemplateArtworkManifestItem {
  key: string;
  src: string;
  alt: string;
  industry: TemplateIndustry;
  slug: string;
  prompt: string;
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
