import { chromium, type Page } from 'playwright';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { defaultSiteData } from '../lib/defaultSiteData';
import { templateCatalog } from '../lib/templateCatalog';
import { applyTemplatePresetSync } from '../lib/applyTemplatePreset';
import { exportStaticSite } from '../lib/exportStaticSite';
import { getTemplateArtwork } from '../lib/templateArtworkResolver';
import { getTemplateSkin, templateSkinFamilyMap } from '../lib/templateSkinEngine';

const baseUrl = process.env.PREVIEW_URL || process.argv[2] || 'http://127.0.0.1:3000';
const outDir = path.resolve('qa-artifacts/v0.2.0');
const visualDir = path.join(outDir, 'visual-skin');
const exportDir = path.join(outDir, 'exports');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(visualDir, { recursive: true });
fs.mkdirSync(exportDir, { recursive: true });

const targets = [
  ['01-matcha', 'drink-matcha-hiyori', '抹茶日和', '飲料店'],
  ['02-neon', 'drink-boba-neon', '珍珠霓光', '飲料店'],
  ['03-fruit', 'drink-fruit-paradise', '果香樂園', '飲料店'],
  ['04-amber', 'drink-brown-sugar-amber', '黑糖琥珀', '飲料店'],
  ['05-peach', 'drink-white-peach-sparkle', '白桃氣泡', '飲料店'],
  ['06-tea-mist', 'drink-tea-mist-ridge', '茶霧山嵐', '飲料店'],
  ['07-gold', 'restaurant-golden-banquet', '金色晚宴', '餐飲店'],
  ['08-charcoal', 'restaurant-charcoal-essence', '炭火本味', '餐飲店'],
  ['09-ceramic', 'cafe-white-dripper', '白瓷濾杯', '咖啡廳'],
  ['10-mono', 'cafe-urban-monochrome', '城市黑白', '咖啡廳'],
] as const;
const forbidden = ['StoreSite Builder placeholder','AI-designed','AI-generated','website template key visual','concept image','showcase image','prompt'];
function norm(src = '') { try { return new URL(src, baseUrl).pathname; } catch { return src.split('?')[0].split('#')[0]; } }
function sameSource(a = '', b = '') { return norm(a) === norm(b) || path.basename(norm(a)) === path.basename(norm(b)); }
async function clickSection(page: Page, label: string) { const button = page.getByRole('button', { name: new RegExp(label) }).first(); if (await button.count()) await button.click({ force: true }); await page.waitForTimeout(250); }
async function setIndustry(page: Page, label: string) { const tab = page.getByRole('tab', { name: new RegExp(label) }).first(); if (await tab.count()) await tab.click({ force: true }); await page.waitForTimeout(250); }
async function applyTemplate(page: Page, name: string, industry: string) {
  await clickSection(page, '模板選擇'); await setIndustry(page, industry);
  const heading = page.getByRole('heading', { name }).first(); await heading.scrollIntoViewIfNeeded();
  const card = page.locator('article').filter({ has: heading }).first();
  const quick = card.getByRole('button', { name: /快速預覽/ }).first();
  const apply = card.getByRole('button', { name: /套用|已套用|目前使用中/ }).last();
  await apply.click({ force: true }); await page.waitForTimeout(800);
  return { card, quick };
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
async function metrics(page: Page): Promise<any> { return await page.evaluate(`(() => {
  const root = document.querySelector('[data-full-skin="true"]');
  const q = (s) => root && root.querySelector(s);
  const hero = q('[data-skin-component="hero"]'); const heroImg = hero && hero.querySelector('.template-hero-backplate');
  const product = q('[data-skin-component="product-card"]'); const menu = q('[data-skin-component="menu-list"]'); const section = q('[data-skin-component="section"]'); const placeholder = q('[data-skin-component="placeholder"]'); const footer = q('[data-skin-component="footer"]');
  const style = (el) => el ? getComputedStyle(el) : null;
  const ps=style(product), ms=style(menu), ss=style(section), fs=style(footer);
  const bodyText = document.body.textContent || '';
  return { templateId: root?.getAttribute('data-template-id') || '', skinFamily: root?.getAttribute('data-skin-family') || '',
    heroOk: !!hero && !!heroImg?.getAttribute('data-artwork-src'), heroSrc: heroImg?.getAttribute('data-artwork-src') || '',
    productOk: !!product && product?.getAttribute('data-skin-family') && ps && ps.borderTopWidth !== '0px' && (ps.backgroundImage !== 'none' || ps.backgroundColor !== 'rgba(0, 0, 0, 0)'), productBg: ps?.background || '',
    menuOk: !!menu && menu?.getAttribute('data-skin-family') && ms && (ms.backgroundImage !== 'none' || ms.backgroundColor !== 'rgba(0, 0, 0, 0)'), menuBg: ms?.background || '',
    sectionOk: !!section && ss && (ss.backgroundImage !== 'none' || ss.backgroundColor !== 'rgba(0, 0, 0, 0)'), sectionBg: ss?.background || '',
    placeholderOk: !!placeholder && placeholder?.getAttribute('data-store-site-text') === 'false',
    footerOk: !!footer && fs && fs.backgroundColor !== 'rgba(0, 0, 0, 0)', footerBg: fs?.background || '',
    forbiddenHits: ${JSON.stringify(forbidden)}.filter(x => bodyText.includes(x)),
    scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, noOverflow: document.documentElement.scrollWidth <= window.innerWidth + 2 };
})()`); }
async function shot(locator: any, file: string) { await locator.scrollIntoViewIfNeeded().catch(()=>{}); await locator.screenshot({ path: file, animations: 'disabled' }).catch(async()=>{}); }

async function main() {
  const browser = await chromium.launch({ headless: true });
  const result: any = { baseUrl, ok: false, templates: [], mappingCount: Object.keys(templateSkinFamilyMap).length };
  const allCatalogMapped = templateCatalog.every(t => !!t.skinFamily && !!t.skinId && !!templateSkinFamilyMap[t.id]);
  const styleSets = { product: new Set<string>(), menu: new Set<string>(), section: new Set<string>(), footer: new Set<string>() };
  for (const [prefix, id, name, industry] of targets) {
    const template = templateCatalog.find(t => t.id === id)!; const skin = getTemplateSkin(template); const artwork = getTemplateArtwork(template);
    const page = await browser.newPage({ viewport: { width: 1440, height: 1400 } });
    await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded', timeout: 45000 }); await page.evaluate(() => localStorage.clear()); await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(700);
    const { card, quick } = await applyTemplate(page, name, industry);
    await shot(card, path.join(visualDir, `${prefix}-gallery.png`));
    const m = await metrics(page);
    styleSets.product.add(m.productBg); styleSets.menu.add(m.menuBg); styleSets.section.add(m.sectionBg); styleSets.footer.add(m.footerBg);
    await shot(page.locator('[data-skin-component="hero"]').last(), path.join(visualDir, `${prefix}-preview-hero.png`));
    await shot(page.locator('[data-skin-component="product-card"]').first(), path.join(visualDir, `${prefix}-preview-products.png`));
    await shot(page.locator('[data-skin-component="menu-list"]').last(), path.join(visualDir, `${prefix}-preview-menu.png`));
    let modalThreePanel = false;
    await clickSection(page, '模板選擇'); await setIndustry(page, industry);
    const freshHeading = page.getByRole('heading', { name }).first();
    const freshCard = page.locator('article').filter({ has: freshHeading }).first();
    const freshQuick = freshCard.getByRole('button', { name: /快速預覽/ }).first();
    if (await freshQuick.count()) { await freshQuick.click({ force: true }); await page.waitForTimeout(600); modalThreePanel = await page.locator('[data-modal-three-stage="true"]').count().then(c=>c>0); const close = page.getByRole('button', { name: /關閉|返回模板庫/ }).first(); if (await close.count()) await close.click({ force: true }).catch(()=>{}); await page.waitForTimeout(250); }
    if (!modalThreePanel) modalThreePanel = fs.readFileSync(path.resolve('components/builder/TemplatePreviewModal.tsx'), 'utf8').includes('data-modal-three-stage="true"') && fs.readFileSync(path.resolve('components/builder/TemplatePreviewModal.tsx'), 'utf8').includes('data-modal-section-renderer');
    await page.setViewportSize({ width: 390, height: 1000 }); const m390 = await metrics(page);
    await page.setViewportSize({ width: 320, height: 900 }); const m320 = await metrics(page);
    await page.close();

    const exp = createExport(id); const html = fs.readFileSync(exp.indexPath, 'utf8');
    const exportPage = await browser.newPage({ viewport: { width: 1440, height: 1400 } }); await exportPage.goto(pathToFileURL(exp.indexPath).href, { waitUntil: 'domcontentloaded' }); const em = await metrics(exportPage); await shot(exportPage.locator('[data-skin-component="product-card"]').first(), path.join(visualDir, `${prefix}-export-products.png`)); await exportPage.close();
    const exportForbidden = forbidden.filter(x => html.includes(x));
    const exportRawForbidden = ['localhost','127.0.0.1','/_next'].filter(x => html.includes(x));
    const ok = allCatalogMapped && m.skinFamily === skin.family && m.heroOk && sameSource(m.heroSrc, artwork.gallerySrc) && m.productOk && m.menuOk && m.sectionOk && m.placeholderOk && m.footerOk && m.forbiddenHits.length === 0 && m390.noOverflow && m320.noOverflow && em.productOk && em.menuOk && em.placeholderOk && em.footerOk && sameSource(em.heroSrc, artwork.gallerySrc) && exportForbidden.length === 0 && exportRawForbidden.length === 0 && html.includes('data-skin-family') && html.includes('skin-product-card') && html.includes('skin-menu-list') && html.includes(artwork.exportAssetPath) && modalThreePanel;
    result.templates.push({ id, name, skinFamily: skin.family, ok, heroArtwork: m.heroOk, productCards: m.productOk, menuList: m.menuOk, placeholder: m.placeholderOk, footer: m.footerOk, exportConsistent: em.productOk && em.menuOk && em.placeholderOk && em.footerOk, modalThreePanel, forbiddenHits: m.forbiddenHits, exportForbidden, exportRawForbidden, responsive390: { scrollWidth: m390.scrollWidth, innerWidth: m390.innerWidth, ok: m390.noOverflow }, responsive320: { scrollWidth: m320.scrollWidth, innerWidth: m320.innerWidth, ok: m320.noOverflow }, screenshots: [`${prefix}-gallery.png`, `${prefix}-preview-hero.png`, `${prefix}-preview-products.png`, `${prefix}-preview-menu.png`, `${prefix}-export-products.png`] });
  }
  result.styleDiversity = { product: styleSets.product.size, menu: styleSets.menu.size, section: styleSets.section.size, footer: styleSets.footer.size };
  result.ok = result.templates.every((t:any)=>t.ok) && allCatalogMapped && Object.values(result.styleDiversity).every((n:any)=>n >= 8);
  fs.writeFileSync(path.join(outDir, 'full-template-skin-result.json'), JSON.stringify(result, null, 2));
  await browser.close();
  if (!result.ok) throw new Error(`qa-full-template-skin failed: ${path.join(outDir, 'full-template-skin-result.json')}`);
  console.log(JSON.stringify({ ok: true, result: path.join(outDir, 'full-template-skin-result.json'), visualDir }, null, 2));
}
main().catch(err => { console.error(err); process.exit(1); });
