import { chromium, type Page } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createDefaultSiteData } from '../lib/defaultSiteData';
import { templateCatalog } from '../lib/templateCatalog';
import { applyTemplatePresetSync } from '../lib/applyTemplatePreset';

const BASE_URL = process.env.PREVIEW_URL || process.env.BASE_URL || 'http://127.0.0.1:3050';
const OUT_DIR = path.resolve('qa-artifacts/v0.2.10');
const SHOT_DIR = path.join(OUT_DIR, 'desktop-preview-full-height');
const STORAGE_KEY = 'store-site-builder-data';
const PREVIEW_SESSION_KEY = 'store-site-builder-preview-data';

type Check = {
  footerReachable: boolean;
  endReachable: boolean;
  noBlankGap: boolean;
  canScroll: boolean;
  contentHeight: number;
  scaledSpacerHeight: number;
  clientHeight: number;
  scrollHeight: number;
};

type TemplateResult = {
  templateId: string;
  templateName: string;
  rightPanelFooterReachable: boolean;
  rightPanelNoBlankGap: boolean;
  fullscreen1440FooterReachable: boolean;
  fullscreen1280FooterReachable: boolean;
  fullscreen1024FooterReachable: boolean;
  contentHeight: number;
  scaledSpacerHeight: number;
  rightPanel?: Check;
  fullscreen1440?: Check;
  fullscreen1280?: Check;
  fullscreen1024?: Check;
  error?: string;
};

function slug(input: string) {
  return input.replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]+/g, '-').slice(0, 80);
}

function siteDataFor(template: (typeof templateCatalog)[number]) {
  const data = applyTemplatePresetSync(createDefaultSiteData(), template);
  return {
    ...data,
    id: `qa-${template.id}`,
    store: {
      ...data.store,
      name: `${template.name} QA 店`,
      tagline: 'Desktop Preview Full Height QA',
      description: '用於確認桌機預覽可以完整滾到底部的測試資料。',
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

async function scrollAndMeasure(page: Page, containerTestId: string): Promise<Check> {
  await page.waitForSelector(`[data-testid="${containerTestId}"]`, { timeout: 15000 });
  await page.waitForSelector('[data-testid="site-render-end"]', { state: 'attached', timeout: 15000 });
  await page.waitForTimeout(250);
  return await page.evaluate(`(() => {
    const testId = ${JSON.stringify(containerTestId)};
    const container = document.querySelector('[data-testid="' + testId + '"]');
    const canvas = document.querySelector('[data-testid="desktop-preview-canvas"]');
    const spacer = document.querySelector('[data-testid="desktop-preview-scaled-spacer"]');
    const footer = document.querySelector('[data-testid="site-footer"]');
    const end = document.querySelector('[data-testid="site-render-end"]');
    if (!container || !canvas || !spacer || !end) throw new Error('missing required nodes for ' + testId);
    const target = Math.max(0, spacer.scrollHeight - container.clientHeight + 12);
    container.scrollTop = target;
    window.scrollTo(0, document.body.scrollHeight);
    const c = container.getBoundingClientRect();
    const footerRect = footer ? footer.getBoundingClientRect() : null;
    const endRect = end.getBoundingClientRect();
    function inContainer(rect) { return !!rect && rect.top >= c.top - 8 && rect.bottom <= c.bottom + 80; }
    const endReachable = inContainer(endRect);
    const footerReachable = footer ? inContainer(footerRect) : endReachable;
    const bottomGap = Math.abs(spacer.scrollHeight - container.clientHeight - container.scrollTop);
    const contentHeight = Number(canvas.getAttribute('data-content-height') || spacer.getAttribute('data-content-height') || 0);
    const scaledSpacerHeight = Number(spacer.getAttribute('data-scaled-spacer-height') || spacer.getBoundingClientRect().height || 0);
    return {
      footerReachable,
      endReachable,
      noBlankGap: bottomGap < Math.max(140, container.clientHeight * 0.35),
      canScroll: container.scrollHeight > container.clientHeight,
      contentHeight,
      scaledSpacerHeight,
      clientHeight: container.clientHeight,
      scrollHeight: container.scrollHeight,
    };
  })()`);
}

async function checkBuilderRightPanel(browser: Awaited<ReturnType<typeof chromium.launch>>, data: unknown, templateName: string, templateId: string) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await seed(page, data);
  await page.goto(`${BASE_URL}/builder`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForSelector('[data-testid="preview-panel-scroll-container"]', { timeout: 30000 });
  const result = await scrollAndMeasure(page, 'preview-panel-scroll-container');
  await page.screenshot({ path: path.join(SHOT_DIR, `${slug(templateName)}-${templateId}-right-panel-bottom.png`), fullPage: true });
  await context.close();
  return result;
}

async function checkFullscreen(browser: Awaited<ReturnType<typeof chromium.launch>>, data: unknown, templateName: string, templateId: string, viewport: 1440 | 1280 | 1024) {
  const context = await browser.newContext({ viewport: { width: Math.max(1440, viewport + 160), height: 1000 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await seed(page, data);
  await page.goto(`${BASE_URL}/preview?mode=desktop&viewport=${viewport}`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForSelector('[data-testid="desktop-preview-scroll-viewport"]', { timeout: 30000 });
  const result = await scrollAndMeasure(page, 'desktop-preview-scroll-viewport');
  if (viewport === 1440 || viewport === 1280) {
    await page.screenshot({ path: path.join(SHOT_DIR, `${slug(templateName)}-${templateId}-fullscreen-${viewport}-bottom.png`), fullPage: true });
  }
  await context.close();
  return result;
}

async function checkMobile(browser: Awaited<ReturnType<typeof chromium.launch>>, width: 390 | 375 | 320) {
  const data = siteDataFor(templateCatalog[0]);
  const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: true });
  const page = await context.newPage();
  await seed(page, data);
  await page.goto(`${BASE_URL}/preview?mode=mobile&viewport=${width}`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2000);
  const metrics = await page.evaluate(`(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }))()`) as { scrollWidth: number; clientWidth: number };
  await context.close();
  return metrics.scrollWidth <= metrics.clientWidth + 2;
}

async function main() {
  await mkdir(SHOT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const results: TemplateResult[] = [];
  const failedTemplates: string[] = [];
  let builderRightPanelPassed = 0;
  let fullscreen1440Passed = 0;
  let fullscreen1280Passed = 0;
  let fullscreen1024Passed = 0;

  const templatesToTest = process.env.QA_LIMIT ? templateCatalog.slice(0, Number(process.env.QA_LIMIT)) : templateCatalog;
  for (const template of templatesToTest) {
    const data = siteDataFor(template);
    const item: TemplateResult = {
      templateId: template.id,
      templateName: template.name,
      rightPanelFooterReachable: false,
      rightPanelNoBlankGap: false,
      fullscreen1440FooterReachable: false,
      fullscreen1280FooterReachable: false,
      fullscreen1024FooterReachable: false,
      contentHeight: 0,
      scaledSpacerHeight: 0,
    };
    try {
      item.rightPanel = await checkBuilderRightPanel(browser, data, template.name, template.id);
      item.fullscreen1440 = await checkFullscreen(browser, data, template.name, template.id, 1440);
      item.fullscreen1280 = await checkFullscreen(browser, data, template.name, template.id, 1280);
      item.fullscreen1024 = await checkFullscreen(browser, data, template.name, template.id, 1024);
      item.rightPanelFooterReachable = item.rightPanel.footerReachable || item.rightPanel.endReachable;
      item.rightPanelNoBlankGap = item.rightPanel.noBlankGap && item.rightPanel.contentHeight !== 900;
      item.fullscreen1440FooterReachable = item.fullscreen1440.footerReachable || item.fullscreen1440.endReachable;
      item.fullscreen1280FooterReachable = item.fullscreen1280.footerReachable || item.fullscreen1280.endReachable;
      item.fullscreen1024FooterReachable = item.fullscreen1024.footerReachable || item.fullscreen1024.endReachable;
      item.contentHeight = Math.max(item.rightPanel.contentHeight, item.fullscreen1440.contentHeight, item.fullscreen1280.contentHeight, item.fullscreen1024.contentHeight);
      item.scaledSpacerHeight = item.rightPanel.scaledSpacerHeight;
      if (item.rightPanelFooterReachable && item.rightPanelNoBlankGap && item.rightPanel.canScroll) builderRightPanelPassed += 1;
      if (item.fullscreen1440FooterReachable && item.fullscreen1440.canScroll && item.fullscreen1440.contentHeight !== 900) fullscreen1440Passed += 1;
      if (item.fullscreen1280FooterReachable && item.fullscreen1280.canScroll && item.fullscreen1280.contentHeight !== 900) fullscreen1280Passed += 1;
      if (item.fullscreen1024FooterReachable && item.fullscreen1024.canScroll && item.fullscreen1024.contentHeight !== 900) fullscreen1024Passed += 1;
    } catch (error) {
      item.error = error instanceof Error ? error.message : String(error);
    }
    const passed = item.rightPanelFooterReachable && item.rightPanelNoBlankGap && item.fullscreen1440FooterReachable && item.fullscreen1280FooterReachable && item.fullscreen1024FooterReachable;
    if (!passed) failedTemplates.push(`${template.name} (${template.id})`);
    results.push(item);
    console.log(`${passed ? 'PASS' : 'FAIL'} ${template.name}`);
  }

  const mobile390 = await checkMobile(browser, 390);
  const mobile375 = await checkMobile(browser, 375);
  const mobile320 = await checkMobile(browser, 320);
  await browser.close();

  const summary = {
    ok: failedTemplates.length === 0 && mobile390 && mobile375 && mobile320,
    baseUrl: BASE_URL,
    totalTemplates: templateCatalog.length,
    builderRightPanelPassed,
    fullscreen1440Passed,
    fullscreen1280Passed,
    fullscreen1024Passed,
    failed: failedTemplates.length,
    failedTemplates,
    mobile390,
    mobile375,
    mobile320,
    screenshotCountExpected: templateCatalog.length * 3,
    results,
  };
  await writeFile(path.join(OUT_DIR, 'desktop-preview-full-height-result.json'), JSON.stringify(summary, null, 2));
  await writeFile(path.join(OUT_DIR, 'desktop-preview-full-height-summary.md'), `# Desktop Preview Full Height QA\n\n- baseUrl: ${BASE_URL}\n- ok: ${summary.ok}\n- totalTemplates: ${summary.totalTemplates}\n- builderRightPanelPassed: ${builderRightPanelPassed}\n- fullscreen1440Passed: ${fullscreen1440Passed}\n- fullscreen1280Passed: ${fullscreen1280Passed}\n- fullscreen1024Passed: ${fullscreen1024Passed}\n- failed: ${failedTemplates.length}\n- failedTemplates: ${failedTemplates.join(', ') || '[]'}\n- mobile390: ${mobile390}\n- mobile375: ${mobile375}\n- mobile320: ${mobile320}\n`);
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
