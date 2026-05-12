import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:3050';
const outDir = path.join(process.cwd(), 'qa-artifacts', 'v0.3.0');
fs.mkdirSync(outDir, { recursive: true });

type Check = { name: string; ok: boolean; detail?: string };
const checks: Check[] = [];
const shot = async (page: any, name: string) => {
  const file = path.join(outDir, `${String(fs.readdirSync(outDir).filter(f => f.endsWith('.png')).length + 1).padStart(2, '0')}-${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
};
const add = (name: string, ok: boolean, detail = '') => checks.push({ name, ok, detail });

async function noHorizontalOverflow(page: any) {
  return await page.evaluate(`(() => {
    const root = document.scrollingElement || document.documentElement;
    return { scrollWidth: root.scrollWidth, clientWidth: root.clientWidth, overflow: root.scrollWidth - root.clientWidth };
  })()`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);

  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  await shot(page, 'home-desktop');
  add('Home brand title contains 店名片', (await page.locator('body').innerText()).includes('店名片'));
  add('Feature showcase exists', await page.locator('[data-testid="feature-showcase-section"]').isVisible());
  add('Pricing section exists', await page.locator('[data-testid="pricing-section"]').isVisible());
  add('FAQ section exists', await page.locator('[data-testid="faq-section"]').isVisible());

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  await shot(page, 'home-mobile-390');
  const homeOverflow = await noHorizontalOverflow(page);
  add('Home 390 no horizontal overflow', homeOverflow.overflow <= 1, JSON.stringify(homeOverflow));

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`${baseUrl}/builder?onboarding=1`, { waitUntil: 'networkidle' });
  add('Onboarding wizard opens from URL', await page.locator('[data-testid="onboarding-wizard"]').isVisible());
  await shot(page, 'wizard-step1-mobile');
  await page.locator('[data-testid="onboarding-step-1-industry"]').getByRole('button', { name: '咖啡廳' }).click();
  await page.getByRole('button', { name: '下一步' }).click();
  await shot(page, 'wizard-step2-recommendations');
  add('Recommended templates shown', (await page.locator('[data-testid="recommended-templates"]').innerText()).length > 0);
  await page.getByRole('button', { name: '極簡精品' }).click();
  await page.getByRole('button', { name: '下一步' }).click();
  await page.getByRole('textbox', { name: '店名' }).fill('QA 日常咖啡');
  await page.getByRole('textbox', { name: '一句話標語' }).fill('一杯咖啡，留住日常的光');
  await shot(page, 'wizard-step3-basic');
  await page.getByRole('button', { name: '下一步' }).click();
  await page.getByRole('button', { name: '我要申請店名片代管發布' }).click();
  await shot(page, 'wizard-step4-usage');
  await page.getByRole('button', { name: '下一步' }).click();
  await shot(page, 'wizard-step5-create');
  await page.getByRole('button', { name: '建立並進入 Builder' }).click();
  await page.waitForSelector('[data-testid="builder-shell"]');
  await shot(page, 'builder-after-wizard-mobile');
  add('Wizard applies store name', (await page.locator('body').innerText()).includes('QA 日常咖啡'));
  const wizardOverflow = await noHorizontalOverflow(page);
  add('Wizard/Builder 390 no horizontal overflow', wizardOverflow.overflow <= 1, JSON.stringify(wizardOverflow));

  page.once('dialog', dialog => dialog.accept());
  await page.locator('select').first().selectOption('basic');
  await page.getByRole('button', { name: '套用飲料店範例' }).click();
  await page.waitForTimeout(500);
  add('Demo data applied', (await page.locator('body').innerText()).includes('日沐茶飲'));
  await shot(page, 'demo-data-applied');

  await page.locator('select').first().selectOption('export');
  await page.waitForSelector('[data-testid="publish-center"]');
  await shot(page, 'publish-center-mobile');
  const scoreText = await page.locator('[data-testid="publish-readiness-score"]').innerText();
  add('Publish readiness score visible', /\d+%/.test(scoreText), scoreText);
  await page.getByRole('button', { name: '申請店名片代管發布' }).click();
  await page.waitForSelector('[data-testid="hosting-request-modal"]');
  await page.getByLabel('聯絡人姓名').fill('QA Barry');
  await page.getByLabel('Email').fill('qa@example.com');
  await page.getByRole('button', { name: '預覽申請內容' }).click();
  await shot(page, 'hosting-request-modal');
  const requestText = await page.locator('[data-testid="hosting-request-generated"]').innerText();
  add('Hosting request JSON generated', requestText.includes('denmeipian-hosting-request') && requestText.includes('日沐茶飲'));

  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto(`${baseUrl}/builder`, { waitUntil: 'networkidle' });
  await shot(page, 'builder-desktop');
  add('Desktop builder layout visible', await page.locator('[data-testid="builder-sidebar"]').isVisible() && await page.locator('[data-testid="builder-preview-column"]').isVisible());

  await page.goto(`${baseUrl}/__version`, { waitUntil: 'networkidle' });
  await shot(page, 'version-page');
  const versionText = await page.locator('body').innerText();
  add('__version is v0.3.0', versionText.includes('v0.3.0'));

  await browser.close();

  const result = { ok: checks.every(c => c.ok), baseUrl, outDir, total: checks.length, passed: checks.filter(c => c.ok).length, failed: checks.filter(c => !c.ok).length, checks };
  fs.writeFileSync(path.join(outDir, 'qa-onboarding-hosting-result.json'), JSON.stringify(result, null, 2));
  fs.writeFileSync(path.join(outDir, 'qa-onboarding-hosting-summary.md'), `# 店名片 v0.3.0 QA\n\n- Base URL: ${baseUrl}\n- Result: ${result.ok ? 'PASS' : 'FAIL'}\n- Passed: ${result.passed}/${result.total}\n\n${checks.map(c => `- ${c.ok ? '✅' : '❌'} ${c.name}${c.detail ? ` — ${c.detail}` : ''}`).join('\n')}\n`);
  if (!result.ok) process.exitCode = 1;
}

main().catch(error => { console.error(error); process.exit(1); });
