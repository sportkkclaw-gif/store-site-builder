import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { exportStaticSite } from './lib/exportStaticSite';
import { dataUrlToFile } from './lib/imageUtils';
import type { SiteData } from './types/site';

const data: SiteData = {
  id: 'demo-rimu-tea',
  industry: 'drink-shop',
  template: 'playful-colorful',
  store: { name: '驗收測試茶館', tagline: '這是用來驗收的網站', description: '如果這段文字出現在預覽與匯出網站，代表資料流正確。', phone: '02-9999-8888', email: 'hello@rimutea.com', address: '台北市信義區測試路 123 號', businessHours: '週一至週日 09:00 - 23:00' },
  theme: { primaryColor: '#ff3366', secondaryColor: '#F4C27A', backgroundColor: '#FFFDF7', textColor: '#0F172A', fontFamily: 'sans', buttonStyle: 'pill', sectionRadius: 24, layoutDensity: 'comfortable' },
  hero: { title: '每天一杯，日常更美好', subtitle: '嚴選好茶與新鮮食材，手作現調，清爽入口。', ctaText: '立即訂購', ctaUrl: '#order', imageId: 'img-qa' },
  menu: { categories: [{ id: 'qa-cat', name: '驗收新品', items: [{ id: 'qa-1', name: '驗收珍珠奶茶', description: '這是驗收用商品', price: 99, featured: true, imageId: 'img-qa' }, { id: 'qa-2', name: '驗收檸檬綠茶', description: '測試菜單顯示', price: 88, featured: false }] }] },
  media: [{ id: 'img-qa', name: 'qa-upload.png', type: 'hero', mimeType: 'image/png', dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=' }],
  links: { line: 'https://line.me/R/ti/p/@test', googleMap: 'https://maps.google.com', ubereats: 'https://ubereats.com', foodpanda: 'https://www.foodpanda.com.tw' },
  seo: { title: '驗收測試茶館｜官方網站', description: '這是用來驗收 StoreSite Builder 的 SEO 描述。', slug: 'yanshou-test' },
  modules: { hero: true, featuredProducts: true, menu: true, brandStory: true, storeInfo: true, map: true, faq: false, socialLinks: true, footer: true },
  faq: [{ question: '可以外送嗎？', answer: '可以，請透過 LINE 或外送平台下單。' }]
};

const out = path.resolve('qa-artifacts/generated-site');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'assets'), { recursive: true });
const html = exportStaticSite(data);
fs.writeFileSync(path.join(out, 'index.html'), html);
fs.writeFileSync(path.join(out, 'siteData.json'), JSON.stringify(data, null, 2));
fs.writeFileSync(path.join(out, 'README.txt'), '這是由 StoreSite Builder 產生的靜態網站。');
for (const m of data.media) {
  const f = dataUrlToFile(m.dataUrl);
  fs.writeFileSync(path.join(out, 'assets', `${m.id}.${f.ext}`), Buffer.from(f.buffer, 'base64'));
}
const zip = new JSZip();
zip.file('index.html', html);
zip.file('siteData.json', JSON.stringify(data, null, 2));
zip.file('README.txt', '這是由 StoreSite Builder 產生的靜態網站。');
const assets = zip.folder('assets')!;
for (const m of data.media) {
  const f = dataUrlToFile(m.dataUrl);
  assets.file(`${m.id}.${f.ext}`, f.buffer, { base64: true });
}
async function main() {
  const buf = await zip.generateAsync({ type: 'nodebuffer' });
  fs.mkdirSync('qa-artifacts', { recursive: true });
  fs.writeFileSync('qa-artifacts/generated-site.zip', buf);
  console.log(JSON.stringify({ out, zip: path.resolve('qa-artifacts/generated-site.zip'), htmlBytes: html.length, hasLocalhost: /localhost|127\.0\.0\.1|_next\//.test(html), hasTitle: html.includes('驗收測試茶館｜官方網站'), hasProduct: html.includes('驗收珍珠奶茶'), assets: fs.readdirSync(path.join(out, 'assets')) }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
