import { chromium, type Page } from 'playwright';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3102';
const outDir = process.env.QA_OUT || '/mnt/d/HERMES_TMP/01_REPO_CLONES/store-site-builder/qa-artifacts/v0.1.2';
const templates = ['抹茶日和', '珍珠霓光', '金色晚宴', '香辣市集', '白瓷濾杯', '城市黑白'];
const results: string[] = [];

async function screenshot(page: Page, name: string) {
  await page.screenshot({ path: path.join(outDir, name), fullPage: true });
  results.push(`screenshot:${name}`);
}

async function applyTemplate(page: Page, name: string) {
  const heading = page.getByRole('heading', { name }).first();
  await heading.scrollIntoViewIfNeeded();
  const card = page.locator('article').filter({ has: heading }).first();
  const apply = card.getByRole('button', { name: /套用模板|已套用/ }).first();
  if (await apply.count()) {
    const text = (await apply.innerText()).trim();
    if (!text.includes('已套用')) await apply.click();
  } else {
    throw new Error(`Apply button not found: ${name}`);
  }
  await page.waitForTimeout(500);
}

async function setIndustry(page: Page, name: string) {
  await page.getByRole('button', { name: '▦ 模板選擇' }).click();
  const tab = page.getByRole('tab', { name: new RegExp(name) });
  if (await tab.count()) await tab.click();
  await page.waitForTimeout(300);
}

async function metrics(page: Page, name: string) {
  const m = await page.evaluate((templateName) => {
    const main = document.querySelector('.store-template') as HTMLElement | null;
    const card = document.querySelector('.store-template .template-card') as HTMLElement | null;
    const h1 = document.querySelector('.store-template h1') as HTMLElement | null;
    const img = document.querySelector('.store-template img') as HTMLImageElement | null;
    const cs = main ? getComputedStyle(main) : null;
    const cc = card ? getComputedStyle(card) : null;
    return {
      templateName,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth,
      templatePreset: main?.getAttribute('data-template-preset') || '',
      layoutFamily: main?.getAttribute('data-layout-family') || '',
      mainBackground: cs?.background || '',
      cardBackground: cc?.backgroundColor || '',
      cardShadow: cc?.boxShadow || '',
      h1Text: h1?.textContent || '',
      imageSrc: img?.getAttribute('src') || '',
    };
  }, name);
  results.push(`metric:${JSON.stringify(m)}`);
  return m;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await screenshot(page, '01-builder-desktop-overview.png');
  await setIndustry(page, '飲料店');
  await screenshot(page, '02-template-gallery-desktop.png');

  const templateMetrics: any[] = [];
  for (const t of templates) {
    if (['金色晚宴','香辣市集'].includes(t)) await setIndustry(page, '餐飲店');
    if (['白瓷濾杯','城市黑白'].includes(t)) await setIndustry(page, '咖啡廳');
    await applyTemplate(page, t);
    await page.waitForTimeout(500);
    templateMetrics.push(await metrics(page, t));
    const slug = t === '抹茶日和' ? 'matcha' : t === '珍珠霓光' ? 'pearl-neon' : t === '金色晚宴' ? 'gold-dinner' : t === '香辣市集' ? 'spicy-market' : t === '白瓷濾杯' ? 'white-cafe' : 'city-mono';
    await screenshot(page, `template-${slug}.png`);
  }

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await screenshot(page, '09-mobile-390-builder.png');
  const mobile390 = await metrics(page, 'mobile-390');
  const previewTab = page.getByRole('button', { name: /預覽/ }).first();
  if (await previewTab.count()) await previewTab.click();
  await page.waitForTimeout(500);
  await screenshot(page, '10-mobile-390-preview-back.png');
  const backVisible = await page.getByRole('button', { name: /返回編輯|返回/ }).first().isVisible().catch(() => false);

  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await screenshot(page, '11-mobile-320-builder.png');
  const mobile320 = await metrics(page, 'mobile-320');

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 30000 }),
    page.getByRole('button', { name: '匯出 ZIP' }).click(),
  ]);
  const zipPath = path.join(outDir, 'store-site-builder-v0.1.2-export.zip');
  await download.saveAs(zipPath);
  const zipData = fs.readFileSync(zipPath);
  const zip = await JSZip.loadAsync(zipData);
  const names = Object.keys(zip.files).sort();
  const indexEntry = zip.file('index.html');
  if (!indexEntry) throw new Error('ZIP missing index.html');
  const html = await indexEntry.async('string');
  const badTokens = ['localhost', '127.0.0.1', '/_next'].filter((token) => html.includes(token));
  const assetCount = names.filter((n) => n.startsWith('assets/') && !zip.files[n].dir).length;
  fs.writeFileSync(path.join(outDir, 'qa-v012-summary.json'), JSON.stringify({
    baseUrl,
    templates: templateMetrics,
    mobile390,
    mobile320,
    backVisible,
    zip: { path: zipPath, entries: names, assetCount, badTokens, htmlHasPresetStyles: html.includes('template-page') && html.includes('hero-artwork') },
    results,
  }, null, 2));
  await browser.close();
  console.log(JSON.stringify({ ok: true, outDir, templateCount: templateMetrics.length, mobile390, mobile320, backVisible, assetCount, badTokens }, null, 2));
}

main().catch((err) => { console.error(err); process.exit(1); });
