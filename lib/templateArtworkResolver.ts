import type { SiteData } from '@/types/site';
import type { TemplateCatalogItem, TemplateGalleryItem } from '@/types/template';
import { getTemplateById, templateCatalog } from './templateCatalog';

export type ArtworkCropMode = 'cover' | 'contain' | 'top-cover' | 'center-cover';
export type MobileArtworkMode = 'contain-poster' | 'safe-cover' | 'top-contain' | 'center-contain' | 'cropped-window' | 'background-soft';
export type ArtworkTextPanelMode = 'glass' | 'solid' | 'dark' | 'light' | 'none';
export type ArtworkTextPanelPosition = 'left' | 'center' | 'bottom' | 'floating';
export type ArtworkTextContrast = 'light' | 'dark';

export interface TemplateArtworkBackplate {
  enabled: true;
  assetPath: string;
  mobileAssetPath?: string;
  desktopAssetPath?: string;
  cropMode: ArtworkCropMode;
  overlay: string;
  textPanelMode: ArtworkTextPanelMode;
  textPanelPosition: ArtworkTextPanelPosition;
  textContrast: ArtworkTextContrast;
  heroHeightDesktop: string;
  heroHeightMobile: string;
  mobileArtworkMode: MobileArtworkMode;
}

export interface TemplateArtworkSources {
  templateId: string;
  gallerySrc: string;
  previewSrc: string;
  exportSrc: string;
  mobileSrc: string;
  desktopSrc: string;
  exportAssetPath: string;
  exportAssetFileName: string;
  backplate: TemplateArtworkBackplate;
}

const DEFAULT_BACKPLATE: Omit<TemplateArtworkBackplate, 'assetPath'> = {
  enabled: true,
  cropMode: 'top-cover',
  mobileArtworkMode: 'contain-poster',
  overlay: 'rgba(0,0,0,0.26)',
  textPanelMode: 'glass',
  textPanelPosition: 'left',
  textContrast: 'light',
  heroHeightDesktop: '620px',
  heroHeightMobile: '760px',
};

const overrides: Record<string, Partial<TemplateArtworkBackplate>> = {
  'drink-boba-neon': { overlay: 'rgba(5, 8, 24, 0.35)', textPanelMode: 'dark', textContrast: 'light', textPanelPosition: 'left', cropMode: 'top-cover' },
  'drink-matcha-hiyori': { overlay: 'rgba(255, 250, 240, 0.28)', textPanelMode: 'light', textContrast: 'dark', textPanelPosition: 'left', cropMode: 'top-cover', mobileArtworkMode: 'top-contain' },
  'drink-fruit-paradise': { overlay: 'rgba(255,255,255,0.22)', textPanelMode: 'light', textContrast: 'dark', textPanelPosition: 'left', cropMode: 'top-cover' },
  'drink-brown-sugar-amber': { overlay: 'rgba(20, 10, 4, 0.35)', textPanelMode: 'dark', textContrast: 'light', textPanelPosition: 'left', cropMode: 'top-cover' },
  'drink-white-peach-sparkle': { overlay: 'rgba(255,240,235,0.22)', textPanelMode: 'light', textContrast: 'dark', textPanelPosition: 'left', cropMode: 'top-cover' },
  'drink-tea-mist-ridge': { overlay: 'rgba(8,22,15,0.32)', textPanelMode: 'dark', textContrast: 'light', textPanelPosition: 'left', cropMode: 'top-cover' },
  'restaurant-golden-banquet': { overlay: 'rgba(0,0,0,0.48)', textPanelMode: 'dark', textContrast: 'light', textPanelPosition: 'left', cropMode: 'top-cover' },
  'cafe-white-dripper': { overlay: 'rgba(255,255,255,0.32)', textPanelMode: 'solid', textContrast: 'dark', textPanelPosition: 'left', cropMode: 'top-cover' },
  'cafe-urban-monochrome': { overlay: 'rgba(0,0,0,0.28)', textPanelMode: 'glass', textContrast: 'light', textPanelPosition: 'left', cropMode: 'top-cover' },
};

function normalizeTemplate(input: string | SiteData | TemplateGalleryItem | TemplateCatalogItem | undefined): TemplateGalleryItem | undefined {
  if (!input) return undefined;
  if (typeof input === 'string') return getTemplateById(input);
  if ('store' in input) return getTemplateById(input.galleryTemplateId || input.visual?.selectedTemplateId);
  return input;
}

function extension(src: string) {
  const clean = src.split('?')[0].split('#')[0];
  const match = clean.match(/\.([a-zA-Z0-9]+)$/);
  return (match?.[1] || 'png').toLowerCase().replace('jpeg', 'jpg');
}

export function getTemplateArtwork(input: string | SiteData | TemplateGalleryItem | TemplateCatalogItem | undefined): TemplateArtworkSources {
  const template = normalizeTemplate(input) || templateCatalog[0];
  const gallerySrc = template.artworkSrc;
  const override = overrides[template.id] || {};
  const backplate: TemplateArtworkBackplate = {
    ...DEFAULT_BACKPLATE,
    ...override,
    enabled: true,
    assetPath: gallerySrc,
  };
  const ext = extension(gallerySrc);
  const exportAssetFileName = `template-artwork-${template.id}.${ext}`;
  return {
    templateId: template.id,
    gallerySrc,
    previewSrc: backplate.desktopAssetPath || gallerySrc,
    exportSrc: gallerySrc,
    mobileSrc: backplate.mobileAssetPath || gallerySrc,
    desktopSrc: backplate.desktopAssetPath || gallerySrc,
    exportAssetPath: `assets/${exportAssetFileName}`,
    exportAssetFileName,
    backplate,
  };
}

export function heroObjectPosition(cropMode: ArtworkCropMode) {
  if (cropMode === 'top-cover') return 'center top';
  if (cropMode === 'center-cover') return 'center center';
  return 'center center';
}

export function heroObjectFit(cropMode: ArtworkCropMode) {
  return cropMode === 'contain' ? 'contain' : 'cover';
}
