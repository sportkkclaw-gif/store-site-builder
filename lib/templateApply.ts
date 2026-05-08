import type { MediaAsset, SiteData } from '@/types/site';
import type { TemplateGalleryItem } from '@/types/template';

const TEMPLATE_MEDIA_PREFIX = 'template-artwork-';

function heroArtworkSrc(template: TemplateGalleryItem) {
  return template.artworkSrc.replace('/template-gallery-ai/', '/template-gallery-hero/').replace(/\.png$/, '.jpg');
}

function paletteColor(template: TemplateGalleryItem, index: number, fallback: string) {
  return template.palette[index] || fallback;
}

function fontForTemplate(template: TemplateGalleryItem): SiteData['theme']['fontFamily'] {
  if (template.styleTags.some(tag => ['日式', '書房', '高質感', '奢華', '深焙'].includes(tag))) return 'serif';
  if (template.styleTags.some(tag => ['活潑', '水果', '霓光', '促銷', '蜜桃'].includes(tag))) return 'rounded';
  return 'sans';
}

function densityForTemplate(template: TemplateGalleryItem): SiteData['theme']['layoutDensity'] {
  if (template.styleTags.some(tag => ['極簡', '高質感', '黑白', '北歐'].includes(tag))) return 'spacious';
  if (template.styleTags.some(tag => ['外帶', '快餐', '促銷'].includes(tag))) return 'compact';
  return 'comfortable';
}

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
    console.warn('Template artwork could not be embedded; preview will use direct asset path.', error);
    return null;
  }
}

export async function createTemplateAppliedSiteData(data: SiteData, template: TemplateGalleryItem): Promise<SiteData> {
  const heroSrc = heroArtworkSrc(template);
  const embeddedHero = await imageToDataUrl(heroSrc);
  const mediaId = `${TEMPLATE_MEDIA_PREFIX}${template.id}`;
  const templateMedia: MediaAsset = {
    id: mediaId,
    name: `${template.name} 模板主視覺`,
    type: 'hero',
    mimeType: embeddedHero ? 'image/jpeg' : 'image/png',
    dataUrl: embeddedHero || template.artworkSrc,
  };
  const media = [templateMedia, ...data.media.filter(asset => !asset.id.startsWith(TEMPLATE_MEDIA_PREFIX))];
  const primaryColor = paletteColor(template, 0, data.theme.primaryColor);
  const secondaryColor = paletteColor(template, 1, data.theme.secondaryColor);
  const backgroundColor = paletteColor(template, 2, data.theme.backgroundColor);

  return {
    ...data,
    industry: template.industry,
    template: template.baseTemplate,
    galleryTemplateId: template.id,
    theme: {
      ...data.theme,
      primaryColor,
      secondaryColor,
      backgroundColor,
      textColor: template.baseTemplate === 'premium-minimal' ? '#1C1917' : data.theme.textColor,
      fontFamily: fontForTemplate(template),
      buttonStyle: template.baseTemplate === 'premium-minimal' ? 'rounded' : 'pill',
      sectionRadius: template.baseTemplate === 'playful-colorful' ? 36 : template.baseTemplate === 'premium-minimal' ? 14 : 26,
      layoutDensity: densityForTemplate(template),
    },
    hero: {
      ...data.hero,
      imageId: mediaId,
    },
    seo: {
      ...data.seo,
      ogImageId: mediaId,
    },
    media,
  };
}

export function selectedTemplateDisplayName(data: SiteData, fallbackName: string, lookup: (id?: string) => TemplateGalleryItem | undefined) {
  return lookup(data.galleryTemplateId)?.name || fallbackName;
}
