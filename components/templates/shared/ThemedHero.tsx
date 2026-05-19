import type { CSSProperties } from 'react';
import type { SiteData } from '@/types/site';
import type { TemplateSkin } from '@/lib/templateSkinEngine';
import { getHeroTitleLines } from '@/lib/formatHeroTitleLines';
import { getHeroFallbackCta } from '@/lib/heroCta';
import { getHeroImageSource } from '@/lib/heroImage';
import { MobileArtworkSafeFrame } from './MobileArtworkSafeFrame';

const linkLabels: Record<string, string> = { line: 'LINE', instagram: 'Instagram', facebook: 'Facebook', threads: 'Threads', tiktok: 'TikTok', googleMap: 'Google Maps', ubereats: 'Uber Eats', foodpanda: 'foodpanda', orderForm: '立即訂購', reservation: '線上訂位' };

function Links({ data }: { data: SiteData }) {
  const entries = Object.entries(data.links).filter(([, v]) => v);
  const fallbackCta = getHeroFallbackCta(data);
  const links = entries.length ? entries : [['cta', fallbackCta.href]];
  return <div className="skin-link-list mt-6" data-testid="hero-cta-row">{links.map(([k, v]) => <a key={k} className="skin-btn" href={String(v)} target={String(v).startsWith('#') ? undefined : '_blank'} rel={String(v).startsWith('#') ? undefined : 'noopener noreferrer'}>{k === 'cta' ? fallbackCta.label : linkLabels[k] || data.hero.ctaText || '查看菜單'}</a>)}</div>;
}

export function ThemedHero({ data, skin }: { data: SiteData; skin: TemplateSkin }) {
  const heroImage = getHeroImageSource(data);
  const artwork = heroImage.artwork;
  const titleLines = getHeroTitleLines(data.hero.title, data.store.tagline);
  return <section className="template-hero" data-testid="site-hero" data-hero-image-mode={heroImage.mode} data-skin-component="hero" data-skin-family={skin.family} data-artwork-source="true" data-artwork-src={heroImage.gallerySrc} data-panel={artwork.backplate.textPanelMode} data-panel-position={artwork.backplate.textPanelPosition} data-contrast={artwork.backplate.textContrast} style={{ '--artwork-overlay': artwork.backplate.overlay, '--artwork-hero-desktop': artwork.backplate.heroHeightDesktop, '--artwork-hero-mobile': artwork.backplate.heroHeightMobile, '--artwork-fit': heroImage.fit, '--artwork-position': heroImage.position } as CSSProperties}>
    <div className="template-hero-inner" data-testid="site-hero-inner">
      <picture><source media="(max-width: 760px)" srcSet={heroImage.mobileSrc} /><img className="template-hero-backplate" src={heroImage.src} data-artwork-src={heroImage.gallerySrc} data-gallery-src={heroImage.gallerySrc} alt="" aria-hidden="true" /></picture>
      <div className="mobile-hero-artwork-stage" data-testid="mobile-hero-artwork-stage">
        <MobileArtworkSafeFrame src={heroImage.mobileSrc} alt={heroImage.alt} mode={artwork.backplate.mobileArtworkMode} skinFamily={skin.family} overlay={artwork.backplate.overlay} />
      </div>
      <div className="template-hero-overlay" />
      <div className="hero-copy mobile-hero-content-panel" data-testid="mobile-hero-content-panel"><span className="placeholder-badge">{data.store.tagline}</span><h1 data-testid="hero-title" aria-label={data.hero.title}>{titleLines.map(line => <span key={line} className="hero-title-line">{line}</span>)}</h1><p className="muted mt-5 text-lg" data-testid="hero-subtitle">{data.hero.subtitle}</p><Links data={data} /></div>
    </div>
  </section>;
}
