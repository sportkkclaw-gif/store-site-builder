import type { SiteData } from '@/types/site';
import type { TemplateGalleryItem, TemplateSkinPreset } from '@/types/template';
import { getTemplateById, templateCatalog } from './templateCatalog';

const fallbackSkin: TemplateSkinPreset = {
  id: 'drink-matcha-hiyori',
  nav: { mode: 'floating-pill', background: 'rgba(255,251,235,.82)', textColor: '#24351F', accentColor: '#6DA36F', radius: 999, border: '1px solid rgba(109,163,111,.28)', shadow: '0 18px 50px rgba(52,81,45,.12)' },
  page: { background: 'radial-gradient(circle at 10% 0%, rgba(178,213,141,.32), transparent 34%), linear-gradient(180deg,#F8F1DF 0%,#EEF6DF 54%,#FFFDF5 100%)', texture: 'botanical', textColor: '#20301F', mutedTextColor: '#62715C' },
  hero: { useArtworkBackplate: true, overlay: 'rgba(255,250,240,.28)', contentPanel: 'light-glass', contentPanelBackground: 'rgba(255,253,244,.78)', headingColor: '#20301F', subtitleColor: '#58634F', ctaStyle: 'matcha' },
  section: { background: 'rgba(255,253,244,.78)', alternateBackground: 'rgba(232,244,214,.78)', headingColor: '#284327', eyebrowColor: '#6DA36F', dividerStyle: 'soft-line', spacing: 'balanced' },
  productCard: { mode: 'soft-card', background: 'rgba(255,253,244,.92)', textColor: '#20301F', priceColor: '#5F8F50', border: '1px solid rgba(109,163,111,.24)', radius: 26, shadow: '0 18px 42px rgba(66,96,52,.12)', imageTreatment: 'theme-placeholder' },
  menuList: { mode: 'clean-list', background: 'rgba(255,253,244,.80)', rowBackground: 'rgba(255,255,255,.62)', rowBorder: '1px solid rgba(109,163,111,.22)', categoryColor: '#284327', priceColor: '#5F8F50' },
  placeholder: { mode: 'themed-abstract', background: 'linear-gradient(135deg,#F5EBCB,#DDEFC8)', accentShape: '#75A96E', labelColor: '#42613D', showStoreSiteText: false },
  footer: { background: '#26351F', textColor: '#F8F1DF', accentColor: '#B8D98B' },
};

const skins: Record<string, TemplateSkinPreset> = {
  'drink-matcha-hiyori': fallbackSkin,
  'drink-boba-neon': {
    id: 'drink-boba-neon',
    nav: { mode: 'dark-bar', background: 'rgba(5,8,24,.86)', textColor: '#F8FBFF', accentColor: '#22D3EE', radius: 28, border: '1px solid rgba(168,85,247,.38)', shadow: '0 0 34px rgba(34,211,238,.18)' },
    page: { background: 'radial-gradient(circle at 18% 4%, rgba(168,85,247,.36), transparent 28%), radial-gradient(circle at 90% 10%, rgba(34,211,238,.25), transparent 30%), linear-gradient(180deg,#050816,#0B1028 48%,#070A16)', texture: 'neon-grid', textColor: '#F8FBFF', mutedTextColor: '#B9C6E4' },
    hero: { useArtworkBackplate: true, overlay: 'rgba(5,8,24,.35)', contentPanel: 'dark-glass', contentPanelBackground: 'rgba(5,8,24,.68)', headingColor: '#FFFFFF', subtitleColor: '#CFFAFE', ctaStyle: 'neon' },
    section: { background: 'rgba(11,16,40,.78)', alternateBackground: 'rgba(18,12,44,.76)', headingColor: '#E0F2FE', eyebrowColor: '#22D3EE', dividerStyle: 'glow-line', spacing: 'spacious' },
    productCard: { mode: 'neon-card', background: 'linear-gradient(145deg,rgba(15,23,42,.92),rgba(44,20,82,.78))', textColor: '#F8FBFF', priceColor: '#67E8F9', border: '1px solid rgba(34,211,238,.45)', radius: 24, shadow: '0 0 42px rgba(168,85,247,.23)', imageTreatment: 'dark-frame' },
    menuList: { mode: 'dark-list', background: 'rgba(5,8,24,.72)', rowBackground: 'rgba(15,23,42,.75)', rowBorder: '1px solid rgba(34,211,238,.25)', categoryColor: '#67E8F9', priceColor: '#F0ABFC' },
    placeholder: { mode: 'themed-abstract', background: 'linear-gradient(135deg,#071021,#3B0764)', accentShape: '#22D3EE', labelColor: '#F0ABFC', showStoreSiteText: false },
    footer: { background: '#030712', textColor: '#E0F2FE', accentColor: '#22D3EE' },
  },
  'drink-fruit-paradise': {
    id: 'drink-fruit-paradise',
    nav: { mode: 'floating-pill', background: 'rgba(255,255,255,.78)', textColor: '#364112', accentColor: '#F97316', radius: 999, border: '1px solid rgba(251,146,60,.35)', shadow: '0 18px 46px rgba(251,146,60,.16)' },
    page: { background: 'radial-gradient(circle at 0% 0%, rgba(250,204,21,.34), transparent 32%), radial-gradient(circle at 100% 8%, rgba(34,197,94,.24), transparent 30%), linear-gradient(180deg,#FFF7D6,#E7FFCF 52%,#FFF1CA)', texture: 'soft-bubbles', textColor: '#37410F', mutedTextColor: '#71733E' },
    hero: { useArtworkBackplate: true, overlay: 'rgba(255,255,255,.22)', contentPanel: 'light-glass', contentPanelBackground: 'rgba(255,255,255,.74)', headingColor: '#37410F', subtitleColor: '#6D6B2E', ctaStyle: 'fruit' },
    section: { background: 'rgba(255,255,255,.78)', alternateBackground: 'rgba(255,237,170,.78)', headingColor: '#41530D', eyebrowColor: '#F97316', dividerStyle: 'bold-line', spacing: 'spacious' },
    productCard: { mode: 'playful', background: 'linear-gradient(145deg,rgba(255,255,255,.94),rgba(255,247,214,.90))', textColor: '#37410F', priceColor: '#EA580C', border: '2px solid rgba(250,204,21,.45)', radius: 32, shadow: '0 18px 38px rgba(251,146,60,.18)', imageTreatment: 'soft-blob' },
    menuList: { mode: 'playful-menu', background: 'rgba(255,255,255,.82)', rowBackground: 'linear-gradient(90deg,rgba(254,249,195,.72),rgba(220,252,231,.62))', rowBorder: '1px dashed rgba(249,115,22,.38)', categoryColor: '#4D5E12', priceColor: '#F97316' },
    placeholder: { mode: 'themed-abstract', background: 'linear-gradient(135deg,#FEF08A,#BBF7D0,#FED7AA)', accentShape: '#F97316', labelColor: '#4D7C0F', showStoreSiteText: false },
    footer: { background: '#44510D', textColor: '#FFF7D6', accentColor: '#FACC15' },
  },
  'drink-brown-sugar-amber': {
    id: 'drink-brown-sugar-amber',
    nav: { mode: 'glass', background: 'rgba(61,32,14,.82)', textColor: '#FFF7ED', accentColor: '#D97706', radius: 26, border: '1px solid rgba(217,119,6,.34)', shadow: '0 20px 50px rgba(61,32,14,.26)' },
    page: { background: 'radial-gradient(circle at 20% 0%, rgba(180,83,9,.30), transparent 30%), linear-gradient(180deg,#2A160C,#6B3A1E 46%,#F3D6A8)', texture: 'grain', textColor: '#FFF7ED', mutedTextColor: '#F6D7B0' },
    hero: { useArtworkBackplate: true, overlay: 'rgba(20,10,4,.35)', contentPanel: 'dark-glass', contentPanelBackground: 'rgba(53,29,14,.68)', headingColor: '#FFF7ED', subtitleColor: '#F6D7B0', ctaStyle: 'amber' },
    section: { background: 'rgba(255,237,213,.82)', alternateBackground: 'rgba(146,64,14,.22)', headingColor: '#4A2510', eyebrowColor: '#B45309', dividerStyle: 'soft-line', spacing: 'balanced' },
    productCard: { mode: 'warm-paper', background: 'linear-gradient(145deg,rgba(255,247,237,.96),rgba(251,220,170,.86))', textColor: '#4A2510', priceColor: '#B45309', border: '1px solid rgba(146,64,14,.32)', radius: 24, shadow: '0 18px 42px rgba(92,45,18,.22)', imageTreatment: 'soft-blob' },
    menuList: { mode: 'premium-menu', background: 'rgba(255,247,237,.84)', rowBackground: 'rgba(255,251,235,.72)', rowBorder: '1px solid rgba(180,83,9,.28)', categoryColor: '#4A2510', priceColor: '#B45309' },
    placeholder: { mode: 'themed-abstract', background: 'linear-gradient(135deg,#78350F,#FCD9A0)', accentShape: '#F59E0B', labelColor: '#FFF7ED', showStoreSiteText: false },
    footer: { background: '#2A160C', textColor: '#FFF7ED', accentColor: '#F59E0B' },
  },
  'drink-white-peach-sparkle': {
    id: 'drink-white-peach-sparkle',
    nav: { mode: 'glass', background: 'rgba(255,255,255,.72)', textColor: '#7C2D4B', accentColor: '#FB7185', radius: 999, border: '1px solid rgba(251,113,133,.28)', shadow: '0 18px 46px rgba(251,113,133,.16)' },
    page: { background: 'radial-gradient(circle at 20% 0%, rgba(251,113,133,.22), transparent 32%), radial-gradient(circle at 85% 12%, rgba(255,255,255,.70), transparent 28%), linear-gradient(180deg,#FFF1F2,#FFE4E6 52%,#FFF7ED)', texture: 'soft-bubbles', textColor: '#7C2D4B', mutedTextColor: '#9F6476' },
    hero: { useArtworkBackplate: true, overlay: 'rgba(255,240,235,.22)', contentPanel: 'light-glass', contentPanelBackground: 'rgba(255,255,255,.72)', headingColor: '#7C2D4B', subtitleColor: '#9F6476', ctaStyle: 'fruit' },
    section: { background: 'rgba(255,255,255,.70)', alternateBackground: 'rgba(255,228,230,.74)', headingColor: '#7C2D4B', eyebrowColor: '#FB7185', dividerStyle: 'soft-line', spacing: 'balanced' },
    productCard: { mode: 'soft-card', background: 'rgba(255,255,255,.86)', textColor: '#7C2D4B', priceColor: '#E11D48', border: '1px solid rgba(251,113,133,.24)', radius: 28, shadow: '0 18px 38px rgba(251,113,133,.14)', imageTreatment: 'soft-blob' },
    menuList: { mode: 'clean-list', background: 'rgba(255,255,255,.74)', rowBackground: 'rgba(255,241,242,.74)', rowBorder: '1px solid rgba(251,113,133,.20)', categoryColor: '#7C2D4B', priceColor: '#E11D48' },
    placeholder: { mode: 'themed-abstract', background: 'linear-gradient(135deg,#FFE4E6,#FFFFFF,#FED7AA)', accentShape: '#FB7185', labelColor: '#9F1239', showStoreSiteText: false },
    footer: { background: '#7C2D4B', textColor: '#FFF1F2', accentColor: '#FDA4AF' },
  },
  'drink-tea-mist-ridge': {
    id: 'drink-tea-mist-ridge',
    nav: { mode: 'editorial', background: 'rgba(17,43,29,.82)', textColor: '#F8F0D8', accentColor: '#C9A86A', radius: 18, border: '1px solid rgba(201,168,106,.34)', shadow: '0 20px 52px rgba(11,32,21,.28)' },
    page: { background: 'radial-gradient(circle at 12% 0%, rgba(67,116,70,.32), transparent 32%), linear-gradient(180deg,#10251A,#1F3A28 52%,#F4E7C4)', texture: 'botanical', textColor: '#F8F0D8', mutedTextColor: '#D6C9A7' },
    hero: { useArtworkBackplate: true, overlay: 'rgba(8,22,15,.32)', contentPanel: 'dark-glass', contentPanelBackground: 'rgba(17,43,29,.66)', headingColor: '#FFF7D6', subtitleColor: '#D6C9A7', ctaStyle: 'matcha' },
    section: { background: 'rgba(248,240,216,.84)', alternateBackground: 'rgba(31,58,40,.32)', headingColor: '#173020', eyebrowColor: '#9A7A3D', dividerStyle: 'editorial-rule', spacing: 'spacious' },
    productCard: { mode: 'editorial-card', background: 'linear-gradient(145deg,rgba(255,251,235,.94),rgba(235,226,197,.88))', textColor: '#173020', priceColor: '#7A5B20', border: '1px solid rgba(122,91,32,.28)', radius: 18, shadow: '0 18px 42px rgba(17,48,32,.18)', imageTreatment: 'minimal-frame' },
    menuList: { mode: 'editorial-menu', background: 'rgba(255,251,235,.82)', rowBackground: 'rgba(248,240,216,.72)', rowBorder: '1px solid rgba(122,91,32,.24)', categoryColor: '#173020', priceColor: '#7A5B20' },
    placeholder: { mode: 'themed-abstract', background: 'linear-gradient(135deg,#10251A,#F4E7C4)', accentShape: '#C9A86A', labelColor: '#F8F0D8', showStoreSiteText: false },
    footer: { background: '#10251A', textColor: '#F8F0D8', accentColor: '#C9A86A' },
  },
  'restaurant-golden-banquet': {
    id: 'restaurant-golden-banquet',
    nav: { mode: 'dark-bar', background: 'rgba(8,7,5,.90)', textColor: '#FFF7D6', accentColor: '#D4AF37', radius: 10, border: '1px solid rgba(212,175,55,.38)', shadow: '0 22px 58px rgba(0,0,0,.38)' },
    page: { background: 'radial-gradient(circle at 20% 0%, rgba(212,175,55,.18), transparent 32%), linear-gradient(180deg,#050505,#17130A 55%,#0B0B0B)', texture: 'grain', textColor: '#FFF7D6', mutedTextColor: '#C9B98B' },
    hero: { useArtworkBackplate: true, overlay: 'rgba(0,0,0,.48)', contentPanel: 'dark-glass', contentPanelBackground: 'rgba(8,7,5,.72)', headingColor: '#FFF7D6', subtitleColor: '#D9C785', ctaStyle: 'premium-gold' },
    section: { background: 'rgba(17,17,17,.86)', alternateBackground: 'rgba(40,31,13,.78)', headingColor: '#F9E7A0', eyebrowColor: '#D4AF37', dividerStyle: 'editorial-rule', spacing: 'spacious' },
    productCard: { mode: 'dark-glass', background: 'linear-gradient(145deg,rgba(15,15,15,.94),rgba(44,34,13,.78))', textColor: '#FFF7D6', priceColor: '#D4AF37', border: '1px solid rgba(212,175,55,.40)', radius: 18, shadow: '0 24px 58px rgba(0,0,0,.42)', imageTreatment: 'dark-frame' },
    menuList: { mode: 'premium-menu', background: 'rgba(10,10,10,.84)', rowBackground: 'rgba(30,24,12,.70)', rowBorder: '1px solid rgba(212,175,55,.28)', categoryColor: '#F9E7A0', priceColor: '#D4AF37' },
    placeholder: { mode: 'themed-abstract', background: 'linear-gradient(135deg,#050505,#3B2F10)', accentShape: '#D4AF37', labelColor: '#F9E7A0', showStoreSiteText: false },
    footer: { background: '#050505', textColor: '#FFF7D6', accentColor: '#D4AF37' },
  },
  'cafe-white-dripper': {
    id: 'cafe-white-dripper',
    nav: { mode: 'minimal-line', background: 'rgba(255,255,255,.86)', textColor: '#2F2F2B', accentColor: '#8B6F4E', radius: 6, border: '1px solid rgba(120,113,108,.24)', shadow: 'none' },
    page: { background: 'linear-gradient(180deg,#FAFAF8,#EFEDE8 55%,#FFFFFF)', texture: 'paper', textColor: '#2F2F2B', mutedTextColor: '#77736C' },
    hero: { useArtworkBackplate: true, overlay: 'rgba(255,255,255,.32)', contentPanel: 'solid-light', contentPanelBackground: 'rgba(255,255,255,.90)', headingColor: '#2F2F2B', subtitleColor: '#6D6962', ctaStyle: 'coffee' },
    section: { background: 'rgba(255,255,255,.86)', alternateBackground: 'rgba(239,237,232,.74)', headingColor: '#2F2F2B', eyebrowColor: '#8B6F4E', dividerStyle: 'soft-line', spacing: 'balanced' },
    productCard: { mode: 'minimal-line', background: 'rgba(255,255,255,.92)', textColor: '#2F2F2B', priceColor: '#8B6F4E', border: '1px solid rgba(120,113,108,.22)', radius: 10, shadow: '0 10px 26px rgba(68,64,60,.08)', imageTreatment: 'minimal-frame' },
    menuList: { mode: 'clean-list', background: 'rgba(255,255,255,.80)', rowBackground: 'rgba(250,250,248,.82)', rowBorder: '1px solid rgba(120,113,108,.18)', categoryColor: '#2F2F2B', priceColor: '#8B6F4E' },
    placeholder: { mode: 'minimal-shape', background: 'linear-gradient(135deg,#FFFFFF,#E7E5E4)', accentShape: '#8B6F4E', labelColor: '#57534E', showStoreSiteText: false },
    footer: { background: '#2F2F2B', textColor: '#FAFAF8', accentColor: '#C7A77B' },
  },
  'cafe-urban-monochrome': {
    id: 'cafe-urban-monochrome',
    nav: { mode: 'editorial', background: 'rgba(12,12,12,.88)', textColor: '#F5F5F5', accentColor: '#FFFFFF', radius: 0, border: '1px solid rgba(255,255,255,.22)', shadow: '0 18px 42px rgba(0,0,0,.28)' },
    page: { background: 'linear-gradient(180deg,#0B0B0B,#2C2C2C 48%,#F4F4F4)', texture: 'monochrome', textColor: '#F5F5F5', mutedTextColor: '#CFCFCF' },
    hero: { useArtworkBackplate: true, overlay: 'rgba(0,0,0,.28)', contentPanel: 'dark-glass', contentPanelBackground: 'rgba(12,12,12,.64)', headingColor: '#FFFFFF', subtitleColor: '#D4D4D4', ctaStyle: 'minimal-black' },
    section: { background: 'rgba(245,245,245,.88)', alternateBackground: 'rgba(18,18,18,.82)', headingColor: '#111111', eyebrowColor: '#555555', dividerStyle: 'bold-line', spacing: 'balanced' },
    productCard: { mode: 'minimal-line', background: 'linear-gradient(145deg,rgba(255,255,255,.94),rgba(230,230,230,.88))', textColor: '#111111', priceColor: '#000000', border: '2px solid rgba(17,17,17,.55)', radius: 4, shadow: '10px 10px 0 rgba(0,0,0,.16)', imageTreatment: 'minimal-frame' },
    menuList: { mode: 'editorial-menu', background: 'rgba(245,245,245,.88)', rowBackground: 'rgba(255,255,255,.78)', rowBorder: '1px solid rgba(17,17,17,.34)', categoryColor: '#111111', priceColor: '#000000' },
    placeholder: { mode: 'minimal-shape', background: 'linear-gradient(135deg,#111111,#F5F5F5)', accentShape: '#FFFFFF', labelColor: '#111111', showStoreSiteText: false },
    footer: { background: '#000000', textColor: '#F5F5F5', accentColor: '#FFFFFF' },
  },
};

function resolveTemplate(input: SiteData | TemplateGalleryItem | string | undefined): TemplateGalleryItem | undefined {
  if (!input) return undefined;
  if (typeof input === 'string') return getTemplateById(input);
  if ('store' in input) return getTemplateById(input.galleryTemplateId || input.visual?.selectedTemplateId);
  return input;
}

export function getTemplateSkin(input: SiteData | TemplateGalleryItem | string | undefined): TemplateSkinPreset {
  const template = resolveTemplate(input) || templateCatalog[0];
  return skins[template.id] || skins[template.aiArtworkKey] || fallbackSkin;
}

export const getProductCardStyle = getTemplateSkin;
export const getMenuListStyle = getTemplateSkin;
export const getSectionStyle = getTemplateSkin;
export const getPlaceholderStyle = getTemplateSkin;
export const getFooterStyle = getTemplateSkin;

export function skinCssVariables(skin: TemplateSkinPreset) {
  return {
    '--skin-page-bg': skin.page.background,
    '--skin-text': skin.page.textColor,
    '--skin-muted': skin.page.mutedTextColor,
    '--skin-section-bg': skin.section.background,
    '--skin-section-alt': skin.section.alternateBackground,
    '--skin-heading': skin.section.headingColor,
    '--skin-eyebrow': skin.section.eyebrowColor,
    '--skin-card-bg': skin.productCard.background,
    '--skin-card-text': skin.productCard.textColor,
    '--skin-price': skin.productCard.priceColor,
    '--skin-card-border': skin.productCard.border,
    '--skin-card-radius': `${skin.productCard.radius}px`,
    '--skin-card-shadow': skin.productCard.shadow,
    '--skin-menu-bg': skin.menuList.background,
    '--skin-menu-row': skin.menuList.rowBackground,
    '--skin-menu-border': skin.menuList.rowBorder,
    '--skin-footer-bg': skin.footer.background,
    '--skin-footer-text': skin.footer.textColor,
    '--skin-footer-accent': skin.footer.accentColor,
  } as Record<string, string>;
}
