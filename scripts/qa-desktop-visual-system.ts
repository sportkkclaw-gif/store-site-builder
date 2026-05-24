console.log('[desktop-visual-qa] script-start');
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { chromium } from 'playwright';
import { templateCatalog } from '../lib/templateCatalog';
import { defaultSiteData } from '../lib/defaultSiteData';
import { applyTemplatePresetSync } from '../lib/applyTemplatePreset';
import { exportStaticSite } from '../lib/exportStaticSite';
import { FullSkinTemplate } from '../components/templates/FullSkinTemplate';
import type { SiteData } from '../types/site';

const outDir = path.resolve('qa-artifacts/v0.3.1/desktop-visual-system');
const screenshotDir = path.join(outDir, 'screenshots');
const resultPath = path.resolve('qa-artifacts/v0.3.1/desktop-visual-system-result.json');
const detailPath = path.resolve('qa-artifacts/v0.3.1/desktop-visual-system-detail.json');

function publicImageFileUrl(src: string) {
  const clean = src.replace(/^\//, '');
  const file = path.join(process.cwd(), 'public', clean.replace(/^public\//, '')).replaceAll(String.fromCharCode(92), '/');
  return 'file:///' + file;
}
const targetIds = [
  'drink-matcha-hiyori', 'drink-boba-neon', 'drink-fruit-paradise', 'drink-brown-sugar-amber', 'drink-white-peach-sparkle',
  'drink-lime-morning', 'drink-tea-mist-ridge', 'drink-iced-party', 'drink-afternoon-cream', 'drink-lab-brew',
  'restaurant-charcoal-essence', 'restaurant-rice-kitchen', 'restaurant-golden-banquet', 'restaurant-corner-meal', 'restaurant-spicy-market',
  'restaurant-sunday-shokudo', 'restaurant-kitchen-overture', 'restaurant-brunch-garden', 'restaurant-hotpot-home', 'restaurant-fast-enjoy',
  'cafe-nordic-morning', 'cafe-midnight-roast', 'cafe-cream-library', 'cafe-forest-teatime', 'cafe-window-seat',
  'cafe-mocha-studio', 'cafe-white-dripper', 'cafe-caramel-afternoon', 'cafe-urban-monochrome', 'cafe-daily-corner',
] as const;

type Metric = {
  heroWidth: number;
  heroHeight: number;
  imageWidth: number;
  imageHeight: number;
  imageInsideHero: boolean;
  heroNotBroken: boolean;
  imageSafe: boolean;
  backgroundRendered: boolean;
  sectionsStyled: boolean;
  ctaVisible: boolean;
  navVisible: boolean;
  objectFit: string;
  objectPosition: string;
  horizontalOverflow: boolean;
};

function dataFor(templateId: string): SiteData {
  const template = templateCatalog.find(item => item.id === templateId);
  if (!template) throw new Error(`Template not found: ${templateId}`);
  return applyTemplatePresetSync({
    ...defaultSiteData,
    modules: {
      ...defaultSiteData.modules,
      hero: true,
      brandStory: true,
      featuredProducts: true,
      menu: true,
      storeInfo: true,
      footer: true,
    },
  }, template);
}

function withFilePublic(html: string) {
  const re = new RegExp('(src|srcSet|srcset)=\\"(\/template-gallery-ai\/[^\\"]+)\\"', 'g');
  return html.replace(re, (_match, attr, src) => {
    return `${attr}="${publicImageFileUrl(src)}"`;
  });
}

function previewHtml(data: SiteData) {
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${renderToStaticMarkup(React.createElement(FullSkinTemplate, { data }))}</body></html>`;
}

async function measure(page: any): Promise<Metric> {
  await page.waitForSelector('[data-testid="site-hero"]', { timeout: 10000 });
  await page.waitForTimeout(120);
  return page.evaluate(`(() => {
    const hero = document.querySelector('[data-testid="site-hero-inner"]');
    const heroSection = document.querySelector('[data-testid="site-hero"]');
    const img = document.querySelector('.template-hero-backplate');
    const section = document.querySelector('.skin-section');
    const cta = document.querySelector('[data-testid="hero-cta-row"] .skin-btn');
    const nav = document.querySelector('.skin-nav nav');
    const h = hero.getBoundingClientRect();
    const i = img.getBoundingClientRect();
    const csHero = getComputedStyle(hero);
    const csHeroSection = getComputedStyle(heroSection);
    const csImg = getComputedStyle(img);
    const csSection = getComputedStyle(section);
    const imageInsideHero = i.left >= h.left - 2 && i.top >= h.top - 2 && i.right <= h.right + 2 && i.bottom <= h.bottom + 2;
    const heroNotBroken = h.width >= 1080 && h.width <= 1288 && h.height >= 500 && h.height <= 760;
    const imageSafe = i.width >= h.width * .30 && i.height >= 360 && i.height <= h.height + 2 && imageInsideHero;
    const backgroundRendered = csHero.backgroundImage !== 'none' && csHero.backgroundImage.includes('gradient') && csHeroSection.backgroundImage !== 'none';
    const sectionsStyled = csSection.backgroundImage !== 'none' && parseFloat(csSection.borderRadius) >= 20 && csSection.boxShadow !== 'none';
    return {
      heroWidth: Math.round(h.width),
      heroHeight: Math.round(h.height),
      imageWidth: Math.round(i.width),
      imageHeight: Math.round(i.height),
      imageInsideHero,
      heroNotBroken,
      imageSafe,
      backgroundRendered,
      sectionsStyled,
      ctaVisible: !!cta && cta.getBoundingClientRect().width > 20 && cta.getBoundingClientRect().height > 20,
      navVisible: !!nav && getComputedStyle(nav).display !== 'none',
      objectFit: csImg.objectFit,
      objectPosition: csImg.objectPosition,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 2,
    };
  })()`);
}

async function loadHtml(page: any, html: string, viewport: { width: number; height: number }, name = 'preview') {
  await page.setViewportSize(viewport);
  const tempDir = path.join(outDir, 'html');
  fs.mkdirSync(tempDir, { recursive: true });
  const tempFile = path.join(tempDir, name.replace(/[^a-z0-9-]/gi, '-') + '.html');
  fs.writeFileSync(tempFile, withFilePublic(html));
  await page.goto('file:///' + tempFile.replaceAll(String.fromCharCode(92), '/'), { waitUntil: 'domcontentloaded', timeout: 20000 });
}

async function main() {
  fs.mkdirSync(screenshotDir, { recursive: true });
  fs.mkdirSync(path.dirname(resultPath), { recursive: true });
  console.log('[desktop-visual-qa] before-launch');
  const browser = await chromium.launch({ headless: true });
  console.log('[desktop-visual-qa] after-launch');
  const context = await browser.newContext({ viewport: { width: 1440, height: 980 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const failed: string[] = [];
  const records: Record<string, any> = {};

  try {
    for (const id of targetIds) {
      console.log(`[desktop-visual-qa] ${id}`);
      const data = dataFor(id);
      const componentHtml = previewHtml(data);
      const exportedHtml = exportStaticSite(data);

      await loadHtml(page, componentHtml, { width: 1440, height: 980 }, `${id}-builder`);
      const builder1440 = await measure(page);
      await page.screenshot({ path: path.join(screenshotDir, `${id}-builder-desktop-1440.png`), fullPage: false });

      await loadHtml(page, componentHtml, { width: 1280, height: 900 }, `${id}-fullscreen`);
      const fullscreen1280 = await measure(page);
      await page.screenshot({ path: path.join(screenshotDir, `${id}-fullscreen-1280.png`), fullPage: false });

      await loadHtml(page, exportedHtml, { width: 1440, height: 980 }, `${id}-export`);
      const export1440 = await measure(page);
      await page.screenshot({ path: path.join(screenshotDir, `${id}-export-desktop-1440.png`), fullPage: false });

      const mobile: Record<string, boolean> = {};
      for (const width of [390, 375, 320]) {
        await loadHtml(page, componentHtml, { width, height: 844 }, `${id}-mobile-${width}`);
        const ok = await page.evaluate(`(() => {
          const root = document.querySelector('[data-testid="site-root"]');
          const hero = document.querySelector('[data-testid="site-hero"]');
          const cta = document.querySelector('[data-testid="hero-cta-row"]');
          return !!root && !!hero && !!cta && document.documentElement.scrollWidth <= window.innerWidth + 2;
        })()`);
        mobile[String(width)] = Boolean(ok);
      }

      const checks = {
        builder1440Pass: builder1440.heroNotBroken && builder1440.imageSafe && builder1440.backgroundRendered && builder1440.sectionsStyled && builder1440.ctaVisible && builder1440.navVisible && !builder1440.horizontalOverflow,
        fullscreen1280Pass: fullscreen1280.heroHeight <= 760 && fullscreen1280.heroHeight >= 500 && fullscreen1280.imageInsideHero && fullscreen1280.backgroundRendered && !fullscreen1280.horizontalOverflow,
        export1440Pass: export1440.heroNotBroken && export1440.imageSafe && export1440.backgroundRendered && export1440.sectionsStyled && export1440.ctaVisible && !export1440.horizontalOverflow,
        mobileRegressionPass: Object.values(mobile).every(Boolean),
      };
      records[id] = { builder1440, fullscreen1280, export1440, mobile, checks };
      for (const [key, ok] of Object.entries(checks)) {
        if (!ok) failed.push(`${id}: ${key}`);
      }
    }
  } finally {
    await browser.close();
  }

  const screenshotCount = fs.readdirSync(screenshotDir).filter(name => name.endsWith('.png')).length;
  if (screenshotCount < 90) failed.push(`screenshots fewer than 90: ${screenshotCount}`);

  const result = {
    ok: failed.length === 0,
    totalTemplates: targetIds.length,
    heroImageSafe: failed.filter(item => item.includes('builder1440Pass') || item.includes('export1440Pass')).length === 0,
    desktopHeroNotBroken: failed.filter(item => item.includes('builder1440Pass') || item.includes('fullscreen1280Pass')).length === 0,
    desktopBackgroundRendered: Object.values(records).every((r: any) => r.builder1440.backgroundRendered && r.export1440.backgroundRendered),
    sectionsStyled: Object.values(records).every((r: any) => r.builder1440.sectionsStyled && r.export1440.sectionsStyled),
    fullscreen1440Pass: Object.values(records).every((r: any) => r.checks.builder1440Pass),
    fullscreen1280Pass: Object.values(records).every((r: any) => r.checks.fullscreen1280Pass),
    exportDesktopPass: Object.values(records).every((r: any) => r.checks.export1440Pass),
    mobileRegressionPass: Object.values(records).every((r: any) => r.checks.mobileRegressionPass),
    screenshotsCount: screenshotCount,
    failed,
  };

  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
  fs.writeFileSync(detailPath, JSON.stringify({ templates: records }, null, 2));
  if (!result.ok) throw new Error(`desktop visual system QA failed: ${failed.join('; ')}`);
}

main().catch(error => {
  fs.mkdirSync(path.dirname(resultPath), { recursive: true });
  if (!fs.existsSync(resultPath)) {
    fs.writeFileSync(resultPath, JSON.stringify({ ok: false, totalTemplates: targetIds.length, failed: [error instanceof Error ? error.message : String(error)] }, null, 2));
  }
  console.error(error);
  process.exit(1);
});
