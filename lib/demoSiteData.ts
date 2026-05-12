import type { IndustryType, SiteData } from '@/types/site';
import { createDefaultSiteData } from './defaultSiteData';
import { getTemplateById } from './templateCatalog';
import { applyTemplatePresetSync } from './applyTemplatePreset';

export type DemoKind = 'drink' | 'restaurant' | 'cafe';

type DemoConfig = {
  industry: IndustryType;
  templateId: string;
  storeName: string;
  tagline: string;
  description: string;
  phone: string;
  address: string;
  line: string;
  googleMap: string;
  heroTitle: string;
  heroSubtitle: string;
  categories: { name: string; items: { name: string; description: string; price: number; featured?: boolean }[] }[];
};

const configs: Record<DemoKind, DemoConfig> = {
  drink: {
    industry: 'drink-shop', templateId: 'drink-matcha-hiyori', storeName: '日沐茶飲', tagline: '每天一杯，日常更美好',
    description: '嚴選好茶與新鮮食材，手作現調，為你的日常帶來一點清爽與溫度。', phone: '02-1234-5678', address: '台北市大安區和平東路一段 100 號', line: 'https://line.me/R/ti/p/@rimu-tea', googleMap: 'https://maps.google.com/',
    heroTitle: '每天一杯，日常更美好', heroSubtitle: '嚴選好茶、奶茶與水果茶，現點現做，讓你的日常多一點清爽。',
    categories: [
      { name: '茶飲', items: [{ name: '日沐紅茶', description: '清爽回甘的招牌紅茶', price: 45, featured: true }, { name: '翡翠檸檬青', description: '檸檬香氣與青茶茶韻', price: 60, featured: true }] },
      { name: '奶茶', items: [{ name: '珍珠奶茶', description: '香濃奶茶搭配 Q 彈珍珠', price: 60, featured: true }, { name: '黑糖珍珠鮮奶', description: '黑糖香氣與鮮奶融合', price: 75 }] },
      { name: '水果茶', items: [{ name: '百香雙響', description: '百香果搭配珍珠與椰果', price: 65 }, { name: '白桃氣泡茶', description: '白桃果香與清爽氣泡感', price: 75 }] },
    ],
  },
  restaurant: {
    industry: 'restaurant', templateId: 'restaurant-rice-kitchen', storeName: '暖巷食堂', tagline: '一碗熱飯，一份安心',
    description: '巷弄裡的家常食堂，提供主餐、套餐、小菜與飲品，適合午餐、晚餐與外帶。', phone: '02-2233-8899', address: '台北市中山區暖巷路 18 號', line: 'https://line.me/R/ti/p/@warm-kitchen', googleMap: 'https://maps.google.com/',
    heroTitle: '巷口的暖心家常飯', heroSubtitle: '每日現煮主餐、套餐與小菜，讓忙碌的一天也能好好吃飯。',
    categories: [
      { name: '主餐', items: [{ name: '炙燒雞腿飯', description: '外酥內嫩，附三樣小菜', price: 160, featured: true }, { name: '慢燉牛腩飯', description: '濃郁醬汁與軟嫩牛腩', price: 190, featured: true }] },
      { name: '套餐', items: [{ name: '雙人分享套餐', description: '兩份主餐、兩份飲品與招牌小菜', price: 520 }, { name: '商業午餐', description: '主餐、湯品與飲品', price: 220 }] },
      { name: '小菜與飲品', items: [{ name: '胡麻時蔬', description: '清爽胡麻醬拌季節蔬菜', price: 70 }, { name: '冷泡茶', description: '低糖清香冷泡茶', price: 50 }] },
    ],
  },
  cafe: {
    industry: 'cafe', templateId: 'cafe-daily-corner', storeName: '日常一隅', tagline: '把日常留一個角落給咖啡',
    description: '安靜舒適的社區咖啡廳，提供咖啡、甜點與早午餐，是工作與放鬆的日常角落。', phone: '02-2766-1010', address: '台北市松山區日常街 9 號', line: 'https://line.me/R/ti/p/@daily-corner', googleMap: 'https://maps.google.com/',
    heroTitle: '一杯咖啡，留住日常的光', heroSubtitle: '手沖咖啡、奶油甜點與輕食早午餐，陪你慢慢完成今天。',
    categories: [
      { name: '咖啡', items: [{ name: '日常拿鐵', description: '香濃義式與滑順鮮奶', price: 130, featured: true }, { name: '單品手沖', description: '依當季豆單供應', price: 180, featured: true }] },
      { name: '甜點', items: [{ name: '焦糖布丁', description: '滑順蛋香與焦糖苦甜', price: 120 }, { name: '檸檬塔', description: '清爽酸甜的經典甜點', price: 150 }] },
      { name: '早午餐', items: [{ name: '酪梨吐司', description: '酪梨、蛋與酸種麵包', price: 220 }, { name: '奶油菇菇可頌', description: '酥香可頌與奶油蘑菇', price: 210 }] },
    ],
  },
};

export function createDemoSiteData(kind: DemoKind): SiteData {
  const cfg = configs[kind];
  const base = createDefaultSiteData();
  const withContent: SiteData = {
    ...base,
    id: `demo-${kind}-${Date.now()}`,
    industry: cfg.industry,
    store: { ...base.store, name: cfg.storeName, tagline: cfg.tagline, description: cfg.description, phone: cfg.phone, address: cfg.address },
    hero: { ...base.hero, title: cfg.heroTitle, subtitle: cfg.heroSubtitle, ctaText: '立即聯絡', ctaUrl: cfg.line },
    links: { ...base.links, line: cfg.line, googleMap: cfg.googleMap },
    seo: { ...base.seo, title: `${cfg.storeName}｜${cfg.tagline}`, description: cfg.description, slug: cfg.storeName.toLowerCase().replace(/\s+/g, '-') },
    menu: { categories: cfg.categories.map((cat, catIndex) => ({ id: `demo-${kind}-cat-${catIndex}`, name: cat.name, items: cat.items.map((item, itemIndex) => ({ id: `demo-${kind}-${catIndex}-${itemIndex}`, name: item.name, description: item.description, price: item.price, featured: Boolean(item.featured) })) })) },
  };
  const template = getTemplateById(cfg.templateId);
  return template ? applyTemplatePresetSync(withContent, template) : withContent;
}
