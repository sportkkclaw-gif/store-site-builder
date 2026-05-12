import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const baseUrl = process.argv[2] || 'http://127.0.0.1:3220';
const artifactRoot = path.join(process.cwd(), 'qa-artifacts', 'v0.2.12');
const screenshotDir = path.join(artifactRoot, 'desktop-preview-full-height');
const resultPath = path.join(artifactRoot, 'desktop-preview-full-height-result.json');
fs.mkdirSync(screenshotDir, { recursive: true });

function shot(name: string) {
  return path.join(screenshotDir, name);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
  const result = {
    ok: false,
    baseUrl,
    mode: '',
    canvasHeight: 0,
    siteRootScrollHeight: 0,
    rendererScrollHeight: 0,
    previewStageMinHeight: 0,
    desktopWindowScrollHeight: 0,
    desktopWindowClientHeight: 0,
    desktopWindowCanScroll: false,
    footerVisibleAfterScroll: false,
    heroArtworkVisible: false,
    lowerContentNotClipped: false,
  };

  try {
    await page.goto(`${baseUrl}/builder`, { waitUntil: 'networkidle', timeout: 45000 });
    const previewTab = page.getByRole('button', { name: '預覽', exact: true }).first();
    if (await previewTab.isVisible({ timeout: 3000 }).catch(() => false)) await previewTab.click();
    await page.getByRole('button', { name: '桌機', exact: true }).click().catch(() => {});
    await page.waitForSelector('[data-testid="desktop-preview-canvas"]', { state: 'attached', timeout: 25000 });
    await page.waitForFunction(`(() => {
      const canvas = document.querySelector('[data-testid="desktop-preview-canvas"]');
      const root = document.querySelector('[data-testid="site-root"]');
      return Boolean(canvas && root && canvas.scrollHeight >= root.scrollHeight && root.scrollHeight > 1600);
    })()`, null, { timeout: 25000 });
    await page.screenshot({ path: shot('desktop-preview-top.png'), fullPage: false });

    const metrics = await page.evaluate(`(() => {
      const canvas = document.querySelector('[data-testid="desktop-preview-canvas"]');
      const stage = document.querySelector('[data-testid="preview-stage"]');
      const root = document.querySelector('[data-testid="site-root"]');
      const renderer = document.querySelector('[data-testid="site-renderer"]');
      const heroImg = document.querySelector('.template-hero-backplate');
      const win = document.querySelector('.desktop-preview-window');
      const canvasRect = canvas?.getBoundingClientRect();
      const heroRect = heroImg?.getBoundingClientRect();
      return {
        mode: canvas?.getAttribute('data-mode') || '',
        canvasHeight: canvasRect?.height || 0,
        canvasScrollHeight: canvas?.scrollHeight || 0,
        siteRootScrollHeight: root?.scrollHeight || 0,
        rendererScrollHeight: renderer?.scrollHeight || 0,
        previewStageMinHeight: parseFloat(getComputedStyle(stage).minHeight || '0'),
        desktopWindowScrollHeight: win?.scrollHeight || 0,
        desktopWindowClientHeight: win?.clientHeight || 0,
        heroArtworkVisible: Boolean(heroImg && heroRect && heroRect.width > 300 && heroRect.height > 200),
      };
    })()`);
    Object.assign(result, metrics);

    await page.evaluate(`(() => {
      const win = document.querySelector('.desktop-preview-window');
      const wrapper = document.querySelector('[data-testid="preview-scale-wrapper"]');
      const root = document.querySelector('[data-testid="site-root"]');
      const matrix = wrapper ? new DOMMatrixReadOnly(getComputedStyle(wrapper).transform) : null;
      const scale = matrix?.a || 1;
      if (win && root) win.scrollTop = Math.max(0, root.scrollHeight * scale - win.clientHeight + 120);
    })()`);
    await page.waitForTimeout(600);
    await page.screenshot({ path: shot('desktop-preview-bottom-after-scroll.png'), fullPage: false });
    const bottomMetrics = await page.evaluate(`(() => {
      const win = document.querySelector('.desktop-preview-window');
      const footer = document.querySelector('.skin-footer');
      const rect = footer?.getBoundingClientRect();
      return {
        desktopWindowCanScroll: Boolean(win && win.scrollHeight > win.clientHeight + 80),
        footerVisibleAfterScroll: Boolean(rect && rect.top < window.innerHeight && rect.bottom > 0 && rect.width > 300 && rect.height > 24),
      };
    })()`);
    Object.assign(result, bottomMetrics);
    result.lowerContentNotClipped = result.canvasHeight > 600 && result.rendererScrollHeight >= result.siteRootScrollHeight && result.siteRootScrollHeight > 1680;
    result.ok = result.mode === 'desktop' && result.heroArtworkVisible && result.lowerContentNotClipped && result.desktopWindowCanScroll && result.footerVisibleAfterScroll;
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
