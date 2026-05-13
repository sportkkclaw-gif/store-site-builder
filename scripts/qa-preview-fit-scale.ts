import { chromium, type Browser, type Page } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createDefaultSiteData } from '../lib/defaultSiteData';
import { templateCatalog } from '../lib/templateCatalog';
import { applyTemplatePresetSync } from '../lib/applyTemplatePreset';

const BASE_URL = process.env.PREVIEW_URL || process.env.BASE_URL || 'http://127.0.0.1:3050';
const OUT_DIR = path.resolve('qa-artifacts/v0.2.10');
const SHOT_DIR = path.join(OUT_DIR, 'preview-fit-scale');
const STORAGE_KEY = 'store-site-builder-data';
const PREVIEW_SESSION_KEY = 'store-site-builder-preview-data';

const REQUIRED_TEMPLATE_NAMES = [
  '抹茶日和',
  '珍珠霓光',
  '白桃氣泡',
  '飲研實驗室',
  '早午餐花園',
  '鍋物暖居',
  '食尚快享',
  '日常一隅',
  '白瓷濾杯',
  '城市黑白',
];

type FitMetrics = {
  containerWidth: number;
  virtualWidth: number;
  targetWidth: number;
  scale: number;
  scaledWidth: number;
  spacerHeight: number;
  contentHeight: number;
  fitsContainer: boolean;
  hasTransformScale: boolean;
  hasSpacerHeight: boolean;
  notCropped: boolean;
  leftVisible: boolean;
  rightVisible: boolean;
};

type TemplateResult = {
  templateName: string;
  templateId: string;
  builderDesktop: FitMetrics;
  builderMobile: FitMetrics;
  fullscreenDesktop: FitMetrics;
  fullscreenMobile: FitMetrics;
  ok: boolean;
  error?: string;
};

function slug(input: string) {
  return input.replace(/抹茶日和/g, 'matcha')
    .replace(/珍珠霓光/g, 'boba-neon')
    .replace(/白桃氣泡/g, 'white-peach')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]+/g, '-')
    .slice(0, 80);
}

function selectedTemplates() {
  return REQUIRED_TEMPLATE_NAMES.map((name) => {
    const template = templateCatalog.find((item) => item.name === name);
    if (!template) throw new Error(`Missing QA template: ${name}`);
    return template;
  });
}

function siteDataFor(template: (typeof templateCatalog)[number]) {
  const data = applyTemplatePresetSync(createDefaultSiteData(), template);
  return {
    ...data,
    id: `qa-fit-${template.id}`,
    store: {
      ...data.store,
      name: `${template.name} Fit Scale QA 店`,
      tagline: 'Preview Fit Scale Engine QA',
      description: '用於確認 Builder 與 Fullscreen Preview 的 virtual canvas 正確 fit scale。',
    },
    modules: { ...data.modules, hero: true, brandStory: true, featuredProducts: true, menu: true, storeInfo: true, faq: true, footer: true },
  };
}

async function seed(page: Page, data: unknown) {
  const raw = JSON.stringify(data);
  await page.addInitScript(({ storageKey, previewKey, rawData }) => {
    window.localStorage.setItem(storageKey, rawData);
    window.sessionStorage.setItem(previewKey, rawData);
  }, { storageKey: STORAGE_KEY, previewKey: PREVIEW_SESSION_KEY, rawData: raw });
}

async function measure(page: Page, mode: 'desktop' | 'mobile', context: 'builder-panel' | 'fullscreen'): Promise<FitMetrics> {
  await page.waitForSelector(`[data-preview-mode="${mode}"][data-preview-context="${context}"] [data-testid="preview-virtual-canvas"]`, { timeout: 30000 });
  await page.waitForTimeout(600);
  return await page.evaluate(`(() => {
    const mode = ${JSON.stringify(mode)};
    const context = ${JSON.stringify(context)};
    const container = document.querySelector('[data-preview-mode="' + mode + '"][data-preview-context="' + context + '"]');
    if (!container) throw new Error('missing preview fit container ' + mode + ' ' + context);
    const virtualCanvas = container.querySelector('[data-testid="preview-virtual-canvas"]');
    const spacer = container.querySelector('[data-testid="preview-scaled-spacer"]');
    const wrapper = container.querySelector('[data-testid="preview-scale-wrapper"]');
    if (!virtualCanvas || !spacer || !wrapper) throw new Error('missing canvas/spacer/wrapper');
    const c = container.getBoundingClientRect();
    const v = virtualCanvas.getBoundingClientRect();
    const s = spacer.getBoundingClientRect();
    const containerWidth = Number(container.getAttribute('data-container-width') || Math.round(c.width));
    const virtualWidth = Number(virtualCanvas.getAttribute('data-viewport-width') || 0);
    const targetWidth = Number(container.getAttribute('data-target-width') || virtualWidth);
    const scale = Number(container.getAttribute('data-preview-scale') || virtualCanvas.getAttribute('data-preview-scale') || 0);
    const scaledWidth = Number(container.getAttribute('data-scaled-width') || Math.round(s.width));
    const contentHeight = Number(spacer.getAttribute('data-content-height') || virtualCanvas.getAttribute('data-content-height') || 0);
    const spacerHeight = Number(spacer.getAttribute('data-scaled-spacer-height') || Math.round(s.height));
    const transform = getComputedStyle(wrapper).transform;
    const tolerance = 4;
    return {
      containerWidth,
      virtualWidth,
      targetWidth,
      scale,
      scaledWidth,
      spacerHeight,
      contentHeight,
      fitsContainer: scaledWidth <= containerWidth + tolerance,
      hasTransformScale: !!transform && transform !== 'none',
      hasSpacerHeight: spacerHeight > 0 && Math.abs(spacerHeight - contentHeight * scale) < Math.max(24, contentHeight * 0.04),
      notCropped: s.width <= c.width + tolerance || context === 'fullscreen',
      leftVisible: v.left >= c.left - tolerance,
      rightVisible: v.right <= c.right + tolerance || context === 'fullscreen',
    };
  })()`);
}

function passDesktopFit(metrics: FitMetrics) {
  return metrics.virtualWidth === 1440 && metrics.scale < 1 && metrics.fitsContainer && metrics.hasTransformScale && metrics.hasSpacerHeight && metrics.leftVisible && metrics.rightVisible;
}

function passMobileFit(metrics: FitMetrics) {
  return metrics.virtualWidth === 390 && metrics.scale <= 1 && metrics.fitsContainer && metrics.hasTransformScale && metrics.hasSpacerHeight;
}

async function checkBuilder(browser: Browser, data: unknown, templateName: string, shotPrefix: string) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await seed(page, data);
  await page.goto(`${BASE_URL}/builder`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForSelector('[data-testid="preview-panel"]', { timeout: 30000 });
  await page.waitForSelector('[data-preview-mode="desktop"][data-preview-context="builder-panel"]', { timeout: 30000 });
  const desktop = await measure(page, 'desktop', 'builder-panel');
  if (['matcha', 'boba-neon', 'white-peach'].includes(shotPrefix)) {
    await page.screenshot({ path: path.join(SHOT_DIR, `builder-desktop-preview-${shotPrefix}.png`), fullPage: true });
  }
  await page.getByRole('button', { name: '手機' }).click();
  await page.waitForSelector('[data-preview-mode="mobile"][data-preview-context="builder-panel"]', { timeout: 30000 });
  const mobile = await measure(page, 'mobile', 'builder-panel');
  if (['matcha', 'boba-neon', 'white-peach'].includes(shotPrefix)) {
    await page.screenshot({ path: path.join(SHOT_DIR, `builder-mobile-preview-${shotPrefix}.png`), fullPage: true });
  }
  await context.close();
  return { desktop, mobile };
}

async function checkFullscreen(browser: Browser, data: unknown, templateName: string) {
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const desktopPage = await desktopContext.newPage();
  await seed(desktopPage, data);
  await desktopPage.goto(`${BASE_URL}/preview?mode=desktop&viewport=1440`, { waitUntil: 'load', timeout: 60000 });
  const desktop = await measure(desktopPage, 'desktop', 'fullscreen');
  if (templateName === '抹茶日和') {
    await desktopPage.screenshot({ path: path.join(SHOT_DIR, 'fullscreen-desktop-1440-fit.png'), fullPage: true });
  }
  await desktopContext.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 1 });
  const mobilePage = await mobileContext.newPage();
  await seed(mobilePage, data);
  await mobilePage.goto(`${BASE_URL}/preview?mode=mobile&viewport=390`, { waitUntil: 'load', timeout: 60000 });
  const mobile = await measure(mobilePage, 'mobile', 'fullscreen');
  if (templateName === '抹茶日和') {
    await mobilePage.screenshot({ path: path.join(SHOT_DIR, 'fullscreen-mobile-390-fit.png'), fullPage: true });
  }
  await mobileContext.close();
  return { desktop, mobile };
}

async function main() {
  await mkdir(SHOT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const results: TemplateResult[] = [];
  const failedTemplates: string[] = [];
  for (const template of selectedTemplates()) {
    const data = siteDataFor(template);
    const shotPrefix = slug(template.name);
    const result: TemplateResult = {
      templateName: template.name,
      templateId: template.id,
      builderDesktop: {} as FitMetrics,
      builderMobile: {} as FitMetrics,
      fullscreenDesktop: {} as FitMetrics,
      fullscreenMobile: {} as FitMetrics,
      ok: false,
    };
    try {
      const builder = await checkBuilder(browser, data, template.name, shotPrefix);
      const fullscreen = await checkFullscreen(browser, data, template.name);
      result.builderDesktop = builder.desktop;
      result.builderMobile = builder.mobile;
      result.fullscreenDesktop = fullscreen.desktop;
      result.fullscreenMobile = fullscreen.mobile;
      result.ok = passDesktopFit(builder.desktop) && passMobileFit(builder.mobile) && passDesktopFit(fullscreen.desktop) && passMobileFit(fullscreen.mobile);
    } catch (error) {
      result.error = error instanceof Error ? error.message : String(error);
      result.ok = false;
    }
    if (!result.ok) failedTemplates.push(`${template.name} (${template.id})`);
    results.push(result);
    console.log(`${result.ok ? 'PASS' : 'FAIL'} ${template.name}`);
  }
  await browser.close();

  const builderDesktopScaleWorks = results.every((item) => passDesktopFit(item.builderDesktop));
  const builderMobileScaleWorks = results.every((item) => passMobileFit(item.builderMobile));
  const fullscreenDesktopScaleWorks = results.every((item) => passDesktopFit(item.fullscreenDesktop));
  const fullscreenMobileScaleWorks = results.every((item) => passMobileFit(item.fullscreenMobile));
  const summary = {
    ok: failedTemplates.length === 0 && builderDesktopScaleWorks && builderMobileScaleWorks && fullscreenDesktopScaleWorks && fullscreenMobileScaleWorks,
    baseUrl: BASE_URL,
    testedTemplates: results.length,
    builderDesktopScaleWorks,
    builderMobileScaleWorks,
    fullscreenDesktopScaleWorks,
    fullscreenMobileScaleWorks,
    failedTemplates,
    results,
  };
  await writeFile(path.join(OUT_DIR, 'preview-fit-scale-result.json'), JSON.stringify(summary, null, 2));
  await writeFile(path.join(OUT_DIR, 'preview-fit-scale-summary.md'), `# Preview Fit Scale QA\n\n- baseUrl: ${BASE_URL}\n- ok: ${summary.ok}\n- testedTemplates: ${summary.testedTemplates}\n- builderDesktopScaleWorks: ${builderDesktopScaleWorks}\n- builderMobileScaleWorks: ${builderMobileScaleWorks}\n- fullscreenDesktopScaleWorks: ${fullscreenDesktopScaleWorks}\n- fullscreenMobileScaleWorks: ${fullscreenMobileScaleWorks}\n- failedTemplates: ${failedTemplates.join(', ') || '[]'}\n`);
  if (!summary.ok) {
    console.error(JSON.stringify(summary, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
