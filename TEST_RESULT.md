# StoreSite Builder — 測試結果報告 (TEST_RESULT.md)

## 測試環境

- 專案路徑：`/home/sport/WORK/AGENTS/04_輸出/BARRY/store-site-builder`
- 測試日期：2026-05-05
- Node.js：latest
- Playwright：1.59.1（chromium-headless-shell 已安裝）
- 測試資料：scripts-qa-export.ts（驗收測試茶館）

---

## 測試結果（25 項）

### Group A：建置與編譯（2 項）

| # | 測試項目 | 預期 | 實際結果 | 狀態 |
|---|----------|------|----------|------|
| 1 | `npm install` | exit 0 | node_modules 完整（66 packages）| ✅ PASS |
| 2 | `npm run typecheck && npm run build` | exit 0 | Next.js 16.2.4, Compiled successfully, Route / 与 /builder static prerendered | ✅ PASS |

### Group B：ZIP / HTML 結構（5 項）

| # | 測試項目 | 預期 | 實際結果 | 狀態 |
|---|----------|------|----------|------|
| 3 | `generated-site.zip` 存在 | true | `ls qa-artifacts/generated-site.zip` → 6622 bytes | ✅ PASS |
| 4 | ZIP 內含 index.html | 存在 | ZIP names list 含 index.html | ✅ PASS |
| 5 | ZIP 內含 siteData.json | 存在 | ZIP names list 含 siteData.json | ✅ PASS |
| 6 | ZIP 內含 assets/img-qa.png | 存在 | assets/img-qa.png 存在（base64 解碼）| ✅ PASS |
| 7 | ZIP 含 README.txt | 存在 | ZIP names list 含 README.txt | ✅ PASS |

### Group C：HTML 內容正確性（6 項）

| # | 測試項目 | 預期 | 實際結果（Python 靜態檢查）| 狀態 |
|---|----------|------|--------------------------|------|
| 8 | HTML 含 store name | contains_store=true | HTML 含「驗收測試茶館」| ✅ PASS |
| 9 | HTML 含 product name | contains_product=true | HTML 含「驗收珍珠奶茶」| ✅ PASS |
| 10 | HTML 含 title | contains_title=true | HTML 含「驗收測試茶館｜官方網站」| ✅ PASS |
| 11 | HTML 含 meta description | contains_meta_description=true | HTML 含 SEO description 內容 | ✅ PASS |
| 12 | HTML 含 og:title | contains_og_title=true | `<meta property="og:title" ...>` 存在 | ✅ PASS |
| 13 | HTML 含 og:description | contains_og_description=true | `<meta property="og:description" ...>` 存在 | ✅ PASS |

### Group D：Forbidden Keywords（2 項）

| # | 測試項目 | 預期 | 實際結果 | 狀態 |
|---|----------|------|----------|------|
| 14 | HTML 無 localhost / 127.0.0.1 / /_next / _next/ | has_forbidden=false | Python 正則檢查 `localhost|127\\.0\\.0\\.1|/_next|_next/` → false | ✅ PASS |
| 15 | forbidden_matches | [] | 空陣列 | ✅ PASS |

### Group E：離線 Browser 驗證（9 項，Playwright）

| # | 測試項目 | 預期 | 實際結果（Playwright file://）| 狀態 |
|---|----------|------|------------------------------|------|
| 16 | 離線 index.html 可開啟 | file_url 正常 | `file:///.../generated-site/index.html` → domcontentloaded | ✅ PASS |
| 17 | page title 正確 | 驗收測試茶館｜官方網站 | title = "驗收測試茶館｜官方網站" | ✅ PASS |
| 18 | body 含 store name | true | innerText 含「驗收測試茶館」| ✅ PASS |
| 19 | body 含 product name | true | innerText 含「驗收珍珠奶茶」| ✅ PASS |
| 20 | body 含 store info | true | innerText 含「門市資訊」| ✅ PASS |
| 21 | 圖片數量 | ≥ 1 | imgCount = 2（含 hero placeholder + img-qa）| ✅ PASS |
| 22 | scrollWidth <= innerWidth | <= | 1280 <= 1280 | ✅ PASS |
| 23 | hasMetaDescription | true | console.log → hasMetaDescription=true | ✅ PASS |
| 24 | hasOgTitle / hasOgDescription | true | console.log → hasOgTitle=true, hasOgDescription=true | ✅ PASS |
| 25 | 無 console error | forbidden=false | browser_console forbidden=false, consoleErrors=[] | ✅ PASS |

### Group F：Builder Desktop RWD（已知資料）

| # | 測試項目 | 預期 | 實際結果 | 狀態 |
|---|----------|------|----------|------|
| — | sidebar width=260, height=720 | — | 前次測試：sidebar width 260, height 720, display flex | ✅ 記載 |

### Group G：Builder Mobile RWD — 390px（本次 Playwright 實測）

| # | 測試項目 | 預期 | 實際結果（Playwright headless, 390×844）| 狀態 |
|---|----------|------|----------------------------------------|------|
| 26 | Builder 頁面標題 | "StoreSite Builder" | title = "StoreSite Builder" | ✅ PASS |
| 27 | mobile controls 可見 | builder-mobile-controls present | `[data-testid="builder-mobile-controls"]` exists=true | ✅ PASS |
| 28 | section select 存在 | select present | `<select>` 存在，11 個 option | ✅ PASS |
| 29 | Builder scrollWidth <= innerWidth | 390 <= 390 | scrollWidth=390, innerWidth=390 | ✅ PASS |
| 30 | 點預覽 / 編輯切換 + section select | 預覽可見；回編輯後 select=menu | 預覽後 hasPreview=true；回編輯選 menu 後 hasMenu=true、selectValue=menu、scrollWidth=390、innerWidth=390 | ✅ PASS |

### Group H：離線 Site Mobile RWD — 390px（本次 Playwright 實測）

| # | 測試項目 | 預期 | 實際結果（Playwright headless, 390×844）| 狀態 |
|---|----------|------|----------------------------------------|------|
| 31 | 離線 index.html title | 驗收測試茶館｜官方網站 | title = "驗收測試茶館｜官方網站" | ✅ PASS |
| 32 | 離線 scrollWidth <= innerWidth | 390 <= 390 | scrollWidth=390, innerWidth=390 | ✅ PASS |
| 33 | 離線含 store name | true | innerText.includes("驗收測試茶館")=true | ✅ PASS |
| 34 | 離線含 product | true | innerText.includes("驗收珍珠奶茶")=true | ✅ PASS |
| 35 | 無 console error | false | hasConsoleErrors=false, consoleErrors=[] | ✅ PASS |

---

## v0.1.1 UI / Template Productization QA

測試日期：2026-05-06  
正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`  
QA artifacts：`qa-artifacts/v0.1.1/`

| # | 驗收項目 | 結果 | 狀態 |
|---|---|---|---|
| 1 | 首頁桌機視覺驗收 | `01-home-desktop.png` 已重新產出；Hero、CTA、三步驟、模板卡、功能特色與 Footer 皆為現代 landing page 視覺，不再像原生 HTML。 | ✅ PASS |
| 2 | 首頁 390px mobile 驗收 | `02-home-mobile-390.png` 已重新產出；`homeOverflow=false`。 | ✅ PASS |
| 3 | Builder Overview 視覺驗收 | `03-builder-overview.png` 已重新產出；Overview 使用 dashboard cards、狀態 badge、交付檢查卡。 | ✅ PASS |
| 4 | Builder 基本資料頁驗收 | `04-builder-basic.png` 已重新產出；基本資料與 Hero 文案分卡、2 欄欄位、helper text 完整。 | ✅ PASS |
| 5 | Builder 模板選擇頁驗收 | `05-builder-template.png` 已重新產出；三模板皆有 preview card、適合產業與 selected 狀態。 | ✅ PASS |
| 6 | Builder 菜單 / 商品頁驗收 | `06-builder-menu.png` 已重新產出；分類與商品為卡片式表單，featured 使用 toggle。 | ✅ PASS |
| 7 | Preview desktop 驗收 | `07-builder-preview-desktop.png` 已重新產出；瀏覽器外框、模板名稱、即時更新狀態正常，無 debug text。 | ✅ PASS |
| 8 | Preview mobile 驗收 | `08-builder-preview-mobile.png` 已重新產出；手機外框、手機 preview 內容正常。 | ✅ PASS |
| 9 | 清新日系匯出網站驗收 | `09-export-fresh-japanese.png` 已重新產出；米白、抹茶綠、留白與圓角卡片視覺成立。 | ✅ PASS |
| 10 | 質感極簡匯出網站驗收 | `10-export-premium-minimal.png` 已重新產出；炭黑 header、米色/咖啡棕、大圖精品餐飲感成立。 | ✅ PASS |
| 11 | 活潑可愛匯出網站驗收 | `11-export-playful-colorful.png` 已重新產出；珊瑚/黃色/薄荷漸層、促銷感與年輕品牌視覺成立。 | ✅ PASS |
| 12 | 三模板不只是色板 | 三模板在 Header、Hero、商品卡、CTA band、背景、字體與卡片語氣上皆不同；不是單純換色。 | ✅ PASS |
| 13 | `exportStaticSite.ts` 同步升級 | 已升級三模板差異化 CSS、placeholder、modules.map、SEO meta 與 390px RWD；不依賴 Next.js runtime。 | ✅ PASS |
| 14 | `npm run typecheck` | 在正式 repo 工作樹執行，`tsc --noEmit` exit 0。 | ✅ PASS |
| 15 | `npm run build` | 在正式 repo 工作樹執行，Next.js 16.2.4 build 成功，`/` 與 `/builder` static prerendered。 | ✅ PASS |
| 16 | ZIP 離線 file:// 結果 | `generated-site-v0.1.1-qa.zip` 已重新產出；三模板 HTML 解壓後可用 `file://` 開啟。 | ✅ PASS |
| 17 | localhost / _next 檢查結果 | 解壓後三模板 HTML 無 `localhost`、無 `127.0.0.1`、無 `/_next`、無 `_next/`。 | ✅ PASS |
| 18 | 390px RWD 結果 | `homeOverflow=false`、`builderOverflow=false`、三模板 export overflow 全為 false。 | ✅ PASS |
| 19 | 已知限制 | QA artifacts 依 `.gitignore` 不納入 repo；PR 描述需列出正式本機 artifacts 路徑與截圖清單。Vercel Preview 仍需重新部署後做 live QA。 | ⚠️ NOTE |
| 20 | 最終結論 | v0.1.1 本機正式 repo 驗證通過，可進入 PR 更新與 Preview redeploy。 | ✅ PASS |

QA artifact 清單：

- `01-home-desktop.png`
- `02-home-mobile-390.png`
- `03-builder-overview.png`
- `04-builder-basic.png`
- `05-builder-template.png`
- `06-builder-menu.png`
- `07-builder-preview-desktop.png`
- `08-builder-preview-mobile.png`
- `09-export-fresh-japanese.png`
- `10-export-premium-minimal.png`
- `11-export-playful-colorful.png`
- `generated-site-v0.1.1-qa.zip`
- `qa-result.json`

---

## 總結

- **25 項核心測試**：全部 ✅ PASS（含 Group A–E）
- **Mobile 390px 實測**：11 項額外行動測試（Group G–H）全部 ✅ PASS，由 Playwright headless chromium 執行
- **v0.1.1 UI / Template Productization QA**：20 項全部 ✅ PASS / NOTE，由正式 repo 工作樹重新執行
- **累計驗證**：Build ✅ / ZIP 結構 ✅ / SEO Meta ✅ / Forbidden ✅ / Browser Desktop ✅ / Browser Mobile 390px ✅ / Offline Mobile 390px ✅ / UI Productization ✅
- **阻塞問題**：無產品阻塞；發布收尾需完成 PR 更新與 Vercel Preview redeploy。

---

## 附：Mobile Playwright 原始輸出

```json
{
  "builder_url": "http://127.0.0.1:3111/builder",
  "builder_title": "StoreSite Builder",
  "builder_mobileControlsVisible": true,
  "builder_sectionSelectPresent": true,
  "builder_sectionOptionsCount": 11,
  "builder_scrollWidth": 390,
  "builder_innerWidth": 390,
  "builder_noHorizontalOverflow": true,
  "builder_previewColumnPresent": true,
  "offline_url": "file:///.../qa-artifacts/generated-site/index.html",
  "offline_title": "驗收測試茶館｜官方網站",
  "offline_scrollWidth": 390,
  "offline_innerWidth": 390,
  "offline_noHorizontalOverflow": true,
  "offline_contains_storeName": true,
  "offline_contains_product": true,
  "offline_contains_storeInfo": true,
  "consoleErrors": [],
  "hasConsoleErrors": false
}
```


---

## v0.2.0 Template Gallery Upgrade QA

測試日期：2026-05-07  
正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`  
QA runtime：WSL-native mirror `/tmp/store-site-builder-gallery-qa`（避免 Windows 掛載路徑 Next server hang）  
QA artifacts：`qa-artifacts/template-gallery-v0.2.0/`

| # | 驗收項目 | 結果 | 狀態 |
|---|---|---|---|
| 1 | 30 套模板 catalog | 飲料店 10、餐飲店 10、咖啡廳 10，共 30 套；每套含名稱、說明、適合產業、tags、badge、palette、prompt、推薦邏輯、artwork mapping。 | ✅ PASS |
| 2 | AI prompt catalog | `docs/template_prompt_catalog.md` 已建立，含通用規格與 30 套 prompt。 | ✅ PASS |
| 3 | artwork manifest / assets | `lib/templateArtworkManifest.ts` 與 `public/template-gallery/{drink-shop,restaurant,cafe}/*.svg` 完成 30/30 接線。 | ✅ PASS |
| 4 | 模板畫廊 UI | TemplateSelector 改為 AI 主視覺作品牆；含推薦區、產業 tabs、搜尋、style chips、排序、hover、selected。 | ✅ PASS |
| 5 | 產業 tabs | Playwright 實測：drinkCount=10、restaurantCount=10、cafeCount=10。 | ✅ PASS |
| 6 | 搜尋 | 搜尋「抹茶」→ searchCount=1。 | ✅ PASS |
| 7 | 篩選 | style chip「高質感」→ filteredCount=7，小於全量且正常顯示。 | ✅ PASS |
| 8 | 排序 | `熱門優先` select 可切換並維持畫廊結果。 | ✅ PASS |
| 9 | 快速預覽 Modal | `05-preview-modal.png` 已產出，大圖、文案、推薦邏輯、palette、CTA 正常。 | ✅ PASS |
| 10 | 套用模板 / Preview 同步 | 套用「抹茶日和」後 localStorage `galleryTemplateId=drink-matcha-hiyori`、`template=fresh-japanese`，右側 Preview 文案同步。 | ✅ PASS |
| 11 | Builder 其他功能不退化 | ExportPanel 仍可下載 ZIP；siteData/localStorage/Preview 保持既有流程。 | ✅ PASS |
| 12 | JSON / ZIP 不退化 | ZIP 含 `README.txt`、`index.html`、`siteData.json`。 | ✅ PASS |
| 13 | Forbidden keyword | 匯出 HTML 無 `localhost`、`127.0.0.1`、`/_next`、`_next/`。 | ✅ PASS |
| 14 | 390px RWD | mobileOverflow=false；`07-template-gallery-mobile-390.png` 已產出。 | ✅ PASS |
| 15 | Console error | consoleErrors=[]。 | ✅ PASS |
| 16 | `npm run typecheck` | 正式 repo 執行 `tsc --noEmit` exit 0。 | ✅ PASS |
| 17 | `npm run build` | 正式 repo Next.js build successful，`/` 與 `/builder` static prerendered。 | ✅ PASS |

QA artifact 清單：

- `01-template-gallery-desktop.png`
- `02-drink-gallery.png`
- `03-restaurant-gallery.png`
- `04-cafe-gallery.png`
- `05-preview-modal.png`
- `06-applied-builder-preview.png`
- `07-template-gallery-mobile-390.png`
- `generated-site-gallery-qa.zip`
- `qa-gallery-result.json`

結論：StoreSite Builder 模板畫廊升級本機正式 repo 驗證通過，可進入 PR / Preview 發布收尾。


---

## v0.2.1 P1 Formal AI Artwork QA

測試日期：2026-05-08  
正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`  
AI artwork 目錄：`public/template-gallery-ai/`

| # | 驗收項目 | 結果 | 狀態 |
|---|---|---|---|
| 1 | 30 張正式 AI 主視覺圖 | `public/template-gallery-ai/{drink-shop,restaurant,cafe}/*.png` 共 30 張。 | ✅ PASS |
| 2 | 圖像尺寸 | 30 張皆為 portrait `1024×1536`，UI 以 `object-cover` 呈現 4:5 作品牆視覺。 | ✅ PASS |
| 3 | Catalog 接線 | `lib/templateCatalog.ts` 的 `artworkSrc` 已切換至 `/template-gallery-ai/.../*.png`。 | ✅ PASS |
| 4 | Artwork manifest 接線 | `lib/templateArtworkManifest.ts` 的 `src` 已切換至 `/template-gallery-ai/.../*.png`，status=`ai-generated-ready`。 | ✅ PASS |
| 5 | Fallback 策略 | 原 `public/template-gallery/**/*.svg` 保留作為 mock/fallback，不再作為主要畫廊圖。 | ✅ PASS |
| 6 | `npm run typecheck` | 正式 repo 執行 `tsc --noEmit` exit 0。 | ✅ PASS |
| 7 | `npm run build` | 正式 repo Next.js build successful，`/` 與 `/builder` static prerendered。 | ✅ PASS |

結論：P1 正式 AI 圖資接線完成，可進入 PR 更新、Preview redeploy 與 live QA。


### v0.2.1 Live Preview QA 補充

Preview：`https://store-site-builder-44ze20f46-sportkk101-5719s-projects.vercel.app`  
Vercel Deployment：`dpl_EXjmtDdX86fy2YjRFGPeCCHKrcjo` / Ready / Preview  
Live QA artifacts：`qa-artifacts/template-gallery-v0.2.1-live/`

| # | Live 驗收項目 | 結果 | 狀態 |
|---|---|---|---|
| 1 | HTTP `/` | 200 | ✅ PASS |
| 2 | HTTP `/builder` | 200 | ✅ PASS |
| 3 | AI PNG 圖資 | `/template-gallery-ai/drink-shop/drink-matcha-hiyori.png`、`restaurant-golden-banquet.png`、`cafe-nordic-morning.png` 皆 200。 | ✅ PASS |
| 4 | Playwright live gallery QA | drinkCount=10、restaurantCount=10、cafeCount=10、searchCount=1、filteredCount=7。 | ✅ PASS |
| 5 | Modal / 套用 / Preview 同步 | applied=true、previewSync=true。 | ✅ PASS |
| 6 | 390px RWD | mobileOverflow=false。 | ✅ PASS |
| 7 | Console error | consoleErrors=[]。 | ✅ PASS |
| 8 | ZIP 匯出 | `README.txt`、`index.html`、`siteData.json` 存在；forbidden=false。 | ✅ PASS |

---

## v0.2.1 P1 AI 模板接線修復 QA

測試日期：2026-05-08 12:51 CST  
正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`  
修復 commit：`dc2b3b8d6a464bde6dd162606755e10ceede9a15`  
Preview：`https://store-site-builder-pe7fkma51-sportkk101-5719s-projects.vercel.app`

| # | 驗收項目 | 實測結果 | 狀態 |
|---|---|---|---|
| 1 | Jason 回報「模板沒有連接上去」重現 | 舊版套用 30 套 AI card 時，只更新 `galleryTemplateId/baseTemplate`；右側 Preview 只顯示三個舊 base template，且 hero 圖仍為 placeholder。 | ✅ 已定位 |
| 2 | 套用模板後資料流 | 點「珍珠霓光」後 localStorage：`galleryTemplateId=drink-boba-neon`、`template=playful-colorful`、`hero.imageId=template-artwork-drink-boba-neon`、`media[0].dataUrl` 為 JPEG data URL。 | ✅ PASS |
| 3 | 右側 Preview 模板名稱 | `data-testid=preview-template-name` 顯示「珍珠霓光」，不再只顯示「活潑可愛」。 | ✅ PASS |
| 4 | 右側 Preview hero 主視覺 | Preview hero 第一張圖為 `data:image/jpeg;base64,...`，natural size `900x600`，不再是 SVG placeholder。 | ✅ PASS |
| 5 | 30 套模板圖資連接策略 | 新增 `public/template-gallery-hero/{industry}/{slug}.jpg` 30 張壓縮 hero 圖；套用時同源 fetch → dataURL → 寫入 media，供 Preview/ZIP/OG 共用。 | ✅ PASS |
| 6 | typecheck | `npm run typecheck` exit 0。 | ✅ PASS |
| 7 | build | `npm run build` exit 0；Next.js 16.2.4 compiled successfully；`/`、`/builder` static prerendered。 | ✅ PASS |
| 8 | live HTTP | `/` HTTP 200；`/builder` HTTP 200；`/template-gallery-hero/drink-shop/drink-boba-neon.jpg` HTTP 200。 | ✅ PASS |
| 9 | Vercel Preview | Deployment UID `D49fFi48bgLP8DMNeZqmEfwnf74o` Ready；Preview 可公開開啟。 | ✅ PASS |

結論：Jason 指出的模板接線問題已修復；30 套 AI 模板現在套用後會同步模板名稱、版型、色盤、hero 主視覺、SEO OG 圖與 ZIP media 資料流。



---

## v0.1.2 Template Binding + Mobile UX QA

測試日期：2026-05-08 21:26 CST  
正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`  
QA runtime：WSL-native mirror `/tmp/store-site-builder-v012`（避免 Windows 掛載路徑 Next server hang）  
QA artifacts：`qa-artifacts/v0.1.2/`

| # | 驗收項目 | 實測結果 | 狀態 |
|---|---|---|---|
| 1 | TemplatePreset 型別系統 | `TemplateCatalogItem + themePreset + backgroundPreset + typographyPreset + componentStylePreset + layoutFamily + exportStylePreset` 已建立並接到 30 套模板 enrich flow。 | ✅ PASS |
| 2 | 套用模板不破壞使用者內容 | `applyTemplatePreset()` 保留店名、菜單、圖片、連結、SEO、FAQ，只更新 template/theme/visual/media/hero/OG。 | ✅ PASS |
| 3 | Preview 樣式同步 | 三個 React template renderer 已接 `getTemplateVisualStyle(data)`，背景、card、border、shadow、button band、nav、hero-grid、heading scale 改由 template preset 生成。 | ✅ PASS |
| 4 | Export HTML 樣式同步 | `exportStaticSite.ts` 使用同一套 visual style；ZIP HTML 含 gradient、assets 引用、card radius/shadow CSS。 | ✅ PASS |
| 5 | 六模板實測 | 抹茶日和、珍珠霓光、金色晚宴、香辣市集、白瓷濾杯、城市黑白均可套用並產生 Preview 截圖。 | ✅ PASS |
| 6 | Mobile Builder 390px | Playwright 390×900：`scrollWidth=390`、`innerWidth=390`、`noHorizontalOverflow=true`。 | ✅ PASS |
| 7 | Mobile Builder 320px | Playwright 320×780：`scrollWidth=320`、`innerWidth=320`、`noHorizontalOverflow=true`。 | ✅ PASS |
| 8 | Preview 返回按鈕 | 390px mobile preview mode 實測 `backVisible=true`，可看到返回編輯入口。 | ✅ PASS |
| 9 | ZIP 匯出 | `store-site-builder-v0.1.2-export.zip` 含 `README.txt`、`index.html`、`siteData.json`、`assets/template-artwork-cafe-urban-monochrome.jpg`。 | ✅ PASS |
| 10 | Forbidden keyword | 匯出 HTML 無 `localhost`、無 `127.0.0.1`、無 `/_next`。 | ✅ PASS |
| 11 | file:// 離線開啟 | 解壓至 `/tmp/store-site-builder-v012-export-check` 後，`file:///tmp/store-site-builder-v012-export-check/index.html` 可開啟，title 正常。 | ✅ PASS |
| 12 | typecheck | 正式 repo 執行 `npm run typecheck`，`tsc --noEmit` exit 0。 | ✅ PASS |
| 13 | build | 正式 repo 執行 `npm run build`，Next.js 16.2.4 compiled successfully，`/`、`/builder` static prerendered。 | ✅ PASS |

QA artifact 清單：

- `01-builder-desktop-overview.png`
- `02-template-gallery-desktop.png`
- `template-matcha.png`
- `template-pearl-neon.png`
- `template-gold-dinner.png`
- `template-spicy-market.png`
- `template-white-cafe.png`
- `template-city-mono.png`
- `09-mobile-390-builder.png`
- `10-mobile-390-preview-back.png`
- `11-mobile-320-builder.png`
- `store-site-builder-v0.1.2-export.zip`
- `qa-v012-summary.json`

結論：v0.1.2 Template Binding + Mobile UX 修復在正式 repo build/typecheck 與 WSL-native browser QA 均通過；可進入 commit、push、PR 更新與 Vercel Preview redeploy。


---

## v0.1.3 Template Polish + Copy + Preview Layout QA

測試日期：2026-05-08 22:50 CST  
正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`  
本輪目標：模板中文文案、Hero 中文排版、AI artwork treatment、圖片主導畫廊、手機 UX、exportStaticSite 同步修復。

### Build / Typecheck
- `npm run typecheck`：PASS
- `npm run build`：PASS（Next.js 16.2.4，`/`、`/builder` static prerendered）

### 文案 QA
- 30 套模板 `shortDescription` / `longDescription` 已改為正式中文。
- `styleTags` / `badges` 已中文化。
- 禁止字樣未出現在使用者展示文案：AI-designed、website template key visual、showcase image、concept image、premium AI、Create a、for a brand called。

### Preview / Hero QA（6 套）
- 抹茶日和：Hero readable=true，h1=208x80，treatment=soft-card-artwork。
- 珍珠霓光：Hero readable=true，h1=196x83，treatment=hero-floating-artwork。
- 茶霧山嵐：Hero readable=true，h1=197x74，treatment=editorial-split。
- 金色晚宴：Hero readable=true，h1=294x74，treatment=dark-full-bleed。
- 白瓷濾杯：Hero readable=true，h1=197x74，treatment=soft-card-artwork。
- 城市黑白：Hero readable=true，h1=197x74，treatment=soft-card-artwork。

### Mobile QA
- 390px：scrollWidth=390 / innerWidth=390，無水平破版。
- 320px：scrollWidth=320 / innerWidth=320，無嚴重水平破版。
- Preview 返回編輯：PASS。
- Template Preview Modal 返回模板庫：PASS。

### Export / file:// QA
- 六套模板均成功匯出 ZIP：抹茶日和、珍珠霓光、茶霧山嵐、金色晚宴、白瓷濾杯、城市黑白。
- 六套 ZIP 均含 `README.txt`、`index.html`、`siteData.json` 與 AI artwork assets。
- `index.html` 具備 Hero readable CSS：`clamp(...)`、`word-break:keep-all`、`overflow-wrap:normal`。
- 掃描結果：無 `localhost`、無 `127.0.0.1`、無 `/_next`。
- `file://` 抽樣開啟：PASS；AI artwork 顯示；390px 無水平破版。

### QA artifacts
- `qa-artifacts/v0.1.3/qa-v013-summary.json`
- 13 張 QA 截圖：desktop overview、portfolio wall、modal back、6 模板、390 preview、320 builder、file export mobile。
- 6 個 ZIP：`export-matcha.zip`、`export-pearl-neon.zip`、`export-tea-mist.zip`、`export-gold-dinner.zip`、`export-white-dripper.zip`、`export-city-mono.zip`。


## v0.1.3 退回修正補驗（2026-05-08T15:28:42.923Z）

- 修正範圍：移除 UI bundle 中所有 AI prompt metadata（templateCatalog/templateArtworkManifest 不再輸出 prompt 欄位），新增 /__version 版本頁，降低 Hero H1 clamp 並補文字可讀 contrast/panel guard，同步 exportStaticSite。
- 本機正式 repo 驗證：
  - npm run typecheck：PASS
  - npm run build：PASS（Next.js 16.2.4；/builder + /__version routes built）
- Forbidden source/bundle scan：lib/components/app/pages/types 與 .next client/server bundle 對 AI-designed、AI-generated、website template key visual、website template showcase、concept image、showcase image、template artwork、premium AI、bold AI、Create a、for a brand called、prompt：0 hits。
- 新增 live QA：scripts/qa-v013-live.ts，對 Vercel Preview /builder 實測 forbidden counts、6 模板 desktop/mobile H1 行數與 overflow、390/320 mobile、返回編輯、返回模板庫。
### v0.1.3 Live Preview 補驗完成

- Preview: https://store-site-builder-oft0j4io6-sportkk101-5719s-projects.vercel.app
- /__version: v0.1.3 / commit 6e65b76fa182b56a7de950ac37793917e2f5061f
- HTTP: `/` 200、`/builder` 200、`/__version` 200
- Live forbidden string counts: AI-designed=0, AI-generated=0, website template key visual=0, website template showcase=0, concept image=0, showcase image=0, template artwork=0, premium AI=0, bold AI=0, Create a=0, for a brand called=0, prompt=0
- Live Hero QA: 6/6 模板 desktop/mobile 均未一字一行、無水平 overflow；H1 行數均 <= 4；word-break=keep-all；overflow-wrap=normal。
- Mobile QA: 390px / 320px 無水平 overflow；手機預覽模式可返回編輯；Preview modal 可返回模板庫。
- Export QA: generated-site.zip 重新產出；index.html 無 localhost、127.0.0.1、/_next 與 forbidden AI prompt 字串；含 README.txt、siteData.json、assets/img-qa.png。
- Artifacts: `qa-artifacts/v0.1.3/live-qa-result.json`、`qa-artifacts/v0.1.3/live-*.png`、`qa-artifacts/generated-site.zip`。

---

## v0.1.4 Visual Readability + Template Landing Polish QA

測試日期：2026-05-09  
正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`  
Preview：`https://store-site-builder-git-accepta-260340-sportkk101-5719s-projects.vercel.app`  
Commit：`d5aeff36300442f54b56615317fe7cd58f0b33de`

### 修正範圍
- 建立 `getReadableHeroTextStyle(templateItem)` readable guard：heading/subtitle/eyebrow/CTA/panel/overlay/decorative opacity。
- 三個 React template renderer 統一 Hero hierarchy：badge → foreground h1 → subtitle → CTA row → artwork → decorative text。
- 珍珠霓光專修：深色 panel、白色 foreground h1、cyan CTA、decorative text opacity 0.09、artwork 不壓文字。
- Mobile Hero 一律上下排列，h1 使用 `clamp(32px,9vw,46px)`、`line-height:1.12`、`word-break:keep-all`、`text-wrap:balance`。
- `lib/exportStaticSite.ts` 同步 Preview 樣式與 mobile guard，避免只修 Builder Preview。

### Build / Export
- `npm run typecheck`：PASS
- `npm run build`：PASS（Next.js 16.2.4 compiled successfully）
- `scripts/qa-v014-export.ts`：PASS
- 珍珠霓光 ZIP：`qa-artifacts/v0.1.4/export-pearl-neon.zip`
- file:// mobile：h1Lines=2、h1Opacity=0.98、subtitleVisible=true、ctaVisible=true、imageVisible=true、scrollWidth=390/innerWidth=390。
- Export forbidden：無 `localhost`、無 `127.0.0.1`、無 `/_next`；AI-designed、AI-generated、website template key visual、concept image、showcase image、prompt 全 0。

### Live Preview QA（10 套）
- `scripts/qa-v014-live.ts`：PASS (`ok=true`)
- `/__version`：v0.1.4 / `d5aeff36300442f54b56615317fe7cd58f0b33de`
- 10 套模板實測：抹茶日和、珍珠霓光、果香樂園、白桃氣泡、茶霧山嵐、金色晚宴、香辣市集、白瓷濾杯、城市黑白、北歐晨光。
- 每套 desktop/mobile：h1 visible、h1 <= 4 行、非一字一行、subtitle readable、CTA visible、artworkDoesNotCoverText=true、無水平 overflow。
- 390px：scrollWidth=390 / innerWidth=390。
- 320px：scrollWidth=320 / innerWidth=320。
- 返回按鈕：返回編輯 visible，tap target 114.5×44；返回模板庫 visible，tap target 322×54。

### QA artifacts
- `qa-artifacts/v0.1.4/live-qa-result.json`
- `qa-artifacts/v0.1.4/live-*.png`（10 套 desktop/mobile + version）
- `qa-artifacts/v0.1.4/export-pearl-neon-file-mobile.png`
- `qa-artifacts/v0.1.4/export-qa-result.json`
- `qa-artifacts/v0.1.4/export-pearl-neon.zip`

結論：v0.1.4 Visual Readability + Template Landing Polish 已通過 build/export/live QA，可再次提交 Jason 視覺驗收。


---

## v0.1.5 Template Backplate / Background System QA

測試日期：2026-05-09  
正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`  
QA artifacts：`qa-artifacts/v0.1.5/`

### 修正範圍
- 新增 `TemplateBackplatePreset` 型別，描述 page / hero / sections / decorative 四層背板。
- 新增 `lib/templateBackplateStyles.ts`，集中產出 `pageStyle`、`heroStyle`、`sectionStyle`、`cardStyle`、`decorativeLayers`、`mobileHeroStyle`、`exportCssVariables`。
- 30 套模板皆透過 catalog/enrich flow 取得 backplate preset；7 套指定模板完成實測：珍珠霓光、抹茶日和、白桃氣泡、茶霧山嵐、金色晚宴、白瓷濾杯、城市黑白。
- 三個 React template renderer 與 `exportStaticSite.ts` 共用同一套 backplate system，避免 Preview / Export 分叉。
- Quick Preview Modal 改為同時展示原 artwork、實際網站 Hero 示意與手機套用示意，不再只顯示展示圖。
- 珍珠霓光專修為 dark neon stage：紫藍霓虹 radial glow、深色 glass card、cyan/magenta CTA、artwork 作為主要背景視覺。

### Build / Export QA
- `npm run typecheck`：PASS
- `npm run build`：PASS（Next.js 16.2.4 compiled successfully；`/`、`/builder` static prerendered；`/__version` server-rendered）
- `npm exec -- tsx scripts/qa-v015-export.ts`：PASS (`ok=true`)
- Export 7/7 模板：file:// 390px 可開啟、H1 visible、H1 <= 4 行、subtitle visible、CTA visible、image visible、heroBackplate 非純色、無水平 overflow。
- Export forbidden：無 `localhost`、無 `127.0.0.1`、無 `/_next`；AI-designed、AI-generated、website template key visual、concept image、showcase image、prompt 全 0。

### QA artifacts
- `qa-artifacts/v0.1.5/export-qa-result.json`
- `qa-artifacts/v0.1.5/export-{drink-boba-neon,drink-matcha-hiyori,drink-white-peach-sparkle,drink-tea-mist-ridge,restaurant-golden-banquet,cafe-white-dripper,cafe-urban-monochrome}.zip`
- `qa-artifacts/v0.1.5/export-*-file-mobile.png`
- `scripts/qa-v015-live.ts` 已新增，供 Vercel Preview live QA 使用。

結論：v0.1.5 Template Backplate / Background System 本機 build/export QA 通過；下一步為 commit/push、Vercel Preview 部署與 live QA。

### Live Preview QA（7 套）
- Preview：`https://store-site-builder-git-accepta-260340-sportkk101-5719s-projects.vercel.app`
- Vercel deployment host：`store-site-builder-110th3n1y-sportkk101-5719s-projects.vercel.app`
- `/__version`：v0.1.5 / commit `2a0a7416d554165006889e107be35e53ef395515` / branch `acceptance/store-site-builder-mvp`
- HTTP：`/` 200、`/builder` 200、`/__version` 200
- `PREVIEW_URL=... npm exec -- tsx scripts/qa-v015-live.ts`：PASS (`ok=true`)
- 7 套模板實測：抹茶日和、珍珠霓光、白桃氣泡、茶霧山嵐、金色晚宴、白瓷濾杯、城市黑白。
- 每套 desktop/mobile：backplate 非純色、H1 visible、H1 <= 4 行、非一字一行、subtitle readable、CTA visible、無水平 overflow。
- 390px：scrollWidth=390 / innerWidth=390；320px：scrollWidth=320 / innerWidth=320。
- Quick Preview Modal：實際網站 Hero 示意與手機套用示意均 visible；返回模板庫 visible。
- Live forbidden：AI-designed、AI-generated、website template key visual、concept image、showcase image、prompt 全 0。

### Live artifacts
- `qa-artifacts/v0.1.5/live-qa-result.json`
- `qa-artifacts/v0.1.5/live-*.png`（7 套 desktop/mobile + version + quick preview modal）

結論：v0.1.5 Template Backplate / Background System 已通過 build、export QA 與 Vercel Preview live QA，可提交 Jason 驗收。


---

## v0.1.5.1 Artwork-as-Source-of-Truth QA

測試日期：2026-05-09  
正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`  
QA artifacts：`qa-artifacts/v0.1.5/`

### 修正範圍
- 新增 `TemplateArtworkBackplate` type。
- 新增 `lib/templateArtworkResolver.ts`，統一解析 `gallerySrc` / `previewSrc` / `exportSrc` / `mobileSrc` / `desktopSrc`。
- `enrichTemplate.ts`、`applyTemplatePreset.ts` 停止把 gallery artwork 轉成另一張 hero jpg；Preview Hero 直接使用 gallery artwork。
- `StoreWebsiteRenderer` 旗下三個模板 renderer 的第一屏 Hero 已改為 `.template-hero-backplate` full-cover artwork backplate。
- `TemplatePreviewModal.tsx` 改為左側 gallery artwork、右側 actual applied Hero preview。
- `exportStaticSite.ts` / `exportZip.ts` 輸出 same artwork asset 到 ZIP `assets/template-artwork-*.png`。
- 新增 `scripts/qa-template-parity.ts`。

### Build
- `npm run typecheck`：PASS
- `npm run build`：PASS

### Visual Parity QA（9 套）
- `qa-artifacts/v0.1.5/template-parity-result.json`：PASS
- 9/9 Gallery / Preview / Export 同源：PASS
- 9/9 Preview Hero artwork 面積 >= 40%（實測約 58%）：PASS
- 9/9 Export Hero artwork 面積 >= 40%（實測約 99%）：PASS
- 9/9 Mobile readable：PASS
- 9/9 Export file://：PASS
- 測試模板：抹茶日和、珍珠霓光、果香樂園、黑糖琥珀、白桃氣泡、茶霧山嵐、金色晚宴、白瓷濾杯、城市黑白

### QA artifacts
- `qa-artifacts/v0.1.5/template-parity-result.json`
- `qa-artifacts/v0.1.5/parity-*-gallery.png`（9 張）
- `qa-artifacts/v0.1.5/parity-*-preview-hero.png`（9 張）
- `qa-artifacts/v0.1.5/parity-*-mobile-hero.png`（9 張）
- `qa-artifacts/v0.1.5/parity-*-export-index.png`（9 張）

### Forbidden strings
- AI-designed：0
- AI-generated：0
- website template key visual：0
- concept image：0
- showcase image：0
- prompt：0

結論：v0.1.5.1 Artwork-as-Source-of-Truth 本機 build 與 9 套 Visual Parity QA 通過；下一步為 commit/push、Vercel Preview 部署與 live verification。

---

## v0.1.6 Full Template Skin System QA

測試日期：2026-05-09
正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
QA artifacts：`qa-artifacts/v0.1.6/`（依 .gitignore 不納入 repo）
QA result：`qa-artifacts/v0.1.6/template-skin-result.json`

| # | 驗收項目 | 結果 | 狀態 |
|---|---|---|---|
| 1 | `TemplateSkinPreset` 型別 | `types/template.ts` 已新增完整 skin preset：surface、section、card、menu、footer、placeholder、button、border 等全站 token。 | ✅ PASS |
| 2 | `getTemplateSkin()` | `lib/templateSkin.ts` 已建立，9 套指定模板各自 mapping；非指定模板可依 themeType fallback。 | ✅ PASS |
| 3 | React Preview 全站套 skin | `FullSkinTemplate` 統一套用 Hero、section background、product cards、menu list、placeholder、footer；三個舊 renderer 改為 thin wrapper。 | ✅ PASS |
| 4 | Placeholder 主題化 | `ThemedPlaceholderImage` 已取代通用「StoreSite Builder」字樣，QA 檢查 `data-store-site-text=false` 且 preview/export text 不含 StoreSite Builder。 | ✅ PASS |
| 5 | Product cards 非通用白卡 | 9 套 preview 均有 `data-product-card-skin=true` 且 card background / border 由 skin token 生成。 | ✅ PASS |
| 6 | Menu list 套模板 skin | 9 套 preview/export 均有 `data-menu-list-skin=true` 且 background 不透明。 | ✅ PASS |
| 7 | Section background 套模板 | 9 套 preview/export 均有 `.skin-section` 且 section background 由 skin token 控制。 | ✅ PASS |
| 8 | Footer 套模板 | 9 套 preview/export 均有 `data-footer-skin=true` 且 footer background 由 skin token 控制。 | ✅ PASS |
| 9 | Export 全站套 skin | `exportStaticSite.ts` 已同步 Full Skin HTML/CSS；export HTML 含 `data-full-skin=true`、`skin-product-card`、`themed-placeholder` 與對應 artwork asset。 | ✅ PASS |
| 10 | Quick Preview Modal 三段對照 | Modal 改為 Gallery artwork + Hero preview + Section preview，QA 9 套皆檢出 `data-modal-section-renderer=true`。 | ✅ PASS |
| 11 | 9 套模板完整驗收 | 抹茶日和、珍珠霓光、果香樂園、黑糖琥珀、白桃氣泡、茶霧山嵐、金色晚宴、白瓷濾杯、城市黑白：`ok=true`。 | ✅ PASS |
| 12 | 390px RWD | 9 套 Preview 390px 與 9 套 Export 390px 均 `scrollWidth <= innerWidth`。 | ✅ PASS |
| 13 | QA artifacts | 產出 9 張 preview full page、9 張 export index full page、9 張 Quick Preview modal 截圖與 `template-skin-result.json`。 | ✅ PASS |
| 14 | `npm run typecheck` | 正式 repo 執行 `tsc --noEmit` exit 0。 | ✅ PASS |
| 15 | `npm run build` | 正式 repo Next.js 16.2.4 build successful；`/`、`/builder` static prerendered，`/__version` dynamic。 | ✅ PASS |

結論：v0.1.6 Full Template Skin System 本機正式 repo 驗證通過；可進入 commit / PR 更新 / Vercel Preview redeploy / live QA。
