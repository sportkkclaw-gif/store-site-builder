import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { chromium } from 'playwright';
import { defaultSiteData } from '../lib/defaultSiteData';
import { templateCatalog } from '../lib/templateCatalog';
import { applyTemplatePresetSync } from '../lib/applyTemplatePreset';
import { exportStaticSite } from '../lib/exportStaticSite';
import { FullSkinTemplate } from '../components/templates/FullSkinTemplate';
import type { SiteData } from '../types/site';

const outDir = path.resolve('qa-artifacts/v0.3.1');
const resultPath = path.join(outDir, 'template-nav-anchors-result.json');
const detailPath = path.join(outDir, 'template-nav-anchors-detail.json');

const targets = [
  { id: 'drink-matcha-hiyori', name: '抹茶日和' },
  { id: 'drink-boba-neon', name: '珍珠霓光' },
  { id: 'restaurant-rice-kitchen', name: '米香食堂' },
  { id: 'restaurant-fast-enjoy', name: '食尚快享' },
  { id: 'cafe-daily-corner', name: '日常一隅' },
];

const expectedAnchors = [
  { href: '#brand-story', sectionId: 'brand-story', testId: 'section-brand-story', label: '品牌故事' },
  { href: '#featured-products', sectionId: 'featured-products', testId: 'section-featured-products', label: '招牌商品' },
  { href: '#menu', sectionId: 'menu', testId: 'section-menu', label: '菜單' },
  { href: '#store-info', sectionId: 'store-info', testId: 'section-store-info', label: '門市' },
];

type ScopeResult = { ok: boolean; failures: string[] };
const failed: string[] = [];
const details: Record<string, unknown> = {};

function assert(condition: unknown, message: string, failures: string[]) {
  if (!condition) failures.push(message);
}

function templateData(templateId: string): SiteData {
  const template = templateCatalog.find(item => item.id === templateId);
  if (!template) throw new Error(`Template not found: ${templateId}`);
  return applyTemplatePresetSync({
    ...defaultSiteData,
    modules: {
      ...defaultSiteData.modules,
      brandStory: true,
      featuredProducts: true,
      menu: true,
      storeInfo: true,
    },
  }, template);
}

function renderPreviewHtml(data: SiteData) {
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${renderToStaticMarkup(React.createElement(FullSkinTemplate, { data }))}</body></html>`;
}

async function checkHtmlAnchors(html: string, templateName: string, scope: string, viewport: { width: number; height: number }): Promise<ScopeResult> {
  const failures: string[] = [];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport });
  const p = await context.newPage();
  try {
    await p.setContent(html, { waitUntil: 'domcontentloaded' });
    for (const anchor of expectedAnchors) {
      const link = p.locator(`.skin-nav a[href="${anchor.href}"]`).first();
      assert(await link.count() === 1, `${scope}/${templateName}: missing nav anchor ${anchor.href}`, failures);
      assert(await p.locator(`#${anchor.sectionId}`).count() === 1, `${scope}/${templateName}: missing section id ${anchor.sectionId}`, failures);
      assert(await p.getByTestId(anchor.testId).count() === 1, `${scope}/${templateName}: missing ${anchor.testId}`, failures);
      if (await link.count()) {
        await p.evaluate(() => window.scrollTo(0, 0));
        const beforeScroll = await p.evaluate(() => window.scrollY);
        await link.click();
        await p.waitForTimeout(450);
        const state = await p.evaluate((sectionId) => {
          const target = document.getElementById(sectionId);
          return {
            hash: window.location.hash,
            exists: Boolean(target),
            top: target ? target.getBoundingClientRect().top : null,
            scrollY: window.scrollY,
          };
        }, anchor.sectionId);
        assert(state.hash === anchor.href, `${scope}/${templateName}: click did not update hash ${anchor.href}`, failures);
        assert(state.exists && state.top !== null && (Math.abs(state.top) < 40 || state.scrollY > beforeScroll), `${scope}/${templateName}: target not reached or scrollTop unchanged ${anchor.sectionId}`, failures);
      }
    }
  } finally {
    await browser.close();
  }
  return { ok: failures.length === 0, failures };
}

function checkExportAnchors(html: string, templateName: string): ScopeResult {
  const failures: string[] = [];
  for (const anchor of expectedAnchors) {
    assert(html.includes(`href="${anchor.href}"`), `${templateName}: export missing href ${anchor.href}`, failures);
    assert(html.includes(`id="${anchor.sectionId}"`), `${templateName}: export missing id ${anchor.sectionId}`, failures);
    assert(html.includes(`data-testid="${anchor.testId}"`), `${templateName}: export missing ${anchor.testId}`, failures);
  }
  return { ok: failures.length === 0, failures };
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const perTemplate: Record<string, unknown> = {};

  for (const target of targets) {
    const data = templateData(target.id);
    const previewHtml = renderPreviewHtml(data);
    const exportHtml = exportStaticSite(data);
    const builderDesktop = await checkHtmlAnchors(previewHtml, target.name, 'builder-desktop', { width: 390, height: 720 });
    const builderMobile = await checkHtmlAnchors(previewHtml, target.name, 'builder-mobile', { width: 390, height: 720 });
    const fullscreenDesktop = await checkHtmlAnchors(previewHtml, target.name, 'fullscreen-desktop', { width: 1440, height: 900 });
    const fullscreenMobile = await checkHtmlAnchors(previewHtml, target.name, 'fullscreen-mobile', { width: 390, height: 844 });
    const exportCheck = checkExportAnchors(exportHtml, target.name);

    const templateFailures = [
      ...builderDesktop.failures,
      ...builderMobile.failures,
      ...fullscreenDesktop.failures,
      ...fullscreenMobile.failures,
      ...exportCheck.failures,
    ];
    if (templateFailures.length) failed.push(...templateFailures);
    perTemplate[target.name] = {
      builderDesktop,
      builderMobile,
      fullscreenDesktop,
      fullscreenMobile,
      exportCheck,
    };
  }

  const result = {
    ok: failed.length === 0,
    builderPreviewAnchorsWork: failed.filter(item => item.includes('builder-')).length === 0,
    fullscreenPreviewAnchorsWork: failed.filter(item => item.includes('fullscreen-')).length === 0,
    exportAnchorsExist: failed.filter(item => item.includes('export')).length === 0,
    testedTemplates: targets.length,
    failed,
  };
  details.templates = perTemplate;
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
  fs.writeFileSync(detailPath, JSON.stringify(details, null, 2));
  if (!result.ok) throw new Error(`template nav anchors QA failed: ${failed.join('; ')}`);
}

main().catch(error => {
  fs.mkdirSync(outDir, { recursive: true });
  const fallback = {
    ok: false,
    builderPreviewAnchorsWork: false,
    fullscreenPreviewAnchorsWork: false,
    exportAnchorsExist: false,
    testedTemplates: targets.length,
    failed: [error instanceof Error ? error.message : String(error)],
  };
  fs.writeFileSync(resultPath, JSON.stringify(fallback, null, 2));
  console.error(error);
  process.exit(1);
});
