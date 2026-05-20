import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import {
  validateOnboardingBasicInfo,
  isValidOnboardingLine,
  isValidOnboardingGoogleMap,
} from '../lib/onboardingValidation';

const baseUrl = (process.env.QA_BASE_URL || process.argv[2] || 'http://127.0.0.1:3053').replace(/\/$/, '');
const outDir = path.resolve('qa-artifacts/v0.3.1');
const resultPath = path.join(outDir, 'onboarding-basic-info-validation-result.json');
const shotDir = path.join(outDir, 'onboarding-basic-info-validation');

const validBase = {
  name: 'QA 茶飲',
  tagline: '每天一杯，日常更美好',
  phone: '02-2345-6789',
  line: '',
  address: '台北市中正區開封街一段 1 號',
  googleMap: '',
};

function checkHelperValidations() {
  const storeNameValidation = ['', ' ', '1', '123456', '!!!', 'test', '測試', 'aaa', 'qqq'].every(name => !validateOnboardingBasicInfo({ ...validBase, name }).ok)
    && validateOnboardingBasicInfo({ ...validBase, name: 'QA 茶飲' }).ok;
  const taglineValidation = ['', ' ', '1234', '!!!!', 'test', '測試', 'aaa', 'qqq'].every(tagline => !validateOnboardingBasicInfo({ ...validBase, tagline }).ok)
    && validateOnboardingBasicInfo({ ...validBase, tagline: 'Fresh drinks for everyday' }).ok
    && validateOnboardingBasicInfo({ ...validBase, tagline: 'Best coffee in town' }).ok;
  const lineFieldValidation = !isValidOnboardingLine('56545645645654')
    && !isValidOnboardingLine('123456')
    && !isValidOnboardingLine('aa')
    && !isValidOnboardingLine('!!!')
    && !isValidOnboardingLine('abc def')
    && !isValidOnboardingLine('http://fake-line.com/abc')
    && !isValidOnboardingLine('https://google.com')
    && isValidOnboardingLine('qa-line')
    && isValidOnboardingLine('https://line.me/R/ti/p/@qa')
    && isValidOnboardingLine('https://lin.ee/xxxx');
  const googleMapsFieldValidation = !isValidOnboardingGoogleMap('6546456546')
    && !isValidOnboardingGoogleMap('123456')
    && !isValidOnboardingGoogleMap('abc')
    && !isValidOnboardingGoogleMap('https://google.com')
    && !isValidOnboardingGoogleMap('https://example.com/map')
    && !isValidOnboardingGoogleMap('https://fake-map.com')
    && isValidOnboardingGoogleMap('https://maps.google.com')
    && isValidOnboardingGoogleMap('https://www.google.com/maps/place/QA')
    && isValidOnboardingGoogleMap('https://goo.gl/maps/abc')
    && isValidOnboardingGoogleMap('https://maps.app.goo.gl/abc');
  const phoneOrLineValidation = !validateOnboardingBasicInfo({ ...validBase, phone: '', line: '' }).ok
    && !validateOnboardingBasicInfo({ ...validBase, phone: '123456', line: '56545645645654' }).ok
    && validateOnboardingBasicInfo({ ...validBase, phone: '02-2345-6789', line: '' }).ok
    && validateOnboardingBasicInfo({ ...validBase, phone: '', line: 'qa-line' }).ok
    && validateOnboardingBasicInfo({ ...validBase, phone: '', line: 'https://line.me/R/ti/p/@qa' }).ok;
  const addressOrMapValidation = !validateOnboardingBasicInfo({ ...validBase, address: '', googleMap: '' }).ok
    && !validateOnboardingBasicInfo({ ...validBase, address: '12345', googleMap: '6546456546' }).ok
    && validateOnboardingBasicInfo({ ...validBase, address: '台北市中正區開封街一段 1 號', googleMap: '' }).ok
    && validateOnboardingBasicInfo({ ...validBase, address: '', googleMap: 'https://maps.google.com' }).ok;
  return {
    storeNameValidation,
    taglineValidation,
    phoneOrLineValidation,
    addressOrMapValidation,
    lineFieldValidation,
    googleMapsFieldValidation,
    phoneOrLineRequiresValidValue: phoneOrLineValidation,
    addressOrMapRequiresValidValue: addressOrMapValidation,
  };
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

async function fillStep3(page: any, values: Partial<typeof validBase>) {
  const data = { ...validBase, ...values };
  await page.getByRole('textbox', { name: '店名' }).fill(data.name);
  await page.getByRole('textbox', { name: '品牌標語' }).fill(data.tagline);
  await page.getByRole('textbox', { name: '電話' }).fill(data.phone);
  await page.getByRole('textbox', { name: '地址' }).fill(data.address);
  await page.getByRole('textbox', { name: 'LINE 連結' }).fill(data.line);
  await page.getByRole('textbox', { name: 'Google Maps 連結' }).fill(data.googleMap);
}

async function main() {
  fs.mkdirSync(shotDir, { recursive: true });
  const helper = checkHelperValidations();
  let blocksInvalidStep3 = false;
  let nextButtonBlockedWhenInvalid = false;
  let nextButtonDisabledWhenInvalid = false;
  let nextButtonDoesNotAdvanceWhenInvalid = false;
  let allowsValidStep3 = false;
  let builderReceivesValidData = false;
  let previewNormal = false;
  const failed: string[] = [];

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    await openStep3(page);
    await fillStep3(page, { phone: '123456', line: '56545645645654', address: '12345', googleMap: '6546456546' });
    await page.getByRole('button', { name: '下一步' }).click();
    await page.waitForTimeout(300);
    blocksInvalidStep3 = await page.getByTestId('onboarding-step-3').isVisible()
      && await page.getByText('請填寫有效的 LINE ID 或 LINE 連結。').isVisible()
      && await page.getByText('請填寫有效的 Google Maps 連結。').isVisible()
      && await page.getByText('請至少填寫有效的電話或 LINE，讓客人可以聯絡你。').isVisible()
      && await page.getByText('請至少填寫有效的地址或 Google Maps，讓客人找得到店家。').isVisible();
    const nextButton = page.getByRole('button', { name: '下一步' });
    const nextDisabled = await nextButton.isDisabled();
    const nextAriaDisabled = await nextButton.getAttribute('aria-disabled');
    const nextCursor = await nextButton.evaluate((el: HTMLButtonElement) => getComputedStyle(el).cursor);
    const nextBg = await nextButton.evaluate((el: HTMLButtonElement) => getComputedStyle(el).backgroundColor);
    await nextButton.click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(300);
    nextButtonDisabledWhenInvalid = nextDisabled && nextAriaDisabled === 'true' && nextCursor === 'not-allowed' && nextBg !== 'rgb(20, 184, 166)';
    nextButtonDoesNotAdvanceWhenInvalid = await page.getByTestId('onboarding-step-3').isVisible()
      && !(await page.getByTestId('onboarding-step-4').isVisible().catch(() => false));
    nextButtonBlockedWhenInvalid = blocksInvalidStep3 && nextButtonDisabledWhenInvalid && nextButtonDoesNotAdvanceWhenInvalid;
    await page.screenshot({ path: path.join(shotDir, 'invalid-line-map-next-blocked.png'), fullPage: true });

    await fillStep3(page, {
      name: 'QA 茶飲',
      tagline: 'Fresh drinks for everyday',
      phone: '',
      line: 'qa-line',
      address: '',
      googleMap: 'https://maps.google.com',
    });
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: '下一步' }).click();
    await page.getByTestId('onboarding-step-4').waitFor({ state: 'visible', timeout: 15000 });
    allowsValidStep3 = true;
    await page.getByRole('button', { name: '下一步' }).click();
    await page.getByTestId('onboarding-step-5').waitFor({ state: 'visible', timeout: 15000 });
    await page.getByTestId('complete-onboarding').click();
    await page.waitForURL(/\/builder/, { timeout: 20000 });
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('store-site-builder-data') || '{}'));
    builderReceivesValidData = stored?.store?.name === 'QA 茶飲'
      && stored?.store?.tagline === 'Fresh drinks for everyday'
      && stored?.links?.line === 'qa-line'
      && stored?.links?.googleMap === 'https://maps.google.com';
    await page.goto(`${baseUrl}/preview`, { waitUntil: 'networkidle', timeout: 60000 });
    previewNormal = (await page.locator('body').innerText()).includes('QA 茶飲');
    await page.screenshot({ path: path.join(shotDir, 'valid-step3-builder-preview.png'), fullPage: true });
    await page.close();
  } catch (error) {
    failed.push(error instanceof Error ? error.message : String(error));
  } finally {
    await browser.close();
  }

  const result = {
    ok: helper.storeNameValidation && helper.taglineValidation && helper.phoneOrLineValidation && helper.addressOrMapValidation && helper.lineFieldValidation && helper.googleMapsFieldValidation && helper.phoneOrLineRequiresValidValue && helper.addressOrMapRequiresValidValue && blocksInvalidStep3 && nextButtonBlockedWhenInvalid && nextButtonDisabledWhenInvalid && nextButtonDoesNotAdvanceWhenInvalid && allowsValidStep3 && builderReceivesValidData && previewNormal,
    storeNameValidation: helper.storeNameValidation,
    taglineValidation: helper.taglineValidation,
    phoneOrLineValidation: helper.phoneOrLineValidation,
    addressOrMapValidation: helper.addressOrMapValidation,
    lineFieldValidation: helper.lineFieldValidation,
    googleMapsFieldValidation: helper.googleMapsFieldValidation,
    nextButtonBlockedWhenInvalid,
    nextButtonDisabledWhenInvalid,
    nextButtonDoesNotAdvanceWhenInvalid,
    phoneOrLineRequiresValidValue: helper.phoneOrLineRequiresValidValue,
    addressOrMapRequiresValidValue: helper.addressOrMapRequiresValidValue,
    blocksInvalidStep3,
    allowsValidStep3,
    builderReceivesValidData,
    previewNormal,
    failed,
  };
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

main().catch(error => {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(resultPath, JSON.stringify({ ok: false, failed: [error instanceof Error ? error.stack || error.message : String(error)] }, null, 2));
  console.error(error);
  process.exit(1);
});
