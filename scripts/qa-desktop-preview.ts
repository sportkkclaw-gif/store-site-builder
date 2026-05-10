import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = (process.argv[2] || 'http://127.0.0.1:3202').replace(/\/$/, '');
const artifactRoot = path.join(process.cwd(), 'qa-artifacts', 'v0.2.2');
const screenshotDir = path.join(artifactRoot, 'desktop-preview');
const resultPath = path.join(artifactRoot, 'desktop-preview-result.json');

async function ensureDirs() {
  await fs.mkdir(screenshotDir, { recursive: true });
}

async function shot(page: any, filename: string) {
  await page.screenshot({ path: path.join(screenshotDir, filename), fullPage: true });
}

async function canvasWidth(page: any) {
  return await page.locator('[data-testid="fullscreen-preview-canvas"]').evaluate((el: Element) => Number((el as HTMLElement).dataset.viewportWidth || Math.round(el.getBoundingClientRect().width)));
}

async function clickByTestId(page: any, testId: string) {
  await page.locator(`[data-testid="${testId}"]`).click();
}

async function main() {
  await ensureDirs();
  const result: Record<string, unknown> = {
    ok: false,
    baseUrl,
    fullscreenButtonVisible: false,
    fullscreenButtonClickable: false,
    previewRouteWorks: false,
    backToBuilderWorks: false,
    viewport1440Works: false,
    viewport1280Works: false,
    viewport1024Works: false,
    viewport390Works: false,
    fitZoomWorks: false,
    zoom100Works: false,
    zoom75Works: false,
    zoom50Works: false,
    screenshots: [] as string[],
    errors: [] as string[],
  };
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  try {
    const builderResp = await page.goto(`${baseUrl}/builder`, { waitUntil: 'networkidle', timeout: 60_000 });
    result.builderStatus = builderResp?.status() || 0;
    const button = page.locator('[data-testid="fullscreen-preview-button"]');
    await button.waitFor({ state: 'visible', timeout: 15_000 });
    result.fullscreenButtonVisible = await button.isVisible();
    await shot(page, 'builder-preview-panel-with-fullscreen-button.png');
    (result.screenshots as string[]).push('builder-preview-panel-with-fullscreen-button.png');

    await button.click();
    result.fullscreenButtonClickable = true;
    await page.waitForURL(/\/preview/, { timeout: 15_000 });
    await page.locator('[data-testid="fullscreen-preview-shell"]').waitFor({ state: 'visible', timeout: 15_000 });
    result.previewRouteWorks = page.url().includes('/preview');
    result.fitZoomWorks = await page.locator('[data-testid="preview-zoom-fit"]').isVisible();

    await clickByTestId(page, 'preview-viewport-1440');
    await page.waitForTimeout(300);
    result.viewport1440Works = (await canvasWidth(page)) === 1440;
    await shot(page, 'preview-route-1440.png');
    (result.screenshots as string[]).push('preview-route-1440.png');

    await clickByTestId(page, 'preview-viewport-1280');
    await page.waitForTimeout(300);
    result.viewport1280Works = (await canvasWidth(page)) === 1280;
    await shot(page, 'preview-route-1280.png');
    (result.screenshots as string[]).push('preview-route-1280.png');

    await clickByTestId(page, 'preview-viewport-1024');
    await page.waitForTimeout(300);
    result.viewport1024Works = (await canvasWidth(page)) === 1024;
    await shot(page, 'preview-route-1024.png');
    (result.screenshots as string[]).push('preview-route-1024.png');

    await page.getByRole('button', { name: '手機' }).click();
    await clickByTestId(page, 'preview-viewport-390');
    await page.waitForTimeout(300);
    result.viewport390Works = (await canvasWidth(page)) === 390;
    await shot(page, 'preview-route-390.png');
    (result.screenshots as string[]).push('preview-route-390.png');

    await clickByTestId(page, 'preview-zoom-100');
    result.zoom100Works = (await page.locator('[data-testid="preview-zoom-100"]').getAttribute('class') || '').includes('active');
    await clickByTestId(page, 'preview-zoom-75');
    result.zoom75Works = (await page.locator('[data-testid="preview-zoom-75"]').getAttribute('class') || '').includes('active');
    await clickByTestId(page, 'preview-zoom-50');
    result.zoom50Works = (await page.locator('[data-testid="preview-zoom-50"]').getAttribute('class') || '').includes('active');
    await shot(page, 'preview-back-button.png');
    (result.screenshots as string[]).push('preview-back-button.png');

    await clickByTestId(page, 'preview-back-to-builder');
    await page.waitForURL(/\/builder/, { timeout: 15_000 });
    await page.locator('[data-testid="preview-panel"]').waitFor({ state: 'visible', timeout: 15_000 });
    result.backToBuilderWorks = page.url().includes('/builder');
    await shot(page, 'builder-after-back.png');
    (result.screenshots as string[]).push('builder-after-back.png');

    result.ok = Boolean(result.fullscreenButtonVisible && result.fullscreenButtonClickable && result.previewRouteWorks && result.backToBuilderWorks && result.viewport1440Works && result.viewport1280Works && result.viewport1024Works && result.viewport390Works && result.fitZoomWorks && result.zoom100Works && result.zoom75Works && result.zoom50Works);
  } catch (error) {
    (result.errors as string[]).push(error instanceof Error ? error.message : String(error));
  } finally {
    await browser.close();
    await fs.writeFile(resultPath, JSON.stringify(result, null, 2));
  }
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
