import type { SiteData } from '@/types/site';
import type { TemplateSkin } from '@/lib/templateSkinEngine';
import { ThemedSection } from './ThemedSection';

export function ThemedCTA({ data, skin }: { data: SiteData; skin: TemplateSkin }) {
  return <ThemedSection skin={skin} eyebrow="ACTION" title={data.hero.ctaText || '立即查看'} alt className="skin-cta"><div data-skin-component="cta" data-skin-family={skin.family}><a className="skin-btn" href={data.hero.ctaUrl || '#menu'}>{data.hero.ctaText || '查看菜單'}</a></div></ThemedSection>;
}
