import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const baseUrl = process.env.PREVIEW_URL || process.env.BASE_URL || 'http://127.0.0.1:3050';
const outDir = path.join(process.cwd(), 'qa-artifacts', 'v0.2.10-hotfix-mobile-viewport');
const viewports = [390, 375, 320] as const;

type Row = {
  viewport: number;
  passed: boolean;
  url: string;
  phoneWidth: number;
  phoneScrollWidth: number;
  rootWidth: number;
  rootScrollWidth: number;
  heroWidth: number;
  heroScrollWidth: number;
  heroRightWithinPhone: boolean;
  heroLeftWithinPhone: boolean;
  heroColumn: boolean;
  navHidden: boolean;
  backplateHidden: boolean;
  artworkVisible: boolean;
  ctaWithinPhone: boolean;
  screenshot: string;
};

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '手機' }).click();
  await page.getByRole('button', { name: '全螢幕預覽' }).click();
  await page.waitForSelector('[data-testid="preview-phone-frame"]', { timeout: 30000 });

  const rows: Row[] = [];
  for (const viewport of viewports) {
    await page.getByTestId(`preview-viewport-${viewport}`).click();
    await page.waitForTimeout(450);
    const metrics: any = await page.evaluate(`(() => {
      const q = (s) => document.querySelector(s);
      const box = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return { left: r.left, right: r.right, width: r.width, height: r.height, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, display: style.display, flexDirection: style.flexDirection };
      };
      return {
        phone: box(q('.preview-phone-viewport')),
        root: box(q('[data-testid="site-root"]')),
        hero: box(q('[data-testid="site-hero"]')),
        heroInner: box(q('[data-testid="site-hero-inner"]')),
        nav: box(q('.skin-nav nav')),
        backplate: box(q('.template-hero-backplate')),
        artwork: box(q('[data-testid="mobile-hero-artwork-stage"]')),
        cta: box(q('[data-testid="hero-cta-row"]')),
      };
    })()`);
    if (!metrics.phone || !metrics.root || !metrics.hero || !metrics.heroInner || !metrics.cta) throw new Error(`missing metrics for ${viewport}`);
    const screenshot = path.join(outDir, `fullscreen-mobile-${viewport}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    const row: Row = {
      viewport,
      passed: false,
      url: page.url(),
      phoneWidth: Math.round(metrics.phone.width),
      phoneScrollWidth: metrics.phone.scrollWidth,
      rootWidth: Math.round(metrics.root.width),
      rootScrollWidth: metrics.root.scrollWidth,
      heroWidth: Math.round(metrics.hero.width),
      heroScrollWidth: metrics.hero.scrollWidth,
      heroRightWithinPhone: metrics.hero.right <= metrics.phone.right + 1,
      heroLeftWithinPhone: metrics.hero.left >= metrics.phone.left - 1,
      heroColumn: metrics.heroInner.flexDirection === 'column',
      navHidden: metrics.nav?.display === 'none',
      backplateHidden: metrics.backplate?.display === 'none',
      artworkVisible: (metrics.artwork?.display === 'block' || metrics.artwork?.display === 'grid') && (metrics.artwork?.width || 0) > 0,
      ctaWithinPhone: metrics.cta.left >= metrics.phone.left - 1 && metrics.cta.right <= metrics.phone.right + 1,
      screenshot,
    };
    row.passed = row.phoneWidth === viewport && row.phoneScrollWidth <= viewport && row.rootScrollWidth <= viewport && row.heroScrollWidth <= viewport && row.heroLeftWithinPhone && row.heroRightWithinPhone && row.heroColumn && row.navHidden && row.backplateHidden && row.artworkVisible && row.ctaWithinPhone;
    rows.push(row);
  }
  await browser.close();
  const result = { ok: rows.every(r => r.passed), baseUrl, rows };
  await fs.writeFile(path.join(outDir, 'mobile-preview-virtual-viewport-result.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

main().catch(err => { console.error(err); process.exit(1); });
