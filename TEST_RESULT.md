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
