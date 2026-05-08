import type { TemplateCatalogItem, TemplateGalleryItem, TemplateLayoutFamily } from '@/types/template';
import { enrichTemplateItem } from './enrichTemplate';

export type TemplateImageTreatmentKind =
  | 'hero-right-crop'
  | 'hero-background-overlay'
  | 'hero-floating-artwork'
  | 'editorial-split'
  | 'dark-full-bleed'
  | 'soft-card-artwork'
  | 'pattern-accent';

export interface TemplateImageTreatment {
  imageTreatment: TemplateImageTreatmentKind;
  heroLayout: 'split' | 'background' | 'floating' | 'editorial' | 'card';
  artworkPosition: 'right' | 'background' | 'floating-right' | 'split-right' | 'card-top' | 'accent';
  objectFit: 'cover' | 'contain';
  overlay: string;
  textContrast: 'light-on-dark' | 'dark-on-light';
  heroMinHeight: string;
  mobileHeroLayout: 'stacked' | 'background' | 'card';
}

const treatments: Record<TemplateLayoutFamily, TemplateImageTreatment> = {
  'drink-soft-brand': {
    imageTreatment: 'soft-card-artwork',
    heroLayout: 'split',
    artworkPosition: 'right',
    objectFit: 'cover',
    overlay: 'linear-gradient(90deg, rgba(255,255,255,.96), rgba(255,255,255,.56))',
    textContrast: 'dark-on-light',
    heroMinHeight: '520px',
    mobileHeroLayout: 'stacked',
  },
  'drink-campaign': {
    imageTreatment: 'hero-floating-artwork',
    heroLayout: 'floating',
    artworkPosition: 'floating-right',
    objectFit: 'cover',
    overlay: 'linear-gradient(135deg, rgba(15,23,42,.28), rgba(255,255,255,.08))',
    textContrast: 'dark-on-light',
    heroMinHeight: '540px',
    mobileHeroLayout: 'stacked',
  },
  'drink-premium-tea': {
    imageTreatment: 'editorial-split',
    heroLayout: 'editorial',
    artworkPosition: 'split-right',
    objectFit: 'cover',
    overlay: 'linear-gradient(90deg, rgba(247,241,225,.96), rgba(63,111,88,.18))',
    textContrast: 'dark-on-light',
    heroMinHeight: '560px',
    mobileHeroLayout: 'stacked',
  },
  'restaurant-premium': {
    imageTreatment: 'dark-full-bleed',
    heroLayout: 'background',
    artworkPosition: 'background',
    objectFit: 'cover',
    overlay: 'linear-gradient(90deg, rgba(15,23,42,.86), rgba(15,23,42,.42), rgba(15,23,42,.18))',
    textContrast: 'light-on-dark',
    heroMinHeight: '560px',
    mobileHeroLayout: 'background',
  },
  'restaurant-family': {
    imageTreatment: 'hero-right-crop',
    heroLayout: 'split',
    artworkPosition: 'right',
    objectFit: 'cover',
    overlay: 'linear-gradient(90deg, rgba(255,247,237,.94), rgba(255,255,255,.38))',
    textContrast: 'dark-on-light',
    heroMinHeight: '500px',
    mobileHeroLayout: 'stacked',
  },
  'restaurant-fast-order': {
    imageTreatment: 'pattern-accent',
    heroLayout: 'floating',
    artworkPosition: 'accent',
    objectFit: 'cover',
    overlay: 'linear-gradient(135deg, rgba(255,255,255,.82), rgba(251,146,60,.16))',
    textContrast: 'dark-on-light',
    heroMinHeight: '500px',
    mobileHeroLayout: 'card',
  },
  'cafe-minimal': {
    imageTreatment: 'soft-card-artwork',
    heroLayout: 'card',
    artworkPosition: 'card-top',
    objectFit: 'cover',
    overlay: 'linear-gradient(90deg, rgba(255,255,255,.98), rgba(255,255,255,.50))',
    textContrast: 'dark-on-light',
    heroMinHeight: '500px',
    mobileHeroLayout: 'stacked',
  },
  'cafe-editorial': {
    imageTreatment: 'editorial-split',
    heroLayout: 'editorial',
    artworkPosition: 'split-right',
    objectFit: 'cover',
    overlay: 'linear-gradient(90deg, rgba(250,250,249,.96), rgba(214,194,160,.18))',
    textContrast: 'dark-on-light',
    heroMinHeight: '540px',
    mobileHeroLayout: 'stacked',
  },
  'cafe-artistic': {
    imageTreatment: 'hero-floating-artwork',
    heroLayout: 'floating',
    artworkPosition: 'floating-right',
    objectFit: 'cover',
    overlay: 'linear-gradient(135deg, rgba(255,255,255,.88), rgba(244,114,182,.14))',
    textContrast: 'dark-on-light',
    heroMinHeight: '520px',
    mobileHeroLayout: 'stacked',
  },
};

export function getTemplateImageTreatment(templateItem: TemplateGalleryItem | TemplateCatalogItem): TemplateImageTreatment {
  const template = 'layoutFamily' in templateItem ? templateItem : enrichTemplateItem(templateItem);
  return treatments[template.layoutFamily] || treatments['drink-soft-brand'];
}
