import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const STORAGE_KEY = 'store-site-builder-data';
const baseUrl = (process.argv[2] || 'http://127.0.0.1:3203').replace(/\/$/, '');
const artifactRoot = path.join(process.cwd(), 'qa-artifacts', 'v0.2.3');
const screenshotDir = path.join(artifactRoot, 'fullscreen-preview-binding');
const resultPath = path.join(artifactRoot, 'fullscreen-preview-binding-result.json');

const cases = [
  { name: '白桃氣泡', id: 'drink-white-peach-sparkle', baseTemplate: 'fresh-japanese', industry: 'drink-shop', skinFamily: 'peach-pastel', artwork: '/template-gallery-ai/drink-shop/drink-white-peach-sparkle.png', builderShot: 'builder-white-peach-selected.png', previewShot: 'preview-white-peach-1440.png' },
  { name: '珍珠霓光', id: 'drink-boba-neon', baseTemplate: 'playful-colorful', industry: 'drink-shop', skinFamily: 'neon-dark', artwork: '/template-gallery-ai/drink-shop/drink-boba-neon.png', builderShot: 'builder-boba-neon-selected.png', previewShot: 'preview-boba-neon-1440.png' },
  { name: '日常一隅', id: 'cafe-daily-corner', baseTemplate: 'fresh-japanese', industry: 'cafe', skinFamily: 'urban-casual', artwork: '/template-gallery-ai/cafe/cafe-daily-corner.png', builderShot: 'builder-daily-corner-selected.png', previewShot: 'preview-daily-corner-1440.png' },
  { name: '城市黑白', id: 'cafe-urban-monochrome', baseTemplate: 'premium-minimal', industry: 'cafe', skinFamily: 'monochrome-editorial', artwork: '/template-gallery-ai/cafe/cafe-urban-monochrome.png', builderShot: '', previewShot: 'preview-urban-monochrome-1440.png' },
  { name: '金色晚宴', id: 'restaurant-golden-banquet', baseTemplate: 'premium-minimal', industry: 'restaurant', skinFamily: 'luxury-black-gold', artwork: '/template-gallery-ai/restaurant/restaurant-golden-banquet.png', builderShot: '', previewShot: 'preview-golden-banquet-1440.png' },
] as const;

type TestCase = typeof cases[number];
type Probe = { templateId: string; skinFamily: string; artworkSrc: string; text: string };

function makeData(item: TestCase) {
  const mediaId = `template-artwork-${item.id}`;
  return {
    id: `qa-${item.id}`,
    industry: item.industry,
    template: item.baseTemplate,
    galleryTemplateId: item.id,
    store: { name: `${item.name} 驗收店`, tagline: `${item.name} 綁定驗收`, description: `目前模板必須是 ${item.id}`, phone: '02-1234-5678', email: 'qa@example.com', address: '台北市 QA 路 1 號', businessHours: '每日 10:00 - 22:00' },
    theme: { primaryColor: '#0f766e', secondaryColor: '#f59e0b', backgroundColor: '#f8fafc', textColor: '#0f172a', fontFamily: 'sans', buttonStyle: 'pill', sectionRadius: 28, layoutDensity: 'comfortable' },
    hero: { title: `${item.name} 主視覺驗收`, subtitle: `StoreWebsiteRenderer 必須讀取 ${item.id}`, imageId: mediaId, ctaText: '查看菜單', ctaUrl: '#menu' },
    menu: { categories: [{ id: 'cat-signature', name: '招牌', items: [{ id: 'p1', name: `${item.name} 招牌`, description: 'QA 綁定商品', price: 80, featured: true }, { id: 'p2', name: '手作拿鐵', description: '共用資料驗證', price: 90, featured: true }] }] },
    media: [{ id: mediaId, name: `${item.name} 模板主視覺`, type: 'hero', mimeType: 'image/png', dataUrl: item.artwork }],
    links: { line: 'https://line.me/', googleMap: 'https://maps.google.com/' },
    seo: { title: `${item.name} 驗收店`, description: `QA ${item.id}`, slug: `qa-${item.id}`, ogImageId: mediaId },
    modules: { hero: true, featuredProducts: true, menu: true, brandStory: true, storeInfo: true, map: true, faq: true, socialLinks: true, footer: true },
    faq: [{ question: '是否為目前模板？', answer: item.id }],
    visual: { selectedTemplateId: item.id, layoutFamily: `${item.id}-layout`, backgroundMode: 'artwork', aiArtworkKey: item.id, heroTreatment: 'full-bleed-overlay', navStyle: 'floating', cardStyle: 'soft', templatePreset: { selectedTemplateId: item.id, layoutFamily: `${item.id}-layout`, backgroundMode: 'artwork', aiArtworkKey: item.id, heroTreatment: 'full-bleed-overlay', navStyle: 'floating', cardStyle: 'soft', styleLabel: `${item.name} / QA` }, appliedAt: new Date().toISOString() },
  };
}

async function ensureDirs() { await fs.mkdir(screenshotDir, { recursive: true }); }
async function shot(page: any, filename: string) { await page.screenshot({ path: path.join(screenshotDir, filename), fullPage: true }); }
async function installData(page: any, data: unknown) {
  await page.addInitScript(({ key, value }: { key: string; value: string }) => window.localStorage.setItem(key, value), { key: STORAGE_KEY, value: JSON.stringify(data) });
}
async function probe(page: any, scope: 'builder' | 'preview'): Promise<Probe> {
  const selector = scope === 'builder' ? '[data-testid="preview-panel"]' : '[data-testid="fullscreen-preview-shell"]';
  return await page.evaluate(`(() => {
    const scope = document.querySelector('${selector}');
    const root = scope?.querySelector('[data-testid="preview-canvas"]') || scope?.querySelector('[data-template-id]');
    const hero = scope?.querySelector('.template-hero[data-artwork-src], [data-artwork-src]');
    return {
      templateId: root?.getAttribute('data-template-id') || '',
      skinFamily: root?.getAttribute('data-skin-family') || '',
      artworkSrc: hero?.getAttribute('data-artwork-src') || root?.getAttribute('data-artwork-src') || '',
      text: document.body.innerText || ''
    };
  })()`);
}

async function main() {
  await ensureDirs();
  const result: any = { ok: false, baseUrl, testedTemplates: 0, builderAndPreviewTemplateMatch: true, previewUsesLocalStorageSiteData: true, previewUsesStoreWebsiteRenderer: true, noDemoHeroContent: true, noDefaultGradientPlaceholder: true, cases: [], screenshots: [], errors: [] };
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  try {
    for (const item of cases) {
      const data = makeData(item);
      await installData(page, data);
      await page.goto(`${baseUrl}/builder`, { waitUntil: 'networkidle', timeout: 60_000 });
      await page.locator('[data-testid="preview-panel"]').waitFor({ state: 'visible', timeout: 20_000 });
      const builder = await probe(page, 'builder');
      if (item.builderShot) { await shot(page, item.builderShot); result.screenshots.push(item.builderShot); }
      await page.locator('[data-testid="fullscreen-preview-button"]').click();
      await page.waitForURL(/\/preview/, { timeout: 20_000 });
      await page.locator('[data-testid="fullscreen-preview-shell"]').waitFor({ state: 'visible', timeout: 20_000 });
      await page.locator('[data-testid="preview-viewport-1440"]').click();
      await page.waitForTimeout(300);
      const preview = await probe(page, 'preview');
      await shot(page, item.previewShot); result.screenshots.push(item.previewShot);
      if (item.id === 'cafe-daily-corner') {
        await page.getByRole('button', { name: '手機' }).click();
        await page.locator('[data-testid="preview-viewport-390"]').click();
        await page.waitForTimeout(300);
        await shot(page, 'preview-mobile-390.png'); result.screenshots.push('preview-mobile-390.png');
      }
      const noDemo = !preview.text.includes('Fullscreen Desktop Preview');
      const noGradient = !preview.text.includes('default gradient placeholder') && !preview.text.includes('gradient placeholder');
      const artworkMatch = builder.artworkSrc === preview.artworkSrc && preview.artworkSrc === item.artwork;
      const pass = builder.templateId === item.id && preview.templateId === item.id && builder.skinFamily === item.skinFamily && preview.skinFamily === item.skinFamily && artworkMatch && noDemo && noGradient && preview.text.includes(`${item.name} 驗收店`);
      result.cases.push({ name: item.name, id: item.id, builderTemplateId: builder.templateId, previewTemplateId: preview.templateId, builderSkinFamily: builder.skinFamily, previewSkinFamily: preview.skinFamily, builderArtwork: builder.artworkSrc, previewArtwork: preview.artworkSrc, expectedSkin: item.skinFamily, expectedArtwork: item.artwork, artworkMatch, noDemoHeroContent: noDemo, noDefaultGradientPlaceholder: noGradient, pass });
      result.builderAndPreviewTemplateMatch &&= builder.templateId === preview.templateId && preview.templateId === item.id;
      result.previewUsesLocalStorageSiteData &&= preview.text.includes(`${item.name} 驗收店`) || preview.text.includes(`${item.name} 主視覺驗收`);
      result.previewUsesStoreWebsiteRenderer &&= Boolean(preview.templateId && preview.skinFamily && preview.artworkSrc);
      result.noDemoHeroContent &&= noDemo;
      result.noDefaultGradientPlaceholder &&= noGradient;
      result.testedTemplates += 1;
    }
    await page.locator('[data-testid="preview-back-to-builder"]').click();
    await page.waitForURL(/\/builder/, { timeout: 20_000 });
    await page.locator('[data-testid="preview-panel"]').waitFor({ state: 'visible', timeout: 20_000 });
    await shot(page, 'preview-back-to-builder.png'); result.screenshots.push('preview-back-to-builder.png');
    result.ok = result.testedTemplates === 5 && result.builderAndPreviewTemplateMatch && result.previewUsesLocalStorageSiteData && result.previewUsesStoreWebsiteRenderer && result.noDemoHeroContent && result.noDefaultGradientPlaceholder && result.cases.every((c: any) => c.pass);
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : String(error));
  } finally {
    await browser.close();
    await fs.writeFile(resultPath, JSON.stringify(result, null, 2));
  }
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

main().catch(error => { console.error(error); process.exit(1); });
