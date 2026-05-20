import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';
import { chromium, type Page } from 'playwright';
import { validateRequestedSlug, normalizeRequestedSlug } from '../lib/slugValidation';
import { validateContactFields } from '../lib/contactValidation';
import { buildHostingRequest, validateHostingRequestForm, type HostingRequestForm } from '../lib/hostingRequest';
import { createDefaultSiteData } from '../lib/defaultSiteData';
import { exportStaticSite } from '../lib/exportStaticSite';

const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:3050';
const outRoot = path.resolve('qa-artifacts/v0.3.1');
const shotDir = path.join(outRoot, 'managed-hosting-intake');
const resultPath = path.join(outRoot, 'managed-hosting-intake-result.json');
const detailPath = path.join(outRoot, 'managed-hosting-intake-detail.json');

const result = {
  ok: false,
  hostingRequestValidation: false,
  slugValidation: false,
  hostingRequestV031: false,
  managedPackageWorks: false,
  deployGuideWorks: false,
  managedHostingPageWorks: false,
  zipExportStillWorks: false,
  mobile390NoOverflow: false,
  mobile375NoOverflow: false,
  mobile320NoOverflow: false,
  contactNameValidation: false,
  emailValidation: false,
  lineIdValidation: false,
  requiresEmailOrLine: false,
  blocksInvalidContactBeforeDownload: false,
};
const failed: string[] = [];

function assert(check: unknown, key: keyof typeof result, message: string) {
  if (!check) failed.push(`${String(key)}: ${message}`);
  return Boolean(check);
}

async function expectNoDownload(page: Page, action: () => Promise<void>) {
  let downloaded = false;
  const downloadProbe = page.waitForEvent('download', { timeout: 1200 }).then(() => { downloaded = true; }).catch(() => undefined);
  await action();
  await downloadProbe;
  return !downloaded;
}

async function openPublishCenter(page: Page) {
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.locator('[data-sidebar-button="export"]').evaluate((button: HTMLElement) => button.click());
  await page.getByTestId('publish-center').waitFor({ timeout: 30000 });
}

async function fillValidBase(page: Page) {
  await page.getByLabel('聯絡人姓名').fill('王小明');
  await page.getByLabel('店家名稱').fill('小明茶舖');
  await page.getByLabel('想使用的網址名稱').fill('My Tea Shop');
  await page.getByLabel('LINE ID').fill('');
  await page.getByLabel('Email').fill('');
}

async function checkNoOverflow(page: Page, width: number, route: string, shotName: string) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.screenshot({ path: path.join(shotDir, shotName), fullPage: true });
  return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 2);
}

async function main() {
  fs.mkdirSync(shotDir, { recursive: true });

  const slug8855 = validateRequestedSlug('8855');
  const slugTea = validateRequestedSlug('My Tea Shop');
  const slugDash = normalizeRequestedSlug('my--tea');
  result.slugValidation = assert(!slug8855.ok && slug8855.errors.includes('網址名稱不可只有數字。') && slugTea.normalized === 'my-tea-shop' && slugTea.ok && slugDash === 'my-tea', 'slugValidation', 'slug cases failed');

  const baseForm: HostingRequestForm = {
    contactName: 'Jason QA',
    email: 'sportkk101@gmail.com',
    lineId: '',
    storeName: 'Jason QA 茶舖',
    requestedSlug: 'jason-qa-shop',
    hasCustomDomain: false,
    customDomain: '',
    notes: '',
  };
  const contactNameCases = [
    validateContactFields({ name: '', email: 'user@example.com', lineId: '' }).ok === false,
    validateContactFields({ name: '558822', email: 'user@example.com', lineId: '' }).ok === false,
    validateContactFields({ name: '!!!', email: 'user@example.com', lineId: '' }).ok === false,
    validateContactFields({ name: 'Jason QA', email: 'user@example.com', lineId: '' }).ok === true,
  ];
  result.contactNameValidation = assert(contactNameCases.every(Boolean), 'contactNameValidation', 'contact name validation cases failed');

  const emailCases = [
    validateContactFields({ name: 'Jason QA', email: 'abc', lineId: '' }).ok === false,
    validateContactFields({ name: 'Jason QA', email: 'abc@test', lineId: '' }).ok === false,
    validateContactFields({ name: 'Jason QA', email: 'sportkk101@gmail.com', lineId: '' }).ok === true,
  ];
  result.emailValidation = assert(emailCases.every(Boolean), 'emailValidation', 'email validation cases failed');

  const lineCases = [
    validateContactFields({ name: 'Jason QA', email: '', lineId: 'aa' }).ok === false,
    validateContactFields({ name: 'Jason QA', email: '', lineId: 'abc def' }).ok === false,
    validateContactFields({ name: 'Jason QA', email: '', lineId: 'qa-line' }).ok === true,
    validateContactFields({ name: 'Jason QA', email: '', lineId: 'https://line.me/R/ti/p/@qa' }).ok === true,
  ];
  result.lineIdValidation = assert(lineCases.every(Boolean), 'lineIdValidation', 'LINE ID validation cases failed');

  const eitherCases = [
    validateHostingRequestForm({ ...baseForm, email: '', lineId: '' }).ok === false,
    validateHostingRequestForm({ ...baseForm, email: 'sportkk101@gmail.com', lineId: '' }).ok === true,
    validateHostingRequestForm({ ...baseForm, email: '', lineId: 'qa-line' }).ok === true,
    validateHostingRequestForm({ ...baseForm, email: 'sportkk101@gmail.com', lineId: 'qa-line' }).ok === true,
  ];
  result.requiresEmailOrLine = assert(eitherCases.every(Boolean), 'requiresEmailOrLine', 'Email/LINE one-of validation cases failed');

  const normalizedRequest = buildHostingRequest({ ...baseForm, contactName: '  Jason QA  ', email: '  SPORTKK101@GMAIL.COM  ', lineId: '  qa-line  ', requestedSlug: ' My QA Shop ', notes: '  hello  ' }, createDefaultSiteData());
  result.hostingRequestV031 = result.hostingRequestV031 || assert(normalizedRequest.contact.name === 'Jason QA' && normalizedRequest.contact.email === 'sportkk101@gmail.com' && normalizedRequest.contact.lineId === 'qa-line' && normalizedRequest.deployment.requestedSubdomain === 'my-qa-shop', 'hostingRequestV031', 'hosting-request normalize failed');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();

  try {
    await openPublishCenter(page);
    await page.screenshot({ path: path.join(shotDir, 'export-center-v031.png'), fullPage: true });
    await page.getByTestId('open-hosting-request').click();
    await page.getByTestId('hosting-request-modal').waitFor({ timeout: 15000 });
    await fillValidBase(page);

    await page.getByLabel('聯絡人姓名').fill('558822');
    await page.getByLabel('Email').fill('abc');
    const invalidJsonBlocked = await expectNoDownload(page, () => page.getByTestId('generate-hosting-request').click());
    const invalidPackageBlocked = await expectNoDownload(page, () => page.getByTestId('generate-managed-package').click());
    const invalidErrorText = await page.getByTestId('hosting-request-error').textContent();
    result.blocksInvalidContactBeforeDownload = assert(invalidJsonBlocked && invalidPackageBlocked && Boolean(invalidErrorText?.includes('請填寫有效的聯絡人姓名。')) && Boolean(invalidErrorText?.includes('Email 格式不正確。')), 'blocksInvalidContactBeforeDownload', 'invalid contact did not block downloads');
    await page.getByLabel('聯絡人姓名').fill('王小明');
    await page.getByLabel('Email').fill('');
    await page.getByLabel('LINE ID').fill('');

    const blocked = await expectNoDownload(page, () => page.getByTestId('generate-hosting-request').click());
    const errorText = await page.getByTestId('hosting-request-error').textContent();
    await page.screenshot({ path: path.join(shotDir, 'hosting-request-validation-error.png'), fullPage: true });
    result.hostingRequestValidation = assert(blocked && Boolean(errorText?.includes('請至少填寫 Email 或 LINE ID，方便我們聯絡你。')), 'hostingRequestValidation', 'empty Email/LINE was not blocked');

    await page.getByLabel('Email').fill('qa@example.com');
    const emailDownload = await Promise.all([page.waitForEvent('download', { timeout: 15000 }), page.getByTestId('generate-hosting-request').click()]).then(([d]) => d);
    const emailPath = path.join(shotDir, 'hosting-request-email-only.json');
    await emailDownload.saveAs(emailPath);
    await page.screenshot({ path: path.join(shotDir, 'hosting-request-valid-email.png'), fullPage: true });
    const requestJson = JSON.parse(fs.readFileSync(emailPath, 'utf8'));
    result.hostingRequestV031 = assert(requestJson.version === '0.3.1' && requestJson.publishReadiness && requestJson.deployment && requestJson.deployment.requestedSubdomain === 'my-tea-shop' && requestJson.contact.email === 'qa@example.com' && requestJson.contact.name === '王小明', 'hostingRequestV031', 'hosting-request v0.3.1 shape mismatch');
    await page.screenshot({ path: path.join(shotDir, 'hosting-request-slug-normalize.png'), fullPage: true });
    await page.screenshot({ path: path.join(shotDir, 'hosting-request-generated-v031.png'), fullPage: true });

    await page.getByLabel('Email').fill('');
    await page.getByLabel('LINE ID').fill('qa-line');
    const lineDownload = await Promise.all([page.waitForEvent('download', { timeout: 15000 }), page.getByTestId('generate-hosting-request').click()]).then(([d]) => d);
    const linePath = path.join(shotDir, 'hosting-request-line-only.json');
    await lineDownload.saveAs(linePath);
    const lineJson = JSON.parse(fs.readFileSync(linePath, 'utf8'));
    result.hostingRequestValidation = result.hostingRequestValidation && assert(lineJson.contact.lineId === 'qa-line', 'hostingRequestValidation', 'LINE only request failed');

    const packageDownload = await Promise.all([page.waitForEvent('download', { timeout: 15000 }), page.getByTestId('generate-managed-package').click()]).then(([d]) => d);
    const packagePath = path.join(shotDir, 'managed-hosting-package.zip');
    await packageDownload.saveAs(packagePath);
    await page.screenshot({ path: path.join(shotDir, 'managed-package-generated.png'), fullPage: true });
    const zip = await JSZip.loadAsync(fs.readFileSync(packagePath));
    const required = ['hosting-request.json', 'siteData.json', 'publish-readiness.json', 'deployment-brief.md', 'README.txt'];
    result.managedPackageWorks = assert(required.every(name => Boolean(zip.file(name))), 'managedPackageWorks', 'managed package missing required files');

    await page.getByRole('button', { name: '關閉' }).click();
    await page.getByTestId('hosting-request-modal').waitFor({ state: 'detached', timeout: 10000 }).catch(() => undefined);
    const zipDownload = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), page.getByTestId('publish-zip-export').click()]).then(([d]) => d).catch(async () => {
      await page.getByTestId('publish-center').waitFor({ timeout: 1000 });
      return null;
    });
    if (zipDownload) {
      const zipPath = path.join(shotDir, 'generated-site.zip');
      await zipDownload.saveAs(zipPath);
      const exportZip = await JSZip.loadAsync(fs.readFileSync(zipPath));
      result.zipExportStillWorks = assert(Boolean(exportZip.file('index.html')) && Boolean(exportZip.file('siteData.json')), 'zipExportStillWorks', 'downloaded generated-site.zip missing files');
    }
  } catch (error) {
    failed.push(error instanceof Error ? error.stack || error.message : String(error));
  }

  const deployPage = await context.newPage();
  const deployResp = await deployPage.goto(`${baseUrl}/deploy-guide`, { waitUntil: 'networkidle', timeout: 60000 });
  await deployPage.screenshot({ path: path.join(shotDir, 'deploy-guide-page.png'), fullPage: true });
  result.deployGuideWorks = assert(deployResp?.status() === 200 && await deployPage.getByRole('heading', { name: '自行部署教學' }).count(), 'deployGuideWorks', '/deploy-guide failed');
  await deployPage.close();

  const managedPage = await context.newPage();
  const managedResp = await managedPage.goto(`${baseUrl}/managed-hosting`, { waitUntil: 'networkidle', timeout: 60000 });
  await managedPage.screenshot({ path: path.join(shotDir, 'managed-hosting-page.png'), fullPage: true });
  result.managedHostingPageWorks = assert(managedResp?.status() === 200 && await managedPage.getByRole('heading', { name: '店名片代管發布' }).count(), 'managedHostingPageWorks', '/managed-hosting failed');
  await managedPage.close();

  const widths = [390, 375, 320];
  for (const width of widths) {
    const mobile = await context.newPage();
    await mobile.setViewportSize({ width, height: 900 });
    await openPublishCenter(mobile);
    await mobile.screenshot({ path: path.join(shotDir, `mobile-builder-${width}.png`), fullPage: true });
    const builderOk = await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 2);
    await mobile.getByTestId('open-hosting-request').click({ force: true, timeout: 15000 });
    await mobile.getByTestId('hosting-request-modal').waitFor({ timeout: 15000 });
    await mobile.screenshot({ path: path.join(shotDir, width === 390 ? 'mobile-hosting-request-390.png' : `mobile-hosting-request-${width}.png`), fullPage: true });
    const modalOk = await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 2);
    const deployOk = await checkNoOverflow(mobile, width, '/deploy-guide', `mobile-deploy-guide-${width}.png`);
    const managedOk = await checkNoOverflow(mobile, width, '/managed-hosting', width === 390 ? 'mobile-managed-hosting-390.png' : `mobile-managed-hosting-${width}.png`);
    const ok = builderOk && modalOk && deployOk && managedOk;
    if (width === 390) result.mobile390NoOverflow = assert(ok, 'mobile390NoOverflow', '390 overflow');
    if (width === 375) result.mobile375NoOverflow = assert(ok, 'mobile375NoOverflow', '375 overflow');
    if (width === 320) result.mobile320NoOverflow = assert(ok, 'mobile320NoOverflow', '320 overflow');
    await mobile.close();
  }

  await browser.close();

  const html = exportStaticSite(createDefaultSiteData());
  const fileDir = path.join(shotDir, 'file-open-regression');
  fs.mkdirSync(fileDir, { recursive: true });
  fs.writeFileSync(path.join(fileDir, 'index.html'), html);

  result.ok = Object.entries(result).filter(([k]) => k !== 'ok').every(([, v]) => v === true);
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
  fs.writeFileSync(detailPath, JSON.stringify({ failed, baseUrl, screenshots: fs.readdirSync(shotDir).filter(x => x.endsWith('.png')) }, null, 2));
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

main().catch(error => {
  fs.mkdirSync(shotDir, { recursive: true });
  failed.push(error instanceof Error ? error.stack || error.message : String(error));
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
  fs.writeFileSync(detailPath, JSON.stringify({ failed }, null, 2));
  console.error(error);
  process.exit(1);
});
