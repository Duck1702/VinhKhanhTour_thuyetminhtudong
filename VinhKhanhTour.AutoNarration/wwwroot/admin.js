const adminKeyInput = document.getElementById('adminKey');
const saveAdminKeyBtn = document.getElementById('saveAdminKey');
const refreshAllBtn = document.getElementById('refreshAll');
const dashboardStats = document.getElementById('dashboardStats');
const userTrafficStats = document.getElementById('userTrafficStats');
const listensByLocationTable = document.getElementById('listensByLocationTable');

const locationForm = document.getElementById('locationForm');
const approveLocationBtn = document.getElementById('approveLocation');
const deleteLocationBtn = document.getElementById('deleteLocation');
const locationsTable = document.getElementById('locationsTable');

const voiceForm = document.getElementById('voiceForm');
const deleteVoiceBtn = document.getElementById('deleteVoice');
const voicesTable = document.getElementById('voicesTable');

const templateForm = document.getElementById('templateForm');
const deleteTemplateBtn = document.getElementById('deleteTemplate');
const templatesTable = document.getElementById('templatesTable');

const adminNarrationForm = document.getElementById('adminNarrationForm');
const adminNarrationLocation = document.getElementById('adminNarrationLocation');
const adminNarrationTemplate = document.getElementById('adminNarrationTemplate');
const adminNarrationLanguage = document.getElementById('adminNarrationLanguage');
const adminNarrationRate = document.getElementById('adminNarrationRate');
const adminNarrationVoice = document.getElementById('adminNarrationVoice');
const adminNarrationText = document.getElementById('adminNarrationText');
const adminNarrationSubmit = document.getElementById('adminNarrationSubmit');
const adminNarrationResult = document.getElementById('adminNarrationResult');
const adminTranslatedText = document.getElementById('adminTranslatedText');

// Real-time participant tracking
function initializeParticipantTracking() {
  const basePart = localStorage.getItem('participantId') || Math.random().toString(36).substr(2, 9);
  localStorage.setItem('participantId', basePart);
  const participantId = 'admin_' + basePart;
  
  // Send heartbeat every 20 seconds
  setInterval(() => {
    fetch('/api/public/live-participants/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participantId: participantId }),
      keepalive: true
    }).catch(() => {}); // Silently fail if endpoint not available
  }, 20000);
  
  // Also send heartbeat on page visibility change
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      fetch('/api/public/live-participants/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: participantId }),
        keepalive: true
      }).catch(() => {});
    }
  });
}

initializeParticipantTracking();

const adminUsedVoice = document.getElementById('adminUsedVoice');
const adminAudioPlayer = document.getElementById('adminAudioPlayer');
const adminAudioLink = document.getElementById('adminAudioLink');

const aiLogsTable = document.getElementById('aiLogsTable');
const visitLogsTable = document.getElementById('visitLogsTable');
const merchantSubmissionsTable = document.getElementById('merchantSubmissionsTable');
const refreshMerchantSubmissionsBtn = document.getElementById('refreshMerchantSubmissions');

const locationFields = {
  id: document.getElementById('locationId'),
  name: document.getElementById('locationName'),
  category: document.getElementById('locationCategory'),
  address: document.getElementById('locationAddress'),
  openingHours: document.getElementById('locationOpeningHours'),
  shortIntro: document.getElementById('locationShortIntro'),
  bestTime: document.getElementById('locationBestTime'),
  latitude: document.getElementById('locationLatitude'),
  longitude: document.getElementById('locationLongitude'),
  highlight: document.getElementById('locationHighlight'),
  descriptionVi: document.getElementById('locationDescriptionVi'),
  narrationDraftVi: document.getElementById('locationNarrationDraft'),
  narrationPublicVi: document.getElementById('locationNarrationPublic'),
  dishSamples: document.getElementById('locationDishSamples')
};

const voiceFields = {
  id: document.getElementById('voiceId'),
  scenario: document.getElementById('voiceScenario'),
  language: document.getElementById('voiceLanguage'),
  voiceName: document.getElementById('voiceNameAdmin'),
  isActive: document.getElementById('voiceActive')
};

const templateFields = {
  id: document.getElementById('templateId'),
  locationId: document.getElementById('templateLocationId'),
  title: document.getElementById('templateTitle'),
  sourceTextVi: document.getElementById('templateText'),
  targetLanguage: document.getElementById('templateLanguage'),
  voiceName: document.getElementById('templateVoice'),
  audioUrl: document.getElementById('templateAudioUrl'),
  isPublished: document.getElementById('templatePublished')
};

let adminNarrationLocations = [];
let adminNarrationTemplates = [];

adminKeyInput.value = localStorage.getItem('adminKey') ?? '';

function getAdminKey() {
  const inputVal = adminKeyInput.value.trim();
  const storedVal = localStorage.getItem('adminKey');
  const finalKey = inputVal || storedVal || 'dev-admin-123';
  console.log('🔑 Admin Key Debug:', { inputVal, storedVal, finalKey });
  return finalKey;
}

async function adminFetch(url, options = {}) {
  const key = getAdminKey();
  console.log('📡 Sending request to:', url, 'with key:', key);
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': key,
      ...(options.headers ?? {})
    }
  });

  if (response.status === 401) {
    console.error('❌ 401 Unauthorized. Key was:', key);
    throw new Error('Sai Admin API Key.');
  }

  if (!response.ok) {
    let message = `Request lỗi (${response.status})`;
    try {
      const body = await response.json();
      message = body.detail ?? body.message ?? message;
    } catch {
      // no-op
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function toCurrency(value) {
  const number = Number(value) || 0;
  return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function toCurrencyVnd(value) {
  const number = Number(value) || 0;
  return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

function safe(text) {
  return String(text ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatLocalDateTime(value) {
  if (!value) {
    return '-';
  }

  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) {
    return '-';
  }

  return dt.toLocaleString('vi-VN');
}

function toInputDateTimeLocal(value) {
  if (!value) {
    return '';
  }

  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) {
    return '';
  }

  const pad = (x) => String(x).padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

function fillForm(fields, data) {
  Object.keys(fields).forEach((key) => {
    if (fields[key].tagName === 'SELECT') {
      fields[key].value = String(data[key]);
    } else {
      fields[key].value = data[key] ?? '';
    }
  });
}

function buildNarrationTextFromLocation(location) {
  return `${location.name}. ${location.category}. ${location.shortIntro} ${location.highlight}. ${location.descriptionVi}`;
}

function fillAdminNarrationLocations(locations) {
  if (!adminNarrationLocation) {
    return;
  }

  if (!locations.length) {
    adminNarrationLocation.innerHTML = '<option value="">Chưa có địa điểm</option>';
    return;
  }

  adminNarrationLocation.innerHTML = locations
    .map((location) => `<option value="${safe(location.id)}">${safe(location.name)} - ${safe(location.category)}</option>`)
    .join('');
}

function fillAdminNarrationTemplates(templates) {
  if (!adminNarrationTemplate) {
    return;
  }

  adminNarrationTemplate.innerHTML = `
    <option value="">Không dùng template</option>
    ${templates
      .map((template) => `<option value="${safe(template.id)}">${safe(template.title)} (${safe(template.targetLanguage)})</option>`)
      .join('')}
  `;
}

async function loadAdminNarrationSources() {
  if (!adminNarrationLocation || !adminNarrationTemplate) {
    return;
  }

  const [locationsResponse, templatesResponse] = await Promise.all([
    fetch('/api/locations'),
    fetch('/api/narration-templates')
  ]);

  if (!locationsResponse.ok) {
    throw new Error('Không tải được danh sách địa điểm cho TTS.');
  }

  adminNarrationLocations = await locationsResponse.json();
  fillAdminNarrationLocations(adminNarrationLocations);

  if (templatesResponse.ok) {
    adminNarrationTemplates = await templatesResponse.json();
  } else {
    adminNarrationTemplates = [];
  }

  fillAdminNarrationTemplates(adminNarrationTemplates);

  if (adminNarrationLocations.length && adminNarrationText && !adminNarrationText.value.trim()) {
    adminNarrationText.value = buildNarrationTextFromLocation(adminNarrationLocations[0]);
  }
}

async function generateAdminNarration() {
  if (!adminNarrationLocation || !adminNarrationLanguage || !adminNarrationRate || !adminNarrationVoice || !adminNarrationText) {
    return;
  }

  const payload = {
    locationId: adminNarrationLocation.value,
    customTextVi: adminNarrationText.value.trim() || null,
    targetLanguage: adminNarrationLanguage.value,
    voiceName: adminNarrationVoice.value.trim() || null,
    speakingRate: Number.parseFloat(adminNarrationRate.value) || 1
  };

  const response = await fetch('/api/narrations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.detail || result.message || 'Tạo audio thất bại.');
  }

  if (adminNarrationResult) {
    adminNarrationResult.classList.remove('hidden');
  }
  if (adminTranslatedText) {
    adminTranslatedText.textContent = result.translatedText;
  }
  if (adminUsedVoice) {
    adminUsedVoice.textContent = result.voiceName;
  }
  if (adminAudioPlayer) {
    adminAudioPlayer.src = result.audioUrl;
  }
  if (adminAudioLink) {
    adminAudioLink.href = result.audioUrl;
    adminAudioLink.textContent = `Mở file audio: ${result.audioUrl}`;
  }
}

async function loadDashboard() {
  const data = await adminFetch('/api/admin/dashboard');
  console.log('Dashboard data:', data);
  console.log('Daily visits:', data.dailyVisits);
  dashboardStats.innerHTML = [
    { label: 'Địa điểm', value: data.locationCount },
    { label: 'Public', value: data.publishedLocationCount },
    { label: 'Voice profile', value: data.voiceProfileCount },
    { label: 'Template', value: data.templateCount },
    { label: 'Lượt tạo audio', value: data.narrationCount },
    { label: 'Chi phí AI (ước tính)', value: toCurrency(data.totalEstimatedCostUsd) },
    { label: 'Lượt truy cập', value: data.totalVisits }
  ].map((item) => `
    <div class="stat-card">
      <div class="value">${safe(item.value)}</div>
      <div class="label">${safe(item.label)}</div>
    </div>
  `).join('');

  if (userTrafficStats) {
    userTrafficStats.innerHTML = [
      { label: 'Truy cập 7 ngày', value: data.visitsThisWeek ?? 0 },
      { label: 'Truy cập 30 ngày', value: data.visitsThisMonth ?? 0 },
      { label: 'Người dùng hiện thời', value: data.activeParticipantsNow ?? 0 },
      { label: 'Tổng lượt nghe', value: data.totalListenCount ?? 0 },
      { label: 'Doanh thu nghe', value: toCurrencyVnd(data.totalRevenueVnd ?? 0) }
    ].map((item) => `
      <div class="stat-card">
        <div class="value">${safe(item.value)}</div>
        <div class="label">${safe(item.label)}</div>
      </div>
    `).join('');
  }

  if (listensByLocationTable) {
    const rows = Array.isArray(data.listensByLocation) ? data.listensByLocation : [];
    listensByLocationTable.innerHTML = `
      <thead>
        <tr>
          <th>Quán ăn</th>
          <th>Lượt nghe</th>
          <th>Doanh thu</th>
          <th>Lần nghe gần nhất</th>
        </tr>
      </thead>
      <tbody>
        ${rows.length === 0 ? '<tr><td colspan="4">Chưa có dữ liệu lượt nghe trả phí.</td></tr>' : rows.map((row) => `
          <tr>
            <td>${safe(row.locationName || row.locationId || '-')}</td>
            <td>${safe(row.listenCount ?? 0)}</td>
            <td>${safe(toCurrencyVnd(row.revenueVnd ?? 0))}</td>
            <td>${safe(formatLocalDateTime(row.lastListenedAt))}</td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  // Render daily visits chart
  if (data.dailyVisits && Array.isArray(data.dailyVisits)) {
    renderDailyVisitsChart(data.dailyVisits);
  }
}

function renderDailyVisitsChart(dailyVisits) {
  const canvas = document.getElementById('dailyVisitsChart');
  if (!canvas || !window.Chart) {
    return;
  }

  // Destroy existing chart if it exists
  if (window.dailyVisitsChartInstance) {
    window.dailyVisitsChartInstance.destroy();
  }

  const dates = dailyVisits.map(d => {
    const date = new Date(d.date);
    return date.toLocaleDateString('vi-VN', { weekday: 'short', month: 'short', day: 'numeric' });
  });

  const visits = dailyVisits.map(d => d.visits);

  window.dailyVisitsChartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: dates,
      datasets: [{
        label: 'Số lượt truy cập',
        data: visits,
        backgroundColor: '#d4af37',
        borderColor: '#c9a227',
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: '#e5c158'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#333',
            font: {
              family: "'Be Vietnam Pro', sans-serif",
              size: 14,
              weight: '500'
            },
            padding: 15
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#666',
            font: {
              family: "'Be Vietnam Pro', sans-serif",
              size: 12
            }
          }
        },
        y: {
          grid: {
            display: false
          },
          ticks: {
            color: '#666',
            font: {
              family: "'Be Vietnam Pro', sans-serif",
              size: 12
            }
          }
        }
      }
    }
  });
  
  console.log('Chart rendered with data:', visits, 'Labels:', dates);
}

async function loadLocations() {
  const data = await adminFetch('/api/admin/locations');
  locationsTable.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Tên</th>
        <th>Danh mục</th>
        <th>Public</th>
        <th>Cập nhật</th>
      </tr>
    </thead>
    <tbody>
      ${(data ?? []).map((item) => `
      <tr data-id="${safe(item.id)}">
        <td>${safe(item.id)}</td>
        <td>${safe(item.name)}</td>
        <td>${safe(item.category)}</td>
        <td>${item.isPublished ? 'Yes' : 'No'}</td>
        <td>${safe(new Date(item.updatedAt).toLocaleString('vi-VN'))}</td>
      </tr>`).join('')}
    </tbody>
  `;

  locationsTable.querySelectorAll('tbody tr').forEach((row) => {
    row.addEventListener('click', () => {
      const id = row.dataset.id;
      const item = data.find((x) => x.id === id);
      if (!item) {
        return;
      }

      fillForm(locationFields, item);
      locationFields.id.value = item.id;
      locationFields.narrationPublicVi.value = item.narrationPublicVi ?? '';
    });
  });
}

async function loadVoices() {
  const data = await adminFetch('/api/admin/voice-profiles');
  voicesTable.innerHTML = `
    <thead><tr><th>ID</th><th>Scenario</th><th>Lang</th><th>Voice</th><th>Active</th></tr></thead>
    <tbody>
      ${(data ?? []).map((item) => `
      <tr data-id="${safe(item.id)}">
        <td>${safe(item.id)}</td>
        <td>${safe(item.scenario)}</td>
        <td>${safe(item.language)}</td>
        <td>${safe(item.voiceName)}</td>
        <td>${item.isActive ? 'Yes' : 'No'}</td>
      </tr>`).join('')}
    </tbody>
  `;

  voicesTable.querySelectorAll('tbody tr').forEach((row) => {
    row.addEventListener('click', () => {
      const id = row.dataset.id;
      const item = data.find((x) => x.id === id);
      if (!item) {
        return;
      }

      fillForm(voiceFields, {
        ...item,
        isActive: item.isActive ? 'true' : 'false'
      });
    });
  });
}

async function loadTemplates() {
  const data = await adminFetch('/api/admin/narration-templates');
  templatesTable.innerHTML = `
    <thead><tr><th>ID</th><th>Title</th><th>Lang</th><th>Public</th><th>Updated</th></tr></thead>
    <tbody>
      ${(data ?? []).map((item) => `
      <tr data-id="${safe(item.id)}">
        <td>${safe(item.id)}</td>
        <td>${safe(item.title)}</td>
        <td>${safe(item.targetLanguage)}</td>
        <td>${item.isPublished ? 'Yes' : 'No'}</td>
        <td>${safe(new Date(item.updatedAt).toLocaleString('vi-VN'))}</td>
      </tr>`).join('')}
    </tbody>
  `;

  templatesTable.querySelectorAll('tbody tr').forEach((row) => {
    row.addEventListener('click', () => {
      const id = row.dataset.id;
      const item = data.find((x) => x.id === id);
      if (!item) {
        return;
      }

      fillForm(templateFields, {
        ...item,
        isPublished: item.isPublished ? 'true' : 'false'
      });
    });
  });
}

async function loadLogs() {
  const [aiLogs, visitLogs] = await Promise.all([
    adminFetch('/api/admin/logs/ai?take=120'),
    adminFetch('/api/admin/logs/visits?take=120')
  ]);

  aiLogsTable.innerHTML = `
    <thead><tr><th>Time</th><th>Location</th><th>Lang</th><th>Voice</th><th>Chars</th><th>Cost</th></tr></thead>
    <tbody>
      ${(aiLogs ?? []).map((x) => `
      <tr>
        <td>${safe(new Date(x.generatedAt).toLocaleString('vi-VN'))}</td>
        <td>${safe(x.locationId ?? '-')}</td>
        <td>${safe(x.targetLanguage)}</td>
        <td>${safe(x.voiceName)}</td>
        <td>${safe(x.sourceChars + x.outputChars)}</td>
        <td>${safe(toCurrency(x.estimatedCostUsd))}</td>
      </tr>`).join('')}
    </tbody>
  `;

  visitLogsTable.innerHTML = `
    <thead><tr><th>Time</th><th>Path</th><th>Method</th><th>User-Agent</th></tr></thead>
    <tbody>
      ${(visitLogs ?? []).map((x) => `
      <tr>
        <td>${safe(new Date(x.visitedAt).toLocaleString('vi-VN'))}</td>
        <td>${safe(x.path)}</td>
        <td>${safe(x.method)}</td>
        <td>${safe(x.userAgent)}</td>
      </tr>`).join('')}
    </tbody>
  `;
}

async function updateMerchantSubmissionStatus(id, action) {
  if (!id || (action !== 'approve' && action !== 'reject')) {
    return;
  }

  if (action === 'approve') {
    await adminFetch(`/api/admin/merchant-requests/${encodeURIComponent(id)}/approve`, { method: 'POST' });
    await renderMerchantSubmissions();
    return;
  }

  const responseText = prompt('Nhập lý do từ chối (gửi lại cho chủ quán):', 'Nội dung chưa đạt, vui lòng chỉnh sửa và gửi lại.');
  if (responseText === null) {
    return;
  }

  const query = responseText.trim()
    ? `?response=${encodeURIComponent(responseText.trim())}`
    : '';
  await adminFetch(`/api/admin/merchant-requests/${encodeURIComponent(id)}/reject${query}`, { method: 'POST' });
  await renderMerchantSubmissions();
}

async function renderMerchantSubmissions() {
  if (!merchantSubmissionsTable) {
    return;
  }

  const items = await adminFetch('/api/admin/merchant-requests');

  merchantSubmissionsTable.innerHTML = `
    <thead>
      <tr>
        <th>Thời gian</th>
        <th>Loại</th>
        <th>Tiêu đề</th>
        <th>Chủ quán</th>
        <th>Quán</th>
        <th>Trạng thái</th>
        <th>Pin / Priority</th>
        <th>Thời gian chạy</th>
        <th>Phản hồi</th>
        <th>Hành động</th>
      </tr>
    </thead>
    <tbody>
      ${items.length === 0 ? '<tr><td colspan="10">Chưa có đề xuất nào từ chủ quán.</td></tr>' : items.map((item) => `
        <tr>
          <td>${safe(new Date(item.createdAt).toLocaleString('vi-VN'))}</td>
          <td>${safe(item.requestType || 'other')}</td>
          <td>${safe(item.title || '-')}</td>
          <td>${safe(item.merchantName || item.merchantEmail || '-')}</td>
          <td>${safe(item.locationName || item.locationId || '-')}</td>
          <td>${safe(item.status || 'pending')}</td>
          <td>${item.isPinnedTop ? 'TOP' : '-'} / ${safe(item.priorityScore ?? 0)}</td>
          <td>${safe(formatLocalDateTime(item.campaignStartAt))} → ${safe(formatLocalDateTime(item.campaignEndAt))}</td>
          <td>${safe(item.adminResponse || '')}</td>
          <td>
            ${item.status === 'pending'
              ? `<button type="button" class="button button-secondary submission-action" data-id="${safe(item.id)}" data-action="approve">Duyệt</button>
                 <button type="button" class="button button-secondary submission-action" data-id="${safe(item.id)}" data-action="reject">Từ chối</button>`
              : item.status === 'approved'
                ? `<button type="button" class="button button-secondary submission-action" data-id="${safe(item.id)}" data-action="highlight">Set TOP</button>`
                : '<span style="color:var(--text-secondary)">Đã xử lý</span>'}
          </td>
        </tr>
      `).join('')}
    </tbody>
  `;

  merchantSubmissionsTable.querySelectorAll('.submission-action').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      const action = button.dataset.action;
      if (!id || !action) {
        return;
      }

      if (action === 'highlight') {
        const target = items.find((x) => x.id === id);
        if (!target) {
          return;
        }

        const pinned = confirm('Đặt quảng cáo này lên TOP?\nOK = ghim TOP | Cancel = bỏ TOP');
        const priorityInput = prompt('Nhập độ ưu tiên 0-100 (cao hơn sẽ lên trước):', String(target.priorityScore ?? (pinned ? 80 : 0)));
        if (priorityInput === null) {
          return;
        }

        const startInput = prompt('Thời gian bắt đầu (yyyy-MM-ddTHH:mm), để trống = không giới hạn:', toInputDateTimeLocal(target.campaignStartAt));
        if (startInput === null) {
          return;
        }

        const endInput = prompt('Thời gian kết thúc (yyyy-MM-ddTHH:mm), để trống = không giới hạn:', toInputDateTimeLocal(target.campaignEndAt));
        if (endInput === null) {
          return;
        }

        const priorityScore = Number.parseInt(priorityInput, 10);
        const query = new URLSearchParams();
        query.set('isPinnedTop', String(pinned));
        query.set('priorityScore', String(Number.isFinite(priorityScore) ? priorityScore : 0));
        if (startInput.trim()) {
          query.set('campaignStartAt', new Date(startInput.trim()).toISOString());
        }
        if (endInput.trim()) {
          query.set('campaignEndAt', new Date(endInput.trim()).toISOString());
        }

        void adminFetch(`/api/admin/merchant-requests/${encodeURIComponent(id)}/highlight?${query.toString()}`, { method: 'POST' })
          .then(() => renderMerchantSubmissions())
          .catch((error) => alert(error?.message || 'Không cập nhật được ưu tiên quảng cáo.'));
        return;
      }

      void updateMerchantSubmissionStatus(id, action).catch((error) => {
        alert(error?.message || 'Không xử lý được yêu cầu.');
      });
    });
  });
}

async function refreshAll() {
  await Promise.all([
    loadDashboard(),
    loadLocations(),
    loadVoices(),
    loadTemplates(),
    loadLogs(),
    loadUserStats(),
    loadPaymentStats()
  ]);

  await loadAdminNarrationSources();
  await renderMerchantSubmissions();
}

locationForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = {
    id: locationFields.id.value.trim(),
    name: locationFields.name.value.trim(),
    category: locationFields.category.value.trim(),
    address: locationFields.address.value.trim(),
    openingHours: locationFields.openingHours.value.trim(),
    shortIntro: locationFields.shortIntro.value.trim(),
    bestTime: locationFields.bestTime.value.trim(),
    latitude: locationFields.latitude.value ? Number.parseFloat(locationFields.latitude.value) : null,
    longitude: locationFields.longitude.value ? Number.parseFloat(locationFields.longitude.value) : null,
    highlight: locationFields.highlight.value.trim(),
    descriptionVi: locationFields.descriptionVi.value.trim(),
    narrationDraftVi: locationFields.narrationDraftVi.value.trim(),
    dishSamples: locationFields.dishSamples.value.trim() || null
  };

  const id = payload.id;
  const url = id ? `/api/admin/locations/${encodeURIComponent(id)}` : '/api/admin/locations';
  const method = id ? 'PUT' : 'POST';

  await adminFetch(url, { method, body: JSON.stringify(payload) });
  await refreshAll();
});

approveLocationBtn.addEventListener('click', async () => {
  const id = locationFields.id.value.trim();
  if (!id) {
    alert('Chọn địa điểm trước khi duyệt.');
    return;
  }

  const narrationPublicVi = locationFields.narrationPublicVi.value.trim();
  const query = narrationPublicVi
    ? `?narrationPublicVi=${encodeURIComponent(narrationPublicVi)}`
    : '';

  await adminFetch(`/api/admin/locations/${encodeURIComponent(id)}/approve${query}`, { method: 'POST' });
  await refreshAll();
});

deleteLocationBtn.addEventListener('click', async () => {
  const id = locationFields.id.value.trim();
  if (!id || !confirm('Xác nhận xóa địa điểm này?')) {
    return;
  }

  await adminFetch(`/api/admin/locations/${encodeURIComponent(id)}`, { method: 'DELETE' });
  locationForm.reset();
  await refreshAll();
});

voiceForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = {
    id: voiceFields.id.value.trim(),
    scenario: voiceFields.scenario.value.trim(),
    language: voiceFields.language.value.trim(),
    voiceName: voiceFields.voiceName.value.trim(),
    isActive: voiceFields.isActive.value === 'true'
  };

  await adminFetch('/api/admin/voice-profiles', { method: 'POST', body: JSON.stringify(payload) });
  await refreshAll();
});

deleteVoiceBtn.addEventListener('click', async () => {
  const id = voiceFields.id.value.trim();
  if (!id || !confirm('Xóa voice profile này?')) {
    return;
  }

  await adminFetch(`/api/admin/voice-profiles/${encodeURIComponent(id)}`, { method: 'DELETE' });
  voiceForm.reset();
  await refreshAll();
});

templateForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    id: templateFields.id.value.trim(),
    locationId: templateFields.locationId.value.trim() || null,
    title: templateFields.title.value.trim(),
    sourceTextVi: templateFields.sourceTextVi.value.trim(),
    targetLanguage: templateFields.targetLanguage.value.trim(),
    voiceName: templateFields.voiceName.value.trim() || null,
    audioUrl: templateFields.audioUrl.value.trim() || null,
    isPublished: templateFields.isPublished.value === 'true'
  };

  await adminFetch('/api/admin/narration-templates', { method: 'POST', body: JSON.stringify(payload) });
  await refreshAll();
});

deleteTemplateBtn.addEventListener('click', async () => {
  const id = templateFields.id.value.trim();
  if (!id || !confirm('Xóa template này?')) {
    return;
  }

  await adminFetch(`/api/admin/narration-templates/${encodeURIComponent(id)}`, { method: 'DELETE' });
  templateForm.reset();
  await refreshAll();
});

if (adminNarrationLocation) {
  adminNarrationLocation.addEventListener('change', () => {
    const selected = adminNarrationLocations.find((item) => item.id === adminNarrationLocation.value);
    if (!selected || !adminNarrationText) {
      return;
    }

    adminNarrationText.value = buildNarrationTextFromLocation(selected);
  });
}

if (adminNarrationTemplate) {
  adminNarrationTemplate.addEventListener('change', () => {
    const selected = adminNarrationTemplates.find((item) => item.id === adminNarrationTemplate.value);
    if (!selected || !adminNarrationText || !adminNarrationLanguage || !adminNarrationVoice || !adminNarrationLocation) {
      return;
    }

    adminNarrationText.value = selected.sourceTextVi ?? adminNarrationText.value;
    adminNarrationLanguage.value = selected.targetLanguage ?? adminNarrationLanguage.value;
    adminNarrationVoice.value = selected.voiceName ?? '';
    if (selected.locationId) {
      adminNarrationLocation.value = selected.locationId;
    }
  });
}

if (adminNarrationForm) {
  adminNarrationForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (adminNarrationSubmit) {
      adminNarrationSubmit.disabled = true;
      adminNarrationSubmit.textContent = 'Đang tạo...';
    }

    try {
      await generateAdminNarration();
    } catch (error) {
      alert(error.message);
    } finally {
      if (adminNarrationSubmit) {
        adminNarrationSubmit.disabled = false;
        adminNarrationSubmit.textContent = 'Tạo Audio TTS';
      }
    }
  });
}

// User Management - Visit Stats
let currentVisitPeriod = 'daily';
let visitStatsChartInstance = null;

async function loadUserStats() {
  const data = await adminFetch(`/api/admin/user-stats?period=${currentVisitPeriod}`);
  
  // Render visit stats chart
  renderVisitStatsChart(data.visitStats);
  
  // Render recent visits table
  const recentVisitsTable = document.getElementById('recentVisitsTable');
  if (recentVisitsTable) {
    const tBody = recentVisitsTable.querySelector('tbody');
    tBody.innerHTML = (data.recentVisits ?? []).map(visit => `
      <tr>
        <td style="padding: 0.8rem; border-bottom: 1px solid #f0e68c;">${safe(visit.device)}</td>
        <td style="padding: 0.8rem; border-bottom: 1px solid #f0e68c;">${safe(visit.path)}</td>
        <td style="padding: 0.8rem; border-bottom: 1px solid #f0e68c;">${safe(formatLocalDateTime(visit.visitedAt))}</td>
      </tr>
    `).join('');
  }
}

function renderVisitStatsChart(stats) {
  const canvas = document.getElementById('visitStatsChart');
  if (!canvas || !window.Chart) return;
  
  if (visitStatsChartInstance) {
    visitStatsChartInstance.destroy();
  }

  const labels = stats.map(s => s.period);
  const visits = stats.map(s => s.visits);

  visitStatsChartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Số lượt truy cập',
        data: visits,
        backgroundColor: '#d4af37',
        borderColor: '#c9a227',
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: '#e5c158'
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#333',
            font: {
              family: "'Be Vietnam Pro', sans-serif",
              size: 14,
              weight: '500'
            },
            padding: 15
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
          ticks: { color: '#666', font: { family: "'Be Vietnam Pro', sans-serif", size: 12 } }
        },
        y: {
          grid: { display: false },
          ticks: { color: '#666', font: { family: "'Be Vietnam Pro', sans-serif", size: 12 } }
        }
      }
    }
  });
}

// User Management - Payment Stats
let paymentRatioChartInstance = null;

async function loadPaymentStats() {
  const data = await adminFetch('/api/admin/payment-stats');
  
  // Render payment stats table
  const paymentTable = document.getElementById('paymentStatsTable');
  if (paymentTable) {
    const tBody = paymentTable.querySelector('tbody');
    tBody.innerHTML = (data.paymentStats ?? []).map(stat => `
      <tr onclick="showPaymentDetail('${safe(stat.participantId)}', ${JSON.stringify(stat).replace(/'/g, "&apos;")}, ${data.paymentStats.find(s => s.participantId === stat.participantId) ? 'true' : 'false'})" style="cursor: pointer;">
        <td style="padding: 0.8rem; border-bottom: 1px solid #f0e68c;">${safe(stat.participantId.substring(0, 20))}...</td>
        <td style="padding: 0.8rem; border-bottom: 1px solid #f0e68c;">${safe(toCurrencyVnd(stat.totalRevenueVnd))}</td>
        <td style="padding: 0.8rem; border-bottom: 1px solid #f0e68c;">${safe(stat.transactionCount)}</td>
      </tr>
    `).join('');
  }
  
  // Render QR vs Web-only pie chart
  renderPaymentRatioChart(data.qrPaymentRatio);
}

function renderPaymentRatioChart(dataRatio) {
  const canvas = document.getElementById('paymentRatioChart');
  if (!canvas || !window.Chart) return;
  
  if (paymentRatioChartInstance) {
    paymentRatioChartInstance.destroy();
  }

  const qrPercentage = dataRatio.paymentPercentage;
  const webPercentage = 100 - qrPercentage;

  paymentRatioChartInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Thanh toán QR', 'Chỉ browse web'],
      datasets: [{
        data: [qrPercentage, webPercentage],
        backgroundColor: ['#d4af37', '#f0e68c'],
        borderColor: ['#c9a227', '#e5c158'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#333',
            font: { family: "'Be Vietnam Pro', sans-serif", size: 12, weight: '500' },
            padding: 15
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.label + ': ' + context.parsed + '%';
            }
          }
        }
      }
    }
  });
}

function showPaymentDetail(participantId, stat, _unused) {
  const modal = document.getElementById('paymentDetailModal');
  const content = document.getElementById('paymentDetailContent');
  
  if (!modal || !content) return;

  let locationsList = '';
  if (stat.recentLocations && stat.recentLocations.length > 0) {
    locationsList = stat.recentLocations.map(loc => `
      <div style="background: #f9f5f0; padding: 0.8rem; border-radius: 4px; margin-top: 0.5rem; border-left: 3px solid #d4af37;">
        <div style="font-weight: 600; color: #d4af37;">${safe(loc.locationName)}</div>
        <div style="color: #666; font-size: 0.9rem; margin-top: 0.3rem;">Thanh toán: ${safe(loc.payments)} | Doanh thu: ${safe(toCurrencyVnd(loc.amountVnd))}</div>
      </div>
    `).join('');
  }

  content.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <div style="color: #666; margin-bottom: 0.5rem;">ID người dùng:</div>
      <div style="font-weight: 600; color: #333; word-break: break-all;">${safe(participantId)}</div>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <div style="color: #666; margin-bottom: 0.5rem;">Tổng doanh thu:</div>
      <div style="font-size: 1.5rem; font-weight: 600; color: #d4af37;">${safe(toCurrencyVnd(stat.totalRevenueVnd))}</div>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <div style="color: #666; margin-bottom: 0.5rem;">Số lần thanh toán: ${safe(stat.transactionCount)}</div>
      <div style="color: #666; margin-bottom: 0.5rem;">Lần thanh toán gần nhất: ${safe(formatLocalDateTime(stat.lastPaymentAt))}</div>
    </div>

    <div style="margin-bottom: 1rem;">
      <div style="font-weight: 600; color: #d4af37; margin-bottom: 0.8rem;">Quán ăn được chọn thuyết minh:</div>
      ${locationsList || '<div style="color: #999;">Không có dữ liệu</div>'}
    </div>
  `;

  modal.style.display = 'flex';
}

function closePaymentModal() {
  const modal = document.getElementById('paymentDetailModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Period filter for visit stats
document.querySelectorAll('.period-filter-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    currentVisitPeriod = btn.dataset.period;
    document.querySelectorAll('.period-filter-btn').forEach(b => {
      b.style.background = b.dataset.period === currentVisitPeriod ? '#d4af37' : '#e5c158';
      b.style.color = b.dataset.period === currentVisitPeriod ? '#fff' : '#333';
    });
    await loadUserStats();
  });
});

saveAdminKeyBtn.addEventListener('click', async () => {
  localStorage.setItem('adminKey', getAdminKey());
  try {
    await refreshAll();
    alert('Lưu key thành công.');
  } catch (error) {
    alert(error.message);
  }
});

refreshAllBtn.addEventListener('click', async () => {
  try {
    await refreshAll();
  } catch (error) {
    alert(error.message);
  }
});

if (refreshMerchantSubmissionsBtn) {
  refreshMerchantSubmissionsBtn.addEventListener('click', () => {
    void renderMerchantSubmissions().catch((error) => {
      alert(error?.message || 'Không tải được danh sách đề xuất.');
    });
  });
}

(async () => {
  try {
    await loadAdminNarrationSources();
  } catch (error) {
    console.error(error);
  }

  if (getAdminKey()) {
    try {
      await refreshAll();
    } catch (error) {
      console.error(error);
    }
  }

  void renderMerchantSubmissions().catch((error) => {
    console.error(error);
  });
})();
