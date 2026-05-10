import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const STORAGE_KEY = 'store-site-builder-data';
const PREVIEW_SESSION_KEY = 'store-site-builder-preview-data';
const baseUrl = (process.argv[2] || 'http://127.0.0.1:3204').replace(/\/$/, '');
const artifactRoot = path.join(process.cwd(), 'qa-artifacts', 'v0.2.4');
const screenshotDir = path.join(artifactRoot, 'fullscreen-entry');
const resultPath = path.join(artifactRoot, 'fullscreen-entry-result.json');

const cases = [
  { name: '香辣市集', id: 'restaurant-spicy-market', baseTemplate: 'playful-colorful', industry: 'restaurant', skinFamily: 'charcoal-grill', artwork: '/template-gallery-ai/restaurant/restaurant-spicy-market.png' },
  { name: '白桃氣泡', id: 'drink-white-peach-sparkle', baseTemplate: 'fresh-japanese', industry: 'drink-shop', skinFamily: 'peach-pastel', artwork: '/template-gallery-ai/drink-shop/drink-white-peach-sparkle.png' },
  { name: '日常一隅', id: 'cafe-daily-corner', baseTemplate: 'fresh-japanese', industry: 'cafe', skinFamily: 'urban-casual', artwork: '/template-gallery-ai/cafe/cafe-daily-corner.png' },
] as const;

type TestCase = typeof cases[number];

function makeData(item: TestCase) {
  const mediaId = `template-artwork-${item.id}`;
  return {
    id: `qa-mobile-${item.id}`,
    industry: item.industry,
    template: item.baseTemplate,
    galleryTemplateId: item.id,
    store: { name: `${item.name} 手機驗收店`, tagline: `${item.name} mobile tap`, description: `目前模板必須是 ${item.id}`, phone: '02-1234-5678', email: 'qa@example.com', address: '台北市 QA 路 24 號', businessHours: '每日 10:00 - 22:00' },
    theme: { primaryColor: '#0f766e', secondaryColor: '#f59e0b', backgroundColor: '#f8fafc', textColor: '#0f172a', fontFamily: 'sans', buttonStyle: 'pill', sectionRadius: 28, layoutDensity: 'comfortable' },
    hero: { title: `${item.name} 手機全螢幕驗收`, subtitle: `點擊後必須進入 /preview 並讀取 ${item.id}`, imageId: mediaId, ctaText: '查看菜單', ctaUrl: '#menu' },
    menu: { categories: [{ id: 'cat-signature', name: '招牌', items: [{ id: 'p1', name: `${item.name} 招牌`, description: 'QA 商品', price: 88, featured: true }] }] },
    media: [{ id: mediaId, name: `${item.name} 模板主視覺`, type: 'hero', mimeType: 'image/png', dataUrl: item.artwork }],
    links: { line: 'https://line.me/', googleMap: 'https://maps.google.com/' },
    seo: { title: `${item.name} 手機驗收店`, description: `QA ${item.id}`, slug: `qa-${item.id}`, ogImageId: mediaId },
    modules: { hero: true, featuredProducts: true, menu: true, brandStory: true, storeInfo: true, map: true, faq: true, socialLinks: true, footer: true },
    faq: [{ question: '是否保留模板？', answer: item.id }],
    visual: { selectedTemplateId: item.id, layoutFamily: `${item.id}-layout`, backgroundMode: 'artwork', aiArtworkKey: item.id, heroTreatment: 'full-bleed-overlay', navStyle: 'floating', cardStyle: 'soft', styleLabel: `${item.name} / Mobile QA`, templatePreset: { selectedTemplateId: item.id, layoutFamily: `${item.id}-layout`, backgroundMode: 'artwork', aiArtworkKey: item.id, heroTreatment: 'full-bleed-overlay', navStyle: 'floating', cardStyle: 'soft', styleLabel: `${item.name} / Mobile QA` }, appliedAt: new Date().toISOString() },
  };
}

async function shot(page: any, filename: string) {
  await page.screenshot({ path: path.join(screenshotDir, filename), fullPage: true });
}

async function installData(page: any, data: unknown) {
  await page.addInitScript(({ key, sessionKey, value }: { key: string; sessionKey: string; value: string }) => {
    window.localStorage.setItem(key, value);
    window.sessionStorage.setItem(sessionKey, value);
  }, { key: STORAGE_KEY, sessionKey: PREVIEW_SESSION_KEY, value: JSON.stringify(data) });
}

async function probeTemplate(page: any) {
  return await page.evaluate(`(() => {
    const root = document.querySelector('[data-testid="desktop-preview-canvas"], [data-testid="mobile-preview-canvas"], [data-testid="fullscreen-preview-shell"] [data-template-id], [data-testid="preview-panel"] [data-template-id]');
    return {
      templateId: root?.getAttribute('data-template-id') || '',
      skinFamily: root?.getAttribute('data-skin-family') || '',
      text: document.body.innerText || ''
    };
  })()`);
}

async function buttonMetrics(locator: any) {
  return await locator.evaluate((el: HTMLElement) => {
    const box = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return { width: box.width, height: box.height, pointerEvents: style.pointerEvents, disabled: (el as HTMLButtonElement).disabled || el.getAttribute('aria-disabled') === 'true' };
  });
}

async function main() {
  await fs.mkdir(screenshotDir, { recursive: true });
  const result: any = {
    ok: false,
    baseUrl,
    mobileButtonVisible: true,
    mobileButtonClickable: true,
    mobilePreviewRouteWorks: true,
    desktopButtonVisible: false,
    desktopButtonClickable: false,
    desktopPreviewRouteWorks: false,
    backToBuilderWorks: true,
    desktopCanvas1440: false,
    desktopCanvasCentered: false,
    mobile390NoOverflow: true,
    testedTemplates: 0,
    cases: [],
    screenshots: [],
    errors: [],
  };

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  try {
    for (const [index, item] of cases.entries()) {
      const data = makeData(item);
      await installData(page, data);
      await page.goto(`${baseUrl}/builder`, { waitUntil: 'networkidle', timeout: 60_000 });
      await page.getByRole('button', { name: '預覽' }).click();
      await page.locator('[data-testid="mobile-fullscreen-preview-button"]').waitFor({ state: 'visible', timeout: 20_000 });
      const button = page.locator('[data-testid="mobile-fullscreen-preview-button"]');
      const metrics = await buttonMetrics(button);
      const visible = await button.isVisible();
      const enabled = await button.isEnabled();
      const validBox = metrics.width > 200 && metrics.height >= 44;
      if (index === 0) { await shot(page, 'mobile-builder-preview-with-fullscreen-button.png'); result.screenshots.push('mobile-builder-preview-with-fullscreen-button.png'); }
      await button.tap({ timeout: 20_000 });
      await page.waitForURL(/\/preview\?mode=mobile&viewport=390/, { timeout: 20_000 });
      await page.locator('[data-testid="fullscreen-preview-shell"]').waitFor({ state: 'visible', timeout: 20_000 });
      const preview = await probeTemplate(page);
      const routeOk = page.url().includes('/preview?mode=mobile&viewport=390');
      if (index === 0) {
        await shot(page, 'mobile-preview-route-390.png'); result.screenshots.push('mobile-preview-route-390.png');
        await shot(page, 'mobile-preview-back-button.png'); result.screenshots.push('mobile-preview-back-button.png');
      }
      const noOverflow = await page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 2');
      await page.locator('[data-testid="preview-back-to-builder"]').tap();
      await page.waitForURL(/\/builder/, { timeout: 20_000 });
      await page.getByRole('button', { name: '預覽' }).click();
      const afterBack = await probeTemplate(page);
      if (index === 0) { await shot(page, 'builder-after-back.png'); result.screenshots.push('builder-after-back.png'); }
      const pass = visible && enabled && validBox && metrics.pointerEvents !== 'none' && routeOk && preview.templateId === item.id && preview.skinFamily === item.skinFamily && afterBack.templateId === item.id;
      result.cases.push({ name: item.name, id: item.id, mobileBuilderButtonVisible: visible, buttonEnabled: enabled, buttonBoundingBoxValid: validBox, buttonPointerEvents: metrics.pointerEvents, tapNavigatesToPreview: routeOk, previewTemplateId: preview.templateId, previewSkinFamily: preview.skinFamily, previewUsesCurrentTemplate: preview.templateId === item.id, backToBuilderWorks: afterBack.templateId === item.id, mobile390NoOverflow: noOverflow, pass });
      result.mobileButtonVisible &&= visible;
      result.mobileButtonClickable &&= enabled && validBox && metrics.pointerEvents !== 'none';
      result.mobilePreviewRouteWorks &&= routeOk;
      result.backToBuilderWorks &&= afterBack.templateId === item.id;
      result.mobile390NoOverflow &&= noOverflow;
      result.testedTemplates += 1;
    }

    await page.setViewportSize({ width: 1440, height: 1000 });
    const desktopData = makeData(cases[1]);
    await page.evaluate(({ key, sessionKey, value }: { key: string; sessionKey: string; value: string }) => {
      window.localStorage.setItem(key, value);
      window.sessionStorage.setItem(sessionKey, value);
    }, { key: STORAGE_KEY, sessionKey: PREVIEW_SESSION_KEY, value: JSON.stringify(desktopData) });
    await page.goto(`${baseUrl}/builder`, { waitUntil: 'networkidle', timeout: 60_000 });
    const desktopButton = page.locator('[data-testid="fullscreen-preview-button"]');
    await desktopButton.waitFor({ state: 'visible', timeout: 20_000 });
    result.desktopButtonVisible = await desktopButton.isVisible();
    result.desktopButtonClickable = await desktopButton.isEnabled();
    await shot(page, 'desktop-builder-preview-with-fullscreen-button.png'); result.screenshots.push('desktop-builder-preview-with-fullscreen-button.png');
    await desktopButton.click();
    await page.waitForURL(/\/preview\?mode=desktop&viewport=1440/, { timeout: 20_000 });
    await page.locator('[data-testid="fullscreen-preview-shell"]').waitFor({ state: 'visible', timeout: 20_000 });
    result.desktopPreviewRouteWorks = page.url().includes('/preview?mode=desktop&viewport=1440');
    const canvas = page.locator('[data-testid="desktop-preview-canvas"]').first();
    await canvas.waitFor({ state: 'visible', timeout: 20_000 });
    result.desktopCanvas1440 = (await canvas.getAttribute('data-viewport-width')) === '1440';
    const centerDelta = await page.evaluate(`(() => {
      const stage = document.querySelector('.fullscreen-preview-stage')?.getBoundingClientRect();
      const canvas = document.querySelector('[data-testid="desktop-preview-canvas"]')?.getBoundingClientRect();
      if (!stage || !canvas) return 9999;
      return Math.abs((stage.left + stage.width / 2) - (canvas.left + canvas.width / 2));
    })()`) as number;
    result.desktopCanvasCentered = centerDelta <= 32;
    await shot(page, 'desktop-preview-route-1440.png'); result.screenshots.push('desktop-preview-route-1440.png');
    await shot(page, 'desktop-preview-canvas-centered.png'); result.screenshots.push('desktop-preview-canvas-centered.png');

    result.ok = result.testedTemplates === 3 && result.mobileButtonVisible && result.mobileButtonClickable && result.mobilePreviewRouteWorks && result.desktopButtonVisible && result.desktopButtonClickable && result.desktopPreviewRouteWorks && result.backToBuilderWorks && result.desktopCanvas1440 && result.desktopCanvasCentered && result.mobile390NoOverflow && result.cases.every((c: any) => c.pass);
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
