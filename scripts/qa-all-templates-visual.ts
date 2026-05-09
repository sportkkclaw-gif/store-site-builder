import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { templateCatalog } from '../lib/templateCatalog';
import { defaultSiteData } from '../lib/defaultSiteData';
import { applyTemplatePresetSync } from '../lib/applyTemplatePreset';
import { exportStaticSite } from '../lib/exportStaticSite';
import { getTemplateSkin } from '../lib/templateSkinEngine';
import { getTemplateVisualContract, assertTemplateVisualContractComplete } from '../lib/templateVisualContracts';

const baseUrl = process.argv[2] || 'http://127.0.0.1:3201';
const root = process.cwd();
const artifactRoot = path.join(root, 'qa-artifacts/v0.2.1');
const shotRoot = path.join(artifactRoot, 'visual-30');
const exportRoot = path.join(artifactRoot, 'exports');
const resultPath = path.join(artifactRoot, 'all-templates-visual-result.json');
const forbidden = ['StoreSite Builder placeholder', 'AI-designed', 'AI-generated', 'website template key visual', 'concept image', 'prompt', 'localhost', '127.0.0.1', '/_next'];

function stem(index: number, templateId: string) {
  return `${String(index + 1).padStart(2, '0')}-${templateId}`;
}

async function shot(locator: any, file: string) {
  await locator.scrollIntoViewIfNeeded().catch(() => undefined);
  await locator.screenshot({ path: file, timeout: 15000 });
}

async function inspect(page: any, expectedTemplateId: string, expectedSkinFamily: string, expectedContractId: string) {
  const expression = `(() => {
    const expectedTemplateId = ${JSON.stringify(expectedTemplateId)};
    const expectedSkinFamily = ${JSON.stringify(expectedSkinFamily)};
    const expectedContractId = ${JSON.stringify(expectedContractId)};
    const pick = (sel) => document.querySelector(sel);
    const root = pick('.export-site, .store-template');
    const product = pick('[data-skin-component="product-card"]');
    const menu = pick('[data-skin-component="menu-list"]');
    const placeholder = pick('[data-skin-component="placeholder"]');
    const footer = pick('[data-skin-component="footer"]');
    const hero = pick('.template-hero-backplate, [data-artwork-source="true"]');
    const bg = (el) => el ? String(getComputedStyle(el).backgroundImage || '') + String(getComputedStyle(el).backgroundColor || '') : '';
    const pureWhite = (v) => v.trim().toLowerCase() === 'rgb(255, 255, 255)' || v.trim().toLowerCase() === 'white';
    const overflow = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth;
    return {
      templateId: root?.dataset.templateId || '',
      skinFamily: root?.dataset.skinFamily || '',
      visualContractId: root?.dataset.visualContractId || '',
      expectedIds: root?.dataset.templateId === expectedTemplateId && root?.dataset.skinFamily === expectedSkinFamily && root?.dataset.visualContractId === expectedContractId,
      heroArtwork: !!hero,
      productCardSkin: !!product && product.dataset.skinComponent === 'product-card' && !pureWhite(bg(product)),
      menuListSkin: !!menu && menu.dataset.skinComponent === 'menu-list' && !pureWhite(bg(menu)),
      placeholderThemed: !!placeholder && placeholder.dataset.storeSiteText === 'false' && !(placeholder.textContent || '').includes('StoreSite Builder'),
      footerSkin: !!footer && footer.dataset.skinComponent === 'footer',
      productBackground: bg(product),
      overflow,
    };
  })()`;
  return await page.evaluate(expression);
}

async function main() {
  await fs.rm(artifactRoot, { recursive: true, force: true });
  await fs.mkdir(shotRoot, { recursive: true });
  await fs.mkdir(exportRoot, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
  const liveStatus = await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded', timeout: 60000 }).then(r => r?.status() || 0).catch(() => 0);

  const results: any[] = [];
  const backgroundSet = new Set<string>();
  const forbiddenCounts: Record<string, number> = Object.fromEntries(forbidden.map(s => [s, 0]));

  for (let i = 0; i < templateCatalog.length; i++) {
    const template = templateCatalog[i];
    const s = stem(i, template.id);
    const checks: Record<string, boolean> = {};
    const errors: string[] = [];
    try {
      const contract = getTemplateVisualContract(template.id);
      assertTemplateVisualContractComplete(contract);
      const data = applyTemplatePresetSync(defaultSiteData, template);
      const skin = getTemplateSkin(data);
      checks.visualContract = contract.templateId === template.id;
      checks.skinFamily = skin.family === template.skinFamily;
      checks.livePreview = liveStatus === 200;

      const html = exportStaticSite(data);
      const exportDir = path.join(exportRoot, template.id);
      await fs.mkdir(exportDir, { recursive: true });
      await fs.writeFile(path.join(exportDir, 'index.html'), html, 'utf8');
      for (const f of forbidden) forbiddenCounts[f] += (html.match(new RegExp(f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;

      await page.setViewportSize({ width: 1440, height: 1100 });
      await page.setContent(`<main style="font-family:system-ui;padding:24px;background:#f8fafc"><article style="width:520px;overflow:hidden;border-radius:30px;border:1px solid #dbe3ee;background:white"><img src="${template.artworkSrc}" style="width:100%;height:620px;object-fit:cover;object-position:top"><section style="padding:24px"><h1>${template.name}</h1><p>${template.shortDescription}</p><b>${contract.visualIdentity.mood}</b></section></article></main>`, { waitUntil: 'domcontentloaded' });
      await shot(page.locator('article').first(), path.join(shotRoot, `${s}-gallery.png`));

      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      const dom = await inspect(page, template.id, skin.family, contract.templateId);
      checks.heroArtwork = !!dom.heroArtwork;
      checks.productCardSkin = !!dom.productCardSkin;
      checks.menuListSkin = !!dom.menuListSkin;
      checks.placeholderThemed = !!dom.placeholderThemed;
      checks.footerSkin = !!dom.footerSkin;
      checks.exportMatched = html.includes(`data-skin-family="${skin.family}"`) && html.includes(`data-visual-contract-id="${contract.templateId}"`) && html.includes('data-skin-component="product-card"') && html.includes('data-skin-component="menu-list"') && html.includes(contract.sourceArtwork.exportHeroSrc) && dom.expectedIds;
      backgroundSet.add(dom.productBackground || template.id);

      await shot(page.locator('.template-hero').first(), path.join(shotRoot, `${s}-preview-hero.png`));
      await shot(page.locator('.product-grid, [data-skin-component="product-card"]').first(), path.join(shotRoot, `${s}-preview-products.png`));
      await shot(page.locator('[data-skin-component="menu-list"]').first(), path.join(shotRoot, `${s}-preview-menu.png`));
      await shot(page.locator('.export-site, main').first(), path.join(shotRoot, `${s}-export.png`));

      await page.setViewportSize({ width: 390, height: 950 });
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      checks.mobile390 = await page.evaluate('Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) <= window.innerWidth + 2');
      await page.setViewportSize({ width: 320, height: 950 });
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      checks.mobile320 = await page.evaluate('Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) <= window.innerWidth + 4');
      checks.forbiddenStrings = Object.values(forbiddenCounts).every(v => v === 0);
    } catch (error: any) {
      errors.push(error?.message || String(error));
    }
    const passed = Object.values(checks).length >= 12 && Object.values(checks).every(Boolean) && errors.length === 0;
    results.push({ templateName: template.name, templateId: template.id, passed, checks, errors });
  }

  await browser.close();
  const screenshotCount = (await fs.readdir(shotRoot)).filter(f => f.endsWith('.png')).length;
  const passedTemplates = results.filter(r => r.passed).length;
  const output = {
    ok: liveStatus === 200 && templateCatalog.length === 30 && passedTemplates === 30 && screenshotCount >= 150 && backgroundSet.size >= 20 && Object.values(forbiddenCounts).every(v => v === 0),
    liveStatus,
    totalTemplates: templateCatalog.length,
    passedTemplates,
    failedTemplates: templateCatalog.length - passedTemplates,
    screenshotCount,
    uniqueProductBackgrounds: backgroundSet.size,
    forbiddenCounts,
    results,
  };
  await fs.writeFile(resultPath, JSON.stringify(output, null, 2), 'utf8');
  console.log(JSON.stringify(output, null, 2));
  if (!output.ok) process.exit(1);
}

main().catch(error => { console.error(error); process.exit(1); });
