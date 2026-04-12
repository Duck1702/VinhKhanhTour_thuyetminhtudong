import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://localhost:5292';

function log(step, message) {
  console.log(`[${step}] ${message}`);
}

async function ensureRegisteredAndLoggedIn(context, email, password, fullName) {
  const registerRes = await context.request.post(`${baseUrl}/api/auth/register`, {
    data: { fullName, email, password }
  });

  if (!registerRes.ok()) {
    const body = await registerRes.json().catch(() => ({}));
    const msg = String(body?.message || '');
    if (!msg.includes('đã tồn tại') && !msg.toLowerCase().includes('exist')) {
      throw new Error(`Register failed: ${registerRes.status()} ${msg}`);
    }

    const loginRes = await context.request.post(`${baseUrl}/api/auth/login`, {
      data: { email, password }
    });

    if (!loginRes.ok()) {
      const loginBody = await loginRes.json().catch(() => ({}));
      throw new Error(`Login failed: ${loginRes.status()} ${loginBody?.message || ''}`);
    }
  }
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const email = `qa.merchant.${suffix}@example.com`;
    const password = 'Qa123456!';
    const fullName = `QA Merchant ${suffix}`;

    log('SETUP', `Account: ${email}`);
    await ensureRegisteredAndLoggedIn(context, email, password, fullName);

    log('STEP 1', 'Merchant đăng nhập -> soạn nội dung -> gửi đề xuất');
    await page.goto(`${baseUrl}/merchant.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#merchantLocationSelect', { timeout: 10000 });
    await page.waitForFunction(() => {
      const select = document.querySelector('#merchantLocationSelect');
      return Boolean(select && select.options && select.options.length > 0);
    }, null, { timeout: 10000 });

    const firstLocationValue = await page.locator('#merchantLocationSelect option').first().getAttribute('value');
    if (!firstLocationValue) {
      throw new Error('No location available to submit draft.');
    }

    const draftText = `QA draft content ${suffix}`;
    await page.selectOption('#merchantLocationSelect', firstLocationValue);
    await page.selectOption('#merchantLanguageSelect', 'en');
    await page.fill('#merchantShortIntro', `QA intro ${suffix}`);
    await page.fill('#merchantHighlight', `QA highlight ${suffix}`);
    await page.fill('#merchantDraftText', draftText);
    await page.click('#merchantSubmitBtn');

    await page.waitForSelector('#merchantSubmissionTable tbody tr', { timeout: 10000 });
    const merchantStatusBefore = await page.locator('#merchantSubmissionTable tbody tr').first().locator('td').nth(3).innerText();
    if (!merchantStatusBefore.includes('Chờ duyệt')) {
      throw new Error(`Expected initial status 'Chờ duyệt', got '${merchantStatusBefore}'.`);
    }

    const submissionId = await page.evaluate((text) => {
      const raw = localStorage.getItem('merchantDraftSubmissions') || '[]';
      const items = JSON.parse(raw);
      const match = items.find((x) => x && x.draftText === text);
      return match ? match.id : null;
    }, draftText);

    if (!submissionId) {
      throw new Error('Không tìm thấy submission vừa gửi trong localStorage.');
    }

    log('STEP 2', 'Admin duyệt/từ chối đề xuất');
    await page.goto(`${baseUrl}/admin.html#merchant-submissions`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#merchantSubmissionsTable tbody tr', { timeout: 10000 });

    const targetRow = page.locator('#merchantSubmissionsTable tbody tr', { hasText: fullName }).first();
    await targetRow.waitFor({ timeout: 10000 });
    await targetRow.locator('button[data-action="approve"]').click();

    await page.waitForTimeout(300);
    const adminStatusAfterApprove = await targetRow.locator('td').nth(4).innerText();
    if (!adminStatusAfterApprove.includes('Đã duyệt')) {
      throw new Error(`Expected admin status 'Đã duyệt', got '${adminStatusAfterApprove}'.`);
    }

    log('STEP 3', 'Quay lại merchant xác nhận trạng thái cập nhật');
    await page.goto(`${baseUrl}/merchant.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#merchantSubmissionTable tbody tr', { timeout: 10000 });

    const merchantStatusAfter = await page.evaluate((id) => {
      const raw = localStorage.getItem('merchantDraftSubmissions') || '[]';
      const items = JSON.parse(raw);
      const match = items.find((x) => x && x.id === id);
      return match ? { status: match.status || '', note: match.note || '' } : null;
    }, submissionId);

    if (!merchantStatusAfter || !String(merchantStatusAfter.status).includes('Đã duyệt')) {
      throw new Error(`Expected merchant submission status 'Đã duyệt', got '${merchantStatusAfter?.status || 'N/A'}'.`);
    }

    const merchantTableStatus = await page.locator('#merchantSubmissionTable tbody tr').first().locator('td').nth(3).innerText();
    if (!merchantTableStatus.includes('Đã duyệt')) {
      throw new Error(`Merchant table chưa hiển thị 'Đã duyệt', hiện tại '${merchantTableStatus}'.`);
    }

    const noteText = merchantStatusAfter.note;

    log('PASS', `Flow hoàn tất. Trạng thái cuối: ${merchantStatusAfter.status}. Ghi chú: ${noteText}`);
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(`[FAIL] ${error.message}`);
  process.exitCode = 1;
});
