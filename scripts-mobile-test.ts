import { chromium } from 'playwright';

const results: Record<string, unknown> = {};

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  // Capture console errors
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  // --- Builder mobile test ---
  results.builder_url = 'http://127.0.0.1:3111/builder';
  await page.goto('http://127.0.0.1:3111/builder', { waitUntil: 'networkidle' });

  results.builder_title = await page.title();

  // Check mobile controls visible
  const mobileControls = await page.$('[data-testid="builder-mobile-controls"]');
  results.builder_mobileControlsVisible = mobileControls !== null;

  // Check edit/preview tabs
  const tabs = await page.$$('button[role="tab"]');
  results.builder_tabCount = tabs.length;
  const tabTexts = await Promise.all(tabs.map(t => t.textContent()));
  results.builder_tabTexts = tabTexts;

  // Check section select dropdown
  const sectionSelect = await page.$('select');
  results.builder_sectionSelectPresent = sectionSelect !== null;
  if (sectionSelect) {
    const options = await sectionSelect.$$('option');
    results.builder_sectionOptionsCount = options.length;
  }

  // Check scrollWidth vs innerWidth
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const innerWidth = await page.evaluate(() => window.innerWidth);
  results.builder_scrollWidth = scrollWidth;
  results.builder_innerWidth = innerWidth;
  results.builder_noHorizontalOverflow = scrollWidth <= innerWidth;

  // Click preview tab
  const previewTab = await page.$('button[role="tab"]:has-text("預覽")');
  if (previewTab) {
    await previewTab.click();
    await page.waitForTimeout(500);
  }

  // Check preview column visible in preview mode
  const previewColumn = await page.$('[data-testid="builder-preview-column"]');
  results.builder_previewColumnPresent = previewColumn !== null;

  // --- Offline generated site test ---
  const offlineHtmlPath = 'file:///home/sport/WORK/AGENTS/04_%E8%BC%B8%E5%87%BA/BARRY/store-site-builder/qa-artifacts/generated-site/index.html';
  results.offline_url = offlineHtmlPath;

  await page.goto(`file:///home/sport/WORK/AGENTS/04_%E8%BC%B8%E5%87%BA/BARRY/store-site-builder/qa-artifacts/generated-site/index.html`, { waitUntil: 'domcontentloaded' });

  results.offline_title = await page.title();

  const offlineScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const offlineInnerWidth = await page.evaluate(() => window.innerWidth);
  results.offline_scrollWidth = offlineScrollWidth;
  results.offline_innerWidth = offlineInnerWidth;
  results.offline_noHorizontalOverflow = offlineScrollWidth <= offlineInnerWidth;

  // Check body contains key content
  const bodyText = await page.evaluate(() => document.body.innerText);
  results.offline_contains_storeName = bodyText.includes('驗收測試茶館');
  results.offline_contains_product = bodyText.includes('驗收珍珠奶茶');
  results.offline_contains_storeInfo = bodyText.includes('門市資訊');

  // Console errors
  results.consoleErrors = consoleErrors;
  results.hasConsoleErrors = consoleErrors.length > 0;

  await browser.close();

  console.log(JSON.stringify(results, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); });
