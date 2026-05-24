import type { SiteData } from '@/types/site';
import type { TemplateSkin } from '@/lib/templateSkinEngine';

const navItems = [
  { key: 'brandStory', label: '品牌故事', href: '#brand-story' },
  { key: 'featuredProducts', label: '招牌商品', href: '#featured-products' },
  { key: 'menu', label: '菜單', href: '#menu' },
  { key: 'storeInfo', label: '門市', href: '#store-info' },
] as const;

export function ThemedNav({ data, skin }: { data: SiteData; skin: TemplateSkin }) {
  const visibleItems = navItems.filter(item => data.modules[item.key]);
  return <header className="skin-nav" data-skin-component="nav" data-skin-family={skin.family}>
    <b>{data.store.name}</b>
    <nav aria-label="店名片區塊導覽">
      {visibleItems.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}
    </nav>
    <small>{data.store.tagline}</small>
  </header>;
}
