const merchantRefreshBtn = document.getElementById('merchantRefreshBtn');
const merchantLogoutBtn = document.getElementById('merchantLogoutBtn');

const merchantUserName = document.getElementById('merchantUserName');
const merchantUserEmail = document.getElementById('merchantUserEmail');
const merchantMetricVisits = document.getElementById('merchantMetricVisits');
const merchantMetricNarrations = document.getElementById('merchantMetricNarrations');
const merchantMetricRoutes = document.getElementById('merchantMetricRoutes');

const merchantForm = document.getElementById('merchantForm');
const merchantLocationSelect = document.getElementById('merchantLocationSelect');
const merchantRequestType = document.getElementById('merchantRequestType');
const merchantRequestTitle = document.getElementById('merchantRequestTitle');
const merchantCampaignStart = document.getElementById('merchantCampaignStart');
const merchantCampaignEnd = document.getElementById('merchantCampaignEnd');
const merchantLanguageSelect = document.getElementById('merchantLanguageSelect');
const merchantShortIntro = document.getElementById('merchantShortIntro');
const merchantHighlight = document.getElementById('merchantHighlight');
const merchantDraftText = document.getElementById('merchantDraftText');
const merchantSaveDraftBtn = document.getElementById('merchantSaveDraftBtn');
const merchantSubmitBtn = document.getElementById('merchantSubmitBtn');

const merchantQrImage = document.getElementById('merchantQrImage');
const merchantQrLink = document.getElementById('merchantQrLink');
const merchantPreviewBtn = document.getElementById('merchantPreviewBtn');
const merchantPreviewStatus = document.getElementById('merchantPreviewStatus');
const merchantAudioPlayer = document.getElementById('merchantAudioPlayer');
const merchantSubmissionTable = document.getElementById('merchantSubmissionTable');

const DRAFT_STORAGE_KEY = 'merchantDraftByLocation';

let allLocations = [];
let currentAccount = null;

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizeLanguage(input) {
  const supported = new Set(['vi', 'en', 'fr', 'ja', 'ko']);
  const value = String(input || 'vi').trim().toLowerCase();
  return supported.has(value) ? value : 'vi';
}

function getDraftStore() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveDraftStore(store) {
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(store));
}

function getSelectedLocation() {
  const id = merchantLocationSelect?.value;
  return allLocations.find((x) => x.id === id) || null;
}

function buildRichNarrationText(location, shortIntro, highlight) {
  const safe = (value) => String(value || '').trim();
  const parts = [
    `${safe(location.name)} là quán thuộc nhóm ${safe(location.category)} trên phố ẩm thực Vĩnh Khánh.`,
    `Địa chỉ: ${safe(location.address)}.`,
    `Giờ mở cửa: ${safe(location.openingHours)}.`,
    location.priceRange ? `Mức giá tham khảo: ${safe(location.priceRange)}.` : '',
    `Điểm nổi bật: ${safe(highlight || location.highlight)}.`,
    location.dishSamples ? `Món nên thử: ${safe(location.dishSamples)}.` : '',
    `Thời điểm phù hợp để ghé quán: ${safe(location.bestTime)}.`,
    `Tổng quan: ${safe(shortIntro || location.shortIntro)}.`,
    safe(location.descriptionVi)
  ];

  return parts.filter(Boolean).join(' ');
}

function buildQrUrl(locationId, language) {
  const url = new URL('/scan-narration.html', window.location.origin);
  url.searchParams.set('locationId', locationId);
  url.searchParams.set('lang', normalizeLanguage(language));
  url.searchParams.set('v', '20260412-merchant-1');
  return url.toString();
}

function updateQrPreview() {
  const location = getSelectedLocation();
  if (!location || !merchantQrImage || !merchantQrLink || !merchantLanguageSelect) {
    return;
  }

  const shareUrl = buildQrUrl(location.id, merchantLanguageSelect.value);
  const qrApi = new URL('https://api.qrserver.com/v1/create-qr-code/');
  qrApi.searchParams.set('size', '260x260');
  qrApi.searchParams.set('data', shareUrl);

  merchantQrImage.src = qrApi.toString();
  merchantQrLink.href = shareUrl;
  merchantQrLink.textContent = shareUrl;
}

async function renderSubmissionTable() {
  if (!merchantSubmissionTable) {
    return;
  }

  let items = [];
  try {
    const response = await fetch('/api/merchant/requests');
    if (!response.ok) {
      throw new Error('Không tải được lịch sử đề xuất.');
    }
    items = await response.json();
  } catch (error) {
    merchantSubmissionTable.innerHTML = `
      <thead>
        <tr>
          <th>Thời gian</th>
          <th>Loại</th>
          <th>Tiêu đề</th>
          <th>Trạng thái</th>
          <th>Phản hồi admin</th>
        </tr>
      </thead>
      <tbody>
        <tr><td colspan="5">${escapeHtml(error?.message || 'Không tải được dữ liệu.')}</td></tr>
      </tbody>
    `;
    return;
  }

  merchantSubmissionTable.innerHTML = `
    <thead>
      <tr>
        <th>Thời gian</th>
        <th>Loại</th>
        <th>Tiêu đề</th>
        <th>Trạng thái</th>
        <th>Phản hồi admin</th>
      </tr>
    </thead>
    <tbody>
      ${items.length === 0 ? '<tr><td colspan="5">Chưa có đề xuất nào.</td></tr>' : items.map((item) => `
        <tr>
          <td>${escapeHtml(new Date(item.createdAt).toLocaleString('vi-VN'))}</td>
          <td>${escapeHtml(item.requestType || 'other')}</td>
          <td>${escapeHtml(item.title || '-')}</td>
          <td>${escapeHtml(item.status || 'pending')}</td>
          <td>${escapeHtml(item.adminResponse || '')}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
}

function fillEditorFromLocation() {
  const location = getSelectedLocation();
  if (!location) {
    return;
  }

  const store = getDraftStore();
  const saved = store[location.id];

  if (saved) {
    merchantShortIntro.value = saved.shortIntro || location.shortIntro || '';
    merchantHighlight.value = saved.highlight || location.highlight || '';
    merchantDraftText.value = saved.draftText || buildRichNarrationText(location, merchantShortIntro.value, merchantHighlight.value);
    merchantLanguageSelect.value = normalizeLanguage(saved.language);
  } else {
    merchantShortIntro.value = location.shortIntro || '';
    merchantHighlight.value = location.highlight || '';
    merchantDraftText.value = buildRichNarrationText(location, merchantShortIntro.value, merchantHighlight.value);
  }

  updateQrPreview();
}

function saveDraftLocally() {
  const location = getSelectedLocation();
  if (!location) {
    return;
  }

  const store = getDraftStore();
  store[location.id] = {
    shortIntro: merchantShortIntro.value.trim(),
    highlight: merchantHighlight.value.trim(),
    draftText: merchantDraftText.value.trim(),
    language: normalizeLanguage(merchantLanguageSelect.value),
    updatedAt: new Date().toISOString()
  };
  saveDraftStore(store);
  alert('Đã lưu bản nháp cục bộ cho quán này.');
}

async function submitSuggestion() {
  const location = getSelectedLocation();
  if (!location || !currentAccount?.email) {
    return;
  }

  const text = merchantDraftText.value.trim();
  const title = merchantRequestTitle?.value.trim() || '';
  const requestType = merchantRequestType?.value || 'edit-info';
  if (!text) {
    alert('Bạn cần nhập nội dung thuyết minh đề xuất.');
    return;
  }

  if (!title) {
    alert('Bạn cần nhập tiêu đề yêu cầu.');
    return;
  }

  const payload = {
    locationId: location.id,
    requestType,
    title,
    campaignStartAt: merchantCampaignStart?.value ? new Date(merchantCampaignStart.value).toISOString() : null,
    campaignEndAt: merchantCampaignEnd?.value ? new Date(merchantCampaignEnd.value).toISOString() : null,
    description: [
      `Ngôn ngữ: ${normalizeLanguage(merchantLanguageSelect.value)}`,
      `Giới thiệu ngắn: ${merchantShortIntro.value.trim()}`,
      `Điểm nổi bật: ${merchantHighlight.value.trim()}`,
      `Nội dung đề xuất: ${text}`
    ].filter(Boolean).join('\n')
  };

  const response = await fetch('/api/merchant/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result?.message || 'Không gửi được yêu cầu tới admin.');
  }

  await renderSubmissionTable();
  alert('Đã gửi đề xuất sang trang Admin để duyệt.');
}

async function previewNarration() {
  const location = getSelectedLocation();
  if (!location || !merchantAudioPlayer) {
    return;
  }

  merchantPreviewBtn.disabled = true;
  merchantPreviewStatus.textContent = 'Đang tạo audio xem trước...';

  try {
    const payload = {
      locationId: location.id,
      targetLanguage: normalizeLanguage(merchantLanguageSelect.value)
    };

    const response = await fetch('/api/public/narrations/instant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok || !result?.audioUrl) {
      throw new Error(result?.detail || result?.message || 'Không tạo được audio xem trước.');
    }

    merchantAudioPlayer.src = result.audioUrl;
    merchantAudioPlayer.load();
    merchantPreviewStatus.textContent = `Sẵn sàng phát audio (${result.voiceName || 'default'}).`;

    try {
      await merchantAudioPlayer.play();
      merchantPreviewStatus.textContent = `Đang phát audio xem trước (${result.voiceName || 'default'}).`;
    } catch {
      merchantPreviewStatus.textContent = 'Audio đã sẵn sàng, bấm nút Play để nghe.';
    }
  } catch (error) {
    merchantPreviewStatus.textContent = error?.message || 'Không thể tạo audio xem trước.';
  } finally {
    merchantPreviewBtn.disabled = false;
  }
}

async function loadMerchantAccount() {
  const meRes = await fetch('/api/auth/me');
  if (!meRes.ok) {
    const lang = normalizeLanguage(new URLSearchParams(window.location.search).get('lang'));
    window.location.href = `/login.html?lang=${encodeURIComponent(lang)}&returnUrl=${encodeURIComponent('/merchant.html')}`;
    throw new Error('redirect-login');
  }

  currentAccount = await meRes.json();

  if (merchantUserName) {
    merchantUserName.textContent = currentAccount.fullName || currentAccount.email;
  }
  if (merchantUserEmail) {
    merchantUserEmail.textContent = currentAccount.email || '';
  }

  const dashboardRes = await fetch('/api/account/dashboard');
  if (dashboardRes.ok) {
    const dashboard = await dashboardRes.json();
    merchantMetricVisits.textContent = String(dashboard?.metrics?.totalVisits ?? 0);
    merchantMetricNarrations.textContent = String(dashboard?.metrics?.totalNarrations ?? 0);
    merchantMetricRoutes.textContent = String(dashboard?.metrics?.totalRoutes ?? 0);
  }
}

async function loadLocations() {
  const response = await fetch('/api/locations');
  if (!response.ok) {
    throw new Error('Không tải được danh sách quán.');
  }

  allLocations = await response.json();
  merchantLocationSelect.innerHTML = allLocations.map((item) => `
    <option value="${escapeHtml(item.id)}">${escapeHtml(item.name)} - ${escapeHtml(item.category)}</option>
  `).join('');

  fillEditorFromLocation();
}

async function refreshPage() {
  await loadMerchantAccount();
  await loadLocations();
  await renderSubmissionTable();
}

merchantLocationSelect?.addEventListener('change', fillEditorFromLocation);
merchantLanguageSelect?.addEventListener('change', updateQrPreview);
merchantSaveDraftBtn?.addEventListener('click', saveDraftLocally);
merchantPreviewBtn?.addEventListener('click', previewNarration);
merchantRefreshBtn?.addEventListener('click', () => {
  void refreshPage().catch((error) => {
    if (String(error?.message || '').includes('redirect-login')) {
      return;
    }
    alert(error?.message || 'Không tải lại được dữ liệu.');
  });
});

merchantForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  void submitSuggestion().catch((error) => {
    alert(error?.message || 'Không gửi được yêu cầu.');
  });
});

merchantLogoutBtn?.addEventListener('click', async () => {
  merchantLogoutBtn.setAttribute('disabled', 'disabled');
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } finally {
    window.location.href = '/login.html';
  }
});

void refreshPage().catch((error) => {
  if (String(error?.message || '').includes('redirect-login')) {
    return;
  }
  alert(error?.message || 'Không khởi tạo được cổng chủ quán.');
});
