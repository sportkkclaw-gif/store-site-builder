import type { CSSProperties } from 'react';
import type { SiteData } from '@/types/site';
import { getTemplateArtwork, heroObjectFit, heroObjectPosition } from '@/lib/templateArtworkResolver';
import { generateTemplateSkinCss, getTemplateCssVariables, getTemplateSkin } from '@/lib/templateSkinEngine';
import { ThemedNav } from './shared/ThemedNav';
import { ThemedHero } from './shared/ThemedHero';
import { ThemedSection } from './shared/ThemedSection';
import { ThemedProductGrid } from './shared/ThemedProductCard';
import { ThemedMenuList } from './shared/ThemedMenuList';
import { ThemedBrandStory } from './shared/ThemedBrandStory';
import { ThemedFooter } from './shared/ThemedFooter';

const font = (data: SiteData) => data.theme.fontFamily === 'serif' ? 'Georgia, "Noto Serif TC", serif' : data.theme.fontFamily === 'rounded' ? 'ui-rounded, "Noto Sans TC", system-ui, sans-serif' : 'system-ui, "Noto Sans TC", sans-serif';

function SkinStyle({ data }: { data: SiteData }) {
  const skin = getTemplateSkin(data);
  return <style>{`
.store-template{font-family:${font(data)}}
${generateTemplateSkinCss(skin)}
.brand-story{background:${skin.brandStory.background};color:${skin.brandStory.textColor};border-radius:22px;padding:18px;border:1px solid ${skin.brandStory.accentColor}33}
.skin-cta{background:${skin.cta.background}!important;color:${skin.cta.textColor}}
@media(max-width:390px){.store-template,.store-template *{max-width:100%}.hero-copy{overflow-wrap:anywhere}.skin-nav{min-width:0}.skin-menu-list{padding:12px}.product-img{height:150px}}
`}</style>;
}

function StoreInfo({ data, skin }: { data: SiteData; skin: ReturnType<typeof getTemplateSkin> }) {
  if (!data.modules.storeInfo) return null;
  return <ThemedSection skin={skin} eyebrow="INFO" title="門市資訊"><div className="info-grid"><p>📍 {data.store.address}</p><p>☎ {data.store.phone}</p><p>✉ {data.store.email}</p><p>🕘 {data.store.businessHours}</p></div></ThemedSection>;
}

function FAQ({ data, skin }: { data: SiteData; skin: ReturnType<typeof getTemplateSkin> }) {
  if (!data.modules.faq) return null;
  return <ThemedSection skin={skin} eyebrow="FAQ" title="常見問題" alt><div className="faq-list">{data.faq.map(f => <details key={f.question} className="skin-product-card" data-skin-component="product-card" data-skin-family={skin.family}><summary>{f.question}</summary><p className="muted">{f.answer}</p></details>)}</div></ThemedSection>;
}

export function FullSkinTemplate({ data, variant = 'fresh' }: { data: SiteData; variant?: 'fresh' | 'premium' | 'playful' }) {
  const skin = getTemplateSkin(data);
  const artwork = getTemplateArtwork(data);
  const featured = data.menu.categories.flatMap(c => c.items).filter(i => i.featured);
  const cssVars = { ...getTemplateCssVariables(data), '--artwork-overlay': artwork.backplate.overlay, '--artwork-hero-desktop': artwork.backplate.heroHeightDesktop, '--artwork-hero-mobile': artwork.backplate.heroHeightMobile, '--artwork-fit': heroObjectFit(artwork.backplate.cropMode), '--artwork-position': heroObjectPosition(artwork.backplate.cropMode) } as CSSProperties;
  return <main className={`store-template skin-${skin.family}`} data-template-id={data.galleryTemplateId || data.visual?.selectedTemplateId || data.template} data-skin-id={skin.id} data-skin-family={skin.family} data-visual-contract-id={skin.visualContractId} data-full-skin="true" data-template-variant={variant} style={cssVars}>
    <SkinStyle data={data} />
    <div className="wrap">
      <ThemedNav data={data} skin={skin} />
      {data.modules.hero && <ThemedHero data={data} skin={skin} />}
      <ThemedBrandStory data={data} skin={skin} />
      {data.modules.featuredProducts && <ThemedSection skin={skin} eyebrow="FEATURED" title="招牌商品" alt><ThemedProductGrid data={data} items={featured} skin={skin} /></ThemedSection>}
      <ThemedMenuList data={data} skin={skin} />
      <StoreInfo data={data} skin={skin} />
      <FAQ data={data} skin={skin} />
      <ThemedFooter data={data} skin={skin} />
    </div>
  </main>;
}
