import type { SiteData } from '@/types/site';
import type { TemplateGalleryItem } from '@/types/template';
import { getTemplateArtwork } from './templateArtworkResolver';
import { getTemplateById, templateCatalog } from './templateCatalog';

export type SkinFamily =
  | 'soft-matcha'
  | 'neon-dark'
  | 'fruit-bright'
  | 'amber-brown'
  | 'peach-pastel'
  | 'tea-mist-premium'
  | 'luxury-black-gold'
  | 'charcoal-grill'
  | 'urban-casual'
  | 'ceramic-minimal'
  | 'monochrome-editorial';

export type TemplateSkin = {
  id: string;
  family: SkinFamily;
  artwork: { src: string; mobileSrc?: string; desktopSrc?: string; objectPosition: string; overlay: string; blendMode?: string };
  page: { background: string; texture: 'none' | 'grain' | 'paper' | 'neon-grid' | 'botanical' | 'bubbles' | 'monochrome' | 'charcoal'; textColor: string; mutedTextColor: string };
  nav: { background: string; textColor: string; accentColor: string; border: string; radius: string; shadow: string };
  hero: { backgroundMode: 'artwork-full' | 'artwork-split' | 'poster' | 'editorial' | 'dark-stage'; overlay: string; panelBackground: string; panelBorder: string; headingColor: string; subtitleColor: string; eyebrowColor: string; ctaBackground: string; ctaColor: string; decorativeTextColor: string; decorativeTextOpacity: number };
  section: { background: string; alternateBackground: string; headingColor: string; eyebrowColor: string; border: string; divider: string };
  productCard: { background: string; border: string; shadow: string; radius: string; textColor: string; mutedTextColor: string; priceColor: string; imageBackground: string; imageAccent: string };
  menuList: { background: string; rowBackground: string; rowBorder: string; categoryColor: string; itemColor: string; descriptionColor: string; priceColor: string };
  brandStory: { background: string; textColor: string; accentColor: string; imageTreatment: string };
  cta: { background: string; textColor: string; buttonBackground: string; buttonColor: string };
  footer: { background: string; textColor: string; accentColor: string };
  placeholder: { mode: 'abstract' | 'icon' | 'artwork-crop' | 'pattern'; background: string; accent: string; textColor: string; showStoreSiteText: false };
};

export const templateSkinFamilyMap: Record<string, SkinFamily> = {
  'drink-matcha-hiyori': 'soft-matcha',
  'drink-boba-neon': 'neon-dark',
  'drink-fruit-paradise': 'fruit-bright',
  'drink-brown-sugar-amber': 'amber-brown',
  'drink-white-peach-sparkle': 'peach-pastel',
  'drink-lime-morning': 'fruit-bright',
  'drink-tea-mist-ridge': 'tea-mist-premium',
  'drink-iced-party': 'fruit-bright',
  'drink-afternoon-cream': 'peach-pastel',
  'drink-lab-brew': 'neon-dark',
  'restaurant-charcoal-essence': 'charcoal-grill',
  'restaurant-rice-kitchen': 'urban-casual',
  'restaurant-golden-banquet': 'luxury-black-gold',
  'restaurant-corner-meal': 'urban-casual',
  'restaurant-spicy-market': 'charcoal-grill',
  'restaurant-sunday-shokudo': 'urban-casual',
  'restaurant-kitchen-overture': 'luxury-black-gold',
  'restaurant-brunch-garden': 'fruit-bright',
  'restaurant-hotpot-home': 'amber-brown',
  'restaurant-fast-enjoy': 'fruit-bright',
  'cafe-nordic-morning': 'ceramic-minimal',
  'cafe-midnight-roast': 'monochrome-editorial',
  'cafe-cream-library': 'ceramic-minimal',
  'cafe-forest-teatime': 'soft-matcha',
  'cafe-window-seat': 'urban-casual',
  'cafe-mocha-studio': 'amber-brown',
  'cafe-white-dripper': 'ceramic-minimal',
  'cafe-caramel-afternoon': 'amber-brown',
  'cafe-urban-monochrome': 'monochrome-editorial',
  'cafe-daily-corner': 'urban-casual',
};

const familySkins: Record<SkinFamily, Omit<TemplateSkin, 'id' | 'family' | 'artwork'>> = {
  'soft-matcha': {
    page: { background: 'radial-gradient(circle at 10% 0%, rgba(178,213,141,.32), transparent 34%), linear-gradient(180deg,#F8F1DF 0%,#EEF6DF 54%,#FFFDF5 100%)', texture: 'botanical', textColor: '#20301F', mutedTextColor: '#62715C' },
    nav: { background: 'rgba(255,251,235,.84)', textColor: '#24351F', accentColor: '#6DA36F', border: '1px solid rgba(109,163,111,.30)', radius: '999px', shadow: '0 18px 50px rgba(52,81,45,.12)' },
    hero: { backgroundMode: 'artwork-split', overlay: 'rgba(255,250,240,.30)', panelBackground: 'rgba(255,253,244,.80)', panelBorder: '1px solid rgba(109,163,111,.24)', headingColor: '#20301F', subtitleColor: '#58634F', eyebrowColor: '#6DA36F', ctaBackground: '#6DA36F', ctaColor: '#FFFFFF', decorativeTextColor: '#6DA36F', decorativeTextOpacity: .18 },
    section: { background: 'rgba(255,253,244,.82)', alternateBackground: 'rgba(232,244,214,.82)', headingColor: '#284327', eyebrowColor: '#6DA36F', border: '1px solid rgba(109,163,111,.22)', divider: 'linear-gradient(90deg, transparent, rgba(109,163,111,.55), transparent)' },
    productCard: { background: 'linear-gradient(145deg,rgba(255,253,244,.96),rgba(236,246,218,.88))', border: '1px solid rgba(109,163,111,.28)', shadow: '0 18px 42px rgba(66,96,52,.12)', radius: '28px', textColor: '#20301F', mutedTextColor: '#62715C', priceColor: '#5F8F50', imageBackground: 'linear-gradient(135deg,#F5EBCB,#DDEFC8)', imageAccent: '#75A96E' },
    menuList: { background: 'rgba(255,253,244,.80)', rowBackground: 'rgba(255,255,255,.66)', rowBorder: '1px solid rgba(109,163,111,.22)', categoryColor: '#284327', itemColor: '#20301F', descriptionColor: '#62715C', priceColor: '#5F8F50' },
    brandStory: { background: 'linear-gradient(135deg,rgba(248,241,223,.88),rgba(232,244,214,.78))', textColor: '#20301F', accentColor: '#6DA36F', imageTreatment: 'tea-leaf-lines' },
    cta: { background: '#6DA36F', textColor: '#FFFFFF', buttonBackground: '#20301F', buttonColor: '#F8F1DF' },
    footer: { background: '#26351F', textColor: '#F8F1DF', accentColor: '#B8D98B' },
    placeholder: { mode: 'abstract', background: 'linear-gradient(135deg,#F5EBCB,#DDEFC8)', accent: '#75A96E', textColor: '#42613D', showStoreSiteText: false },
  },
  'neon-dark': {
    page: { background: 'radial-gradient(circle at 18% 4%, rgba(168,85,247,.40), transparent 28%), radial-gradient(circle at 90% 10%, rgba(34,211,238,.28), transparent 30%), linear-gradient(180deg,#050816,#0B1028 48%,#070A16)', texture: 'neon-grid', textColor: '#F8FBFF', mutedTextColor: '#B9C6E4' },
    nav: { background: 'rgba(5,8,24,.88)', textColor: '#F8FBFF', accentColor: '#22D3EE', border: '1px solid rgba(168,85,247,.42)', radius: '28px', shadow: '0 0 34px rgba(34,211,238,.20)' },
    hero: { backgroundMode: 'dark-stage', overlay: 'rgba(5,8,24,.36)', panelBackground: 'rgba(5,8,24,.70)', panelBorder: '1px solid rgba(34,211,238,.32)', headingColor: '#FFFFFF', subtitleColor: '#CFFAFE', eyebrowColor: '#22D3EE', ctaBackground: 'linear-gradient(90deg,#A855F7,#22D3EE)', ctaColor: '#FFFFFF', decorativeTextColor: '#22D3EE', decorativeTextOpacity: .24 },
    section: { background: 'linear-gradient(145deg,rgba(11,16,40,.84),rgba(30,20,60,.70))', alternateBackground: 'rgba(18,12,44,.80)', headingColor: '#E0F2FE', eyebrowColor: '#22D3EE', border: '1px solid rgba(34,211,238,.28)', divider: 'linear-gradient(90deg, transparent, #22D3EE, #A855F7, transparent)' },
    productCard: { background: 'linear-gradient(145deg,rgba(15,23,42,.94),rgba(44,20,82,.82))', border: '1px solid rgba(34,211,238,.50)', shadow: '0 0 42px rgba(168,85,247,.25)', radius: '24px', textColor: '#F8FBFF', mutedTextColor: '#B9C6E4', priceColor: '#67E8F9', imageBackground: 'linear-gradient(135deg,#071021,#3B0764)', imageAccent: '#22D3EE' },
    menuList: { background: 'rgba(5,8,24,.76)', rowBackground: 'linear-gradient(90deg,rgba(15,23,42,.82),rgba(49,20,82,.62))', rowBorder: '1px solid rgba(34,211,238,.28)', categoryColor: '#67E8F9', itemColor: '#F8FBFF', descriptionColor: '#B9C6E4', priceColor: '#F0ABFC' },
    brandStory: { background: 'linear-gradient(145deg,rgba(5,8,24,.82),rgba(44,20,82,.62))', textColor: '#F8FBFF', accentColor: '#22D3EE', imageTreatment: 'neon-glow' },
    cta: { background: 'linear-gradient(90deg,#A855F7,#22D3EE)', textColor: '#FFFFFF', buttonBackground: '#F0ABFC', buttonColor: '#050816' },
    footer: { background: '#030712', textColor: '#E0F2FE', accentColor: '#22D3EE' },
    placeholder: { mode: 'abstract', background: 'linear-gradient(135deg,#071021,#3B0764)', accent: '#22D3EE', textColor: '#F0ABFC', showStoreSiteText: false },
  },
  'fruit-bright': {
    page: { background: 'radial-gradient(circle at 0% 0%, rgba(250,204,21,.38), transparent 32%), radial-gradient(circle at 100% 8%, rgba(34,197,94,.28), transparent 30%), linear-gradient(180deg,#FFF7D6,#E7FFCF 52%,#FFF1CA)', texture: 'bubbles', textColor: '#37410F', mutedTextColor: '#71733E' },
    nav: { background: 'rgba(255,255,255,.80)', textColor: '#364112', accentColor: '#F97316', border: '1px solid rgba(251,146,60,.36)', radius: '999px', shadow: '0 18px 46px rgba(251,146,60,.16)' },
    hero: { backgroundMode: 'poster', overlay: 'rgba(255,255,255,.22)', panelBackground: 'rgba(255,255,255,.76)', panelBorder: '2px solid rgba(250,204,21,.35)', headingColor: '#37410F', subtitleColor: '#6D6B2E', eyebrowColor: '#F97316', ctaBackground: 'linear-gradient(90deg,#F97316,#FACC15,#22C55E)', ctaColor: '#FFFFFF', decorativeTextColor: '#F97316', decorativeTextOpacity: .22 },
    section: { background: 'rgba(255,255,255,.82)', alternateBackground: 'rgba(255,237,170,.82)', headingColor: '#41530D', eyebrowColor: '#F97316', border: '2px solid rgba(250,204,21,.34)', divider: 'linear-gradient(90deg,#F97316,#FACC15,#22C55E)' },
    productCard: { background: 'linear-gradient(145deg,rgba(255,255,255,.96),rgba(255,247,214,.92))', border: '2px solid rgba(250,204,21,.52)', shadow: '0 18px 38px rgba(251,146,60,.18)', radius: '34px', textColor: '#37410F', mutedTextColor: '#71733E', priceColor: '#EA580C', imageBackground: 'linear-gradient(135deg,#FEF08A,#BBF7D0,#FED7AA)', imageAccent: '#F97316' },
    menuList: { background: 'rgba(255,255,255,.84)', rowBackground: 'linear-gradient(90deg,rgba(254,249,195,.78),rgba(220,252,231,.66))', rowBorder: '1px dashed rgba(249,115,22,.42)', categoryColor: '#4D5E12', itemColor: '#37410F', descriptionColor: '#71733E', priceColor: '#F97316' },
    brandStory: { background: 'linear-gradient(135deg,rgba(255,247,214,.88),rgba(220,252,231,.78))', textColor: '#37410F', accentColor: '#F97316', imageTreatment: 'fruit-blobs' },
    cta: { background: 'linear-gradient(90deg,#F97316,#FACC15,#22C55E)', textColor: '#FFFFFF', buttonBackground: '#37410F', buttonColor: '#FFF7D6' },
    footer: { background: '#44510D', textColor: '#FFF7D6', accentColor: '#FACC15' },
    placeholder: { mode: 'pattern', background: 'linear-gradient(135deg,#FEF08A,#BBF7D0,#FED7AA)', accent: '#F97316', textColor: '#4D7C0F', showStoreSiteText: false },
  },
  'amber-brown': {
    page: { background: 'radial-gradient(circle at 20% 0%, rgba(180,83,9,.30), transparent 30%), linear-gradient(180deg,#2A160C,#6B3A1E 46%,#F3D6A8)', texture: 'grain', textColor: '#FFF7ED', mutedTextColor: '#F6D7B0' },
    nav: { background: 'rgba(61,32,14,.84)', textColor: '#FFF7ED', accentColor: '#D97706', border: '1px solid rgba(217,119,6,.36)', radius: '26px', shadow: '0 20px 50px rgba(61,32,14,.26)' },
    hero: { backgroundMode: 'artwork-full', overlay: 'rgba(20,10,4,.36)', panelBackground: 'rgba(53,29,14,.70)', panelBorder: '1px solid rgba(245,158,11,.32)', headingColor: '#FFF7ED', subtitleColor: '#F6D7B0', eyebrowColor: '#F59E0B', ctaBackground: 'linear-gradient(90deg,#92400E,#F59E0B)', ctaColor: '#FFFFFF', decorativeTextColor: '#F59E0B', decorativeTextOpacity: .20 },
    section: { background: 'rgba(255,237,213,.86)', alternateBackground: 'rgba(146,64,14,.26)', headingColor: '#4A2510', eyebrowColor: '#B45309', border: '1px solid rgba(146,64,14,.30)', divider: 'linear-gradient(90deg,transparent,#B45309,transparent)' },
    productCard: { background: 'linear-gradient(145deg,rgba(255,247,237,.98),rgba(251,220,170,.88))', border: '1px solid rgba(146,64,14,.36)', shadow: '0 18px 42px rgba(92,45,18,.22)', radius: '24px', textColor: '#4A2510', mutedTextColor: '#7C4A25', priceColor: '#B45309', imageBackground: 'linear-gradient(135deg,#78350F,#FCD9A0)', imageAccent: '#F59E0B' },
    menuList: { background: 'rgba(255,247,237,.86)', rowBackground: 'rgba(255,251,235,.76)', rowBorder: '1px solid rgba(180,83,9,.30)', categoryColor: '#4A2510', itemColor: '#4A2510', descriptionColor: '#7C4A25', priceColor: '#B45309' },
    brandStory: { background: 'linear-gradient(135deg,rgba(255,247,237,.86),rgba(251,220,170,.76))', textColor: '#4A2510', accentColor: '#B45309', imageTreatment: 'milk-tea-gradient' },
    cta: { background: 'linear-gradient(90deg,#92400E,#F59E0B)', textColor: '#FFFFFF', buttonBackground: '#4A2510', buttonColor: '#FFF7ED' },
    footer: { background: '#2A160C', textColor: '#FFF7ED', accentColor: '#F59E0B' },
    placeholder: { mode: 'abstract', background: 'linear-gradient(135deg,#78350F,#FCD9A0)', accent: '#F59E0B', textColor: '#FFF7ED', showStoreSiteText: false },
  },
  'peach-pastel': {
    page: { background: 'radial-gradient(circle at 20% 0%, rgba(251,113,133,.22), transparent 32%), radial-gradient(circle at 85% 12%, rgba(255,255,255,.70), transparent 28%), linear-gradient(180deg,#FFF1F2,#FFE4E6 52%,#FFF7ED)', texture: 'bubbles', textColor: '#7C2D4B', mutedTextColor: '#9F6476' },
    nav: { background: 'rgba(255,255,255,.74)', textColor: '#7C2D4B', accentColor: '#FB7185', border: '1px solid rgba(251,113,133,.30)', radius: '999px', shadow: '0 18px 46px rgba(251,113,133,.16)' },
    hero: { backgroundMode: 'artwork-split', overlay: 'rgba(255,240,235,.24)', panelBackground: 'rgba(255,255,255,.74)', panelBorder: '1px solid rgba(251,113,133,.24)', headingColor: '#7C2D4B', subtitleColor: '#9F6476', eyebrowColor: '#FB7185', ctaBackground: 'linear-gradient(90deg,#FB7185,#FED7AA)', ctaColor: '#7C2D4B', decorativeTextColor: '#FB7185', decorativeTextOpacity: .18 },
    section: { background: 'rgba(255,255,255,.74)', alternateBackground: 'rgba(255,228,230,.78)', headingColor: '#7C2D4B', eyebrowColor: '#FB7185', border: '1px solid rgba(251,113,133,.24)', divider: 'linear-gradient(90deg,transparent,#FB7185,transparent)' },
    productCard: { background: 'linear-gradient(145deg,rgba(255,255,255,.90),rgba(255,228,230,.82))', border: '1px solid rgba(251,113,133,.28)', shadow: '0 18px 38px rgba(251,113,133,.14)', radius: '30px', textColor: '#7C2D4B', mutedTextColor: '#9F6476', priceColor: '#E11D48', imageBackground: 'linear-gradient(135deg,#FFE4E6,#FFFFFF,#FED7AA)', imageAccent: '#FB7185' },
    menuList: { background: 'rgba(255,255,255,.76)', rowBackground: 'rgba(255,241,242,.78)', rowBorder: '1px solid rgba(251,113,133,.22)', categoryColor: '#7C2D4B', itemColor: '#7C2D4B', descriptionColor: '#9F6476', priceColor: '#E11D48' },
    brandStory: { background: 'linear-gradient(135deg,rgba(255,255,255,.82),rgba(255,228,230,.78))', textColor: '#7C2D4B', accentColor: '#FB7185', imageTreatment: 'soft-bubbles' },
    cta: { background: 'linear-gradient(90deg,#FB7185,#FED7AA)', textColor: '#7C2D4B', buttonBackground: '#7C2D4B', buttonColor: '#FFF1F2' },
    footer: { background: '#7C2D4B', textColor: '#FFF1F2', accentColor: '#FDA4AF' },
    placeholder: { mode: 'pattern', background: 'linear-gradient(135deg,#FFE4E6,#FFFFFF,#FED7AA)', accent: '#FB7185', textColor: '#9F1239', showStoreSiteText: false },
  },
  'tea-mist-premium': {
    page: { background: 'radial-gradient(circle at 12% 0%, rgba(67,116,70,.32), transparent 32%), linear-gradient(180deg,#10251A,#1F3A28 52%,#F4E7C4)', texture: 'botanical', textColor: '#F8F0D8', mutedTextColor: '#D6C9A7' },
    nav: { background: 'rgba(17,43,29,.84)', textColor: '#F8F0D8', accentColor: '#C9A86A', border: '1px solid rgba(201,168,106,.36)', radius: '18px', shadow: '0 20px 52px rgba(11,32,21,.28)' },
    hero: { backgroundMode: 'editorial', overlay: 'rgba(8,22,15,.34)', panelBackground: 'rgba(17,43,29,.68)', panelBorder: '1px solid rgba(201,168,106,.34)', headingColor: '#FFF7D6', subtitleColor: '#D6C9A7', eyebrowColor: '#C9A86A', ctaBackground: '#C9A86A', ctaColor: '#10251A', decorativeTextColor: '#C9A86A', decorativeTextOpacity: .18 },
    section: { background: 'rgba(248,240,216,.86)', alternateBackground: 'rgba(31,58,40,.34)', headingColor: '#173020', eyebrowColor: '#9A7A3D', border: '1px solid rgba(122,91,32,.30)', divider: 'linear-gradient(90deg,transparent,#9A7A3D,transparent)' },
    productCard: { background: 'linear-gradient(145deg,rgba(255,251,235,.96),rgba(235,226,197,.90))', border: '1px solid rgba(122,91,32,.30)', shadow: '0 18px 42px rgba(17,48,32,.18)', radius: '18px', textColor: '#173020', mutedTextColor: '#68745F', priceColor: '#7A5B20', imageBackground: 'linear-gradient(135deg,#10251A,#F4E7C4)', imageAccent: '#C9A86A' },
    menuList: { background: 'rgba(255,251,235,.84)', rowBackground: 'rgba(248,240,216,.74)', rowBorder: '1px solid rgba(122,91,32,.26)', categoryColor: '#173020', itemColor: '#173020', descriptionColor: '#68745F', priceColor: '#7A5B20' },
    brandStory: { background: 'linear-gradient(135deg,rgba(248,240,216,.86),rgba(31,58,40,.25))', textColor: '#173020', accentColor: '#9A7A3D', imageTreatment: 'mist-lines' },
    cta: { background: '#C9A86A', textColor: '#10251A', buttonBackground: '#10251A', buttonColor: '#F8F0D8' },
    footer: { background: '#10251A', textColor: '#F8F0D8', accentColor: '#C9A86A' },
    placeholder: { mode: 'abstract', background: 'linear-gradient(135deg,#10251A,#F4E7C4)', accent: '#C9A86A', textColor: '#F8F0D8', showStoreSiteText: false },
  },
  'luxury-black-gold': {
    page: { background: 'radial-gradient(circle at 20% 0%, rgba(212,175,55,.20), transparent 32%), linear-gradient(180deg,#050505,#17130A 55%,#0B0B0B)', texture: 'grain', textColor: '#FFF7D6', mutedTextColor: '#C9B98B' },
    nav: { background: 'rgba(8,7,5,.92)', textColor: '#FFF7D6', accentColor: '#D4AF37', border: '1px solid rgba(212,175,55,.42)', radius: '10px', shadow: '0 22px 58px rgba(0,0,0,.38)' },
    hero: { backgroundMode: 'dark-stage', overlay: 'rgba(0,0,0,.50)', panelBackground: 'rgba(8,7,5,.74)', panelBorder: '1px solid rgba(212,175,55,.38)', headingColor: '#FFF7D6', subtitleColor: '#D9C785', eyebrowColor: '#D4AF37', ctaBackground: 'linear-gradient(90deg,#7C5D10,#D4AF37)', ctaColor: '#050505', decorativeTextColor: '#D4AF37', decorativeTextOpacity: .20 },
    section: { background: 'rgba(17,17,17,.88)', alternateBackground: 'rgba(40,31,13,.82)', headingColor: '#F9E7A0', eyebrowColor: '#D4AF37', border: '1px solid rgba(212,175,55,.34)', divider: 'linear-gradient(90deg,transparent,#D4AF37,transparent)' },
    productCard: { background: 'linear-gradient(145deg,rgba(15,15,15,.96),rgba(44,34,13,.82))', border: '1px solid rgba(212,175,55,.44)', shadow: '0 24px 58px rgba(0,0,0,.42)', radius: '18px', textColor: '#FFF7D6', mutedTextColor: '#C9B98B', priceColor: '#D4AF37', imageBackground: 'linear-gradient(135deg,#050505,#3B2F10)', imageAccent: '#D4AF37' },
    menuList: { background: 'rgba(10,10,10,.86)', rowBackground: 'rgba(30,24,12,.74)', rowBorder: '1px solid rgba(212,175,55,.30)', categoryColor: '#F9E7A0', itemColor: '#FFF7D6', descriptionColor: '#C9B98B', priceColor: '#D4AF37' },
    brandStory: { background: 'linear-gradient(145deg,rgba(15,15,15,.88),rgba(44,34,13,.70))', textColor: '#FFF7D6', accentColor: '#D4AF37', imageTreatment: 'gold-line' },
    cta: { background: 'linear-gradient(90deg,#7C5D10,#D4AF37)', textColor: '#050505', buttonBackground: '#FFF7D6', buttonColor: '#050505' },
    footer: { background: '#050505', textColor: '#FFF7D6', accentColor: '#D4AF37' },
    placeholder: { mode: 'abstract', background: 'linear-gradient(135deg,#050505,#3B2F10)', accent: '#D4AF37', textColor: '#F9E7A0', showStoreSiteText: false },
  },
  'charcoal-grill': {
    page: { background: 'radial-gradient(circle at 18% 6%, rgba(249,115,22,.24), transparent 28%), linear-gradient(180deg,#11100E,#2A2420 55%,#0C0B0A)', texture: 'charcoal', textColor: '#FFF3E6', mutedTextColor: '#D7B89A' },
    nav: { background: 'rgba(18,16,14,.90)', textColor: '#FFF3E6', accentColor: '#F97316', border: '1px solid rgba(249,115,22,.38)', radius: '16px', shadow: '0 24px 56px rgba(0,0,0,.36)' },
    hero: { backgroundMode: 'dark-stage', overlay: 'rgba(8,7,6,.46)', panelBackground: 'rgba(18,16,14,.72)', panelBorder: '1px solid rgba(249,115,22,.34)', headingColor: '#FFF3E6', subtitleColor: '#F3C7A3', eyebrowColor: '#F97316', ctaBackground: 'linear-gradient(90deg,#7C2D12,#F97316)', ctaColor: '#FFF3E6', decorativeTextColor: '#F97316', decorativeTextOpacity: .22 },
    section: { background: 'linear-gradient(145deg,rgba(31,27,24,.90),rgba(68,40,24,.72))', alternateBackground: 'rgba(17,16,14,.90)', headingColor: '#FFE6C7', eyebrowColor: '#F97316', border: '1px solid rgba(249,115,22,.32)', divider: 'linear-gradient(90deg,transparent,#F97316,transparent)' },
    productCard: { background: 'linear-gradient(145deg,rgba(28,25,23,.96),rgba(68,40,24,.82))', border: '1px solid rgba(249,115,22,.40)', shadow: '0 22px 54px rgba(0,0,0,.36)', radius: '20px', textColor: '#FFF3E6', mutedTextColor: '#D7B89A', priceColor: '#FB923C', imageBackground: 'linear-gradient(135deg,#11100E,#7C2D12)', imageAccent: '#F97316' },
    menuList: { background: 'rgba(17,16,14,.86)', rowBackground: 'linear-gradient(90deg,rgba(28,25,23,.84),rgba(68,40,24,.62))', rowBorder: '1px solid rgba(249,115,22,.30)', categoryColor: '#FFE6C7', itemColor: '#FFF3E6', descriptionColor: '#D7B89A', priceColor: '#FB923C' },
    brandStory: { background: 'linear-gradient(145deg,rgba(31,27,24,.88),rgba(68,40,24,.70))', textColor: '#FFF3E6', accentColor: '#F97316', imageTreatment: 'fire-glow' },
    cta: { background: 'linear-gradient(90deg,#7C2D12,#F97316)', textColor: '#FFF3E6', buttonBackground: '#FFF3E6', buttonColor: '#11100E' },
    footer: { background: '#0C0B0A', textColor: '#FFF3E6', accentColor: '#FB923C' },
    placeholder: { mode: 'abstract', background: 'linear-gradient(135deg,#11100E,#7C2D12)', accent: '#F97316', textColor: '#FFF3E6', showStoreSiteText: false },
  },
  'urban-casual': {
    page: { background: 'radial-gradient(circle at 8% 0%, rgba(251,191,36,.18), transparent 32%), linear-gradient(180deg,#FAF7EF,#ECE7DC 55%,#FFFFFF)', texture: 'paper', textColor: '#2D2A24', mutedTextColor: '#756F62' },
    nav: { background: 'rgba(255,255,255,.82)', textColor: '#2D2A24', accentColor: '#D97706', border: '1px solid rgba(120,113,108,.22)', radius: '22px', shadow: '0 18px 44px rgba(68,64,60,.10)' },
    hero: { backgroundMode: 'editorial', overlay: 'rgba(255,250,240,.24)', panelBackground: 'rgba(255,255,255,.78)', panelBorder: '1px solid rgba(120,113,108,.22)', headingColor: '#2D2A24', subtitleColor: '#6D665A', eyebrowColor: '#D97706', ctaBackground: '#D97706', ctaColor: '#FFFFFF', decorativeTextColor: '#D97706', decorativeTextOpacity: .16 },
    section: { background: 'rgba(255,255,255,.82)', alternateBackground: 'rgba(250,243,226,.78)', headingColor: '#2D2A24', eyebrowColor: '#D97706', border: '1px solid rgba(120,113,108,.22)', divider: 'linear-gradient(90deg,transparent,#D97706,transparent)' },
    productCard: { background: 'linear-gradient(145deg,rgba(255,255,255,.94),rgba(250,243,226,.88))', border: '1px solid rgba(120,113,108,.24)', shadow: '0 16px 34px rgba(68,64,60,.10)', radius: '22px', textColor: '#2D2A24', mutedTextColor: '#756F62', priceColor: '#D97706', imageBackground: 'linear-gradient(135deg,#FFF7ED,#E7E5E4)', imageAccent: '#D97706' },
    menuList: { background: 'rgba(255,255,255,.84)', rowBackground: 'rgba(250,243,226,.70)', rowBorder: '1px solid rgba(120,113,108,.20)', categoryColor: '#2D2A24', itemColor: '#2D2A24', descriptionColor: '#756F62', priceColor: '#D97706' },
    brandStory: { background: 'linear-gradient(135deg,rgba(255,255,255,.84),rgba(250,243,226,.76))', textColor: '#2D2A24', accentColor: '#D97706', imageTreatment: 'street-paper' },
    cta: { background: '#D97706', textColor: '#FFFFFF', buttonBackground: '#2D2A24', buttonColor: '#FFFFFF' },
    footer: { background: '#2D2A24', textColor: '#FAF7EF', accentColor: '#F59E0B' },
    placeholder: { mode: 'pattern', background: 'linear-gradient(135deg,#FFF7ED,#E7E5E4)', accent: '#D97706', textColor: '#2D2A24', showStoreSiteText: false },
  },
  'ceramic-minimal': {
    page: { background: 'linear-gradient(180deg,#FAFAF8,#EFEDE8 55%,#FFFFFF)', texture: 'paper', textColor: '#2F2F2B', mutedTextColor: '#77736C' },
    nav: { background: 'rgba(255,255,255,.88)', textColor: '#2F2F2B', accentColor: '#8B6F4E', border: '1px solid rgba(120,113,108,.24)', radius: '6px', shadow: 'none' },
    hero: { backgroundMode: 'editorial', overlay: 'rgba(255,255,255,.32)', panelBackground: 'rgba(255,255,255,.92)', panelBorder: '1px solid rgba(120,113,108,.20)', headingColor: '#2F2F2B', subtitleColor: '#6D6962', eyebrowColor: '#8B6F4E', ctaBackground: '#8B6F4E', ctaColor: '#FFFFFF', decorativeTextColor: '#8B6F4E', decorativeTextOpacity: .12 },
    section: { background: 'rgba(255,255,255,.88)', alternateBackground: 'rgba(239,237,232,.78)', headingColor: '#2F2F2B', eyebrowColor: '#8B6F4E', border: '1px solid rgba(120,113,108,.20)', divider: 'linear-gradient(90deg,transparent,#8B6F4E,transparent)' },
    productCard: { background: 'linear-gradient(145deg,rgba(255,255,255,.96),rgba(245,244,241,.92))', border: '1px solid rgba(120,113,108,.24)', shadow: '0 10px 26px rgba(68,64,60,.08)', radius: '10px', textColor: '#2F2F2B', mutedTextColor: '#77736C', priceColor: '#8B6F4E', imageBackground: 'linear-gradient(135deg,#FFFFFF,#E7E5E4)', imageAccent: '#8B6F4E' },
    menuList: { background: 'rgba(255,255,255,.82)', rowBackground: 'rgba(250,250,248,.84)', rowBorder: '1px solid rgba(120,113,108,.18)', categoryColor: '#2F2F2B', itemColor: '#2F2F2B', descriptionColor: '#77736C', priceColor: '#8B6F4E' },
    brandStory: { background: 'linear-gradient(135deg,rgba(255,255,255,.86),rgba(239,237,232,.74))', textColor: '#2F2F2B', accentColor: '#8B6F4E', imageTreatment: 'ceramic-line' },
    cta: { background: '#8B6F4E', textColor: '#FFFFFF', buttonBackground: '#2F2F2B', buttonColor: '#FAFAF8' },
    footer: { background: '#2F2F2B', textColor: '#FAFAF8', accentColor: '#C7A77B' },
    placeholder: { mode: 'icon', background: 'linear-gradient(135deg,#FFFFFF,#E7E5E4)', accent: '#8B6F4E', textColor: '#57534E', showStoreSiteText: false },
  },
  'monochrome-editorial': {
    page: { background: 'linear-gradient(180deg,#0B0B0B,#2C2C2C 48%,#F4F4F4)', texture: 'monochrome', textColor: '#F5F5F5', mutedTextColor: '#CFCFCF' },
    nav: { background: 'rgba(12,12,12,.90)', textColor: '#F5F5F5', accentColor: '#FFFFFF', border: '1px solid rgba(255,255,255,.24)', radius: '0px', shadow: '0 18px 42px rgba(0,0,0,.28)' },
    hero: { backgroundMode: 'editorial', overlay: 'rgba(0,0,0,.30)', panelBackground: 'rgba(12,12,12,.66)', panelBorder: '1px solid rgba(255,255,255,.22)', headingColor: '#FFFFFF', subtitleColor: '#D4D4D4', eyebrowColor: '#FFFFFF', ctaBackground: '#FFFFFF', ctaColor: '#111111', decorativeTextColor: '#FFFFFF', decorativeTextOpacity: .14 },
    section: { background: 'rgba(245,245,245,.90)', alternateBackground: 'rgba(18,18,18,.84)', headingColor: '#111111', eyebrowColor: '#555555', border: '2px solid rgba(17,17,17,.40)', divider: 'linear-gradient(90deg,#111,#888,#111)' },
    productCard: { background: 'linear-gradient(145deg,rgba(255,255,255,.96),rgba(230,230,230,.90))', border: '2px solid rgba(17,17,17,.58)', shadow: '10px 10px 0 rgba(0,0,0,.16)', radius: '4px', textColor: '#111111', mutedTextColor: '#555555', priceColor: '#000000', imageBackground: 'linear-gradient(135deg,#111111,#F5F5F5)', imageAccent: '#FFFFFF' },
    menuList: { background: 'rgba(245,245,245,.90)', rowBackground: 'rgba(255,255,255,.82)', rowBorder: '1px solid rgba(17,17,17,.36)', categoryColor: '#111111', itemColor: '#111111', descriptionColor: '#555555', priceColor: '#000000' },
    brandStory: { background: 'linear-gradient(135deg,rgba(245,245,245,.88),rgba(17,17,17,.18))', textColor: '#111111', accentColor: '#000000', imageTreatment: 'geometric' },
    cta: { background: '#111111', textColor: '#FFFFFF', buttonBackground: '#FFFFFF', buttonColor: '#111111' },
    footer: { background: '#000000', textColor: '#F5F5F5', accentColor: '#FFFFFF' },
    placeholder: { mode: 'pattern', background: 'linear-gradient(135deg,#111111,#F5F5F5)', accent: '#FFFFFF', textColor: '#111111', showStoreSiteText: false },
  },
};

function resolveTemplate(input?: SiteData | TemplateGalleryItem | string): TemplateGalleryItem | undefined {
  if (!input) return undefined;
  if (typeof input === 'string') return getTemplateById(input);
  if ('store' in input) return getTemplateById(input.galleryTemplateId || input.visual?.selectedTemplateId || input.template);
  return input;
}

function familyFor(template: TemplateGalleryItem): SkinFamily {
  const explicit = (template as TemplateGalleryItem & { skinFamily?: SkinFamily }).skinFamily;
  const id = (template as TemplateGalleryItem & { skinId?: string }).skinId || template.id;
  const family = explicit || templateSkinFamilyMap[id] || templateSkinFamilyMap[template.id] || templateSkinFamilyMap[template.aiArtworkKey];
  if (!family) throw new Error(`Template ${template.id} is missing skinFamily mapping`);
  return family;
}

export function getTemplateSkin(input?: SiteData | TemplateGalleryItem | string): TemplateSkin {
  const template = resolveTemplate(input) || templateCatalog[0];
  const family = familyFor(template);
  const artwork = getTemplateArtwork(template);
  const base = familySkins[family];
  return {
    id: ((template as TemplateGalleryItem & { skinId?: string }).skinId || template.id),
    family,
    artwork: {
      src: artwork.gallerySrc,
      mobileSrc: artwork.mobileSrc,
      desktopSrc: artwork.desktopSrc,
      objectPosition: artwork.backplate.cropMode === 'top-cover' ? 'center top' : 'center center',
      overlay: artwork.backplate.overlay || base.hero.overlay,
      blendMode: 'normal',
    },
    ...base,
    placeholder: { ...base.placeholder, showStoreSiteText: false },
  };
}

export function getTemplateCssVariables(input?: SiteData | TemplateGalleryItem | string): Record<string, string> {
  const s = getTemplateSkin(input);
  return {
    '--skin-family': s.family,
    '--skin-page-bg': s.page.background,
    '--skin-text': s.page.textColor,
    '--skin-muted': s.page.mutedTextColor,
    '--skin-nav-bg': s.nav.background,
    '--skin-nav-text': s.nav.textColor,
    '--skin-nav-accent': s.nav.accentColor,
    '--skin-section-bg': s.section.background,
    '--skin-section-alt': s.section.alternateBackground,
    '--skin-heading': s.section.headingColor,
    '--skin-eyebrow': s.section.eyebrowColor,
    '--skin-card-bg': s.productCard.background,
    '--skin-card-text': s.productCard.textColor,
    '--skin-card-muted': s.productCard.mutedTextColor,
    '--skin-price': s.productCard.priceColor,
    '--skin-card-border': s.productCard.border,
    '--skin-card-radius': s.productCard.radius,
    '--skin-card-shadow': s.productCard.shadow,
    '--skin-menu-bg': s.menuList.background,
    '--skin-menu-row': s.menuList.rowBackground,
    '--skin-menu-border': s.menuList.rowBorder,
    '--skin-menu-category': s.menuList.categoryColor,
    '--skin-footer-bg': s.footer.background,
    '--skin-footer-text': s.footer.textColor,
    '--skin-footer-accent': s.footer.accentColor,
    '--placeholder-bg': s.placeholder.background,
    '--placeholder-accent': s.placeholder.accent,
    '--placeholder-label': s.placeholder.textColor,
    '--hero-panel-bg': s.hero.panelBackground,
    '--hero-heading': s.hero.headingColor,
    '--hero-subtitle': s.hero.subtitleColor,
    '--hero-cta-bg': s.hero.ctaBackground,
    '--hero-cta-color': s.hero.ctaColor,
  };
}

export function getTemplateComponentClasses(input?: SiteData | TemplateGalleryItem | string): Record<string, string> {
  const family = getTemplateSkin(input).family;
  return {
    root: `store-template skin-${family}`,
    nav: 'skin-nav',
    hero: 'template-hero',
    section: 'skin-section',
    productCard: 'skin-product-card',
    menuList: 'skin-menu-list',
    footer: 'skin-footer',
    placeholder: 'themed-placeholder',
  };
}

export function getThemedPlaceholder(input?: SiteData | TemplateGalleryItem | string) {
  const skin = getTemplateSkin(input);
  return { ...skin.placeholder, showStoreSiteText: false as const };
}

export function getExportTemplateCss(input?: SiteData | TemplateGalleryItem | string): string {
  return generateTemplateSkinCss(getTemplateSkin(input));
}

export function generateTemplateSkinCss(skin: TemplateSkin): string {
  const texture = skin.page.texture === 'neon-grid'
    ? 'linear-gradient(rgba(34,211,238,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,.08) 1px,transparent 1px)'
    : skin.page.texture === 'monochrome'
      ? 'repeating-linear-gradient(135deg,rgba(255,255,255,.05) 0 2px,transparent 2px 14px)'
      : skin.page.texture === 'bubbles'
        ? 'radial-gradient(circle at 15% 20%,rgba(255,255,255,.5),transparent 7%),radial-gradient(circle at 80% 10%,rgba(255,255,255,.35),transparent 8%)'
        : skin.page.texture === 'charcoal'
          ? 'repeating-linear-gradient(22deg,rgba(255,255,255,.04) 0 1px,transparent 1px 11px)'
          : skin.page.texture === 'botanical'
            ? 'radial-gradient(ellipse at 8% 18%,rgba(255,255,255,.22),transparent 18%)'
            : 'none';
  return `
.store-template,.export-site{font-family:inherit;min-height:100%;overflow:hidden;background:${skin.page.background};color:${skin.page.textColor}}
.store-template,.store-template *,.export-site,.export-site *{box-sizing:border-box}.store-template a,.export-site a{text-decoration:none}.skin-text-muted{color:${skin.page.mutedTextColor}}
.store-template:before,.export-site:before{content:"";position:fixed;inset:0;z-index:-2;pointer-events:none;background:${texture};background-size:44px 44px;opacity:.8}
.store-template .wrap,.export-site.wrap{max-width:1120px;margin:0 auto;padding:24px;display:grid;gap:28px}
.skin-nav{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:18px 22px;background:${skin.nav.background};color:${skin.nav.textColor};border:${skin.nav.border};border-radius:${skin.nav.radius};box-shadow:${skin.nav.shadow};backdrop-filter:blur(16px)}.skin-nav b{font-size:clamp(20px,3vw,30px)}.skin-nav nav{display:flex;gap:14px;flex-wrap:wrap}.skin-nav span{color:${skin.nav.textColor};font-size:13px;font-weight:900;letter-spacing:.08em}.skin-nav small{color:${skin.nav.accentColor};font-weight:900}
.template-hero{position:relative;isolation:isolate;overflow:hidden;min-height:var(--artwork-hero-desktop,620px);border-radius:28px;padding:clamp(24px,5vw,58px);display:flex;align-items:center;border:${skin.hero.panelBorder};box-shadow:${skin.productCard.shadow};background:#111}.template-hero-backplate{position:absolute;inset:0;width:100%;height:100%;z-index:0;object-fit:var(--artwork-fit,cover);object-position:var(--artwork-position,${skin.artwork.objectPosition})}.template-hero-overlay{position:absolute;inset:0;z-index:1;background:var(--artwork-overlay,${skin.artwork.overlay})}.hero-copy{position:relative;z-index:2;max-width:680px;border-radius:26px;background:${skin.hero.panelBackground};padding:clamp(22px,4vw,38px);border:${skin.hero.panelBorder};box-shadow:0 24px 70px rgba(0,0,0,.22);backdrop-filter:blur(18px)}.hero-copy h1{margin:0;font-size:clamp(40px,6vw,76px);line-height:1.05;letter-spacing:-.04em;color:${skin.hero.headingColor};text-wrap:balance}.hero-copy .muted{color:${skin.hero.subtitleColor}}
.skin-eyebrow,.placeholder-badge{display:inline-flex;margin:0 0 12px;color:${skin.section.eyebrowColor};font-size:12px;font-weight:1000;letter-spacing:.24em;text-transform:uppercase}.section-title,.skin-section h2{margin:0 0 18px;color:${skin.section.headingColor};font-size:clamp(28px,4vw,48px);letter-spacing:-.03em}.muted{color:${skin.page.mutedTextColor};line-height:1.8}.skin-section{position:relative;overflow:hidden;border-radius:28px;background:${skin.section.background};padding:28px;border:${skin.section.border};box-shadow:${skin.productCard.shadow}}.skin-section.is-alt{background:${skin.section.alternateBackground}}.skin-section:after{content:"";display:block;height:1px;margin-top:20px;background:${skin.section.divider};opacity:.7}
.product-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.skin-product-card{background:${skin.productCard.background};color:${skin.productCard.textColor};border:${skin.productCard.border};border-radius:${skin.productCard.radius};box-shadow:${skin.productCard.shadow};padding:18px;overflow:hidden}.skin-product-card h3{margin:14px 0 8px;color:${skin.productCard.textColor};font-size:22px}.price{display:block;color:${skin.productCard.priceColor};font-size:24px;font-weight:1000}.product-img{display:block;width:100%;height:180px;object-fit:cover;border-radius:calc(${skin.productCard.radius} - 8px);border:0}
.themed-placeholder{position:relative;overflow:hidden;background:${skin.placeholder.background};min-height:180px}.themed-placeholder .placeholder-orb,.themed-placeholder .placeholder-line{position:absolute;display:block;background:${skin.placeholder.accent};opacity:.72}.themed-placeholder .orb-a{width:42%;aspect-ratio:1;border-radius:999px;right:10%;top:12%;filter:blur(1px)}.themed-placeholder .orb-b{width:28%;aspect-ratio:1;border-radius:999px;left:12%;bottom:13%;opacity:.38}.themed-placeholder .line-a{height:2px;width:62%;left:18%;top:46%;transform:rotate(-10deg)}.themed-placeholder .line-b{height:2px;width:46%;right:14%;top:60%;transform:rotate(12deg);opacity:.45}.themed-placeholder b{position:absolute;left:18px;bottom:14px;color:${skin.placeholder.textColor}}
.skin-menu-list{display:grid;gap:16px;background:${skin.menuList.background};border-radius:24px;padding:18px}.skin-menu-category{padding:18px;border-radius:20px;background:${skin.menuList.background};border:${skin.menuList.rowBorder}}.skin-menu-category h3{margin:0 0 8px;color:${skin.menuList.categoryColor};font-size:24px}.skin-menu-row{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-top:10px;padding:14px 16px;border-radius:16px;background:${skin.menuList.rowBackground};border:${skin.menuList.rowBorder}}.skin-menu-row b{color:${skin.menuList.itemColor}}.skin-menu-row small{display:block;color:${skin.menuList.descriptionColor};margin-top:4px}.skin-menu-row strong{color:${skin.menuList.priceColor};font-size:20px}.info-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.faq-list{display:grid;gap:12px}.skin-link-list{display:flex;flex-wrap:wrap;gap:10px}.skin-btn{display:inline-flex;min-height:44px;align-items:center;justify-content:center;border-radius:999px;padding:10px 18px;font-weight:1000;color:${skin.hero.ctaColor};background:${skin.hero.ctaBackground};box-shadow:0 12px 28px rgba(0,0,0,.18)}
.skin-footer{border-radius:28px;background:${skin.footer.background};color:${skin.footer.textColor};padding:26px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}.skin-footer b{color:${skin.footer.accentColor}}
@media(max-width:760px){.store-template .wrap,.export-site.wrap{padding:14px;gap:16px}.skin-nav{border-radius:22px}.skin-nav nav{display:none}.template-hero{min-height:var(--artwork-hero-mobile,760px);padding:18px;align-items:flex-end}.hero-copy{width:100%;padding:20px}.hero-copy h1{font-size:clamp(34px,10vw,48px)}.product-grid,.info-grid{grid-template-columns:1fr}.skin-menu-row{padding:12px;flex-direction:column}.skin-section{padding:20px;border-radius:22px}.skin-footer{border-radius:22px}}
`;
}
