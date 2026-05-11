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

---

## v0.2.0 Full Visual Template Engine QA

測試日期：2026-05-09
正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
QA artifacts：`qa-artifacts/v0.2.0/`

| # | 驗收項目 | 結果 | 狀態 |
|---|---|---|---|
| 1 | TemplateSkinEngine | `lib/templateSkinEngine.ts` 完成；輸出 getTemplateSkin / getTemplateCssVariables / getTemplateComponentClasses / getThemedPlaceholder / getExportTemplateCss。 | ✅ PASS |
| 2 | 10/11 skin family | soft-matcha、neon-dark、fruit-bright、amber-brown、peach-pastel、tea-mist-premium、luxury-black-gold、charcoal-grill、urban-casual、ceramic-minimal、monochrome-editorial 完成。 | ✅ PASS |
| 3 | 30 套模板 mapping | `templateCatalog` 30/30 皆有 skinId / skinFamily；無 default white fallback。 | ✅ PASS |
| 4 | Product cards | 10 套代表模板 computed style 全部有 skin，styleDiversity.product=10。 | ✅ PASS |
| 5 | Menu list | 10 套代表模板 computed style 全部有 skin，styleDiversity.menu=10。 | ✅ PASS |
| 6 | Placeholder | `data-store-site-text=false`；無 StoreSite Builder placeholder 字樣。 | ✅ PASS |
| 7 | Footer / Section | footer / section computed style 全部依 skin，styleDiversity.section=10、footer=10。 | ✅ PASS |
| 8 | ExportStaticSite | Export HTML 使用同一 skin engine，含 data-skin-family、skin-product-card、skin-menu-list、artwork asset。 | ✅ PASS |
| 9 | Forbidden strings | live DOM 與 export HTML forbidden strings = 0；無 localhost / 127 / _next。 | ✅ PASS |
| 10 | RWD | 10 套代表模板 390px 與 320px scrollWidth == innerWidth。 | ✅ PASS |
| 11 | QA script | Local WSL mirror 與最新 Vercel Preview 均執行 `npx tsx scripts/qa-full-template-skin.ts` exit 0。 | ✅ PASS |
| 12 | 截圖 | `qa-artifacts/v0.2.0/visual-skin/` 已產出 50 張（10 套 × gallery/hero/products/menu/export-products）。 | ✅ PASS |
| 13 | Typecheck / Build | `npm run typecheck && npm run build` exit 0；Next.js 16.2.4 compiled successfully。 | ✅ PASS |

QA 結果檔：`qa-artifacts/v0.2.0/full-template-skin-result.json`
視覺截圖目錄：`qa-artifacts/v0.2.0/visual-skin/`

---

## v0.2.1 30/30 Template Visual Completion Gate QA

測試日期：2026-05-09
正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
QA runtime：WSL-native mirror `/tmp/store-site-builder-v021`（避免 Windows 掛載路徑 Next server hang）
QA artifacts：`qa-artifacts/v0.2.1/`
QA result：`qa-artifacts/v0.2.1/all-templates-visual-result.json`

| # | 驗收項目 | 結果 | 狀態 |
|---|---|---|---|
| 1 | 30/30 Template Visual Contract | `lib/templateVisualContracts.ts` 建立 30 套逐套 contract；每套含 sourceArtwork、visualIdentity、page/header/hero/section/product/menu/placeholder/exportRequirement。 | ✅ PASS |
| 2 | 禁止 generic/default fallback | `getTemplateVisualContract()` 對缺漏 templateId 直接 throw；`assertTemplateVisualContractComplete()` 強制檢查 contract 完整度。 | ✅ PASS |
| 3 | Renderer 綁定 contract | React Preview root、product card、menu list、placeholder、footer 皆帶 `data-visual-contract-id`；skin mood 由各模板 palette/contract 套用。 | ✅ PASS |
| 4 | Export 綁定 contract | `exportStaticSite.ts` 輸出 `data-visual-contract-id`、`data-skin-family`、product/menu/placeholder/footer skin markers，並使用同源 artwork。 | ✅ PASS |
| 5 | 30 套全量 QA | `scripts/qa-all-templates-visual.ts` 實測 30/30 passed；不抽樣、不代表、不 golden templates。 | ✅ PASS |
| 6 | Live Preview / Export / Mobile | 每套均通過 live preview HTTP、export HTML、mobile 390px、mobile 320px、hero artwork、product cards、menu list、placeholder、footer 檢查。 | ✅ PASS |
| 7 | 截圖數量 | `qa-artifacts/v0.2.1/visual-30/` 產出 150 張 PNG（30 套 × gallery / preview-hero / preview-products / preview-menu / export）。 | ✅ PASS |
| 8 | 視覺差異度 | `uniqueProductBackgrounds=29`，代表 product cards 不是全模板共用同一個白卡/通用皮膚。 | ✅ PASS |
| 9 | Forbidden strings | StoreSite Builder placeholder / AI-designed / AI-generated / localhost / 127.0.0.1 / /_next 全部 0。 | ✅ PASS |
| 10 | `npm run typecheck` | 正式 repo 執行 `tsc --noEmit` exit 0。 | ✅ PASS |
| 11 | `npm run build` | 正式 repo Next.js 16.2.4 build successful；`/`、`/builder` static prerendered，`/__version` dynamic。 | ✅ PASS |

QA summary：

```json
{
  "ok": true,
  "liveStatus": 200,
  "totalTemplates": 30,
  "passedTemplates": 30,
  "failedTemplates": 0,
  "screenshotCount": 150,
  "uniqueProductBackgrounds": 29,
  "forbiddenCounts": {
    "StoreSite Builder placeholder": 0,
    "AI-designed": 0,
    "AI-generated": 0,
    "website template key visual": 0,
    "concept image": 0,
    "prompt": 0,
    "localhost": 0,
    "127.0.0.1": 0,
    "/_next": 0
  }
}
```

結論：v0.2.1 30/30 Template Visual Completion Gate 本機正式 repo 驗證通過；可進入 commit / PR 更新 / Vercel Preview redeploy / live QA。

---

## v0.2.2 Desktop Preview Engine QA

測試日期：2026-05-10
範圍限制：本輪只修「全螢幕桌機預覽」，未修改模板、skin、exportStaticSite、未新增模板或 AI 圖。

### Build
- `npm run typecheck`：PASS
- `npm run build`：PASS

### Desktop Preview QA
- QA script：`scripts/qa-desktop-preview.ts`
- Local QA URL：`http://127.0.0.1:3202`（WSL-native runtime mirror）
- Result JSON：`qa-artifacts/v0.2.2/desktop-preview-result.json`
- `fullscreenButtonVisible`：true
- `fullscreenButtonClickable`：true
- `previewRouteWorks`：true
- `backToBuilderWorks`：true
- `viewport1440Works`：true
- `viewport1280Works`：true
- `viewport1024Works`：true
- `viewport390Works`：true
- `fitZoomWorks`：true
- `zoom100Works`：true
- `zoom75Works`：true
- `zoom50Works`：true

### Screenshots
- `qa-artifacts/v0.2.2/desktop-preview/builder-preview-panel-with-fullscreen-button.png`
- `qa-artifacts/v0.2.2/desktop-preview/preview-route-1440.png`
- `qa-artifacts/v0.2.2/desktop-preview/preview-route-1280.png`
- `qa-artifacts/v0.2.2/desktop-preview/preview-route-1024.png`
- `qa-artifacts/v0.2.2/desktop-preview/preview-route-390.png`
- `qa-artifacts/v0.2.2/desktop-preview/preview-back-button.png`
- `qa-artifacts/v0.2.2/desktop-preview/builder-after-back.png`

---

## v0.2.3 Fullscreen Preview Data Binding QA

測試日期：2026-05-10
範圍限制：本輪只修 `/preview` 全螢幕預覽資料綁定；未修改 30 套模板資料、TemplateSkinEngine、Product cards、Menu list、ExportStaticSite、Template catalog、Skin family、登入/付款/資料庫。

### Build
- `npm run typecheck`：PASS
- `npm run build`：PASS

### Data Binding 修復
- `/builder` 點「全螢幕預覽」前：`saveSiteData(data)`
- `/preview`：直接讀同一個 `STORAGE_KEY = store-site-builder-data`
- `/preview`：localStorage 不存在時顯示「尚未載入 Builder 資料，請返回 Builder 建立網站。」
- `/preview`：移除手刻 demo hero、`Fullscreen Desktop Preview` 網站內容、普通漸層 placeholder
- Builder 右側 Preview 與 `/preview` 共用 `components/preview/PreviewCanvas.tsx`
- `PreviewCanvas` render `StoreWebsiteRenderer`，並標示 `data-template-id`、`data-skin-family`、`data-artwork-src`

### Binding QA
- QA script：`scripts/qa-fullscreen-preview-binding.ts`
- Result JSON：`qa-artifacts/v0.2.3/fullscreen-preview-binding-result.json`
- `ok`：true
- `testedTemplates`：5
- `builderAndPreviewTemplateMatch`：true
- `previewUsesLocalStorageSiteData`：true
- `previewUsesStoreWebsiteRenderer`：true
- `noDemoHeroContent`：true
- `noDefaultGradientPlaceholder`：true

### 5 套模板
- 白桃氣泡：`drink-white-peach-sparkle` / `peach-pastel` / artwork match PASS
- 珍珠霓光：`drink-boba-neon` / `neon-dark` / artwork match PASS
- 日常一隅：`cafe-daily-corner` / `urban-casual` / artwork match PASS
- 城市黑白：`cafe-urban-monochrome` / `monochrome-editorial` / artwork match PASS
- 金色晚宴：`restaurant-golden-banquet` / `luxury-black-gold` / artwork match PASS

### Screenshots
- `qa-artifacts/v0.2.3/fullscreen-preview-binding/builder-white-peach-selected.png`
- `qa-artifacts/v0.2.3/fullscreen-preview-binding/preview-white-peach-1440.png`
- `qa-artifacts/v0.2.3/fullscreen-preview-binding/builder-boba-neon-selected.png`
- `qa-artifacts/v0.2.3/fullscreen-preview-binding/preview-boba-neon-1440.png`
- `qa-artifacts/v0.2.3/fullscreen-preview-binding/builder-daily-corner-selected.png`
- `qa-artifacts/v0.2.3/fullscreen-preview-binding/preview-daily-corner-1440.png`
- `qa-artifacts/v0.2.3/fullscreen-preview-binding/preview-mobile-390.png`
- `qa-artifacts/v0.2.3/fullscreen-preview-binding/preview-back-to-builder.png`

---

## v0.2.4 Fullscreen Preview Entry + Mobile Tap QA

測試日期：2026-05-10
範圍限制：本輪只修全螢幕預覽入口、手機點擊事件、/preview 路由、PreviewCanvas 桌機置中與目前 Builder siteData 綁定；未修改模板 skin、30 套模板內容、AI artwork、商品卡、菜單列表、ExportStaticSite、登入/付款/資料庫。

### Build
- `npm run typecheck`：PASS
- `npm run build`：PASS

### Entry / Tap 修復
- 桌機入口：`data-testid=fullscreen-preview-button`，same-page navigation 到 `/preview?mode=desktop&viewport=1440`
- 手機入口：`data-testid=mobile-fullscreen-preview-button`，sticky toolbar 可見，點擊區 >= 48px，`pointer-events:auto`，same-page navigation 到 `/preview?mode=mobile&viewport=390`
- 入口資料保存：點擊前 `saveSiteData(data)`，並同步寫入 `sessionStorage[store-site-builder-preview-data]`
- `/preview` 讀取順序：sessionStorage preview data → localStorage store-site-builder-data → 缺資料提示返回 Builder
- `/preview` 返回：`data-testid=preview-back-to-builder`，返回後 localStorage 不清空，模板保留
- `PreviewCanvas`：新增 `data-testid=preview-stage`、`preview-scale-wrapper`、`desktop-preview-canvas`；desktop canvas `data-viewport-width=1440`；transform-origin top center；置中 PASS

### QA
- QA script：`scripts/qa-fullscreen-entry.ts`
- Result JSON：`qa-artifacts/v0.2.4/fullscreen-entry-result.json`
- `ok`：true
- `mobileButtonVisible`：true
- `mobileButtonClickable`：true
- `mobilePreviewRouteWorks`：true
- `desktopButtonVisible`：true
- `desktopButtonClickable`：true
- `desktopPreviewRouteWorks`：true
- `backToBuilderWorks`：true
- `desktopCanvas1440`：true
- `desktopCanvasCentered`：true
- `mobile390NoOverflow`：true

### 3 套模板
- 香辣市集：`restaurant-spicy-market` / mobile tap PASS / preview same template PASS / back PASS
- 白桃氣泡：`drink-white-peach-sparkle` / mobile tap PASS / preview same template PASS / back PASS
- 日常一隅：`cafe-daily-corner` / mobile tap PASS / preview same template PASS / back PASS

### Screenshots
- `qa-artifacts/v0.2.4/fullscreen-entry/mobile-builder-preview-with-fullscreen-button.png`
- `qa-artifacts/v0.2.4/fullscreen-entry/mobile-preview-route-390.png`
- `qa-artifacts/v0.2.4/fullscreen-entry/mobile-preview-back-button.png`
- `qa-artifacts/v0.2.4/fullscreen-entry/desktop-builder-preview-with-fullscreen-button.png`
- `qa-artifacts/v0.2.4/fullscreen-entry/desktop-preview-route-1440.png`
- `qa-artifacts/v0.2.4/fullscreen-entry/desktop-preview-canvas-centered.png`
- `qa-artifacts/v0.2.4/fullscreen-entry/builder-after-back.png`

---

## v0.2.5 Desktop Layout Width / Full-Bleed Polish QA
測試日期：2026-05-10
正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
QA runtime：WSL-native mirror `/tmp/store-site-builder-v025`（避免 Windows 掛載路徑 Next server hang）
QA artifacts：`qa-artifacts/v0.2.5/`（local evidence；若 qa-artifacts 受 .gitignore 忽略，PR/回報列路徑）

| 模板 | 1440 siteRootWidth | 1440 heroInnerWidth | 1440 sectionInnerWidth | 1280 siteRootWidth | 左右留白 OK | Export 同步 | 狀態 |
|---|---:|---:|---:|---:|---|---|---|
| 白桃氣泡 | 1440 | 1296 | 1250 | 1280 | ✅ | ✅ | ✅ PASS |
| 飲研實驗室 | 1440 | 1296 | 1250 | 1280 | ✅ | ✅ | ✅ PASS |
| 午夜焙煎 | 1440 | 1296 | 1248 | 1280 | ✅ | ✅ | ✅ PASS |
| 日常一隅 | 1440 | 1296 | 1250 | 1280 | ✅ | ✅ | ✅ PASS |
| 鍋物暖居 | 1440 | 1296 | 1250 | 1280 | ✅ | ✅ | ✅ PASS |
| 城市黑白 | 1440 | 1296 | 1248 | 1280 | ✅ | ✅ | ✅ PASS |

驗證項目：

- `npm run typecheck`：正式 repo 執行，exit 0。
- `npm run build`：正式 repo 執行，Next.js 16.2.4 build successful。
- Desktop container metrics：`desktopContentMaxWidth=1320px`、`desktopHeroMaxWidth=1360px`、`desktopSectionMaxWidth=1320px`。
- Fullscreen Preview 1440/1280：6 套模板全部通過；1440 `siteRootWidth >= 1440`、`heroInnerWidth >= 1296`、`sectionInnerWidth >= 1248`。
- Export width sync：`lib/exportStaticSite.ts` 使用同一 `generateTemplateSkinCss()` / `.template-hero-inner` / `.skin-section-inner` class system，避免 export 仍停留窄版。
- 截圖：`qa-artifacts/v0.2.5/desktop-layout-width/` 共 12 張（6 套 × 1440/1280）。
- 結果 JSON：`qa-artifacts/v0.2.5/desktop-layout-width-result.json`，`ok=true`、`testedTemplates=6`。

結論：v0.2.5 桌機版內容寬度與 Hero / Section / Product grid 已從窄版 card 修正為桌機官網寬版；手機版與 fullscreen entry 未修改。

---

## v0.2.6 Mobile Fullscreen Hero Text Overflow Fix（2026-05-10）

### 一、版本資訊
- 版本：v0.2.6
- 分支：`acceptance/store-site-builder-mvp`
- 修復範圍：手機全螢幕預覽 Hero 文字 overflow；Preview 與 Export 手機版同步。

### 二、Mobile Hero Overflow 修復
- 新增 `lib/mobileHeroLayout.ts`：建立 390 / 375 / 320 viewport 的 Mobile Hero Layout Contract。
- 新增 `lib/formatHeroTitleLines.ts`：將中文 Hero title 穩定分行，例如「每天一杯，日常更美好」→「每天一杯，」/「日常更美好」。
- `ThemedHero.tsx`：新增 `data-testid="hero-title"`、`data-testid="hero-content-panel"`、`data-testid="hero-cta-row"`、`data-testid="hero-subtitle"`；手機 h1 使用 `.hero-title-line` 分行。
- `templateSkinEngine.ts`：手機 Hero 改為 stacked/background artwork，不與文字左右並排；移除 mobile 固定 min-width/nowrap/keep-all 風險；content panel 加入 max-width、box-sizing、overflow guard；320px 針對 phone frame 內寬收斂。
- `exportStaticSite.ts`：同步 Preview 的 Hero title line formatter、content panel testid、CTA row testid 與 mobile CSS guard。

### 三、30 套模板全量結果
- QA script：`scripts/qa-mobile-hero-overflow-all.ts`
- 指令：`npx tsx scripts/qa-mobile-hero-overflow-all.ts http://127.0.0.1:3206`
- Live Preview 指令：`npx tsx scripts/qa-mobile-hero-overflow-all.ts https://store-site-builder-bxsqc2292-sportkk101-5719s-projects.vercel.app` → PASS（30/30，90 screenshots）
- totalTemplates：30
- testedViewports：390 / 375 / 320
- passed：30
- failed：0
- checks：bodyNoOverflow、canvasNoOverflow、heroTitleInsideCanvas、panelInsideCanvas、ctaInsideCanvas、lineCountOk、notSingleCharacterColumn、titleNotClipped、subtitleInsideCanvas、subtitleNotClipped、artworkVisible、exportSynced 全量 PASS。

### 四、重點模板結果
| 模板 | 390 | 375 | 320 | h1 在畫面內 | CTA 在畫面內 | 無水平 overflow |
|---|---:|---:|---:|---|---|---|
| 抹茶日和 | PASS | PASS | PASS | 是 | 是 | 是 |
| 珍珠霓光 | PASS | PASS | PASS | 是 | 是 | 是 |
| 白桃氣泡 | PASS | PASS | PASS | 是 | 是 | 是 |
| 茶霧山嵐 | PASS | PASS | PASS | 是 | 是 | 是 |
| 日常一隅 | PASS | PASS | PASS | 是 | 是 | 是 |
| 城市黑白 | PASS | PASS | PASS | 是 | 是 | 是 |
| 金色晚宴 | PASS | PASS | PASS | 是 | 是 | 是 |
| 飲研實驗室 | PASS | PASS | PASS | 是 | 是 | 是 |

### 五、QA artifacts
- Result JSON：`qa-artifacts/v0.2.6/mobile-hero-overflow-all-result.json`
- 截圖資料夾：`qa-artifacts/v0.2.6/mobile-hero-overflow/`
- 截圖數量：90（30 templates × 3 viewports）

### 六、Build
- `npm run typecheck`：PASS
- `npm run build`：PASS（Next.js 16.2.4，Compiled successfully）

### 七、結論
- 30/30 templates × 3 viewport 全過。
- Preview 與 Export 手機版同步通過。
- 可送 Jason 驗收。
---

## v0.2.7 Homepage Landing Page Productization QA

測試日期：2026-05-10T23:41:05+08:00
正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
Preview：https://store-site-builder-kpn3ccskq-sportkk101-5719s-projects.vercel.app
Commit：`1d2c9f0d98981f9fb58e7aadc591a526a370fba6`
QA artifacts：`qa-artifacts/v0.2.7/`

| # | 驗收項目 | 實際結果 | 狀態 |
|---|---|---|---|
| 1 | 首頁 Hero 重做 | `AI TEMPLATE WEBSITE BUILDER`、`30 分鐘建立小店家官方網站`、雙 CTA、4 個能力數據與 layered mockup 完成。 | ✅ PASS |
| 2 | 30 套 AI 模板展示 | `30 套 AI 視覺模板，直接套用成品牌官網` 區塊完成；使用 public/template-gallery-ai 真實 artwork，展示 12 張，涵蓋飲料店/餐飲店/咖啡廳。 | ✅ PASS |
| 3 | 三步驟流程 | 三步驟完成小店官網，以大數字與流程線呈現；手機直向堆疊。 | ✅ PASS |
| 4 | 三大產業模板展示 | 飲料店 / 餐飲店 / 咖啡廳三區塊完成；每區含大圖、文案、3 個模板小圖與 Builder CTA。 | ✅ PASS |
| 5 | Builder / Preview 展示 | 顯示 Builder 表單示意與 Preview 示意，文案包含即時同步、桌機/手機預覽、全螢幕預覽、localStorage 自動儲存。 | ✅ PASS |
| 6 | 功能特色 | 8 項 icon grid 完成：欄位式建站、30 套 AI 模板、菜單/商品、圖片媒體、SEO、ZIP、手機 RWD、全螢幕預覽。 | ✅ PASS |
| 7 | ZIP 匯出說明 | `generated-site.zip` 結構 mockup 完成；含無 localhost、無 /_next、file:// 可開啟、手機 RWD 通過。 | ✅ PASS |
| 8 | 適合對象 / Final CTA / Footer | 適合對象 chips、Final CTA、Footer links 與 v0.2.7 顯示完成。 | ✅ PASS |
| 9 | CTA：開始建立網站 | Playwright 點擊 `開始建立網站`，URL 成功進入 `/builder`。 | ✅ PASS |
| 10 | CTA：瀏覽 30 套模板 | Playwright 點擊後成功 scroll 到模板展示區。 | ✅ PASS |
| 11 | Mobile 390 無水平 overflow | `documentScrollWidth=390`、`bodyScrollWidth=390`、offenders=[]。 | ✅ PASS |
| 12 | Mobile 375 無水平 overflow | `documentScrollWidth=375`、`bodyScrollWidth=375`、offenders=[]。 | ✅ PASS |
| 13 | Mobile 320 無水平 overflow | `documentScrollWidth=320`、`bodyScrollWidth=320`、offenders=[]。 | ✅ PASS |
| 14 | 本機 QA script | `scripts/qa-homepage-landing.ts http://127.0.0.1:3207`：ok=true，9 screenshots。 | ✅ PASS |
| 15 | Live Preview QA script | `scripts/qa-homepage-landing.ts https://store-site-builder-kpn3ccskq-sportkk101-5719s-projects.vercel.app`：ok=true，9 screenshots。 | ✅ PASS |
| 16 | `npm run typecheck` | `tsc --noEmit` exit 0。 | ✅ PASS |
| 17 | `npm run build` | Next.js 16.2.4 Turbopack compiled successfully；`/` static prerendered。 | ✅ PASS |

Artifacts：
- JSON：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder/qa-artifacts/v0.2.7/homepage-landing-result.json`
- 截圖資料夾：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder/qa-artifacts/v0.2.7/homepage/`
- 截圖數量：9（desktop full/hero/template/industries/features/export + mobile 390/375/320）

結論：v0.2.7 首頁產品化與 landing page RWD 驗收 PASS，可送 Jason 首頁視覺驗收。

---

## v0.2.8 Mobile Preview Frame Fix QA

測試日期：2026-05-11
正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
修復目標：Jason 回報「預覽跟全螢幕預覽手機的版面都會破圖」。

### 一、修復範圍
- `components/preview/PreviewCanvas.tsx`：手機 frame 改為固定 390/375/320 對應高度，內容在 `preview-phone-viewport` 內滾動，不再撐長手機外框。
- `components/preview/MobilePreview.tsx`：Builder 手機預覽改用同一個 phone frame / Fit scale。
- `components/preview/PreviewFrame.tsx`：手機寬度預設切 mobile mode；預覽說明依 mode 顯示「手機預覽 / 桌機預覽」。
- `app/globals.css`：新增 phone viewport overflow guard、fullscreen meta ellipsis。
- `pages/__version.tsx`：版本更新為 `v0.2.8`。

### 二、Build
- `/tmp/store-site-builder-mobilefix` mirror：`npm run typecheck` PASS。
- `/tmp/store-site-builder-mobilefix` mirror：`npm run build` PASS（Next.js 16.2.4，Compiled successfully）。

### 三、本機 QA
- Script：`scripts/qa-mobile-preview-frame.ts http://127.0.0.1:3216`
- Result JSON：`qa-artifacts/v0.2.8/mobile-preview-frame-result.json`
- 截圖資料夾：`qa-artifacts/v0.2.8/mobile-preview-frame/`

| Viewport | Builder 手機預覽 | 全螢幕手機預覽 | 結果 |
|---:|---|---|---|
| 390 | 無水平 overflow；手機 frame 固定高度；Hero 在 canvas 內 | 無水平 overflow；手機 frame 不再被內容撐長 | PASS |
| 375 | 無水平 overflow；手機 frame 固定高度；Hero 在 canvas 內 | 無水平 overflow；手機 frame 不再被內容撐長 | PASS |
| 320 | 無水平 overflow；手機 frame 固定高度；Hero 在 canvas 內 | 無水平 overflow；手機 frame 不再被內容撐長 | PASS |

### 四、Vercel Preview / Live QA
- Commit：`31f55b7cde1d4ae25540410b9711dcd176bac85d`
- Preview：`https://store-site-builder-npt32ossi-sportkk101-5719s-projects.vercel.app`
- `/__version`：`v0.2.8`，commit `31f55b7`
- Live QA：`scripts/qa-mobile-preview-frame.ts https://store-site-builder-npt32ossi-sportkk101-5719s-projects.vercel.app` PASS。
- Live viewport 結果：390 / 375 / 320 全 PASS。

### 五、結論
v0.2.8 已確認 Builder 手機預覽與全螢幕手機預覽 frame 破版修復 PASS，Vercel Preview live QA PASS，可送 Jason 複驗。
---

## v0.2.9 Mobile Artwork Backplate Containment Fix QA

測試日期：2026-05-11
正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
QA runtime：WSL-native mirror `/tmp/store-site-builder-artworkfix`
QA artifacts：`qa-artifacts/v0.2.7/`（依 Jason 本輪指定路徑）

| # | 驗收項目 | 結果 | 狀態 |
|---|---|---|---|
| 1 | MobileArtworkSafeFrame | 已新增 `components/templates/shared/MobileArtworkSafeFrame.tsx`，含 `mobile-artwork-safe-frame` / `mobile-artwork-image` data-testid。 | ✅ PASS |
| 2 | mobile artwork 預設 | `TemplateArtworkBackplate.mobileArtworkMode` 預設為 `contain-poster`；抹茶日和為 `top-contain`。 | ✅ PASS |
| 3 | 手機 Hero 結構 | mobile 斷點改為 artwork stage + content panel 垂直排列，不再用 desktop cover background 直接塞滿手機框。 | ✅ PASS |
| 4 | Preview / Builder mobile | 30 套模板 × 390 / 375 / 320 均檢查 Builder mobile preview 與 `/preview?mode=mobile`。 | ✅ PASS |
| 5 | Export 同步 | `exportStaticSite.ts` 已輸出等價 MobileArtworkSafeFrame HTML/CSS，export mobile containment 同步檢查。 | ✅ PASS |
| 6 | artwork containment 全量 QA | totalTemplates=30，viewports=[390,375,320]，totalCases=90，passed=90，failed=0。 | ✅ PASS |
| 7 | 截圖 artifacts | `qa-artifacts/v0.2.7/mobile-artwork-containment/` 已產出 90 張 PNG。 | ✅ PASS |
| 8 | `npm run typecheck` | WSL-native mirror 執行 `tsc --noEmit` exit 0。 | ✅ PASS |
| 9 | `npm run build` | Next.js 16.2.4 production build successful。 | ✅ PASS |

重點模板結果：抹茶日和、珍珠霓光、白桃氣泡、茶霧山嵐、日常一隅、城市黑白於 390 / 375 / 320 全部 PASS；artwork frame 與 image 均在手機畫布內，文字與 CTA 均在 canvas 內，export 同步 PASS。

QA result：`qa-artifacts/v0.2.7/mobile-artwork-containment-all-result.json`
截圖資料夾：`qa-artifacts/v0.2.7/mobile-artwork-containment/`
結論：Mobile Artwork Backplate Containment Fix 本機全量驗證通過，可進入 commit / Preview redeploy / live QA。
---

## v0.2.9 Live Preview Mobile Artwork Containment QA（正式 repo 補驗）

測試時間：2026-05-11

- source：vercel-preview
- baseUrl：https://store-site-builder-gxirzlbj4-sportkk101-5719s-projects.vercel.app/
- /__version：v0.2.9 / f70842bc7b036d5738c5933ba22a6b50b3a11de4 / acceptance/store-site-builder-mvp
- formal repo：/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder
- npm ci：PASS（正式 repo；Playwright 可用）
- npx playwright --version：Version 1.59.1
- npx playwright install chromium：PASS
- npm run typecheck：PASS（正式 repo）
- npm run build：PASS（正式 repo）
- live QA script：scripts/qa-mobile-artwork-containment-all.ts
- totalTemplates：30
- viewports：390 / 375 / 320
- totalCases：90
- passed：90
- failed：0
- failedTemplates：[]
- errors：[]
- exportSynced：90/90
- live screenshots：90（Vercel Preview URL 來源）
- artifacts：qa-artifacts/v0.2.9/
  - qa-artifacts/v0.2.9/mobile-artwork-containment-live-result.json
  - qa-artifacts/v0.2.9/mobile-artwork-containment-live-summary.md
  - qa-artifacts/v0.2.9/mobile-artwork-containment-live/
  - qa-artifacts/v0.2.9/mobile-artwork-containment-live-artifacts.zip

結論：v0.2.9 live Preview 全量 QA 補驗 PASS，可送 Jason 審核。
---

## v0.2.10 Preview Session Binding + Mobile Not Poster Rendering QA

- Scope: Builder → /preview session snapshot binding and mobile preview renderer not-poster validation.
- Live QA base URL: https://store-site-builder-git-accepta-260340-sportkk101-5719s-projects.vercel.app
- Preview session manager: `lib/previewSession.ts` added; sessionStorage first, localStorage backup; no defaultSiteData silent fallback.
- Current template helper: `lib/getCurrentTemplate.ts` added; synchronizes `galleryTemplateId`, `visual.selectedTemplateId`, and `visual.templatePreset.selectedTemplateId`.
- Builder fullscreen preview: saves latest siteData, creates preview session, routes with `sessionId`, `templateId`, `mode`, `viewport`.
- /preview: reads session first; mismatched/missing session shows explicit error; toolbar exposes current template, templateId, skinFamily, sessionId.
- Mobile artwork rendering: `MobileArtworkSafeFrame` no longer uses full-poster/contain-entire-template behavior for preview; artwork is cropped/background/accent layer while website sections remain rendered by `StoreWebsiteRenderer`.

### QA Results

| Check | Result | Artifact |
| --- | --- | --- |
| Preview Session Binding | PASS — 30/30 templates, failed 0 | `qa-artifacts/v0.2.10/preview-session-binding-all-result.json` |
| Mobile Not Poster Rendering | PASS — 90/90 cases, failed 0 | `qa-artifacts/v0.2.10/mobile-preview-not-poster-result.json` |
| Screenshots | PASS — 150 total | `qa-artifacts/v0.2.10/preview-session-binding/` (60), `qa-artifacts/v0.2.10/mobile-preview-not-poster/` (90) |
| Typecheck | PASS | `npm run typecheck` |
| Build | PASS | `npm run build` |

### Fail Condition Coverage

- Builder A → /preview A binding verified for 30 templates.
- `/preview` URL includes `sessionId` and `templateId`.
- `/preview` root includes `data-template-id` and `data-skin-family`.
- No default/demo/template fallback accepted in session flow.
- Mobile preview verifies hero, brand story, product-card, and menu-list sections.
- Mobile preview verifies non-poster artwork mode and cover/crop rendering.
---

## v0.2.10 Fullscreen Button Dedup + Mobile Artwork Fill Fix QA

- Scope: remove duplicate/broken fullscreen preview CTA in mobile Builder and make mobile /preview artwork stage fill the safe canvas.
- Live QA base URL: https://store-site-builder-git-accepta-260340-sportkk101-5719s-projects.vercel.app
- Unified button: `components/preview/FullscreenPreviewButton.tsx` added and used by Builder preview.
- Removed legacy black fullscreen CTA from `PreviewFrame`; mobile Builder renders only the green primary CTA.
- `MobileArtworkSafeFrame` supports `fill-safe`, `fill-safe-top`, `fill-safe-center`, and `contain-safe`; mobile hero uses `fill-safe-top`.

### QA Results

| Check | Result | Artifact |
| --- | --- | --- |
| Fullscreen Button Dedup | PASS — visible mobile Builder fullscreen button count 1 | `qa-artifacts/v0.2.10/fullscreen-button-dedup-result.json` |
| Mobile Artwork Fill | PASS — 90/90 cases, failed 0 | `qa-artifacts/v0.2.10/mobile-artwork-fill-result.json` |
| Screenshots | PASS — 91 total | `qa-artifacts/v0.2.10/fullscreen-button-dedup.png` + `qa-artifacts/v0.2.10/mobile-artwork-fill/` (90) |
| Typecheck | PASS | `npm run typecheck` |
| Build | PASS | `npm run build` |

### Fail Condition Coverage

- Mobile Builder visible fullscreen button count: 1.
- Black legacy button removed.
- Green button visible, enabled, height >= 48, pointer-events active.
- Tapping green button navigates to `/preview`.
- `/preview` has no fullscreen preview button and keeps `返回 Builder`.
- Artwork frame stays inside phone canvas.
- Artwork frame width ratio is >= 0.90 and <= 1.00 for 30 templates × 390/375/320.
- No horizontal overflow detected.


---

## v0.2.11 Fullscreen Preview Persistence Fallback Fix QA

- Scope: fullscreen preview data persistence and tolerant `/preview` fallback only. No template catalog, TemplateSkinEngine, artwork, mobile layout, export, auth, payment, or database changes.
- Code commit: `bf6dc469345e6aa757d63e17390a448d87b1c7d1`
- Live QA base URL: https://store-site-builder-git-accepta-260340-sportkk101-5719s-projects.vercel.app
- `/__version`: `v0.2.11` on branch `acceptance/store-site-builder-mvp` (live deployment commit verified after each push).

### Persistence Behavior

1. Fullscreen preview click now saves the latest Builder data before routing.
2. Preview session is written to both `sessionStorage` and `localStorage` under `store-site-builder-preview-session:${sessionId}`.
3. Latest preview snapshot is written to `localStorage[store-site-builder-preview-current]`.
4. Builder data snapshot is written to `localStorage[store-site-builder-data]`.
5. `/preview` read order is: sessionStorage session → localStorage session → preview-current → builder-data → error.
6. TemplateId mismatch is repaired when the query template exists in catalog; it no longer errors only because storage fields are stale.
7. Error page appears only when all preview/session/builder storage sources are missing.

### QA Results

| Check | Result | Artifact |
| --- | --- | --- |
| 5-template normal fullscreen preview | PASS — 早午餐花園、抹茶日和、珍珠霓光、日常一隅、城市黑白 all matched Builder → `/preview` | `qa-artifacts/v0.2.11/preview-persistence-fallback-result.json` |
| sessionStorage normal source | PASS | `preview-sessionStorage-source.png` |
| localStorage session fallback | PASS | `preview-localStorage-fallback-source.png` |
| preview-current fallback | PASS | `preview-current-fallback-source.png` |
| builder-data fallback | PASS | `preview-builderData-fallback-source.png` |
| all storage missing error | PASS — error appears only after all storage is cleared | `preview-error-only-when-all-storage-missing.png` |
| Screenshots | PASS — 9 PNGs | `qa-artifacts/v0.2.11/preview-persistence-fallback/` |
| Typecheck | PASS | `npm run typecheck` |
| Build | PASS | `npm run build` |
| Live Vercel deployment | PASS | `/__version` returned `v0.2.11` and commit `bf6dc46` |

### Fail Condition Coverage

- No unexpected `預覽資料遺失` during normal fullscreen preview.
- sessionStorage missing still falls back to localStorage session.
- localStorage session missing still falls back to preview-current.
- preview-current missing still falls back to builder-data.
- No fallback to default template or default 抹茶日和 unless current Builder template is 抹茶日和.
- Live preview updated and verified.
