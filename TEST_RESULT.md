     1|# StoreSite Builder — 測試結果報告 (TEST_RESULT.md)
     2|
     3|## 測試環境
     4|
     5|- 專案路徑：`/home/sport/WORK/AGENTS/04_輸出/BARRY/store-site-builder`
     6|- 測試日期：2026-05-05
     7|- Node.js：latest
     8|- Playwright：1.59.1（chromium-headless-shell 已安裝）
     9|- 測試資料：scripts-qa-export.ts（驗收測試茶館）
    10|
    11|---
    12|
    13|## 測試結果（25 項）
    14|
    15|### Group A：建置與編譯（2 項）
    16|
    17|| # | 測試項目 | 預期 | 實際結果 | 狀態 |
    18||---|----------|------|----------|------|
    19|| 1 | `npm install` | exit 0 | node_modules 完整（66 packages）| ✅ PASS |
    20|| 2 | `npm run typecheck && npm run build` | exit 0 | Next.js 16.2.4, Compiled successfully, Route / 与 /builder static prerendered | ✅ PASS |
    21|
    22|### Group B：ZIP / HTML 結構（5 項）
    23|
    24|| # | 測試項目 | 預期 | 實際結果 | 狀態 |
    25||---|----------|------|----------|------|
    26|| 3 | `generated-site.zip` 存在 | true | `ls qa-artifacts/generated-site.zip` → 6622 bytes | ✅ PASS |
    27|| 4 | ZIP 內含 index.html | 存在 | ZIP names list 含 index.html | ✅ PASS |
    28|| 5 | ZIP 內含 siteData.json | 存在 | ZIP names list 含 siteData.json | ✅ PASS |
    29|| 6 | ZIP 內含 assets/img-qa.png | 存在 | assets/img-qa.png 存在（base64 解碼）| ✅ PASS |
    30|| 7 | ZIP 含 README.txt | 存在 | ZIP names list 含 README.txt | ✅ PASS |
    31|
    32|### Group C：HTML 內容正確性（6 項）
    33|
    34|| # | 測試項目 | 預期 | 實際結果（Python 靜態檢查）| 狀態 |
    35||---|----------|------|--------------------------|------|
    36|| 8 | HTML 含 store name | contains_store=true | HTML 含「驗收測試茶館」| ✅ PASS |
    37|| 9 | HTML 含 product name | contains_product=true | HTML 含「驗收珍珠奶茶」| ✅ PASS |
    38|| 10 | HTML 含 title | contains_title=true | HTML 含「驗收測試茶館｜官方網站」| ✅ PASS |
    39|| 11 | HTML 含 meta description | contains_meta_description=true | HTML 含 SEO description 內容 | ✅ PASS |
    40|| 12 | HTML 含 og:title | contains_og_title=true | `<meta property="og:title" ...>` 存在 | ✅ PASS |
    41|| 13 | HTML 含 og:description | contains_og_description=true | `<meta property="og:description" ...>` 存在 | ✅ PASS |
    42|
    43|### Group D：Forbidden Keywords（2 項）
    44|
    45|| # | 測試項目 | 預期 | 實際結果 | 狀態 |
    46||---|----------|------|----------|------|
    47|| 14 | HTML 無 localhost / 127.0.0.1 / /_next / _next/ | has_forbidden=false | Python 正則檢查 `localhost|127\\.0\\.0\\.1|/_next|_next/` → false | ✅ PASS |
    48|| 15 | forbidden_matches | [] | 空陣列 | ✅ PASS |
    49|
    50|### Group E：離線 Browser 驗證（9 項，Playwright）
    51|
    52|| # | 測試項目 | 預期 | 實際結果（Playwright file://）| 狀態 |
    53||---|----------|------|------------------------------|------|
    54|| 16 | 離線 index.html 可開啟 | file_url 正常 | `file:///.../generated-site/index.html` → domcontentloaded | ✅ PASS |
    55|| 17 | page title 正確 | 驗收測試茶館｜官方網站 | title = "驗收測試茶館｜官方網站" | ✅ PASS |
    56|| 18 | body 含 store name | true | innerText 含「驗收測試茶館」| ✅ PASS |
    57|| 19 | body 含 product name | true | innerText 含「驗收珍珠奶茶」| ✅ PASS |
    58|| 20 | body 含 store info | true | innerText 含「門市資訊」| ✅ PASS |
    59|| 21 | 圖片數量 | ≥ 1 | imgCount = 2（含 hero placeholder + img-qa）| ✅ PASS |
    60|| 22 | scrollWidth <= innerWidth | <= | 1280 <= 1280 | ✅ PASS |
    61|| 23 | hasMetaDescription | true | console.log → hasMetaDescription=true | ✅ PASS |
    62|| 24 | hasOgTitle / hasOgDescription | true | console.log → hasOgTitle=true, hasOgDescription=true | ✅ PASS |
    63|| 25 | 無 console error | forbidden=false | browser_console forbidden=false, consoleErrors=[] | ✅ PASS |
    64|
    65|### Group F：Builder Desktop RWD（已知資料）
    66|
    67|| # | 測試項目 | 預期 | 實際結果 | 狀態 |
    68||---|----------|------|----------|------|
    69|| — | sidebar width=260, height=720 | — | 前次測試：sidebar width 260, height 720, display flex | ✅ 記載 |
    70|
    71|### Group G：Builder Mobile RWD — 390px（本次 Playwright 實測）
    72|
    73|| # | 測試項目 | 預期 | 實際結果（Playwright headless, 390×844）| 狀態 |
    74||---|----------|------|----------------------------------------|------|
    75|| 26 | Builder 頁面標題 | "StoreSite Builder" | title = "StoreSite Builder" | ✅ PASS |
    76|| 27 | mobile controls 可見 | builder-mobile-controls present | `[data-testid="builder-mobile-controls"]` exists=true | ✅ PASS |
    77|| 28 | section select 存在 | select present | `<select>` 存在，11 個 option | ✅ PASS |
    78|| 29 | Builder scrollWidth <= innerWidth | 390 <= 390 | scrollWidth=390, innerWidth=390 | ✅ PASS |
    79|| 30 | 點預覽 / 編輯切換 + section select | 預覽可見；回編輯後 select=menu | 預覽後 hasPreview=true；回編輯選 menu 後 hasMenu=true、selectValue=menu、scrollWidth=390、innerWidth=390 | ✅ PASS |
    80|
    81|### Group H：離線 Site Mobile RWD — 390px（本次 Playwright 實測）
    82|
    83|| # | 測試項目 | 預期 | 實際結果（Playwright headless, 390×844）| 狀態 |
    84||---|----------|------|----------------------------------------|------|
    85|| 31 | 離線 index.html title | 驗收測試茶館｜官方網站 | title = "驗收測試茶館｜官方網站" | ✅ PASS |
    86|| 32 | 離線 scrollWidth <= innerWidth | 390 <= 390 | scrollWidth=390, innerWidth=390 | ✅ PASS |
    87|| 33 | 離線含 store name | true | innerText.includes("驗收測試茶館")=true | ✅ PASS |
    88|| 34 | 離線含 product | true | innerText.includes("驗收珍珠奶茶")=true | ✅ PASS |
    89|| 35 | 無 console error | false | hasConsoleErrors=false, consoleErrors=[] | ✅ PASS |
    90|
    91|---
    92|
    93|## v0.1.1 UI / Template Productization QA
    94|
    95|測試日期：2026-05-06
    96|正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
    97|QA artifacts：`qa-artifacts/v0.1.1/`
    98|
    99|| # | 驗收項目 | 結果 | 狀態 |
   100||---|---|---|---|
   101|| 1 | 首頁桌機視覺驗收 | `01-home-desktop.png` 已重新產出；Hero、CTA、三步驟、模板卡、功能特色與 Footer 皆為現代 landing page 視覺，不再像原生 HTML。 | ✅ PASS |
   102|| 2 | 首頁 390px mobile 驗收 | `02-home-mobile-390.png` 已重新產出；`homeOverflow=false`。 | ✅ PASS |
   103|| 3 | Builder Overview 視覺驗收 | `03-builder-overview.png` 已重新產出；Overview 使用 dashboard cards、狀態 badge、交付檢查卡。 | ✅ PASS |
   104|| 4 | Builder 基本資料頁驗收 | `04-builder-basic.png` 已重新產出；基本資料與 Hero 文案分卡、2 欄欄位、helper text 完整。 | ✅ PASS |
   105|| 5 | Builder 模板選擇頁驗收 | `05-builder-template.png` 已重新產出；三模板皆有 preview card、適合產業與 selected 狀態。 | ✅ PASS |
   106|| 6 | Builder 菜單 / 商品頁驗收 | `06-builder-menu.png` 已重新產出；分類與商品為卡片式表單，featured 使用 toggle。 | ✅ PASS |
   107|| 7 | Preview desktop 驗收 | `07-builder-preview-desktop.png` 已重新產出；瀏覽器外框、模板名稱、即時更新狀態正常，無 debug text。 | ✅ PASS |
   108|| 8 | Preview mobile 驗收 | `08-builder-preview-mobile.png` 已重新產出；手機外框、手機 preview 內容正常。 | ✅ PASS |
   109|| 9 | 清新日系匯出網站驗收 | `09-export-fresh-japanese.png` 已重新產出；米白、抹茶綠、留白與圓角卡片視覺成立。 | ✅ PASS |
   110|| 10 | 質感極簡匯出網站驗收 | `10-export-premium-minimal.png` 已重新產出；炭黑 header、米色/咖啡棕、大圖精品餐飲感成立。 | ✅ PASS |
   111|| 11 | 活潑可愛匯出網站驗收 | `11-export-playful-colorful.png` 已重新產出；珊瑚/黃色/薄荷漸層、促銷感與年輕品牌視覺成立。 | ✅ PASS |
   112|| 12 | 三模板不只是色板 | 三模板在 Header、Hero、商品卡、CTA band、背景、字體與卡片語氣上皆不同；不是單純換色。 | ✅ PASS |
   113|| 13 | `exportStaticSite.ts` 同步升級 | 已升級三模板差異化 CSS、placeholder、modules.map、SEO meta 與 390px RWD；不依賴 Next.js runtime。 | ✅ PASS |
   114|| 14 | `npm run typecheck` | 在正式 repo 工作樹執行，`tsc --noEmit` exit 0。 | ✅ PASS |
   115|| 15 | `npm run build` | 在正式 repo 工作樹執行，Next.js 16.2.4 build 成功，`/` 與 `/builder` static prerendered。 | ✅ PASS |
   116|| 16 | ZIP 離線 file:// 結果 | `generated-site-v0.1.1-qa.zip` 已重新產出；三模板 HTML 解壓後可用 `file://` 開啟。 | ✅ PASS |
   117|| 17 | localhost / _next 檢查結果 | 解壓後三模板 HTML 無 `localhost`、無 `127.0.0.1`、無 `/_next`、無 `_next/`。 | ✅ PASS |
   118|| 18 | 390px RWD 結果 | `homeOverflow=false`、`builderOverflow=false`、三模板 export overflow 全為 false。 | ✅ PASS |
   119|| 19 | 已知限制 | QA artifacts 依 `.gitignore` 不納入 repo；PR 描述需列出正式本機 artifacts 路徑與截圖清單。Vercel Preview 仍需重新部署後做 live QA。 | ⚠️ NOTE |
   120|| 20 | 最終結論 | v0.1.1 本機正式 repo 驗證通過，可進入 PR 更新與 Preview redeploy。 | ✅ PASS |
   121|
   122|QA artifact 清單：
   123|
   124|- `01-home-desktop.png`
   125|- `02-home-mobile-390.png`
   126|- `03-builder-overview.png`
   127|- `04-builder-basic.png`
   128|- `05-builder-template.png`
   129|- `06-builder-menu.png`
   130|- `07-builder-preview-desktop.png`
   131|- `08-builder-preview-mobile.png`
   132|- `09-export-fresh-japanese.png`
   133|- `10-export-premium-minimal.png`
   134|- `11-export-playful-colorful.png`
   135|- `generated-site-v0.1.1-qa.zip`
   136|- `qa-result.json`
   137|
   138|---
   139|
   140|## 總結
   141|
   142|- **25 項核心測試**：全部 ✅ PASS（含 Group A–E）
   143|- **Mobile 390px 實測**：11 項額外行動測試（Group G–H）全部 ✅ PASS，由 Playwright headless chromium 執行
   144|- **v0.1.1 UI / Template Productization QA**：20 項全部 ✅ PASS / NOTE，由正式 repo 工作樹重新執行
   145|- **累計驗證**：Build ✅ / ZIP 結構 ✅ / SEO Meta ✅ / Forbidden ✅ / Browser Desktop ✅ / Browser Mobile 390px ✅ / Offline Mobile 390px ✅ / UI Productization ✅
   146|- **阻塞問題**：無產品阻塞；發布收尾需完成 PR 更新與 Vercel Preview redeploy。
   147|
   148|---
   149|
   150|## 附：Mobile Playwright 原始輸出
   151|
   152|```json
   153|{
   154|  "builder_url": "http://127.0.0.1:3111/builder",
   155|  "builder_title": "StoreSite Builder",
   156|  "builder_mobileControlsVisible": true,
   157|  "builder_sectionSelectPresent": true,
   158|  "builder_sectionOptionsCount": 11,
   159|  "builder_scrollWidth": 390,
   160|  "builder_innerWidth": 390,
   161|  "builder_noHorizontalOverflow": true,
   162|  "builder_previewColumnPresent": true,
   163|  "offline_url": "file:///.../qa-artifacts/generated-site/index.html",
   164|  "offline_title": "驗收測試茶館｜官方網站",
   165|  "offline_scrollWidth": 390,
   166|  "offline_innerWidth": 390,
   167|  "offline_noHorizontalOverflow": true,
   168|  "offline_contains_storeName": true,
   169|  "offline_contains_product": true,
   170|  "offline_contains_storeInfo": true,
   171|  "consoleErrors": [],
   172|  "hasConsoleErrors": false
   173|}
   174|```
   175|
   176|
   177|---
   178|
   179|## v0.2.0 Template Gallery Upgrade QA
   180|
   181|測試日期：2026-05-07
   182|正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
   183|QA runtime：WSL-native mirror `/tmp/store-site-builder-gallery-qa`（避免 Windows 掛載路徑 Next server hang）
   184|QA artifacts：`qa-artifacts/template-gallery-v0.2.0/`
   185|
   186|| # | 驗收項目 | 結果 | 狀態 |
   187||---|---|---|---|
   188|| 1 | 30 套模板 catalog | 飲料店 10、餐飲店 10、咖啡廳 10，共 30 套；每套含名稱、說明、適合產業、tags、badge、palette、prompt、推薦邏輯、artwork mapping。 | ✅ PASS |
   189|| 2 | AI prompt catalog | `docs/template_prompt_catalog.md` 已建立，含通用規格與 30 套 prompt。 | ✅ PASS |
   190|| 3 | artwork manifest / assets | `lib/templateArtworkManifest.ts` 與 `public/template-gallery/{drink-shop,restaurant,cafe}/*.svg` 完成 30/30 接線。 | ✅ PASS |
   191|| 4 | 模板畫廊 UI | TemplateSelector 改為 AI 主視覺作品牆；含推薦區、產業 tabs、搜尋、style chips、排序、hover、selected。 | ✅ PASS |
   192|| 5 | 產業 tabs | Playwright 實測：drinkCount=10、restaurantCount=10、cafeCount=10。 | ✅ PASS |
   193|| 6 | 搜尋 | 搜尋「抹茶」→ searchCount=1。 | ✅ PASS |
   194|| 7 | 篩選 | style chip「高質感」→ filteredCount=7，小於全量且正常顯示。 | ✅ PASS |
   195|| 8 | 排序 | `熱門優先` select 可切換並維持畫廊結果。 | ✅ PASS |
   196|| 9 | 快速預覽 Modal | `05-preview-modal.png` 已產出，大圖、文案、推薦邏輯、palette、CTA 正常。 | ✅ PASS |
   197|| 10 | 套用模板 / Preview 同步 | 套用「抹茶日和」後 localStorage `galleryTemplateId=drink-matcha-hiyori`、`template=fresh-japanese`，右側 Preview 文案同步。 | ✅ PASS |
   198|| 11 | Builder 其他功能不退化 | ExportPanel 仍可下載 ZIP；siteData/localStorage/Preview 保持既有流程。 | ✅ PASS |
   199|| 12 | JSON / ZIP 不退化 | ZIP 含 `README.txt`、`index.html`、`siteData.json`。 | ✅ PASS |
   200|| 13 | Forbidden keyword | 匯出 HTML 無 `localhost`、`127.0.0.1`、`/_next`、`_next/`。 | ✅ PASS |
   201|| 14 | 390px RWD | mobileOverflow=false；`07-template-gallery-mobile-390.png` 已產出。 | ✅ PASS |
   202|| 15 | Console error | consoleErrors=[]。 | ✅ PASS |
   203|| 16 | `npm run typecheck` | 正式 repo 執行 `tsc --noEmit` exit 0。 | ✅ PASS |
   204|| 17 | `npm run build` | 正式 repo Next.js build successful，`/` 與 `/builder` static prerendered。 | ✅ PASS |
   205|
   206|QA artifact 清單：
   207|
   208|- `01-template-gallery-desktop.png`
   209|- `02-drink-gallery.png`
   210|- `03-restaurant-gallery.png`
   211|- `04-cafe-gallery.png`
   212|- `05-preview-modal.png`
   213|- `06-applied-builder-preview.png`
   214|- `07-template-gallery-mobile-390.png`
   215|- `generated-site-gallery-qa.zip`
   216|- `qa-gallery-result.json`
   217|
   218|結論：StoreSite Builder 模板畫廊升級本機正式 repo 驗證通過，可進入 PR / Preview 發布收尾。
   219|
   220|
   221|---
   222|
   223|## v0.2.1 P1 Formal AI Artwork QA
   224|
   225|測試日期：2026-05-08
   226|正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
   227|AI artwork 目錄：`public/template-gallery-ai/`
   228|
   229|| # | 驗收項目 | 結果 | 狀態 |
   230||---|---|---|---|
   231|| 1 | 30 張正式 AI 主視覺圖 | `public/template-gallery-ai/{drink-shop,restaurant,cafe}/*.png` 共 30 張。 | ✅ PASS |
   232|| 2 | 圖像尺寸 | 30 張皆為 portrait `1024×1536`，UI 以 `object-cover` 呈現 4:5 作品牆視覺。 | ✅ PASS |
   233|| 3 | Catalog 接線 | `lib/templateCatalog.ts` 的 `artworkSrc` 已切換至 `/template-gallery-ai/.../*.png`。 | ✅ PASS |
   234|| 4 | Artwork manifest 接線 | `lib/templateArtworkManifest.ts` 的 `src` 已切換至 `/template-gallery-ai/.../*.png`，status=`ai-generated-ready`。 | ✅ PASS |
   235|| 5 | Fallback 策略 | 原 `public/template-gallery/**/*.svg` 保留作為 mock/fallback，不再作為主要畫廊圖。 | ✅ PASS |
   236|| 6 | `npm run typecheck` | 正式 repo 執行 `tsc --noEmit` exit 0。 | ✅ PASS |
   237|| 7 | `npm run build` | 正式 repo Next.js build successful，`/` 與 `/builder` static prerendered。 | ✅ PASS |
   238|
   239|結論：P1 正式 AI 圖資接線完成，可進入 PR 更新、Preview redeploy 與 live QA。
   240|
   241|
   242|### v0.2.1 Live Preview QA 補充
   243|
   244|Preview：`https://store-site-builder-44ze20f46-sportkk101-5719s-projects.vercel.app`
   245|Vercel Deployment：`dpl_EXjmtDdX86fy2YjRFGPeCCHKrcjo` / Ready / Preview
   246|Live QA artifacts：`qa-artifacts/template-gallery-v0.2.1-live/`
   247|
   248|| # | Live 驗收項目 | 結果 | 狀態 |
   249||---|---|---|---|
   250|| 1 | HTTP `/` | 200 | ✅ PASS |
   251|| 2 | HTTP `/builder` | 200 | ✅ PASS |
   252|| 3 | AI PNG 圖資 | `/template-gallery-ai/drink-shop/drink-matcha-hiyori.png`、`restaurant-golden-banquet.png`、`cafe-nordic-morning.png` 皆 200。 | ✅ PASS |
   253|| 4 | Playwright live gallery QA | drinkCount=10、restaurantCount=10、cafeCount=10、searchCount=1、filteredCount=7。 | ✅ PASS |
   254|| 5 | Modal / 套用 / Preview 同步 | applied=true、previewSync=true。 | ✅ PASS |
   255|| 6 | 390px RWD | mobileOverflow=false。 | ✅ PASS |
   256|| 7 | Console error | consoleErrors=[]。 | ✅ PASS |
   257|| 8 | ZIP 匯出 | `README.txt`、`index.html`、`siteData.json` 存在；forbidden=false。 | ✅ PASS |
   258|
   259|---
   260|
   261|## v0.2.1 P1 AI 模板接線修復 QA
   262|
   263|測試日期：2026-05-08 12:51 CST
   264|正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
   265|修復 commit：`dc2b3b8d6a464bde6dd162606755e10ceede9a15`
   266|Preview：`https://store-site-builder-pe7fkma51-sportkk101-5719s-projects.vercel.app`
   267|
   268|| # | 驗收項目 | 實測結果 | 狀態 |
   269||---|---|---|---|
   270|| 1 | Jason 回報「模板沒有連接上去」重現 | 舊版套用 30 套 AI card 時，只更新 `galleryTemplateId/baseTemplate`；右側 Preview 只顯示三個舊 base template，且 hero 圖仍為 placeholder。 | ✅ 已定位 |
   271|| 2 | 套用模板後資料流 | 點「珍珠霓光」後 localStorage：`galleryTemplateId=drink-boba-neon`、`template=playful-colorful`、`hero.imageId=template-artwork-drink-boba-neon`、`media[0].dataUrl` 為 JPEG data URL。 | ✅ PASS |
   272|| 3 | 右側 Preview 模板名稱 | `data-testid=preview-template-name` 顯示「珍珠霓光」，不再只顯示「活潑可愛」。 | ✅ PASS |
   273|| 4 | 右側 Preview hero 主視覺 | Preview hero 第一張圖為 `data:image/jpeg;base64,...`，natural size `900x600`，不再是 SVG placeholder。 | ✅ PASS |
   274|| 5 | 30 套模板圖資連接策略 | 新增 `public/template-gallery-hero/{industry}/{slug}.jpg` 30 張壓縮 hero 圖；套用時同源 fetch → dataURL → 寫入 media，供 Preview/ZIP/OG 共用。 | ✅ PASS |
   275|| 6 | typecheck | `npm run typecheck` exit 0。 | ✅ PASS |
   276|| 7 | build | `npm run build` exit 0；Next.js 16.2.4 compiled successfully；`/`、`/builder` static prerendered。 | ✅ PASS |
   277|| 8 | live HTTP | `/` HTTP 200；`/builder` HTTP 200；`/template-gallery-hero/drink-shop/drink-boba-neon.jpg` HTTP 200。 | ✅ PASS |
   278|| 9 | Vercel Preview | Deployment UID `D49fFi48bgLP8DMNeZqmEfwnf74o` Ready；Preview 可公開開啟。 | ✅ PASS |
   279|
   280|結論：Jason 指出的模板接線問題已修復；30 套 AI 模板現在套用後會同步模板名稱、版型、色盤、hero 主視覺、SEO OG 圖與 ZIP media 資料流。
   281|
   282|
   283|
   284|---
   285|
   286|## v0.1.2 Template Binding + Mobile UX QA
   287|
   288|測試日期：2026-05-08 21:26 CST
   289|正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
   290|QA runtime：WSL-native mirror `/tmp/store-site-builder-v012`（避免 Windows 掛載路徑 Next server hang）
   291|QA artifacts：`qa-artifacts/v0.1.2/`
   292|
   293|| # | 驗收項目 | 實測結果 | 狀態 |
   294||---|---|---|---|
   295|| 1 | TemplatePreset 型別系統 | `TemplateCatalogItem + themePreset + backgroundPreset + typographyPreset + componentStylePreset + layoutFamily + exportStylePreset` 已建立並接到 30 套模板 enrich flow。 | ✅ PASS |
   296|| 2 | 套用模板不破壞使用者內容 | `applyTemplatePreset()` 保留店名、菜單、圖片、連結、SEO、FAQ，只更新 template/theme/visual/media/hero/OG。 | ✅ PASS |
   297|| 3 | Preview 樣式同步 | 三個 React template renderer 已接 `getTemplateVisualStyle(data)`，背景、card、border、shadow、button band、nav、hero-grid、heading scale 改由 template preset 生成。 | ✅ PASS |
   298|| 4 | Export HTML 樣式同步 | `exportStaticSite.ts` 使用同一套 visual style；ZIP HTML 含 gradient、assets 引用、card radius/shadow CSS。 | ✅ PASS |
   299|| 5 | 六模板實測 | 抹茶日和、珍珠霓光、金色晚宴、香辣市集、白瓷濾杯、城市黑白均可套用並產生 Preview 截圖。 | ✅ PASS |
   300|| 6 | Mobile Builder 390px | Playwright 390×900：`scrollWidth=390`、`innerWidth=390`、`noHorizontalOverflow=true`。 | ✅ PASS |
   301|| 7 | Mobile Builder 320px | Playwright 320×780：`scrollWidth=320`、`innerWidth=320`、`noHorizontalOverflow=true`。 | ✅ PASS |
   302|| 8 | Preview 返回按鈕 | 390px mobile preview mode 實測 `backVisible=true`，可看到返回編輯入口。 | ✅ PASS |
   303|| 9 | ZIP 匯出 | `store-site-builder-v0.1.2-export.zip` 含 `README.txt`、`index.html`、`siteData.json`、`assets/template-artwork-cafe-urban-monochrome.jpg`。 | ✅ PASS |
   304|| 10 | Forbidden keyword | 匯出 HTML 無 `localhost`、無 `127.0.0.1`、無 `/_next`。 | ✅ PASS |
   305|| 11 | file:// 離線開啟 | 解壓至 `/tmp/store-site-builder-v012-export-check` 後，`file:///tmp/store-site-builder-v012-export-check/index.html` 可開啟，title 正常。 | ✅ PASS |
   306|| 12 | typecheck | 正式 repo 執行 `npm run typecheck`，`tsc --noEmit` exit 0。 | ✅ PASS |
   307|| 13 | build | 正式 repo 執行 `npm run build`，Next.js 16.2.4 compiled successfully，`/`、`/builder` static prerendered。 | ✅ PASS |
   308|
   309|QA artifact 清單：
   310|
   311|- `01-builder-desktop-overview.png`
   312|- `02-template-gallery-desktop.png`
   313|- `template-matcha.png`
   314|- `template-pearl-neon.png`
   315|- `template-gold-dinner.png`
   316|- `template-spicy-market.png`
   317|- `template-white-cafe.png`
   318|- `template-city-mono.png`
   319|- `09-mobile-390-builder.png`
   320|- `10-mobile-390-preview-back.png`
   321|- `11-mobile-320-builder.png`
   322|- `store-site-builder-v0.1.2-export.zip`
   323|- `qa-v012-summary.json`
   324|
   325|結論：v0.1.2 Template Binding + Mobile UX 修復在正式 repo build/typecheck 與 WSL-native browser QA 均通過；可進入 commit、push、PR 更新與 Vercel Preview redeploy。
   326|
   327|
   328|---
   329|
   330|## v0.1.3 Template Polish + Copy + Preview Layout QA
   331|
   332|測試日期：2026-05-08 22:50 CST
   333|正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
   334|本輪目標：模板中文文案、Hero 中文排版、AI artwork treatment、圖片主導畫廊、手機 UX、exportStaticSite 同步修復。
   335|
   336|### Build / Typecheck
   337|- `npm run typecheck`：PASS
   338|- `npm run build`：PASS（Next.js 16.2.4，`/`、`/builder` static prerendered）
   339|
   340|### 文案 QA
   341|- 30 套模板 `shortDescription` / `longDescription` 已改為正式中文。
   342|- `styleTags` / `badges` 已中文化。
   343|- 禁止字樣未出現在使用者展示文案：AI-designed、website template key visual、showcase image、concept image、premium AI、Create a、for a brand called。
   344|
   345|### Preview / Hero QA（6 套）
   346|- 抹茶日和：Hero readable=true，h1=208x80，treatment=soft-card-artwork。
   347|- 珍珠霓光：Hero readable=true，h1=196x83，treatment=hero-floating-artwork。
   348|- 茶霧山嵐：Hero readable=true，h1=197x74，treatment=editorial-split。
   349|- 金色晚宴：Hero readable=true，h1=294x74，treatment=dark-full-bleed。
   350|- 白瓷濾杯：Hero readable=true，h1=197x74，treatment=soft-card-artwork。
   351|- 城市黑白：Hero readable=true，h1=197x74，treatment=soft-card-artwork。
   352|
   353|### Mobile QA
   354|- 390px：scrollWidth=390 / innerWidth=390，無水平破版。
   355|- 320px：scrollWidth=320 / innerWidth=320，無嚴重水平破版。
   356|- Preview 返回編輯：PASS。
   357|- Template Preview Modal 返回模板庫：PASS。
   358|
   359|### Export / file:// QA
   360|- 六套模板均成功匯出 ZIP：抹茶日和、珍珠霓光、茶霧山嵐、金色晚宴、白瓷濾杯、城市黑白。
   361|- 六套 ZIP 均含 `README.txt`、`index.html`、`siteData.json` 與 AI artwork assets。
   362|- `index.html` 具備 Hero readable CSS：`clamp(...)`、`word-break:keep-all`、`overflow-wrap:normal`。
   363|- 掃描結果：無 `localhost`、無 `127.0.0.1`、無 `/_next`。
   364|- `file://` 抽樣開啟：PASS；AI artwork 顯示；390px 無水平破版。
   365|
   366|### QA artifacts
   367|- `qa-artifacts/v0.1.3/qa-v013-summary.json`
   368|- 13 張 QA 截圖：desktop overview、portfolio wall、modal back、6 模板、390 preview、320 builder、file export mobile。
   369|- 6 個 ZIP：`export-matcha.zip`、`export-pearl-neon.zip`、`export-tea-mist.zip`、`export-gold-dinner.zip`、`export-white-dripper.zip`、`export-city-mono.zip`。
   370|
   371|
   372|## v0.1.3 退回修正補驗（2026-05-08T15:28:42.923Z）
   373|
   374|- 修正範圍：移除 UI bundle 中所有 AI prompt metadata（templateCatalog/templateArtworkManifest 不再輸出 prompt 欄位），新增 /__version 版本頁，降低 Hero H1 clamp 並補文字可讀 contrast/panel guard，同步 exportStaticSite。
   375|- 本機正式 repo 驗證：
   376|  - npm run typecheck：PASS
   377|  - npm run build：PASS（Next.js 16.2.4；/builder + /__version routes built）
   378|- Forbidden source/bundle scan：lib/components/app/pages/types 與 .next client/server bundle 對 AI-designed、AI-generated、website template key visual、website template showcase、concept image、showcase image、template artwork、premium AI、bold AI、Create a、for a brand called、prompt：0 hits。
   379|- 新增 live QA：scripts/qa-v013-live.ts，對 Vercel Preview /builder 實測 forbidden counts、6 模板 desktop/mobile H1 行數與 overflow、390/320 mobile、返回編輯、返回模板庫。
   380|### v0.1.3 Live Preview 補驗完成
   381|
   382|- Preview: https://store-site-builder-oft0j4io6-sportkk101-5719s-projects.vercel.app
   383|- /__version: v0.1.3 / commit 6e65b76fa182b56a7de950ac37793917e2f5061f
   384|- HTTP: `/` 200、`/builder` 200、`/__version` 200
   385|- Live forbidden string counts: AI-designed=0, AI-generated=0, website template key visual=0, website template showcase=0, concept image=0, showcase image=0, template artwork=0, premium AI=0, bold AI=0, Create a=0, for a brand called=0, prompt=0
   386|- Live Hero QA: 6/6 模板 desktop/mobile 均未一字一行、無水平 overflow；H1 行數均 <= 4；word-break=keep-all；overflow-wrap=normal。
   387|- Mobile QA: 390px / 320px 無水平 overflow；手機預覽模式可返回編輯；Preview modal 可返回模板庫。
   388|- Export QA: generated-site.zip 重新產出；index.html 無 localhost、127.0.0.1、/_next 與 forbidden AI prompt 字串；含 README.txt、siteData.json、assets/img-qa.png。
   389|- Artifacts: `qa-artifacts/v0.1.3/live-qa-result.json`、`qa-artifacts/v0.1.3/live-*.png`、`qa-artifacts/generated-site.zip`。
   390|
   391|---
   392|
   393|## v0.1.4 Visual Readability + Template Landing Polish QA
   394|
   395|測試日期：2026-05-09
   396|正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
   397|Preview：`https://store-site-builder-git-accepta-260340-sportkk101-5719s-projects.vercel.app`
   398|Commit：`d5aeff36300442f54b56615317fe7cd58f0b33de`
   399|
   400|### 修正範圍
   401|- 建立 `getReadableHeroTextStyle(templateItem)` readable guard：heading/subtitle/eyebrow/CTA/panel/overlay/decorative opacity。
   402|- 三個 React template renderer 統一 Hero hierarchy：badge → foreground h1 → subtitle → CTA row → artwork → decorative text。
   403|- 珍珠霓光專修：深色 panel、白色 foreground h1、cyan CTA、decorative text opacity 0.09、artwork 不壓文字。
   404|- Mobile Hero 一律上下排列，h1 使用 `clamp(32px,9vw,46px)`、`line-height:1.12`、`word-break:keep-all`、`text-wrap:balance`。
   405|- `lib/exportStaticSite.ts` 同步 Preview 樣式與 mobile guard，避免只修 Builder Preview。
   406|
   407|### Build / Export
   408|- `npm run typecheck`：PASS
   409|- `npm run build`：PASS（Next.js 16.2.4 compiled successfully）
   410|- `scripts/qa-v014-export.ts`：PASS
   411|- 珍珠霓光 ZIP：`qa-artifacts/v0.1.4/export-pearl-neon.zip`
   412|- file:// mobile：h1Lines=2、h1Opacity=0.98、subtitleVisible=true、ctaVisible=true、imageVisible=true、scrollWidth=390/innerWidth=390。
   413|- Export forbidden：無 `localhost`、無 `127.0.0.1`、無 `/_next`；AI-designed、AI-generated、website template key visual、concept image、showcase image、prompt 全 0。
   414|
   415|### Live Preview QA（10 套）
   416|- `scripts/qa-v014-live.ts`：PASS (`ok=true`)
   417|- `/__version`：v0.1.4 / `d5aeff36300442f54b56615317fe7cd58f0b33de`
   418|- 10 套模板實測：抹茶日和、珍珠霓光、果香樂園、白桃氣泡、茶霧山嵐、金色晚宴、香辣市集、白瓷濾杯、城市黑白、北歐晨光。
   419|- 每套 desktop/mobile：h1 visible、h1 <= 4 行、非一字一行、subtitle readable、CTA visible、artworkDoesNotCoverText=true、無水平 overflow。
   420|- 390px：scrollWidth=390 / innerWidth=390。
   421|- 320px：scrollWidth=320 / innerWidth=320。
   422|- 返回按鈕：返回編輯 visible，tap target 114.5×44；返回模板庫 visible，tap target 322×54。
   423|
   424|### QA artifacts
   425|- `qa-artifacts/v0.1.4/live-qa-result.json`
   426|- `qa-artifacts/v0.1.4/live-*.png`（10 套 desktop/mobile + version）
   427|- `qa-artifacts/v0.1.4/export-pearl-neon-file-mobile.png`
   428|- `qa-artifacts/v0.1.4/export-qa-result.json`
   429|- `qa-artifacts/v0.1.4/export-pearl-neon.zip`
   430|
   431|結論：v0.1.4 Visual Readability + Template Landing Polish 已通過 build/export/live QA，可再次提交 Jason 視覺驗收。
   432|
   433|
   434|---
   435|
   436|## v0.1.5 Template Backplate / Background System QA
   437|
   438|測試日期：2026-05-09
   439|正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
   440|QA artifacts：`qa-artifacts/v0.1.5/`
   441|
   442|### 修正範圍
   443|- 新增 `TemplateBackplatePreset` 型別，描述 page / hero / sections / decorative 四層背板。
   444|- 新增 `lib/templateBackplateStyles.ts`，集中產出 `pageStyle`、`heroStyle`、`sectionStyle`、`cardStyle`、`decorativeLayers`、`mobileHeroStyle`、`exportCssVariables`。
   445|- 30 套模板皆透過 catalog/enrich flow 取得 backplate preset；7 套指定模板完成實測：珍珠霓光、抹茶日和、白桃氣泡、茶霧山嵐、金色晚宴、白瓷濾杯、城市黑白。
   446|- 三個 React template renderer 與 `exportStaticSite.ts` 共用同一套 backplate system，避免 Preview / Export 分叉。
   447|- Quick Preview Modal 改為同時展示原 artwork、實際網站 Hero 示意與手機套用示意，不再只顯示展示圖。
   448|- 珍珠霓光專修為 dark neon stage：紫藍霓虹 radial glow、深色 glass card、cyan/magenta CTA、artwork 作為主要背景視覺。
   449|
   450|### Build / Export QA
   451|- `npm run typecheck`：PASS
   452|- `npm run build`：PASS（Next.js 16.2.4 compiled successfully；`/`、`/builder` static prerendered；`/__version` server-rendered）
   453|- `npm exec -- tsx scripts/qa-v015-export.ts`：PASS (`ok=true`)
   454|- Export 7/7 模板：file:// 390px 可開啟、H1 visible、H1 <= 4 行、subtitle visible、CTA visible、image visible、heroBackplate 非純色、無水平 overflow。
   455|- Export forbidden：無 `localhost`、無 `127.0.0.1`、無 `/_next`；AI-designed、AI-generated、website template key visual、concept image、showcase image、prompt 全 0。
   456|
   457|### QA artifacts
   458|- `qa-artifacts/v0.1.5/export-qa-result.json`
   459|- `qa-artifacts/v0.1.5/export-{drink-boba-neon,drink-matcha-hiyori,drink-white-peach-sparkle,drink-tea-mist-ridge,restaurant-golden-banquet,cafe-white-dripper,cafe-urban-monochrome}.zip`
   460|- `qa-artifacts/v0.1.5/export-*-file-mobile.png`
   461|- `scripts/qa-v015-live.ts` 已新增，供 Vercel Preview live QA 使用。
   462|
   463|結論：v0.1.5 Template Backplate / Background System 本機 build/export QA 通過；下一步為 commit/push、Vercel Preview 部署與 live QA。
   464|
   465|### Live Preview QA（7 套）
   466|- Preview：`https://store-site-builder-git-accepta-260340-sportkk101-5719s-projects.vercel.app`
   467|- Vercel deployment host：`store-site-builder-110th3n1y-sportkk101-5719s-projects.vercel.app`
   468|- `/__version`：v0.1.5 / commit `2a0a7416d554165006889e107be35e53ef395515` / branch `acceptance/store-site-builder-mvp`
   469|- HTTP：`/` 200、`/builder` 200、`/__version` 200
   470|- `PREVIEW_URL=... npm exec -- tsx scripts/qa-v015-live.ts`：PASS (`ok=true`)
   471|- 7 套模板實測：抹茶日和、珍珠霓光、白桃氣泡、茶霧山嵐、金色晚宴、白瓷濾杯、城市黑白。
   472|- 每套 desktop/mobile：backplate 非純色、H1 visible、H1 <= 4 行、非一字一行、subtitle readable、CTA visible、無水平 overflow。
   473|- 390px：scrollWidth=390 / innerWidth=390；320px：scrollWidth=320 / innerWidth=320。
   474|- Quick Preview Modal：實際網站 Hero 示意與手機套用示意均 visible；返回模板庫 visible。
   475|- Live forbidden：AI-designed、AI-generated、website template key visual、concept image、showcase image、prompt 全 0。
   476|
   477|### Live artifacts
   478|- `qa-artifacts/v0.1.5/live-qa-result.json`
   479|- `qa-artifacts/v0.1.5/live-*.png`（7 套 desktop/mobile + version + quick preview modal）
   480|
   481|結論：v0.1.5 Template Backplate / Background System 已通過 build、export QA 與 Vercel Preview live QA，可提交 Jason 驗收。
   482|
   483|
   484|---
   485|
   486|## v0.1.5.1 Artwork-as-Source-of-Truth QA
   487|
   488|測試日期：2026-05-09
   489|正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
   490|QA artifacts：`qa-artifacts/v0.1.5/`
   491|
   492|### 修正範圍
   493|- 新增 `TemplateArtworkBackplate` type。
   494|- 新增 `lib/templateArtworkResolver.ts`，統一解析 `gallerySrc` / `previewSrc` / `exportSrc` / `mobileSrc` / `desktopSrc`。
   495|- `enrichTemplate.ts`、`applyTemplatePreset.ts` 停止把 gallery artwork 轉成另一張 hero jpg；Preview Hero 直接使用 gallery artwork。
   496|- `StoreWebsiteRenderer` 旗下三個模板 renderer 的第一屏 Hero 已改為 `.template-hero-backplate` full-cover artwork backplate。
   497|- `TemplatePreviewModal.tsx` 改為左側 gallery artwork、右側 actual applied Hero preview。
   498|- `exportStaticSite.ts` / `exportZip.ts` 輸出 same artwork asset 到 ZIP `assets/template-artwork-*.png`。
   499|- 新增 `scripts/qa-template-parity.ts`。
   500|
   501|### Build
   502|- `npm run typecheck`：PASS
   503|- `npm run build`：PASS
   504|
   505|### Visual Parity QA（9 套）
   506|- `qa-artifacts/v0.1.5/template-parity-result.json`：PASS
   507|- 9/9 Gallery / Preview / Export 同源：PASS
   508|- 9/9 Preview Hero artwork 面積 >= 40%（實測約 58%）：PASS
   509|- 9/9 Export Hero artwork 面積 >= 40%（實測約 99%）：PASS
   510|- 9/9 Mobile readable：PASS
   511|- 9/9 Export file://：PASS
   512|- 測試模板：抹茶日和、珍珠霓光、果香樂園、黑糖琥珀、白桃氣泡、茶霧山嵐、金色晚宴、白瓷濾杯、城市黑白
   513|
   514|### QA artifacts
   515|- `qa-artifacts/v0.1.5/template-parity-result.json`
   516|- `qa-artifacts/v0.1.5/parity-*-gallery.png`（9 張）
   517|- `qa-artifacts/v0.1.5/parity-*-preview-hero.png`（9 張）
   518|- `qa-artifacts/v0.1.5/parity-*-mobile-hero.png`（9 張）
   519|- `qa-artifacts/v0.1.5/parity-*-export-index.png`（9 張）
   520|
   521|### Forbidden strings
   522|- AI-designed：0
   523|- AI-generated：0
   524|- website template key visual：0
   525|- concept image：0
   526|- showcase image：0
   527|- prompt：0
   528|
   529|結論：v0.1.5.1 Artwork-as-Source-of-Truth 本機 build 與 9 套 Visual Parity QA 通過；下一步為 commit/push、Vercel Preview 部署與 live verification。
   530|
   531|---
   532|
   533|## v0.1.6 Full Template Skin System QA
   534|
   535|測試日期：2026-05-09
   536|正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
   537|QA artifacts：`qa-artifacts/v0.1.6/`（依 .gitignore 不納入 repo）
   538|QA result：`qa-artifacts/v0.1.6/template-skin-result.json`
   539|
   540|| # | 驗收項目 | 結果 | 狀態 |
   541||---|---|---|---|
   542|| 1 | `TemplateSkinPreset` 型別 | `types/template.ts` 已新增完整 skin preset：surface、section、card、menu、footer、placeholder、button、border 等全站 token。 | ✅ PASS |
   543|| 2 | `getTemplateSkin()` | `lib/templateSkin.ts` 已建立，9 套指定模板各自 mapping；非指定模板可依 themeType fallback。 | ✅ PASS |
   544|| 3 | React Preview 全站套 skin | `FullSkinTemplate` 統一套用 Hero、section background、product cards、menu list、placeholder、footer；三個舊 renderer 改為 thin wrapper。 | ✅ PASS |
   545|| 4 | Placeholder 主題化 | `ThemedPlaceholderImage` 已取代通用「StoreSite Builder」字樣，QA 檢查 `data-store-site-text=false` 且 preview/export text 不含 StoreSite Builder。 | ✅ PASS |
   546|| 5 | Product cards 非通用白卡 | 9 套 preview 均有 `data-product-card-skin=true` 且 card background / border 由 skin token 生成。 | ✅ PASS |
   547|| 6 | Menu list 套模板 skin | 9 套 preview/export 均有 `data-menu-list-skin=true` 且 background 不透明。 | ✅ PASS |
   548|| 7 | Section background 套模板 | 9 套 preview/export 均有 `.skin-section` 且 section background 由 skin token 控制。 | ✅ PASS |
   549|| 8 | Footer 套模板 | 9 套 preview/export 均有 `data-footer-skin=true` 且 footer background 由 skin token 控制。 | ✅ PASS |
   550|| 9 | Export 全站套 skin | `exportStaticSite.ts` 已同步 Full Skin HTML/CSS；export HTML 含 `data-full-skin=true`、`skin-product-card`、`themed-placeholder` 與對應 artwork asset。 | ✅ PASS |
   551|| 10 | Quick Preview Modal 三段對照 | Modal 改為 Gallery artwork + Hero preview + Section preview，QA 9 套皆檢出 `data-modal-section-renderer=true`。 | ✅ PASS |
   552|| 11 | 9 套模板完整驗收 | 抹茶日和、珍珠霓光、果香樂園、黑糖琥珀、白桃氣泡、茶霧山嵐、金色晚宴、白瓷濾杯、城市黑白：`ok=true`。 | ✅ PASS |
   553|| 12 | 390px RWD | 9 套 Preview 390px 與 9 套 Export 390px 均 `scrollWidth <= innerWidth`。 | ✅ PASS |
   554|| 13 | QA artifacts | 產出 9 張 preview full page、9 張 export index full page、9 張 Quick Preview modal 截圖與 `template-skin-result.json`。 | ✅ PASS |
   555|| 14 | `npm run typecheck` | 正式 repo 執行 `tsc --noEmit` exit 0。 | ✅ PASS |
   556|| 15 | `npm run build` | 正式 repo Next.js 16.2.4 build successful；`/`、`/builder` static prerendered，`/__version` dynamic。 | ✅ PASS |
   557|
   558|結論：v0.1.6 Full Template Skin System 本機正式 repo 驗證通過；可進入 commit / PR 更新 / Vercel Preview redeploy / live QA。
   559|
   560|---
   561|
   562|## v0.2.0 Full Visual Template Engine QA
   563|
   564|測試日期：2026-05-09
   565|正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
   566|QA artifacts：`qa-artifacts/v0.2.0/`
   567|
   568|| # | 驗收項目 | 結果 | 狀態 |
   569||---|---|---|---|
   570|| 1 | TemplateSkinEngine | `lib/templateSkinEngine.ts` 完成；輸出 getTemplateSkin / getTemplateCssVariables / getTemplateComponentClasses / getThemedPlaceholder / getExportTemplateCss。 | ✅ PASS |
   571|| 2 | 10/11 skin family | soft-matcha、neon-dark、fruit-bright、amber-brown、peach-pastel、tea-mist-premium、luxury-black-gold、charcoal-grill、urban-casual、ceramic-minimal、monochrome-editorial 完成。 | ✅ PASS |
   572|| 3 | 30 套模板 mapping | `templateCatalog` 30/30 皆有 skinId / skinFamily；無 default white fallback。 | ✅ PASS |
   573|| 4 | Product cards | 10 套代表模板 computed style 全部有 skin，styleDiversity.product=10。 | ✅ PASS |
   574|| 5 | Menu list | 10 套代表模板 computed style 全部有 skin，styleDiversity.menu=10。 | ✅ PASS |
   575|| 6 | Placeholder | `data-store-site-text=false`；無 StoreSite Builder placeholder 字樣。 | ✅ PASS |
   576|| 7 | Footer / Section | footer / section computed style 全部依 skin，styleDiversity.section=10、footer=10。 | ✅ PASS |
   577|| 8 | ExportStaticSite | Export HTML 使用同一 skin engine，含 data-skin-family、skin-product-card、skin-menu-list、artwork asset。 | ✅ PASS |
   578|| 9 | Forbidden strings | live DOM 與 export HTML forbidden strings = 0；無 localhost / 127 / _next。 | ✅ PASS |
   579|| 10 | RWD | 10 套代表模板 390px 與 320px scrollWidth == innerWidth。 | ✅ PASS |
   580|| 11 | QA script | Local WSL mirror 與最新 Vercel Preview 均執行 `npx tsx scripts/qa-full-template-skin.ts` exit 0。 | ✅ PASS |
   581|| 12 | 截圖 | `qa-artifacts/v0.2.0/visual-skin/` 已產出 50 張（10 套 × gallery/hero/products/menu/export-products）。 | ✅ PASS |
   582|| 13 | Typecheck / Build | `npm run typecheck && npm run build` exit 0；Next.js 16.2.4 compiled successfully。 | ✅ PASS |
   583|
   584|QA 結果檔：`qa-artifacts/v0.2.0/full-template-skin-result.json`
   585|視覺截圖目錄：`qa-artifacts/v0.2.0/visual-skin/`
   586|
   587|---
   588|
   589|## v0.2.1 30/30 Template Visual Completion Gate QA
   590|
   591|測試日期：2026-05-09
   592|正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
   593|QA runtime：WSL-native mirror `/tmp/store-site-builder-v021`（避免 Windows 掛載路徑 Next server hang）
   594|QA artifacts：`qa-artifacts/v0.2.1/`
   595|QA result：`qa-artifacts/v0.2.1/all-templates-visual-result.json`
   596|
   597|| # | 驗收項目 | 結果 | 狀態 |
   598||---|---|---|---|
   599|| 1 | 30/30 Template Visual Contract | `lib/templateVisualContracts.ts` 建立 30 套逐套 contract；每套含 sourceArtwork、visualIdentity、page/header/hero/section/product/menu/placeholder/exportRequirement。 | ✅ PASS |
   600|| 2 | 禁止 generic/default fallback | `getTemplateVisualContract()` 對缺漏 templateId 直接 throw；`assertTemplateVisualContractComplete()` 強制檢查 contract 完整度。 | ✅ PASS |
   601|| 3 | Renderer 綁定 contract | React Preview root、product card、menu list、placeholder、footer 皆帶 `data-visual-contract-id`；skin mood 由各模板 palette/contract 套用。 | ✅ PASS |
   602|| 4 | Export 綁定 contract | `exportStaticSite.ts` 輸出 `data-visual-contract-id`、`data-skin-family`、product/menu/placeholder/footer skin markers，並使用同源 artwork。 | ✅ PASS |
   603|| 5 | 30 套全量 QA | `scripts/qa-all-templates-visual.ts` 實測 30/30 passed；不抽樣、不代表、不 golden templates。 | ✅ PASS |
   604|| 6 | Live Preview / Export / Mobile | 每套均通過 live preview HTTP、export HTML、mobile 390px、mobile 320px、hero artwork、product cards、menu list、placeholder、footer 檢查。 | ✅ PASS |
   605|| 7 | 截圖數量 | `qa-artifacts/v0.2.1/visual-30/` 產出 150 張 PNG（30 套 × gallery / preview-hero / preview-products / preview-menu / export）。 | ✅ PASS |
   606|| 8 | 視覺差異度 | `uniqueProductBackgrounds=29`，代表 product cards 不是全模板共用同一個白卡/通用皮膚。 | ✅ PASS |
   607|| 9 | Forbidden strings | StoreSite Builder placeholder / AI-designed / AI-generated / localhost / 127.0.0.1 / /_next 全部 0。 | ✅ PASS |
   608|| 10 | `npm run typecheck` | 正式 repo 執行 `tsc --noEmit` exit 0。 | ✅ PASS |
   609|| 11 | `npm run build` | 正式 repo Next.js 16.2.4 build successful；`/`、`/builder` static prerendered，`/__version` dynamic。 | ✅ PASS |
   610|
   611|QA summary：
   612|
   613|```json
   614|{
   615|  "ok": true,
   616|  "liveStatus": 200,
   617|  "totalTemplates": 30,
   618|  "passedTemplates": 30,
   619|  "failedTemplates": 0,
   620|  "screenshotCount": 150,
   621|  "uniqueProductBackgrounds": 29,
   622|  "forbiddenCounts": {
   623|    "StoreSite Builder placeholder": 0,
   624|    "AI-designed": 0,
   625|    "AI-generated": 0,
   626|    "website template key visual": 0,
   627|    "concept image": 0,
   628|    "prompt": 0,
   629|    "localhost": 0,
   630|    "127.0.0.1": 0,
   631|    "/_next": 0
   632|  }
   633|}
   634|```
   635|
   636|結論：v0.2.1 30/30 Template Visual Completion Gate 本機正式 repo 驗證通過；可進入 commit / PR 更新 / Vercel Preview redeploy / live QA。
   637|
   638|---
   639|
   640|## v0.2.2 Desktop Preview Engine QA
   641|
   642|測試日期：2026-05-10
   643|範圍限制：本輪只修「全螢幕桌機預覽」，未修改模板、skin、exportStaticSite、未新增模板或 AI 圖。
   644|
   645|### Build
   646|- `npm run typecheck`：PASS
   647|- `npm run build`：PASS
   648|
   649|### Desktop Preview QA
   650|- QA script：`scripts/qa-desktop-preview.ts`
   651|- Local QA URL：`http://127.0.0.1:3202`（WSL-native runtime mirror）
   652|- Result JSON：`qa-artifacts/v0.2.2/desktop-preview-result.json`
   653|- `fullscreenButtonVisible`：true
   654|- `fullscreenButtonClickable`：true
   655|- `previewRouteWorks`：true
   656|- `backToBuilderWorks`：true
   657|- `viewport1440Works`：true
   658|- `viewport1280Works`：true
   659|- `viewport1024Works`：true
   660|- `viewport390Works`：true
   661|- `fitZoomWorks`：true
   662|- `zoom100Works`：true
   663|- `zoom75Works`：true
   664|- `zoom50Works`：true
   665|
   666|### Screenshots
   667|- `qa-artifacts/v0.2.2/desktop-preview/builder-preview-panel-with-fullscreen-button.png`
   668|- `qa-artifacts/v0.2.2/desktop-preview/preview-route-1440.png`
   669|- `qa-artifacts/v0.2.2/desktop-preview/preview-route-1280.png`
   670|- `qa-artifacts/v0.2.2/desktop-preview/preview-route-1024.png`
   671|- `qa-artifacts/v0.2.2/desktop-preview/preview-route-390.png`
   672|- `qa-artifacts/v0.2.2/desktop-preview/preview-back-button.png`
   673|- `qa-artifacts/v0.2.2/desktop-preview/builder-after-back.png`
   674|
   675|---
   676|
   677|## v0.2.3 Fullscreen Preview Data Binding QA
   678|
   679|測試日期：2026-05-10
   680|範圍限制：本輪只修 `/preview` 全螢幕預覽資料綁定；未修改 30 套模板資料、TemplateSkinEngine、Product cards、Menu list、ExportStaticSite、Template catalog、Skin family、登入/付款/資料庫。
   681|
   682|### Build
   683|- `npm run typecheck`：PASS
   684|- `npm run build`：PASS
   685|
   686|### Data Binding 修復
   687|- `/builder` 點「全螢幕預覽」前：`saveSiteData(data)`
   688|- `/preview`：直接讀同一個 `STORAGE_KEY = store-site-builder-data`
   689|- `/preview`：localStorage 不存在時顯示「尚未載入 Builder 資料，請返回 Builder 建立網站。」
   690|- `/preview`：移除手刻 demo hero、`Fullscreen Desktop Preview` 網站內容、普通漸層 placeholder
   691|- Builder 右側 Preview 與 `/preview` 共用 `components/preview/PreviewCanvas.tsx`
   692|- `PreviewCanvas` render `StoreWebsiteRenderer`，並標示 `data-template-id`、`data-skin-family`、`data-artwork-src`
   693|
   694|### Binding QA
   695|- QA script：`scripts/qa-fullscreen-preview-binding.ts`
   696|- Result JSON：`qa-artifacts/v0.2.3/fullscreen-preview-binding-result.json`
   697|- `ok`：true
   698|- `testedTemplates`：5
   699|- `builderAndPreviewTemplateMatch`：true
   700|- `previewUsesLocalStorageSiteData`：true
   701|- `previewUsesStoreWebsiteRenderer`：true
   702|- `noDemoHeroContent`：true
   703|- `noDefaultGradientPlaceholder`：true
   704|
   705|### 5 套模板
   706|- 白桃氣泡：`drink-white-peach-sparkle` / `peach-pastel` / artwork match PASS
   707|- 珍珠霓光：`drink-boba-neon` / `neon-dark` / artwork match PASS
   708|- 日常一隅：`cafe-daily-corner` / `urban-casual` / artwork match PASS
   709|- 城市黑白：`cafe-urban-monochrome` / `monochrome-editorial` / artwork match PASS
   710|- 金色晚宴：`restaurant-golden-banquet` / `luxury-black-gold` / artwork match PASS
   711|
   712|### Screenshots
   713|- `qa-artifacts/v0.2.3/fullscreen-preview-binding/builder-white-peach-selected.png`
   714|- `qa-artifacts/v0.2.3/fullscreen-preview-binding/preview-white-peach-1440.png`
   715|- `qa-artifacts/v0.2.3/fullscreen-preview-binding/builder-boba-neon-selected.png`
   716|- `qa-artifacts/v0.2.3/fullscreen-preview-binding/preview-boba-neon-1440.png`
   717|- `qa-artifacts/v0.2.3/fullscreen-preview-binding/builder-daily-corner-selected.png`
   718|- `qa-artifacts/v0.2.3/fullscreen-preview-binding/preview-daily-corner-1440.png`
   719|- `qa-artifacts/v0.2.3/fullscreen-preview-binding/preview-mobile-390.png`
   720|- `qa-artifacts/v0.2.3/fullscreen-preview-binding/preview-back-to-builder.png`
   721|
   722|---
   723|
   724|## v0.2.4 Fullscreen Preview Entry + Mobile Tap QA
   725|
   726|測試日期：2026-05-10
   727|範圍限制：本輪只修全螢幕預覽入口、手機點擊事件、/preview 路由、PreviewCanvas 桌機置中與目前 Builder siteData 綁定；未修改模板 skin、30 套模板內容、AI artwork、商品卡、菜單列表、ExportStaticSite、登入/付款/資料庫。
   728|
   729|### Build
   730|- `npm run typecheck`：PASS
   731|- `npm run build`：PASS
   732|
   733|### Entry / Tap 修復
   734|- 桌機入口：`data-testid=fullscreen-preview-button`，same-page navigation 到 `/preview?mode=desktop&viewport=1440`
   735|- 手機入口：`data-testid=mobile-fullscreen-preview-button`，sticky toolbar 可見，點擊區 >= 48px，`pointer-events:auto`，same-page navigation 到 `/preview?mode=mobile&viewport=390`
   736|- 入口資料保存：點擊前 `saveSiteData(data)`，並同步寫入 `sessionStorage[store-site-builder-preview-data]`
   737|- `/preview` 讀取順序：sessionStorage preview data → localStorage store-site-builder-data → 缺資料提示返回 Builder
   738|- `/preview` 返回：`data-testid=preview-back-to-builder`，返回後 localStorage 不清空，模板保留
   739|- `PreviewCanvas`：新增 `data-testid=preview-stage`、`preview-scale-wrapper`、`desktop-preview-canvas`；desktop canvas `data-viewport-width=1440`；transform-origin top center；置中 PASS
   740|
   741|### QA
   742|- QA script：`scripts/qa-fullscreen-entry.ts`
   743|- Result JSON：`qa-artifacts/v0.2.4/fullscreen-entry-result.json`
   744|- `ok`：true
   745|- `mobileButtonVisible`：true
   746|- `mobileButtonClickable`：true
   747|- `mobilePreviewRouteWorks`：true
   748|- `desktopButtonVisible`：true
   749|- `desktopButtonClickable`：true
   750|- `desktopPreviewRouteWorks`：true
   751|- `backToBuilderWorks`：true
   752|- `desktopCanvas1440`：true
   753|- `desktopCanvasCentered`：true
   754|- `mobile390NoOverflow`：true
   755|
   756|### 3 套模板
   757|- 香辣市集：`restaurant-spicy-market` / mobile tap PASS / preview same template PASS / back PASS
   758|- 白桃氣泡：`drink-white-peach-sparkle` / mobile tap PASS / preview same template PASS / back PASS
   759|- 日常一隅：`cafe-daily-corner` / mobile tap PASS / preview same template PASS / back PASS
   760|
   761|### Screenshots
   762|- `qa-artifacts/v0.2.4/fullscreen-entry/mobile-builder-preview-with-fullscreen-button.png`
   763|- `qa-artifacts/v0.2.4/fullscreen-entry/mobile-preview-route-390.png`
   764|- `qa-artifacts/v0.2.4/fullscreen-entry/mobile-preview-back-button.png`
   765|- `qa-artifacts/v0.2.4/fullscreen-entry/desktop-builder-preview-with-fullscreen-button.png`
   766|- `qa-artifacts/v0.2.4/fullscreen-entry/desktop-preview-route-1440.png`
   767|- `qa-artifacts/v0.2.4/fullscreen-entry/desktop-preview-canvas-centered.png`
   768|- `qa-artifacts/v0.2.4/fullscreen-entry/builder-after-back.png`
   769|
   770|---
   771|
   772|## v0.2.5 Desktop Layout Width / Full-Bleed Polish QA
   773|測試日期：2026-05-10
   774|正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
   775|QA runtime：WSL-native mirror `/tmp/store-site-builder-v025`（避免 Windows 掛載路徑 Next server hang）
   776|QA artifacts：`qa-artifacts/v0.2.5/`（local evidence；若 qa-artifacts 受 .gitignore 忽略，PR/回報列路徑）
   777|
   778|| 模板 | 1440 siteRootWidth | 1440 heroInnerWidth | 1440 sectionInnerWidth | 1280 siteRootWidth | 左右留白 OK | Export 同步 | 狀態 |
   779||---|---:|---:|---:|---:|---|---|---|
   780|| 白桃氣泡 | 1440 | 1296 | 1250 | 1280 | ✅ | ✅ | ✅ PASS |
   781|| 飲研實驗室 | 1440 | 1296 | 1250 | 1280 | ✅ | ✅ | ✅ PASS |
   782|| 午夜焙煎 | 1440 | 1296 | 1248 | 1280 | ✅ | ✅ | ✅ PASS |
   783|| 日常一隅 | 1440 | 1296 | 1250 | 1280 | ✅ | ✅ | ✅ PASS |
   784|| 鍋物暖居 | 1440 | 1296 | 1250 | 1280 | ✅ | ✅ | ✅ PASS |
   785|| 城市黑白 | 1440 | 1296 | 1248 | 1280 | ✅ | ✅ | ✅ PASS |
   786|
   787|驗證項目：
   788|
   789|- `npm run typecheck`：正式 repo 執行，exit 0。
   790|- `npm run build`：正式 repo 執行，Next.js 16.2.4 build successful。
   791|- Desktop container metrics：`desktopContentMaxWidth=1320px`、`desktopHeroMaxWidth=1360px`、`desktopSectionMaxWidth=1320px`。
   792|- Fullscreen Preview 1440/1280：6 套模板全部通過；1440 `siteRootWidth >= 1440`、`heroInnerWidth >= 1296`、`sectionInnerWidth >= 1248`。
   793|- Export width sync：`lib/exportStaticSite.ts` 使用同一 `generateTemplateSkinCss()` / `.template-hero-inner` / `.skin-section-inner` class system，避免 export 仍停留窄版。
   794|- 截圖：`qa-artifacts/v0.2.5/desktop-layout-width/` 共 12 張（6 套 × 1440/1280）。
   795|- 結果 JSON：`qa-artifacts/v0.2.5/desktop-layout-width-result.json`，`ok=true`、`testedTemplates=6`。
   796|
   797|結論：v0.2.5 桌機版內容寬度與 Hero / Section / Product grid 已從窄版 card 修正為桌機官網寬版；手機版與 fullscreen entry 未修改。
   798|
   799|---
   800|
   801|## v0.2.6 Mobile Fullscreen Hero Text Overflow Fix（2026-05-10）
   802|
   803|### 一、版本資訊
   804|- 版本：v0.2.6
   805|- 分支：`acceptance/store-site-builder-mvp`
   806|- 修復範圍：手機全螢幕預覽 Hero 文字 overflow；Preview 與 Export 手機版同步。
   807|
   808|### 二、Mobile Hero Overflow 修復
   809|- 新增 `lib/mobileHeroLayout.ts`：建立 390 / 375 / 320 viewport 的 Mobile Hero Layout Contract。
   810|- 新增 `lib/formatHeroTitleLines.ts`：將中文 Hero title 穩定分行，例如「每天一杯，日常更美好」→「每天一杯，」/「日常更美好」。
   811|- `ThemedHero.tsx`：新增 `data-testid="hero-title"`、`data-testid="hero-content-panel"`、`data-testid="hero-cta-row"`、`data-testid="hero-subtitle"`；手機 h1 使用 `.hero-title-line` 分行。
   812|- `templateSkinEngine.ts`：手機 Hero 改為 stacked/background artwork，不與文字左右並排；移除 mobile 固定 min-width/nowrap/keep-all 風險；content panel 加入 max-width、box-sizing、overflow guard；320px 針對 phone frame 內寬收斂。
   813|- `exportStaticSite.ts`：同步 Preview 的 Hero title line formatter、content panel testid、CTA row testid 與 mobile CSS guard。
   814|
   815|### 三、30 套模板全量結果
   816|- QA script：`scripts/qa-mobile-hero-overflow-all.ts`
   817|- 指令：`npx tsx scripts/qa-mobile-hero-overflow-all.ts http://127.0.0.1:3206`
   818|- Live Preview 指令：`npx tsx scripts/qa-mobile-hero-overflow-all.ts https://store-site-builder-bxsqc2292-sportkk101-5719s-projects.vercel.app` → PASS（30/30，90 screenshots）
   819|- totalTemplates：30
   820|- testedViewports：390 / 375 / 320
   821|- passed：30
   822|- failed：0
   823|- checks：bodyNoOverflow、canvasNoOverflow、heroTitleInsideCanvas、panelInsideCanvas、ctaInsideCanvas、lineCountOk、notSingleCharacterColumn、titleNotClipped、subtitleInsideCanvas、subtitleNotClipped、artworkVisible、exportSynced 全量 PASS。
   824|
   825|### 四、重點模板結果
   826|| 模板 | 390 | 375 | 320 | h1 在畫面內 | CTA 在畫面內 | 無水平 overflow |
   827||---|---:|---:|---:|---|---|---|
   828|| 抹茶日和 | PASS | PASS | PASS | 是 | 是 | 是 |
   829|| 珍珠霓光 | PASS | PASS | PASS | 是 | 是 | 是 |
   830|| 白桃氣泡 | PASS | PASS | PASS | 是 | 是 | 是 |
   831|| 茶霧山嵐 | PASS | PASS | PASS | 是 | 是 | 是 |
   832|| 日常一隅 | PASS | PASS | PASS | 是 | 是 | 是 |
   833|| 城市黑白 | PASS | PASS | PASS | 是 | 是 | 是 |
   834|| 金色晚宴 | PASS | PASS | PASS | 是 | 是 | 是 |
   835|| 飲研實驗室 | PASS | PASS | PASS | 是 | 是 | 是 |
   836|
   837|### 五、QA artifacts
   838|- Result JSON：`qa-artifacts/v0.2.6/mobile-hero-overflow-all-result.json`
   839|- 截圖資料夾：`qa-artifacts/v0.2.6/mobile-hero-overflow/`
   840|- 截圖數量：90（30 templates × 3 viewports）
   841|
   842|### 六、Build
   843|- `npm run typecheck`：PASS
   844|- `npm run build`：PASS（Next.js 16.2.4，Compiled successfully）
   845|
   846|### 七、結論
   847|- 30/30 templates × 3 viewport 全過。
   848|- Preview 與 Export 手機版同步通過。
   849|- 可送 Jason 驗收。
   850|---
   851|
   852|## v0.2.7 Homepage Landing Page Productization QA
   853|
   854|測試日期：2026-05-10T23:41:05+08:00
   855|正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
   856|Preview：https://store-site-builder-kpn3ccskq-sportkk101-5719s-projects.vercel.app
   857|Commit：`1d2c9f0d98981f9fb58e7aadc591a526a370fba6`
   858|QA artifacts：`qa-artifacts/v0.2.7/`
   859|
   860|| # | 驗收項目 | 實際結果 | 狀態 |
   861||---|---|---|---|
   862|| 1 | 首頁 Hero 重做 | `AI TEMPLATE WEBSITE BUILDER`、`30 分鐘建立小店家官方網站`、雙 CTA、4 個能力數據與 layered mockup 完成。 | ✅ PASS |
   863|| 2 | 30 套 AI 模板展示 | `30 套 AI 視覺模板，直接套用成品牌官網` 區塊完成；使用 public/template-gallery-ai 真實 artwork，展示 12 張，涵蓋飲料店/餐飲店/咖啡廳。 | ✅ PASS |
   864|| 3 | 三步驟流程 | 三步驟完成小店官網，以大數字與流程線呈現；手機直向堆疊。 | ✅ PASS |
   865|| 4 | 三大產業模板展示 | 飲料店 / 餐飲店 / 咖啡廳三區塊完成；每區含大圖、文案、3 個模板小圖與 Builder CTA。 | ✅ PASS |
   866|| 5 | Builder / Preview 展示 | 顯示 Builder 表單示意與 Preview 示意，文案包含即時同步、桌機/手機預覽、全螢幕預覽、localStorage 自動儲存。 | ✅ PASS |
   867|| 6 | 功能特色 | 8 項 icon grid 完成：欄位式建站、30 套 AI 模板、菜單/商品、圖片媒體、SEO、ZIP、手機 RWD、全螢幕預覽。 | ✅ PASS |
   868|| 7 | ZIP 匯出說明 | `generated-site.zip` 結構 mockup 完成；含無 localhost、無 /_next、file:// 可開啟、手機 RWD 通過。 | ✅ PASS |
   869|| 8 | 適合對象 / Final CTA / Footer | 適合對象 chips、Final CTA、Footer links 與 v0.2.7 顯示完成。 | ✅ PASS |
   870|| 9 | CTA：開始建立網站 | Playwright 點擊 `開始建立網站`，URL 成功進入 `/builder`。 | ✅ PASS |
   871|| 10 | CTA：瀏覽 30 套模板 | Playwright 點擊後成功 scroll 到模板展示區。 | ✅ PASS |
   872|| 11 | Mobile 390 無水平 overflow | `documentScrollWidth=390`、`bodyScrollWidth=390`、offenders=[]。 | ✅ PASS |
   873|| 12 | Mobile 375 無水平 overflow | `documentScrollWidth=375`、`bodyScrollWidth=375`、offenders=[]。 | ✅ PASS |
   874|| 13 | Mobile 320 無水平 overflow | `documentScrollWidth=320`、`bodyScrollWidth=320`、offenders=[]。 | ✅ PASS |
   875|| 14 | 本機 QA script | `scripts/qa-homepage-landing.ts http://127.0.0.1:3207`：ok=true，9 screenshots。 | ✅ PASS |
   876|| 15 | Live Preview QA script | `scripts/qa-homepage-landing.ts https://store-site-builder-kpn3ccskq-sportkk101-5719s-projects.vercel.app`：ok=true，9 screenshots。 | ✅ PASS |
   877|| 16 | `npm run typecheck` | `tsc --noEmit` exit 0。 | ✅ PASS |
   878|| 17 | `npm run build` | Next.js 16.2.4 Turbopack compiled successfully；`/` static prerendered。 | ✅ PASS |
   879|
   880|Artifacts：
   881|- JSON：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder/qa-artifacts/v0.2.7/homepage-landing-result.json`
   882|- 截圖資料夾：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder/qa-artifacts/v0.2.7/homepage/`
   883|- 截圖數量：9（desktop full/hero/template/industries/features/export + mobile 390/375/320）
   884|
   885|結論：v0.2.7 首頁產品化與 landing page RWD 驗收 PASS，可送 Jason 首頁視覺驗收。
   886|
   887|---
   888|
   889|## v0.2.8 Mobile Preview Frame Fix QA
   890|
   891|測試日期：2026-05-11
   892|正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
   893|修復目標：Jason 回報「預覽跟全螢幕預覽手機的版面都會破圖」。
   894|
   895|### 一、修復範圍
   896|- `components/preview/PreviewCanvas.tsx`：手機 frame 改為固定 390/375/320 對應高度，內容在 `preview-phone-viewport` 內滾動，不再撐長手機外框。
   897|- `components/preview/MobilePreview.tsx`：Builder 手機預覽改用同一個 phone frame / Fit scale。
   898|- `components/preview/PreviewFrame.tsx`：手機寬度預設切 mobile mode；預覽說明依 mode 顯示「手機預覽 / 桌機預覽」。
   899|- `app/globals.css`：新增 phone viewport overflow guard、fullscreen meta ellipsis。
   900|- `pages/__version.tsx`：版本更新為 `v0.2.8`。
   901|
   902|### 二、Build
   903|- `/tmp/store-site-builder-mobilefix` mirror：`npm run typecheck` PASS。
   904|- `/tmp/store-site-builder-mobilefix` mirror：`npm run build` PASS（Next.js 16.2.4，Compiled successfully）。
   905|
   906|### 三、本機 QA
   907|- Script：`scripts/qa-mobile-preview-frame.ts http://127.0.0.1:3216`
   908|- Result JSON：`qa-artifacts/v0.2.8/mobile-preview-frame-result.json`
   909|- 截圖資料夾：`qa-artifacts/v0.2.8/mobile-preview-frame/`
   910|
   911|| Viewport | Builder 手機預覽 | 全螢幕手機預覽 | 結果 |
   912||---:|---|---|---|
   913|| 390 | 無水平 overflow；手機 frame 固定高度；Hero 在 canvas 內 | 無水平 overflow；手機 frame 不再被內容撐長 | PASS |
   914|| 375 | 無水平 overflow；手機 frame 固定高度；Hero 在 canvas 內 | 無水平 overflow；手機 frame 不再被內容撐長 | PASS |
   915|| 320 | 無水平 overflow；手機 frame 固定高度；Hero 在 canvas 內 | 無水平 overflow；手機 frame 不再被內容撐長 | PASS |
   916|
   917|### 四、Vercel Preview / Live QA
   918|- Commit：`31f55b7cde1d4ae25540410b9711dcd176bac85d`
   919|- Preview：`https://store-site-builder-npt32ossi-sportkk101-5719s-projects.vercel.app`
   920|- `/__version`：`v0.2.8`，commit `31f55b7`
   921|- Live QA：`scripts/qa-mobile-preview-frame.ts https://store-site-builder-npt32ossi-sportkk101-5719s-projects.vercel.app` PASS。
   922|- Live viewport 結果：390 / 375 / 320 全 PASS。
   923|
   924|### 五、結論
   925|v0.2.8 已確認 Builder 手機預覽與全螢幕手機預覽 frame 破版修復 PASS，Vercel Preview live QA PASS，可送 Jason 複驗。
   926|---
   927|
   928|## v0.2.9 Mobile Artwork Backplate Containment Fix QA
   929|
   930|測試日期：2026-05-11
   931|正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
   932|QA runtime：WSL-native mirror `/tmp/store-site-builder-artworkfix`
   933|QA artifacts：`qa-artifacts/v0.2.7/`（依 Jason 本輪指定路徑）
   934|
   935|| # | 驗收項目 | 結果 | 狀態 |
   936||---|---|---|---|
   937|| 1 | MobileArtworkSafeFrame | 已新增 `components/templates/shared/MobileArtworkSafeFrame.tsx`，含 `mobile-artwork-safe-frame` / `mobile-artwork-image` data-testid。 | ✅ PASS |
   938|| 2 | mobile artwork 預設 | `TemplateArtworkBackplate.mobileArtworkMode` 預設為 `contain-poster`；抹茶日和為 `top-contain`。 | ✅ PASS |
   939|| 3 | 手機 Hero 結構 | mobile 斷點改為 artwork stage + content panel 垂直排列，不再用 desktop cover background 直接塞滿手機框。 | ✅ PASS |
   940|| 4 | Preview / Builder mobile | 30 套模板 × 390 / 375 / 320 均檢查 Builder mobile preview 與 `/preview?mode=mobile`。 | ✅ PASS |
   941|| 5 | Export 同步 | `exportStaticSite.ts` 已輸出等價 MobileArtworkSafeFrame HTML/CSS，export mobile containment 同步檢查。 | ✅ PASS |
   942|| 6 | artwork containment 全量 QA | totalTemplates=30，viewports=[390,375,320]，totalCases=90，passed=90，failed=0。 | ✅ PASS |
   943|| 7 | 截圖 artifacts | `qa-artifacts/v0.2.7/mobile-artwork-containment/` 已產出 90 張 PNG。 | ✅ PASS |
   944|| 8 | `npm run typecheck` | WSL-native mirror 執行 `tsc --noEmit` exit 0。 | ✅ PASS |
   945|| 9 | `npm run build` | Next.js 16.2.4 production build successful。 | ✅ PASS |
   946|
   947|重點模板結果：抹茶日和、珍珠霓光、白桃氣泡、茶霧山嵐、日常一隅、城市黑白於 390 / 375 / 320 全部 PASS；artwork frame 與 image 均在手機畫布內，文字與 CTA 均在 canvas 內，export 同步 PASS。
   948|
   949|QA result：`qa-artifacts/v0.2.7/mobile-artwork-containment-all-result.json`
   950|截圖資料夾：`qa-artifacts/v0.2.7/mobile-artwork-containment/`
   951|結論：Mobile Artwork Backplate Containment Fix 本機全量驗證通過，可進入 commit / Preview redeploy / live QA。
   952|
   953|
   954|## v0.2.9-hotfix.1 Desktop Preview Full Height Scroll Fix QA
   955|
   956|日期：2026-05-13
   957|Branch：`fix/v0.2.9-hotfix.1-desktop-preview-full-height`
   958|Base：`v0.2.9-approved` / `f70842bc7b036d5738c5933ba22a6b50b3a11de4`
   959|
   960|修復範圍：
   961|- 新增 `components/preview/ScaledPreviewCanvas.tsx`，desktop preview 以 ResizeObserver 量測內容高度。
   962|- 右側 desktop preview 與 fullscreen desktop preview 共用 full-height scaled spacer。
   963|- `transform: scale()` 只負責視覺縮放；外層 spacer 補上 `contentHeight * scale` 佈局高度。
   964|- 新增/補齊 QA marker：`preview-panel-scroll-container`、`desktop-preview-scroll-viewport`、`desktop-preview-canvas`、`site-footer`、`site-render-end`。
   965|- 未修改 30 套 template catalog、TemplateSkinEngine、MobileArtworkSafeFrame、首頁 landing、Onboarding/代管、登入/付款/資料庫。
   966|
   967|驗證命令：
   968|- `npm run typecheck`：PASS
   969|- `npm run build`：PASS
   970|- `BASE_URL=http://127.0.0.1:3050 npx tsx scripts/qa-desktop-preview-full-height.ts`：PASS
   971|
   972|30 套全量結果：
   973|- totalTemplates：30
   974|- builderRightPanelPassed：30
   975|- fullscreen1440Passed：30
   976|- fullscreen1280Passed：30
   977|- fullscreen1024Passed：30
   978|- failed：0
   979|- failedTemplates：[]
   980|
   981|Regression：
   982|- mobile 390：PASS
   983|- mobile 375：PASS
   984|- mobile 320：PASS
   985|
   986|QA artifacts：
   987|- JSON：`qa-artifacts/v0.2.10/desktop-preview-full-height-result.json`
   988|- Summary：`qa-artifacts/v0.2.10/desktop-preview-full-height-summary.md`
   989|- Screenshots：`qa-artifacts/v0.2.10/desktop-preview-full-height/`，90 張 PNG（30 templates × right-panel-bottom / fullscreen-1440-bottom / fullscreen-1280-bottom）
   990|
   991|結論：v0.2.9-hotfix.1 本機 full-height regression PASS；需部署 Vercel Preview 後再執行 live QA closeout。
   992|
   993|---
   994|
   995|## v0.2.10-hotfix Preview Fit Scale Engine QA
   996|
   997|測試日期：2026-05-13T20:19:53+08:00
   998|正式 repo 工作樹：`/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder`
   999|Live Preview：`https://store-site-builder-cnsav2bb9-sportkk101-5719s-projects.vercel.app`
  1000|QA artifacts：`qa-artifacts/v0.2.10/preview-fit-scale-result.json`、`qa-artifacts/v0.2.10/preview-fit-scale/`
  1001|
  1002|| # | 驗收項目 | 實際結果 | 狀態 |
  1003||---|---|---|---|
  1004|| 1 | 統一 PreviewCanvas | Builder desktop、Builder mobile、fullscreen desktop、fullscreen mobile 均使用 `components/preview/PreviewCanvas.tsx`。 | ✅ PASS |
  1005|| 2 | ResizeObserver fit scale | PreviewCanvas 使用 ResizeObserver 量測外層容器寬度與 virtual canvas 內容高度。 | ✅ PASS |
  1006|| 3 | Builder desktop fit scale | 10 套模板全通過；sample containerWidth=605、virtualWidth=1440、scale=0.398、scaledWidth=573。 | ✅ PASS |
  1007|| 4 | Builder mobile fit scale | 10 套模板全通過；sample containerWidth=390、virtualWidth=390、phone targetWidth=426、scale=0.840、scaledWidth=358。 | ✅ PASS |
  1008|| 5 | Fullscreen desktop 1440 Fit | 10 套模板全通過；sample containerWidth=1392、virtualWidth=1440、scale=0.922、scaledWidth=1328。 | ✅ PASS |
  1009|| 6 | Fullscreen mobile 390 Fit | 10 套模板全通過；sample containerWidth=370、virtualWidth=390、phone targetWidth=426、scale=0.718、scaledWidth=306。 | ✅ PASS |
  1010|| 7 | spacer height | `preview-scaled-spacer` 高度由 `contentHeight * scale` 產生，且 QA 驗證 `hasSpacerHeight=true`。 | ✅ PASS |
  1011|| 8 | 截圖 | `qa-artifacts/v0.2.10/preview-fit-scale/` 產出 8 張 PNG。 | ✅ PASS |
  1012|| 9 | `npm run typecheck` | `tsc --noEmit` exit 0。 | ✅ PASS |
  1013|| 10 | `npm run build` | Next.js 16.2.4 production build success。 | ✅ PASS |
  1014|| 11 | Live Preview HTTP | `/`、`/builder`、`/preview?mode=desktop&viewport=1440`、`/preview?mode=mobile&viewport=390`、`/__version` 皆 HTTP 200。 | ✅ PASS |
  1015|| 12 | Live `/__version` | `v0.2.10-hotfix`，commit `cb40f6cd0bdc991a0353333c7051cbcc5239907f`，branch `fix/v0.2.10-preview-fit-scale-engine`。 | ✅ PASS |
  1016|
  1017|結論：v0.2.10-hotfix Preview Fit Scale Engine 本機與 live Preview QA 通過；可送 Jason 驗收。
  1018|
  1019|
  1020|## v0.2.10-hotfix PreviewCanvas Fit Scale + Centering Fix QA（2026-05-13 14:02 UTC）
  1021|
  1022|**範圍**：僅修 PreviewCanvas / previewGeometry / stage centering / phone frame width 計算；未修改 30 套模板 catalog、TemplateSkinEngine、MobileArtworkSafeFrame、首頁、代管、exportStaticSite 主流程、登入、付款、資料庫。
  1023|
  1024|**修復摘要**
  1025|- 統一 Builder desktop、Builder mobile、fullscreen desktop、fullscreen mobile 使用 `components/preview/PreviewCanvas.tsx`。
  1026|- 新增 `lib/previewGeometry.ts`，集中計算 `virtualCanvasWidth`、`frameOuterWidth`、`scale`、`scaledWidth`、`scaledHeight`、`stagePadding`、置中策略。
  1027|- `PreviewCanvas` 使用 `ResizeObserver` 量測 stage container width 與 virtual canvas content height。
  1028|- stage 結構改為 `preview-stage` → `preview-centered-spacer` → `preview-scale-wrapper` → frame shell → `preview-virtual-canvas`，由 stage flex center 負責置中。
  1029|- mobile phone frame width 計入 56px chrome；`mobile-preview-canvas` 保持 `data-viewport-width=390/375/320`，不使用 1440px desktop canvas。
  1030|
  1031|**本機 QA 命令**
  1032|```bash
  1033|npm run typecheck
  1034|npm run build
  1035|BASE_URL=http://127.0.0.1:3050 npx tsx scripts/qa-preview-scale-centering.ts
  1036|```
  1037|
  1038|**本機 QA 結果**
  1039|- `npm run typecheck`：PASS
  1040|- `npm run build`：PASS（Next.js 16.2.4 build successful）
  1041|- `scripts/qa-preview-scale-centering.ts`：PASS，10/10 templates
  1042|- `builderDesktopFit=true`
  1043|- `builderMobileFit=true`
  1044|- `fullscreenDesktopCentered=true`
  1045|- `fullscreenMobileCentered=true`
  1046|- `mobile390=true` / `mobile375=true` / `mobile320=true`
  1047|- `footerReachable=true`
  1048|- `failedTemplates=[]`
  1049|
  1050|**代表 scale 數據（抹茶日和）**
  1051|| 場景 | containerWidth | virtualWidth | frameOuterWidth | scale | scaledWidth | centered | leftGap/rightGap | footerReachable |
  1052||---|---:|---:|---:|---:|---:|---|---|---|
  1053|| Builder desktop | 605 | 1440 | 1440 | 0.409 | 589 | true | 8 / 8 | true |
  1054|| Builder mobile | 390 | 390 | 446 | 0.839 | 374 | true | 8 / 8 | n/a |
  1055|| Fullscreen desktop | 1392 | 1440 | 1440 | 0.933 | 1344 | true | 24 / 24 | true |
  1056|| Fullscreen mobile | 370 | 390 | 446 | 0.722 | 322 | true | 24 / 24 | n/a |
  1057|
  1058|**Artifacts**
  1059|- JSON：`qa-artifacts/v0.2.10/preview-scale-centering-result.json`
  1060|- Summary：`qa-artifacts/v0.2.10/preview-scale-centering-summary.md`
  1061|- Screenshots：`qa-artifacts/v0.2.10/preview-scale-centering/`（12 張）
  1062|
  1063|**Live Preview QA 結果**
  1064|- Preview URL：`https://store-site-builder-ig4gahvjs-sportkk101-5719s-projects.vercel.app`
  1065|- Deployment UID：`dpl_3E6MUfUHT6451Qbqr2L9DH2WfrAj`
  1066|- `PREVIEW_URL=https://store-site-builder-ig4gahvjs-sportkk101-5719s-projects.vercel.app npx tsx scripts/qa-preview-scale-centering.ts`：PASS，10/10 templates
  1067|- live `builderDesktopFit=true`
  1068|- live `builderMobileFit=true`
  1069|- live `fullscreenDesktopCentered=true`
  1070|- live `fullscreenMobileCentered=true`
  1071|- live `mobile390=true` / `mobile375=true` / `mobile320=true`
  1072|- live `footerReachable=true`
  1073|- live `failedTemplates=[]`
  1074|- HTTP：`/`、`/builder`、`/preview?mode=desktop&viewport=1440&zoom=fit`、`/preview?mode=mobile&viewport=390&zoom=fit`、`/__version` 全部 200。
  1075|

---

## v0.2.10-hotfix follow-up：Mobile Preview Virtual Viewport 修復驗證

測試時間：2026-05-13 23:52 CST  
修復 commit：待 commit  
退回截圖問題：fullscreen mobile 390 雖然手機外框置中，但內部網站仍套用 desktop media query，Hero/CTA 向右溢出並被 phone frame 裁切。

根因：手機 Preview 是在桌機瀏覽器內用 390/375/320px virtual div 渲染；CSS `@media(max-width:760px)` 依據真實瀏覽器 viewport，不依據 virtual canvas，因此 fullscreen/builder mobile preview 未套用手機模板規則。

修復方式：在 `app/globals.css` 針對 `.preview-phone-viewport [data-testid="site-renderer"][data-preview-mode="mobile"]` 強制套用 mobile skin contract，包含：
- nav 隱藏、Hero 改 column、desktop backplate 隱藏、mobile artwork 顯示
- `.hero-copy` min-width 歸零、寬度限制在 phone viewport 內
- CTA row、section、menu/product/info grid 全部限制在 mobile viewport 內
- phone viewport / root / hero scrollWidth 必須小於等於選定 viewport

本機驗證：

| 項目 | 結果 | 狀態 |
|---|---|---|
| `npm run typecheck` | `tsc --noEmit` exit 0 | ✅ PASS |
| `npm run build` | Next.js 16.2.4 / Compiled successfully / `/`, `/builder`, `/preview`, `/__version` routes OK | ✅ PASS |
| `scripts/qa-mobile-preview-virtual-viewport.ts` | 390 / 375 / 320 全部 passed=true | ✅ PASS |
| 390 phoneWidth/rootScrollWidth/heroScrollWidth | `390 / 390 / 362` | ✅ PASS |
| 375 phoneWidth/rootScrollWidth/heroScrollWidth | `375 / 375 / 347` | ✅ PASS |
| 320 phoneWidth/rootScrollWidth/heroScrollWidth | `320 / 320 / 292` | ✅ PASS |
| Hero mobile contract | `heroColumn=true`, `navHidden=true`, `backplateHidden=true`, `artworkVisible=true`, `ctaWithinPhone=true` | ✅ PASS |

QA artifacts：
- `qa-artifacts/v0.2.10-hotfix-mobile-viewport/mobile-preview-virtual-viewport-result.json`
- `qa-artifacts/v0.2.10-hotfix-mobile-viewport/fullscreen-mobile-390.png`
- `qa-artifacts/v0.2.10-hotfix-mobile-viewport/fullscreen-mobile-375.png`
- `qa-artifacts/v0.2.10-hotfix-mobile-viewport/fullscreen-mobile-320.png`

Live Preview：待 commit/push/redeploy 後重新驗證。
