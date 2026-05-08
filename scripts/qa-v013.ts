import { chromium, type Page } from 'playwright';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3105';
const outDir = process.env.QA_OUT || '/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder/qa-artifacts/v0.1.3';
const templates = [
  { name: '抹茶日和', industry: '飲料店', slug: 'matcha' },
  { name: '珍珠霓光', industry: '飲料店', slug: 'pearl-neon' },
  { name: '茶霧山嵐', industry: '飲料店', slug: 'tea-mist' },
  { name: '金色晚宴', industry: '餐飲店', slug: 'gold-dinner' },
  { name: '白瓷濾杯', industry: '咖啡廳', slug: 'white-dripper' },
  { name: '城市黑白', industry: '咖啡廳', slug: 'city-mono' },
];
const results: string[] = [];

async function screenshot(page: Page, name: string) {
  await page.screenshot({ path: path.join(outDir, name), fullPage: true });
  results.push(`screenshot:${name}`);
}
async function setIndustry(page: Page, name: string) {
  await page.getByRole('button', { name: '▦ 模板選擇' }).click();
  const tab = page.getByRole('tab', { name: new RegExp(name) });
  if (await tab.count()) await tab.click();
  else await page.getByRole('button', { name: new RegExp(name) }).first().click().catch(() => {});
  await page.waitForTimeout(300);
}
async function applyTemplate(page: Page, name: string) {
  const heading = page.getByRole('heading', { name }).first();
  await heading.scrollIntoViewIfNeeded();
  const card = page.locator('article').filter({ has: heading }).first();
  const apply = card.getByRole('button', { name: /套用|已套用|目前使用中/ }).last();
  if (!(await apply.count())) throw new Error(`Apply button not found: ${name}`);
  await apply.click({ force: true });
  await page.waitForTimeout(800);
}
async function heroMetrics(page: Page, name: string) {
  return await page.evaluate((templateName) => {
    const h1 = document.querySelector('.store-template h1') as HTMLElement | null;
    const hero = document.querySelector('.store-template .hero-grid') as HTMLElement | null;
    const img = document.querySelector('.store-template img') as HTMLImageElement | null;
    const rect = h1?.getBoundingClientRect();
    const heroRect = hero?.getBoundingClientRect();
    const cs = h1 ? getComputedStyle(h1) : null;
    return {
      templateName,
      h1Text: h1?.textContent || '',
      h1Width: Math.round(rect?.width || 0),
      h1Height: Math.round(rect?.height || 0),
      heroWidth: Math.round(heroRect?.width || 0),
      heroHeight: Math.round(heroRect?.height || 0),
      fontSize: cs?.fontSize || '',
      lineHeight: cs?.lineHeight || '',
      wordBreak: cs?.wordBreak || '',
      overflowWrap: cs?.overflowWrap || '',
      readable: !!rect && rect.width >= 180 && rect.height < 260,
      imageSrc: img?.getAttribute('src') || '',
      treatment: hero?.getAttribute('data-treatment') || '',
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth,
    };
  }, name);
}
async function exportZip(page: Page, templateName: string, slug: string) {
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 30000 }),
    page.getByRole('button', { name: '匯出 ZIP' }).click(),
  ]);
  const zipPath = path.join(outDir, `export-${slug}.zip`);
  await download.saveAs(zipPath);
  const zip = await JSZip.loadAsync(fs.readFileSync(zipPath));
  const entries = Object.keys(zip.files).sort();
  const html = await zip.file('index.html')!.async('string');
  const badTokens = ['localhost', '127.0.0.1', '/_next'].filter(t => html.includes(t));
  const assetEntries = entries.filter(n => n.startsWith('assets/') && !zip.files[n].dir);
  const extractDir = path.join('/tmp', `store-site-builder-v013-${slug}`);
  fs.rmSync(extractDir, { recursive: true, force: true });
  fs.mkdirSync(extractDir, { recursive: true });
  for (const name of entries) {
    if (zip.files[name].dir) continue;
    const dest = path.join(extractDir, name);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, await zip.files[name].async('nodebuffer'));
  }
  return { templateName, zipPath, extractDir, entries, assetEntries, badTokens, heroReadableCss: html.includes('word-break:keep-all') && html.includes('clamp(34px,11vw,52px)'), hasArtwork: assetEntries.length > 0 };
}
async function main() {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await screenshot(page, '01-builder-desktop-overview.png');
  await setIndustry(page, '飲料店');
  await screenshot(page, '02-template-gallery-portfolio-wall.png');
  const modalHeading = page.getByRole('heading', { name: '茶霧山嵐' }).first();
  await modalHeading.scrollIntoViewIfNeeded();
  const modalButton = page.getByRole('button', { name: /快速預覽 茶霧山嵐/ }).first();
  if (await modalButton.count()) await modalButton.click({ force: true });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.waitForTimeout(500);
  const modalBackVisible = await page.getByRole('button', { name: /返回模板庫/ }).first().isVisible().catch(() => false);
  await screenshot(page, '03-template-modal-back.png');
  await page.getByRole('button', { name: /返回模板庫|關閉/ }).first().click({ force: true }).catch(() => {});
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);

  const templateMetrics: any[] = [];
  const exportMetrics: any[] = [];
  for (const t of templates) {
    await setIndustry(page, t.industry);
    await applyTemplate(page, t.name);
    await page.waitForTimeout(500);
    const m = await heroMetrics(page, t.name);
    templateMetrics.push(m);
    await screenshot(page, `template-${t.slug}.png`);
    exportMetrics.push(await exportZip(page, t.name, t.slug));
  }

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await screenshot(page, '10-mobile-390-builder.png');
  const mobile390 = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth }));
  await page.getByRole('button', { name: /預覽/ }).first().click();
  await page.waitForTimeout(500);
  const backEditVisible = await page.getByRole('button', { name: /返回編輯/ }).first().isVisible().catch(() => false);
  await screenshot(page, '11-mobile-390-preview-back.png');

  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await screenshot(page, '12-mobile-320-builder.png');
  const mobile320 = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth }));

  const filePage = await browser.newPage({ viewport: { width: 390, height: 900 } });
  const firstExtract = exportMetrics[0].extractDir;
  await filePage.goto(`file://${firstExtract}/index.html`, { waitUntil: 'domcontentloaded' });
  await filePage.waitForTimeout(500);
  const fileMetrics = await filePage.evaluate(() => {
    const img = document.querySelector('img') as HTMLImageElement | null;
    const h1 = document.querySelector('h1') as HTMLElement | null;
    const rect = h1?.getBoundingClientRect();
    return { title: document.title, hasImage: !!img, imgSrc: img?.getAttribute('src') || '', h1Text: h1?.textContent || '', h1Width: Math.round(rect?.width || 0), scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth };
  });
  await filePage.screenshot({ path: path.join(outDir, '13-file-export-mobile.png'), fullPage: true });

  const summary = { baseUrl, templates: templateMetrics, exports: exportMetrics, mobile390, mobile320, backEditVisible, modalBackVisible, fileMetrics, results };
  fs.writeFileSync(path.join(outDir, 'qa-v013-summary.json'), JSON.stringify(summary, null, 2));
  await browser.close();
  console.log(JSON.stringify({ ok: true, outDir, templateCount: templateMetrics.length, exportCount: exportMetrics.length, mobile390, mobile320, backEditVisible, modalBackVisible, fileMetrics }, null, 2));
}
main().catch((err) => { console.error(err); process.exit(1); });
