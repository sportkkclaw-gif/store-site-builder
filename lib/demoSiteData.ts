import type { SiteData } from '@/types/site';
import { createDefaultSiteData } from '@/lib/defaultSiteData';
import { applyTemplatePresetSync } from '@/lib/applyTemplatePreset';
import { getTemplateById } from '@/lib/templateCatalog';

export type DemoSiteKey = 'drink' | 'restaurant' | 'cafe';

function withTemplate(data: SiteData, templateId: string): SiteData {
  const template = getTemplateById(templateId);
  return template ? applyTemplatePresetSync(data, template) : data;
}

export function createDemoSiteData(kind: DemoSiteKey): SiteData {
  const base = createDefaultSiteData();
  if (kind === 'restaurant') {
    return withTemplate({
      ...base,
      id: 'demo-warm-alley-diner',
      industry: 'restaurant',
      store: { ...base.store, name: '暖巷食堂', tagline: '巷口的一碗熱飯，溫暖每個日常', description: '供應手作主餐、暖心套餐與當季小菜，適合家庭聚餐、外帶便當與附近上班族午餐。', phone: '02-2345-6789', email: 'hello@warmalley.tw', address: '台北市中山區暖巷 18 號', businessHours: '週一至週日 11:00 - 21:00' },
      hero: { ...base.hero, title: '巷口的一碗熱飯', subtitle: '主餐、套餐、小菜與外帶便當，讓你每天都吃得安心。', ctaText: '立即訂位', ctaUrl: 'https://forms.gle/' },
      links: { line: 'https://line.me/', googleMap: 'https://maps.google.com/', reservation: 'https://forms.gle/', orderForm: 'https://forms.gle/' },
      seo: { ...base.seo, title: '暖巷食堂｜巷口的一碗熱飯', description: '暖巷食堂提供手作主餐、套餐、小菜與外帶訂位服務。', slug: 'warm-alley-diner' },
      menu: { categories: [
        { id: 'main', name: '主餐', items: [{ id: 'r1', name: '醬燒雞腿飯', description: '外酥內嫩雞腿與特製醬汁', price: 160, featured: true }, { id: 'r2', name: '炙烤鮭魚定食', description: '附味噌湯與季節小菜', price: 220, featured: true }] },
        { id: 'combo', name: '套餐', items: [{ id: 'r3', name: '暖巷雙人套餐', description: '兩份主餐、兩杯飲品與分享小菜', price: 520, featured: true }, { id: 'r4', name: '外帶便當', description: '每日主廚配菜與熱湯', price: 130, featured: false }] },
        { id: 'side', name: '小菜與飲品', items: [{ id: 'r5', name: '胡麻時蔬', description: '新鮮青菜佐胡麻醬', price: 80, featured: false }, { id: 'r6', name: '桂花烏龍', description: '清香解膩的冷泡茶', price: 70, featured: false }] },
      ] },
      faq: [{ question: '可以訂位嗎？', answer: '可以，請透過 LINE 或訂位表單預約。' }, { question: '可以外帶嗎？', answer: '可以，主餐與便當皆可外帶。' }],
    }, 'restaurant-rice-kitchen');
  }
  if (kind === 'cafe') {
    return withTemplate({
      ...base,
      id: 'demo-daily-corner-cafe',
      industry: 'cafe',
      store: { ...base.store, name: '日常一隅', tagline: '把一杯咖啡，留給慢下來的你', description: '社區咖啡廳，供應手沖、甜點與早午餐，也提供安靜閱讀與小型聚會空間。', phone: '02-3456-7890', email: 'hello@dailycorner.cafe', address: '台北市松山區日常路 6 號', businessHours: '週二至週日 09:00 - 19:00' },
      hero: { ...base.hero, title: '把一杯咖啡留給日常', subtitle: '手沖咖啡、甜點、早午餐與一個慢下來的角落。', ctaText: '查看地圖', ctaUrl: 'https://maps.google.com/' },
      links: { line: 'https://line.me/', googleMap: 'https://maps.google.com/', instagram: 'https://instagram.com/' },
      seo: { ...base.seo, title: '日常一隅｜社區咖啡與甜點', description: '日常一隅提供手沖咖啡、甜點、早午餐與舒適空間。', slug: 'daily-corner-cafe' },
      menu: { categories: [
        { id: 'coffee', name: '咖啡', items: [{ id: 'c1', name: '衣索比亞手沖', description: '柑橘與花香尾韻', price: 150, featured: true }, { id: 'c2', name: '拿鐵', description: '濃縮與鮮奶的經典比例', price: 130, featured: true }] },
        { id: 'dessert', name: '甜點', items: [{ id: 'c3', name: '焦糖布丁', description: '每日限量手作', price: 120, featured: true }, { id: 'c4', name: '檸檬塔', description: '清爽酸甜塔皮酥香', price: 140, featured: false }] },
        { id: 'brunch', name: '早午餐', items: [{ id: 'c5', name: '酪梨吐司', description: '搭配水波蛋與沙拉', price: 220, featured: false }] },
      ] },
      faq: [{ question: '有插座嗎？', answer: '部分座位提供插座，歡迎現場詢問。' }, { question: '可以包場嗎？', answer: '可私訊 LINE 洽詢小型活動。' }],
    }, 'cafe-daily-corner');
  }
  return withTemplate({
    ...base,
    id: 'demo-rimu-tea-v030',
    store: { ...base.store, name: '日沐茶飲' },
    links: { ...base.links, line: 'https://line.me/', googleMap: 'https://maps.google.com/' },
  }, 'drink-matcha-hiyori');
}

export const demoSiteDataOptions = [
  { key: 'drink' as const, label: '套用飲料店範例', description: '日沐茶飲｜抹茶日和｜招牌飲品、奶茶、果茶' },
  { key: 'restaurant' as const, label: '套用餐飲店範例', description: '暖巷食堂｜米香食堂｜主餐、套餐、小菜、訂位外帶' },
  { key: 'cafe' as const, label: '套用咖啡廳範例', description: '日常一隅｜日常一隅｜咖啡、甜點、早午餐、地圖' },
];
