import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { templateCatalog } from '../lib/templateCatalog';
import { createDefaultSiteData } from '../lib/defaultSiteData';
import { applyTemplatePresetSync } from '../lib/applyTemplatePreset';
import { getCurrentSkinFamily, getCurrentTemplateId } from '../lib/getCurrentTemplate';

const baseUrl = process.argv[2] || 'http://127.0.0.1:3220';
const artifactRoot = path.join(process.cwd(), 'qa-artifacts', 'v0.2.10');
const screenshotDir = path.join(artifactRoot, 'mobile-preview-not-poster');
const viewports = [390, 375, 320] as const;
fs.mkdirSync(screenshotDir, { recursive: true });

type CaseResult = {
  templateName: string;
  templateId: string;
  skinFamily: string;
  viewport: number;
  passed: boolean;
  checks: Record<string, boolean | number | string>;
  error?: string;
};

function slugName(index: number, id: string, viewport: number) {
  return `${String(index + 1).padStart(2, '0')}-${id}-${viewport}.png`;
}

function makeSession(template: (typeof templateCatalog)[number]) {
  const data = applyTemplatePresetSync(createDefaultSiteData(), template);
  const templateId = getCurrentTemplateId(data);
  const skinFamily = getCurrentSkinFamily(data);
  const sessionId = `qa-v0210-${Date.now().toString(36)}-${templateId}`;
  return {
    key: `store-site-builder-preview-session:${sessionId}`,
    sessionId,
    session: { sessionId, createdAt: Date.now(), siteData: data, templateId, skinFamily, source: 'builder' },
    data,
    templateId,
    skinFamily,
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results: CaseResult[] = [];
  for (let index = 0; index < templateCatalog.length; index += 1) {
    const template = templateCatalog[index];
    for (const viewport of viewports) {
      const { key, sessionId, session, data, templateId, skinFamily } = makeSession(template);
      const page = await browser.newPage({ viewport: { width: Math.max(980, viewport + 240), height: 1100 }, deviceScaleFactor: 1 });
      try {
        await page.addInitScript(({ key, session, data }) => {
          window.sessionStorage.setItem(key, JSON.stringify(session));
          window.localStorage.setItem(key, JSON.stringify(session));
          window.localStorage.setItem('store-site-builder-data', JSON.stringify(data));
        }, { key, session, data });
        await page.goto(`${baseUrl}/preview?sessionId=${encodeURIComponent(sessionId)}&templateId=${encodeURIComponent(templateId)}&mode=mobile&viewport=${viewport}`, { waitUntil: 'networkidle' });
        await page.waitForSelector('[data-testid="fullscreen-preview-shell"]', { timeout: 20000 });
        await page.waitForSelector('[data-testid="site-renderer"]', { timeout: 20000 });
        const checks = await page.evaluate<Record<string, boolean | number | string>>(`(() => {
          const expectedTemplateId = ${JSON.stringify(templateId)};
          const q = (selector) => document.querySelector(selector);
          const qa = (selector) => Array.from(document.querySelectorAll(selector));
          const hero = q('[data-skin-component="hero"]');
          const story = q('[data-skin-component="brand-story"]');
          const productCards = qa('[data-skin-component="product-card"]');
          const menuList = q('[data-skin-component="menu-list"]');
          const renderer = q('[data-testid="site-renderer"]');
          const artworkFrame = q('[data-testid="mobile-artwork-safe-frame"]');
          const artworkImg = q('[data-testid="mobile-artwork-image"]');
          const phone = q('[data-testid="preview-phone-viewport"]') || q('[data-testid="preview-canvas-viewport"]');
          const heroRect = hero ? hero.getBoundingClientRect() : null;
          const imgRect = artworkImg ? artworkImg.getBoundingClientRect() : null;
          const frameRect = artworkFrame ? artworkFrame.getBoundingClientRect() : null;
          const heroImgCount = hero ? hero.querySelectorAll('img').length : 0;
          const heroText = hero ? hero.innerText.trim() : '';
          const mode = artworkFrame ? (artworkFrame.getAttribute('data-mobile-artwork-mode') || '') : '';
          const rendererTemplateId = renderer ? (renderer.dataset.templateId || '') : '';
          const rendererSkinFamily = renderer ? (renderer.dataset.skinFamily || '') : '';
          const frameInsideHero = Boolean(hero && artworkFrame && hero.contains(artworkFrame));
          const imgNotLongPoster = Boolean(imgRect && heroRect && imgRect.height <= Math.min(heroRect.height * 0.72, 260) && imgRect.width <= heroRect.width + 1);
          const imgUsesCover = Boolean(artworkImg && getComputedStyle(artworkImg).objectFit === 'cover');
          const hasActualSections = Boolean(hero && story && productCards.length > 0 && menuList);
          return {
            rendererTemplateId,
            rendererSkinFamily,
            hasDataTemplateId: rendererTemplateId === expectedTemplateId,
            hasDataSkinFamily: Boolean(rendererSkinFamily),
            hasHero: Boolean(hero),
            hasBrandStory: Boolean(story),
            productCardCount: productCards.length,
            hasProductCard: productCards.length > 0,
            hasMenuList: Boolean(menuList),
            heroImgCount,
            heroHasContentText: heroText.length > 10,
            artworkMode: mode,
            noLegacyPosterMode: !['contain-poster', 'top-contain', 'center-contain', 'full-poster', 'contain-entire-template'].includes(mode),
            frameInsideHero,
            imgNotLongPoster,
            imgUsesCover,
            hasActualSections,
            phoneNoHorizontalOverflow: phone ? phone.scrollWidth <= phone.clientWidth + 2 : false,
          };
        })()`);
        await page.screenshot({ path: path.join(screenshotDir, slugName(index, template.id, viewport)), fullPage: true });
        const passed = Object.entries(checks).every(([key, value]) => {
          if (typeof value !== 'boolean') return true;
          return value;
        });
        results.push({ templateName: template.name, templateId, skinFamily, viewport, passed, checks });
      } catch (error) {
        results.push({ templateName: template.name, templateId, skinFamily, viewport, passed: false, checks: {}, error: error instanceof Error ? error.message : String(error) });
        await page.screenshot({ path: path.join(screenshotDir, slugName(index, template.id, `${viewport}-error` as unknown as number)), fullPage: true }).catch(() => {});
      } finally {
        await page.close();
      }
    }
  }
  await browser.close();
  const failedRows = results.filter((row) => !row.passed);
  const failedTemplates = Array.from(new Set(failedRows.map((row) => row.templateName)));
  const output = { ok: failedRows.length === 0, totalCases: templateCatalog.length * viewports.length, passed: results.length - failedRows.length, failed: failedRows.length, failedTemplates, results };
  fs.writeFileSync(path.join(artifactRoot, 'mobile-preview-not-poster-result.json'), JSON.stringify(output, null, 2));
  if (!output.ok) process.exit(1);
}

main().catch((error) => { console.error(error); process.exit(1); });
