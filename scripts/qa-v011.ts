import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { chromium } from 'playwright';
import { createDefaultSiteData } from '../lib/defaultSiteData';
import { exportStaticSite } from '../lib/exportStaticSite';
import type { SiteData } from '../types/site';

const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:3101';
const outDir = process.env.QA_OUT_DIR || path.join(process.cwd(), 'qa-artifacts/v0.1.1');
mkdirSync(outDir, { recursive: true });

async function makeExports() {
  const zip = new JSZip();
  for (const template of ['fresh-japanese', 'premium-minimal', 'playful-colorful'] as const) {
    const data: SiteData = createDefaultSiteData();
    data.template = template;
    const html = exportStaticSite(data);
    const htmlPath = path.join(outDir, `export-${template}.html`);
    writeFileSync(htmlPath, html, 'utf8');
    if (/localhost|127\.0\.0\.1|\/_next|_next\//.test(html)) throw new Error(`forbidden runtime marker in ${template}`);
    zip.file(`${template}/index.html`, html);
    zip.file(`${template}/siteData.json`, JSON.stringify(data, null, 2));
  }
  zip.file('README.txt', 'StoreSite Builder v0.1.1 offline export QA zip');
  const buf = await zip.generateAsync({ type: 'nodebuffer' });
  writeFileSync(path.join(outDir, 'generated-site-v0.1.1-qa.zip'), buf);
}

async function screenshot() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, '01-home-desktop.png'), fullPage: true });

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, '02-home-mobile-390.png'), fullPage: true });
  const homeOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, '03-builder-overview.png'), fullPage: true });
  await page.locator('[data-sidebar-button="basic"]').click();
  await page.screenshot({ path: path.join(outDir, '04-builder-basic.png'), fullPage: true });
  await page.getByLabel('店名').fill('Jason 驗收咖啡店');
  await page.waitForTimeout(450);
  const storedName = await page.evaluate(() => JSON.parse(localStorage.getItem('store-site-builder-data') || '{}')?.store?.name);
  if (storedName !== 'Jason 驗收咖啡店') throw new Error('localStorage autosave failed');

  await page.locator('[data-sidebar-button="template"]').click();
  await page.screenshot({ path: path.join(outDir, '05-builder-template.png'), fullPage: true });
  await page.getByRole('button', { name: /質感極簡/ }).click();
  await page.getByRole('button', { name: /活潑可愛/ }).click();
  await page.getByRole('button', { name: /清新日系/ }).click();

  await page.locator('[data-sidebar-button="menu"]').click();
  await page.screenshot({ path: path.join(outDir, '06-builder-menu.png'), fullPage: true });

  const preview = page.locator('[data-testid="preview-panel"]');
  await preview.screenshot({ path: path.join(outDir, '07-builder-preview-desktop.png') });
  await page.locator('[data-testid="preview-panel"]').getByRole('button', { name: '手機' }).click();
  await preview.screenshot({ path: path.join(outDir, '08-builder-preview-mobile.png') });

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'networkidle' });
  const builderOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

  const exportOverflow: Record<string, boolean> = {};
  for (const [i, template] of ['fresh-japanese', 'premium-minimal', 'playful-colorful'].entries()) {
    await page.goto(`file://${path.join(outDir, `export-${template}.html`)}`, { waitUntil: 'load' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    exportOverflow[template] = overflow;
    if (overflow) throw new Error(`export mobile overflow: ${template}`);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.screenshot({ path: path.join(outDir, `${String(9 + i).padStart(2, '0')}-export-${template}.png`), fullPage: true });
    await page.setViewportSize({ width: 390, height: 900 });
  }
  await browser.close();
  return { homeOverflow, builderOverflow, exportOverflow };
}

(async () => {
  await makeExports();
  const result = await screenshot();
  writeFileSync(path.join(outDir, 'qa-result.json'), JSON.stringify({ ok: true, ...result, outDir }, null, 2));
  console.log(JSON.stringify({ ok: true, ...result, outDir }, null, 2));
})();
