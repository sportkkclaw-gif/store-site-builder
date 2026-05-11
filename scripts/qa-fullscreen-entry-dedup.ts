import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const baseUrl = process.argv[2] || 'http://127.0.0.1:3220';
const artifactRoot = path.join(process.cwd(), 'qa-artifacts', 'v0.2.10');
const screenshotDir = path.join(artifactRoot, 'fullscreen-entry-dedup');
const resultPath = path.join(artifactRoot, 'fullscreen-entry-dedup-result.json');
fs.mkdirSync(screenshotDir, { recursive: true });

function shot(name: string) {
  return path.join(screenshotDir, name);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const result = {
    ok: false,
    visibleFullscreenButtonCount: 0,
    buttonClickable: false,
    tapNavigatesToPreview: false,
    noFullscreenButtonInsidePreview: false,
    backToBuilderVisible: false,
  };

  try {
    await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    const previewTab = page.getByRole('button', { name: '預覽', exact: true }).first();
    await previewTab.waitFor({ state: 'visible', timeout: 20000 });
    await previewTab.click();
    await page.waitForSelector('[data-testid="builder-preview-column"]', { state: 'attached', timeout: 25000 });

    await page.waitForFunction(`(() => {
      const button = document.querySelector('[data-testid="fullscreen-preview-button"]');
      if (!button) return false;
      const rect = button.getBoundingClientRect();
      return rect.width > 0 && rect.height >= 44;
    })()`, null, { timeout: 25000 });
    const visibleCounts = await page.evaluate<{ textCount: number; testIdCount: number }>(`(() => {
      const isVisible = (el) => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
      };
      const textCount = Array.from(document.querySelectorAll('button')).filter((el) => isVisible(el) && el.textContent?.trim() === '全螢幕預覽').length;
      const testIdCount = Array.from(document.querySelectorAll('[data-testid="fullscreen-preview-button"]')).filter(isVisible).length;
      return { textCount, testIdCount };
    })()`);
    result.visibleFullscreenButtonCount = Math.max(visibleCounts.textCount, visibleCounts.testIdCount);

    const button = page.locator('[data-testid="fullscreen-preview-button"]').first();
    const box = await button.boundingBox();
    const styles = await button.evaluate((el) => {
      const cs = getComputedStyle(el as HTMLElement);
      const rect = (el as HTMLElement).getBoundingClientRect();
      return { pointerEvents: cs.pointerEvents, touchAction: cs.touchAction, height: rect.height };
    });
    result.buttonClickable =
      result.visibleFullscreenButtonCount === 1 &&
      (await button.isEnabled()) &&
      Boolean(box && box.height >= 44) &&
      styles.height >= 44 &&
      styles.pointerEvents !== 'none';

    await page.screenshot({ path: shot('mobile-builder-one-fullscreen-button.png'), fullPage: false });
    await button.click();
    await page.waitForURL(/\/preview\?/, { timeout: 25000 });
    await page.waitForSelector('[data-testid="fullscreen-preview-shell"]', { timeout: 25000 });
    result.tapNavigatesToPreview = page.url().includes('/preview?');
    await page.screenshot({ path: shot('mobile-preview-after-tap.png'), fullPage: false });

    result.noFullscreenButtonInsidePreview =
      (await page.locator('button:visible').filter({ hasText: /^全螢幕預覽$/ }).count()) === 0 &&
      (await page.locator('[data-testid="fullscreen-preview-button"]').evaluateAll((elements) => elements.filter((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        const style = getComputedStyle(el as HTMLElement);
        return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
      }).length)) === 0;
    await page.screenshot({ path: shot('preview-no-fullscreen-button.png'), fullPage: false });

    result.backToBuilderVisible = await page.locator('[data-testid="preview-back-to-builder"]:visible').isVisible();
    await page.screenshot({ path: shot('preview-back-to-builder.png'), fullPage: false });

    result.ok =
      result.visibleFullscreenButtonCount === 1 &&
      result.buttonClickable &&
      result.tapNavigatesToPreview &&
      result.noFullscreenButtonInsidePreview &&
      result.backToBuilderVisible;
  } finally {
    fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
    await browser.close();
  }

  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
