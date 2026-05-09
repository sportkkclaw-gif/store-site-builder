import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { chromium } from 'playwright';
import { createDefaultSiteData } from '../lib/defaultSiteData';
import { exportStaticSite } from '../lib/exportStaticSite';
import { dataUrlToFile } from '../lib/imageUtils';
import { getTemplateById } from '../lib/templateCatalog';
import { applyTemplatePresetSync } from '../lib/applyTemplatePreset';

const outRoot = path.resolve('qa-artifacts/v0.1.5');
const forbidden = ['AI-designed', 'AI-generated', 'website template key visual', 'concept image', 'showcase image', 'prompt'];
const templates = [
  { id: 'drink-boba-neon', name: '珍珠霓光' },
  { id: 'drink-matcha-hiyori', name: '抹茶日和' },
  { id: 'drink-white-peach-sparkle', name: '白桃氣泡' },
  { id: 'drink-tea-mist-ridge', name: '茶霧山嵐' },
  { id: 'restaurant-golden-banquet', name: '金色晚宴' },
  { id: 'cafe-white-dripper', name: '白瓷濾杯' },
  { id: 'cafe-urban-monochrome', name: '城市黑白' },
];

function writeExport(templateId: string) {
  const template = getTemplateById(templateId);
  if (!template) throw new Error(`${templateId} not found`);
  const data = applyTemplatePresetSync(createDefaultSiteData(), template);
  data.store.name = '日沐茶飲';
  data.store.tagline = '本週人氣推薦';
  data.hero.title = '每天一杯，日常更美好';
  data.hero.subtitle = '嚴選好茶與新鮮食材，手作現調，清爽入口。';
  data.links.orderForm = '#menu';
  const outDir = path.join(outRoot, `export-${templateId}`);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(outDir, 'assets'), { recursive: true });
  const html = exportStaticSite(data);
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  fs.writeFileSync(path.join(outDir, 'siteData.json'), JSON.stringify(data, null, 2));
  fs.writeFileSync(path.join(outDir, 'README.txt'), `StoreSite Builder v0.1.5 ${template.name} backplate export QA package.`);
  for (const m of data.media) {
    const ext = (m.mimeType.split('/')[1] || 'png').replace('jpeg', 'jpg');
    const target = path.join(outDir, 'assets', `${m.id}.${ext}`);
    if (m.dataUrl.startsWith('data:')) {
      const f = dataUrlToFile(m.dataUrl);
      fs.writeFileSync(target, Buffer.from(f.buffer, 'base64'));
    } else if (m.dataUrl.startsWith('/')) {
      const source = path.resolve('public', m.dataUrl.slice(1));
      fs.copyFileSync(source, target);
    }
  }
  return { template, data, outDir, html };
}

async function zipDir(outDir: string, zipPath: string) {
  const zip = new JSZip();
  for (const file of ['index.html', 'siteData.json', 'README.txt']) zip.file(file, fs.readFileSync(path.join(outDir, file)));
  const assets = zip.folder('assets')!;
  for (const file of fs.readdirSync(path.join(outDir, 'assets'))) assets.file(file, fs.readFileSync(path.join(outDir, 'assets', file)));
  fs.writeFileSync(zipPath, await zip.generateAsync({ type: 'nodebuffer' }));
}

async function fileMetrics(filePath: string, screenshot: string, width: number) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(`file://${filePath}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(350);
  await page.screenshot({ path: screenshot, fullPage: true });
  const metrics = await page.evaluate(() => {
    const h1 = document.querySelector('h1') as HTMLElement | null;
    const hero = document.querySelector('.hero') as HTMLElement | null;
    const subtitle = document.querySelector('.hero-copy .muted') as HTMLElement | null;
    const cta = document.querySelector('.hero-copy .btn') as HTMLElement | null;
    const img = document.querySelector('.hero-img,.hero-bg') as HTMLImageElement | null;
    const rect = h1?.getBoundingClientRect();
    const style = h1 ? getComputedStyle(h1) : null;
    const heroStyle = hero ? getComputedStyle(hero) : null;
    const lineHeight = style ? parseFloat(style.lineHeight) : 0;
    const lines = rect && lineHeight ? Math.max(1, Math.ceil(rect.height / lineHeight)) : 0;
    return {
      h1Text: h1?.textContent || '',
      h1Lines: lines,
      h1Visible: !!rect && rect.width > 40 && rect.height > 10,
      h1Opacity: style ? Number(style.opacity || 1) : 0,
      subtitleVisible: !!subtitle && subtitle.getBoundingClientRect().height > 12,
      ctaVisible: !!cta && cta.getBoundingClientRect().height >= 12,
      imageVisible: !!img && (img.complete || img.tagName === 'IMG') && ((img as HTMLImageElement).naturalWidth || img.getBoundingClientRect().width) > 0,
      heroBackplate: heroStyle?.backgroundImage || heroStyle?.background || '',
      notPlainColorBackplate: !!heroStyle && ((heroStyle.backgroundImage && heroStyle.backgroundImage !== 'none') || /gradient/i.test(heroStyle.background)),
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 2,
    };
  });
  await browser.close();
  return { screenshot, metrics };
}

async function main() {
  fs.mkdirSync(outRoot, { recursive: true });
  const result: any = { ok: true, templates: [], forbiddenCounts: {}, mobile390: null, mobile320: null };
  for (const t of templates) {
    const item = writeExport(t.id);
    const zipPath = path.join(outRoot, `export-${t.id}.zip`);
    await zipDir(item.outDir, zipPath);
    const screenshot = path.join(outRoot, `export-${t.name}-file-mobile.png`);
    const file = await fileMetrics(path.join(item.outDir, 'index.html'), screenshot, 390);
    const forbiddenCounts = Object.fromEntries(forbidden.map(term => [term, (item.html.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length]));
    const hasLocalhostOrNext = /localhost|127\.0\.0\.1|_next\//.test(item.html);
    const templateOk = !hasLocalhostOrNext && Object.values(forbiddenCounts).every(v => Number(v) === 0) && file.metrics.h1Visible && file.metrics.h1Lines <= 4 && file.metrics.h1Opacity >= 0.9 && file.metrics.subtitleVisible && file.metrics.ctaVisible && file.metrics.imageVisible && file.metrics.noHorizontalOverflow && file.metrics.notPlainColorBackplate;
    result.templates.push({ name: t.name, id: t.id, outDir: item.outDir, zipPath, htmlBytes: item.html.length, hasLocalhostOrNext, forbiddenCounts, file, ok: templateOk });
    result.ok = result.ok && templateOk;
  }
  result.forbiddenCounts = result.templates.reduce((acc: any, t: any) => { for (const [k,v] of Object.entries(t.forbiddenCounts)) acc[k] = (acc[k] || 0) + Number(v); return acc; }, {});
  const pearl = result.templates.find((t: any) => t.id === 'drink-boba-neon');
  result.mobile390 = pearl?.file.metrics;
  const mobile320Shot = path.join(outRoot, 'export-珍珠霓光-file-mobile-320.png');
  result.mobile320 = (await fileMetrics(path.join(pearl.outDir, 'index.html'), mobile320Shot, 320)).metrics;
  result.ok = result.ok && result.mobile320.noHorizontalOverflow;
  fs.writeFileSync(path.join(outRoot, 'export-qa-result.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ ok: result.ok, out: path.join(outRoot, 'export-qa-result.json'), templates: result.templates.length }, null, 2));
  if (!result.ok) process.exit(1);
}

main().catch(error => { console.error(error); process.exit(1); });
