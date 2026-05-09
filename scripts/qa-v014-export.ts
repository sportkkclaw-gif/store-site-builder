import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { chromium } from 'playwright';
import { createDefaultSiteData } from '../lib/defaultSiteData';
import { exportStaticSite } from '../lib/exportStaticSite';
import { dataUrlToFile } from '../lib/imageUtils';
import { getTemplateById } from '../lib/templateCatalog';
import { applyTemplatePresetSync } from '../lib/applyTemplatePreset';

const outDir = path.resolve('qa-artifacts/v0.1.4/export-pearl-neon');
const zipPath = path.resolve('qa-artifacts/v0.1.4/export-pearl-neon.zip');
const template = getTemplateById('drink-boba-neon');
if (!template) throw new Error('drink-boba-neon not found');

const data = applyTemplatePresetSync(createDefaultSiteData(), template);
data.store.name = '日沐茶飲';
data.store.tagline = '本週人氣推薦';
data.hero.title = '每天一杯，日常更美好';
data.hero.subtitle = '嚴選好茶與新鮮食材，手作現調，清爽入口。';
data.links.orderForm = '#menu';

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(path.join(outDir, 'assets'), { recursive: true });
fs.mkdirSync(path.dirname(zipPath), { recursive: true });
const html = exportStaticSite(data);
fs.writeFileSync(path.join(outDir, 'index.html'), html);
fs.writeFileSync(path.join(outDir, 'siteData.json'), JSON.stringify(data, null, 2));
fs.writeFileSync(path.join(outDir, 'README.txt'), 'StoreSite Builder v0.1.4 珍珠霓光離線驗收包。');

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

async function zipDir() {
  const zip = new JSZip();
  zip.file('index.html', html);
  zip.file('siteData.json', JSON.stringify(data, null, 2));
  zip.file('README.txt', 'StoreSite Builder v0.1.4 珍珠霓光離線驗收包。');
  const assets = zip.folder('assets')!;
  for (const file of fs.readdirSync(path.join(outDir, 'assets'))) {
    assets.file(file, fs.readFileSync(path.join(outDir, 'assets', file)));
  }
  const buf = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync(zipPath, buf);
}

async function fileMetrics() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
  await page.goto(`file://${path.join(outDir, 'index.html')}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  const screenshot = path.resolve('qa-artifacts/v0.1.4/export-pearl-neon-file-mobile.png');
  await page.screenshot({ path: screenshot, fullPage: true });
  const metrics = await page.evaluate(() => {
    const h1 = document.querySelector('h1') as HTMLElement | null;
    const subtitle = document.querySelector('.hero-copy .muted') as HTMLElement | null;
    const cta = document.querySelector('.hero-copy .btn') as HTMLElement | null;
    const img = document.querySelector('.hero-img') as HTMLImageElement | null;
    const rect = h1?.getBoundingClientRect();
    const style = h1 ? getComputedStyle(h1) : null;
    const lineHeight = style ? parseFloat(style.lineHeight) : 0;
    const lines = rect && lineHeight ? Math.max(1, Math.ceil(rect.height / lineHeight)) : 0;
    return {
      h1Text: h1?.textContent || '',
      h1Lines: lines,
      h1Visible: !!rect && rect.width > 40 && rect.height > 18,
      h1Opacity: style ? Number(style.opacity || 1) : 0,
      subtitleVisible: !!subtitle && subtitle.getBoundingClientRect().height > 12,
      ctaVisible: !!cta && cta.getBoundingClientRect().height >= 44,
      imageVisible: !!img && img.complete && img.naturalWidth > 0,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 2,
    };
  });
  await browser.close();
  return { screenshot, metrics };
}

async function main() {
  await zipDir();
  const file = await fileMetrics();
  const assets = fs.readdirSync(path.join(outDir, 'assets'));
  const forbidden = ['AI-designed', 'AI-generated', 'website template key visual', 'concept image', 'showcase image', 'prompt'];
  const forbiddenCounts = Object.fromEntries(forbidden.map(term => [term, (html.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length]));
  const result = {
    ok: !/localhost|127\.0\.0\.1|_next\//.test(html)
      && Object.values(forbiddenCounts).every(v => Number(v) === 0)
      && file.metrics.h1Visible && file.metrics.h1Lines <= 4 && file.metrics.h1Opacity >= 0.9
      && file.metrics.subtitleVisible && file.metrics.ctaVisible && file.metrics.imageVisible && file.metrics.noHorizontalOverflow,
    outDir,
    zipPath,
    htmlBytes: html.length,
    assets,
    hasLocalhostOrNext: /localhost|127\.0\.0\.1|_next\//.test(html),
    forbiddenCounts,
    file,
  };
  fs.writeFileSync(path.resolve('qa-artifacts/v0.1.4/export-qa-result.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

main().catch(error => { console.error(error); process.exit(1); });
