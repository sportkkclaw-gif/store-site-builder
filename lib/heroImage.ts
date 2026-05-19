import type { SiteData } from '@/types/site';
import { mediaById } from './imageUtils';
import { getTemplateArtwork, heroObjectFit, heroObjectPosition } from './templateArtworkResolver';

export function getHeroImageMode(data: SiteData): 'template' | 'custom' {
  return data.hero.imageMode === 'custom' ? 'custom' : 'template';
}

export function getCustomHeroMedia(data: SiteData) {
  if (getHeroImageMode(data) !== 'custom' || !data.hero.imageId) return undefined;
  return mediaById(data, data.hero.imageId);
}

export function getHeroImageSource(data: SiteData) {
  const artwork = getTemplateArtwork(data);
  const custom = getCustomHeroMedia(data);
  if (custom) {
    return {
      mode: 'custom' as const,
      src: custom.dataUrl,
      mobileSrc: custom.dataUrl,
      exportSrc: `assets/${custom.id}.${(custom.mimeType.split('/')[1] || 'png').replace('jpeg', 'jpg')}`,
      gallerySrc: custom.dataUrl,
      alt: custom.name || `${data.store.name} 自訂 Hero 圖`,
      artwork,
      fit: 'cover',
      position: 'center',
    };
  }
  return {
    mode: 'template' as const,
    src: artwork.previewSrc,
    mobileSrc: artwork.mobileSrc,
    exportSrc: artwork.exportAssetPath || artwork.gallerySrc,
    gallerySrc: artwork.gallerySrc,
    alt: `${data.store.name} 模板主視覺`,
    artwork,
    fit: heroObjectFit(artwork.backplate.cropMode),
    position: heroObjectPosition(artwork.backplate.cropMode),
  };
}
