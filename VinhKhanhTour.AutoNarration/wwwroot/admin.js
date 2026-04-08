const adminKeyInput = document.getElementById('adminKey');
const saveAdminKeyBtn = document.getElementById('saveAdminKey');
const refreshAllBtn = document.getElementById('refreshAll');
const dashboardStats = document.getElementById('dashboardStats');
const topPages = document.getElementById('topPages');

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
const adminUsedVoice = document.getElementById('adminUsedVoice');
const adminAudioPlayer = document.getElementById('adminAudioPlayer');
const adminAudioLink = document.getElementById('adminAudioLink');

const aiLogsTable = document.getElementById('aiLogsTable');
const visitLogsTable = document.getElementById('visitLogsTable');

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
  return adminKeyInput.value.trim();
}

async function adminFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': getAdminKey(),
      ...(options.headers ?? {})
    }
  });

  if (response.status === 401) {
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

function safe(text) {
  return String(text ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
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

  topPages.innerHTML = (data.topPages ?? []).map((page) => `
    <article class="card">
      <h3>${safe(page.path)}</h3>
      <p>Số lượt truy cập: <strong>${safe(page.visits)}</strong></p>
    </article>
  `).join('');
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

async function refreshAll() {
  await Promise.all([
    loadDashboard(),
    loadLocations(),
    loadVoices(),
    loadTemplates(),
    loadLogs()
  ]);

  await loadAdminNarrationSources();
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
})();
