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
      <span class="tag">${escapeHtml(location.category)}</span>
      <h3>${escapeHtml(location.name)}</h3>
      <p>${escapeHtml(location.descriptionVi)}</p>
      <button class="button button-secondary" data-location-id="${escapeHtml(location.id)}">Dùng cho thuyết minh</button>
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

narrationForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const selectedLocationId = locationSelect.value;
  const payload = {
    locationId: selectedLocationId,
    customTextVi: customText.value.trim() || null,
    targetLanguage: languageSelect.value,
    voiceName: voiceName.value.trim() || null,
    speakingRate: Number.parseFloat(speakingRate.value) || 1
  };

  narrationForm.querySelector('button').disabled = true;
  narrationForm.querySelector('button').textContent = 'Đang tạo...';

  try {
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
  } catch (error) {
    alert(error.message);
  } finally {
    narrationForm.querySelector('button').disabled = false;
    narrationForm.querySelector('button').textContent = 'Tạo thuyết minh';
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
