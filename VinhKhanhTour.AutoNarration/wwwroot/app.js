const locationsGrid = document.getElementById('locationsGrid');
const locationSelect = document.getElementById('locationSelect');
const narrationForm = document.getElementById('narrationForm');
const narrationResult = document.getElementById('narrationResult');
const translatedText = document.getElementById('translatedText');
const usedVoice = document.getElementById('usedVoice');
const audioPlayer = document.getElementById('audioPlayer');
const audioLink = document.getElementById('audioLink');
const customText = document.getElementById('customText');
const languageSelect = document.getElementById('languageSelect');
const voiceName = document.getElementById('voiceName');
const speakingRate = document.getElementById('speakingRate');

let currentLocations = [];
let narrationBusy = false;

async function loadLocations() {
  const response = await fetch('/api/locations');
  if (!response.ok) {
    throw new Error('Không tải được dữ liệu địa điểm.');
  }

  const data = await response.json();
  currentLocations = Array.isArray(data) ? data : (data.value ?? []);
  renderLocations(currentLocations);
  fillLocationSelect(currentLocations);
}

function renderLocations(locations) {
  locationsGrid.innerHTML = locations.map((location, index) => `
    <article class="card" style="animation-delay:${index * 80}ms">
      <div class="card-visual">
        <img src="${getCardImage(location.id)}" alt="${escapeHtml(location.name)}" />
      </div>
      <div class="card-head">
        <span class="tag">${escapeHtml(location.category)}</span>
        <span class="pill">${escapeHtml(location.bestTime)}</span>
      </div>
      <h3>${escapeHtml(location.name)}</h3>
      <p>${escapeHtml(location.shortIntro)}</p>
      <p>${escapeHtml(location.descriptionVi)}</p>
      <div class="card-meta">
        <span><strong>Điểm nhấn:</strong> ${escapeHtml(location.highlight)}</span>
      </div>
      <button class="button button-secondary" data-location-id="${escapeHtml(location.id)}">Tạo thuyết minh riêng</button>
    </article>
  `).join('');

  locationsGrid.querySelectorAll('[data-location-id]').forEach(button => {
    button.addEventListener('click', () => {
      locationSelect.value = button.dataset.locationId;
      customText.value = '';
      document.querySelector('#thuyet-minh').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function fillLocationSelect(locations) {
  locationSelect.innerHTML = locations.map(location => `
    <option value="${escapeHtml(location.id)}">${escapeHtml(location.name)} - ${escapeHtml(location.category)}</option>
  `).join('');
}

function getCardImage(locationId) {
  const images = {
    'com-tam-hoa-binh': '/assets/hero-night.svg',
    'oc-tuoc-nuong': '/assets/street-food.svg',
    'nuoc-mia-sau-rieng': '/assets/hero-night.svg',
    'banh-trang-nuong-pho-dem': '/assets/street-food.svg',
    'che-dem-vinh-khanh': '/assets/map.svg'
  };

  return images[locationId] ?? '/assets/map.svg';
}

function buildNarrationText(location) {
  return `${location.name} thuộc nhóm ${location.category}. ${location.shortIntro} ${location.highlight}. ${location.descriptionVi}`;
}

async function createNarrationForLocation(location) {
  if (narrationBusy) {
    return;
  }

  narrationBusy = true;
  locationSelect.value = location.id;
  customText.value = buildNarrationText(location);
  narrationForm.querySelector('button').disabled = true;
  narrationForm.querySelector('button').textContent = 'Đang tạo...';

  try {
    await generateNarration();
  } finally {
    narrationBusy = false;
    narrationForm.querySelector('button').disabled = false;
    narrationForm.querySelector('button').textContent = 'Tạo thuyết minh';
  }
}

async function generateNarration() {
  const selectedLocationId = locationSelect.value;
  const payload = {
    locationId: selectedLocationId,
    customTextVi: customText.value.trim() || null,
    targetLanguage: languageSelect.value,
    voiceName: voiceName.value.trim() || null,
    speakingRate: Number.parseFloat(speakingRate.value) || 1
  };

  const response = await fetch('/api/narrations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Tạo thuyết minh thất bại.');
  }

  narrationResult.classList.remove('hidden');
  translatedText.textContent = result.translatedText;
  usedVoice.textContent = result.voiceName;
  audioPlayer.src = result.audioUrl;
  audioLink.href = result.audioUrl;
  audioLink.textContent = `Mở file audio: ${result.audioUrl}`;
}

narrationForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    await generateNarration();
  } catch (error) {
    alert(error.message);
  } finally {
    if (!narrationBusy) {
      narrationForm.querySelector('button').disabled = false;
      narrationForm.querySelector('button').textContent = 'Tạo thuyết minh';
    }
  }
});

locationsGrid.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-location-id]');
  if (!button) {
    return;
  }

  const location = currentLocations.find(item => item.id === button.dataset.locationId);
  if (!location) {
    return;
  }

  try {
    await createNarrationForLocation(location);
    document.querySelector('#thuyet-minh').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    alert(error.message);
  }
});

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

loadLocations().catch(error => {
  locationsGrid.innerHTML = `<article class="card-skeleton">${escapeHtml(error.message)}</article>`;
});
