import type { IndustryType } from '@/types/site';
import { getTemplateById } from './templateCatalog';

export type OnboardingIndustry = IndustryType;
export type BrandStyle = '清新日系' | '高級質感' | '活潑可愛' | '溫暖手作' | '極簡精品' | '促銷活動感';

const recommendationMap: Record<string, string[]> = {
  'drink-shop|清新日系': ['drink-matcha-hiyori', 'drink-lime-morning', 'drink-tea-mist-ridge'],
  'drink-shop|活潑可愛': ['drink-fruit-paradise', 'drink-iced-party', 'drink-white-peach-sparkle'],
  'drink-shop|促銷活動感': ['drink-boba-neon', 'drink-iced-party'],
  'restaurant|高級質感': ['restaurant-golden-banquet', 'restaurant-kitchen-overture'],
  'restaurant|溫暖手作': ['restaurant-rice-kitchen', 'restaurant-hotpot-home', 'restaurant-sunday-shokudo'],
  'cafe|極簡精品': ['cafe-white-dripper', 'cafe-nordic-morning', 'cafe-urban-monochrome'],
  'cafe|溫暖手作': ['cafe-cream-library', 'cafe-daily-corner', 'cafe-caramel-afternoon'],
  'snack-shop|溫暖手作': ['restaurant-rice-kitchen', 'restaurant-sunday-shokudo', 'restaurant-hotpot-home'],
  'other|清新日系': ['drink-matcha-hiyori', 'cafe-white-dripper', 'cafe-daily-corner'],
};

const fallbackByIndustry: Record<OnboardingIndustry, string[]> = {
  'drink-shop': ['drink-matcha-hiyori', 'drink-lime-morning', 'drink-tea-mist-ridge'],
  restaurant: ['restaurant-golden-banquet', 'restaurant-rice-kitchen', 'restaurant-kitchen-overture'],
  cafe: ['cafe-white-dripper', 'cafe-daily-corner', 'cafe-nordic-morning'],
  'snack-shop': ['restaurant-rice-kitchen', 'restaurant-sunday-shokudo', 'restaurant-hotpot-home'],
  other: ['drink-matcha-hiyori', 'restaurant-rice-kitchen', 'cafe-white-dripper'],
};

export function getRecommendedTemplateIds(industry: OnboardingIndustry, style: BrandStyle): string[] {
  return recommendationMap[`${industry}|${style}`] || fallbackByIndustry[industry] || fallbackByIndustry.other;
}

export function getPrimaryRecommendedTemplate(industry: OnboardingIndustry, style: BrandStyle) {
  const ids = getRecommendedTemplateIds(industry, style);
  return ids.map(id => getTemplateById(id)).find(Boolean);
}

export function industryLabelToType(label: string): OnboardingIndustry {
  if (label === '餐飲店') return 'restaurant';
  if (label === '咖啡廳') return 'cafe';
  if (label === '小吃店') return 'snack-shop';
  if (label === '其他') return 'other';
  return 'drink-shop';
}

export function industryTypeToLabel(industry: OnboardingIndustry): string {
  if (industry === 'restaurant') return '餐飲店';
  if (industry === 'cafe') return '咖啡廳';
  if (industry === 'snack-shop') return '小吃店';
  if (industry === 'other') return '其他';
  return '飲料店';
}
