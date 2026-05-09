import { chromium, type Page } from 'playwright';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { defaultSiteData } from '../lib/defaultSiteData';
import { templateCatalog } from '../lib/templateCatalog';
import { applyTemplatePresetSync } from '../lib/applyTemplatePreset';
import { exportStaticSite } from '../lib/exportStaticSite';
import { getTemplateArtwork } from '../lib/templateArtworkResolver';
import { getTemplateSkin } from '../lib/templateSkin';

const baseUrl = process.env.PREVIEW_URL || process.argv[2] || 'http://127.0.0.1:3000';
const outDir = path.resolve('qa-artifacts/v0.1.6');
const exportDir = path.join(outDir, 'template-skin-export');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(path.join(outDir, 'modal'), { recursive: true });
fs.mkdirSync(path.join(exportDir, 'assets'), { recursive: true });

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
function norm(src: string | null | undefined) { if (!src) return ''; try { return new URL(src, baseUrl).pathname; } catch { return src.split('?')[0].split('#')[0]; } }
function sameSource(a: string, b: string) { return norm(a) === norm(b) || path.basename(norm(a)) === path.basename(norm(b)); }
async function clickSection(page: Page, label: string) { if (label.includes('模板')) { await page.getByRole('button', { name: /模板選擇/ }).first().click({ force: true }); await page.waitForTimeout(500); return; } const plain = label.replace(/^[^\p{L}\p{N}]+/u, '').trim(); const button = page.getByRole('button', { name: new RegExp(plain) }).first(); if (await button.count()) await button.click({ force: true }); await page.waitForTimeout(300); }
async function setIndustry(page: Page, label: string) { const tab = page.getByRole('tab', { name: new RegExp(label) }).first(); if (await tab.count()) await tab.click({ force: true }); await page.waitForTimeout(250); }
async function applyTemplate(page: Page, name: string, industry: string) {
  await clickSection(page, '▦ 模板選擇');
  await setIndustry(page, industry);
  const heading = page.getByRole('heading', { name }).first();
  await heading.scrollIntoViewIfNeeded();
  const card = page.locator('article').filter({ has: heading }).first();
  const apply = card.getByRole('button', { name: /套用|已套用|目前使用中/ }).last();
  await apply.click({ force: true });
  await page.waitForTimeout(800);
  return card;
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

async function previewMetrics(page: Page): Promise<any> {
  return await page.evaluate(`(() => {
    const root = document.querySelector('[data-full-skin="true"]');
    const hero = root && root.querySelector('.template-hero[data-artwork-source="true"]');
    const heroImg = hero && hero.querySelector('.template-hero-backplate');
    const section = root && root.querySelector('.skin-section');
    const product = root && root.querySelector('.skin-product-card[data-product-card-skin="true"]');
    const menu = root && root.querySelector('.skin-menu-list[data-menu-list-skin="true"]');
    const placeholder = root && root.querySelector('.themed-placeholder');
    const footer = root && root.querySelector('.skin-footer[data-footer-skin="true"]');
    const modalSection = document.querySelector('[data-modal-section-renderer="true"]');
    const text = (root && root.textContent) || '';
    const productStyle = product ? getComputedStyle(product) : null;
    const menuStyle = menu ? getComputedStyle(menu) : null;
    const sectionStyle = section ? getComputedStyle(section) : null;
    const footerStyle = footer ? getComputedStyle(footer) : null;
    return {
      skinId: root ? (root.getAttribute('data-skin-id') || '') : '',
      heroUsesArtwork: !!heroImg && !!heroImg.getAttribute('data-artwork-src'),
      heroArtworkDataSrc: heroImg ? (heroImg.getAttribute('data-artwork-src') || '') : '',
      productCardSkinned: !!product && productStyle && (productStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' || productStyle.backgroundImage !== 'none') && !!productStyle.borderTopWidth && productStyle.borderTopWidth !== '0px',
      productCardBackground: productStyle ? (productStyle.background || productStyle.backgroundColor || '') : '',
      menuListSkinned: !!menu && menuStyle && menuStyle.backgroundColor !== 'rgba(0, 0, 0, 0)',
      menuBackground: menuStyle ? (menuStyle.background || menuStyle.backgroundColor || '') : '',
      sectionSkinned: !!section && sectionStyle && sectionStyle.backgroundColor !== 'rgba(0, 0, 0, 0)',
      sectionBackground: sectionStyle ? (sectionStyle.background || sectionStyle.backgroundColor || '') : '',
      placeholderThemed: !!placeholder && placeholder.getAttribute('data-store-site-text') === 'false' && !text.includes('StoreSite Builder'),
      placeholderMode: placeholder ? (placeholder.getAttribute('data-placeholder-mode') || '') : '',
      footerSkinned: !!footer && footerStyle && footerStyle.backgroundColor !== 'rgba(0, 0, 0, 0)',
      footerBackground: footerStyle ? (footerStyle.background || footerStyle.backgroundColor || '') : '',
      modalHasSectionPreview: !!modalSection,
      noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 2,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    };
  })()`);
}

async function exportMetrics(page: Page): Promise<any> {
  return await page.evaluate(`(() => {
    const root = document.querySelector('[data-full-skin="true"]');
    const heroImg = root && root.querySelector('.template-hero-backplate');
    const product = root && root.querySelector('.skin-product-card[data-product-card-skin="true"]');
    const menu = root && root.querySelector('.skin-menu-list[data-menu-list-skin="true"]');
    const placeholder = root && root.querySelector('.themed-placeholder');
    const section = root && root.querySelector('.skin-section');
    const footer = root && root.querySelector('.skin-footer[data-footer-skin="true"]');
    const productStyle = product ? getComputedStyle(product) : null;
    const menuStyle = menu ? getComputedStyle(menu) : null;
    const sectionStyle = section ? getComputedStyle(section) : null;
    const footerStyle = footer ? getComputedStyle(footer) : null;
    const text = (root && root.textContent) || '';
    return {
      skinId: root ? (root.getAttribute('data-skin-id') || '') : '',
      heroUsesArtwork: !!heroImg && !!heroImg.getAttribute('data-artwork-src'),
      heroArtworkDataSrc: heroImg ? (heroImg.getAttribute('data-artwork-src') || '') : '',
      productCardSkinned: !!product && productStyle && productStyle.borderTopWidth !== '0px',
      menuListSkinned: !!menu && menuStyle && menuStyle.backgroundColor !== 'rgba(0, 0, 0, 0)',
      sectionSkinned: !!section && sectionStyle && sectionStyle.backgroundColor !== 'rgba(0, 0, 0, 0)',
      placeholderThemed: !!placeholder && placeholder.getAttribute('data-store-site-text') === 'false' && !text.includes('StoreSite Builder'),
      footerSkinned: !!footer && footerStyle && footerStyle.backgroundColor !== 'rgba(0, 0, 0, 0)',
      noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 2,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    };
  })()`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1400 } });
  const result: any = { baseUrl, ok: false, templates: [] };

  for (const t of targets) {
    const template = templateCatalog.find(x => x.id === t.id)!;
    const skin = getTemplateSkin(template);
    const expectedArtwork = getTemplateArtwork(template);
    await page.setViewportSize({ width: 1440, height: 1400 });
    await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(700);
    const card = await applyTemplate(page, t.name, t.industry);
    const previewMetricsDesktop = await previewMetrics(page);
    const previewShot = path.join(outDir, `skin-${safeName(t.name)}-preview-full-page.png`);
    await page.locator('.store-template').last().screenshot({ path: previewShot, animations: 'disabled' });

    const quick = page.getByRole('button', { name: /^快速預覽$/ }).first();
    let modalShot = '';
    let modalMetrics: any = { modalHasSectionPreview: false };
    if (await quick.count()) {
      await quick.click({ force: true });
      await page.waitForTimeout(700);
      modalShot = path.join(outDir, 'modal', `skin-${safeName(t.name)}-quick-preview-modal.png`);
      await page.locator('[role="dialog"]').first().screenshot({ path: modalShot, animations: 'disabled' });
      modalMetrics = await previewMetrics(page);
      await page.keyboard.press('Escape').catch(() => {});
      const close = page.getByRole('button', { name: /關閉|返回模板庫/ }).first();
      if (await close.count()) await close.click({ force: true }).catch(() => {});
      await page.waitForTimeout(300);
    }

    await page.setViewportSize({ width: 390, height: 1000 });
    await page.waitForTimeout(500);
    const mobileMetrics = await previewMetrics(page);

    const exp = createExport(t.id);
    const exportPage = await browser.newPage({ viewport: { width: 1440, height: 1400 } });
    await exportPage.goto(pathToFileURL(exp.indexPath).href, { waitUntil: 'domcontentloaded' });
    await exportPage.waitForTimeout(300);
    const exportMetricsDesktop = await exportMetrics(exportPage);
    const exportShot = path.join(outDir, `skin-${safeName(t.name)}-export-index-full-page.png`);
    await exportPage.screenshot({ path: exportShot, fullPage: true, animations: 'disabled' });
    await exportPage.setViewportSize({ width: 390, height: 1000 });
    await exportPage.reload({ waitUntil: 'domcontentloaded' });
    const exportMetricsMobile = await exportMetrics(exportPage);
    await exportPage.close();

    const indexHtml = fs.readFileSync(exp.indexPath, 'utf8');
    const heroConsistent = previewMetricsDesktop.heroUsesArtwork && sameSource(previewMetricsDesktop.heroArtworkDataSrc, expectedArtwork.gallerySrc);
    const productCardsSkinned = previewMetricsDesktop.productCardSkinned;
    const menuListSkinned = previewMetricsDesktop.menuListSkinned;
    const placeholderThemed = previewMetricsDesktop.placeholderThemed;
    const sectionSkinned = previewMetricsDesktop.sectionSkinned;
    const footerSkinned = previewMetricsDesktop.footerSkinned;
    const exportConsistent = exportMetricsDesktop.heroUsesArtwork && sameSource(exportMetricsDesktop.heroArtworkDataSrc, expectedArtwork.gallerySrc) && exportMetricsDesktop.productCardSkinned && exportMetricsDesktop.menuListSkinned && exportMetricsDesktop.placeholderThemed && exportMetricsDesktop.sectionSkinned && exportMetricsDesktop.footerSkinned && indexHtml.includes('data-full-skin="true"') && indexHtml.includes('skin-product-card') && indexHtml.includes('themed-placeholder') && indexHtml.includes(expectedArtwork.exportAssetPath);
    const mobileNoOverflow = mobileMetrics.noHorizontalOverflow && exportMetricsMobile.noHorizontalOverflow;
    const quickPreviewThreePanel = !!modalShot && modalMetrics.modalHasSectionPreview;
    const ok = heroConsistent && productCardsSkinned && menuListSkinned && placeholderThemed && sectionSkinned && footerSkinned && exportConsistent && mobileNoOverflow && quickPreviewThreePanel;
    result.templates.push({
      id: t.id,
      name: t.name,
      expectedSkinId: skin.id,
      heroConsistent,
      productCardsSkinned,
      menuListSkinned,
      placeholderThemed,
      sectionSkinned,
      footerSkinned,
      exportConsistent,
      mobileNoOverflow,
      quickPreviewThreePanel,
      ok,
      previewMetricsDesktop,
      mobileMetrics,
      exportMetricsDesktop,
      exportMetricsMobile,
      screenshots: { previewFullPage: previewShot, exportIndexFullPage: exportShot, quickPreviewModal: modalShot },
    });
  }

  result.ok = result.templates.every((t: any) => t.ok);
  const out = path.join(outDir, 'template-skin-result.json');
  fs.writeFileSync(out, JSON.stringify(result, null, 2));
  await browser.close();
  if (!result.ok) throw new Error(`Template skin QA failed; see ${out}`);
  console.log(JSON.stringify({ ok: true, out }, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });
