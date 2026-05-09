import type { SiteData } from '@/types/site';
import type { TemplateSkin } from '@/lib/templateSkinEngine';
import { ThemedSection } from './ThemedSection';

export function ThemedMenuList({ data, skin }: { data: SiteData; skin: TemplateSkin }) {
  if (!data.modules.menu) return null;
  return <ThemedSection skin={skin} eyebrow="MENU" title="菜單總覽" alt><div className="skin-menu-list" data-skin-component="menu-list" data-skin-family={skin.family}>{data.menu.categories.map(category => <article key={category.id} className="skin-menu-category"><h3>{category.name}</h3>{category.description && <p className="muted">{category.description}</p>}<div className="skin-menu-rows">{category.items.map(item => <div key={item.id} className="skin-menu-row"><span><b>{item.name}</b><small>{item.description}</small></span><strong>${item.price}</strong></div>)}</div></article>)}</div></ThemedSection>;
}
