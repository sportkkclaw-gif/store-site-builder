import { chromium, type Page, type Locator } from 'playwright';
import fs from 'fs';
import path from 'path';

const baseUrl = process.env.PREVIEW_URL || process.argv[2];
if (!baseUrl) throw new Error('Usage: PREVIEW_URL=https://... npx tsx scripts/qa-v014-live.ts');

const outDir = path.resolve('qa-artifacts/v0.1.4');
fs.mkdirSync(outDir, { recursive: true });

const forbidden = ['AI-designed', 'AI-generated', 'website template key visual', 'concept image', 'showcase image', 'prompt'];

const templates = [
  { name: '抹茶日和', industry: '飲料店' },
  { name: '珍珠霓光', industry: '飲料店' },
  { name: '果香樂園', industry: '飲料店' },
  { name: '白桃氣泡', industry: '飲料店' },
  { name: '茶霧山嵐', industry: '飲料店' },
  { name: '金色晚宴', industry: '餐飲店' },
  { name: '香辣市集', industry: '餐飲店' },
  { name: '白瓷濾杯', industry: '咖啡廳' },
  { name: '城市黑白', industry: '咖啡廳' },
  { name: '北歐晨光', industry: '咖啡廳' },
];

async function clickSection(page: Page, label: string) {
  const button = page.getByRole('button', { name: label }).first();
  if (await button.count()) await button.click({ force: true });
}

async function setIndustry(page: Page, label: string) {
  await page.getByRole('tab', { name: new RegExp(label) }).click({ force: true });
  await page.waitForTimeout(300);
}

async function applyTemplate(page: Page, name: string, industry: string) {
  await setIndustry(page, industry);
  const heading = page.getByRole('heading', { name }).first();
  await heading.scrollIntoViewIfNeeded();
  const card = page.locator('article').filter({ has: heading }).first();
  const apply = card.getByRole('button', { name: /套用|已套用|目前使用中/ }).last();
  await apply.click({ force: true });
  await page.waitForTimeout(800);
}

async function forbiddenCounts(page: Page) {
  return await page.evaluate((terms) => {
    const text = document.body.innerText;
    return Object.fromEntries(terms.map((term) => [term, (text.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length]));
  }, forbidden);
}

async function previewMetrics(page: Page, templateName: string) {
  return await page.evaluate((name) => {
    const h1 = document.querySelector('.store-template h1') as HTMLElement | null;
    const subtitle = document.querySelector('.store-template .hero-copy .muted') as HTMLElement | null;
    const cta = document.querySelector('.store-template .hero-copy a') as HTMLElement | null;
    const heroCopy = document.querySelector('.store-template .hero-copy') as HTMLElement | null;
    const heroArt = document.querySelector('.store-template .hero-artwork, .store-template .hero-art') as HTMLElement | null;
    const root = document.querySelector('.store-template') as HTMLElement | null;
    const rect = h1?.getBoundingClientRect();
    const subtitleRect = subtitle?.getBoundingClientRect();
    const ctaRect = cta?.getBoundingClientRect();
    const copyRect = heroCopy?.getBoundingClientRect();
    const artRect = heroArt?.getBoundingClientRect();
    const style = h1 ? getComputedStyle(h1) : null;
    const subtitleStyle = subtitle ? getComputedStyle(subtitle) : null;
    const ctaStyle = cta ? getComputedStyle(cta) : null;
    const lineHeight = style ? parseFloat(style.lineHeight) : 0;
    const lines = rect && lineHeight ? Math.max(1, Math.ceil(rect.height / lineHeight)) : 0;
    const text = h1?.textContent?.replace(/\s+/g, '') || '';
    const avgCharsPerLine = lines ? text.length / lines : 0;
    const overlap = !!(copyRect && artRect && !(copyRect.right <= artRect.left || copyRect.left >= artRect.right || copyRect.bottom <= artRect.top || copyRect.top >= artRect.bottom));
    const h1Opacity = style ? Number(style.opacity || 1) : 0;
    const subtitleOpacity = subtitleStyle ? Number(subtitleStyle.opacity || 1) : 0;
    return {
      templateName: name,
      h1Text: h1?.textContent || '',
      h1Visible: !!rect && rect.width > 40 && rect.height > 18,
      h1Width: rect?.width || 0,
      h1Height: rect?.height || 0,
      fontSize: style?.fontSize || '',
      lineHeight: style?.lineHeight || '',
      h1Opacity,
      lines,
      h1LessOrEqual4Lines: lines <= 4,
      notOneOrTwoCharsPerLine: avgCharsPerLine >= 3,
      wordBreak: style?.wordBreak || '',
      overflowWrap: style?.overflowWrap || '',
      subtitleVisible: !!subtitleRect && subtitleRect.width > 80 && subtitleRect.height > 12,
      subtitleOpacity,
      subtitleReadable: !!subtitleRect && subtitleRect.width > 80 && subtitleRect.height > 12 && subtitleOpacity >= 0.72,
      ctaVisible: !!ctaRect && ctaRect.width >= 44 && ctaRect.height >= 44,
      ctaColor: ctaStyle?.color || '',
      ctaBackground: ctaStyle?.backgroundColor || '',
      artworkOverlapsCopy: overlap,
      artworkDoesNotCoverText: !overlap || window.innerWidth < 760,
      rootScrollWidth: root?.scrollWidth || 0,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 2,
    };
  }, templateName);
}

async function screenshot(page: Page, name: string) {
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const result: any = { baseUrl, version: null, forbiddenCounts: {}, templates: [], mobile390: null, mobile320: null, backEditVisible: false, modalBackVisible: false, screenshots: [] };

  await page.goto(`${baseUrl}/__version`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  result.version = await page.locator('body').innerText();
  await screenshot(page, 'version.png');

  await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  await clickSection(page, '▦ 模板選擇');
  result.forbiddenCounts = await forbiddenCounts(page);

  for (const t of templates) {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await applyTemplate(page, t.name, t.industry);
    const desktop = await previewMetrics(page, t.name);
    const desktopShot = await screenshot(page, `live-${t.name}-desktop.png`);

    await page.setViewportSize({ width: 390, height: 900 });
    await page.waitForTimeout(300);
    const previewButton = page.getByRole('button', { name: '預覽' }).first();
    if (await previewButton.count()) await previewButton.click({ force: true });
    await page.waitForTimeout(450);
    const mobile = await previewMetrics(page, t.name);
    const mobileShot = await screenshot(page, `live-${t.name}-mobile.png`);

    result.screenshots.push(desktopShot, mobileShot);
    result.templates.push({ name: t.name, desktop, mobile });
  }

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(700);
  result.mobile390 = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 2 }));
  const previewTab = page.getByRole('button', { name: '預覽' }).first();
  if (await previewTab.count()) await previewTab.click({ force: true });
  await page.waitForTimeout(300);
  const backBtn = page.getByRole('button', { name: /返回編輯/ }).first();
  result.backEditVisible = await backBtn.isVisible().catch(() => false);
  result.backEditTapTarget = result.backEditVisible ? await backBtn.boundingBox() : null;

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(700);
  await clickSection(page, '▦ 模板選擇');
  const quick = page.getByRole('button', { name: /快速預覽/ }).first();
  if (await quick.count()) await quick.click({ force: true });
  await page.waitForTimeout(500);
  const modalBack = page.getByRole('button', { name: /返回模板庫/ }).first();
  result.modalBackVisible = await modalBack.isVisible().catch(() => false);
  result.modalBackTapTarget = result.modalBackVisible ? await modalBack.boundingBox() : null;

  await page.setViewportSize({ width: 320, height: 820 });
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(700);
  result.mobile320 = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 2 }));

  result.ok = Object.values(result.forbiddenCounts).every((v: any) => Number(v) === 0)
    && result.templates.every((t: any) => t.desktop.h1Visible && t.desktop.h1Opacity >= 0.9 && t.desktop.h1LessOrEqual4Lines && t.desktop.notOneOrTwoCharsPerLine && t.desktop.subtitleReadable && t.desktop.ctaVisible && t.desktop.artworkDoesNotCoverText && t.desktop.noHorizontalOverflow && t.mobile.h1Visible && t.mobile.h1Opacity >= 0.9 && t.mobile.h1LessOrEqual4Lines && t.mobile.notOneOrTwoCharsPerLine && t.mobile.subtitleReadable && t.mobile.ctaVisible && t.mobile.artworkDoesNotCoverText && t.mobile.noHorizontalOverflow)
    && result.mobile390.noHorizontalOverflow && result.mobile320.noHorizontalOverflow && result.backEditVisible && result.modalBackVisible
    && (!result.backEditTapTarget || (result.backEditTapTarget.height >= 44 && result.backEditTapTarget.width >= 44))
    && (!result.modalBackTapTarget || (result.modalBackTapTarget.height >= 44 && result.modalBackTapTarget.width >= 44));

  fs.writeFileSync(path.join(outDir, 'live-qa-result.json'), JSON.stringify(result, null, 2));
  await browser.close();
  if (!result.ok) throw new Error('v0.1.4 Live QA failed; see qa-artifacts/v0.1.4/live-qa-result.json');
  console.log(JSON.stringify({ ok: true, out: path.join(outDir, 'live-qa-result.json') }, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });
