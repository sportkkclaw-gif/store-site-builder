import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { templateCatalog } from '../lib/templateCatalog';
import { createDefaultSiteData } from '../lib/defaultSiteData';
import { applyTemplatePresetSync } from '../lib/applyTemplatePreset';
import { createPreviewSession } from '../lib/previewSession';
import { getCurrentTemplateId } from '../lib/getCurrentTemplate';

const baseUrl = process.argv[2] || 'http://127.0.0.1:3220';
const artifactRoot = path.join(process.cwd(), 'qa-artifacts', 'v0.2.10');
const screenshotDir = path.join(artifactRoot, 'mobile-artwork-fill');
const viewports = [390, 375, 320] as const;
fs.mkdirSync(screenshotDir, { recursive: true });

type Result = {
  templateName: string;
  viewport: number;
  artworkFrameWidth: number;
  canvasWidth: number;
  artworkFrameWidthRatio: number;
  passed: boolean;
  checks: Record<string, boolean | number | string>;
  error?: string;
};

function shotName(index: number, id: string, viewport: number) {
  return `${String(index + 1).padStart(2, '0')}-${id}-${viewport}.png`;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results: Result[] = [];

  for (let index = 0; index < templateCatalog.length; index += 1) {
    const template = templateCatalog[index];
    const data = applyTemplatePresetSync(createDefaultSiteData(), template);
    const templateId = getCurrentTemplateId(data);
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport: { width: viewport, height: viewport === 320 ? 720 : viewport === 375 ? 812 : 844 }, isMobile: true });
      try {
        const sessionId = `qa-fill-${template.id}-${viewport}`;
        const session = { ...createPreviewSession(data), sessionId, createdAt: Date.now() };
        const key = `store-site-builder-preview-session:${sessionId}`;
        await page.addInitScript(({ key, session, data }) => {
          window.sessionStorage.setItem(key, JSON.stringify(session));
          window.localStorage.setItem(key, JSON.stringify(session));
          window.localStorage.setItem('store-site-builder-data', JSON.stringify(data));
        }, { key, session, data });
        await page.goto(`${baseUrl}/preview?sessionId=${encodeURIComponent(sessionId)}&templateId=${encodeURIComponent(templateId)}&mode=mobile&viewport=${viewport}`, { waitUntil: 'networkidle' });
        await page.waitForSelector('[data-testid="fullscreen-preview-shell"]', { timeout: 20000 });
        await page.waitForSelector('[data-testid="mobile-artwork-safe-frame"]', { timeout: 20000 });
        const checks = await page.evaluate<Record<string, boolean | number | string>>(`(() => {
          const expectedTemplateId = ${JSON.stringify(templateId)};
          const q = (selector) => document.querySelector(selector);
          const renderer = q('[data-testid="site-renderer"]');
          const canvas = q('[data-testid="preview-phone-viewport"]') || q('[data-testid="mobile-preview-canvas"]');
          const stage = q('[data-testid="mobile-hero-artwork-stage"]');
          const frame = q('[data-testid="mobile-artwork-safe-frame"]');
          const img = q('[data-testid="mobile-artwork-image"]');
          const heroTitle = q('[data-testid="hero-title"]');
          const cta = q('[data-testid="hero-cta-row"]');
          const cr = canvas ? canvas.getBoundingClientRect() : null;
          const sr = stage ? stage.getBoundingClientRect() : null;
          const fr = frame ? frame.getBoundingClientRect() : null;
          const ir = img ? img.getBoundingClientRect() : null;
          const tr = heroTitle ? heroTitle.getBoundingClientRect() : null;
          const ctar = cta ? cta.getBoundingClientRect() : null;
          const inside = (r) => Boolean(r && cr && r.left >= cr.left - 1 && r.right <= cr.right + 1);
          const frameWidth = fr ? fr.width : 0;
          const canvasWidth = cr ? cr.width : 0;
          const ratio = canvasWidth ? frameWidth / canvasWidth : 0;
          return {
            rendererTemplateId: renderer ? (renderer.dataset.templateId || '') : '',
            exportSynced: renderer ? (renderer.dataset.templateId || '') === expectedTemplateId : false,
            mobileArtworkStageVisible: Boolean(stage && sr && sr.width > 0 && sr.height > 0),
            artworkFrameInsideCanvas: inside(fr),
            artworkFrameWidth: Number(frameWidth.toFixed(3)),
            canvasWidth: Number(canvasWidth.toFixed(3)),
            artworkFrameWidthRatio: Number(ratio.toFixed(3)),
            artworkFrameRatioGte090: ratio >= 0.90,
            artworkFrameRatioLte100: ratio <= 1.00,
            artworkImageInsideFrame: Boolean(ir && fr && ir.left >= fr.left - 1 && ir.right <= fr.right + 1 && ir.top >= fr.top - 1 && ir.bottom <= fr.bottom + 1),
            noHorizontalOverflow: canvas ? canvas.scrollWidth <= canvas.clientWidth + 2 : false,
            heroTitleInsideCanvas: inside(tr),
            ctaInsideCanvas: inside(ctar),
            notPosterShrunkTooSmall: ratio >= 0.90,
            mode: frame ? frame.getAttribute('data-mobile-artwork-mode') || '' : '',
          };
        })()`);
        await page.screenshot({ path: path.join(screenshotDir, shotName(index, template.id, viewport)), fullPage: true });
        const passed = Object.entries(checks).every(([, value]) => typeof value !== 'boolean' || value);
        results.push({ templateName: template.name, viewport, artworkFrameWidth: Number(checks.artworkFrameWidth), canvasWidth: Number(checks.canvasWidth), artworkFrameWidthRatio: Number(checks.artworkFrameWidthRatio), passed, checks });
      } catch (error) {
        results.push({ templateName: template.name, viewport, artworkFrameWidth: 0, canvasWidth: viewport, artworkFrameWidthRatio: 0, passed: false, checks: {}, error: error instanceof Error ? error.message : String(error) });
        await page.screenshot({ path: path.join(screenshotDir, shotName(index, template.id, viewport)), fullPage: true }).catch(() => {});
      } finally {
        await page.close();
      }
    }
  }
  await browser.close();
  const failed = results.filter((row) => !row.passed);
  const output = { ok: failed.length === 0, totalTemplates: templateCatalog.length, viewports: [...viewports], totalCases: templateCatalog.length * viewports.length, passed: results.length - failed.length, failed: failed.length, results };
  fs.writeFileSync(path.join(artifactRoot, 'mobile-artwork-fill-result.json'), JSON.stringify(output, null, 2));
  if (!output.ok) process.exit(1);
}

main().catch((error) => { console.error(error); process.exit(1); });
