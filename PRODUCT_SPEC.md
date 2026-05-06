# StoreSite Builder — 產品規格書 (v1.0)

## 1. 產品目標

餐飲 / 零售小店可於 5 分鐘內完成品牌靜態官網，無需工程背景。
內容全部由 `siteData` 驅動，三個模板共享同一份資料結構與匯出格式。

---

## 2. MVP 範圍

### 2.1 第一版功能

| 類別 | 功能 |
|------|------|
| 模板系統 | 三種模板：清新日式 (fresh-japanese)、精品極簡 (premium-minimal)、活潑繽紛 (playful-colorful) |
| Builder 編輯器 | 11 個編輯區塊（總覽 / 基本資料 / 模板選擇 / 品牌樣式 / 圖片媒體 / 菜單商品 / 連結設定 / SEO 設定 / 功能模組 / 匯入匯出 / 匯出網站） |
| 即時預覽 | Builder 內建 iframe 預覽，所見即所得 |
| 靜態匯出 | 匯出攜帶完整 assets 的 ZIP（index.html + siteData.json + README.txt + 圖片） |
| JSON 匯入匯出 | 支援 JSON 格式 siteData 匯入 / 匯出備份 |
| RWD | Desktop（≥ 1024px）三欄 / Mobile（< 1024px）編輯-預覽切換 |
| SEO 優化 | title / meta description / og:title / og:description |
| 圖片管理 | base64 dataUrl 上傳、刪除、插入文章 |

### 2.2 第一版不做功能

登入、會員、資料庫、訂單系統、付款、自訂網域、拖拉式編輯器、多語系、部落格、CMS、CDN、自訂 CSS/JS、Analytics。

---

## 3. 技術棧

| 層面 | 技術 |
|------|------|
| Framework | Next.js 16.2.4 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + @tailwindcss/postcss |
| 打包 | Next.js Build（static export capable）|
| 匯出格式 | JSZip（client-side ZIP 生成）|
| 測試工具 | Playwright + tsx |
| 目錄規範 | components/templates、components/builder、components/ui、lib、types |

---

## 4. siteData 摘要

```typescript
type SiteData = {
  id: string;
  industry: 'drink-shop' | 'restaurant' | 'cafe' | 'snack-shop' | 'other';
  template: 'fresh-japanese' | 'premium-minimal' | 'playful-colorful';
  store: { name, tagline, description, phone, email, address, businessHours };
  theme: { primaryColor, secondaryColor, backgroundColor, textColor, fontFamily, buttonStyle, sectionRadius, layoutDensity };
  hero: { title, subtitle, imageId?, ctaText, ctaUrl };
  menu: { categories: { id, name, description?, items: { id, name, description, price, imageId?, featured, tags? }[] }[] };
  media: { id, name, type, mimeType, dataUrl }[];
  links: { line?, instagram?, facebook?, threads?, tiktok?, googleMap?, ubereats?, foodpanda?, orderForm?, reservation? };
  seo: { title, description, slug, ogImageId? };
  modules: { hero, featuredProducts, menu, brandStory, storeInfo, map, faq, socialLinks, footer };
  faq: { question, answer }[];
}
```

---

## 5. Builder 功能地圖

| 區塊 | 說明 |
|------|------|
| 總覽 | 顯示目前 siteData 狀態、模板名稱、已啟用模組數 |
| 基本資料 | 店名、標語、簡介電話、地址等 |
| 模板選擇 | 三選一，切換即時更新預覽 |
| 品牌樣式 | 主色、次色、背景色、文字色、字體、按鈕形狀、圓角、版面密度 |
| 圖片媒體 | base64 上傳管理（logo / hero / product / store）|
| 菜單 / 商品 | 新增分類與商品，支援 featured 標記與圖片關聯 |
| 連結設定 | LINE / Instagram / Facebook / Google Map / 外送平台等 |
| SEO 設定 | title、description、slug、ogImageId |
| 功能模組 | 開關各區塊（Hero / 精選商品 / 菜單 / 品牌故事 / 門市資訊 / 地圖 / FAQ / 社群連結 / Footer）|
| 匯入匯出 | JSON 檔案匯入、匯出 siteData |
| 匯出網站 | 觸發 ZIP 下載，含 index.html + siteData.json + assets + README.txt |

---

## 6. 三模板

| ID | 名稱 | 風格 |
|----|------|------|
| fresh-japanese | 清新日式 | 大留白、淡雅配色、文青感 |
| premium-minimal | 精品極簡 | 深色對比、精緻襯線字、細節導向 |
| playful-colorful | 活潑繽紛 | 大色塊、圓潤元件、活力節奏 |

---

## 7. JSON 規格

匯出 `siteData.json` 即為 `SiteData` 完整物件，可直接匯入 Builder 還原編輯狀態。

---

## 8. ZIP 規格

```
generated-site.zip
├── index.html          # 完整靜態 HTML（inline CSS + JS）
├── siteData.json       # 原始資料備份
├── README.txt          # 說明文字
└── assets/
    └── {mediaId}.{ext} # base64 解碼後的圖片檔
```

---

## 9. 驗收標準（QA 核查用）

### 9.1 開發流程
- [x] `npm install && npm run typecheck && npm run build` exit 0
- [x] build output: Next.js 16.2.4，Compiled successfully，Route / 與 /builder static prerendered

### 9.2 ZIP / HTML 結構
- [x] ZIP 存在且包含 index.html、siteData.json、README.txt、assets/img-qa.png
- [x] HTML 含 store name、product name、title、meta description、og:title、og:description
- [x] HTML 無 forbidden 關鍵字（login, password, card, secret, key, api, token）

### 9.3 SEO / Meta
- [x] hasSeoTitle, hasMetaDescription, hasOgTitle, hasOgDescription
- [x] hasProduct, hasStore

### 9.4 離線瀏覽
- [x] file:// 開啟 index.html，title 正確、body 含關鍵內容
- [x] 無 console error

### 9.5 RWD — Desktop（1280px）
- [x] Builder sidebar width 260, preview width 480，三欄顯示
- [x] 11 個 sidebar 按鈕皆可見、可點擊

### 9.6 RWD — Mobile（390px）
- [x] Builder mobile controls 可見（edit/preview tabs + section select）
- [x] Builder scrollWidth = innerWidth = 390，無水平溢出
- [x] 離線 index.html scrollWidth = innerWidth = 390，無水平溢出
- [x] 點擊「預覽」tab 後 preview column 正確出現
