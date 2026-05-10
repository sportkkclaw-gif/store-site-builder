import type { CSSProperties } from 'react';
import type { SiteData } from '@/types/site';
import type { TemplateSkin } from '@/lib/templateSkinEngine';
import { getTemplateArtwork, heroObjectFit, heroObjectPosition } from '@/lib/templateArtworkResolver';

const linkLabels: Record<string, string> = { line: 'LINE', instagram: 'Instagram', facebook: 'Facebook', threads: 'Threads', tiktok: 'TikTok', googleMap: 'Google Maps', ubereats: 'Uber Eats', foodpanda: 'foodpanda', orderForm: '立即訂購', reservation: '線上訂位' };

function Links({ data }: { data: SiteData }) {
  const entries = Object.entries(data.links).filter(([, v]) => v);
  const links = entries.length ? entries : [['cta', data.hero.ctaUrl || '#menu']];
  return <div className="skin-link-list mt-6">{links.map(([k, v]) => <a key={k} className="skin-btn" href={String(v)} target={String(v).startsWith('#') ? undefined : '_blank'} rel={String(v).startsWith('#') ? undefined : 'noopener noreferrer'}>{linkLabels[k] || data.hero.ctaText || '查看菜單'}</a>)}</div>;
}

export function ThemedHero({ data, skin }: { data: SiteData; skin: TemplateSkin }) {
  const artwork = getTemplateArtwork(data);
  return <section className="template-hero" data-testid="site-hero" data-skin-component="hero" data-skin-family={skin.family} data-artwork-source="true" data-artwork-src={artwork.gallerySrc} data-panel={artwork.backplate.textPanelMode} data-contrast={artwork.backplate.textContrast} style={{ '--artwork-overlay': artwork.backplate.overlay, '--artwork-hero-desktop': artwork.backplate.heroHeightDesktop, '--artwork-hero-mobile': artwork.backplate.heroHeightMobile, '--artwork-fit': heroObjectFit(artwork.backplate.cropMode), '--artwork-position': heroObjectPosition(artwork.backplate.cropMode) } as CSSProperties}>
    <div className="template-hero-inner" data-testid="site-hero-inner">
      <picture><source media="(max-width: 760px)" srcSet={artwork.mobileSrc} /><img className="template-hero-backplate" src={artwork.previewSrc} data-artwork-src={artwork.gallerySrc} data-gallery-src={artwork.gallerySrc} alt="" aria-hidden="true" /></picture>
      <div className="template-hero-overlay" />
      <div className="hero-copy"><span className="placeholder-badge">{data.store.tagline}</span><h1>{data.hero.title}</h1><p className="muted mt-5 text-lg">{data.hero.subtitle}</p><Links data={data} /></div>
    </div>
  </section>;
}
