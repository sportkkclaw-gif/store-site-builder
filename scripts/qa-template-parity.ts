import { chromium, type Page } from 'playwright';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { defaultSiteData } from '../lib/defaultSiteData';
import { templateCatalog } from '../lib/templateCatalog';
import { applyTemplatePresetSync } from '../lib/applyTemplatePreset';
import { exportStaticSite } from '../lib/exportStaticSite';
import { getTemplateArtwork } from '../lib/templateArtworkResolver';

const baseUrl = process.env.PREVIEW_URL || process.argv[2] || 'http://127.0.0.1:3000';
const outDir = path.resolve('qa-artifacts/v0.1.5');
const exportDir = path.join(outDir, 'template-parity-export');
fs.mkdirSync(outDir, { recursive: true });
fs.rmSync(exportDir, { recursive: true, force: true });
fs.mkdirSync(path.join(exportDir, 'assets'), { recursive: true });

const forbidden = ['AI-designed', 'AI-generated', 'website template key visual', 'concept image', 'showcase image', 'prompt'];
const targets = [
  { id: 'drink-matcha-hiyori', name: '抹茶日和', industry: '飲料店' },
  { id: 'drink-boba-neon', name: '珍珠霓光', industry: '飲料店' },
  { id: 'drink-fruit-paradise', name: '果香樂園', industry: '飲料店' },
  { id: 'drink-brown-sugar-amber', name: '黑糖琥珀', industry: '飲料店' },
  { id: 'drink-white-peach-sparkle', name: '白桃氣泡', industry: '飲料店' },
  { id: 'drink-tea-mist-ridge', name: '茶霧山嵐', industry: '飲料店' },
  { id: 'restaurant-golden-banquet', name: '金色晚宴', industry: '餐飲店' },
  { id: 'cafe-white-dripper', name: '白瓷濾杯', industry: '咖啡廳' },
  { id: 'cafe-urban-monochrome', name: '城市黑白', industry: '咖啡廳' },
];

function safeName(name: string) { return name.replace(/[\\/:*?"<>|\s]+/g, '-'); }
function norm(src: string | null | undefined) {
  if (!src) return '';
  try { return new URL(src, baseUrl).pathname; } catch { return src.split('?')[0].split('#')[0]; }
}
function sameSource(a: string, b: string) { return norm(a) === norm(b) || path.basename(norm(a)) === path.basename(norm(b)); }
async function shot(locator: any, file: string) { await locator.screenshot({ path: file }); return file; }

async function clickSection(page: Page, label: string) {
  const button = page.getByRole('button', { name: label }).first();
  if (await button.count()) await button.click({ force: true });
}
async function setIndustry(page: Page, label: string) {
  await page.getByRole('tab', { name: new RegExp(label) }).click({ force: true });
  await page.waitForTimeout(250);
}
async function applyTemplate(page: Page, name: string, industry: string) {
  await setIndustry(page, industry);
  const heading = page.getByRole('heading', { name }).first();
  await heading.scrollIntoViewIfNeeded();
  const card = page.locator('article').filter({ has: heading }).first();
  const apply = card.getByRole('button', { name: /套用|已套用|目前使用中/ }).last();
  await apply.click({ force: true });
  await page.waitForTimeout(900);
  return card;
}
async function galleryArtworkSrc(card: any) {
  const img = card.locator('img').first();
  return await img.getAttribute('src') || '';
}
async function heroMetrics(page: Page) {
  return await page.evaluate(() => {
    const heroes = [...document.querySelectorAll('.store-template .hero-grid[data-artwork-source="true"]')] as HTMLElement[];
    const hero = heroes.map(h => ({ h, r: h.getBoundingClientRect(), img: h.querySelector('.template-hero-backplate') as HTMLImageElement | null })).filter(x => x.r.width > 80 && x.r.height > 80).sort((a,b) => (b.img ? 1 : 0) - (a.img ? 1 : 0) || (b.r.width*b.r.height) - (a.r.width*a.r.height))[0]?.h || null;
    const img = hero?.querySelector('.template-hero-backplate') as HTMLImageElement | null;
    const h1 = hero?.querySelector('h1') as HTMLElement | null;
    const cta = hero?.querySelector('a') as HTMLElement | null;
    const sectionAfter = hero?.parentElement?.querySelector('section:not(.hero-grid)') as HTMLElement | null;
    const heroRect = hero?.getBoundingClientRect();
    const imgRect = img?.getBoundingClientRect();
    const h1Rect = h1?.getBoundingClientRect();
    const ctaRect = cta?.getBoundingClientRect();
    const h1Style = h1 ? getComputedStyle(h1) : null;
    const ctaStyle = cta ? getComputedStyle(cta) : null;
    const ctaText = cta?.textContent?.trim() || '';
    const areaRatio = heroRect && imgRect ? (Math.max(0, Math.min(heroRect.right, imgRect.right) - Math.max(heroRect.left, imgRect.left)) * Math.max(0, Math.min(heroRect.bottom, imgRect.bottom) - Math.max(heroRect.top, imgRect.top))) / (heroRect.width * heroRect.height) : 0;
    return {
      heroExists: !!hero,
      heroClass: hero?.className || '',
      heroArtworkSrc: img?.getAttribute('src') || '',
      heroArtworkDataSrc: img?.getAttribute('data-artwork-src') || '',
      heroArtworkCurrentSrc: img?.currentSrc || '',
      hasArtworkImage: !!img,
      artworkAreaRatio: areaRatio,
      notJustPalette: !!img && areaRatio >= 0.4,
      h1Visible: !!h1Rect && h1Rect.width > 40 && h1Rect.height > 12,
      h1Color: h1Style?.color || '',
      ctaVisible: !!ctaRect && ctaRect.width > 24 && ctaRect.height > 16 && !!ctaText && ctaStyle?.visibility !== 'hidden' && ctaStyle?.display !== 'none',
      noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 2,
      canSeeSections: !!sectionAfter,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    };
  });
}
async function forbiddenCounts(page: Page) {
  return await page.evaluate((terms) => {
    const text = document.body.innerText;
    return Object.fromEntries(terms.map((term) => [term, (text.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length]));
  }, forbidden);
}

function createExport(templateId: string) {
  const template = templateCatalog.find(t => t.id === templateId)!;
  const data = applyTemplatePresetSync(defaultSiteData, template);
  const artwork = getTemplateArtwork(template);
  const dir = path.join(exportDir, templateId);
  fs.mkdirSync(path.join(dir, 'assets'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), exportStaticSite(data));
  const publicFile = path.resolve('public', artwork.exportSrc.replace(/^\//, ''));
  fs.copyFileSync(publicFile, path.join(dir, artwork.exportAssetPath));
  return { dir, indexPath: path.join(dir, 'index.html'), artwork };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const result: any = { baseUrl, templates: [], forbiddenCounts: {}, ok: false };

  await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  await clickSection(page, '▦ 模板選擇');
  result.forbiddenCounts = await forbiddenCounts(page);

  for (const t of targets) {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(600);
    await clickSection(page, '▦ 模板選擇');
    const card = await applyTemplate(page, t.name, t.industry);
    const gallerySrc = await galleryArtworkSrc(card);
    const galleryShot = await shot(card.locator('img').first(), path.join(outDir, `parity-${safeName(t.name)}-gallery.png`));
    const desktopMetrics = await heroMetrics(page);
    const previewHero = page.locator('.store-template .hero-grid[data-artwork-source="true"]').last();
    const previewShot = await shot(previewHero, path.join(outDir, `parity-${safeName(t.name)}-preview-hero.png`));

    await page.setViewportSize({ width: 390, height: 900 });
    const previewButton = page.getByRole('button', { name: '預覽' }).first();
    if (await previewButton.count()) await previewButton.click({ force: true });
    await page.waitForTimeout(500);
    const mobileMetrics = await heroMetrics(page);
    const mobileShot = await shot(page.locator('.store-template .hero-grid[data-artwork-source="true"]').last(), path.join(outDir, `parity-${safeName(t.name)}-mobile-hero.png`));

    const exp = createExport(t.id);
    const exportPage = await browser.newPage({ viewport: { width: 390, height: 900 } });
    await exportPage.goto(pathToFileURL(exp.indexPath).href, { waitUntil: 'domcontentloaded' });
    await exportPage.waitForTimeout(500);
    const exportMetrics = await exportPage.evaluate(() => {
      const hero = document.querySelector('.hero') as HTMLElement | null;
      const img = document.querySelector('.hero .template-hero-backplate') as HTMLImageElement | null;
      const rect = hero?.getBoundingClientRect();
      const imgRect = img?.getBoundingClientRect();
      const areaRatio = rect && imgRect ? (Math.max(0, Math.min(rect.right, imgRect.right) - Math.max(rect.left, imgRect.left)) * Math.max(0, Math.min(rect.bottom, imgRect.bottom) - Math.max(rect.top, imgRect.top))) / (rect.width * rect.height) : 0;
      return {
        heroArtworkSrc: img?.getAttribute('src') || '',
        heroArtworkDataSrc: img?.getAttribute('data-artwork-src') || '',
        hasArtworkImage: !!img,
        artworkAreaRatio: areaRatio,
        notJustPalette: !!img && areaRatio >= 0.4,
        noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 2,
      };
    });
    const exportShot = await shot(exportPage.locator('.hero').first(), path.join(outDir, `parity-${safeName(t.name)}-export-index.png`));
    const indexHtml = fs.readFileSync(exp.indexPath, 'utf8');
    await exportPage.close();

    const expected = getTemplateArtwork(t.id);
    const item = {
      id: t.id,
      name: t.name,
      galleryArtworkSrc: norm(gallerySrc),
      expectedGallerySrc: expected.gallerySrc,
      previewHeroArtworkSrc: norm(desktopMetrics.heroArtworkDataSrc || desktopMetrics.heroArtworkSrc),
      exportArtworkSrc: exportMetrics.heroArtworkSrc,
      exportExpectedAsset: expected.exportAssetPath,
      sameGalleryPreview: sameSource(gallerySrc, desktopMetrics.heroArtworkDataSrc || desktopMetrics.heroArtworkSrc),
      sameGalleryExport: sameSource(gallerySrc, exportMetrics.heroArtworkDataSrc || exportMetrics.heroArtworkSrc),
      sameSourceAll: sameSource(gallerySrc, desktopMetrics.heroArtworkDataSrc || desktopMetrics.heroArtworkSrc) && sameSource(gallerySrc, exportMetrics.heroArtworkDataSrc || exportMetrics.heroArtworkSrc),
      previewArtworkAreaRatio: desktopMetrics.artworkAreaRatio,
      exportArtworkAreaRatio: exportMetrics.artworkAreaRatio,
      artworkAreaAtLeast40: desktopMetrics.artworkAreaRatio >= 0.4 && exportMetrics.artworkAreaRatio >= 0.4,
      notJustPalette: desktopMetrics.notJustPalette && exportMetrics.notJustPalette,
      mobileReadable: mobileMetrics.hasArtworkImage && mobileMetrics.artworkAreaRatio >= 0.4 && mobileMetrics.h1Visible && mobileMetrics.ctaVisible && mobileMetrics.noHorizontalOverflow && mobileMetrics.canSeeSections,
      exportPassed: exportMetrics.hasArtworkImage && exportMetrics.artworkAreaRatio >= 0.4 && exportMetrics.noHorizontalOverflow && indexHtml.includes(expected.exportAssetPath) && fs.existsSync(path.join(exp.dir, expected.exportAssetPath)),
      desktopMetrics,
      mobileMetrics,
      exportMetrics,
      screenshots: { gallery: galleryShot, previewHero: previewShot, mobileHero: mobileShot, exportIndex: exportShot },
    };
    result.templates.push(item);
  }

  result.ok = Object.values(result.forbiddenCounts).every((v: any) => Number(v) === 0)
    && result.templates.every((t: any) => t.sameSourceAll && t.artworkAreaAtLeast40 && t.notJustPalette && t.mobileReadable && t.exportPassed);
  const out = path.join(outDir, 'template-parity-result.json');
  fs.writeFileSync(out, JSON.stringify(result, null, 2));
  await browser.close();
  if (!result.ok) throw new Error(`Template parity QA failed; see ${out}`);
  console.log(JSON.stringify({ ok: true, out }, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });
