import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { validateOnboardingBasicInfo } from '../lib/onboardingValidation';

const baseUrl = (process.env.QA_BASE_URL || process.argv[2] || 'http://127.0.0.1:3053').replace(/\/$/, '');
const outDir = path.resolve('qa-artifacts/v0.3.1');
const resultPath = path.join(outDir, 'onboarding-basic-info-validation-result.json');
const shotDir = path.join(outDir, 'onboarding-basic-info-validation');

function checkHelperValidations() {
  const validBase = {
    name: 'QA 茶飲',
    tagline: '每天一杯，日常更美好',
    phone: '02-2345-6789',
    line: '',
    address: '台北市中正區開封街一段 1 號',
    googleMap: '',
  };
  const storeNameValidation = ['', ' ', '1', '123456', '!!!', 'test', '測試', 'aaa', 'qqq'].every(name => !validateOnboardingBasicInfo({ ...validBase, name }).ok)
    && validateOnboardingBasicInfo({ ...validBase, name: 'QA 茶飲' }).ok;
  const taglineValidation = ['', ' ', '1234', '!!!!', 'test', '測試'].every(tagline => !validateOnboardingBasicInfo({ ...validBase, tagline }).ok)
    && validateOnboardingBasicInfo({ ...validBase, tagline: '每天一杯，日常更美好' }).ok;
  const phoneOrLineValidation = !validateOnboardingBasicInfo({ ...validBase, phone: '', line: '' }).ok
    && validateOnboardingBasicInfo({ ...validBase, phone: '02-2345-6789', line: '' }).ok
    && validateOnboardingBasicInfo({ ...validBase, phone: '', line: 'qa_line' }).ok
    && validateOnboardingBasicInfo({ ...validBase, phone: '', line: 'https://line.me/R/ti/p/@qa' }).ok
    && !validateOnboardingBasicInfo({ ...validBase, phone: '123456', line: '' }).ok
    && !validateOnboardingBasicInfo({ ...validBase, phone: '', line: 'aa' }).ok
    && !validateOnboardingBasicInfo({ ...validBase, phone: '', line: 'https://fake-line.com/qa' }).ok;
  const addressOrMapValidation = !validateOnboardingBasicInfo({ ...validBase, address: '', googleMap: '' }).ok
    && validateOnboardingBasicInfo({ ...validBase, address: '台北市中正區開封街一段 1 號', googleMap: '' }).ok
    && validateOnboardingBasicInfo({ ...validBase, address: '', googleMap: 'https://maps.google.com/?q=QA' }).ok
    && validateOnboardingBasicInfo({ ...validBase, address: '', googleMap: 'https://google.com/maps/place/QA' }).ok
    && validateOnboardingBasicInfo({ ...validBase, address: '', googleMap: 'https://goo.gl/maps/abc' }).ok
    && validateOnboardingBasicInfo({ ...validBase, address: '', googleMap: 'https://maps.app.goo.gl/abc' }).ok
    && !validateOnboardingBasicInfo({ ...validBase, address: '12345', googleMap: '' }).ok
    && !validateOnboardingBasicInfo({ ...validBase, address: '測試', googleMap: '' }).ok
    && !validateOnboardingBasicInfo({ ...validBase, address: '', googleMap: 'https://example.com/maps' }).ok;
  return { storeNameValidation, taglineValidation, phoneOrLineValidation, addressOrMapValidation };
}

async function openStep3(page: any) {
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.getByTestId('home-start-onboarding').first().click();
  await page.getByTestId('onboarding-step-1').waitFor({ state: 'visible', timeout: 15000 });
  await page.getByRole('button', { name: '下一步' }).click();
  await page.getByTestId('onboarding-step-2').waitFor({ state: 'visible', timeout: 15000 });
  await page.getByRole('button', { name: '下一步' }).click();
  await page.getByTestId('onboarding-step-3').waitFor({ state: 'visible', timeout: 15000 });
}

async function fillValidStep3(page: any) {
  await page.getByRole('textbox', { name: '店名' }).fill('QA 茶飲');
  await page.getByRole('textbox', { name: '品牌標語' }).fill('每天一杯，日常更美好');
  await page.getByRole('textbox', { name: '電話' }).fill('02-2345-6789');
  await page.getByRole('textbox', { name: '地址' }).fill('台北市中正區開封街一段 1 號');
  await page.getByRole('textbox', { name: 'LINE 連結' }).fill('qa_line');
  await page.getByRole('textbox', { name: 'Google Maps 連結' }).fill('https://maps.google.com/?q=QA%20Tea');
}

async function main() {
  fs.mkdirSync(shotDir, { recursive: true });
  const helper = checkHelperValidations();
  let blocksInvalidStep3 = false;
  let allowsValidStep3 = false;
  let builderReceivesValidData = false;
  let previewNormal = false;
  const errors: string[] = [];

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    await openStep3(page);
    await page.getByRole('button', { name: '下一步' }).click();
    await page.waitForTimeout(300);
    blocksInvalidStep3 = await page.getByTestId('onboarding-step-3').isVisible()
      && await page.getByText('請填寫有效的店名。').isVisible()
      && await page.getByText('請填寫有效的品牌標語。').isVisible()
      && await page.getByText('請至少填寫電話或 LINE，讓客人可以聯絡你。').isVisible()
      && await page.getByText('請至少填寫地址或 Google Maps，讓客人找得到店家。').isVisible()
      && await page.getByText('請先補齊必要資料，才能繼續建立店名片。').isVisible();
    await page.screenshot({ path: path.join(shotDir, 'blocks-invalid-step3.png'), fullPage: true });
    await fillValidStep3(page);
    await page.getByRole('button', { name: '下一步' }).click();
    await page.getByTestId('onboarding-step-4').waitFor({ state: 'visible', timeout: 15000 });
    allowsValidStep3 = true;
    await page.getByRole('button', { name: '下一步' }).click();
    await page.getByTestId('onboarding-step-5').waitFor({ state: 'visible', timeout: 15000 });
    await page.getByTestId('complete-onboarding').click();
    await page.waitForURL(/\/builder/, { timeout: 20000 });
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('store-site-builder-data') || '{}'));
    builderReceivesValidData = stored?.store?.name === 'QA 茶飲'
      && stored?.store?.tagline === '每天一杯，日常更美好'
      && stored?.store?.phone === '02-2345-6789'
      && stored?.store?.address === '台北市中正區開封街一段 1 號'
      && stored?.links?.line === 'qa_line'
      && stored?.links?.googleMap === 'https://maps.google.com/?q=QA%20Tea';
    await page.goto(`${baseUrl}/preview`, { waitUntil: 'networkidle', timeout: 60000 });
    previewNormal = (await page.locator('body').innerText()).includes('QA 茶飲');
    await page.screenshot({ path: path.join(shotDir, 'valid-builder-preview-flow.png'), fullPage: true });
    await page.close();
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  } finally {
    await browser.close();
  }

  const result = {
    ok: helper.storeNameValidation && helper.taglineValidation && helper.phoneOrLineValidation && helper.addressOrMapValidation && blocksInvalidStep3 && allowsValidStep3 && builderReceivesValidData && previewNormal,
    storeNameValidation: helper.storeNameValidation,
    taglineValidation: helper.taglineValidation,
    phoneOrLineValidation: helper.phoneOrLineValidation,
    addressOrMapValidation: helper.addressOrMapValidation,
    blocksInvalidStep3,
    allowsValidStep3,
    builderReceivesValidData,
    previewNormal,
    failed: errors,
  };
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ ok: result.ok, storeNameValidation: result.storeNameValidation, taglineValidation: result.taglineValidation, phoneOrLineValidation: result.phoneOrLineValidation, addressOrMapValidation: result.addressOrMapValidation, blocksInvalidStep3, allowsValidStep3, builderReceivesValidData, failed: result.failed }, null, 2));
  if (!result.ok) process.exit(1);
}

main().catch(error => {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(resultPath, JSON.stringify({ ok: false, failed: [error instanceof Error ? error.stack || error.message : String(error)] }, null, 2));
  console.error(error);
  process.exit(1);
});
