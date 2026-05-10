import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { exportStaticSite } from '../lib/exportStaticSite';
import { templateCatalog } from '../lib/templateCatalog';

const STORAGE_KEY = 'store-site-builder-data';
const PREVIEW_SESSION_KEY = 'store-site-builder-preview-data';
const baseUrl = (process.argv[2] || 'http://127.0.0.1:3206').replace(/\/$/, '');
const artifactRoot = path.join(process.cwd(), 'qa-artifacts', 'v0.2.6');
const screenshotDir = path.join(artifactRoot, 'mobile-hero-overflow');
const resultPath = path.join(artifactRoot, 'mobile-hero-overflow-all-result.json');
const viewports = [390, 375, 320] as const;

type ViewportWidth = typeof viewports[number];
type CatalogItem = typeof templateCatalog[number];

function safeSlug(value: string) {
  return value.replace(/[^a-zA-Z0-9-]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
}

function makeData(item: CatalogItem) {
  const mediaId = `template-artwork-${item.id}`;
  return {
    id: `qa-mobile-hero-${item.id}`,
    industry: item.industry,
    template: item.baseTemplate,
    galleryTemplateId: item.id,
    store: { name: `${item.name} 手機 Hero 驗收店`, tagline: '每天一杯，日常更美好', description: `${item.name} mobile hero overflow QA`, phone: '02-1234-5678', email: 'qa@example.com', address: '台北市 QA 路 26 號', businessHours: '每日 10:00 - 22:00' },
    theme: { primaryColor: '#0f766e', secondaryColor: '#f59e0b', backgroundColor: '#f8fafc', textColor: '#0f172a', fontFamily: 'sans', buttonStyle: 'pill', sectionRadius: 28, layoutDensity: 'comfortable' },
    hero: { title: '每天一杯，日常更美好', subtitle: '手機全螢幕預覽的副標可以自然換行，不能超出 Hero content panel。', imageId: mediaId, ctaText: '查看今日菜單', ctaUrl: '#menu' },
    menu: { categories: [{ id: 'signature', name: '招牌商品', description: 'QA mobile menu', items: [
      { id: 'p1', name: `${item.name} 招牌一號`, description: '手機版商品卡驗收', price: 120, featured: true },
      { id: 'p2', name: `${item.name} 招牌二號`, description: '手機版商品卡驗收', price: 135, featured: true },
    ] }] },
    media: [{ id: mediaId, name: `${item.name} 模板主視覺`, type: 'hero', mimeType: 'image/png', dataUrl: item.artworkSrc }],
    links: { line: 'https://line.me/', instagram: 'https://instagram.com/', facebook: '', threads: '', tiktok: '', googleMap: 'https://maps.google.com/', ubereats: '', foodpanda: '', orderForm: '', reservation: '' },
    seo: { title: `${item.name} 手機 Hero 驗收店`, description: `QA ${item.id}`, slug: `qa-${item.id}`, ogImageId: mediaId },
    modules: { hero: true, featuredProducts: true, menu: true, brandStory: true, storeInfo: true, map: true, faq: true, socialLinks: true, footer: true },
    faq: [{ question: 'Hero 是否不超出？', answer: item.id }],
    visual: { selectedTemplateId: item.id, layoutFamily: `${item.id}-layout`, backgroundMode: 'artwork', aiArtworkKey: item.id, heroTreatment: 'full-bleed-overlay', navStyle: 'floating', cardStyle: 'soft', styleLabel: `${item.name} / Mobile Hero QA`, templatePreset: { selectedTemplateId: item.id, layoutFamily: `${item.id}-layout`, backgroundMode: 'artwork', aiArtworkKey: item.id, heroTreatment: 'full-bleed-overlay', navStyle: 'floating', cardStyle: 'soft', styleLabel: `${item.name} / Mobile Hero QA` }, appliedAt: new Date().toISOString() },
  };
}

async function installData(page: any, data: unknown) {
  const value = JSON.stringify(data);
  await page.addInitScript(({ key, sessionKey, value }: { key: string; sessionKey: string; value: string }) => {
    window.localStorage.setItem(key, value);
    window.sessionStorage.setItem(sessionKey, value);
  }, { key: STORAGE_KEY, sessionKey: PREVIEW_SESSION_KEY, value });
}

async function measurePreview(page: any) {
  return await page.evaluate(`(() => {
    const eps = 1;
    const rect = (sel) => { const el = document.querySelector(sel); if (!el) return null; const r = el.getBoundingClientRect(); return { left:r.left, right:r.right, top:r.top, bottom:r.bottom, width:r.width, height:r.height }; };
    const canvasEl = document.querySelector('[data-testid="mobile-preview-canvas"]');
    const titleEl = document.querySelector('[data-testid="hero-title"]');
    const panelEl = document.querySelector('[data-testid="hero-content-panel"]');
    const ctaEl = document.querySelector('[data-testid="hero-cta-row"]');
    const subtitleEl = document.querySelector('[data-testid="hero-subtitle"]');
    const artworkEl = document.querySelector('.template-hero-backplate');
    const canvas = rect('[data-testid="mobile-preview-canvas"]');
    const title = rect('[data-testid="hero-title"]');
    const panel = rect('[data-testid="hero-content-panel"]');
    const cta = rect('[data-testid="hero-cta-row"]');
    const subtitle = rect('[data-testid="hero-subtitle"]');
    const artwork = rect('.template-hero-backplate');
    const inside = (child, parent) => !!child && !!parent && child.left + eps >= parent.left && child.right <= parent.right + eps;
    const lines = Array.from(document.querySelectorAll('.hero-title-line')).map((el) => (el.textContent || '').trim()).filter(Boolean);
    const lineCount = lines.length || (titleEl ? Math.max(1, Math.round(titleEl.getBoundingClientRect().height / parseFloat(getComputedStyle(titleEl).lineHeight || '1'))) : 0);
    const notSingleCharacterColumn = lines.length === 0 ? false : lines.some((line) => Array.from(line.replace(/[，、。\s]/g, '')).length > 1);
    const titleStyle = titleEl ? getComputedStyle(titleEl) : null;
    const panelStyle = panelEl ? getComputedStyle(panelEl) : null;
    return {
      bodyScrollWidth: document.documentElement.scrollWidth,
      bodyInnerWidth: window.innerWidth,
      canvasScrollWidth: canvasEl ? canvasEl.scrollWidth : 0,
      canvasClientWidth: canvasEl ? canvasEl.clientWidth : 0,
      titleLines: lines,
      lineCount,
      canvas, title, panel, cta, subtitle, artwork,
      bodyNoOverflow: document.documentElement.scrollWidth <= window.innerWidth + eps,
      canvasNoOverflow: canvasEl ? canvasEl.scrollWidth <= canvasEl.clientWidth + eps : false,
      heroTitleInsideCanvas: inside(title, canvas),
      panelInsideCanvas: inside(panel, canvas),
      ctaInsideCanvas: inside(cta, canvas),
      subtitleInsideCanvas: inside(subtitle, canvas),
      lineCountOk: lineCount <= 4,
      notSingleCharacterColumn,
      titleNotClipped: titleEl ? titleEl.scrollWidth <= titleEl.clientWidth + 2 && titleEl.scrollHeight <= titleEl.clientHeight + 16 : false,
      subtitleNotClipped: subtitleEl ? subtitleEl.scrollWidth <= subtitleEl.clientWidth + 2 : false,
      artworkVisible: !!artwork && artwork.width > 120 && artwork.height > 180 && !!artworkEl,
      css: { titleWhiteSpace: titleStyle?.whiteSpace, titleWordBreak: titleStyle?.wordBreak, titleOverflowWrap: titleStyle?.overflowWrap, panelMaxWidth: panelStyle?.maxWidth, panelWidth: panelStyle?.width }
    };
  })()`);
}

async function measureExport(browser: any, data: any, viewport: ViewportWidth) {
  const page = await browser.newPage({ viewport: { width: viewport, height: viewport === 320 ? 720 : viewport === 375 ? 812 : 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  try {
    const html = exportStaticSite(data as any);
    await page.setContent(html, { waitUntil: 'load' });
    return await page.evaluate(`(() => {
      const eps = 1;
      const root = document.querySelector('[data-testid="site-root"]');
      const title = document.querySelector('[data-testid="hero-title"]');
      const panel = document.querySelector('[data-testid="hero-content-panel"]');
      const cta = document.querySelector('[data-testid="hero-cta-row"]');
      const artwork = document.querySelector('.template-hero-backplate');
      const rect = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { left:r.left, right:r.right, width:r.width, height:r.height }; };
      const rootRect = rect(root); const titleRect = rect(title); const panelRect = rect(panel); const ctaRect = rect(cta); const artworkRect = rect(artwork);
      const inside = (child, parent) => !!child && !!parent && child.left + eps >= parent.left && child.right <= parent.right + eps;
      const lines = Array.from(document.querySelectorAll('.hero-title-line')).map((el) => (el.textContent || '').trim()).filter(Boolean);
      return {
        bodyNoOverflow: document.documentElement.scrollWidth <= window.innerWidth + eps,
        heroTitleInsideCanvas: inside(titleRect, rootRect),
        panelInsideCanvas: inside(panelRect, rootRect),
        ctaInsideCanvas: inside(ctaRect, rootRect),
        lineCountOk: lines.length <= 4,
        notSingleCharacterColumn: lines.some((line) => Array.from(line.replace(/[，、。\s]/g, '')).length > 1),
        artworkVisible: !!artworkRect && artworkRect.width > 120 && artworkRect.height > 180,
        titleLines: lines,
        root: rootRect, title: titleRect, panel: panelRect, cta: ctaRect, artwork: artworkRect
      };
    })()`);
  } finally {
    await page.close();
  }
}

function checksPass(checks: any) {
  return checks.bodyNoOverflow && checks.canvasNoOverflow !== false && checks.heroTitleInsideCanvas && checks.panelInsideCanvas && checks.ctaInsideCanvas && checks.lineCountOk && checks.notSingleCharacterColumn && checks.titleNotClipped !== false && checks.subtitleInsideCanvas !== false && checks.subtitleNotClipped !== false && checks.artworkVisible;
}

async function main() {
  await fs.mkdir(screenshotDir, { recursive: true });
  const templates = templateCatalog;
  const result: any = { ok: false, totalTemplates: templates.length, viewports: [...viewports], passed: 0, failed: 0, results: [], failedTemplates: [], errors: [] };
  const browser = await chromium.launch({ headless: true });
  try {
    for (const [index, item] of templates.entries()) {
      let templatePassed = true;
      const templateRows: any[] = [];
      for (const viewport of viewports) {
        const page = await browser.newPage({ viewport: { width: viewport, height: viewport === 320 ? 720 : viewport === 375 ? 812 : 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
        try {
          const data = makeData(item);
          await installData(page, data);
          await page.goto(`${baseUrl}/preview?mode=mobile&viewport=${viewport}`, { waitUntil: 'networkidle', timeout: 60_000 });
          await page.locator('[data-testid="mobile-preview-canvas"]').waitFor({ state: 'visible', timeout: 20_000 });
          await page.locator('[data-testid="hero-title"]').waitFor({ state: 'visible', timeout: 20_000 });
          const previewChecks = await measurePreview(page);
          const exportChecks = await measureExport(browser, data, viewport);
          const checks = {
            bodyNoOverflow: previewChecks.bodyNoOverflow && exportChecks.bodyNoOverflow,
            canvasNoOverflow: previewChecks.canvasNoOverflow,
            heroTitleInsideCanvas: previewChecks.heroTitleInsideCanvas && exportChecks.heroTitleInsideCanvas,
            panelInsideCanvas: previewChecks.panelInsideCanvas && exportChecks.panelInsideCanvas,
            ctaInsideCanvas: previewChecks.ctaInsideCanvas && exportChecks.ctaInsideCanvas,
            lineCountOk: previewChecks.lineCountOk && exportChecks.lineCountOk,
            notSingleCharacterColumn: previewChecks.notSingleCharacterColumn && exportChecks.notSingleCharacterColumn,
            titleNotClipped: previewChecks.titleNotClipped,
            subtitleInsideCanvas: previewChecks.subtitleInsideCanvas,
            subtitleNotClipped: previewChecks.subtitleNotClipped,
            artworkVisible: previewChecks.artworkVisible && exportChecks.artworkVisible,
            exportSynced: exportChecks.bodyNoOverflow && exportChecks.heroTitleInsideCanvas && exportChecks.panelInsideCanvas && exportChecks.ctaInsideCanvas,
          };
          const passed = checksPass(checks);
          const filename = `${String(index + 1).padStart(2, '0')}-${safeSlug(item.id)}-${viewport}.png`;
          await page.screenshot({ path: path.join(screenshotDir, filename), fullPage: true });
          const row = { templateName: item.name, templateId: item.id, viewport, passed, checks, preview: previewChecks, export: exportChecks, screenshot: filename };
          templateRows.push(row);
          result.results.push(row);
          if (!passed) templatePassed = false;
        } catch (error) {
          templatePassed = false;
          const row = { templateName: item.name, templateId: item.id, viewport, passed: false, error: error instanceof Error ? error.message : String(error) };
          templateRows.push(row);
          result.results.push(row);
          result.errors.push(row);
        } finally {
          await page.close();
        }
      }
      if (templatePassed) result.passed += 1;
      else {
        result.failed += 1;
        result.failedTemplates.push({ templateName: item.name, templateId: item.id, rows: templateRows.filter(r => !r.passed) });
      }
    }
    result.ok = result.totalTemplates === 30 && result.passed === 30 && result.failed === 0 && result.results.length === 90;
  } finally {
    await browser.close();
    await fs.writeFile(resultPath, JSON.stringify(result, null, 2));
  }
  console.log(JSON.stringify({ ok: result.ok, totalTemplates: result.totalTemplates, viewports: result.viewports, passed: result.passed, failed: result.failed, screenshots: result.results.filter((r: any) => r.screenshot).length, failedTemplates: result.failedTemplates.map((t: any) => t.templateName) }, null, 2));
  if (!result.ok) process.exit(1);
}

main().catch(error => { console.error(error); process.exit(1); });
