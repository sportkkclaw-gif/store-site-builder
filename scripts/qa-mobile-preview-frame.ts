import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = (process.argv[2] || 'http://127.0.0.1:3214').replace(/\/$/, '');
const artifactRoot = path.join(process.cwd(), 'qa-artifacts', 'v0.2.8');
const screenshotDir = path.join(artifactRoot, 'mobile-preview-frame');
const resultPath = path.join(artifactRoot, 'mobile-preview-frame-result.json');
const viewports = [390, 375, 320] as const;

type Row = Record<string, unknown>;

async function measure(page: any) {
  return await page.evaluate(`(() => {
    const eps = 1;
    const q = (s) => document.querySelector(s);
    const rect = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { left:r.left, right:r.right, top:r.top, bottom:r.bottom, width:r.width, height:r.height, scrollWidth:el.scrollWidth, clientWidth:el.clientWidth, overflowX:getComputedStyle(el).overflowX, display:getComputedStyle(el).display }; };
    const canvasEl = q('[data-testid="mobile-preview-canvas"]');
    const phoneViewport = q('[data-testid="preview-phone-viewport"]');
    const title = q('[data-testid="hero-title"]');
    const panel = q('[data-testid="hero-content-panel"]');
    const canvas = rect(canvasEl);
    const viewport = rect(phoneViewport);
    const titleRect = rect(title);
    const panelRect = rect(panel);
    const inside = (child, parent) => !!child && !!parent && child.left + eps >= parent.left && child.right <= parent.right + eps;
    const offenders = [];
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.left < -1 || r.right > innerWidth + 1)) offenders.push({ tag: el.tagName, className: String(el.className || ''), testid: el.getAttribute('data-testid'), left: r.left, right: r.right, width: r.width });
    });
    const titleLines = Array.from(document.querySelectorAll('.hero-title-line')).map((el) => (el.textContent || '').trim()).filter(Boolean);
    return {
      url: location.href,
      innerWidth,
      docScrollWidth: document.documentElement.scrollWidth,
      bodyNoOverflow: document.documentElement.scrollWidth <= innerWidth + eps,
      canvas, viewport, title: titleRect, panel: panelRect,
      canvasVisible: !!canvas && canvas.width > 180 && canvas.height >= 560,
      phoneViewportFixedHeight: !!viewport && viewport.height >= 560 && viewport.height <= 844,
      canvasNoHorizontalOverflow: canvasEl ? canvasEl.scrollWidth <= canvasEl.clientWidth + eps : false,
      phoneViewportNoHorizontalOverflow: phoneViewport ? phoneViewport.scrollWidth <= phoneViewport.clientWidth + eps : false,
      titleInsideCanvas: inside(titleRect, canvas),
      panelInsideCanvas: inside(panelRect, canvas),
      titleLines,
      lineCountOk: titleLines.length > 0 && titleLines.length <= 4,
      offenders: offenders.slice(0, 20)
    };
  })()`);
}

function pass(m: any) {
  return m.bodyNoOverflow && m.canvasVisible && m.phoneViewportFixedHeight && m.canvasNoHorizontalOverflow && m.phoneViewportNoHorizontalOverflow && m.titleInsideCanvas && m.panelInsideCanvas && m.lineCountOk && m.offenders.length === 0;
}

async function main() {
  await fs.mkdir(screenshotDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const result: any = { ok: false, baseUrl, viewports: [...viewports], rows: [], errors: [] };
  try {
    for (const width of viewports) {
      const height = width === 320 ? 720 : width === 375 ? 812 : 844;
      const page = await browser.newPage({ viewport: { width, height }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
      try {
        await page.goto(`${baseUrl}/builder`, { waitUntil: 'networkidle', timeout: 60_000 });
        await page.getByRole('button', { name: '預覽' }).first().click();
        await page.waitForSelector('[data-testid="mobile-preview-canvas"]', { timeout: 20_000 });
        const builder = await measure(page);
        await page.screenshot({ path: path.join(screenshotDir, `builder-mobile-preview-${width}.png`), fullPage: true });

        await page.locator('[data-testid="mobile-fullscreen-preview-button"]').tap({ timeout: 10_000 });
        await page.waitForURL(/\/preview\?mode=mobile/, { timeout: 20_000 });
        await page.waitForSelector('[data-testid="fullscreen-preview-shell"]', { timeout: 20_000 });
        await page.waitForSelector('[data-testid="mobile-preview-canvas"]', { timeout: 20_000 });
        const fullscreen = await measure(page);
        await page.screenshot({ path: path.join(screenshotDir, `fullscreen-mobile-preview-${width}.png`), fullPage: true });
        const row: Row = { viewport: width, builder, fullscreen, passed: pass(builder) && pass(fullscreen) };
        result.rows.push(row);
      } catch (error) {
        result.errors.push({ viewport: width, error: error instanceof Error ? error.message : String(error) });
        result.rows.push({ viewport: width, passed: false, error: error instanceof Error ? error.message : String(error) });
      } finally {
        await page.close();
      }
    }
    result.ok = result.rows.length === viewports.length && result.rows.every((row: any) => row.passed === true);
  } finally {
    await browser.close();
    await fs.writeFile(resultPath, JSON.stringify(result, null, 2));
  }
  console.log(JSON.stringify({ ok: result.ok, rows: result.rows.map((r: any) => ({ viewport: r.viewport, passed: r.passed })), errors: result.errors, resultPath, screenshotDir }, null, 2));
  if (!result.ok) process.exit(1);
}

main().catch(error => { console.error(error); process.exit(1); });
