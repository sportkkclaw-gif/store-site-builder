import type { IndustryType } from '@/types/site';

export type OnboardingIndustry = '飲料店' | '餐飲店' | '咖啡廳' | '小吃店' | '其他';
export type OnboardingStyle = '清新日系' | '高級質感' | '活潑可愛' | '溫暖手作' | '極簡精品' | '促銷活動感';

export const industryToSiteIndustry: Record<OnboardingIndustry, IndustryType> = {
  飲料店: 'drink-shop',
  餐飲店: 'restaurant',
  咖啡廳: 'cafe',
  小吃店: 'snack-shop',
  其他: 'other',
};

export const recommendationRules: Record<string, string[]> = {
  '飲料店|清新日系': ['drink-matcha-hiyori', 'drink-lime-morning', 'drink-tea-mist-ridge'],
  '飲料店|活潑可愛': ['drink-fruit-paradise', 'drink-iced-party', 'drink-white-peach-sparkle'],
  '飲料店|促銷活動感': ['drink-boba-neon', 'drink-iced-party'],
  '飲料店|高級質感': ['drink-tea-mist-ridge', 'drink-brown-sugar-amber'],
  '餐飲店|高級質感': ['restaurant-golden-banquet', 'restaurant-kitchen-overture'],
  '餐飲店|溫暖手作': ['restaurant-rice-kitchen', 'restaurant-hotpot-home', 'restaurant-sunday-shokudo'],
  '餐飲店|促銷活動感': ['restaurant-fast-enjoy', 'restaurant-spicy-market'],
  '咖啡廳|極簡精品': ['cafe-white-dripper', 'cafe-nordic-morning', 'cafe-urban-monochrome'],
  '咖啡廳|溫暖手作': ['cafe-cream-library', 'cafe-daily-corner', 'cafe-caramel-afternoon'],
  '咖啡廳|高級質感': ['cafe-midnight-roast', 'cafe-urban-monochrome'],
};

const fallbackByIndustry: Record<OnboardingIndustry, string[]> = {
  飲料店: ['drink-matcha-hiyori', 'drink-fruit-paradise', 'drink-boba-neon'],
  餐飲店: ['restaurant-golden-banquet', 'restaurant-rice-kitchen', 'restaurant-hotpot-home'],
  咖啡廳: ['cafe-white-dripper', 'cafe-daily-corner', 'cafe-midnight-roast'],
  小吃店: ['restaurant-fast-enjoy', 'restaurant-spicy-market', 'restaurant-rice-kitchen'],
  其他: ['drink-matcha-hiyori', 'restaurant-golden-banquet', 'cafe-white-dripper'],
};

export function getOnboardingRecommendations(industry: OnboardingIndustry, style: OnboardingStyle): string[] {
  return recommendationRules[`${industry}|${style}`] || fallbackByIndustry[industry];
}

export function getPrimaryRecommendedTemplate(industry: OnboardingIndustry, style: OnboardingStyle): string {
  return getOnboardingRecommendations(industry, style)[0];
}
