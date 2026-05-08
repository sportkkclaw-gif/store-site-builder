import type { IndustryType } from '@/types/site';
import type { TemplateGalleryItem, TemplateIndustry, TemplateSort } from '@/types/template';
import { enrichAllTemplates } from './enrichTemplate';

export const templateCatalog = [
  {
    "id": "drink-matcha-hiyori",
    "industry": "drink-shop",
    "slug": "drink-matcha-hiyori",
    "name": "抹茶日和",
    "shortDescription": "米白與抹茶綠打造柔和日系茶飲官網，適合清爽品牌形象。",
    "longDescription": "以大量留白、柔和綠色與茶飲情境建立自然舒適的品牌感，適合手搖飲、茶飲與甜點店快速建立清新官方網站。",
    "suitableFor": [
      "飲料店",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "抹茶",
      "日系",
      "清爽",
      "自然"
    ],
    "badges": [
      "推薦",
      "清新茶飲"
    ],
    "palette": [
      "#EAF5DF",
      "#6DA36F",
      "#F8F1DF",
      "#C9A86A"
    ],
    "aiArtworkKey": "drink-matcha-hiyori",
    "prompt": "抹茶日和正式模板主視覺，呈現米白與抹茶綠打造柔和日系茶飲官網，適合清爽品牌形象，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": true,
    "popularityRank": 1,
    "newbieFriendly": true,
    "baseTemplate": "fresh-japanese",
    "recommendationReason": "Jason 推薦：視覺辨識度高，適合展示給店家。",
    "artworkSrc": "/template-gallery-ai/drink-shop/drink-matcha-hiyori.png"
  },
  {
    "id": "drink-boba-neon",
    "industry": "drink-shop",
    "slug": "drink-boba-neon",
    "name": "珍珠霓光",
    "shortDescription": "霓虹色彩與夜間潮流感，適合年輕客群與社群導流品牌。",
    "longDescription": "以高對比霓虹、強烈主視覺與活動感版面打造吸睛官網，適合新品曝光、外送導流與年輕化手搖飲品牌。",
    "suitableFor": [
      "飲料店",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "霓虹",
      "潮流",
      "高對比",
      "社群"
    ],
    "badges": [
      "推薦",
      "活動導流"
    ],
    "palette": [
      "#12051F",
      "#7C3AED",
      "#06B6D4",
      "#F43F8C"
    ],
    "aiArtworkKey": "drink-boba-neon",
    "prompt": "珍珠霓光正式模板主視覺，呈現霓虹色彩與夜間潮流感，適合年輕客群與社群導流品牌，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": true,
    "popularityRank": 2,
    "newbieFriendly": false,
    "baseTemplate": "playful-colorful",
    "recommendationReason": "Jason 推薦：視覺辨識度高，適合展示給店家。",
    "artworkSrc": "/template-gallery-ai/drink-shop/drink-boba-neon.png"
  },
  {
    "id": "drink-fruit-paradise",
    "industry": "drink-shop",
    "slug": "drink-fruit-paradise",
    "name": "果香樂園",
    "shortDescription": "鮮果色彩與活潑構圖，適合果茶、季節飲品與親子客群。",
    "longDescription": "以明亮水果色、圓潤卡片與輕快節奏呈現清爽感，適合水果茶、冰沙、季節限定與社群活動頁。",
    "suitableFor": [
      "飲料店",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "水果",
      "繽紛",
      "清爽",
      "活潑"
    ],
    "badges": [
      "新品曝光",
      "水果茶"
    ],
    "palette": [
      "#FFF7AD",
      "#FF7A59",
      "#22C55E",
      "#F472B6"
    ],
    "aiArtworkKey": "drink-fruit-paradise",
    "prompt": "果香樂園正式模板主視覺，呈現鮮果色彩與活潑構圖，適合果茶、季節飲品與親子客群，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": false,
    "popularityRank": 3,
    "newbieFriendly": false,
    "baseTemplate": "playful-colorful",
    "recommendationReason": "依據 飲料店 產業與 水果, 高質感 風格推薦。",
    "artworkSrc": "/template-gallery-ai/drink-shop/drink-fruit-paradise.png"
  },
  {
    "id": "drink-brown-sugar-amber",
    "industry": "drink-shop",
    "slug": "drink-brown-sugar-amber",
    "name": "黑糖琥珀",
    "shortDescription": "焦糖琥珀色與濃郁奶茶感，適合黑糖與甜品系飲品品牌。",
    "longDescription": "以深棕、焦糖與奶霜色建立濃厚甜點氛圍，適合黑糖珍奶、厚奶飲品與主打香氣口感的店家。",
    "suitableFor": [
      "飲料店",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "黑糖",
      "琥珀",
      "濃郁",
      "溫暖"
    ],
    "badges": [
      "甜品飲品",
      "質感款"
    ],
    "palette": [
      "#2B1608",
      "#B76E28",
      "#F4D5A4",
      "#FFF7ED"
    ],
    "aiArtworkKey": "drink-brown-sugar-amber",
    "prompt": "黑糖琥珀正式模板主視覺，呈現焦糖琥珀色與濃郁奶茶感，適合黑糖與甜品系飲品品牌，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": false,
    "popularityRank": 4,
    "newbieFriendly": false,
    "baseTemplate": "premium-minimal",
    "recommendationReason": "依據 飲料店 產業與 黑糖, 高質感 風格推薦。",
    "artworkSrc": "/template-gallery-ai/drink-shop/drink-brown-sugar-amber.png"
  },
  {
    "id": "drink-white-peach-sparkle",
    "industry": "drink-shop",
    "slug": "drink-white-peach-sparkle",
    "name": "白桃氣泡",
    "shortDescription": "白桃粉與氣泡感打造輕盈頁面，適合季節限定與女性客群。",
    "longDescription": "以柔粉、白色與微氣泡視覺營造清甜印象，適合白桃、氣泡飲、果香茶與期間限定新品宣傳。",
    "suitableFor": [
      "飲料店",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "白桃",
      "氣泡",
      "柔粉",
      "輕盈"
    ],
    "badges": [
      "季節限定",
      "清甜款"
    ],
    "palette": [
      "#FFF1F7",
      "#FDB7C8",
      "#FFE4C4",
      "#FFFFFF"
    ],
    "aiArtworkKey": "drink-white-peach-sparkle",
    "prompt": "白桃氣泡正式模板主視覺，呈現白桃粉與氣泡感打造輕盈頁面，適合季節限定與女性客群，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": false,
    "popularityRank": 5,
    "newbieFriendly": true,
    "baseTemplate": "fresh-japanese",
    "recommendationReason": "依據 飲料店 產業與 蜜桃, 高質感 風格推薦。",
    "artworkSrc": "/template-gallery-ai/drink-shop/drink-white-peach-sparkle.png"
  },
  {
    "id": "drink-lime-morning",
    "industry": "drink-shop",
    "slug": "drink-lime-morning",
    "name": "青檸清晨",
    "shortDescription": "青檸綠與留白設計呈現健康清爽感，適合低糖茶飲品牌。",
    "longDescription": "以檸檬綠、薄荷色與乾淨版面建立清晨般的清新形象，適合健康茶、低糖飲品與外帶飲料店。",
    "suitableFor": [
      "飲料店",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "青檸",
      "健康",
      "極簡",
      "清晨"
    ],
    "badges": [
      "新手友善",
      "低糖茶飲"
    ],
    "palette": [
      "#F8FFFB",
      "#84CC16",
      "#B7F5D8",
      "#94A3B8"
    ],
    "aiArtworkKey": "drink-lime-morning",
    "prompt": "青檸清晨正式模板主視覺，呈現青檸綠與留白設計呈現健康清爽感，適合低糖茶飲品牌，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": false,
    "popularityRank": 6,
    "newbieFriendly": true,
    "baseTemplate": "fresh-japanese",
    "recommendationReason": "依據 飲料店 產業與 清爽, 高質感 風格推薦。",
    "artworkSrc": "/template-gallery-ai/drink-shop/drink-lime-morning.png"
  },
  {
    "id": "drink-tea-mist-ridge",
    "industry": "drink-shop",
    "slug": "drink-tea-mist-ridge",
    "name": "茶霧山嵐",
    "shortDescription": "山霧、茶園與精品茶感，適合高級茶飲與品牌故事型官網。",
    "longDescription": "以深綠、米色與高山茶意象呈現沉穩高級感，強調茶葉品質、品牌故事與精緻飲品展示。",
    "suitableFor": [
      "飲料店",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "高山茶",
      "精品",
      "沉穩",
      "東方"
    ],
    "badges": [
      "推薦",
      "高級茶飲"
    ],
    "palette": [
      "#EEF5EF",
      "#3F6F58",
      "#8A8F80",
      "#D6B76A"
    ],
    "aiArtworkKey": "drink-tea-mist-ridge",
    "prompt": "茶霧山嵐正式模板主視覺，呈現山霧、茶園與精品茶感，適合高級茶飲與品牌故事型官網，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": true,
    "popularityRank": 7,
    "newbieFriendly": false,
    "baseTemplate": "premium-minimal",
    "recommendationReason": "Jason 推薦：視覺辨識度高，適合展示給店家。",
    "artworkSrc": "/template-gallery-ai/drink-shop/drink-tea-mist-ridge.png"
  },
  {
    "id": "drink-iced-party",
    "industry": "drink-shop",
    "slug": "drink-iced-party",
    "name": "星冰派對",
    "shortDescription": "冰飲派對感與強烈活動色彩，適合夏季促銷與聯名主題。",
    "longDescription": "以鮮明撞色、冰塊光感與大面積主視覺提升活動張力，適合新品上市、節慶檔期與社群導流。",
    "suitableFor": [
      "飲料店",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "派對",
      "冰飲",
      "促銷",
      "高能量"
    ],
    "badges": [
      "活動頁",
      "年輕客群"
    ],
    "palette": [
      "#ECFEFF",
      "#06B6D4",
      "#F97316",
      "#FACC15"
    ],
    "aiArtworkKey": "drink-iced-party",
    "prompt": "星冰派對正式模板主視覺，呈現冰飲派對感與強烈活動色彩，適合夏季促銷與聯名主題，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": false,
    "popularityRank": 8,
    "newbieFriendly": false,
    "baseTemplate": "playful-colorful",
    "recommendationReason": "依據 飲料店 產業與 促銷, 高質感 風格推薦。",
    "artworkSrc": "/template-gallery-ai/drink-shop/drink-iced-party.png"
  },
  {
    "id": "drink-afternoon-cream",
    "industry": "drink-shop",
    "slug": "drink-afternoon-cream",
    "name": "午後奶蓋",
    "shortDescription": "奶油色與柔和光線營造午後感，適合奶蓋與甜感飲品品牌。",
    "longDescription": "以溫柔奶油色、圓角卡片與柔光照片建立舒適氛圍，適合奶蓋茶、鮮奶系列與甜點飲品。",
    "suitableFor": [
      "飲料店",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "奶蓋",
      "奶油色",
      "午後",
      "柔和"
    ],
    "badges": [
      "新手友善",
      "溫柔品牌"
    ],
    "palette": [
      "#FFF7ED",
      "#D6A77A",
      "#B6C99B",
      "#FDBA74"
    ],
    "aiArtworkKey": "drink-afternoon-cream",
    "prompt": "午後奶蓋正式模板主視覺，呈現奶油色與柔和光線營造午後感，適合奶蓋與甜感飲品品牌，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": false,
    "popularityRank": 9,
    "newbieFriendly": true,
    "baseTemplate": "fresh-japanese",
    "recommendationReason": "依據 飲料店 產業與 奶蓋, 溫暖 風格推薦。",
    "artworkSrc": "/template-gallery-ai/drink-shop/drink-afternoon-cream.png"
  },
  {
    "id": "drink-lab-brew",
    "industry": "drink-shop",
    "slug": "drink-lab-brew",
    "name": "飲研實驗室",
    "shortDescription": "實驗室風格與冷色科技感，適合創新飲品與特色調飲品牌。",
    "longDescription": "以深色背景、冷光點綴與俐落版面塑造研發感，適合創意茶飲、特調飲品與主打差異化的店家。",
    "suitableFor": [
      "飲料店",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "實驗",
      "科技",
      "創新",
      "冷色"
    ],
    "badges": [
      "概念店",
      "特色調飲"
    ],
    "palette": [
      "#F8FAFC",
      "#14B8A6",
      "#99F6E4",
      "#0F172A"
    ],
    "aiArtworkKey": "drink-lab-brew",
    "prompt": "飲研實驗室正式模板主視覺，呈現實驗室風格與冷色科技感，適合創新飲品與特色調飲品牌，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": false,
    "popularityRank": 10,
    "newbieFriendly": false,
    "baseTemplate": "premium-minimal",
    "recommendationReason": "依據 飲料店 產業與 創新, 極簡 風格推薦。",
    "artworkSrc": "/template-gallery-ai/drink-shop/drink-lab-brew.png"
  },
  {
    "id": "restaurant-charcoal-essence",
    "industry": "restaurant",
    "slug": "restaurant-charcoal-essence",
    "name": "炭火本味",
    "shortDescription": "炭火黑與暖光質感，適合燒烤、居酒屋與職人餐飲。",
    "longDescription": "以深色背景、炭火光影與大器排版呈現熟成風味，適合燒肉、串燒、炭烤與晚餐預約型店家。",
    "suitableFor": [
      "餐飲店",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "炭火",
      "職人",
      "深色",
      "晚餐"
    ],
    "badges": [
      "質感餐飲",
      "預約導向"
    ],
    "palette": [
      "#11100E",
      "#EA580C",
      "#7C2D12",
      "#FDE68A"
    ],
    "aiArtworkKey": "restaurant-charcoal-essence",
    "prompt": "炭火本味正式模板主視覺，呈現炭火黑與暖光質感，適合燒烤、居酒屋與職人餐飲，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": false,
    "popularityRank": 11,
    "newbieFriendly": false,
    "baseTemplate": "premium-minimal",
    "recommendationReason": "依據 餐飲店 產業與 炭火, 高質感 風格推薦。",
    "artworkSrc": "/template-gallery-ai/restaurant/restaurant-charcoal-essence.png"
  },
  {
    "id": "restaurant-rice-kitchen",
    "industry": "restaurant",
    "slug": "restaurant-rice-kitchen",
    "name": "米香食堂",
    "shortDescription": "米色日常感與親切版面，適合便當、家常料理與小食堂。",
    "longDescription": "以米白、木色與溫暖留白營造安心感，適合日式食堂、便當店、家庭料理與社區型餐飲。",
    "suitableFor": [
      "餐飲店",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "米香",
      "家常",
      "溫暖",
      "日常"
    ],
    "badges": [
      "親民食堂",
      "新手友善"
    ],
    "palette": [
      "#FFF8EA",
      "#D6C2A0",
      "#B98B6A",
      "#FFFFFF"
    ],
    "aiArtworkKey": "restaurant-rice-kitchen",
    "prompt": "米香食堂正式模板主視覺，呈現米色日常感與親切版面，適合便當、家常料理與小食堂，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": false,
    "popularityRank": 12,
    "newbieFriendly": true,
    "baseTemplate": "fresh-japanese",
    "recommendationReason": "依據 餐飲店 產業與 家常, 主廚故事 風格推薦。",
    "artworkSrc": "/template-gallery-ai/restaurant/restaurant-rice-kitchen.png"
  },
  {
    "id": "restaurant-golden-banquet",
    "industry": "restaurant",
    "slug": "restaurant-golden-banquet",
    "name": "金色晚宴",
    "shortDescription": "金色燈光與高級宴席感，適合聚餐、私廚與精緻餐廳。",
    "longDescription": "以金色細節、深色背景與大圖主視覺建立儀式感，適合宴會餐廳、私廚套餐與高客單價餐飲品牌。",
    "suitableFor": [
      "餐飲店",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "金色",
      "宴席",
      "高級",
      "儀式感"
    ],
    "badges": [
      "推薦",
      "高級餐廳"
    ],
    "palette": [
      "#0B0B0F",
      "#7F1D1D",
      "#D4AF37",
      "#FFF7ED"
    ],
    "aiArtworkKey": "restaurant-golden-banquet",
    "prompt": "金色晚宴正式模板主視覺，呈現金色燈光與高級宴席感，適合聚餐、私廚與精緻餐廳，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": true,
    "popularityRank": 13,
    "newbieFriendly": false,
    "baseTemplate": "premium-minimal",
    "recommendationReason": "Jason 推薦：視覺辨識度高，適合展示給店家。",
    "artworkSrc": "/template-gallery-ai/restaurant/restaurant-golden-banquet.png"
  },
  {
    "id": "restaurant-corner-meal",
    "industry": "restaurant",
    "slug": "restaurant-corner-meal",
    "name": "街角食光",
    "shortDescription": "街角小店氛圍與明亮照片區，適合日常快餐與社區餐館。",
    "longDescription": "以親切色彩、清楚菜單與快速行動按鈕建立好點餐的網站，適合麵飯小館、早午餐與街邊餐飲。",
    "suitableFor": [
      "餐飲店",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "街角",
      "親切",
      "日常",
      "好點餐"
    ],
    "badges": [
      "社區店",
      "外帶友善"
    ],
    "palette": [
      "#F8FAFC",
      "#D9C8B4",
      "#94A3B8",
      "#FFFFFF"
    ],
    "aiArtworkKey": "restaurant-corner-meal",
    "prompt": "街角食光正式模板主視覺，呈現街角小店氛圍與明亮照片區，適合日常快餐與社區餐館，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": false,
    "popularityRank": 14,
    "newbieFriendly": true,
    "baseTemplate": "fresh-japanese",
    "recommendationReason": "依據 餐飲店 產業與 街區 風格推薦。",
    "artworkSrc": "/template-gallery-ai/restaurant/restaurant-corner-meal.png"
  },
  {
    "id": "restaurant-spicy-market",
    "industry": "restaurant",
    "slug": "restaurant-spicy-market",
    "name": "香辣市集",
    "shortDescription": "熱辣市集色彩與活力排版，適合麻辣、串串與夜市風餐飲。",
    "longDescription": "以紅橘色、節奏感卡片與強烈 CTA 呈現熱鬧食慾，適合麻辣鍋、辣味小吃與活動型餐飲品牌。",
    "suitableFor": [
      "餐飲店",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "香辣",
      "市集",
      "熱鬧",
      "紅橘"
    ],
    "badges": [
      "人氣款",
      "活動導流"
    ],
    "palette": [
      "#300B0B",
      "#DC2626",
      "#F97316",
      "#FACC15"
    ],
    "aiArtworkKey": "restaurant-spicy-market",
    "prompt": "香辣市集正式模板主視覺，呈現熱辣市集色彩與活力排版，適合麻辣、串串與夜市風餐飲，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": false,
    "popularityRank": 15,
    "newbieFriendly": false,
    "baseTemplate": "playful-colorful",
    "recommendationReason": "依據 餐飲店 產業與 香辣, 高質感 風格推薦。",
    "artworkSrc": "/template-gallery-ai/restaurant/restaurant-spicy-market.png"
  },
  {
    "id": "restaurant-sunday-shokudo",
    "industry": "restaurant",
    "slug": "restaurant-sunday-shokudo",
    "name": "日曜食堂",
    "shortDescription": "週末食堂感與柔和日系配色，適合家庭聚餐與溫馨餐館。",
    "longDescription": "以自然色、生活照片與舒適排版傳達週末聚餐氣氛，適合親子餐廳、日式定食與鄰里食堂。",
    "suitableFor": [
      "餐飲店",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "日曜",
      "家庭",
      "日系",
      "溫馨"
    ],
    "badges": [
      "家庭聚餐",
      "新手友善"
    ],
    "palette": [
      "#F8F2E8",
      "#8AA885",
      "#2D2A26",
      "#D7B98E"
    ],
    "aiArtworkKey": "restaurant-sunday-shokudo",
    "prompt": "日曜食堂正式模板主視覺，呈現週末食堂感與柔和日系配色，適合家庭聚餐與溫馨餐館，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": false,
    "popularityRank": 16,
    "newbieFriendly": true,
    "baseTemplate": "fresh-japanese",
    "recommendationReason": "依據 餐飲店 產業與 日式, 高質感 風格推薦。",
    "artworkSrc": "/template-gallery-ai/restaurant/restaurant-sunday-shokudo.png"
  },
  {
    "id": "restaurant-kitchen-overture",
    "industry": "restaurant",
    "slug": "restaurant-kitchen-overture",
    "name": "廚房序曲",
    "shortDescription": "開放式廚房與職人細節，適合主廚品牌與套餐型餐廳。",
    "longDescription": "以俐落版面、食材細節與精準留白建立專業感，適合主廚餐廳、私房料理與講究流程的餐飲品牌。",
    "suitableFor": [
      "餐飲店",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "主廚",
      "職人",
      "精準",
      "套餐"
    ],
    "badges": [
      "主廚推薦",
      "專業感"
    ],
    "palette": [
      "#F7EEE4",
      "#8B5E3C",
      "#C8A27A",
      "#1F2937"
    ],
    "aiArtworkKey": "restaurant-kitchen-overture",
    "prompt": "廚房序曲正式模板主視覺，呈現開放式廚房與職人細節，適合主廚品牌與套餐型餐廳，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": false,
    "popularityRank": 17,
    "newbieFriendly": false,
    "baseTemplate": "premium-minimal",
    "recommendationReason": "依據 餐飲店 產業與 主廚故事, 高質感 風格推薦。",
    "artworkSrc": "/template-gallery-ai/restaurant/restaurant-kitchen-overture.png"
  },
  {
    "id": "restaurant-brunch-garden",
    "industry": "restaurant",
    "slug": "restaurant-brunch-garden",
    "name": "早午餐花園",
    "shortDescription": "花園早午餐風格與明亮色調，適合咖啡餐館與輕食品牌。",
    "longDescription": "以自然光、綠意與柔和卡片呈現放鬆氛圍，適合早午餐、沙拉、輕食與週末聚會型餐廳。",
    "suitableFor": [
      "餐飲店",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "早午餐",
      "花園",
      "輕食",
      "明亮"
    ],
    "badges": [
      "輕食餐館",
      "親子友善"
    ],
    "palette": [
      "#F7FFE8",
      "#A7C957",
      "#FFE08A",
      "#FFFFFF"
    ],
    "aiArtworkKey": "restaurant-brunch-garden",
    "prompt": "早午餐花園正式模板主視覺，呈現花園早午餐風格與明亮色調，適合咖啡餐館與輕食品牌，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": true,
    "popularityRank": 18,
    "newbieFriendly": true,
    "baseTemplate": "fresh-japanese",
    "recommendationReason": "Jason 推薦：視覺辨識度高，適合展示給店家。",
    "artworkSrc": "/template-gallery-ai/restaurant/restaurant-brunch-garden.png"
  },
  {
    "id": "restaurant-hotpot-home",
    "industry": "restaurant",
    "slug": "restaurant-hotpot-home",
    "name": "鍋物暖居",
    "shortDescription": "暖色鍋物與圓潤視覺，適合火鍋、湯品與聚會餐廳。",
    "longDescription": "以溫暖紅橘、食材堆疊與大 CTA 營造聚餐感，適合鍋物、湯品、家庭聚會與外帶套餐推廣。",
    "suitableFor": [
      "餐飲店",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "鍋物",
      "暖居",
      "聚餐",
      "熱騰騰"
    ],
    "badges": [
      "聚餐推薦",
      "外帶套餐"
    ],
    "palette": [
      "#FFF1E6",
      "#B45309",
      "#C2410C",
      "#FDE68A"
    ],
    "aiArtworkKey": "restaurant-hotpot-home",
    "prompt": "鍋物暖居正式模板主視覺，呈現暖色鍋物與圓潤視覺，適合火鍋、湯品與聚會餐廳，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": false,
    "popularityRank": 19,
    "newbieFriendly": false,
    "baseTemplate": "playful-colorful",
    "recommendationReason": "依據 餐飲店 產業與 聚餐, 高質感 風格推薦。",
    "artworkSrc": "/template-gallery-ai/restaurant/restaurant-hotpot-home.png"
  },
  {
    "id": "restaurant-fast-enjoy",
    "industry": "restaurant",
    "slug": "restaurant-fast-enjoy",
    "name": "食尚快享",
    "shortDescription": "俐落快享版面與清楚 CTA，適合速食、外帶與連鎖餐飲。",
    "longDescription": "以高效率版面、醒目價格與行動按鈕縮短下單路徑，適合便當、速食、外送與多分店餐飲品牌。",
    "suitableFor": [
      "餐飲店",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "快享",
      "速食",
      "外帶",
      "效率"
    ],
    "badges": [
      "外送導流",
      "高轉換"
    ],
    "palette": [
      "#F8FAFC",
      "#EF4444",
      "#0F172A",
      "#F59E0B"
    ],
    "aiArtworkKey": "restaurant-fast-enjoy",
    "prompt": "食尚快享正式模板主視覺，呈現俐落快享版面與清楚 CTA，適合速食、外帶與連鎖餐飲，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": false,
    "popularityRank": 20,
    "newbieFriendly": false,
    "baseTemplate": "premium-minimal",
    "recommendationReason": "依據 餐飲店 產業與 外帶, 極簡 風格推薦。",
    "artworkSrc": "/template-gallery-ai/restaurant/restaurant-fast-enjoy.png"
  },
  {
    "id": "cafe-nordic-morning",
    "industry": "cafe",
    "slug": "cafe-nordic-morning",
    "name": "北歐晨光",
    "shortDescription": "北歐留白與晨光色調，適合簡約咖啡館與早餐品牌。",
    "longDescription": "以乾淨白底、木質暖色與柔和照片建立輕盈感，適合精品咖啡、早餐咖啡與簡約生活風品牌。",
    "suitableFor": [
      "咖啡廳",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "北歐",
      "晨光",
      "簡約",
      "木質"
    ],
    "badges": [
      "新手友善",
      "簡約咖啡"
    ],
    "palette": [
      "#FAFAF7",
      "#D7C9B8",
      "#CBD5E1",
      "#FFFFFF"
    ],
    "aiArtworkKey": "cafe-nordic-morning",
    "prompt": "北歐晨光正式模板主視覺，呈現北歐留白與晨光色調，適合簡約咖啡館與早餐品牌，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": true,
    "popularityRank": 21,
    "newbieFriendly": true,
    "baseTemplate": "fresh-japanese",
    "recommendationReason": "Jason 推薦：視覺辨識度高，適合展示給店家。",
    "artworkSrc": "/template-gallery-ai/cafe/cafe-nordic-morning.png"
  },
  {
    "id": "cafe-midnight-roast",
    "industry": "cafe",
    "slug": "cafe-midnight-roast",
    "name": "午夜焙煎",
    "shortDescription": "深色烘焙感與夜間氛圍，適合精品豆、酒吧式咖啡館。",
    "longDescription": "以深棕、黑色與金色細節呈現成熟質感，適合自家烘焙、夜間咖啡、咖啡酒吧與高單價豆單。",
    "suitableFor": [
      "咖啡廳",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "深焙",
      "午夜",
      "成熟",
      "精品豆"
    ],
    "badges": [
      "深色質感",
      "精品咖啡"
    ],
    "palette": [
      "#0F0A07",
      "#4B2E1B",
      "#B87333",
      "#F5E6D3"
    ],
    "aiArtworkKey": "cafe-midnight-roast",
    "prompt": "午夜焙煎正式模板主視覺，呈現深色烘焙感與夜間氛圍，適合精品豆、酒吧式咖啡館，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": true,
    "popularityRank": 22,
    "newbieFriendly": false,
    "baseTemplate": "premium-minimal",
    "recommendationReason": "Jason 推薦：視覺辨識度高，適合展示給店家。",
    "artworkSrc": "/template-gallery-ai/cafe/cafe-midnight-roast.png"
  },
  {
    "id": "cafe-cream-library",
    "industry": "cafe",
    "slug": "cafe-cream-library",
    "name": "奶油書房",
    "shortDescription": "奶油書房感與柔和排版，適合安靜座位與甜點咖啡館。",
    "longDescription": "以奶油白、書頁色與柔和卡片營造停留感，適合閱讀咖啡館、甜點店與主打舒適內用的品牌。",
    "suitableFor": [
      "咖啡廳",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "奶油",
      "書房",
      "甜點",
      "安靜"
    ],
    "badges": [
      "內用友善",
      "甜點咖啡"
    ],
    "palette": [
      "#FFF8ED",
      "#D6C4AA",
      "#8B7355",
      "#F3E8D7"
    ],
    "aiArtworkKey": "cafe-cream-library",
    "prompt": "奶油書房正式模板主視覺，呈現奶油書房感與柔和排版，適合安靜座位與甜點咖啡館，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": false,
    "popularityRank": 23,
    "newbieFriendly": true,
    "baseTemplate": "fresh-japanese",
    "recommendationReason": "依據 咖啡廳 產業與 奶蓋, 書房 風格推薦。",
    "artworkSrc": "/template-gallery-ai/cafe/cafe-cream-library.png"
  },
  {
    "id": "cafe-forest-teatime",
    "industry": "cafe",
    "slug": "cafe-forest-teatime",
    "name": "森林午茶",
    "shortDescription": "森林綠與下午茶氛圍，適合自然系咖啡與輕甜點品牌。",
    "longDescription": "以綠意、木質色與柔光視覺打造放鬆感，適合森林系咖啡館、手作甜點與下午茶套餐展示。",
    "suitableFor": [
      "咖啡廳",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "森林",
      "午茶",
      "自然",
      "放鬆"
    ],
    "badges": [
      "下午茶",
      "自然系"
    ],
    "palette": [
      "#F1F8EF",
      "#6B8E5A",
      "#B7C9A7",
      "#FFF7ED"
    ],
    "aiArtworkKey": "cafe-forest-teatime",
    "prompt": "森林午茶正式模板主視覺，呈現森林綠與下午茶氛圍，適合自然系咖啡與輕甜點品牌，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": false,
    "popularityRank": 24,
    "newbieFriendly": true,
    "baseTemplate": "fresh-japanese",
    "recommendationReason": "依據 咖啡廳 產業與 植栽, 高質感 風格推薦。",
    "artworkSrc": "/template-gallery-ai/cafe/cafe-forest-teatime.png"
  },
  {
    "id": "cafe-window-seat",
    "industry": "cafe",
    "slug": "cafe-window-seat",
    "name": "玻璃窗邊",
    "shortDescription": "窗邊光影與雜誌式留白，適合質感內用咖啡館。",
    "longDescription": "以大片留白、窗景照片與俐落資訊建立安靜高級感，適合座位預約、咖啡空間介紹與品牌故事頁。",
    "suitableFor": [
      "咖啡廳",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "窗邊",
      "光影",
      "雜誌感",
      "內用"
    ],
    "badges": [
      "空間展示",
      "質感店"
    ],
    "palette": [
      "#F8FAFC",
      "#9CA3AF",
      "#CBAA7C",
      "#FFFFFF"
    ],
    "aiArtworkKey": "cafe-window-seat",
    "prompt": "玻璃窗邊正式模板主視覺，呈現窗邊光影與雜誌式留白，適合質感內用咖啡館，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": false,
    "popularityRank": 25,
    "newbieFriendly": false,
    "baseTemplate": "premium-minimal",
    "recommendationReason": "依據 咖啡廳 產業與 城市, 高質感 風格推薦。",
    "artworkSrc": "/template-gallery-ai/cafe/cafe-window-seat.png"
  },
  {
    "id": "cafe-mocha-studio",
    "industry": "cafe",
    "slug": "cafe-mocha-studio",
    "name": "摩卡畫室",
    "shortDescription": "摩卡色與創作工作室感，適合風格選物與特色咖啡品牌。",
    "longDescription": "以咖啡棕、手作質感與活潑區塊呈現個性，適合咖啡工作室、選物店與創作者合作空間。",
    "suitableFor": [
      "咖啡廳",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "摩卡",
      "工作室",
      "手作",
      "個性"
    ],
    "badges": [
      "風格店",
      "創作者"
    ],
    "palette": [
      "#FFF2E0",
      "#8B5E3C",
      "#E76F51",
      "#F4A261"
    ],
    "aiArtworkKey": "cafe-mocha-studio",
    "prompt": "摩卡畫室正式模板主視覺，呈現摩卡色與創作工作室感，適合風格選物與特色咖啡品牌，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": false,
    "popularityRank": 26,
    "newbieFriendly": false,
    "baseTemplate": "playful-colorful",
    "recommendationReason": "依據 咖啡廳 產業與 藝術, 高質感 風格推薦。",
    "artworkSrc": "/template-gallery-ai/cafe/cafe-mocha-studio.png"
  },
  {
    "id": "cafe-white-dripper",
    "industry": "cafe",
    "slug": "cafe-white-dripper",
    "name": "白瓷濾杯",
    "shortDescription": "白瓷與極簡精品感，適合手沖咖啡與單品豆展示。",
    "longDescription": "以白色、灰階與克制排版突出咖啡器具與豆單品質，適合手沖咖啡、精品豆販售與安靜高級品牌。",
    "suitableFor": [
      "咖啡廳",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "白瓷",
      "手沖",
      "極簡",
      "精品"
    ],
    "badges": [
      "推薦",
      "手沖咖啡"
    ],
    "palette": [
      "#FFFFFF",
      "#E5E7EB",
      "#8B7355",
      "#111827"
    ],
    "aiArtworkKey": "cafe-white-dripper",
    "prompt": "白瓷濾杯正式模板主視覺，呈現白瓷與極簡精品感，適合手沖咖啡與單品豆展示，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": true,
    "popularityRank": 27,
    "newbieFriendly": false,
    "baseTemplate": "premium-minimal",
    "recommendationReason": "Jason 推薦：視覺辨識度高，適合展示給店家。",
    "artworkSrc": "/template-gallery-ai/cafe/cafe-white-dripper.png"
  },
  {
    "id": "cafe-caramel-afternoon",
    "industry": "cafe",
    "slug": "cafe-caramel-afternoon",
    "name": "焦糖午後",
    "shortDescription": "焦糖暖色與午後甜點感，適合甜點咖啡與舒適聚會。",
    "longDescription": "以焦糖、奶油與柔光照片營造溫暖食慾，適合布丁、蛋糕、咖啡套餐與午後聚會型店家。",
    "suitableFor": [
      "咖啡廳",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "焦糖",
      "午後",
      "甜點",
      "溫暖"
    ],
    "badges": [
      "甜點推薦",
      "聚會友善"
    ],
    "palette": [
      "#FFF3E8",
      "#C27A35",
      "#F9C5B5",
      "#FFE7C2"
    ],
    "aiArtworkKey": "cafe-caramel-afternoon",
    "prompt": "焦糖午後正式模板主視覺，呈現焦糖暖色與午後甜點感，適合甜點咖啡與舒適聚會，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": false,
    "popularityRank": 28,
    "newbieFriendly": true,
    "baseTemplate": "fresh-japanese",
    "recommendationReason": "依據 咖啡廳 產業與 甜點, 溫暖 風格推薦。",
    "artworkSrc": "/template-gallery-ai/cafe/cafe-caramel-afternoon.png"
  },
  {
    "id": "cafe-urban-monochrome",
    "industry": "cafe",
    "slug": "cafe-urban-monochrome",
    "name": "城市黑白",
    "shortDescription": "黑白城市感與俐落版面，適合成熟都會咖啡品牌。",
    "longDescription": "以黑白灰階、強烈留白與雜誌式構圖建立專業氣場，適合都會咖啡、概念店與品牌形象官網。",
    "suitableFor": [
      "咖啡廳",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "黑白",
      "城市",
      "俐落",
      "都會"
    ],
    "badges": [
      "推薦",
      "形象官網"
    ],
    "palette": [
      "#F8FAFC",
      "#111827",
      "#6B7280",
      "#D1D5DB"
    ],
    "aiArtworkKey": "cafe-urban-monochrome",
    "prompt": "城市黑白正式模板主視覺，呈現黑白城市感與俐落版面，適合成熟都會咖啡品牌，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": false,
    "popularityRank": 29,
    "newbieFriendly": false,
    "baseTemplate": "premium-minimal",
    "recommendationReason": "依據 咖啡廳 產業與 黑白, 高質感 風格推薦。",
    "artworkSrc": "/template-gallery-ai/cafe/cafe-urban-monochrome.png"
  },
  {
    "id": "cafe-daily-corner",
    "industry": "cafe",
    "slug": "cafe-daily-corner",
    "name": "日常一隅",
    "shortDescription": "社區角落與自然日光感，適合親切型咖啡與外帶小店。",
    "longDescription": "以柔和中性色、日常照片與簡潔資訊呈現鄰里感，適合外帶咖啡、社區咖啡館與日常品牌經營。",
    "suitableFor": [
      "咖啡廳",
      "小型品牌",
      "形象官網"
    ],
    "styleTags": [
      "社區",
      "日常",
      "自然光",
      "親切"
    ],
    "badges": [
      "社區店",
      "新手友善"
    ],
    "palette": [
      "#F7F3EA",
      "#A3B18A",
      "#D6C2A0",
      "#FFFFFF"
    ],
    "aiArtworkKey": "cafe-daily-corner",
    "prompt": "日常一隅正式模板主視覺，呈現社區角落與自然日光感，適合親切型咖啡與外帶小店，適合作為店家官網模板作品牆與 Hero 視覺。",
    "recommended": true,
    "popularityRank": 30,
    "newbieFriendly": true,
    "baseTemplate": "fresh-japanese",
    "recommendationReason": "Jason 推薦：視覺辨識度高，適合展示給店家。",
    "artworkSrc": "/template-gallery-ai/cafe/cafe-daily-corner.png"
  }
] satisfies TemplateGalleryItem[];

export const templateCatalogWithPresets = enrichAllTemplates(templateCatalog);

export const templateIndustries: TemplateIndustry[] = ['drink-shop', 'restaurant', 'cafe'];

export const templateStyleTags = Array.from(new Set(templateCatalog.flatMap(t => t.styleTags))).sort();

export function industryFromSiteIndustry(industry?: IndustryType): TemplateIndustry {
  if (industry === 'restaurant') return 'restaurant';
  if (industry === 'cafe') return 'cafe';
  return 'drink-shop';
}

export function getTemplateById(id?: string) { return templateCatalog.find(t => t.id === id); }

export function getRecommendedTemplates(industry: TemplateIndustry) {
  return templateCatalog.filter(t => t.industry === industry && t.recommended).slice(0, 4);
}

export function searchTemplates(opts: { industry: TemplateIndustry; query?: string; tag?: string; sort?: TemplateSort }) {
  const q = (opts.query || '').trim().toLowerCase();
  let result = templateCatalog.filter(t => t.industry === opts.industry);
  if (opts.tag && opts.tag !== 'all') result = result.filter(t => (t.styleTags as string[]).includes(opts.tag as string));
  if (q) result = result.filter(t => [t.name, t.slug, t.shortDescription, t.longDescription, ...t.suitableFor, ...t.styleTags, ...t.badges].join(' ').toLowerCase().includes(q));
  return [...result].sort((a,b) => {
    if (opts.sort === 'popular') return a.popularityRank - b.popularityRank;
    if (opts.sort === 'newest') return b.popularityRank - a.popularityRank;
    if (opts.sort === 'beginner') return Number(b.newbieFriendly) - Number(a.newbieFriendly) || a.popularityRank - b.popularityRank;
    return Number(b.recommended) - Number(a.recommended) || a.popularityRank - b.popularityRank;
  });
}
