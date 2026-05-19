import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';
import { chromium } from 'playwright';
import { createDefaultSiteData } from '../lib/defaultSiteData';
import { checkPublishReadiness } from '../lib/publishReadiness';
import { getHeroFallbackCta } from '../lib/heroCta';
import { exportStaticSite } from '../lib/exportStaticSite';

const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:3050';
const outRoot = path.resolve('qa-artifacts/v0.3.0');
const outDir = path.join(outRoot, 'p1-fixes');
const resultPath = path.join(outRoot, 'p1-fixes-result.json');

const result = {
  ok: false,
  hostingRequestBlocksMissingContact: false,
  hostingRequestAllowsEmailOnly: false,
  hostingRequestAllowsLineOnly: false,
  publishReadinessRequiresPhoneOrLine: false,
  publishReadinessRequiresAddressOrMap: false,
  heroCtaFallbackWorks: false,
  zipRegressionPass: false,
  fileOpenPass: false,
  mobile390NoOverflow: false,
  mobile375NoOverflow: false,
  mobile320NoOverflow: false,
  errors: [] as string[],
};

function cloneData() {
  return createDefaultSiteData();
}

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

async function expectNoDownload(action: () => Promise<void>) {
  let downloaded = false;
  const wait = pageWaitDownload(action, 700).then(() => { downloaded = true; }).catch(() => undefined);
  await wait;
  return !downloaded;
}

async function pageWaitDownload(action: () => Promise<void>, timeout = 5000) {
  if (!activePage) throw new Error('activePage missing');
  const downloadPromise = activePage.waitForEvent('download', { timeout });
  await action();
  return await downloadPromise;
}

let activePage: Awaited<ReturnType<Awaited<ReturnType<typeof chromium.launch>>['newPage']>> | null = null;

async function testHostingRequest() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  activePage = page;
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.locator('[data-sidebar-button="export"]').click();
  await page.getByTestId('publish-center').waitFor({ timeout: 30000 });
  await page.getByTestId('open-hosting-request').click();
  await page.getByTestId('hosting-request-modal').waitFor({ timeout: 15000 });

  await page.getByLabel('Email').fill('');
  await page.getByLabel('LINE ID').fill('');
  const blocked = await expectNoDownload(() => page.getByTestId('generate-hosting-request').click());
  const errorText = await page.getByTestId('hosting-request-error').textContent();
  result.hostingRequestBlocksMissingContact = blocked && errorText === '請至少填寫 Email 或 LINE ID，方便我們聯絡你。';

  await page.getByLabel('Email').fill('qa@example.com');
  await page.getByLabel('LINE ID').fill('');
  const emailDownload = await pageWaitDownload(() => page.getByTestId('generate-hosting-request').click());
  const emailPath = path.join(outDir, 'hosting-request-email-only.json');
  await emailDownload.saveAs(emailPath);
  result.hostingRequestAllowsEmailOnly = fs.existsSync(emailPath) && fs.readFileSync(emailPath, 'utf8').includes('qa@example.com');

  await page.getByLabel('Email').fill('');
  await page.getByLabel('LINE ID').fill('@qa-line');
  const lineDownload = await pageWaitDownload(() => page.getByTestId('generate-hosting-request').click());
  const linePath = path.join(outDir, 'hosting-request-line-only.json');
  await lineDownload.saveAs(linePath);
  result.hostingRequestAllowsLineOnly = fs.existsSync(linePath) && fs.readFileSync(linePath, 'utf8').includes('@qa-line');

  await browser.close();
  activePage = null;
}

function testPublishReadiness() {
  const phoneData = cloneData();
  phoneData.store.phone = '';
  phoneData.links.line = '';
  result.publishReadinessRequiresPhoneOrLine = checkPublishReadiness(phoneData).requiredIssues.includes('請填寫電話或 LINE');

  const addressData = cloneData();
  addressData.store.address = '';
  addressData.links.googleMap = '';
  result.publishReadinessRequiresAddressOrMap = checkPublishReadiness(addressData).requiredIssues.includes('請填寫地址或 Google Maps');
}

function testHeroCtaFallback() {
  const withMenu = cloneData();
  withMenu.store.address = '';
  withMenu.links = {};
  withMenu.hero.ctaText = '查看地圖';
  withMenu.hero.ctaUrl = '';
  const menuFallback = getHeroFallbackCta(withMenu);
  const menuHtml = exportStaticSite(withMenu);

  const noMenu = cloneData();
  noMenu.store.address = '';
  noMenu.links = {};
  noMenu.hero.ctaText = '查看地圖';
  noMenu.hero.ctaUrl = '';
  noMenu.menu.categories = [];
  const aboutFallback = getHeroFallbackCta(noMenu);

  const hasMap = cloneData();
  hasMap.store.address = '台北市測試路 1 號';
  hasMap.links = {};
  const mapFallback = getHeroFallbackCta(hasMap);

  result.heroCtaFallbackWorks =
    menuFallback.label === '查看菜單' && menuFallback.href === '#menu' &&
    !menuHtml.includes('查看地圖') && menuHtml.includes('查看菜單') &&
    aboutFallback.label === '了解店家' && aboutFallback.href === '#about' &&
    mapFallback.label === '查看地圖' && mapFallback.href === '#contact';
}

async function testZipRegression() {
  const data = cloneData();
  const html = exportStaticSite(data);
  const exportDir = path.join(outDir, 'zip-regression-site');
  fs.rmSync(exportDir, { recursive: true, force: true });
  fs.mkdirSync(exportDir, { recursive: true });
  const indexPath = path.join(exportDir, 'index.html');
  fs.writeFileSync(indexPath, html);
  fs.writeFileSync(path.join(exportDir, 'siteData.json'), JSON.stringify(data, null, 2));

  const zip = new JSZip();
  zip.file('index.html', html);
  zip.file('siteData.json', JSON.stringify(data, null, 2));
  const zipPath = path.join(outDir, 'p1-zip-regression.zip');
  fs.writeFileSync(zipPath, await zip.generateAsync({ type: 'nodebuffer' }));
  const loaded = await JSZip.loadAsync(fs.readFileSync(zipPath));
  const loadedHtml = (await loaded.file('index.html')?.async('string')) || '';
  const noForbidden = loadedHtml.length > 0 && !/localhost|127\.0\.0\.1|_next\//.test(loadedHtml);
  result.zipRegressionPass = fs.existsSync(zipPath) && fs.statSync(zipPath).size > 1000 && noForbidden;

  const browser = await chromium.launch({ headless: true });
  for (const width of [390, 375, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(`file://${indexPath}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(300);
    const metrics = await page.evaluate(() => ({
      title: document.querySelector('h1')?.textContent || '',
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      noOverflow: document.documentElement.scrollWidth <= window.innerWidth + 2,
    }));
    await page.screenshot({ path: path.join(outDir, `file-mobile-${width}.png`), fullPage: true });
    result.fileOpenPass = result.fileOpenPass || metrics.title.length > 0;
    if (width === 390) result.mobile390NoOverflow = metrics.noOverflow;
    if (width === 375) result.mobile375NoOverflow = metrics.noOverflow;
    if (width === 320) result.mobile320NoOverflow = metrics.noOverflow;
    await page.close();
  }
  await browser.close();
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  try {
    testPublishReadiness();
    testHeroCtaFallback();
    await testZipRegression();
    await testHostingRequest();
  } catch (error) {
    result.errors.push(error instanceof Error ? error.stack || error.message : String(error));
  }
  result.ok = Boolean(
    result.hostingRequestBlocksMissingContact &&
    result.hostingRequestAllowsEmailOnly &&
    result.hostingRequestAllowsLineOnly &&
    result.publishReadinessRequiresPhoneOrLine &&
    result.publishReadinessRequiresAddressOrMap &&
    result.heroCtaFallbackWorks &&
    result.zipRegressionPass &&
    result.fileOpenPass &&
    result.mobile390NoOverflow &&
    result.mobile375NoOverflow &&
    result.mobile320NoOverflow
  );
  const requiredResult = {
    ok: result.ok,
    hostingRequestBlocksMissingContact: result.hostingRequestBlocksMissingContact,
    hostingRequestAllowsEmailOnly: result.hostingRequestAllowsEmailOnly,
    hostingRequestAllowsLineOnly: result.hostingRequestAllowsLineOnly,
    publishReadinessRequiresPhoneOrLine: result.publishReadinessRequiresPhoneOrLine,
    publishReadinessRequiresAddressOrMap: result.publishReadinessRequiresAddressOrMap,
    heroCtaFallbackWorks: result.heroCtaFallbackWorks,
    zipRegressionPass: result.zipRegressionPass,
  };
  fs.writeFileSync(resultPath, JSON.stringify(requiredResult, null, 2));
  fs.writeFileSync(path.join(outRoot, 'p1-fixes-detail.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(requiredResult, null, 2));
  if (!result.ok) process.exit(1);
}

main();
