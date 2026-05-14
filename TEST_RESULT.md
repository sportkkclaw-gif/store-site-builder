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

## Notes

A pre-existing client-side circular import between `templateCatalog -> enrichTemplate -> templateArtworkResolver -> templateCatalog` surfaced as `ReferenceError: Cannot access 'n' before initialization` during browser hydration. Fixed by removing eager `enrichAllTemplates(templateCatalog)` evaluation from `templateCatalog.ts`; `templateCatalogWithPresets` now remains a non-eager catalog export because it has no current consumers.
