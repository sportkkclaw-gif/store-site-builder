import type { CSSProperties, ReactNode } from 'react';
import type { SiteData, MenuItem } from '@/types/site';
import { imageSrc, mediaById } from '@/lib/imageUtils';
import { getTemplateArtwork, heroObjectFit, heroObjectPosition } from '@/lib/templateArtworkResolver';
import { getTemplateSkin, skinCssVariables } from '@/lib/templateSkin';
import { ThemedPlaceholderImage } from './ThemedPlaceholderImage';

const linkLabels: Record<string, string> = { line: 'LINE', instagram: 'Instagram', facebook: 'Facebook', threads: 'Threads', tiktok: 'TikTok', googleMap: 'Google Maps', ubereats: 'Uber Eats', foodpanda: 'foodpanda', orderForm: '立即訂購', reservation: '線上訂位' };
const density = { compact: 'compact', comfortable: 'balanced', spacious: 'spacious' } as const;
const font = (data: SiteData) => data.theme.fontFamily === 'serif' ? 'Georgia, "Noto Serif TC", serif' : data.theme.fontFamily === 'rounded' ? 'ui-rounded, "Noto Sans TC", system-ui, sans-serif' : 'system-ui, "Noto Sans TC", sans-serif';

function HeroBackplateImage({ data }: { data: SiteData }) {
  const artwork = getTemplateArtwork(data);
  return <picture><source media="(max-width: 760px)" srcSet={artwork.mobileSrc} /><img className="template-hero-backplate" src={artwork.previewSrc} data-artwork-src={artwork.gallerySrc} data-gallery-src={artwork.gallerySrc} alt="" aria-hidden="true" style={{ objectFit: heroObjectFit(artwork.backplate.cropMode), objectPosition: heroObjectPosition(artwork.backplate.cropMode) }} /></picture>;
}

function Links({ data, className = '' }: { data: SiteData; className?: string }) {
  const skin = getTemplateSkin(data);
  const entries = Object.entries(data.links).filter(([, v]) => v);
  const links = entries.length ? entries : [['cta', data.hero.ctaUrl || '#menu']];
  return <div className={`skin-link-list ${className}`}>{links.map(([k, v]) => <a key={k} className="skin-btn" data-cta-style={skin.hero.ctaStyle} href={String(v)} target={String(v).startsWith('#') ? undefined : '_blank'} rel={String(v).startsWith('#') ? undefined : 'noopener noreferrer'}>{linkLabels[k] || data.hero.ctaText || '查看菜單'}</a>)}</div>;
}

function ProductVisual({ data, item, className = '' }: { data: SiteData; item: MenuItem; className?: string }) {
  const hasImage = !!mediaById(data, item.imageId);
  if (hasImage) return <img className={`product-img ${className}`} src={imageSrc(data, item.imageId)} alt={item.name} />;
  return <ThemedPlaceholderImage data={data} label={item.name} className={`product-img ${className}`} />;
}

function Section({ children, eyebrow, title, alt = false, className = '' }: { children: ReactNode; eyebrow?: string; title?: string; alt?: boolean; className?: string }) {
  return <section className={`skin-section ${alt ? 'is-alt' : ''} ${className}`}>{eyebrow && <p className="skin-eyebrow">{eyebrow}</p>}{title && <h2 className="section-title">{title}</h2>}{children}</section>;
}

function ProductGrid({ data, items }: { data: SiteData; items: MenuItem[] }) {
  return <div className="product-grid">{items.map(item => <article key={item.id} className="skin-product-card" data-product-card-skin="true"><ProductVisual data={data} item={item} /><div className="product-copy"><h3>{item.name}</h3><p className="muted">{item.description}</p><strong className="price">${item.price}</strong></div></article>)}</div>;
}

function MenuList({ data }: { data: SiteData }) {
  if (!data.modules.menu) return null;
  return <Section eyebrow="MENU" title="菜單總覽" alt><div className="skin-menu-list" data-menu-list-skin="true">{data.menu.categories.map(category => <article key={category.id} className="skin-menu-category"><h3>{category.name}</h3>{category.description && <p className="muted">{category.description}</p>}<div className="skin-menu-rows">{category.items.map(item => <div key={item.id} className="skin-menu-row"><span><b>{item.name}</b><small>{item.description}</small></span><strong>${item.price}</strong></div>)}</div></article>)}</div></Section>;
}

function StoreInfo({ data }: { data: SiteData }) {
  if (!data.modules.storeInfo) return null;
  return <Section eyebrow="INFO" title="門市資訊"><div className="info-grid"><p>📍 {data.store.address}</p><p>☎ {data.store.phone}</p><p>✉ {data.store.email}</p><p>🕘 {data.store.businessHours}</p></div></Section>;
}

function FAQ({ data }: { data: SiteData }) {
  if (!data.modules.faq) return null;
  return <Section eyebrow="FAQ" title="常見問題" alt><div className="faq-list">{data.faq.map(f => <details key={f.question} className="skin-product-card"><summary>{f.question}</summary><p className="muted">{f.answer}</p></details>)}</div></Section>;
}

function SkinStyle({ data }: { data: SiteData }) {
  const skin = getTemplateSkin(data);
  return <style>{`
.store-template{font-family:${font(data)};min-height:100%;overflow:hidden;background:var(--skin-page-bg);color:var(--skin-text)}
.store-template,.store-template *{box-sizing:border-box}.store-template a{text-decoration:none}.store-template .wrap{max-width:1120px;margin:0 auto;padding:24px;display:grid;gap:${skin.section.spacing === 'spacious' ? '34px' : skin.section.spacing === 'compact' ? '18px' : '26px'}}
.store-template:before{content:"";position:fixed;inset:0;z-index:-2;pointer-events:none;background:${skin.page.texture === 'neon-grid' ? 'linear-gradient(rgba(34,211,238,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,.08) 1px,transparent 1px)' : skin.page.texture === 'monochrome' ? 'repeating-linear-gradient(135deg,rgba(255,255,255,.05) 0 2px,transparent 2px 14px)' : skin.page.texture === 'soft-bubbles' ? 'radial-gradient(circle at 15% 20%,rgba(255,255,255,.5),transparent 7%),radial-gradient(circle at 80% 10%,rgba(255,255,255,.35),transparent 8%)' : skin.page.texture === 'botanical' ? 'radial-gradient(ellipse at 8% 18%,rgba(255,255,255,.22),transparent 18%)' : 'none'};background-size:44px 44px;opacity:.8}
.skin-nav{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:18px 22px;background:${skin.nav.background};color:${skin.nav.textColor};border:${skin.nav.border || '0'};border-radius:${skin.nav.radius}px;box-shadow:${skin.nav.shadow || 'none'};backdrop-filter:blur(16px)}.skin-nav b{font-size:clamp(20px,3vw,30px)}.skin-nav nav{display:flex;gap:14px;flex-wrap:wrap}.skin-nav span{color:${skin.nav.textColor};font-size:13px;font-weight:900;letter-spacing:.08em}.skin-nav small{color:${skin.nav.accentColor};font-weight:900}
.template-hero{position:relative;isolation:isolate;overflow:hidden;min-height:var(--artwork-hero-desktop,620px);border-radius:28px;padding:clamp(24px,5vw,58px);display:flex;align-items:center;border:${skin.productCard.border};box-shadow:${skin.productCard.shadow};background:#111}.template-hero-backplate{position:absolute;inset:0;width:100%;height:100%;z-index:0}.template-hero-overlay{position:absolute;inset:0;z-index:1;background:var(--artwork-overlay,${skin.hero.overlay})}.hero-copy{position:relative;z-index:2;max-width:680px;border-radius:26px;background:${skin.hero.contentPanelBackground};padding:clamp(22px,4vw,38px);border:1px solid rgba(255,255,255,.22);box-shadow:0 24px 70px rgba(0,0,0,.22);backdrop-filter:blur(18px)}.hero-copy h1{margin:0;font-size:clamp(40px,6vw,76px);line-height:1.05;letter-spacing:-.04em;color:${skin.hero.headingColor};text-wrap:balance}.hero-copy .muted{color:${skin.hero.subtitleColor}}
.skin-eyebrow,.placeholder-badge{display:inline-flex;margin:0 0 12px;color:${skin.section.eyebrowColor};font-size:12px;font-weight:1000;letter-spacing:.24em;text-transform:uppercase}.section-title,.skin-section h2{margin:0 0 18px;color:${skin.section.headingColor};font-size:clamp(28px,4vw,48px);letter-spacing:-.03em}.muted{color:var(--skin-muted);line-height:1.8}.skin-section{position:relative;overflow:hidden;border-radius:28px;background:var(--skin-section-bg);padding:${skin.section.spacing === 'spacious' ? '34px' : skin.section.spacing === 'compact' ? '22px' : '28px'};border:${skin.productCard.border};box-shadow:${skin.productCard.shadow}}.skin-section.is-alt{background:var(--skin-section-alt)}.skin-section:after{content:"";display:${skin.section.dividerStyle === 'none' ? 'none' : 'block'};height:${skin.section.dividerStyle === 'bold-line' ? '3px' : '1px'};margin-top:20px;background:${skin.section.dividerStyle === 'glow-line' ? `linear-gradient(90deg,transparent,${skin.section.eyebrowColor},transparent)` : skin.section.eyebrowColor};opacity:.45}
.product-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.skin-product-card{background:var(--skin-card-bg);color:var(--skin-card-text);border:var(--skin-card-border);border-radius:var(--skin-card-radius);box-shadow:var(--skin-card-shadow);padding:18px;overflow:hidden}.skin-product-card h3{margin:14px 0 8px;color:var(--skin-card-text);font-size:22px}.price{display:block;color:var(--skin-price);font-size:24px;font-weight:1000}.product-img{display:block;width:100%;height:180px;object-fit:cover;border-radius:calc(var(--skin-card-radius) - 8px);border:${skin.productCard.imageTreatment === 'dark-frame' ? '1px solid rgba(255,255,255,.25)' : '0'}}
.themed-placeholder{position:relative;overflow:hidden;background:var(--placeholder-bg);min-height:180px}.themed-placeholder .placeholder-orb,.themed-placeholder .placeholder-line{position:absolute;display:block;background:var(--placeholder-accent);opacity:.72}.themed-placeholder .orb-a{width:42%;aspect-ratio:1;border-radius:999px;right:10%;top:12%;filter:blur(1px)}.themed-placeholder .orb-b{width:28%;aspect-ratio:1;border-radius:999px;left:12%;bottom:13%;opacity:.38}.themed-placeholder .line-a{height:2px;width:62%;left:18%;top:46%;transform:rotate(-10deg)}.themed-placeholder .line-b{height:2px;width:46%;right:14%;top:60%;transform:rotate(12deg);opacity:.45}.themed-placeholder b{position:absolute;left:18px;bottom:14px;color:var(--placeholder-label)}
.skin-menu-list{display:grid;gap:16px;background:var(--skin-menu-bg);border-radius:24px;padding:18px}.skin-menu-category{padding:18px;border-radius:20px;background:${skin.menuList.background};border:${skin.menuList.rowBorder}}.skin-menu-category h3{margin:0 0 8px;color:${skin.menuList.categoryColor};font-size:24px}.skin-menu-row{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-top:10px;padding:14px 16px;border-radius:16px;background:${skin.menuList.rowBackground};border:${skin.menuList.rowBorder}}.skin-menu-row small{display:block;color:var(--skin-muted);margin-top:4px}.skin-menu-row strong{color:${skin.menuList.priceColor};font-size:20px}.info-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.faq-list{display:grid;gap:12px}.skin-link-list{display:flex;flex-wrap:wrap;gap:10px}.skin-btn{display:inline-flex;min-height:44px;align-items:center;justify-content:center;border-radius:999px;padding:10px 18px;font-weight:1000;color:${skin.hero.ctaStyle === 'minimal-black' ? '#111' : '#fff'};background:${skin.hero.ctaStyle === 'neon' ? 'linear-gradient(90deg,#A855F7,#22D3EE)' : skin.hero.ctaStyle === 'premium-gold' ? 'linear-gradient(90deg,#7C5D10,#D4AF37)' : skin.hero.ctaStyle === 'amber' ? 'linear-gradient(90deg,#92400E,#F59E0B)' : skin.hero.ctaStyle === 'fruit' ? 'linear-gradient(90deg,#F97316,#FACC15,#22C55E)' : skin.hero.ctaStyle === 'coffee' ? '#8B6F4E' : skin.hero.ctaStyle === 'minimal-black' ? '#fff' : '#6DA36F'};box-shadow:0 12px 28px rgba(0,0,0,.18)}
.skin-footer{border-radius:28px;background:var(--skin-footer-bg);color:var(--skin-footer-text);padding:26px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}.skin-footer b{color:var(--skin-footer-accent)}
@media(max-width:760px){.store-template .wrap{padding:14px;gap:16px}.skin-nav{border-radius:22px}.skin-nav nav{display:none}.template-hero{min-height:var(--artwork-hero-mobile,760px);padding:18px;align-items:flex-end}.hero-copy{width:100%;padding:20px}.hero-copy h1{font-size:clamp(34px,10vw,48px)}.product-grid,.info-grid{grid-template-columns:1fr}.skin-menu-row{padding:12px;flex-direction:column}.skin-section{padding:20px;border-radius:22px}.skin-footer{border-radius:22px}}
`}</style>;
}

export function FullSkinTemplate({ data, variant = 'fresh' }: { data: SiteData; variant?: 'fresh' | 'premium' | 'playful' }) {
  const skin = getTemplateSkin(data);
  const artwork = getTemplateArtwork(data);
  const featured = data.menu.categories.flatMap(c => c.items).filter(i => i.featured);
  const cssVars = { ...skinCssVariables(skin), '--artwork-overlay': artwork.backplate.overlay, '--artwork-hero-desktop': artwork.backplate.heroHeightDesktop, '--artwork-hero-mobile': artwork.backplate.heroHeightMobile } as CSSProperties;
  return <main className="store-template" data-full-skin="true" data-skin-id={skin.id} data-template-variant={variant} style={cssVars}>
    <SkinStyle data={data} />
    <div className="wrap">
      <header className="skin-nav" data-nav-skin="true"><b>{data.store.name}</b><nav><span>品牌故事</span><span>招牌商品</span><span>菜單</span><span>門市</span></nav><small>{data.store.tagline}</small></header>
      {data.modules.hero && <section className="template-hero" data-artwork-source="true" data-artwork-src={artwork.gallerySrc} data-panel={artwork.backplate.textPanelMode} data-contrast={artwork.backplate.textContrast}><HeroBackplateImage data={data} /><div className="template-hero-overlay" /><div className="hero-copy"><span className="placeholder-badge">{data.store.tagline}</span><h1>{data.hero.title}</h1><p className="muted mt-5 text-lg">{data.hero.subtitle}</p><Links data={data} className="mt-6" /></div></section>}
      {data.modules.brandStory && <Section eyebrow="STORY" title="品牌故事"><p className="muted">{data.store.description}</p></Section>}
      {data.modules.featuredProducts && <Section eyebrow="FEATURED" title="招牌商品" alt><ProductGrid data={data} items={featured} /></Section>}
      <MenuList data={data} />
      <StoreInfo data={data} />
      <FAQ data={data} />
      {data.modules.footer && <footer className="skin-footer" data-footer-skin="true"><span>© {new Date().getFullYear()} {data.store.name}</span><b>{data.store.tagline}</b></footer>}
    </div>
  </main>;
}
