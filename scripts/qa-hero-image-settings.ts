import { chromium, type Page } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';

const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:3050';
const outDir = path.join(process.cwd(), 'qa-artifacts/v0.3.0/hero-image-settings');
const resultPath = path.join(process.cwd(), 'qa-artifacts/v0.3.0/hero-image-settings-result.json');
const zipPath = path.join(outDir, 'generated-site.zip');
const unzipDir = path.join(outDir, 'unzipped');

const result: Record<string, boolean> = {
  ok: false,
  heroImageSettingsVisible: false,
  templateModeWorks: false,
  customUploadWorks: false,
  previewShowsCustomHero: false,
  fullscreenPreviewShowsCustomHero: false,
  templateSwitchKeepsCustomHero: false,
  clearCustomHeroWorks: false,
  exportHeroImageWorks: false,
};
const errors: string[] = [];
const redPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADUlEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC', 'base64');

async function shot(page: Page, name: string) {
  await page.screenshot({ path: path.join(outDir, name), fullPage: false });
}
async function noOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 2);
}
async function heroMode(page: Page) {
  return page.locator('[data-testid="site-hero"]').evaluate(el => (el as HTMLElement).dataset.heroImageMode || '');
}
async function openBasic(page: Page) {
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-sidebar-button="basic"]').click();
  await page.getByTestId('hero-image-settings').waitFor({ timeout: 15000 });
}

async function main() {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, acceptDownloads: true });
  const page = await context.newPage();

  await openBasic(page);
  result.heroImageSettingsVisible = await page.getByText('Hero 主視覺圖片').isVisible()
    && await page.locator('[data-testid="hero-mode-template"]').isVisible()
    && await page.locator('[data-testid="hero-mode-custom"]').isVisible();
  result.templateModeWorks = await page.locator('[data-testid="hero-mode-template"][aria-checked="true"]').count() === 1
    && await page.getByText('目前使用模板主視覺').isVisible()
    && await heroMode(page) === 'template';
  await shot(page, 'hero-settings-template-mode.png');

  await page.locator('[data-testid="hero-upload-input"]').setInputFiles({ name: 'qa-hero-upload.png', mimeType: 'image/png', buffer: redPng });
  await page.getByText('目前使用自訂 Hero 圖').waitFor({ timeout: 15000 });
  await page.locator('[data-testid="hero-media-choice"]').first().waitFor({ timeout: 15000 });
  await page.waitForFunction(() => {
    const d = JSON.parse(localStorage.getItem('store-site-builder-data') || '{}');
    return d.hero?.imageMode === 'custom' && Boolean(d.hero?.imageId) && d.media?.some((m: any) => m.id === d.hero.imageId && m.type === 'hero');
  }, undefined, { timeout: 15000 });
  await shot(page, 'hero-settings-upload.png');
  await shot(page, 'hero-settings-custom-selected.png');

  const storage = await page.evaluate(() => JSON.parse(localStorage.getItem('store-site-builder-data') || '{}'));
  result.customUploadWorks = storage.hero?.imageMode === 'custom' && Boolean(storage.hero?.imageId) && storage.media?.some((m: any) => m.id === storage.hero.imageId && m.type === 'hero');
  result.previewShowsCustomHero = await heroMode(page) === 'custom' && await page.locator('[data-testid="site-hero"] .template-hero-backplate').evaluate((img: Element) => (img as HTMLImageElement).src.startsWith('data:image/png'));
  await shot(page, 'preview-custom-hero.png');

  await page.locator('[data-testid="fullscreen-preview-button"]').click();
  await page.waitForURL('**/preview**', { timeout: 15000 });
  await page.locator('[data-testid="fullscreen-preview-shell"]').waitFor({ timeout: 15000 });
  result.fullscreenPreviewShowsCustomHero = await heroMode(page) === 'custom' && await page.locator('[data-testid="site-hero"] .template-hero-backplate').evaluate((img: Element) => (img as HTMLImageElement).src.startsWith('data:image/png'));
  await shot(page, 'fullscreen-preview-custom-hero.png');

  await openBasic(page);
  await page.locator('[data-sidebar-button="template"]').click();
  await page.locator('[data-testid="template-gallery-grid"]').waitFor({ timeout: 15000 });
  const firstApply = page.getByRole('button', { name: '套用' }).first();
  await firstApply.click();
  await page.waitForTimeout(800);
  await page.waitForFunction((expectedId) => {
    const d = JSON.parse(localStorage.getItem('store-site-builder-data') || '{}');
    return d.hero?.imageMode === 'custom' && d.hero?.imageId === expectedId;
  }, storage.hero.imageId, { timeout: 15000 });
  const afterSwitch = await page.evaluate(() => JSON.parse(localStorage.getItem('store-site-builder-data') || '{}'));
  result.templateSwitchKeepsCustomHero = afterSwitch.hero?.imageMode === 'custom' && afterSwitch.hero?.imageId === storage.hero.imageId;
  result.previewShowsCustomHero = result.previewShowsCustomHero && await heroMode(page) === 'custom';
  await shot(page, 'after-template-switch-custom-hero.png');

  await page.locator('[data-sidebar-button="basic"]').click();
  await page.getByTestId('hero-image-settings').waitFor({ timeout: 15000 });
  await page.getByTestId('clear-custom-hero').click();
  await page.getByText('目前使用模板主視覺').waitFor({ timeout: 15000 });
  await page.waitForFunction(() => {
    const d = JSON.parse(localStorage.getItem('store-site-builder-data') || '{}');
    return d.hero?.imageMode === 'template' && !d.hero?.imageId;
  }, undefined, { timeout: 15000 });
  const cleared = await page.evaluate(() => JSON.parse(localStorage.getItem('store-site-builder-data') || '{}'));
  result.clearCustomHeroWorks = cleared.hero?.imageMode === 'template' && !cleared.hero?.imageId && await heroMode(page) === 'template';
  await shot(page, 'hero-settings-back-to-template-mode.png');

  // Restore custom mode before export so ZIP can verify custom Hero asset path.
  await page.locator('[data-testid="hero-upload-input"]').setInputFiles({ name: 'qa-hero-export.png', mimeType: 'image/png', buffer: redPng });
  await page.getByText('目前使用自訂 Hero 圖').waitFor({ timeout: 15000 });
  await page.locator('[data-sidebar-button="export"]').click();
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 30000 }),
    page.getByRole('button', { name: '匯出 ZIP' }).click(),
  ]);
  await download.saveAs(zipPath);
  fs.rmSync(unzipDir, { recursive: true, force: true });
  fs.mkdirSync(unzipDir, { recursive: true });
  const zip = await JSZip.loadAsync(fs.readFileSync(zipPath));
  await Promise.all(Object.entries(zip.files).map(async ([name, file]) => {
    if (file.dir) return;
    const target = path.join(unzipDir, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, await file.async('nodebuffer'));
  }));
  const html = fs.readFileSync(path.join(unzipDir, 'index.html'), 'utf8');
  const assetNames = fs.readdirSync(path.join(unzipDir, 'assets'));
  const exported = await page.evaluate(() => JSON.parse(localStorage.getItem('store-site-builder-data') || '{}'));
  const expectedAsset = `${exported.hero.imageId}.png`;
  result.exportHeroImageWorks = html.includes(`assets/${expectedAsset}`) && assetNames.includes(expectedAsset) && !/localhost|127\.0\.0\.1|\/_next/.test(html);
  await page.goto(`file://${path.join(unzipDir, 'index.html')}`, { waitUntil: 'domcontentloaded' });
  result.exportHeroImageWorks = result.exportHeroImageWorks && await page.locator('[data-testid="site-hero"] .template-hero-backplate').evaluate((img: Element, expected) => (img as HTMLImageElement).src.includes(String(expected)), expectedAsset);
  await shot(page, 'export-custom-hero-file.png');

  for (const width of [390, 375, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`file://${path.join(unzipDir, 'index.html')}`, { waitUntil: 'domcontentloaded' });
    if (!await noOverflow(page)) result.exportHeroImageWorks = false;
  }

  await browser.close();
  result.ok = Object.entries(result).filter(([key]) => key !== 'ok').every(([, value]) => value);
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

main().catch(error => {
  errors.push(error.stack || String(error));
  fs.mkdirSync(path.dirname(resultPath), { recursive: true });
  fs.writeFileSync(resultPath, JSON.stringify({ ...result, ok: false, errors }, null, 2));
  console.error(error);
  process.exit(1);
});
