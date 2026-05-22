import type { SiteData } from '@/types/site';
import type { TemplateSkin } from './templateSkinEngine';
import { esc, mediaById } from './imageUtils';
import { renderHeroTitleLinesHtml } from './formatHeroTitleLines';
import { getTemplateById } from './templateCatalog';
import { getHeroImageSource } from './heroImage';
import { getTemplateArtwork } from './templateArtworkResolver';
import { generateTemplateSkinCss, getTemplateSkin } from './templateSkinEngine';
import { generateDesktopVisualSystemCss } from './desktopVisualSystemCss';
import { getHeroFallbackCta } from './heroCta';

const names: Record<string, string> = { line: 'LINE', instagram: 'Instagram', facebook: 'Facebook', threads: 'Threads', tiktok: 'TikTok', googleMap: 'Google Maps', ubereats: 'Uber Eats', foodpanda: 'foodpanda', orderForm: '立即訂購', reservation: '線上訂位' };
const templateName: Record<SiteData['template'], string> = { 'fresh-japanese': '清新日系', 'premium-minimal': '質感極簡', 'playful-colorful': '活潑可愛' };
function asset(data: SiteData, id?: string) { const media = mediaById(data, id); return media ? `assets/${media.id}.${(media.mimeType.split('/')[1] || 'png').replace('jpeg', 'jpg')}` : ''; }
function font(data: SiteData) { return data.theme.fontFamily === 'serif' ? 'Georgia,"Noto Serif TC",serif' : data.theme.fontFamily === 'rounded' ? 'ui-rounded,"Noto Sans TC",system-ui,sans-serif' : 'system-ui,"Noto Sans TC",sans-serif'; }
function links(data: SiteData) { const entries = Object.entries(data.links).filter(([, v]) => v); const fallbackCta = getHeroFallbackCta(data); const list = entries.length ? entries : [['cta', fallbackCta.href]]; return list.map(([k, v]) => `<a class="skin-btn" href="${esc(v)}" ${String(v).startsWith('#') ? '' : 'target="_blank" rel="noopener noreferrer"'}>${esc(k === 'cta' ? fallbackCta.label : names[k] || data.hero.ctaText || '查看菜單')}</a>`).join(''); }

function navLinks(data: SiteData) {
  const items = [
    data.modules.brandStory ? ['#brand-story', '品牌故事'] : null,
    data.modules.featuredProducts ? ['#featured-products', '招牌商品'] : null,
    data.modules.menu ? ['#menu', '菜單'] : null,
    data.modules.storeInfo ? ['#store-info', '門市'] : null,
  ].filter(Boolean) as [string, string][];
  return items.map(([href, label]) => `<a href="${href}">${esc(label)}</a>`).join('');
}

export function generateExportSkinCss(data: SiteData, skin: TemplateSkin) {
  return `html{scroll-behavior:smooth}body{margin:0;font-family:${font(data)};overflow-x:hidden}${generateTemplateSkinCss(skin)}${generateDesktopVisualSystemCss(skin)}.skin-nav a{color:inherit;text-decoration:none;cursor:pointer}.skin-section{scroll-margin-top:16px}@media(max-width:760px){.export-site,.export-site *{max-width:100%;box-sizing:border-box}.hero-copy{overflow-wrap:normal}.skin-nav{min-width:0}.skin-nav nav{display:flex;flex-wrap:wrap;gap:8px}.skin-menu-list{padding:12px}.product-img{height:150px}.template-hero-inner{overflow:hidden}.hero-title-line{display:block}}`;
}

export function renderThemedPlaceholderHtml(type: 'product' | 'hero' | 'store' | 'logo', skin: TemplateSkin, label = '') {
  return `<div class="product-img themed-placeholder" data-skin-component="placeholder" data-skin-family="${esc(skin.family)}" data-visual-contract-id="${esc(skin.visualContractId)}" data-placeholder-type="${esc(type)}" data-placeholder-mode="${esc(skin.placeholder.mode)}" data-store-site-text="false" aria-label="${esc(label || type)}"><span class="placeholder-orb orb-a"></span><span class="placeholder-orb orb-b"></span><span class="placeholder-line line-a"></span><span class="placeholder-line line-b"></span></div>`;
}

export function renderThemedProductCardHtml(data: SiteData, item: SiteData['menu']['categories'][number]['items'][number], skin: TemplateSkin) {
  const img = asset(data, item.imageId);
  return `<article class="skin-product-card" data-skin-component="product-card" data-skin-family="${esc(skin.family)}" data-visual-contract-id="${esc(skin.visualContractId)}">${img ? `<img class="product-img" src="${esc(img)}" alt="${esc(item.name)}">` : renderThemedPlaceholderHtml('product', skin, item.name)}<div class="product-copy"><h3>${esc(item.name)}</h3><p class="muted">${esc(item.description)}</p><strong class="price">$${esc(item.price)}</strong></div></article>`;
}

export function renderThemedMenuHtml(data: SiteData, skin: TemplateSkin) {
  return `<div class="skin-menu-list" data-skin-component="menu-list" data-skin-family="${esc(skin.family)}" data-visual-contract-id="${esc(skin.visualContractId)}">${data.menu.categories.map(category => `<article class="skin-menu-category"><h3>${esc(category.name)}</h3>${category.description ? `<p class="muted">${esc(category.description)}</p>` : ''}<div class="skin-menu-rows">${category.items.map(item => `<div class="skin-menu-row"><span><b>${esc(item.name)}</b><small>${esc(item.description)}</small></span><strong>$${esc(item.price)}</strong></div>`).join('')}</div></article>`).join('')}</div>`;
}

function renderHeroHtml(data: SiteData, skin: TemplateSkin, heroImage: ReturnType<typeof getHeroImageSource>) {
  const titleLines = renderHeroTitleLinesHtml(data.hero.title, data.store.tagline);
  const artwork = heroImage.artwork;
  return `<section class="template-hero" data-testid="site-hero" data-hero-image-mode="${esc(heroImage.mode)}" data-skin-component="hero" data-skin-family="${esc(skin.family)}" data-visual-contract-id="${esc(skin.visualContractId)}" data-artwork-source="true" data-artwork-src="${esc(heroImage.gallerySrc)}" data-panel="${esc(artwork.backplate.textPanelMode)}" data-contrast="${esc(artwork.backplate.textContrast)}" style="--artwork-overlay:${esc(artwork.backplate.overlay)};--artwork-hero-desktop:${esc(artwork.backplate.heroHeightDesktop)};--artwork-hero-mobile:${esc(artwork.backplate.heroHeightMobile)};--artwork-fit:${esc(heroImage.fit)};--artwork-position:${esc(heroImage.position)}"><div class="template-hero-inner" data-testid="site-hero-inner"><img class="template-hero-backplate" src="${esc(heroImage.exportSrc)}" data-artwork-src="${esc(heroImage.gallerySrc)}" data-gallery-src="${esc(heroImage.gallerySrc)}" alt=""><div class="mobile-hero-artwork-stage" data-testid="mobile-hero-artwork-stage"><div class="mobile-artwork-safe-frame" data-testid="mobile-artwork-safe-frame" data-mobile-artwork-mode="${esc(artwork.backplate.mobileArtworkMode)}" data-skin-family="${esc(skin.family)}" style="--mobile-artwork-radius:22px;--mobile-artwork-overlay:${esc(artwork.backplate.overlay)}"><img class="mobile-artwork-image" data-testid="mobile-artwork-image" src="${esc(heroImage.exportSrc)}" alt="${esc(heroImage.alt)}"><div class="mobile-artwork-overlay" aria-hidden="true"></div></div></div><div class="template-hero-overlay"></div><div class="hero-copy mobile-hero-content-panel" data-testid="mobile-hero-content-panel"><span class="placeholder-badge">${esc(data.store.tagline)}</span><h1 data-testid="hero-title" aria-label="${esc(data.hero.title)}">${titleLines}</h1><p class="muted" data-testid="hero-subtitle">${esc(data.hero.subtitle)}</p><div class="skin-link-list" data-testid="hero-cta-row">${links(data)}</div></div></div></section>`;
}

function sectionHtml(className: string, skin: TemplateSkin, body: string, id = '', testId = 'site-section') {
  return `<section${id ? ` id="${esc(id)}"` : ''} class="${className}" data-testid="${esc(testId)}" data-skin-component="section" data-skin-family="${esc(skin.family)}"><div class="skin-section-inner" data-testid="site-section-inner">${body}</div></section>`;
}

export function exportStaticSite(data: SiteData) {
  const featured = data.menu.categories.flatMap(c => c.items).filter(i => i.featured);
  const artwork = getTemplateArtwork(data);
  const heroImage = getHeroImageSource(data);
  const skin = getTemplateSkin(data);
  const og = heroImage.exportSrc || asset(data, data.seo.ogImageId) || asset(data, data.hero.imageId);
  const selectedName = getTemplateById(data.galleryTemplateId)?.name || templateName[data.template];
  const templateId = data.galleryTemplateId || data.visual?.selectedTemplateId || data.template;
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(data.seo.title || data.store.name)}</title><meta name="description" content="${esc(data.seo.description || data.store.description)}"><meta property="og:title" content="${esc(data.seo.title || data.store.name)}"><meta property="og:description" content="${esc(data.seo.description || data.store.description)}"><meta property="og:image" content="${esc(og)}"><style>${generateExportSkinCss(data, skin)}</style></head><body><main class="export-site wrap skin-${esc(skin.family)}" data-testid="site-root" data-full-skin="true" data-template-id="${esc(templateId)}" data-skin-id="${esc(skin.id)}" data-skin-family="${esc(skin.family)}" data-visual-contract-id="${esc(skin.visualContractId)}"><header class="skin-nav" data-skin-component="nav" data-skin-family="${esc(skin.family)}" data-visual-contract-id="${esc(skin.visualContractId)}"><b>${esc(data.store.name)}</b><nav aria-label="店名片區塊導覽">${navLinks(data)}</nav><small>目前模板：${esc(selectedName)}｜${esc(data.store.tagline)}</small></header>${data.modules.hero ? renderHeroHtml(data, skin, heroImage) : ''}${data.modules.brandStory ? sectionHtml('skin-section', skin, `<p class="skin-eyebrow">STORY</p><h2>品牌故事</h2><div class="brand-story" data-skin-component="brand-story" data-skin-family="${esc(skin.family)}"><p class="muted">${esc(data.store.description)}</p></div>`, 'brand-story', 'section-brand-story') : ''}${data.modules.featuredProducts ? sectionHtml('skin-section is-alt', skin, `<p class="skin-eyebrow">FEATURED</p><h2>招牌商品</h2><div class="product-grid">${featured.map(item => renderThemedProductCardHtml(data, item, skin)).join('')}</div>`, 'featured-products', 'section-featured-products') : ''}${data.modules.menu ? `<section id="menu" class="skin-section is-alt" data-testid="section-menu" data-skin-component="section" data-skin-family="${esc(skin.family)}"><div class="skin-section-inner" data-testid="site-section-inner"><p class="skin-eyebrow">MENU</p><h2>菜單總覽</h2>${renderThemedMenuHtml(data, skin)}</div></section>` : ''}${data.modules.storeInfo ? sectionHtml('skin-section', skin, `<p class="skin-eyebrow">INFO</p><h2>門市資訊</h2><div class="info-grid"><p>📍 ${esc(data.store.address)}</p><p>☎ ${esc(data.store.phone)}</p><p>✉ ${esc(data.store.email)}</p><p>🕘 ${esc(data.store.businessHours)}</p></div>`, 'store-info', 'section-store-info') : ''}${data.modules.faq ? sectionHtml('skin-section is-alt', skin, `<p class="skin-eyebrow">FAQ</p><h2>常見問題</h2><div class="faq-list">${data.faq.map(f => `<details class="skin-product-card" data-skin-component="product-card" data-skin-family="${esc(skin.family)}"><summary>${esc(f.question)}</summary><p class="muted">${esc(f.answer)}</p></details>`).join('')}</div>`) : ''}${data.modules.footer ? `<footer class="skin-footer" data-skin-component="footer" data-skin-family="${esc(skin.family)}"><span>© ${new Date().getFullYear()} ${esc(data.store.name)}</span><b>${esc(data.store.tagline)}</b></footer>` : ''}</main></body></html>`;
}
