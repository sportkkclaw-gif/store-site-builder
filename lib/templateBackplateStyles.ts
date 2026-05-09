import type { CSSProperties } from 'react';
import type { TemplateBackplatePreset, TemplateCatalogItem, TemplateGalleryItem } from '@/types/template';
import type { SiteData } from '@/types/site';
const clean = (value: string) => value.replace(/\s+/g, ' ').trim();

export function getTemplateBackplatePreset(template: TemplateGalleryItem): TemplateBackplatePreset {
  const [p0 = '#14B8A6', p1 = '#F4C27A', p2 = '#FFFDF7', p3 = '#0F172A'] = template.palette;
  const tags = template.styleTags.join(' ');
  const id = template.id;

  if (id === 'drink-boba-neon' || /霓虹|霓光|潮流/.test(tags)) {
    return {
      page: { background: 'radial-gradient(circle at 22% 8%, rgba(124,58,237,.45), transparent 32%), radial-gradient(circle at 80% 16%, rgba(6,182,212,.32), transparent 28%), linear-gradient(145deg, #050816 0%, #12051F 42%, #02111F 100%)', texture: 'neon-glow', overlay: 'linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,0))' },
      hero: { mode: 'dark-neon-stage', background: 'radial-gradient(circle at 72% 45%, rgba(244,63,140,.38), transparent 34%), radial-gradient(circle at 30% 10%, rgba(6,182,212,.28), transparent 34%), linear-gradient(135deg, rgba(5,8,22,.98), rgba(36,10,64,.86) 55%, rgba(2,17,31,.96))', overlay: 'linear-gradient(90deg, rgba(5,8,22,.92), rgba(18,5,31,.62), rgba(6,182,212,.18))', artworkOpacity: .86, artworkBlendMode: 'screen', artworkPosition: 'right', artworkSize: 'cover' },
      sections: { surface: 'linear-gradient(180deg, rgba(8,13,31,.92), rgba(18,5,31,.88))', alternateSurface: 'linear-gradient(135deg, rgba(36,10,64,.72), rgba(2,17,31,.82))', cardSurface: 'rgba(10,16,38,.76)', border: 'rgba(125,211,252,.28)', shadow: 'neon' },
      decorative: { glow: '0 0 44px rgba(6,182,212,.42), 0 0 90px rgba(244,63,140,.25)', radialGradient: 'radial-gradient(circle at 88% 12%, rgba(244,63,140,.34), transparent 26%), radial-gradient(circle at 8% 88%, rgba(6,182,212,.26), transparent 26%)', pattern: 'neon-grid', cornerAccent: 'linear-gradient(135deg, #7C3AED, #06B6D4 55%, #F43F8C)' },
    };
  }
  if (id === 'drink-matcha-hiyori' || /抹茶|日系|自然/.test(tags)) {
    return {
      page: { background: 'radial-gradient(circle at 10% 8%, rgba(109,163,111,.24), transparent 32%), radial-gradient(circle at 86% 18%, rgba(201,168,106,.18), transparent 30%), linear-gradient(180deg, #FBF8EC 0%, #EAF5DF 54%, #FFFDF7 100%)', texture: 'botanical', overlay: 'linear-gradient(135deg, rgba(255,255,255,.42), transparent)' },
      hero: { mode: 'artwork-split', background: 'linear-gradient(135deg, rgba(255,253,247,.94), rgba(234,245,223,.82)), radial-gradient(circle at 82% 32%, rgba(109,163,111,.25), transparent 30%)', overlay: 'linear-gradient(90deg, rgba(255,253,247,.94), rgba(255,253,247,.58))', artworkOpacity: .92, artworkBlendMode: 'normal', artworkPosition: 'right', artworkSize: 'contain' },
      sections: { surface: 'rgba(255,253,247,.88)', alternateSurface: 'rgba(234,245,223,.74)', cardSurface: 'rgba(255,255,255,.86)', border: 'rgba(109,163,111,.18)', shadow: 'soft' },
      decorative: { glow: '0 22px 70px rgba(109,163,111,.15)', radialGradient: 'radial-gradient(circle at 12% 18%, rgba(109,163,111,.17), transparent 24%)', pattern: 'botanical', cornerAccent: 'linear-gradient(135deg, #6DA36F, #C9A86A)' },
    };
  }
  if (/白桃|氣泡|蜜桃/.test(tags) || id === 'drink-white-peach-sparkle') {
    return {
      page: { background: 'radial-gradient(circle at 18% 12%, rgba(253,183,200,.34), transparent 30%), radial-gradient(circle at 85% 8%, rgba(255,228,196,.42), transparent 26%), linear-gradient(180deg, #FFF7FA 0%, #FFF1F7 48%, #FFFFFF 100%)', texture: 'glass', overlay: 'radial-gradient(circle at 70% 28%, rgba(255,255,255,.55), transparent 22%)' },
      hero: { mode: 'gradient-stage', background: 'linear-gradient(135deg, rgba(255,255,255,.92), rgba(255,241,247,.78)), radial-gradient(circle at 75% 42%, rgba(253,183,200,.38), transparent 34%)', overlay: 'linear-gradient(90deg, rgba(255,255,255,.96), rgba(255,255,255,.62))', artworkOpacity: .9, artworkBlendMode: 'normal', artworkPosition: 'right', artworkSize: 'contain' },
      sections: { surface: 'rgba(255,255,255,.82)', alternateSurface: 'rgba(255,241,247,.72)', cardSurface: 'rgba(255,255,255,.86)', border: 'rgba(244,114,182,.18)', shadow: 'soft' },
      decorative: { glow: '0 20px 70px rgba(253,183,200,.24)', radialGradient: 'radial-gradient(circle at 12% 86%, rgba(255,228,196,.34), transparent 28%)', pattern: 'dots', cornerAccent: 'linear-gradient(135deg, #FDB7C8, #FFE4C4)' },
    };
  }
  if (/茶霧|山嵐|深綠|茶/.test(tags) || id === 'drink-tea-mist-mountain') {
    return {
      page: { background: 'radial-gradient(circle at 18% 8%, rgba(142,183,136,.25), transparent 30%), linear-gradient(145deg, #10251E 0%, #EEF5EF 52%, #FFFDF6 100%)', texture: 'paper', overlay: 'linear-gradient(180deg, rgba(16,37,30,.12), rgba(255,255,255,.22))' },
      hero: { mode: 'editorial-paper', background: 'linear-gradient(135deg, rgba(16,37,30,.92), rgba(238,245,239,.76)), radial-gradient(circle at 76% 38%, rgba(142,183,136,.33), transparent 32%)', overlay: 'linear-gradient(90deg, rgba(16,37,30,.88), rgba(16,37,30,.34), rgba(255,255,255,.18))', artworkOpacity: .88, artworkBlendMode: 'soft-light', artworkPosition: 'right', artworkSize: 'cover' },
      sections: { surface: 'rgba(238,245,239,.82)', alternateSurface: 'rgba(16,37,30,.78)', cardSurface: 'rgba(255,253,246,.88)', border: 'rgba(16,37,30,.18)', shadow: 'premium' },
      decorative: { glow: '0 24px 90px rgba(16,37,30,.22)', radialGradient: 'radial-gradient(circle at 82% 18%, rgba(142,183,136,.24), transparent 28%)', pattern: 'paper-grain', cornerAccent: 'linear-gradient(135deg, #10251E, #8EB788)' },
    };
  }
  if (/金色|晚宴|奢華|酒紅/.test(tags) || id === 'restaurant-golden-banquet') {
    return {
      page: { background: 'radial-gradient(circle at 78% 10%, rgba(212,175,55,.26), transparent 28%), linear-gradient(145deg, #050507 0%, #1A0B12 48%, #09090B 100%)', texture: 'luxury-dark', overlay: 'linear-gradient(180deg, rgba(212,175,55,.06), transparent)' },
      hero: { mode: 'luxury-photo-backdrop', background: 'radial-gradient(circle at 72% 38%, rgba(212,175,55,.28), transparent 30%), linear-gradient(135deg, rgba(5,5,7,.96), rgba(69,26,3,.72), rgba(9,9,11,.96))', overlay: 'linear-gradient(90deg, rgba(5,5,7,.92), rgba(9,9,11,.56), rgba(212,175,55,.16))', artworkOpacity: .78, artworkBlendMode: 'soft-light', artworkPosition: 'right', artworkSize: 'cover' },
      sections: { surface: 'rgba(11,11,15,.88)', alternateSurface: 'rgba(69,26,3,.46)', cardSurface: 'rgba(18,18,24,.82)', border: 'rgba(212,175,55,.30)', shadow: 'premium' },
      decorative: { glow: '0 24px 90px rgba(212,175,55,.24)', radialGradient: 'radial-gradient(circle at 12% 88%, rgba(212,175,55,.18), transparent 30%)', pattern: 'paper-grain', cornerAccent: 'linear-gradient(135deg, #D4AF37, #7F1D1D)' },
    };
  }
  if (/白瓷|手沖|濾杯|極簡/.test(tags) || id === 'cafe-white-dripper') {
    return {
      page: { background: 'radial-gradient(circle at 12% 10%, rgba(226,232,240,.44), transparent 30%), linear-gradient(180deg, #FFFFFF 0%, #F8F7F2 60%, #EFEDE5 100%)', texture: 'paper', overlay: 'linear-gradient(135deg, rgba(255,255,255,.7), rgba(148,163,184,.08))' },
      hero: { mode: 'artwork-card', background: 'linear-gradient(135deg, rgba(255,255,255,.96), rgba(248,247,242,.84)), radial-gradient(circle at 80% 36%, rgba(148,163,184,.18), transparent 34%)', overlay: 'linear-gradient(90deg, rgba(255,255,255,.98), rgba(255,255,255,.62))', artworkOpacity: .92, artworkBlendMode: 'normal', artworkPosition: 'right', artworkSize: 'contain' },
      sections: { surface: 'rgba(255,255,255,.90)', alternateSurface: 'rgba(248,247,242,.82)', cardSurface: 'rgba(255,255,255,.92)', border: 'rgba(15,23,42,.10)', shadow: 'soft' },
      decorative: { glow: '0 18px 60px rgba(148,163,184,.14)', radialGradient: 'radial-gradient(circle at 88% 12%, rgba(226,232,240,.36), transparent 28%)', pattern: 'paper-grain', cornerAccent: 'linear-gradient(135deg, #FFFFFF, #CBD5E1)' },
    };
  }
  if (/黑白|城市|單色/.test(tags) || id === 'cafe-urban-monochrome') {
    return {
      page: { background: 'linear-gradient(135deg, #0A0A0A 0%, #F5F5F4 52%, #FFFFFF 100%)', texture: 'grain', overlay: 'linear-gradient(90deg, rgba(0,0,0,.10), rgba(255,255,255,.18))' },
      hero: { mode: 'editorial-paper', background: 'linear-gradient(110deg, #0A0A0A 0 44%, #FFFFFF 44% 100%)', overlay: 'linear-gradient(90deg, rgba(0,0,0,.86), rgba(0,0,0,.22), rgba(255,255,255,.66))', artworkOpacity: .82, artworkBlendMode: 'multiply', artworkPosition: 'right', artworkSize: 'cover' },
      sections: { surface: 'rgba(250,250,249,.88)', alternateSurface: 'rgba(10,10,10,.82)', cardSurface: 'rgba(255,255,255,.90)', border: 'rgba(10,10,10,.18)', shadow: 'premium' },
      decorative: { glow: 'none', radialGradient: 'linear-gradient(90deg, rgba(0,0,0,.08) 1px, transparent 1px), linear-gradient(rgba(0,0,0,.06) 1px, transparent 1px)', pattern: 'paper-grain', cornerAccent: 'linear-gradient(135deg, #0A0A0A, #FFFFFF)' },
    };
  }
  if (/水果|繽紛|活潑|市集|派對|促銷/.test(tags)) {
    return {
      page: { background: `radial-gradient(circle at 20% 12%, ${p1}55, transparent 30%), radial-gradient(circle at 82% 18%, ${p3}44, transparent 28%), linear-gradient(135deg, ${p2}, ${p0}33 50%, #FFFFFF)`, texture: 'glass', overlay: 'linear-gradient(180deg, rgba(255,255,255,.35), rgba(255,255,255,.08))' },
      hero: { mode: 'gradient-stage', background: `linear-gradient(135deg, rgba(255,255,255,.82), ${p0}33), radial-gradient(circle at 74% 38%, ${p1}55, transparent 34%)`, overlay: 'linear-gradient(90deg, rgba(255,255,255,.92), rgba(255,255,255,.46))', artworkOpacity: .9, artworkBlendMode: 'normal', artworkPosition: 'right', artworkSize: 'large' },
      sections: { surface: 'rgba(255,255,255,.84)', alternateSurface: `${p0}22`, cardSurface: 'rgba(255,255,255,.88)', border: 'rgba(15,23,42,.10)', shadow: 'glow' },
      decorative: { glow: `0 22px 80px ${p1}33`, radialGradient: `radial-gradient(circle at 10% 86%, ${p3}2e, transparent 28%)`, pattern: 'dots', cornerAccent: `linear-gradient(135deg, ${p0}, ${p1}, ${p3})` },
    };
  }
  if (/黑糖|琥珀|焦糖|溫暖/.test(tags)) {
    return {
      page: { background: 'radial-gradient(circle at 75% 12%, rgba(183,110,40,.28), transparent 28%), linear-gradient(145deg, #2B1608 0%, #F4D5A4 58%, #FFF7ED 100%)', texture: 'grain', overlay: 'linear-gradient(180deg, rgba(255,247,237,.18), rgba(43,22,8,.08))' },
      hero: { mode: 'luxury-photo-backdrop', background: 'linear-gradient(135deg, rgba(43,22,8,.92), rgba(183,110,40,.42), rgba(255,247,237,.68))', overlay: 'linear-gradient(90deg, rgba(43,22,8,.88), rgba(43,22,8,.34), rgba(255,247,237,.18))', artworkOpacity: .88, artworkBlendMode: 'soft-light', artworkPosition: 'right', artworkSize: 'cover' },
      sections: { surface: 'rgba(255,247,237,.86)', alternateSurface: 'rgba(244,213,164,.62)', cardSurface: 'rgba(255,251,245,.88)', border: 'rgba(183,110,40,.22)', shadow: 'premium' },
      decorative: { glow: '0 22px 80px rgba(183,110,40,.22)', radialGradient: 'radial-gradient(circle at 14% 88%, rgba(244,213,164,.38), transparent 28%)', pattern: 'paper-grain', cornerAccent: 'linear-gradient(135deg, #2B1608, #B76E28, #F4D5A4)' },
    };
  }
  // Default by base template / remaining 30 templates, still unique through palette.
  return {
    page: { background: `radial-gradient(circle at 16% 10%, ${p1}33, transparent 30%), radial-gradient(circle at 86% 18%, ${p0}22, transparent 28%), linear-gradient(180deg, ${p2}, #FFFFFF)`, texture: template.baseTemplate === 'premium-minimal' ? 'paper' : 'glass', overlay: `linear-gradient(135deg, rgba(255,255,255,.32), ${p0}10)` },
    hero: { mode: template.baseTemplate === 'premium-minimal' ? 'luxury-photo-backdrop' : template.baseTemplate === 'playful-colorful' ? 'gradient-stage' : 'artwork-split', background: `linear-gradient(135deg, rgba(255,255,255,.90), ${p0}24), radial-gradient(circle at 80% 38%, ${p1}44, transparent 34%)`, overlay: 'linear-gradient(90deg, rgba(255,255,255,.94), rgba(255,255,255,.52))', artworkOpacity: .9, artworkBlendMode: 'normal', artworkPosition: 'right', artworkSize: 'contain' },
    sections: { surface: 'rgba(255,255,255,.84)', alternateSurface: `${p0}14`, cardSurface: 'rgba(255,255,255,.88)', border: 'rgba(15,23,42,.10)', shadow: template.baseTemplate === 'premium-minimal' ? 'premium' : 'soft' },
    decorative: { glow: `0 20px 70px ${p0}22`, radialGradient: `radial-gradient(circle at 12% 88%, ${p1}2f, transparent 28%)`, pattern: template.baseTemplate === 'fresh-japanese' ? 'botanical' : template.baseTemplate === 'premium-minimal' ? 'paper-grain' : 'dots', cornerAccent: `linear-gradient(135deg, ${p0}, ${p1})` },
  };
}

function shadowCss(kind: TemplateBackplatePreset['sections']['shadow']) {
  if (kind === 'neon') return '0 0 0 1px rgba(125,211,252,.10), 0 24px 90px rgba(6,182,212,.22), 0 14px 55px rgba(124,58,237,.20)';
  if (kind === 'glow') return '0 24px 80px rgba(15,23,42,.14), 0 0 45px rgba(255,255,255,.20)';
  if (kind === 'premium') return '0 28px 90px rgba(15,23,42,.24)';
  if (kind === 'soft') return '0 18px 50px rgba(15,23,42,.12)';
  return 'none';
}

function patternCss(pattern?: TemplateBackplatePreset['decorative']['pattern']) {
  if (pattern === 'neon-grid') return 'linear-gradient(rgba(125,211,252,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(244,63,140,.08) 1px, transparent 1px)';
  if (pattern === 'dots') return 'radial-gradient(circle, rgba(15,23,42,.10) 1.2px, transparent 1.4px)';
  if (pattern === 'botanical') return 'radial-gradient(ellipse at 20% 30%, rgba(109,163,111,.18), transparent 22%), radial-gradient(ellipse at 70% 70%, rgba(201,168,106,.14), transparent 20%)';
  if (pattern === 'paper-grain') return 'radial-gradient(circle at 20% 20%, rgba(15,23,42,.06) 0 1px, transparent 1.5px)';
  if (pattern === 'waves') return 'repeating-radial-gradient(circle at 0 0, rgba(15,23,42,.06), rgba(15,23,42,.06) 1px, transparent 1px, transparent 18px)';
  return 'none';
}

function sizeCss(size: TemplateBackplatePreset['hero']['artworkSize']) {
  if (size === 'cover') return 'cover';
  if (size === 'large') return 'min(720px, 60vw) auto';
  if (size === 'medium') return 'min(560px, 48vw) auto';
  return 'contain';
}

function positionCss(position: TemplateBackplatePreset['hero']['artworkPosition']) {
  if (position === 'left') return 'left center';
  if (position === 'top') return 'center top';
  if (position === 'bottom') return 'center bottom';
  if (position === 'center') return 'center center';
  return 'right center';
}

export function getTemplateBackplate(input: TemplateCatalogItem | TemplateGalleryItem | SiteData) {
  let preset: TemplateBackplatePreset | undefined;
  if ('store' in input) {
    const galleryLike: TemplateGalleryItem = {
      id: input.galleryTemplateId || input.visual?.selectedTemplateId || 'fallback',
      industry: input.industry === 'restaurant' || input.industry === 'cafe' ? input.industry : 'drink-shop',
      slug: input.galleryTemplateId || input.visual?.selectedTemplateId || 'fallback',
      name: input.store.name,
      shortDescription: '',
      longDescription: '',
      suitableFor: [],
      styleTags: [input.visual?.templatePreset?.styleLabel || input.visual?.layoutFamily || input.template],
      badges: [],
      palette: [input.theme.backgroundColor, input.theme.primaryColor, input.theme.secondaryColor, input.theme.textColor],
      aiArtworkKey: input.visual?.aiArtworkKey || 'fallback',
      artworkSrc: '',
      recommended: false,
      popularityRank: 99,
      newbieFriendly: true,
      baseTemplate: input.template,
      recommendationReason: '',
    };
    preset = getTemplateBackplatePreset(galleryLike);
  } else {
    preset = 'backplatePreset' in input ? input.backplatePreset : getTemplateBackplatePreset(input);
  }
  const fallback: TemplateBackplatePreset = preset || getTemplateBackplatePreset({ id:'fallback', industry:'drink-shop', slug:'fallback', name:'預設', shortDescription:'', longDescription:'', suitableFor:[], styleTags:['清爽'], badges:[], palette:['#6DA36F','#C9A86A','#F8F1DF','#0F172A'], aiArtworkKey:'fallback', artworkSrc:'', recommended:false, popularityRank:99, newbieFriendly:true, baseTemplate:'fresh-japanese', recommendationReason:'' });
  const heroMode = fallback.hero.mode;
  const fullBleed = ['artwork-full-bleed','dark-neon-stage','luxury-photo-backdrop','artwork-poster'].includes(heroMode);
  const vars = clean(`--bp-page:${fallback.page.background};--bp-page-overlay:${fallback.page.overlay || 'transparent'};--bp-hero:${fallback.hero.background};--bp-hero-overlay:${fallback.hero.overlay || 'transparent'};--bp-section:${fallback.sections.surface};--bp-section-alt:${fallback.sections.alternateSurface};--bp-card:${fallback.sections.cardSurface};--bp-border:${fallback.sections.border};--bp-shadow:${shadowCss(fallback.sections.shadow)};--bp-pattern:${patternCss(fallback.decorative.pattern)};--bp-glow:${fallback.decorative.glow || 'none'};--bp-radial:${fallback.decorative.radialGradient || 'transparent'};--bp-corner:${fallback.decorative.cornerAccent || 'transparent'};--bp-art-opacity:${fallback.hero.artworkOpacity};--bp-art-blend:${fallback.hero.artworkBlendMode || 'normal'};--bp-art-position:${positionCss(fallback.hero.artworkPosition)};--bp-art-size:${sizeCss(fallback.hero.artworkSize)};`);
  const cssVariables = vars;
  const pageStyle = { background: fallback.page.background } as CSSProperties;
  const heroStyle = { background: fallback.hero.background } as CSSProperties;
  const heroArtworkStyle = { opacity: fallback.hero.artworkOpacity, mixBlendMode: fallback.hero.artworkBlendMode || 'normal', objectPosition: positionCss(fallback.hero.artworkPosition) } as CSSProperties;
  const sectionStyle = { background: fallback.sections.surface } as CSSProperties;
  const cardStyle = { background: fallback.sections.cardSurface, borderColor: fallback.sections.border, boxShadow: shadowCss(fallback.sections.shadow) } as CSSProperties;
  const decorativeLayers = clean(`.store-template{${cssVariables}}.store-template::before{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;background:var(--bp-page-overlay),var(--bp-radial);opacity:.92}.store-template::after{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;background-image:var(--bp-pattern);background-size:32px 32px;opacity:.35;mix-blend-mode:${fallback.page.texture === 'neon-glow' ? 'screen' : 'multiply'}}.store-template .wrap{position:relative;z-index:1}.store-template .hero-grid{background:var(--bp-hero)!important}.store-template .hero-grid:before{background:var(--bp-hero-overlay)!important}.store-template .hero-grid .hero-artwork:before{content:"";position:absolute;inset:-18%;z-index:0;background:var(--bp-radial);filter:blur(20px);opacity:.80}.store-template .hero-artwork img{opacity:var(--bp-art-opacity);mix-blend-mode:var(--bp-art-blend);object-position:var(--bp-art-position);filter:drop-shadow(var(--bp-glow))}.store-template section:not(.hero-grid){background:var(--bp-section);border-radius:inherit}.store-template .template-card{background:var(--bp-card)!important;border-color:var(--bp-border)!important;box-shadow:var(--bp-shadow)!important}.store-template .band{background:var(--bp-section-alt)!important;border-color:var(--bp-border)!important}.store-template .product-card:nth-child(even){background:var(--bp-section-alt)!important}.store-template .top,.store-template header.template-card{background:var(--bp-card)!important}.store-template .hero-grid[data-backplate="full"] .hero-artwork{position:absolute;inset:0;z-index:0;opacity:.88}.store-template .hero-grid[data-backplate="full"] .hero-artwork img{width:100%;height:100%;max-height:none;object-fit:cover;object-position:var(--bp-art-position);border-radius:inherit}.store-template .hero-grid[data-backplate="full"] .hero-copy{z-index:2}`);
  const exportCssVariables = cssVariables;
  return {
    preset: fallback,
    pageStyle,
    heroStyle,
    heroArtworkStyle,
    sectionStyle,
    cardStyle,
    decorativeLayers,
    mobileHeroStyle: fullBleed ? 'stacked-artwork-backplate' : 'stacked-card-backplate',
    exportCssVariables,
    shadowCss: shadowCss(fallback.sections.shadow),
    isFullBleedHero: fullBleed,
  };
}
