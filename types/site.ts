export type TemplateStyle='fresh-japanese'|'premium-minimal'|'playful-colorful';
export type IndustryType='drink-shop'|'restaurant'|'cafe'|'snack-shop'|'other';

export interface SiteTemplatePreset{
  selectedTemplateId:string;
  layoutFamily:string;
  backgroundMode:string;
  aiArtworkKey:string;
  heroTreatment:'split-image'|'full-bleed-overlay'|'floating-artwork'|'minimal-crop';
  navStyle:'floating'|'solid'|'transparent'|'dark';
  cardStyle:'soft'|'glass'|'minimal'|'dark'|'playful';
  styleLabel:string;
}

export interface SiteVisual{
  selectedTemplateId:string;
  layoutFamily:string;
  backgroundMode:string;
  aiArtworkKey:string;
  heroTreatment:'split-image'|'full-bleed-overlay'|'floating-artwork'|'minimal-crop';
  navStyle:'floating'|'solid'|'transparent'|'dark';
  cardStyle:'soft'|'glass'|'minimal'|'dark'|'playful';
  templatePreset:SiteTemplatePreset;
  appliedAt?:string;
  crossIndustryNotice?:string;
}

export interface SiteData{ id:string; industry:IndustryType; template:TemplateStyle; galleryTemplateId?: string; store:{name:string;tagline:string;description:string;phone:string;email:string;address:string;businessHours:string}; theme:{primaryColor:string;secondaryColor:string;backgroundColor:string;textColor:string;fontFamily:'sans'|'serif'|'rounded';buttonStyle:'rounded'|'pill'|'square';sectionRadius:number;layoutDensity:'compact'|'comfortable'|'spacious'}; hero:{title:string;subtitle:string;imageId?:string;imageMode?:'template'|'custom';ctaText:string;ctaUrl:string}; menu:{categories:MenuCategory[]}; media:MediaAsset[]; links:{line?:string;instagram?:string;facebook?:string;threads?:string;tiktok?:string;googleMap?:string;ubereats?:string;foodpanda?:string;orderForm?:string;reservation?:string}; seo:{title:string;description:string;slug:string;ogImageId?:string}; modules:{hero:boolean;featuredProducts:boolean;menu:boolean;brandStory:boolean;storeInfo:boolean;map:boolean;faq:boolean;socialLinks:boolean;footer:boolean}; faq:{question:string;answer:string}[]; visual?:SiteVisual; }
export interface MenuCategory{id:string;name:string;description?:string;items:MenuItem[]}
export interface MenuItem{id:string;name:string;description:string;price:number;imageId?:string;featured:boolean;tags?:string[]}
export interface MediaAsset{id:string;name:string;type:'logo'|'hero'|'product'|'store'|'other';mimeType:string;dataUrl:string}
export type BuilderSection='overview'|'basic'|'template'|'brand'|'media'|'menu'|'links'|'seo'|'modules'|'json'|'export';
