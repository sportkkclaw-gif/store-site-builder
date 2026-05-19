# StoreSite Builder / 店名片 v0.3.0 TEST_RESULT

## Version
- Product: 店名片｜小店家的 AI 名片式網頁產生器
- Version: v0.3.0
- Branch: feature/v0.3.0-denmeipian-onboarding-hosting
- QA date: 2026-05-14

## Scope
Barry DRI implementation for 店名片 v0.3.0 自動導引與代管入口版.

Implemented:
- Brand rename visible UI to 店名片.
- Homepage productized for name-card style store website generator.
- Onboarding Wizard 5-step flow.
- Template recommendation logic.
- Demo site data apply buttons.
- Publish readiness scoring.
- ExportPanel renamed to 發布中心.
- Hosting request modal producing hosting-request.json.
- Self-export vs managed hosting pricing/explanation section.
- Help / FAQ.

Forbidden scope preserved:
- No login / payment / database / production cloud hosting implementation.
- No production deploy or main merge.
- ZIP/export core flow preserved; README copy updated to 店名片.

## Commands

```bash
npm run typecheck
npm run build
npx tsx scripts/qa-onboarding-hosting.ts
```

## Results

| Check | Result |
|---|---|
| typecheck | PASS |
| build | PASS |
| / HTTP | 200 |
| /builder HTTP | 200 |
| /preview HTTP | 200 |
| /__version HTTP | 200 |
| onboarding-hosting-result.json | ok=true |
| screenshots | 15 PNG |
| ZIP export | PASS |
| JSON export | PASS |
| file:// index.html package contents | PASS |
| ZIP forbidden strings localhost / 127.0.0.1 / _next | PASS |
| mobile 390 no overflow | PASS |
| mobile 375 no overflow | PASS |
| mobile 320 no overflow | PASS |
| fullscreen preview route | PASS |

## QA Artifacts

- `qa-artifacts/v0.3.0/onboarding-hosting-result.json`
- `qa-artifacts/v0.3.0/onboarding-hosting/`
- Screenshot count: 15
- ZIP: `qa-artifacts/v0.3.0/onboarding-hosting/generated-site.zip`
- JSON export: `qa-artifacts/v0.3.0/onboarding-hosting/siteData-export.json`
- Hosting request: `qa-artifacts/v0.3.0/onboarding-hosting/hosting-request.json`

## Hero Image Settings Addendum

Scope: v0.3.0 Hero 設定圖片選擇與綁定缺口修復。

Implemented:
- `siteData.hero.imageMode`: `template | custom`, default `template`.
- Hero 主視覺圖片設定區：模板主視覺 / 自訂 Hero 圖 radio mode。
- Hero 設定區內可直接上傳 JPG / PNG / WebP（2MB validation）並寫入 `siteData.media` as `type=hero`。
- Hero 設定區可從 media library 選擇 `hero/product/store/other` 圖片。
- 清除自訂圖片會回到模板主視覺。
- Builder Preview / Fullscreen Preview / Mobile Preview 依 `hero.imageMode` 顯示 template artwork 或 custom media。
- 切換模板時：custom mode 保留自訂 Hero 圖；template mode 跟著模板主視覺切換。
- ZIP export custom mode 會將 Hero media 匯出至 `assets/` 並在 `index.html` 使用該 asset。

Commands:

```bash
npm run typecheck
npm run build
npx tsx scripts/qa-hero-image-settings.ts
```

Results:

| Check | Result |
|---|---|
| hero-image-settings-result.json | ok=true |
| Hero settings visible | PASS |
| Template mode | PASS |
| Custom upload | PASS |
| Builder Preview custom Hero | PASS |
| Fullscreen Preview custom Hero | PASS |
| Template switch keeps custom Hero | PASS |
| Clear custom Hero | PASS |
| Export custom Hero asset | PASS |
| ZIP forbidden strings localhost / 127.0.0.1 / _next | PASS |
| mobile 390 / 375 / 320 no overflow | PASS |
| Screenshot count | 8 PNG |

QA Artifacts:
- `qa-artifacts/v0.3.0/hero-image-settings-result.json`
- `qa-artifacts/v0.3.0/hero-image-settings/`

## Notes

A pre-existing client-side circular import between `templateCatalog -> enrichTemplate -> templateArtworkResolver -> templateCatalog` surfaced as `ReferenceError: Cannot access 'n' before initialization` during browser hydration. Fixed by removing eager `enrichAllTemplates(templateCatalog)` evaluation from `templateCatalog.ts`; `templateCatalogWithPresets` now remains a non-eager catalog export because it has no current consumers.
