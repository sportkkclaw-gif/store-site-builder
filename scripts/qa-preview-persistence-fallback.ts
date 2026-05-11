import { chromium, type Page } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { templateCatalog } from '../lib/templateCatalog';
import { createDefaultSiteData } from '../lib/defaultSiteData';
import { applyTemplatePresetSync } from '../lib/applyTemplatePreset';
import { getCurrentSkinFamily, getCurrentTemplateId } from '../lib/getCurrentTemplate';

const baseUrl = process.argv[2] || 'http://127.0.0.1:3220';
const artifactRoot = path.join(process.cwd(), 'qa-artifacts', process.env.QA_ARTIFACT_VERSION || 'v0.2.10');
const screenshotDir = path.join(artifactRoot, 'preview-persistence-fallback');
const resultPath = path.join(artifactRoot, 'preview-persistence-fallback-result.json');
fs.mkdirSync(screenshotDir, { recursive: true });

const PREVIEW_SESSION_PREFIX = 'store-site-builder-preview-session:';
const PREVIEW_CURRENT_KEY = 'store-site-builder-preview-current';
const BUILDER_DATA_KEY = 'store-site-builder-data';
const LOST_MESSAGE = '預覽資料遺失，請返回 Builder 重新開啟預覽。';

const targetTemplateIds = [
  'restaurant-brunch-garden',
  'drink-matcha-hiyori',
  'drink-boba-neon',
  'cafe-daily-corner',
  'cafe-urban-monochrome',
];

type PreviewMeta = {
  templateId: string;
  skinFamily: string;
  dataSource: string;
  sessionId: string;
  hasError: boolean;
  backToBuilderVisible: boolean;
};

type BuilderMeta = {
  templateId: string;
  skinFamily: string;
};

function getTemplate(id: string) {
  const template = templateCatalog.find((item) => item.id === id);
  if (!template) throw new Error(`Template not found: ${id}`);
  return template;
}

function shot(name: string) {
  return path.join(screenshotDir, name);
}

async function readPreviewMeta(page: Page): Promise<PreviewMeta> {
  await page.waitForSelector('[data-testid="fullscreen-preview-shell"]', { timeout: 20000 });
  return page.evaluate(`(() => {
    const text = (selector) => document.querySelector(selector)?.textContent?.trim() || '';
    const renderer = document.querySelector('[data-testid="site-renderer"]');
    return {
      templateId: text('[data-testid="fullscreen-preview-template-id"]') || renderer?.getAttribute('data-template-id') || '',
      skinFamily: text('[data-testid="fullscreen-preview-skin-family"]') || renderer?.getAttribute('data-skin-family') || '',
      dataSource: text('[data-testid="fullscreen-preview-data-source"]'),
      sessionId: text('[data-testid="fullscreen-preview-session-id"]'),
      hasError: document.body.innerText.includes('${LOST_MESSAGE}'),
      backToBuilderVisible: Boolean(document.querySelector('[data-testid="preview-back-to-builder"]')),
    };
  })()`);
}

async function clearPreviewSessionStorage(page: Page) {
  await page.evaluate(`(() => {
    Object.keys(sessionStorage).filter((key) => key.startsWith('${PREVIEW_SESSION_PREFIX}')).forEach((key) => sessionStorage.removeItem(key));
  })()`);
}

async function clearLocalPreviewSessions(page: Page) {
  await page.evaluate(`(() => {
    Object.keys(localStorage).filter((key) => key.startsWith('${PREVIEW_SESSION_PREFIX}')).forEach((key) => localStorage.removeItem(key));
  })()`);
}

async function clearPreviewCurrent(page: Page) {
  await page.evaluate(`(() => localStorage.removeItem('${PREVIEW_CURRENT_KEY}'))()`);
}

async function clearAllPreviewStorage(page: Page) {
  await page.evaluate(`(() => {
    Object.keys(sessionStorage).filter((key) => key.startsWith('${PREVIEW_SESSION_PREFIX}')).forEach((key) => sessionStorage.removeItem(key));
    Object.keys(localStorage).filter((key) => key.startsWith('${PREVIEW_SESSION_PREFIX}')).forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem('${PREVIEW_CURRENT_KEY}');
    localStorage.removeItem('${BUILDER_DATA_KEY}');
  })()`);
}

async function openBuilderWithTemplate(page: Page, templateId: string) {
  const template = getTemplate(templateId);
  const seeded = applyTemplatePresetSync(createDefaultSiteData(), template);
  const expectedTemplateId = getCurrentTemplateId(seeded);
  const expectedSkinFamily = getCurrentSkinFamily(seeded);
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.evaluate((data) => {
    window.localStorage.setItem('store-site-builder-data', JSON.stringify(data));
  }, seeded);
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForSelector('[data-testid="site-renderer"]', { state: 'attached', timeout: 25000 });
  await page.waitForFunction((id) => document.querySelector('[data-testid="site-renderer"]')?.getAttribute('data-template-id') === id, expectedTemplateId, { timeout: 25000 });
  const previewTab = page.getByRole('button', { name: '預覽' }).first();
  if (await previewTab.isVisible().catch(() => false)) await previewTab.click().catch(() => {});
  const builderMeta = await page.evaluate<BuilderMeta>(`(() => {
    const renderer = document.querySelector('[data-testid="site-renderer"]');
    return {
      templateId: renderer?.getAttribute('data-template-id') || '',
      skinFamily: renderer?.getAttribute('data-skin-family') || '',
    };
  })()`);
  return { template, seeded, expectedTemplateId, expectedSkinFamily, builderMeta };
}

async function clickFullscreen(page: Page) {
  const button = page.locator('[data-testid="fullscreen-preview-button"]:visible').first();
  await button.waitFor({ state: 'visible', timeout: 20000 });
  await button.click();
  await page.waitForURL(/\/preview\?/, { timeout: 25000 });
  await page.waitForSelector('[data-testid="fullscreen-preview-shell"]', { timeout: 25000 });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const templateResults: Array<Record<string, unknown>> = [];
  let normalSessionWorks = true;
  let noUnexpectedPreviewDataLost = true;
  let sessionStorageSourceWorks = false;

  for (const templateId of targetTemplateIds) {
    await context.clearCookies();
    await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(() => {});
    await clearAllPreviewStorage(page).catch(() => {});
    const { template, expectedTemplateId, expectedSkinFamily, builderMeta } = await openBuilderWithTemplate(page, templateId);
    if (templateId === 'restaurant-brunch-garden') await page.screenshot({ path: shot('builder-brunch-garden-selected.png'), fullPage: false });
    if (templateId === 'drink-matcha-hiyori') await page.screenshot({ path: shot('builder-matcha-selected.png'), fullPage: false });
    await clickFullscreen(page);
    const meta = await readPreviewMeta(page);
    if (templateId === 'restaurant-brunch-garden') await page.screenshot({ path: shot('preview-brunch-garden-success.png'), fullPage: false });
    if (templateId === 'drink-matcha-hiyori') {
      await page.screenshot({ path: shot('preview-matcha-success.png'), fullPage: false });
      await page.screenshot({ path: shot('preview-sessionStorage-source.png'), fullPage: false });
    }
    const passed =
      builderMeta.templateId === expectedTemplateId &&
      builderMeta.skinFamily === expectedSkinFamily &&
      meta.templateId === expectedTemplateId &&
      meta.skinFamily === expectedSkinFamily &&
      (meta.dataSource === 'sessionStorage' || meta.dataSource === 'localStorage-session' || meta.dataSource === 'preview-current' || meta.dataSource === 'builder-data') &&
      !meta.hasError;
    normalSessionWorks = normalSessionWorks && passed;
    noUnexpectedPreviewDataLost = noUnexpectedPreviewDataLost && !meta.hasError;
    sessionStorageSourceWorks = sessionStorageSourceWorks || meta.dataSource === 'sessionStorage';
    templateResults.push({
      templateName: template.name,
      builderTemplateId: builderMeta.templateId,
      previewTemplateId: meta.templateId,
      expectedTemplateId,
      dataSource: meta.dataSource,
      skinFamily: meta.skinFamily,
      hasError: meta.hasError,
      passed,
    });
  }

  // Fallback path checks use the currently loaded matcha preview URL/session.
  await clearAllPreviewStorage(page);
  await openBuilderWithTemplate(page, 'drink-matcha-hiyori');
  await clickFullscreen(page);
  const previewUrl = page.url();

  await clearPreviewSessionStorage(page);
  await page.goto(previewUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
  const localStorageSessionMeta = await readPreviewMeta(page);
  await page.screenshot({ path: shot('preview-localStorage-fallback-source.png'), fullPage: false });
  const localStorageSessionFallbackWorks = localStorageSessionMeta.templateId === 'drink-matcha-hiyori' && localStorageSessionMeta.dataSource === 'localStorage-session' && !localStorageSessionMeta.hasError;

  await clearPreviewSessionStorage(page);
  await clearLocalPreviewSessions(page);
  await page.goto(previewUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
  const previewCurrentMeta = await readPreviewMeta(page);
  await page.screenshot({ path: shot('preview-previewCurrent-fallback-source.png'), fullPage: false });
  const previewCurrentFallbackWorks = previewCurrentMeta.templateId === 'drink-matcha-hiyori' && previewCurrentMeta.dataSource === 'preview-current' && !previewCurrentMeta.hasError;

  await clearPreviewSessionStorage(page);
  await clearLocalPreviewSessions(page);
  await clearPreviewCurrent(page);
  await page.goto(previewUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
  const builderDataMeta = await readPreviewMeta(page);
  await page.screenshot({ path: shot('preview-builderData-fallback-source.png'), fullPage: false });
  const builderDataFallbackWorks = builderDataMeta.templateId === 'drink-matcha-hiyori' && builderDataMeta.dataSource === 'builder-data' && !builderDataMeta.hasError;

  await clearAllPreviewStorage(page);
  await page.goto(`${baseUrl}/preview?templateId=drink-matcha-hiyori&mode=mobile&viewport=390`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForSelector('[data-testid="preview-error"]', { timeout: 20000 });
  const errorText = await page.locator('body').innerText();
  await page.screenshot({ path: shot('preview-error-only-when-all-storage-missing.png'), fullPage: false });
  const errorOnlyWhenAllStorageMissing = errorText.includes(LOST_MESSAGE);

  await browser.close();

  const output = {
    ok: false,
    baseUrl,
    testedTemplates: targetTemplateIds.length,
    normalSessionWorks,
    sessionStorageSourceWorks,
    localStorageSessionFallbackWorks,
    previewCurrentFallbackWorks,
    builderDataFallbackWorks,
    errorOnlyWhenAllStorageMissing,
    noUnexpectedPreviewDataLost,
    results: templateResults,
  };
  output.ok =
    output.testedTemplates === 5 &&
    normalSessionWorks &&
    sessionStorageSourceWorks &&
    localStorageSessionFallbackWorks &&
    previewCurrentFallbackWorks &&
    builderDataFallbackWorks &&
    errorOnlyWhenAllStorageMissing &&
    noUnexpectedPreviewDataLost;

  fs.writeFileSync(resultPath, JSON.stringify(output, null, 2));
  if (!output.ok) {
    console.error(JSON.stringify(output, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify(output, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
