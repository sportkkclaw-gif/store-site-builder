import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { templateCatalog } from '../lib/templateCatalog';
import { createDefaultSiteData } from '../lib/defaultSiteData';
import { applyTemplatePresetSync } from '../lib/applyTemplatePreset';
import { getCurrentSkinFamily, getCurrentTemplateId } from '../lib/getCurrentTemplate';

const baseUrl = process.argv[2] || 'http://127.0.0.1:3220';
const artifactRoot = path.join(process.cwd(), 'qa-artifacts', 'v0.2.10');
const screenshotDir = path.join(artifactRoot, 'preview-session-binding');
fs.mkdirSync(screenshotDir, { recursive: true });

type Row = {
  templateName: string;
  builderTemplateId: string;
  previewTemplateId: string;
  builderSkinFamily: string;
  previewSkinFamily: string;
  matched: boolean;
  sessionId: string;
  urlHasSessionId: boolean;
  urlHasTemplateId: boolean;
  error?: string;
};

function shot(index: number, id: string, suffix: string) {
  return path.join(screenshotDir, `${String(index + 1).padStart(2, '0')}-${id}-${suffix}.png`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results: Row[] = [];

  for (let index = 0; index < templateCatalog.length; index += 1) {
    const template = templateCatalog[index];
    const seeded = applyTemplatePresetSync(createDefaultSiteData(), template);
    const expectedTemplateId = getCurrentTemplateId(seeded);
    const expectedSkinFamily = getCurrentSkinFamily(seeded);
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
    try {
      await page.addInitScript((data) => {
        window.localStorage.setItem('store-site-builder-data', JSON.stringify(data));
      }, seeded);
      await page.goto(`${baseUrl}/builder`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('[data-testid="site-renderer"]', { timeout: 20000 });
      await page.waitForFunction((id) => document.querySelector('[data-testid="site-renderer"]')?.getAttribute('data-template-id') === id, expectedTemplateId, { timeout: 20000 });
      const builderMeta = await page.evaluate(() => {
        const renderer = document.querySelector('[data-testid="site-renderer"]') as HTMLElement | null;
        return {
          templateId: renderer?.dataset.templateId || '',
          skinFamily: renderer?.dataset.skinFamily || '',
        };
      });
      await page.screenshot({ path: shot(index, template.id, 'builder-selected'), fullPage: false });
      await page.click('[data-testid="fullscreen-preview-button"]');
      await page.waitForURL(/\/preview\?/, { timeout: 20000 });
      await page.waitForSelector('[data-testid="fullscreen-preview-shell"]', { timeout: 20000 });
      await page.waitForFunction((id) => document.querySelector('[data-testid="site-renderer"]')?.getAttribute('data-template-id') === id, expectedTemplateId, { timeout: 20000 });
      const previewMeta = await page.evaluate(() => {
        const renderer = document.querySelector('[data-testid="site-renderer"]') as HTMLElement | null;
        const stage = document.querySelector('.fullscreen-preview-stage') as HTMLElement | null;
        const session = document.querySelector('[data-testid="fullscreen-preview-session-id"]') as HTMLElement | null;
        return {
          rendererTemplateId: renderer?.dataset.templateId || '',
          rendererSkinFamily: renderer?.dataset.skinFamily || '',
          stageTemplateId: stage?.dataset.templateId || '',
          stageSkinFamily: stage?.dataset.skinFamily || '',
          sessionId: session?.textContent?.trim() || '',
          bodyText: document.body.innerText,
        };
      });
      await page.screenshot({ path: shot(index, template.id, 'preview-opened'), fullPage: false });
      const url = new URL(page.url());
      const previewTemplateId = previewMeta.rendererTemplateId || previewMeta.stageTemplateId;
      const previewSkinFamily = previewMeta.rendererSkinFamily || previewMeta.stageSkinFamily;
      const urlHasSessionId = Boolean(url.searchParams.get('sessionId'));
      const urlHasTemplateId = url.searchParams.get('templateId') === expectedTemplateId;
      const notWrongMatcha = expectedTemplateId === 'drink-matcha-hiyori' || !previewMeta.bodyText.includes('抹茶日和') || previewTemplateId === expectedTemplateId;
      const matched = builderMeta.templateId === expectedTemplateId && previewTemplateId === expectedTemplateId && builderMeta.skinFamily === previewSkinFamily && builderMeta.skinFamily === expectedSkinFamily && urlHasSessionId && urlHasTemplateId && notWrongMatcha;
      results.push({ templateName: template.name, builderTemplateId: builderMeta.templateId, previewTemplateId, builderSkinFamily: builderMeta.skinFamily, previewSkinFamily, matched, sessionId: previewMeta.sessionId, urlHasSessionId, urlHasTemplateId });
    } catch (error) {
      results.push({ templateName: template.name, builderTemplateId: expectedTemplateId, previewTemplateId: '', builderSkinFamily: expectedSkinFamily, previewSkinFamily: '', matched: false, sessionId: '', urlHasSessionId: false, urlHasTemplateId: false, error: error instanceof Error ? error.message : String(error) });
      await page.screenshot({ path: shot(index, template.id, 'error'), fullPage: false }).catch(() => {});
    } finally {
      await page.close();
    }
  }
  await browser.close();
  const failedTemplates = results.filter((r) => !r.matched).map((r) => r.templateName);
  const output = { ok: failedTemplates.length === 0, totalTemplates: templateCatalog.length, passed: templateCatalog.length - failedTemplates.length, failed: failedTemplates.length, failedTemplates, results };
  fs.writeFileSync(path.join(artifactRoot, 'preview-session-binding-all-result.json'), JSON.stringify(output, null, 2));
  if (!output.ok) process.exit(1);
}

main().catch((error) => { console.error(error); process.exit(1); });
