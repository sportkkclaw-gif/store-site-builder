import type { SiteData } from '@/types/site';
import type { TemplateSkin } from '@/lib/templateSkinEngine';

export function ThemedNav({ data, skin }: { data: SiteData; skin: TemplateSkin }) {
  return <header className="skin-nav" data-skin-component="nav" data-skin-family={skin.family}><b>{data.store.name}</b><nav><span>品牌故事</span><span>招牌商品</span><span>菜單</span><span>門市</span></nav><small>{data.store.tagline}</small></header>;
}
