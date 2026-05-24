import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { templateCatalog } from '../lib/templateCatalog';
import { defaultSiteData } from '../lib/defaultSiteData';
import { applyTemplatePresetSync } from '../lib/applyTemplatePreset';
import { exportStaticSite } from '../lib/exportStaticSite';

const outDir = path.join(process.cwd(), 'qa-artifacts/v0.3.1/template-artwork-cleanup');
const resultPath = path.join(process.cwd(), 'qa-artifacts/v0.3.1/template-artwork-cleanup-result.json');
const manifestPath = path.join(outDir, 'template-artwork-audit.json');
const screenshotDir = path.join(outDir, 'screenshots');
const baseUrl = process.env.BASE_URL || process.env.QA_BASE_URL || 'http://127.0.0.1:4323';

const expected = [
  ['drink-matcha-hiyori','public/template-gallery-ai/drink-shop/drink-matcha-hiyori.png'],
  ['drink-boba-neon','public/template-gallery-ai/drink-shop/drink-boba-neon.png'],
  ['drink-fruit-paradise','public/template-gallery-ai/drink-shop/drink-fruit-paradise.png'],
  ['drink-brown-sugar-amber','public/template-gallery-ai/drink-shop/drink-brown-sugar-amber.png'],
  ['drink-white-peach-sparkle','public/template-gallery-ai/drink-shop/drink-white-peach-sparkle.png'],
  ['drink-lime-morning','public/template-gallery-ai/drink-shop/drink-lime-morning.png'],
  ['drink-tea-mist-ridge','public/template-gallery-ai/drink-shop/drink-tea-mist-ridge.png'],
  ['drink-iced-party','public/template-gallery-ai/drink-shop/drink-iced-party.png'],
  ['drink-afternoon-cream','public/template-gallery-ai/drink-shop/drink-afternoon-cream.png'],
  ['drink-lab-brew','public/template-gallery-ai/drink-shop/drink-lab-brew.png'],
  ['restaurant-charcoal-essence','public/template-gallery-ai/restaurant/restaurant-charcoal-essence.png'],
  ['restaurant-rice-kitchen','public/template-gallery-ai/restaurant/restaurant-rice-kitchen.png'],
  ['restaurant-golden-banquet','public/template-gallery-ai/restaurant/restaurant-golden-banquet.png'],
  ['restaurant-corner-meal','public/template-gallery-ai/restaurant/restaurant-corner-meal.png'],
  ['restaurant-spicy-market','public/template-gallery-ai/restaurant/restaurant-spicy-market.png'],
  ['restaurant-sunday-shokudo','public/template-gallery-ai/restaurant/restaurant-sunday-shokudo.png'],
  ['restaurant-kitchen-overture','public/template-gallery-ai/restaurant/restaurant-kitchen-overture.png'],
  ['restaurant-brunch-garden','public/template-gallery-ai/restaurant/restaurant-brunch-garden.png'],
  ['restaurant-hotpot-home','public/template-gallery-ai/restaurant/restaurant-hotpot-home.png'],
  ['restaurant-fast-enjoy','public/template-gallery-ai/restaurant/restaurant-fast-enjoy.png'],
  ['cafe-nordic-morning','public/template-gallery-ai/cafe/cafe-nordic-morning.png'],
  ['cafe-midnight-roast','public/template-gallery-ai/cafe/cafe-midnight-roast.png'],
  ['cafe-cream-library','public/template-gallery-ai/cafe/cafe-cream-library.png'],
  ['cafe-forest-teatime','public/template-gallery-ai/cafe/cafe-forest-teatime.png'],
  ['cafe-window-seat','public/template-gallery-ai/cafe/cafe-window-seat.png'],
  ['cafe-mocha-studio','public/template-gallery-ai/cafe/cafe-mocha-studio.png'],
  ['cafe-white-dripper','public/template-gallery-ai/cafe/cafe-white-dripper.png'],
  ['cafe-caramel-afternoon','public/template-gallery-ai/cafe/cafe-caramel-afternoon.png'],
  ['cafe-urban-monochrome','public/template-gallery-ai/cafe/cafe-urban-monochrome.png'],
  ['cafe-daily-corner','public/template-gallery-ai/cafe/cafe-daily-corner.png'],
] as const;

function pngSize(filePath: string) {
  const buf = fs.readFileSync(filePath);
  if (buf.slice(12, 16).toString('ascii') !== 'IHDR') throw new Error(`not a PNG: ${filePath}`);
  return `${buf.readUInt32BE(16)}x${buf.readUInt32BE(20)}`;
}

function publicUrl(imagePath: string) {
  return imagePath.replace(/^public/, '');
}

async function waitForImageOk(page: any, selector: string) {
  await page.waitForSelector(selector, { state: 'attached', timeout: 10000 });
  return page.locator(selector).first().evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0 && img.naturalHeight > 0);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(screenshotDir, { recursive: true });
  const failed: string[] = [];
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const manifestById = new Map<string, any>(manifest.items.map((item: any) => [item.templateId, item]));

  const allImagesExist = expected.every(([, p]) => fs.existsSync(path.join(process.cwd(), p)));
  if (!allImagesExist) failed.push('missing template artwork file');

  const allPathsUnchanged = expected.every(([id, p]) => manifestById.get(id)?.imagePath === p && templateCatalog.find(t => t.id === id)?.artworkSrc === publicUrl(p));
  if (!allPathsUnchanged) failed.push('path/catalog mapping changed');

  const allSizesUnchanged = expected.every(([id, p]) => {
    const item = manifestById.get(id);
    return !!item && item.originalSize === item.finalSize && item.finalSize === pngSize(path.join(process.cwd(), p)) && item.sizeUnchanged === true;
  });
  if (!allSizesUnchanged) failed.push('image size changed');

  const allNoFakeUiConfirmed = manifest.ok === true && manifest.totalTemplates === 30 && manifest.failed.length === 0 && expected.every(([id]) => manifestById.get(id)?.noFakeUi === true);
  if (!allNoFakeUiConfirmed) failed.push('manifest noFakeUi confirmation incomplete');

  let galleryLoads = false;
  let previewLoads = false;
  let fullscreenPreviewLoads = false;
  let exportIncludesArtwork = false;
  let fileLoads = false;
  const mobileViewportResults: Record<string, boolean> = { '390': false, '375': false, '320': false };

  const exportChecks = expected.map(([id, p]) => {
    const template = templateCatalog.find(t => t.id === id)!;
    const data = applyTemplatePresetSync(defaultSiteData, template);
    const html = exportStaticSite(data);
    return html.includes(publicUrl(p)) && html.includes(`data-template-id="${id}"`);
  });
  exportIncludesArtwork = exportChecks.every(Boolean);
  if (!exportIncludesArtwork) failed.push('export HTML does not include current artwork path');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 980 } });
  const page = await context.newPage();

  try {
    const routeChecks = await Promise.all(['/', '/builder', '/preview', '/deploy-guide', '/managed-hosting', '/__version'].map(async route => {
      const response = await context.request.get(`${baseUrl}${route}`, { timeout: 30000 });
      return response.status() < 500;
    }));
    if (!routeChecks.every(Boolean)) failed.push('required route did not load');

    for (const [id, p] of expected) {
      const template = templateCatalog.find(t => t.id === id)!;
      const data = applyTemplatePresetSync(defaultSiteData, template);
      const imageSelector = `img[src="${publicUrl(p)}"]`;

      await page.goto(`${baseUrl}/builder`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.evaluate(({ dataJson }) => localStorage.setItem('store-site-builder-data', dataJson), { dataJson: JSON.stringify(data) });
      await page.reload({ waitUntil: 'networkidle', timeout: 30000 });
      await page.locator('[data-sidebar-button="template"]').click();
      await page.locator(imageSelector).first().scrollIntoViewIfNeeded();
      if (!(await waitForImageOk(page, imageSelector))) failed.push(`${id}: gallery image not loaded`);
      await page.locator(imageSelector).first().screenshot({ path: path.join(screenshotDir, `${id}-gallery-card.png`) });

      await page.goto(`${baseUrl}/preview?mode=desktop&viewport=1440&qa=${id}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.evaluate(({ dataJson }) => {
        localStorage.setItem('store-site-builder-data', dataJson);
        sessionStorage.setItem('store-site-builder-preview-data', dataJson);
      }, { dataJson: JSON.stringify(data) });
      await page.reload({ waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForSelector('[data-testid="site-renderer"]', { timeout: 15000 });
      if (!(await waitForImageOk(page, imageSelector))) failed.push(`${id}: fullscreen preview image not loaded`);
      const renderer = page.locator('[data-testid="site-renderer"]').first();
      await renderer.screenshot({ path: path.join(screenshotDir, `${id}-fullscreen-desktop-hero.png`) });

      if (id === 'drink-matcha-hiyori' || id === 'restaurant-rice-kitchen') {
        const after = page.locator(imageSelector).first();
        await after.screenshot({ path: path.join(screenshotDir, `${id}-after-clean-artwork.png`) });
      }
    }
    galleryLoads = failed.filter(item => item.includes('gallery image not loaded')).length === 0;
    fullscreenPreviewLoads = failed.filter(item => item.includes('fullscreen preview image not loaded')).length === 0;
    previewLoads = fullscreenPreviewLoads;

    for (const width of [390, 375, 320]) {
      await page.setViewportSize({ width, height: 820 });
      const [id] = expected[0];
      const template = templateCatalog.find(t => t.id === id)!;
      const data = applyTemplatePresetSync(defaultSiteData, template);
      await page.goto(`${baseUrl}/preview?mode=mobile&viewport=${width}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.evaluate(({ dataJson }) => {
        localStorage.setItem('store-site-builder-data', dataJson);
        sessionStorage.setItem('store-site-builder-preview-data', dataJson);
      }, { dataJson: JSON.stringify(data) });
      await page.reload({ waitUntil: 'networkidle', timeout: 30000 });
      const ok = await page.locator('[data-testid="site-renderer"]').first().isVisible({ timeout: 15000 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
      mobileViewportResults[String(width)] = ok && !overflow;
    }

    const fileHtml = path.join(outDir, 'file-preview-index.html');
    const template = templateCatalog.find(t => t.id === 'drink-matcha-hiyori')!;
    const data = applyTemplatePresetSync(defaultSiteData, template);
    const publicArtworkRoot = 'file:///' + path.join(process.cwd(), 'public/template-gallery-ai').split(path.sep).join('/') + '/';
    const assetDir = path.join(outDir, 'assets');
    fs.mkdirSync(assetDir, { recursive: true });
    fs.copyFileSync(path.join(process.cwd(), 'public/template-gallery-ai/drink-shop/drink-matcha-hiyori.png'), path.join(assetDir, 'template-artwork-drink-matcha-hiyori.png'));
    fs.writeFileSync(fileHtml, exportStaticSite(data).replaceAll('/template-gallery-ai/', publicArtworkRoot));
    await page.setViewportSize({ width: 1440, height: 980 });
    await page.goto(`file://${fileHtml.replaceAll('\\', '/')}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    fileLoads = await page.evaluate(() => Array.from(document.images).some((img: HTMLImageElement) => img.complete && img.naturalWidth > 0));
    if (!fileLoads) failed.push('file:// export preview image not loaded');
  } finally {
    await browser.close();
  }

  const screenshotCount = fs.readdirSync(screenshotDir).filter(name => name.endsWith('.png')).length;
  if (screenshotCount < 60) failed.push(`screenshots fewer than 60: ${screenshotCount}`);
  if (!Object.values(mobileViewportResults).every(Boolean)) failed.push('mobile viewport 390/375/320 failed');

  const result = {
    ok: failed.length === 0,
    totalTemplates: 30,
    allImagesExist,
    allSizesUnchanged,
    allPathsUnchanged,
    allNoFakeUiConfirmed,
    galleryLoads,
    previewLoads,
    fullscreenPreviewLoads,
    exportIncludesArtwork,
    fileLoads,
    mobileViewports: mobileViewportResults,
    screenshotsCount: screenshotCount,
    failed,
  };
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
  if (!result.ok) throw new Error(`template artwork cleanup QA failed: ${failed.join('; ')}`);
}

main().catch(error => {
  fs.mkdirSync(path.dirname(resultPath), { recursive: true });
  if (!fs.existsSync(resultPath)) {
    fs.writeFileSync(resultPath, JSON.stringify({ ok: false, totalTemplates: 30, failed: [error instanceof Error ? error.message : String(error)] }, null, 2));
  }
  console.error(error);
  process.exit(1);
});
