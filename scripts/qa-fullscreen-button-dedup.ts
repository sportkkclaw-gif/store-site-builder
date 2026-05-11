import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const baseUrl = process.argv[2] || 'http://127.0.0.1:3220';
const artifactRoot = path.join(process.cwd(), 'qa-artifacts', 'v0.2.10');
fs.mkdirSync(artifactRoot, { recursive: true });

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  let result = {
    ok: false,
    visibleFullscreenButtonsInMobileBuilder: 0,
    blackLegacyButtonRemoved: false,
    greenButtonVisible: false,
    greenButtonClickable: false,
    tapNavigatesToPreview: false,
    noFullscreenButtonInsidePreview: false,
    backToBuilderVisible: false,
  };

  try {
    await page.goto(`${baseUrl}/builder`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: '預覽' }).click({ timeout: 20000 });
    await page.waitForSelector('[data-testid="builder-preview-column"]', { timeout: 20000 });
    const buttons = page.locator('button:visible').filter({ hasText: /^全螢幕預覽$/ });
    const testIdButtons = page.locator('[data-testid="fullscreen-preview-button"]:visible');
    const visibleTextCount = await buttons.count();
    const visibleTestIdCount = await testIdButtons.count();
    const count = Math.max(visibleTextCount, visibleTestIdCount);
    const button = testIdButtons.first();
    const box = await button.boundingBox();
    const styles = await button.evaluate((el) => {
      const cs = getComputedStyle(el as HTMLElement);
      return { backgroundColor: cs.backgroundColor, pointerEvents: cs.pointerEvents, minHeight: cs.minHeight, height: (el as HTMLElement).getBoundingClientRect().height };
    });
    const enabled = await button.isEnabled();
    result.visibleFullscreenButtonsInMobileBuilder = count;
    result.blackLegacyButtonRemoved = count === 1 && !(await page.locator('.mobile-fullscreen-preview-button:visible').count());
    result.greenButtonVisible = count === 1 && /rgb\(15, 118, 110\)|rgb\(13, 148, 136\)|rgb\(20, 184, 166\)/.test(styles.backgroundColor);
    result.greenButtonClickable = enabled && Boolean(box && box.height >= 48) && styles.pointerEvents !== 'none';
    await button.click();
    await page.waitForURL(/\/preview\?/, { timeout: 20000 });
    await page.waitForSelector('[data-testid="fullscreen-preview-shell"]', { timeout: 20000 });
    result.tapNavigatesToPreview = page.url().includes('/preview?');
    result.noFullscreenButtonInsidePreview = (await page.locator('button:visible').filter({ hasText: /^全螢幕預覽$/ }).count()) === 0 && (await page.locator('[data-testid="fullscreen-preview-button"]:visible').count()) === 0;
    result.backToBuilderVisible = await page.locator('[data-testid="preview-back-to-builder"]:visible').isVisible();
    result.ok = Object.entries(result).every(([key, value]) => {
      if (key === 'ok') return true;
      return key === 'visibleFullscreenButtonsInMobileBuilder' ? value === 1 : value === true;
    });
  } finally {
    fs.writeFileSync(path.join(artifactRoot, 'fullscreen-button-dedup-result.json'), JSON.stringify(result, null, 2));
    await page.screenshot({ path: path.join(artifactRoot, 'fullscreen-button-dedup.png'), fullPage: true }).catch(() => {});
    await browser.close();
  }
  if (!result.ok) process.exit(1);
}

main().catch((error) => { console.error(error); process.exit(1); });
