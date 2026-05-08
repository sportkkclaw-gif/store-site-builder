import { chromium, type Page } from 'playwright';
import fs from 'fs';
import path from 'path';

const baseUrl = process.env.PREVIEW_URL || process.argv[2];
if (!baseUrl) throw new Error('Usage: PREVIEW_URL=https://... npx tsx scripts/qa-v013-live.ts');

const outDir = path.resolve('qa-artifacts/v0.1.3');
fs.mkdirSync(outDir, { recursive: true });

const forbidden = [
  'AI-designed',
  'AI-generated',
  'website template key visual',
  'website template showcase',
  'concept image',
  'showcase image',
  'template artwork',
  'premium AI',
  'bold AI',
  'Create a',
  'for a brand called',
  'prompt',
];

const templates = [
  { name: '抹茶日和', industry: '飲料店' },
  { name: '珍珠霓光', industry: '飲料店' },
  { name: '茶霧山嵐', industry: '飲料店' },
  { name: '金色晚宴', industry: '餐飲店' },
  { name: '白瓷濾杯', industry: '咖啡廳' },
  { name: '城市黑白', industry: '咖啡廳' },
];

async function clickSection(page: Page, label: string) {
  const button = page.getByRole('button', { name: label }).first();
  if (await button.count()) await button.click({ force: true });
}

async function setIndustry(page: Page, label: string) {
  await page.getByRole('tab', { name: new RegExp(label) }).click({ force: true });
  await page.waitForTimeout(350);
}

async function applyTemplate(page: Page, name: string, industry: string) {
  await setIndustry(page, industry);
  const heading = page.getByRole('heading', { name }).first();
  await heading.scrollIntoViewIfNeeded();
  const card = page.locator('article').filter({ has: heading }).first();
  const apply = card.getByRole('button', { name: /套用|已套用|目前使用中/ }).last();
  await apply.click({ force: true });
  await page.waitForTimeout(900);
}

async function previewMetrics(page: Page, name: string) {
  return await page.evaluate((templateName) => {
    const h1 = document.querySelector('.store-template h1') || document.querySelector('aside main h1') || document.querySelector('[class*="preview"] h1');
    const preview = document.querySelector('.store-template') || document.querySelector('aside, [class*="builder-preview-column"]') || document.body;
    const rect = h1?.getBoundingClientRect();
    const style = h1 ? getComputedStyle(h1) : null;
    const text = h1?.textContent || '';
    const lineHeight = style ? parseFloat(style.lineHeight) : 0;
    const lines = rect && lineHeight ? Math.max(1, Math.ceil(rect.height / lineHeight)) : 0;
    const chars = text.replace(/\s+/g, '').length || 1;
    const oneCharPerLine = lines >= Math.min(chars - 1, 4);
    const previewText = preview.textContent || '';
    return {
      templateName,
      currentTemplateVisible: previewText.includes(templateName),
      h1Text: text,
      h1Visible: !!h1 && !!rect && rect.width > 20 && rect.height > 10,
      h1Width: rect?.width || 0,
      h1Height: rect?.height || 0,
      fontSize: style?.fontSize || '',
      lineHeight: style?.lineHeight || '',
      wordBreak: style?.wordBreak || '',
      overflowWrap: style?.overflowWrap || '',
      lines,
      h1LessOrEqual4Lines: lines <= 4,
      noOneCharPerLine: !oneCharPerLine,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 2,
    };
  }, name);
}

async function forbiddenCounts(page: Page) {
  return await page.evaluate((terms) => {
    const text = document.body.innerText;
    return Object.fromEntries(terms.map((term) => [term, (text.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length]));
  }, forbidden);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const result: any = { baseUrl, version: null, forbiddenCounts: {}, templates: [], mobile390: null, mobile320: null, backEditVisible: false, modalBackVisible: false, screenshots: [] };

  await page.goto(`${baseUrl}/__version`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  result.version = await page.locator('body').innerText();

  await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  await clickSection(page, '▦ 模板選擇');
  result.forbiddenCounts = await forbiddenCounts(page);
  const forbiddenTotal = Object.values(result.forbiddenCounts).reduce((a: number, b: any) => a + Number(b), 0);
  if (forbiddenTotal > 0) throw new Error(`Forbidden strings found: ${JSON.stringify(result.forbiddenCounts)}`);

  for (const t of templates) {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await applyTemplate(page, t.name, t.industry);
    const desktop = await previewMetrics(page, t.name);
    await page.screenshot({ path: path.join(outDir, `live-${t.name}-desktop.png`), fullPage: true });
    await page.setViewportSize({ width: 390, height: 900 });
    await page.waitForTimeout(400);
    const previewButton = page.getByRole('button', { name: '預覽' }).first();
    if (await previewButton.count()) await previewButton.click({ force: true });
    await page.waitForTimeout(400);
    const mobile = await previewMetrics(page, t.name);
    await page.screenshot({ path: path.join(outDir, `live-${t.name}-mobile.png`), fullPage: true });
    result.screenshots.push(`live-${t.name}-desktop.png`, `live-${t.name}-mobile.png`);
    result.templates.push({ name: t.name, desktop, mobile });
  }

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(700);
  result.mobile390 = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 2 }));
  const previewTab = page.getByRole('button', { name: '預覽' }).first();
  if (await previewTab.count()) await previewTab.click({ force: true });
  await page.waitForTimeout(300);
  result.backEditVisible = await page.getByRole('button', { name: /返回編輯/ }).first().isVisible().catch(() => false);

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(700);
  await clickSection(page, '▦ 模板選擇');
  const quick = page.getByRole('button', { name: /快速預覽/ }).first();
  if (await quick.count()) await quick.click({ force: true });
  await page.waitForTimeout(500);
  result.modalBackVisible = await page.getByRole('button', { name: /返回模板庫/ }).first().isVisible().catch(() => false);

  await page.setViewportSize({ width: 320, height: 820 });
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(700);
  result.mobile320 = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 2 }));

  result.ok = Object.values(result.forbiddenCounts).every((v: any) => Number(v) === 0)
    && result.templates.every((t: any) => t.desktop.h1Visible && t.desktop.h1LessOrEqual4Lines && t.desktop.noOneCharPerLine && t.desktop.noHorizontalOverflow && t.mobile.h1Visible && t.mobile.h1LessOrEqual4Lines && t.mobile.noOneCharPerLine && t.mobile.noHorizontalOverflow)
    && result.mobile390.noHorizontalOverflow && result.mobile320.noHorizontalOverflow && result.backEditVisible && result.modalBackVisible;

  fs.writeFileSync(path.join(outDir, 'live-qa-result.json'), JSON.stringify(result, null, 2));
  await browser.close();
  if (!result.ok) throw new Error('Live QA failed; see qa-artifacts/v0.1.3/live-qa-result.json');
  console.log(JSON.stringify({ ok: true, out: path.join(outDir, 'live-qa-result.json') }, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });
