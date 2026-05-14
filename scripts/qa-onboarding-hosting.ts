import { chromium, type Page } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:3050';
const outDir = path.join(process.cwd(), 'qa-artifacts/v0.3.0/onboarding-hosting');
const resultPath = path.join(process.cwd(), 'qa-artifacts/v0.3.0/onboarding-hosting-result.json');
fs.mkdirSync(outDir, { recursive: true });

const result: Record<string, unknown> = {
  ok: false,
  brandRenamed: false,
  wizardWorks: false,
  templateRecommendationWorks: false,
  demoDataWorks: false,
  publishReadinessWorks: false,
  hostingRequestWorks: false,
  zipExportStillWorks: false,
  jsonExportStillWorks: false,
  previewStillWorks: false,
  fullscreenPreviewStillWorks: false,
  mobile390NoOverflow: false,
  mobile375NoOverflow: false,
  mobile320NoOverflow: false,
  screenshots: [],
  errors: [],
};

async function shot(page: Page, name: string) {
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, fullPage: false });
  (result.screenshots as string[]).push(file);
}

async function noOverflow(page: Page) {
  return await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 2 && document.body.scrollWidth <= window.innerWidth + 2);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, acceptDownloads: true });
  const page = await context.newPage();
  page.on('console', msg => { if (msg.type() === 'error') (result.errors as string[]).push(`console:${msg.text()}`); });

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.getByTestId('home-hero-title').waitFor({ timeout: 15000 });
  result.brandRenamed = await page.getByTestId('home-hero-title').textContent().then(text => text?.includes('30 分鐘建立你的店家線上名片') || false);
  await shot(page, 'home-hero-denmeipian.png');

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('[data-testid="home-start-onboarding"]')) as HTMLButtonElement[];
    if (buttons.length < 1) throw new Error('home-start-onboarding button not found');
    buttons[Math.min(1, buttons.length - 1)].click();
  });
  await page.getByTestId('onboarding-step-1').waitFor();
  await shot(page, 'onboarding-step-1-industry.png');
  await page.getByRole('button', { name: '飲料店' }).click();
  await page.getByRole('button', { name: '下一步' }).click();
  await page.getByTestId('onboarding-step-2').waitFor();
  await shot(page, 'onboarding-step-2-style.png');
  await page.getByRole('button', { name: '清新日系' }).click();
  await page.getByRole('button', { name: '下一步' }).click();
  await page.getByTestId('onboarding-step-3').waitFor();
  await page.getByRole('textbox', { name: '店名' }).fill('QA 茶飲');
  await page.getByRole('textbox', { name: '品牌標語' }).fill('QA 自動導引測試');
  await page.getByRole('textbox', { name: 'LINE 連結' }).fill('https://line.me/R/ti/p/@qa');
  await shot(page, 'onboarding-step-3-basic-info.png');
  await page.getByRole('button', { name: '下一步' }).click();
  await page.getByTestId('onboarding-step-4').waitFor();
  await page.getByRole('button', { name: '我先試用看看' }).click();
  await shot(page, 'onboarding-step-4-usage-mode.png');
  await page.getByRole('button', { name: '下一步' }).click();
  await page.getByTestId('onboarding-step-5').waitFor();
  await page.getByTestId('complete-onboarding').click();
  await page.waitForURL('**/builder', { timeout: 15000 });
  await page.getByRole('heading', { name: 'QA 茶飲' }).waitFor({ timeout: 15000 });
  await shot(page, 'builder-after-onboarding.png');
  result.wizardWorks = true;
  const storage = await page.evaluate(() => JSON.parse(localStorage.getItem('store-site-builder-data') || '{}'));
  result.templateRecommendationWorks = storage.galleryTemplateId === 'drink-matcha-hiyori' && storage.store?.name === 'QA 茶飲';
  result.previewStillWorks = await page.getByText('QA 茶飲').count() > 0;

  page.once('dialog', d => d.accept());
  await page.getByText('套用餐飲店範例').click();
  await page.getByRole('heading', { name: '暖巷食堂' }).waitFor({ timeout: 10000 });
  result.demoDataWorks = true;

  await page.locator('[data-sidebar-button="export"]').click();
  await page.getByTestId('publish-center').waitFor();
  const scoreText = await page.getByTestId('publish-readiness-score').textContent();
  result.publishReadinessWorks = Number(scoreText) >= 0;
  await shot(page, 'export-panel-readiness.png');

  const [jsonDownload] = await Promise.all([page.waitForEvent('download'), page.getByTestId('publish-json-export').click()]);
  const jsonFile = path.join(outDir, 'siteData-export.json');
  await jsonDownload.saveAs(jsonFile);
  result.jsonExportStillWorks = fs.existsSync(jsonFile) && fs.statSync(jsonFile).size > 100;

  const [zipDownload] = await Promise.all([page.waitForEvent('download'), page.getByTestId('publish-zip-export').click()]);
  const zipFile = path.join(outDir, 'generated-site.zip');
  await zipDownload.saveAs(zipFile);
  result.zipExportStillWorks = fs.existsSync(zipFile) && fs.statSync(zipFile).size > 1000;

  await page.getByTestId('open-hosting-request').click();
  await page.getByTestId('hosting-request-modal').waitFor();
  await shot(page, 'hosting-request-modal.png');
  await page.getByLabel('聯絡人姓名').fill('QA Tester');
  await page.getByLabel('Email').fill('qa@example.com');
  await page.getByLabel('LINE ID').fill('@qa');
  await page.getByLabel('想使用的網址名稱').fill('qa-tea');
  const [hostingDownload] = await Promise.all([page.waitForEvent('download'), page.getByTestId('generate-hosting-request').click()]);
  const hostingFile = path.join(outDir, 'hosting-request.json');
  await hostingDownload.saveAs(hostingFile);
  await page.getByTestId('hosting-request-output').waitFor();
  await shot(page, 'hosting-request-generated.png');
  result.hostingRequestWorks = fs.existsSync(hostingFile) && fs.readFileSync(hostingFile, 'utf8').includes('denmeipian-hosting-request');

  await page.goto(`${baseUrl}/#hosting-plans`, { waitUntil: 'networkidle' });
  await page.getByTestId('pricing-hosting-section').scrollIntoViewIfNeeded();
  await shot(page, 'pricing-hosting-section.png');

  await page.goto(`${baseUrl}/preview?mode=desktop&viewport=1440&zoom=fit`, { waitUntil: 'networkidle' });
  result.fullscreenPreviewStillWorks = await page.locator('[data-testid="fullscreen-preview-shell"]').count().then(c => c > 0).catch(() => page.getByText('返回 Builder').count().then(c => c > 0));

  for (const width of [390, 375, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${baseUrl}/?mobile=${width}`, { waitUntil: 'domcontentloaded' });
    const homeOk = await noOverflow(page);
    if (width === 390) await shot(page, 'mobile-home-390.png');
    if (width === 320) await shot(page, 'mobile-home-320.png');
    await page.getByTestId('home-start-onboarding').first().click();
    await page.getByTestId('onboarding-step-1').waitFor();
    const onboardingOk = await noOverflow(page);
    if (width === 390) await shot(page, 'mobile-onboarding-390.png');
    if (width === 320) await shot(page, 'mobile-onboarding-320.png');
    await page.goto(`${baseUrl}/builder`, { waitUntil: 'networkidle' });
    await page.evaluate(() => (document.querySelector('[data-sidebar-button="export"]') as HTMLButtonElement | null)?.click());
    const exportOk = await noOverflow(page);
    if (width === 390) await shot(page, 'mobile-export-panel-390.png');
    result[`mobile${width}NoOverflow`] = homeOk && onboardingOk && exportOk;
  }

  await browser.close();
  result.ok = Boolean(result.brandRenamed && result.wizardWorks && result.templateRecommendationWorks && result.demoDataWorks && result.publishReadinessWorks && result.hostingRequestWorks && result.zipExportStillWorks && result.jsonExportStillWorks && result.previewStillWorks && result.fullscreenPreviewStillWorks && result.mobile390NoOverflow && result.mobile375NoOverflow && result.mobile320NoOverflow);
  fs.mkdirSync(path.dirname(resultPath), { recursive: true });
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

main().catch(async error => {
  (result.errors as string[]).push(error.stack || String(error));
  try {
    // no-op: browser/page scoped in main; kept for stable failure output
  } catch {}
  fs.mkdirSync(path.dirname(resultPath), { recursive: true });
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
  process.exit(1);
});
