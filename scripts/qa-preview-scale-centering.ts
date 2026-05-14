import { chromium, type Browser, type Page } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createDefaultSiteData } from '../lib/defaultSiteData';
import { templateCatalog } from '../lib/templateCatalog';
import { applyTemplatePresetSync } from '../lib/applyTemplatePreset';

const BASE_URL = process.env.PREVIEW_URL || process.env.BASE_URL || 'http://127.0.0.1:3050';
const OUT_DIR = path.resolve('qa-artifacts/v0.2.10');
const SHOT_DIR = path.join(OUT_DIR, 'preview-scale-centering');
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

const SHOT_SLUGS: Record<string, string> = {
  抹茶日和: 'matcha',
  珍珠霓光: 'boba-neon',
  白桃氣泡: 'white-peach',
};

type PreviewMetrics = {
  containerWidth: number;
  virtualWidth: number;
  frameOuterWidth: number;
  scale: number;
  scaledWidth: number;
  scaledHeight: number;
  fits: boolean;
  centered: boolean;
  leftGap: number;
  rightGap: number;
  gapDelta: number;
  hasTransformScale: boolean;
  spacerHeightOk: boolean;
  phoneFrameComplete?: boolean;
  noClipping?: boolean;
  mobileCanvasWidthOk?: boolean;
  footerReachable?: boolean;
};

type TemplateResult = {
  templateName: string;
  templateId: string;
  builderDesktop: PreviewMetrics;
  builderMobile: PreviewMetrics;
  fullscreenDesktop: PreviewMetrics;
  fullscreenMobile: PreviewMetrics;
  mobile390: boolean;
  mobile375: boolean;
  mobile320: boolean;
  ok: boolean;
  error?: string;
};

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
    id: `qa-centering-${template.id}`,
    store: {
      ...data.store,
      name: `${template.name} Centering QA 店`,
      tagline: 'PreviewCanvas Fit Scale + Centering QA',
      description: '用於確認 Builder 與 Fullscreen Preview 的 virtual canvas 正確縮放、置中、不裁切。',
    },
    modules: { ...data.modules, hero: true, brandStory: true, featuredProducts: true, menu: true, storeInfo: true, faq: true, footer: true },
  };
}

async function seed(page: Page, data: unknown) {
  const raw = JSON.stringify(data);
  await page.addInitScript(({ storageKey, previewKey, rawData }) => {
    window.localStorage.setItem(storageKey, rawData);
    window.localStorage.setItem(previewKey, rawData);
    window.sessionStorage.setItem(previewKey, rawData);
  }, { storageKey: STORAGE_KEY, previewKey: PREVIEW_SESSION_KEY, rawData: raw });
}

async function measure(page: Page, mode: 'desktop' | 'mobile', context: 'builder-panel' | 'fullscreen'): Promise<PreviewMetrics> {
  await page.waitForSelector(`[data-testid="preview-stage"][data-preview-mode="${mode}"][data-preview-context="${context}"]`, { timeout: 30000 });
  await page.waitForTimeout(800);
  return await page.evaluate(({ mode, context }) => {
    const stage = document.querySelector(`[data-testid="preview-stage"][data-preview-mode="${mode}"][data-preview-context="${context}"]`) as HTMLElement | null;
    if (!stage) throw new Error(`missing preview-stage ${mode} ${context}`);
    const spacer = stage.querySelector('[data-testid="preview-centered-spacer"]') as HTMLElement | null;
    const wrapper = stage.querySelector('[data-testid="preview-scale-wrapper"]') as HTMLElement | null;
    const virtualCanvas = stage.querySelector('[data-testid="preview-virtual-canvas"]') as HTMLElement | null;
    const mobileCanvas = stage.querySelector('[data-testid="mobile-preview-canvas"]') as HTMLElement | null;
    const phoneFrame = stage.querySelector('[data-testid="preview-phone-frame"]') as HTMLElement | null;
    if (!spacer || !wrapper || !virtualCanvas) throw new Error('missing stage/spacer/wrapper/virtualCanvas');
    const stageBox = stage.getBoundingClientRect();
    const spacerBox = spacer.getBoundingClientRect();
    const phoneBox = phoneFrame?.getBoundingClientRect();
    const leftGap = Math.round(spacerBox.left - stageBox.left);
    const rightGap = Math.round(stageBox.right - spacerBox.right);
    const gapDelta = Math.abs(leftGap - rightGap);
    const containerWidth = Math.round(stageBox.width);
    const virtualWidth = Number(virtualCanvas.getAttribute('data-viewport-width') || 0);
    const frameOuterWidth = Number(stage.getAttribute('data-frame-outer-width') || stage.getAttribute('data-target-width') || virtualWidth);
    const scale = Number(stage.getAttribute('data-preview-scale') || virtualCanvas.getAttribute('data-preview-scale') || 0);
    const scaledWidth = Number(stage.getAttribute('data-scaled-width') || Math.round(spacerBox.width));
    const scaledHeight = Number(stage.getAttribute('data-scaled-height') || Math.round(spacerBox.height));
    const frameOuterHeight = Number(spacer.getAttribute('data-content-height') || 0);
    const transform = getComputedStyle(wrapper).transform;
    const tolerance = 4;
    const phoneFrameComplete = mode !== 'mobile' || !!phoneBox && phoneBox.left >= stageBox.left - tolerance && phoneBox.right <= stageBox.right + tolerance;
    const mobileCanvasWidthOk = mode !== 'mobile' || Number((mobileCanvas || virtualCanvas).getAttribute('data-viewport-width') || 0) === virtualWidth;
    return {
      containerWidth,
      virtualWidth,
      frameOuterWidth,
      scale,
      scaledWidth,
      scaledHeight,
      fits: scaledWidth <= containerWidth + tolerance,
      centered: gapDelta <= 32,
      leftGap,
      rightGap,
      gapDelta,
      hasTransformScale: !!transform && transform !== 'none',
      spacerHeightOk: scaledHeight > 0 && frameOuterHeight > 0 && Math.abs(scaledHeight - frameOuterHeight * scale) <= Math.max(24, frameOuterHeight * 0.04),
      phoneFrameComplete,
      noClipping: mode !== 'mobile' || phoneFrameComplete,
      mobileCanvasWidthOk,
    };
  }, { mode, context });
}

async function footerReachable(page: Page, mode: 'desktop' | 'mobile', context: 'builder-panel' | 'fullscreen') {
  return await page.evaluate(async ({ mode, context }) => {
    const stage = document.querySelector(`[data-testid="preview-stage"][data-preview-mode="${mode}"][data-preview-context="${context}"]`) as HTMLElement | null;
    const scroller = context === 'builder-panel'
      ? document.querySelector('[data-testid="preview-panel-scroll-container"]') as HTMLElement | null
      : stage;
    const footer = stage?.querySelector('[data-testid="site-footer"], [data-testid="site-render-end"]') as HTMLElement | null;
    if (!stage || !scroller || !footer) return false;
    scroller.scrollTop = scroller.scrollHeight;
    await new Promise((resolve) => window.setTimeout(resolve, 250));
    const footerBox = footer.getBoundingClientRect();
    const scrollerBox = scroller.getBoundingClientRect();
    return footerBox.top <= scrollerBox.bottom + 96 && footerBox.bottom >= scrollerBox.top - 96;
  }, { mode, context });
}

function passBuilderDesktop(metrics: PreviewMetrics) {
  return metrics.virtualWidth === 1440 && metrics.scale < 1 && metrics.fits && metrics.centered && metrics.hasTransformScale && metrics.spacerHeightOk && metrics.footerReachable === true;
}
function passBuilderMobile(metrics: PreviewMetrics) {
  return metrics.virtualWidth === 390 && metrics.scale < 1 && metrics.fits && metrics.centered && metrics.hasTransformScale && metrics.spacerHeightOk && metrics.phoneFrameComplete === true && metrics.noClipping === true && metrics.mobileCanvasWidthOk === true;
}
function passFullscreenDesktop(metrics: PreviewMetrics) {
  return metrics.virtualWidth === 1440 && metrics.centered && metrics.gapDelta <= 32 && metrics.hasTransformScale && metrics.spacerHeightOk && metrics.footerReachable === true;
}
function passFullscreenMobile(metrics: PreviewMetrics) {
  return metrics.virtualWidth === 390 && metrics.centered && metrics.gapDelta <= 32 && metrics.phoneFrameComplete === true && metrics.noClipping === true && metrics.mobileCanvasWidthOk === true;
}

async function checkBuilder(browser: Browser, data: unknown, shotSlug?: string) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await seed(page, data);
  await page.goto(`${BASE_URL}/builder`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForSelector('[data-testid="preview-panel"]', { timeout: 30000 });
  const desktop = await measure(page, 'desktop', 'builder-panel');
  desktop.footerReachable = await footerReachable(page, 'desktop', 'builder-panel');
  if (shotSlug) await page.screenshot({ path: path.join(SHOT_DIR, `builder-desktop-preview-${shotSlug}.png`), fullPage: true });
  await page.getByRole('button', { name: '手機' }).click();
  const mobile = await measure(page, 'mobile', 'builder-panel');
  if (shotSlug) await page.screenshot({ path: path.join(SHOT_DIR, `builder-mobile-preview-${shotSlug}.png`), fullPage: true });
  await context.close();
  return { desktop, mobile };
}

async function checkFullscreen(browser: Browser, data: unknown, templateName: string, shotSlug?: string) {
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const desktopPage = await desktopContext.newPage();
  await seed(desktopPage, data);
  await desktopPage.goto(`${BASE_URL}/preview?mode=desktop&viewport=1440&zoom=fit`, { waitUntil: 'load', timeout: 60000 });
  const desktop = await measure(desktopPage, 'desktop', 'fullscreen');
  desktop.footerReachable = await footerReachable(desktopPage, 'desktop', 'fullscreen');
  if (shotSlug) await desktopPage.screenshot({ path: path.join(SHOT_DIR, `fullscreen-desktop-${shotSlug}-1440.png`), fullPage: true });
  await desktopContext.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 1 });
  const mobilePage = await mobileContext.newPage();
  await seed(mobilePage, data);
  await mobilePage.goto(`${BASE_URL}/preview?mode=mobile&viewport=390&zoom=fit`, { waitUntil: 'load', timeout: 60000 });
  const mobile = await measure(mobilePage, 'mobile', 'fullscreen');
  if (shotSlug) await mobilePage.screenshot({ path: path.join(SHOT_DIR, `fullscreen-mobile-${shotSlug}-390.png`), fullPage: true });
  await mobileContext.close();
  return { desktop, mobile };
}

async function checkMobileViewport(browser: Browser, data: unknown, viewport: 390 | 375 | 320) {
  const context = await browser.newContext({ viewport: { width: viewport, height: viewport === 320 ? 720 : viewport === 375 ? 812 : 844 }, isMobile: true, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await seed(page, data);
  await page.goto(`${BASE_URL}/preview?mode=mobile&viewport=${viewport}&zoom=fit`, { waitUntil: 'load', timeout: 60000 });
  const metrics = await measure(page, 'mobile', 'fullscreen');
  await context.close();
  return metrics.virtualWidth === viewport && metrics.centered && metrics.phoneFrameComplete === true && metrics.noClipping === true;
}

async function main() {
  await mkdir(SHOT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const results: TemplateResult[] = [];
  const failedTemplates: string[] = [];

  for (const template of selectedTemplates()) {
    const data = siteDataFor(template);
    const shotSlug = SHOT_SLUGS[template.name];
    const result: TemplateResult = {
      templateName: template.name,
      templateId: template.id,
      builderDesktop: {} as PreviewMetrics,
      builderMobile: {} as PreviewMetrics,
      fullscreenDesktop: {} as PreviewMetrics,
      fullscreenMobile: {} as PreviewMetrics,
      mobile390: false,
      mobile375: false,
      mobile320: false,
      ok: false,
    };
    try {
      const builder = await checkBuilder(browser, data, shotSlug);
      const fullscreen = await checkFullscreen(browser, data, template.name, shotSlug);
      result.builderDesktop = builder.desktop;
      result.builderMobile = builder.mobile;
      result.fullscreenDesktop = fullscreen.desktop;
      result.fullscreenMobile = fullscreen.mobile;
      result.mobile390 = await checkMobileViewport(browser, data, 390);
      result.mobile375 = await checkMobileViewport(browser, data, 375);
      result.mobile320 = await checkMobileViewport(browser, data, 320);
      result.ok = passBuilderDesktop(builder.desktop)
        && passBuilderMobile(builder.mobile)
        && passFullscreenDesktop(fullscreen.desktop)
        && passFullscreenMobile(fullscreen.mobile)
        && result.mobile390 && result.mobile375 && result.mobile320;
    } catch (error) {
      result.error = error instanceof Error ? error.message : String(error);
      result.ok = false;
    }
    if (!result.ok) failedTemplates.push(`${template.name} (${template.id})`);
    results.push(result);
    console.log(`${result.ok ? 'PASS' : 'FAIL'} ${template.name}`);
  }
  await browser.close();

  const builderDesktopFit = results.every((item) => passBuilderDesktop(item.builderDesktop));
  const builderMobileFit = results.every((item) => passBuilderMobile(item.builderMobile));
  const fullscreenDesktopCentered = results.every((item) => passFullscreenDesktop(item.fullscreenDesktop));
  const fullscreenMobileCentered = results.every((item) => passFullscreenMobile(item.fullscreenMobile));
  const mobile390 = results.every((item) => item.mobile390);
  const mobile375 = results.every((item) => item.mobile375);
  const mobile320 = results.every((item) => item.mobile320);
  const footerReachableAll = results.every((item) => item.builderDesktop.footerReachable && item.fullscreenDesktop.footerReachable);
  const summary = {
    ok: failedTemplates.length === 0 && builderDesktopFit && builderMobileFit && fullscreenDesktopCentered && fullscreenMobileCentered && mobile390 && mobile375 && mobile320 && footerReachableAll,
    baseUrl: BASE_URL,
    testedTemplates: results.length,
    builderDesktopFit,
    builderMobileFit,
    fullscreenDesktopCentered,
    fullscreenMobileCentered,
    mobile390,
    mobile375,
    mobile320,
    footerReachable: footerReachableAll,
    failedTemplates,
    results,
  };
  await writeFile(path.join(OUT_DIR, 'preview-scale-centering-result.json'), JSON.stringify(summary, null, 2));
  await writeFile(path.join(OUT_DIR, 'preview-scale-centering-summary.md'), `# Preview Scale Centering QA\n\n- baseUrl: ${BASE_URL}\n- ok: ${summary.ok}\n- testedTemplates: ${summary.testedTemplates}\n- builderDesktopFit: ${builderDesktopFit}\n- builderMobileFit: ${builderMobileFit}\n- fullscreenDesktopCentered: ${fullscreenDesktopCentered}\n- fullscreenMobileCentered: ${fullscreenMobileCentered}\n- mobile390: ${mobile390}\n- mobile375: ${mobile375}\n- mobile320: ${mobile320}\n- footerReachable: ${footerReachableAll}\n- failedTemplates: ${failedTemplates.join(', ') || '[]'}\n`);
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
