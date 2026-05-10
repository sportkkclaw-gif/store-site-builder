import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = (process.argv[2] || 'http://127.0.0.1:3207').replace(/\/$/, '');
const artifactRoot = path.join(process.cwd(), 'qa-artifacts', 'v0.2.7');
const screenshotDir = path.join(artifactRoot, 'homepage');
const resultPath = path.join(artifactRoot, 'homepage-landing-result.json');

async function screenshotElement(page: any, selector: string, filename: string) {
  const locator = page.locator(selector).first();
  await locator.waitFor({ state: 'visible', timeout: 15_000 });
  await locator.screenshot({ path: path.join(screenshotDir, filename) });
}

async function noHorizontalOverflow(page: any) {
  return await page.evaluate(`(() => {
    const eps = 1;
    const doc = document.documentElement;
    const body = document.body;
    const bad = [];
    const insideIntentionalScroller = (el) => {
      let node = el.parentElement;
      while (node && node !== document.body) {
        const style = getComputedStyle(node);
        const className = String(node.className || '');
        if (style.overflowX === 'auto' || style.overflowX === 'scroll' || className.includes('overflow-x-auto')) return true;
        node = node.parentElement;
      }
      return false;
    };
    for (const el of Array.from(document.querySelectorAll('body *'))) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.left < -eps || r.right > window.innerWidth + eps)) {
        const style = getComputedStyle(el);
        if (style.position === 'fixed' || style.position === 'absolute' || insideIntentionalScroller(el)) continue;
        bad.push({ tag: el.tagName, text: (el.textContent || '').trim().slice(0, 80), left: r.left, right: r.right, width: r.width, className: String(el.className).slice(0, 120) });
      }
    }
    return {
      ok: doc.scrollWidth <= window.innerWidth + eps && body.scrollWidth <= window.innerWidth + eps && bad.length === 0,
      innerWidth: window.innerWidth,
      documentScrollWidth: doc.scrollWidth,
      bodyScrollWidth: body.scrollWidth,
      offenders: bad.slice(0, 10)
    };
  })()`);
}

async function main() {
  await fs.mkdir(screenshotDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const result: any = {
    ok: false,
    heroExists: false,
    ctaWorks: false,
    templateShowcaseExists: false,
    industrySectionsExist: false,
    zipExportSectionExists: false,
    mobile390NoOverflow: false,
    mobile375NoOverflow: false,
    mobile320NoOverflow: false,
    screenshots: [],
    checks: {},
    errors: [],
  };

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });
    try {
      await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle', timeout: 60_000 });
      result.heroExists = await page.getByText('30 分鐘建立小店家官方網站').isVisible();
      result.checks.heroEyebrow = await page.getByText('AI TEMPLATE WEBSITE BUILDER').isVisible();
      result.checks.heroSubtitle = await page.getByText('輸入店家資料、菜單、圖片與連結').isVisible();
      result.checks.startButtonExists = await page.getByTestId('home-start-builder').isVisible();
      result.checks.browseButtonExists = await page.getByTestId('home-browse-templates').isVisible();
      result.templateShowcaseExists = await page.getByText('30 套 AI 視覺模板，直接套用成品牌官網').isVisible();
      result.checks.templateCardsAtLeast12 = await page.locator('[data-testid="template-showcase"] article').count() >= 12;
      result.industrySectionsExist = (await page.getByText('飲料店').count()) > 0 && (await page.getByText('餐飲店').count()) > 0 && (await page.getByText('咖啡廳').count()) > 0;
      result.checks.builderPreviewExists = await page.getByText('從資料編輯到即時預覽，全部在同一個畫面完成').isVisible();
      result.checks.featureSectionExists = await page.getByText('為小店家設計的建站功能').isVisible();
      result.zipExportSectionExists = await page.getByText('匯出後就是一個可部署的靜態網站').isVisible();
      result.checks.targetsExist = await page.getByText('適合正在建立品牌官網的小店').isVisible();
      result.checks.finalCtaExists = await page.getByText('現在開始建立你的第一個小店官網').isVisible();
      result.checks.footerExists = await page.getByTestId('home-footer').isVisible();
      result.checks.noOldThreeTemplateNarrative = (await page.getByText('三種可商用模板方向').count()) === 0;
      result.checks.noSimpleSkeletonText = (await page.locator('text=skeleton').count()) === 0;

      await page.screenshot({ path: path.join(screenshotDir, 'home-desktop-full.png'), fullPage: true });
      result.screenshots.push('home-desktop-full.png');
      await screenshotElement(page, '[data-testid="home-hero"]', 'home-desktop-hero.png');
      result.screenshots.push('home-desktop-hero.png');
      await screenshotElement(page, '[data-testid="template-showcase"]', 'home-desktop-template-showcase.png');
      result.screenshots.push('home-desktop-template-showcase.png');
      await screenshotElement(page, '[data-testid="industry-sections"]', 'home-desktop-industries.png');
      result.screenshots.push('home-desktop-industries.png');
      await screenshotElement(page, '[data-testid="features-section"]', 'home-desktop-features.png');
      result.screenshots.push('home-desktop-features.png');
      await screenshotElement(page, '[data-testid="zip-export-section"]', 'home-desktop-export-section.png');
      result.screenshots.push('home-desktop-export-section.png');

      await page.getByTestId('home-browse-templates').click();
      await page.waitForTimeout(400);
      const showcaseTop = await page.locator('[data-testid="template-showcase"]').evaluate((el: Element) => el.getBoundingClientRect().top);
      result.checks.browseScrollWorks = Math.abs(showcaseTop) < 160;

      await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle', timeout: 60_000 });
      await page.getByTestId('home-start-builder').click();
      await page.waitForURL(/\/builder/, { timeout: 15_000 });
      result.ctaWorks = page.url().includes('/builder');
    } finally {
      await page.close();
    }

    for (const width of [390, 375, 320]) {
      const mobile = await browser.newPage({ viewport: { width, height: width === 320 ? 720 : width === 375 ? 812 : 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
      try {
        await mobile.goto(`${baseUrl}/`, { waitUntil: 'networkidle', timeout: 60_000 });
        const overflow = await noHorizontalOverflow(mobile);
        result.checks[`mobile${width}`] = overflow;
        result[`mobile${width}NoOverflow`] = overflow.ok;
        await mobile.screenshot({ path: path.join(screenshotDir, `home-mobile-${width}.png`), fullPage: true });
        result.screenshots.push(`home-mobile-${width}.png`);
        result.checks[`mobile${width}HeaderVisible`] = await mobile.getByTestId('home-header').isVisible();
        result.checks[`mobile${width}CtaVisible`] = await mobile.getByTestId('home-start-builder').isVisible();
      } finally {
        await mobile.close();
      }
    }

    const required = [
      result.heroExists,
      result.ctaWorks,
      result.templateShowcaseExists,
      result.industrySectionsExist,
      result.zipExportSectionExists,
      result.mobile390NoOverflow,
      result.mobile375NoOverflow,
      result.mobile320NoOverflow,
      result.checks.heroEyebrow,
      result.checks.browseButtonExists,
      result.checks.templateCardsAtLeast12,
      result.checks.builderPreviewExists,
      result.checks.featureSectionExists,
      result.checks.targetsExist,
      result.checks.finalCtaExists,
      result.checks.footerExists,
      result.checks.noOldThreeTemplateNarrative,
      result.checks.browseScrollWorks,
    ];
    result.ok = required.every(Boolean) && result.screenshots.length === 9;
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : String(error));
  } finally {
    await browser.close();
    await fs.writeFile(resultPath, JSON.stringify(result, null, 2));
  }

  console.log(JSON.stringify({
    ok: result.ok,
    heroExists: result.heroExists,
    ctaWorks: result.ctaWorks,
    templateShowcaseExists: result.templateShowcaseExists,
    industrySectionsExist: result.industrySectionsExist,
    zipExportSectionExists: result.zipExportSectionExists,
    mobile390NoOverflow: result.mobile390NoOverflow,
    mobile375NoOverflow: result.mobile375NoOverflow,
    mobile320NoOverflow: result.mobile320NoOverflow,
    screenshots: result.screenshots.length,
    errors: result.errors,
  }, null, 2));

  if (!result.ok) process.exit(1);
}

main().catch(error => { console.error(error); process.exit(1); });
