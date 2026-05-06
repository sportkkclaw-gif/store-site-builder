# AGENTS.md

本專案是「餐飲小店靜態官網產生器」MVP。

所有 AI Agent 請遵守：

1. 不要擅自加入登入、付款、資料庫、自訂網域、拖拉式編輯器。
2. 所有網站內容必須從 siteData 讀取。
3. 模板與資料必須分離。
4. 三個模板共用同一份資料結構。
5. 新增功能前，先確認是否屬於 MVP 範圍。
6. UI 必須保持簡潔、現代、商業可用。
7. 所有元件需使用 TypeScript。
8. 不要把大量邏輯寫死在單一 page.tsx。
9. 模板元件放在 components/templates。
10. Builder 表單元件放在 components/builder。
11. 通用 UI 元件放在 components/ui。
12. 工具函式放在 lib。
13. 型別定義放在 types。
14. 若需修改 siteData 結構，必須同步更新 defaultSiteData、表單、模板、匯出功能。
15. 每次完成修改後，請確認 npm run build 或至少 TypeScript 檢查無重大錯誤。
