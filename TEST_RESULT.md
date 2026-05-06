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

## 總結

- **25 項核心測試**：全部 ✅ PASS（含 Group A–E）
- **Mobile 390px 實測**：11 項額外行動測試（Group G–H）全部 ✅ PASS，由 Playwright headless chromium 執行
- **累計驗證**：Build ✅ / ZIP 結構 ✅ / SEO Meta ✅ / Forbidden ✅ / Browser Desktop ✅ / Browser Mobile 390px ✅ / Offline Mobile 390px ✅
- **阻塞問題**：無

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
