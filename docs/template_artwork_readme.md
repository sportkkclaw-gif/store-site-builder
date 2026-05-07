# Template Gallery Artwork README

## 資產策略

本輪先建立 30 張可立即顯示的 SVG mock artwork，作為 AI 主視覺圖的接線與版面驗收資產。它們不是普通色板，而是 4:5 website concept cover：包含 desktop hero、mobile preview、商品氛圍、CTA 與品牌配色。

正式 AI 圖生成後，只需以同名檔案替換：

```text
public/template-gallery/<industry>/<slug>.svg
```

若改用 png/webp，請同步更新 `lib/templateArtworkManifest.ts` 與 `lib/templateCatalog.ts` 的 `artworkSrc`。

## 命名規範

- 飲料店：`public/template-gallery/drink-shop/<slug>.svg`
- 餐飲店：`public/template-gallery/restaurant/<slug>.svg`
- 咖啡廳：`public/template-gallery/cafe/<slug>.svg`

## 對應來源

- metadata：`lib/templateCatalog.ts`
- manifest：`lib/templateArtworkManifest.ts`
- prompt：`docs/template_prompt_catalog.md`

## 狀態

- 30/30 SVG mock artwork ready
- 30/30 prompt ready
- 30/30 catalog mapping ready
- 之後可逐張替換為真正 AI 生成圖，不需改 UI 結構
