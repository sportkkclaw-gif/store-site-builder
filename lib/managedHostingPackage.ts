import JSZip from 'jszip';
import type { SiteData } from '@/types/site';
import type { HostingRequestForm } from './hostingRequest';
import { buildHostingRequest, summarizeSite } from './hostingRequest';
import { checkPublishReadiness } from './publishReadiness';
import { downloadText } from './storage';

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function buildDeploymentBrief(form: HostingRequestForm, siteData: SiteData) {
  const readiness = checkPublishReadiness(siteData);
  const request = buildHostingRequest(form, siteData, readiness);
  const summary = summarizeSite(siteData);
  const missing = readiness.requiredIssues.length ? readiness.requiredIssues.join('\n- ') : '無';
  const recommended = readiness.recommendedIssues.length ? readiness.recommendedIssues.join('\n- ') : '無';
  return `# 店名片代管申請

## 店家
店名：${request.store.name}
產業：${request.site.industry}
模板：${request.site.templateId}
申請網址：${request.deployment.requestedUrlPreview}

## 聯絡資訊
聯絡人：${request.contact.name}
Email：${request.contact.email}
LINE ID：${request.contact.lineId}

## 發布檢查
完成度：${readiness.score}
狀態：${readiness.status}
必填缺失：
- ${missing}
建議補充：
- ${recommended}

## 網站摘要
菜單分類數：${summary.menuCategoryCount}
商品數：${summary.productCount}
是否有 LINE：${summary.hasLine ? '是' : '否'}
是否有 Google Maps：${summary.hasGoogleMaps ? '是' : '否'}
是否有 Hero 圖：${summary.hasHeroImage ? '是' : '否'}
是否有 SEO：${summary.hasSeo ? '是' : '否'}

## 下一步
1. 確認聯絡資訊
2. 確認網址名稱
3. 確認是否需要自訂網域
4. 產出靜態網站
5. 部署
6. 回傳公開網址
`;
}

export async function generateManagedHostingPackage(form: HostingRequestForm, siteData: SiteData) {
  const readiness = checkPublishReadiness(siteData);
  const request = buildHostingRequest(form, siteData, readiness);
  const zip = new JSZip();
  zip.file('hosting-request.json', JSON.stringify(request, null, 2));
  zip.file('siteData.json', JSON.stringify(siteData, null, 2));
  zip.file('publish-readiness.json', JSON.stringify(readiness, null, 2));
  zip.file('deployment-brief.md', buildDeploymentBrief(form, siteData));
  zip.file('README.txt', '這是店名片 v0.3.1 代管交付包。\n請先確認 hosting-request.json、siteData.json 與 deployment-brief.md，再產出 generated-site.zip 並部署。\n本包不包含登入、付款、資料庫、正式雲端部署或自訂網域綁定。');
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob('managed-hosting-package.zip', blob);
  return request;
}

export function downloadHostingRequestJson(form: HostingRequestForm, siteData: SiteData) {
  const readiness = checkPublishReadiness(siteData);
  const text = JSON.stringify(buildHostingRequest(form, siteData, readiness), null, 2);
  downloadText('hosting-request.json', text);
  return text;
}
