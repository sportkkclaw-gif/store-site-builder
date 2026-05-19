import type { SiteData } from '@/types/site';

const hasText = (value?: string) => Boolean(value && value.trim().length > 0);

export function getHeroFallbackCta(data: SiteData) {
  const hasMap = hasText(data.links.googleMap) || hasText(data.store.address);

  if (hasMap) {
    return {
      label: '查看地圖',
      href: data.links.googleMap || '#contact',
    };
  }

  const hasMenuItems = data.menu.categories.some(category => category.items.length > 0);

  if (hasMenuItems) {
    return {
      label: '查看菜單',
      href: '#menu',
    };
  }

  return {
    label: '了解店家',
    href: '#about',
  };
}
