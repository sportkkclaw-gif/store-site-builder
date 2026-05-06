# StoreSite Builder｜小店家 30 分鐘官網產生器

餐飲小店靜態官網產生器 MVP：店家填資料 → 選模板 → 上傳圖片 → 即時預覽 → 匯出 JSON → 匯入 JSON → 匯出靜態網站 ZIP。

## 技術棧
Next.js、TypeScript、Tailwind CSS、React Hooks、localStorage、JSZip。

## 安裝與啟動
```bash
npm install
npm run dev
# http://localhost:3000
```

## 使用方式
1. 進入首頁 `/`，點擊「開始建立網站」。
2. 在 `/builder` 編輯基本資料、模板、品牌樣式、圖片、菜單、連結、SEO、模組。
3. 右側可切換桌機 / 手機即時預覽。

## Builder 功能
- BasicInfoForm：店名、標語、介紹、電話、Email、地址、營業時間。
- TemplateSelector：清新日系、質感極簡、活潑可愛。
- BrandStyleForm：主色、輔色、背景、文字、字體、按鈕、圓角、密度。
- MediaManager：jpg/png/webp，上限 2MB，dataUrl 儲存。
- MenuManager：分類與商品 CRUD、featured、圖片指定。
- LinksForm：LINE、社群、Google Maps、外送、訂購/訂位。
- SeoForm：title、description、slug、OG 圖片。
- ModuleToggleForm：開關 Hero、招牌商品、菜單、品牌故事、門市資訊、地圖、FAQ、社群、Footer。

## 匯出 / 匯入 JSON
在「匯入匯出」或 Topbar 點擊「匯出 JSON」下載 `siteData.json`；選擇 JSON 檔即可匯入並同步預覽。

## 匯出靜態網站 ZIP
在「匯出網站」或 Topbar 點擊「匯出 ZIP」下載 `generated-site.zip`，內含 `index.html`、`assets/`、`siteData.json`、`README.txt`。解壓後可直接開啟 `index.html`。

## 第一版限制
- 目前資料儲存在 localStorage
- 目前不含登入
- 目前不含雲端資料庫
- 目前不含線上付款
- 目前不含自訂網域
- 目前不含一鍵雲端部署
- 目前圖片以 dataUrl 儲存，僅適合 MVP 測試
- 目前主要用於驗證產品流程與模板效果

## 下一版建議功能
雲端儲存、店家登入、專案列表、一鍵部署到 Cloudflare Pages / Vercel、自訂網域、圖片壓縮與裁切、更多模板、多頁網站、表單收件、GA / 流量分析、付款訂閱、AI 文案生成、AI 菜單整理。
