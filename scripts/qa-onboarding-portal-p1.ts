import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:3052';
const outRoot = path.resolve('qa-artifacts/v0.3.1');
const shotDir = path.join(outRoot, 'onboarding-portal-p1');
const resultPath = path.join(outRoot, 'onboarding-portal-p1-result.json');

async function checkViewport(width: number, height: number) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.getByTestId('home-header').getByText('開始建立店名片').click();
  await page.getByTestId('onboarding-wizard').waitFor({ state: 'visible', timeout: 15000 });
  await page.screenshot({ path: path.join(shotDir, `onboarding-portal-${width}.png`), fullPage: true });
  const metrics = await page.evaluate(() => {
    const root = document.querySelector('[data-testid="onboarding-wizard"]') as HTMLElement | null;
    const panel = root?.firstElementChild as HTMLElement | null;
    const rootRect = root?.getBoundingClientRect();
    const panelRect = panel?.getBoundingClientRect();
    return {
      parentTag: root?.parentElement?.tagName || '',
      rootTop: rootRect?.top ?? -1,
      rootHeight: rootRect?.height ?? 0,
      viewportHeight: window.innerHeight,
      panelTop: panelRect?.top ?? -1,
      panelHeight: panelRect?.height ?? 0,
      panelVisible: Boolean(panelRect && panelRect.height > 240 && panelRect.bottom > 240),
      noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 2,
    };
  });
  await browser.close();
  return {
    width,
    pass: metrics.parentTag === 'BODY' && metrics.rootTop === 0 && metrics.rootHeight >= metrics.viewportHeight - 2 && metrics.panelTop >= 0 && metrics.panelVisible && metrics.noHorizontalOverflow,
    metrics,
  };
}

async function main() {
  fs.mkdirSync(shotDir, { recursive: true });
  const desktop = await checkViewport(1397, 768);
  const mobile390 = await checkViewport(390, 844);
  const mobile375 = await checkViewport(375, 812);
  const mobile320 = await checkViewport(320, 720);
  const result = {
    ok: desktop.pass && mobile390.pass && mobile375.pass && mobile320.pass,
    headerCtaModalEscapesHeaderBackdrop: desktop.pass,
    mobile390NoOverflow: mobile390.pass,
    mobile375NoOverflow: mobile375.pass,
    mobile320NoOverflow: mobile320.pass,
    cases: [desktop, mobile390, mobile375, mobile320],
  };
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ ok: result.ok, headerCtaModalEscapesHeaderBackdrop: result.headerCtaModalEscapesHeaderBackdrop, mobile390NoOverflow: result.mobile390NoOverflow, mobile375NoOverflow: result.mobile375NoOverflow, mobile320NoOverflow: result.mobile320NoOverflow }, null, 2));
  if (!result.ok) process.exit(1);
}

main().catch(error => {
  fs.mkdirSync(outRoot, { recursive: true });
  fs.writeFileSync(resultPath, JSON.stringify({ ok: false, error: error instanceof Error ? error.stack || error.message : String(error) }, null, 2));
  console.error(error);
  process.exit(1);
});
