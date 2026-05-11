import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { exportStaticSite } from '../lib/exportStaticSite';
import { templateCatalog } from '../lib/templateCatalog';

const STORAGE_KEY = 'store-site-builder-data';
const PREVIEW_SESSION_KEY = 'store-site-builder-preview-data';
const baseUrl = (process.argv[2] || 'http://127.0.0.1:3217').replace(/\/$/, '');
const artifactRoot = path.join(process.cwd(), 'qa-artifacts', 'v0.2.9');
const screenshotDir = path.join(artifactRoot, 'mobile-artwork-containment-live');
const resultPath = path.join(artifactRoot, 'mobile-artwork-containment-live-result.json');
const summaryPath = path.join(artifactRoot, 'mobile-artwork-containment-live-summary.md');
const zipPath = path.join(artifactRoot, 'mobile-artwork-containment-live-artifacts.zip');
const viewports = [390, 375, 320] as const;

type ViewportWidth = typeof viewports[number];
type CatalogItem = typeof templateCatalog[number];

function safeSlug(value: string) {
  return value.replace(/[^a-zA-Z0-9-]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
}

function makeData(item: CatalogItem) {
  const mediaId = `template-artwork-${item.id}`;
  return {
    id: `qa-mobile-artwork-${item.id}`,
    industry: item.industry,
    template: item.baseTemplate,
    galleryTemplateId: item.id,
    store: { name: `${item.name} Artwork 驗收店`, tagline: '每天一杯，日常更美好', description: `${item.name} mobile artwork containment QA`, phone: '02-1234-5678', email: 'qa@example.com', address: '台北市 QA 路 27 號', businessHours: '每日 10:00 - 22:00' },
    theme: { primaryColor: '#0f766e', secondaryColor: '#f59e0b', backgroundColor: '#f8fafc', textColor: '#0f172a', fontFamily: 'sans', buttonStyle: 'pill', sectionRadius: 28, layoutDensity: 'comfortable' },
    hero: { title: '每天一杯，日常更美好', subtitle: '手機版 artwork 必須完整、安全、不左右外溢，文字與 CTA 也要留在手機畫布內。', imageId: mediaId, ctaText: '查看今日菜單', ctaUrl: '#menu' },
    menu: { categories: [{ id: 'signature', name: '招牌商品', description: 'QA mobile menu', items: [
      { id: 'p1', name: `${item.name} 招牌一號`, description: '手機版商品卡驗收', price: 120, featured: true },
      { id: 'p2', name: `${item.name} 招牌二號`, description: '手機版商品卡驗收', price: 135, featured: true },
    ] }] },
    media: [{ id: mediaId, name: `${item.name} 模板主視覺`, type: 'hero', mimeType: 'image/png', dataUrl: item.artworkSrc }],
    links: { line: 'https://line.me/', instagram: 'https://instagram.com/', facebook: '', threads: '', tiktok: '', googleMap: 'https://maps.google.com/', ubereats: '', foodpanda: '', orderForm: '', reservation: '' },
    seo: { title: `${item.name} Artwork 驗收店`, description: `QA ${item.id}`, slug: `qa-${item.id}`, ogImageId: mediaId },
    modules: { hero: true, featuredProducts: true, menu: true, brandStory: true, storeInfo: true, map: true, faq: true, socialLinks: true, footer: true },
    faq: [{ question: 'Artwork 是否不超出？', answer: item.id }],
    visual: { selectedTemplateId: item.id, layoutFamily: `${item.id}-layout`, backgroundMode: 'artwork', aiArtworkKey: item.id, heroTreatment: 'full-bleed-overlay', navStyle: 'floating', cardStyle: 'soft', styleLabel: `${item.name} / Mobile Artwork QA`, templatePreset: { selectedTemplateId: item.id, layoutFamily: `${item.id}-layout`, backgroundMode: 'artwork', aiArtworkKey: item.id, heroTreatment: 'full-bleed-overlay', navStyle: 'floating', cardStyle: 'soft', styleLabel: `${item.name} / Mobile Artwork QA` }, appliedAt: new Date().toISOString() },
  };
}

async function installData(page: any, data: unknown) {
  const value = JSON.stringify(data);
  await page.addInitScript(({ key, sessionKey, value }: { key: string; sessionKey: string; value: string }) => {
    window.localStorage.setItem(key, value);
    window.sessionStorage.setItem(sessionKey, value);
  }, { key: STORAGE_KEY, sessionKey: PREVIEW_SESSION_KEY, value });
}

async function measureContainment(page: any, context: 'builder' | 'preview' | 'export') {
  return await page.evaluate(`(() => {
    const eps = 1;
    const q = (s) => document.querySelector(s);
    const rect = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { left:r.left, right:r.right, top:r.top, bottom:r.bottom, width:r.width, height:r.height, scrollWidth:el.scrollWidth || 0, clientWidth:el.clientWidth || 0 }; };
    const root = q('[data-testid="site-root"]');
    const canvasEl = q('[data-testid="mobile-preview-canvas"]') || root;
    const hero = q('[data-testid="site-hero"]');
    const frameEl = q('[data-testid="mobile-artwork-safe-frame"]');
    const imgEl = q('[data-testid="mobile-artwork-image"]');
    const titleEl = q('[data-testid="hero-title"]');
    const panelEl = q('[data-testid="mobile-hero-content-panel"]') || q('[data-testid="hero-content-panel"]');
    const subtitleEl = q('[data-testid="hero-subtitle"]');
    const ctaEl = q('[data-testid="hero-cta-row"]');
    const canvas = rect(canvasEl);
    const heroRect = rect(hero);
    const frame = rect(frameEl);
    const image = rect(imgEl);
    const title = rect(titleEl);
    const panel = rect(panelEl);
    const subtitle = rect(subtitleEl);
    const cta = rect(ctaEl);
    const inside = (child, parent) => !!child && !!parent && child.left + eps >= parent.left && child.right <= parent.right + eps;
    const computed = imgEl ? getComputedStyle(imgEl) : null;
    const transform = computed?.transform || 'none';
    const marginLeft = parseFloat(computed?.marginLeft || '0') || 0;
    const marginRight = parseFloat(computed?.marginRight || '0') || 0;
    const left = parseFloat(computed?.left || '0') || 0;
    const mode = frameEl?.getAttribute('data-mobile-artwork-mode') || '';
    const decorative = Array.from(document.querySelectorAll('[data-decoration="true"]')).map((el) => rect(el)).filter(Boolean);
    const decorativeLayersInsideHero = decorative.every((r) => inside(r, heroRect));
    const bodyNoOverflow = document.documentElement.scrollWidth <= window.innerWidth + eps && document.body.scrollWidth <= window.innerWidth + eps;
    const canvasNoOverflow = canvasEl ? canvasEl.scrollWidth <= canvasEl.clientWidth + eps : false;
    const artworkFrameInsideCanvas = inside(frame, canvas);
    const artworkImageInsideFrame = inside(image, frame);
    const noNegativeHorizontalArtworkOffset = !!image && !!frame && image.left + eps >= frame.left && image.right <= frame.right + eps && marginLeft >= 0 && marginRight >= 0 && left >= 0;
    const heroTitleInsideCanvas = inside(title, canvas);
    const ctaInsideCanvas = inside(cta, canvas);
    const subtitleInsideCanvas = inside(subtitle, canvas);
    const textPanelInsideCanvas = inside(panel, canvas);
    const titleNotClipped = !!titleEl && titleEl.scrollHeight <= titleEl.clientHeight + 4 && titleEl.scrollWidth <= titleEl.clientWidth + 4;
    const titleText = titleEl?.innerText || '';
    const titleLines = titleText.split(String.fromCharCode(10)).map((line) => line.trim()).filter(Boolean);
    const notSingleCharacterColumn = titleLines.every((line) => Array.from(line).length > 1) && (title?.width || 0) >= 120;
    const artworkVisible = !!image && image.width >= 96 && image.height >= 120;
    const imageVisibleEnough = artworkVisible;
    const safeMode = ['contain-poster','top-contain','center-contain','background-soft','cropped-window','safe-cover'].includes(mode);
    return {
      context: '${context}',
      innerWidth: window.innerWidth,
      bodyScrollWidth: document.documentElement.scrollWidth,
      canvas, hero: heroRect, artworkFrame: frame, artworkImage: image, title, subtitle, panel, cta,
      mode,
      objectFit: computed?.objectFit || '',
      objectPosition: computed?.objectPosition || '',
      transform, marginLeft, marginRight, left,
      bodyNoOverflow,
      canvasNoOverflow,
      artworkFrameInsideCanvas,
      artworkImageInsideFrame,
      noNegativeHorizontalArtworkOffset,
      decorativeLayersInsideHero,
      heroTitleInsideCanvas,
      ctaInsideCanvas,
      titleNotClipped,
      subtitleInsideCanvas,
      textPanelInsideCanvas,
      notSingleCharacterColumn,
      artworkVisible,
      imageVisibleEnough,
      safeMode,
      checksOk: bodyNoOverflow && canvasNoOverflow && artworkFrameInsideCanvas && artworkImageInsideFrame && noNegativeHorizontalArtworkOffset && decorativeLayersInsideHero && heroTitleInsideCanvas && titleNotClipped && subtitleInsideCanvas && ctaInsideCanvas && textPanelInsideCanvas && notSingleCharacterColumn && artworkVisible && safeMode
    };
  })()`);
}

async function measureBuilder(browser: any, data: any, viewport: ViewportWidth) {
  const page = await browser.newPage({ viewport: { width: viewport, height: viewport === 320 ? 720 : viewport === 375 ? 812 : 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  try {
    await installData(page, data);
    await page.goto(`${baseUrl}/builder`, { waitUntil: 'networkidle', timeout: 60_000 });
    await page.getByRole('button', { name: '預覽' }).first().click({ timeout: 20_000 });
    await page.waitForSelector('[data-testid="mobile-preview-canvas"]', { timeout: 20_000 });
    await page.waitForSelector('[data-testid="mobile-artwork-safe-frame"]', { timeout: 20_000 });
    return await measureContainment(page, 'builder');
  } finally {
    await page.close();
  }
}

async function measurePreview(browser: any, data: any, viewport: ViewportWidth, screenshotPath: string) {
  const page = await browser.newPage({ viewport: { width: viewport, height: viewport === 320 ? 720 : viewport === 375 ? 812 : 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  try {
    await installData(page, data);
    await page.goto(`${baseUrl}/preview?mode=mobile&viewport=${viewport}`, { waitUntil: 'networkidle', timeout: 60_000 });
    await page.waitForSelector('[data-testid="mobile-preview-canvas"]', { timeout: 20_000 });
    await page.waitForSelector('[data-testid="mobile-artwork-safe-frame"]', { timeout: 20_000 });
    const result = await measureContainment(page, 'preview');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    return result;
  } finally {
    await page.close();
  }
}

async function measureExport(browser: any, data: any, viewport: ViewportWidth) {
  const page = await browser.newPage({ viewport: { width: viewport, height: viewport === 320 ? 720 : viewport === 375 ? 812 : 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  try {
    const fallbackSrc = typeof data?.media?.[0]?.dataUrl === 'string' && data.media[0].dataUrl.startsWith('/') ? `${baseUrl}${data.media[0].dataUrl}` : data?.media?.[0]?.dataUrl;
    const html = exportStaticSite(data as any).replace(/src="assets\/template-artwork-[^"]+"/g, `src="${fallbackSrc}"`);
    await page.setContent(html, { waitUntil: 'load' });
    await page.waitForSelector('[data-testid="mobile-artwork-safe-frame"]', { timeout: 10_000 });
    return await measureContainment(page, 'export');
  } finally {
    await page.close();
  }
}

async function main() {
  await fs.mkdir(screenshotDir, { recursive: true });
  const templates = templateCatalog;
  const versionResponse = await fetch(`${baseUrl}/__version`);
  const versionHtml = await versionResponse.text();
  const versionText = versionHtml.replace(/<[^>]+>/g, ' ');
  const version = versionText.match(/\"version\":\s*\"([^\"]+)\"/)?.[1] || '';
  const commit = versionText.match(/\"commit\":\s*\"([^\"]+)\"/)?.[1] || '';
  const branch = versionText.match(/\"branch\":\s*\"([^\"]+)\"/)?.[1] || '';
  const deployment = versionText.match(/\"deployment\":\s*\"([^\"]+)\"/)?.[1] || '';
  const result: any = { ok: false, source: 'vercel-preview', baseUrl: `${baseUrl}/`, version, commit, branch, deployment, totalTemplates: templates.length, viewports: [...viewports], totalCases: templates.length * viewports.length, passed: 0, failed: 0, failedTemplates: [], results: [], errors: [] };
  const browser = await chromium.launch({ headless: true });
  try {
    for (const [index, item] of templates.entries()) {
      for (const viewport of viewports) {
        const data = makeData(item);
        const filename = `${String(index + 1).padStart(2, '0')}-${safeSlug(item.id)}-${viewport}-live.png`;
        try {
          const screenshotPath = path.join(screenshotDir, filename);
          const preview = await measurePreview(browser, data, viewport, screenshotPath);
          const builder = await measureBuilder(browser, data, viewport);
          const exported = await measureExport(browser, data, viewport);
          const checks = {
            bodyNoOverflow: preview.bodyNoOverflow && builder.bodyNoOverflow && exported.bodyNoOverflow,
            canvasNoOverflow: preview.canvasNoOverflow && builder.canvasNoOverflow && exported.canvasNoOverflow,
            artworkFrameInsideCanvas: preview.artworkFrameInsideCanvas && builder.artworkFrameInsideCanvas && exported.artworkFrameInsideCanvas,
            artworkImageInsideFrame: preview.artworkImageInsideFrame && builder.artworkImageInsideFrame && exported.artworkImageInsideFrame,
            noNegativeHorizontalArtworkOffset: preview.noNegativeHorizontalArtworkOffset && builder.noNegativeHorizontalArtworkOffset && exported.noNegativeHorizontalArtworkOffset,
            decorativeLayersInsideHero: preview.decorativeLayersInsideHero && builder.decorativeLayersInsideHero && exported.decorativeLayersInsideHero,
            heroTitleInsideCanvas: preview.heroTitleInsideCanvas && builder.heroTitleInsideCanvas && exported.heroTitleInsideCanvas,
            ctaInsideCanvas: preview.ctaInsideCanvas && builder.ctaInsideCanvas && exported.ctaInsideCanvas,
            titleNotClipped: preview.titleNotClipped && builder.titleNotClipped && exported.titleNotClipped,
            subtitleInsideCanvas: preview.subtitleInsideCanvas && builder.subtitleInsideCanvas && exported.subtitleInsideCanvas,
            notSingleCharacterColumn: preview.notSingleCharacterColumn && builder.notSingleCharacterColumn && exported.notSingleCharacterColumn,
            artworkVisible: preview.artworkVisible && builder.artworkVisible && exported.artworkVisible,
            exportSynced: exported.checksOk,
          };
          const passed = Object.values(checks).every(Boolean);
          if (passed) result.passed += 1;
          else result.failed += 1;
          const row = { templateName: item.name, templateId: item.id, viewport, passed, checks, preview, builder, export: exported, screenshot: filename };
          result.results.push(row);
          if (!passed) result.failedTemplates.push({ templateName: item.name, templateId: item.id, viewport, checks });
        } catch (error) {
          result.failed += 1;
          const row = { templateName: item.name, templateId: item.id, viewport, passed: false, error: error instanceof Error ? error.message : String(error), screenshot: filename };
          result.results.push(row);
          result.failedTemplates.push(row);
          result.errors.push(row);
        }
      }
    }
    const exportSyncedCount = result.results.filter((row: any) => row.checks?.exportSynced).length;
    result.exportSynced = exportSyncedCount;
    result.ok = result.source === 'vercel-preview' && result.version === 'v0.2.9' && result.commit === 'f70842bc7b036d5738c5933ba22a6b50b3a11de4' && result.branch === 'acceptance/store-site-builder-mvp' && result.totalTemplates === 30 && result.totalCases === 90 && result.passed === 90 && result.failed === 0 && exportSyncedCount === 90;
    if (!result.ok && result.failed === 0) result.errors.push({ message: 'metadata/exportSynced gate failed', version: result.version, commit: result.commit, branch: result.branch, exportSynced: exportSyncedCount });
  } finally {
    await browser.close();
    await fs.writeFile(resultPath, JSON.stringify(result, null, 2));
    const summary = `# v0.2.9 Mobile Artwork Containment Live QA\n\n- source: ${result.source}\n- baseUrl: ${result.baseUrl}\n- version: ${result.version}\n- commit: ${result.commit}\n- branch: ${result.branch}\n- totalTemplates: ${result.totalTemplates}\n- viewports: ${result.viewports.join(', ')}\n- totalCases: ${result.totalCases}\n- passed: ${result.passed}\n- failed: ${result.failed}\n- failedTemplates: ${JSON.stringify(result.failedTemplates)}\n- errors: ${JSON.stringify(result.errors)}\n- exportSynced: ${result.exportSynced}/90\n- screenshots: 90\n`;
    await fs.writeFile(summaryPath, summary);
  }
  console.log(JSON.stringify({ ok: result.ok, source: result.source, baseUrl: result.baseUrl, version: result.version, commit: result.commit, branch: result.branch, totalTemplates: result.totalTemplates, viewports: result.viewports, totalCases: result.totalCases, passed: result.passed, failed: result.failed, failedTemplates: result.failedTemplates.map((t: any) => `${t.templateName}-${t.viewport}`), errors: result.errors, exportSynced: result.exportSynced, resultPath, summaryPath, screenshotDir, zipPath }, null, 2));
  if (!result.ok) process.exit(1);
}

main().catch(error => { console.error(error); process.exit(1); });
