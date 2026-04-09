const locationsGrid = document.getElementById('locationsGrid');
const locationSelect = document.getElementById('locationSelect');
const narrationForm = document.getElementById('narrationForm');
const narrationResult = document.getElementById('narrationResult');
const translatedText = document.getElementById('translatedText');
const usedVoice = document.getElementById('usedVoice');
const audioPlayer = document.getElementById('audioPlayer');
const audioLink = document.getElementById('audioLink');
const templateSelect = document.getElementById('templateSelect');
const customText = document.getElementById('customText');
const languageSelect = document.getElementById('languageSelect');
const voiceName = document.getElementById('voiceName');
const speakingRate = document.getElementById('speakingRate');

const routeForm = document.getElementById('routeForm');
const visitorType = document.getElementById('visitorType');
const budgetLevel = document.getElementById('budgetLevel');
const startHour = document.getElementById('startHour');
const guestCount = document.getElementById('guestCount');
const preferences = document.getElementById('preferences');
const mustTry = document.getElementById('mustTry');
const routeResult = document.getElementById('routeResult');
const routeTitle = document.getElementById('routeTitle');
const routeSummary = document.getElementById('routeSummary');
const routeStrategy = document.getElementById('routeStrategy');
const routeGeneratedBy = document.getElementById('routeGeneratedBy');
const routeStops = document.getElementById('routeStops');
const routeOptionsPanel = document.getElementById('routeOptionsPanel');
const routeOptionsGrid = document.getElementById('routeOptionsGrid');
const routeOptionSort = document.getElementById('routeOptionSort');
const journeyPanel = document.getElementById('journeyPanel');
const journeyTitle = document.getElementById('journeyTitle');
const journeyStops = document.getElementById('journeyStops');
const journeyLocateBtn = document.getElementById('journeyLocateBtn');
const journeyGeoStatus = document.getElementById('journeyGeoStatus');
const journeyRerouteBtn = document.getElementById('journeyRerouteBtn');
const journeyBackToNearestBtn = document.getElementById('journeyBackToNearestBtn');
const journeyAutoNarration = document.getElementById('journeyAutoNarration');
const journeyProgressStatus = document.getElementById('journeyProgressStatus');
const journeyEtaStatus = document.getElementById('journeyEtaStatus');
const journeyMiniMap = document.getElementById('journeyMiniMap');
const journeyOffRouteAlert = document.getElementById('journeyOffRouteAlert');
const journeyOffRouteText = document.getElementById('journeyOffRouteText');

let currentLocations = [];
let currentTemplates = [];
let narrationBusy = false;
let quickPlayerHost;
let selectedRouteOption = null;
let currentUserPosition = null;
let latestOptionsResponse = null;
let latestRouteRequest = null;
let journeyWatchId = null;
let proximityNarrationBusy = false;
const skippedStopKeys = new Set();
const autoNarratedStopKeys = new Set();
const completedStopKeys = new Set();
let speedMetersPerSecond = 1.25;
let lastGeoSnapshot = null;
let journeyMap = null;
let journeyMapMarkers = [];
let journeyPathLineAdded = false;
let nearestRemainingStop = null;
const SITE_LANGUAGE_KEY = 'siteLanguage';

function tr(key) {
  return window.siteI18n?.translate?.(key, getPreferredLanguage()) ?? key;
}

function getPreferredLanguage() {
  const queryLang = new URLSearchParams(window.location.search).get('lang');
  return queryLang || localStorage.getItem(SITE_LANGUAGE_KEY) || 'vi';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getCardImage(locationId) {
  const images = {
    'oc-oanh': '/assets/vinh-khanh-street.jpg',
    'oc-vu': '/assets/vinh-khanh-street.jpg',
    'thao-oc': '/assets/vinh-khanh-street.jpg',
    'oc-sau-no': '/assets/vinh-khanh-banner.jpg',
    'be-oc': '/assets/vinh-khanh-banner.jpg'
  };

  return images[locationId] ?? '/assets/map.svg';
}

function renderLocations(locations) {
  if (!locationsGrid) {
    return;
  }

  locationsGrid.innerHTML = locations.map((location, index) => `
    <article class="card" style="animation-delay:${index * 80}ms">
      <img class="card-visual" src="${getCardImage(location.id)}" alt="${escapeHtml(location.name)}" />
      <div class="card-head">
        <span class="tag">${escapeHtml(location.category)}</span>
        <span class="tag" style="background:var(--bg); color:var(--text-secondary); border: 1px solid var(--border);">${escapeHtml(location.bestTime)}</span>
      </div>
      <h3>${escapeHtml(location.name)}</h3>
      <p>${escapeHtml(location.shortIntro)}</p>
      <p>${escapeHtml(location.descriptionVi)}</p>
      <div class="card-meta">
        <span><strong>${escapeHtml(tr('card_address'))}:</strong> ${escapeHtml(location.address)}</span>
        <span><strong>${escapeHtml(tr('card_hours'))}:</strong> ${escapeHtml(location.openingHours)}</span>
        <span><strong>SĐT:</strong> ${escapeHtml(location.contactPhone || 'Đang cập nhật')}</span>
        <span><strong>Giá tham khảo:</strong> ${escapeHtml(location.priceRange || 'Đang cập nhật')}</span>
        <span><strong>${escapeHtml(tr('card_highlight'))}:</strong> ${escapeHtml(location.highlight)}</span>
      </div>
      <button type="button" class="button button-secondary" data-location-id="${escapeHtml(location.id)}">${escapeHtml(tr('btn_narrate_private'))}</button>
    </article>
  `).join('');
}

function fillLocationSelect(locations) {
  if (!locationSelect) {
    return;
  }

  locationSelect.innerHTML = locations.map(location => `
    <option value="${escapeHtml(location.id)}">${escapeHtml(location.name)} - ${escapeHtml(location.category)}</option>
  `).join('');
}

async function loadLocations() {
  const response = await fetch('/api/locations');
  if (!response.ok) {
    throw new Error(tr('map_status_no_api'));
  }

  const data = await response.json();
  const preferredLanguage = getPreferredLanguage();
  currentLocations = (Array.isArray(data) ? data : (data.value ?? []))
    .map((item) => window.localizeLocationData ? window.localizeLocationData(item, preferredLanguage) : item);
  renderLocations(currentLocations);
  fillLocationSelect(currentLocations);

  if (locationSelect) {
    const locationFromQuery = new URLSearchParams(window.location.search).get('locationId');
    const langFromQuery = new URLSearchParams(window.location.search).get('lang');
    const selectedLang = langFromQuery || localStorage.getItem(SITE_LANGUAGE_KEY);

    if (languageSelect && selectedLang) {
      languageSelect.value = selectedLang;
    }

    if (locationFromQuery) {
      const selected = currentLocations.find((x) => x.id === locationFromQuery);
      if (selected) {
        locationSelect.value = selected.id;
        if (customText) {
          customText.value = buildNarrationText(selected);
        }
      }
    }
  }
}

async function loadNarrationTemplates() {
  if (!templateSelect) {
    return;
  }

  const response = await fetch('/api/narration-templates');
  if (!response.ok) {
    return;
  }

  currentTemplates = await response.json();
  templateSelect.innerHTML = `
    <option value="">${escapeHtml(tr('template_none'))}</option>
    ${(currentTemplates ?? []).map(template => `<option value="${escapeHtml(template.id)}">${escapeHtml(template.title)} (${escapeHtml(template.targetLanguage)})</option>`).join('')}
  `;
}

function buildNarrationText(location) {
  return `${location.name}. ${location.category}. ${location.shortIntro} ${location.highlight}. ${location.descriptionVi}`;
}

function ensureQuickPlayer() {
  if (quickPlayerHost) {
    return quickPlayerHost;
  }

  const host = document.createElement('div');
  host.className = 'quick-player hidden';
  host.innerHTML = `
    <div class="quick-player-head">
      <strong id="quickPlayerTitle">Audio</strong>
      <button type="button" id="quickPlayerClose" class="button button-secondary">Đóng</button>
    </div>
    <audio id="quickPlayerAudio" controls></audio>
  `;

  document.body.appendChild(host);

  const closeBtn = host.querySelector('#quickPlayerClose');
  closeBtn?.addEventListener('click', () => {
    const audio = host.querySelector('#quickPlayerAudio');
    if (audio) {
      audio.pause();
    }
    host.classList.add('hidden');
  });

  quickPlayerHost = host;
  return host;
}

async function playNarrationInstant(location) {
  const selectedLanguage = languageSelect?.value || getPreferredLanguage();

  const response = await fetch('/api/narrations/instant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      locationId: location.id,
      targetLanguage: selectedLanguage
    })
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.detail || result.message || tr('narration_failed'));
  }

  const host = ensureQuickPlayer();
  const title = host.querySelector('#quickPlayerTitle');
  const audio = host.querySelector('#quickPlayerAudio');
  if (!audio) {
    return;
  }

  if (title) {
    title.textContent = `${location.name} (${selectedLanguage})`;
  }

  host.classList.remove('hidden');
  audio.src = result.audioUrl;

  try {
    await audio.play();
  } catch {
    // Autoplay may be blocked by browser policies.
  }
}

async function generateNarration() {
  if (!locationSelect || !customText || !languageSelect || !voiceName || !speakingRate) {
    return;
  }

  const payload = {
    locationId: locationSelect.value,
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
    throw new Error(result.detail || result.message || tr('narration_failed'));
  }

  if (narrationResult) {
    narrationResult.classList.remove('hidden');
  }
  if (translatedText) {
    translatedText.textContent = result.translatedText;
  }
  if (usedVoice) {
    usedVoice.textContent = result.voiceName;
  }
  if (audioPlayer) {
    audioPlayer.src = result.audioUrl;
  }
  if (audioLink) {
    audioLink.href = result.audioUrl;
    audioLink.textContent = `${tr('audio_open_file')}: ${result.audioUrl}`;
  }
}

async function createNarrationForLocation(location) {
  if (!narrationForm) {
    await playNarrationInstant(location);
    return;
  }

  if (!locationSelect || !customText || narrationBusy) {
    return;
  }

  narrationBusy = true;
  locationSelect.value = location.id;
  customText.value = buildNarrationText(location);

  const button = narrationForm.querySelector('button');
  if (button) {
    button.disabled = true;
    button.textContent = tr('state_generating');
  }

  try {
    await generateNarration();
  } finally {
    narrationBusy = false;
    if (button) {
      button.disabled = false;
      button.textContent = tr('btn_audio_tts');
    }
  }
}

function renderRoutePlan(plan) {
  if (!routeResult || !routeTitle || !routeSummary || !routeStrategy || !routeGeneratedBy || !routeStops) {
    return;
  }

  routeResult.classList.remove('hidden');
  routeTitle.textContent = plan.title;
  routeSummary.textContent = plan.summary;
  routeStrategy.textContent = plan.strategy;
  routeGeneratedBy.textContent = plan.generatedBy;
  routeStops.innerHTML = (plan.stops ?? []).map((stop, index) => `
    <div class="timeline-item">
      <h4>${index + 1}. ${escapeHtml(stop.name)}</h4>
      <p><strong>${escapeHtml(tr('card_address'))}:</strong> ${escapeHtml(stop.address)}</p>
      <p><strong>${escapeHtml(tr('route_why_visit'))}:</strong> ${escapeHtml(stop.why)}</p>
      <p><strong>${escapeHtml(tr('route_try_dish'))}:</strong> ${escapeHtml(stop.recommendedDish)}</p>
      <p><strong>${escapeHtml(tr('route_best_time'))}:</strong> ${escapeHtml(stop.bestTime)}</p>
    </div>
  `).join('');
}

function formatCurrencyVnd(value) {
  const amount = Number(value || 0);
  return `${new Intl.NumberFormat('vi-VN').format(amount)} VND`;
}

function formatDistanceKm(meters) {
  const km = Number(meters || 0) / 1000;
  return `${km.toFixed(1)} km`;
}

function buildClientOptionsFromPlan(plan) {
  if (!plan || !Array.isArray(plan.stops) || plan.stops.length === 0) {
    return [];
  }

  const stops = plan.stops;
  const make = (id, title, summary, strategy, stopCount, duration, budget, walking) => ({
    id,
    title,
    summary,
    strategy,
    generatedBy: plan.generatedBy || 'fallback',
    estimatedDurationMinutes: duration,
    estimatedBudgetPerPersonVnd: budget,
    estimatedWalkingMeters: walking,
    narrationSummary: `Đã sẵn sàng thuyết minh cho ${Math.min(stopCount, stops.length)} điểm dừng.`,
    stops: stops.slice(0, Math.min(stopCount, stops.length))
  });

  return [
    make('quick-fallback', 'Lộ trình nhanh gọn', 'Đi nhanh, chọn các điểm nổi bật nhất.', 'Ưu tiên tiết kiệm thời gian.', 3, 95, 180000, 900),
    make('balanced-fallback', 'Lộ trình cân bằng', 'Cân bằng trải nghiệm, thời gian và ngân sách.', 'Phù hợp đa số du khách.', 4, 140, 240000, 1500),
    make('night-fallback', 'Lộ trình trải nghiệm đêm', 'Nhiều điểm dừng, trải nghiệm sâu hơn về đêm.', 'Ưu tiên đa dạng món và không khí.', 6, 200, 320000, 2400)
  ];
}

function normalizeOptionsResponse(result) {
  if (result && Array.isArray(result.options)) {
    return result;
  }

  const fallbackOptions = buildClientOptionsFromPlan(result);
  return {
    requestLabel: 'fallback',
    options: fallbackOptions
  };
}

function getStopKey(stop) {
  return stop?.locationId || stop?.name || '';
}

function buildOptionStorageKey(option) {
  const stopKeys = (option?.stops || []).map((stop) => getStopKey(stop)).join('|');
  return `journey-progress:${option?.id || 'none'}:${stopKeys}`;
}

function saveJourneyProgress(option) {
  if (!option) {
    return;
  }

  const key = buildOptionStorageKey(option);
  const payload = {
    completed: [...completedStopKeys],
    skipped: [...skippedStopKeys],
    savedAt: new Date().toISOString()
  };
  localStorage.setItem(key, JSON.stringify(payload));
}

function loadJourneyProgress(option) {
  completedStopKeys.clear();
  skippedStopKeys.clear();

  if (!option) {
    return;
  }

  const key = buildOptionStorageKey(option);
  const raw = localStorage.getItem(key);
  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    (parsed.completed || []).forEach((item) => completedStopKeys.add(String(item)));
    (parsed.skipped || []).forEach((item) => skippedStopKeys.add(String(item)));
  } catch {
    // Ignore corrupted local storage payload.
  }
}

function scoreOption(option, request) {
  let score = 0;
  const budget = String(request?.budgetLevel || '').toLowerCase();
  const pref = String(request?.preferences || '').toLowerCase();
  const guest = Number(request?.guestCount || 0);

  if (budget.includes('thấp')) {
    score += Math.max(0, 400000 - Number(option.estimatedBudgetPerPersonVnd || 0)) / 4000;
  } else if (budget.includes('cao')) {
    score += Number(option.estimatedDurationMinutes || 0) / 6;
  } else {
    score += Math.max(0, 180 - Math.abs(Number(option.estimatedDurationMinutes || 0) - 150));
  }

  if (pref.includes('đi khuya') || pref.includes('đêm') || pref.includes('late')) {
    score += Number(option.estimatedDurationMinutes || 0) / 3;
  }

  if (pref.includes('ít đi bộ') || pref.includes('không đi bộ') || pref.includes('walking less')) {
    score += Math.max(0, 3000 - Number(option.estimatedWalkingMeters || 0)) / 40;
  }

  if (guest >= 5) {
    score += (option.stops?.length || 0) * 5;
  }

  if (guest > 0 && guest <= 2) {
    score += Math.max(0, 220 - Number(option.estimatedDurationMinutes || 0));
  }

  return score;
}

function sortOptions(options, mode, request) {
  const list = [...options].map((option, idx) => ({
    ...option,
    __index: idx,
    __score: scoreOption(option, request)
  }));

  const recommended = [...list].sort((a, b) => b.__score - a.__score)[0];
  const recommendedId = recommended?.id || null;

  const sorted = [...list];
  if (mode === 'duration') {
    sorted.sort((a, b) => (a.estimatedDurationMinutes || 0) - (b.estimatedDurationMinutes || 0));
  } else if (mode === 'budget') {
    sorted.sort((a, b) => (a.estimatedBudgetPerPersonVnd || 0) - (b.estimatedBudgetPerPersonVnd || 0));
  } else if (mode === 'walking') {
    sorted.sort((a, b) => (a.estimatedWalkingMeters || 0) - (b.estimatedWalkingMeters || 0));
  } else {
    sorted.sort((a, b) => b.__score - a.__score);
  }

  return { sorted, recommendedId };
}

function getRemainingStops(option) {
  return (option?.stops ?? []).filter((stop) => {
    const key = getStopKey(stop);
    return !skippedStopKeys.has(key) && !completedStopKeys.has(key);
  });
}

function updateJourneyProgressStatus(option) {
  if (!journeyProgressStatus || !option) {
    return;
  }

  const total = option.stops?.length || 0;
  const completed = [...completedStopKeys].length;
  const skipped = [...skippedStopKeys].length;
  const remaining = Math.max(0, total - completed - skipped);
  journeyProgressStatus.textContent = `Hoàn thành ${completed}/${total} điểm, bỏ qua ${skipped}, còn lại ${remaining}.`;
}

function updateEtaStatus(option) {
  if (!journeyEtaStatus) {
    return;
  }

  const nextStop = getRemainingStops(option)[0];
  const distance = estimateDistanceToStop(nextStop);
  if (distance === null) {
    journeyEtaStatus.textContent = 'Chưa xác định';
    return;
  }

  const speed = Math.max(0.4, speedMetersPerSecond || 1.25);
  const etaMinutes = Math.max(1, Math.round(distance / speed / 60));
  journeyEtaStatus.textContent = `${etaMinutes} phút (${Math.round(distance)} m)`;
}

function updateOffRouteAlert(option) {
  if (!journeyOffRouteAlert || !journeyOffRouteText) {
    return;
  }

  const remaining = getRemainingStops(option);
  if (!currentUserPosition || remaining.length === 0) {
    nearestRemainingStop = null;
    journeyOffRouteAlert.classList.add('hidden');
    return;
  }

  const nearest = [...remaining]
    .map((stop) => ({ stop, distance: estimateDistanceToStop(stop) }))
    .filter((x) => x.distance !== null)
    .sort((a, b) => a.distance - b.distance)[0];

  if (!nearest) {
    nearestRemainingStop = null;
    journeyOffRouteAlert.classList.add('hidden');
    return;
  }

  nearestRemainingStop = nearest.stop;
  const distance = Math.round(nearest.distance);
  if (distance > 380) {
    journeyOffRouteText.textContent = `Bạn đang cách điểm gần nhất "${nearest.stop.name}" khoảng ${distance} m. Nên quay lại hoặc bấm tính lại lộ trình.`;
    journeyOffRouteAlert.classList.remove('hidden');
  } else {
    journeyOffRouteAlert.classList.add('hidden');
  }
}

function ensureJourneyMap() {
  if (!journeyMiniMap || typeof maplibregl === 'undefined') {
    return null;
  }

  if (journeyMap) {
    return journeyMap;
  }

  journeyMap = new maplibregl.Map({
    container: journeyMiniMap,
    style: {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap contributors'
        }
      },
      layers: [{ id: 'osm-layer', type: 'raster', source: 'osm' }]
    },
    center: [106.7038, 10.7612],
    zoom: 14
  });

  return journeyMap;
}

function clearJourneyMarkers() {
  journeyMapMarkers.forEach((marker) => marker.remove());
  journeyMapMarkers = [];
}

function updateJourneyMap(option) {
  const map = ensureJourneyMap();
  if (!map || !option) {
    return;
  }

  const remaining = getRemainingStops(option);
  if (!map.loaded()) {
    map.once('load', () => updateJourneyMap(option));
    return;
  }

  clearJourneyMarkers();

  const points = [];
  if (currentUserPosition) {
    points.push([currentUserPosition.longitude, currentUserPosition.latitude]);
    const userMarker = new maplibregl.Marker({ color: '#36cfc9' })
      .setLngLat([currentUserPosition.longitude, currentUserPosition.latitude])
      .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML('<strong>Vị trí của bạn</strong>'))
      .addTo(map);
    journeyMapMarkers.push(userMarker);
  }

  remaining.forEach((stop, idx) => {
    if (!stop?.longitude || !stop?.latitude) {
      return;
    }

    points.push([stop.longitude, stop.latitude]);
    const color = idx === 0 ? '#ff9f43' : '#f6b93b';
    const marker = new maplibregl.Marker({ color })
      .setLngLat([stop.longitude, stop.latitude])
      .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(`<strong>${escapeHtml(stop.name)}</strong><br/>${escapeHtml(stop.address)}`))
      .addTo(map);
    journeyMapMarkers.push(marker);
  });

  if (!map.getSource('journey-path')) {
    map.addSource('journey-path', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: points
        }
      }
    });

    map.addLayer({
      id: 'journey-path-layer',
      type: 'line',
      source: 'journey-path',
      paint: {
        'line-color': '#ffb347',
        'line-width': 4,
        'line-opacity': 0.82
      }
    });

    journeyPathLineAdded = true;
  } else {
    map.getSource('journey-path').setData({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: points
      }
    });
  }

  if (points.length > 0) {
    const bounds = points.reduce((acc, point) => acc.extend(point), new maplibregl.LngLatBounds(points[0], points[0]));
    map.fitBounds(bounds, { padding: 60, maxZoom: 16, duration: 450 });
  }
}

function rerouteFromCurrentPosition() {
  if (!selectedRouteOption) {
    alert('Bạn cần chọn một phương án lộ trình trước.');
    return;
  }

  if (!currentUserPosition) {
    alert('Hãy lấy vị trí hiện tại trước khi tính lại lộ trình.');
    return;
  }

  const remaining = getRemainingStops(selectedRouteOption);
  const sortedStops = [...remaining].sort((a, b) => {
    const da = estimateDistanceToStop(a) ?? Number.MAX_SAFE_INTEGER;
    const db = estimateDistanceToStop(b) ?? Number.MAX_SAFE_INTEGER;
    return da - db;
  });

  selectedRouteOption = {
    ...selectedRouteOption,
    stops: sortedStops
  };

  saveJourneyProgress(selectedRouteOption);
  renderJourney(selectedRouteOption);
}

function updateUserPosition(latitude, longitude) {
  if (lastGeoSnapshot) {
    const deltaMs = Date.now() - lastGeoSnapshot.timestamp;
    if (deltaMs > 0) {
      const tempDistance = estimateDistanceBetween(lastGeoSnapshot.latitude, lastGeoSnapshot.longitude, latitude, longitude);
      const estimatedSpeed = tempDistance / (deltaMs / 1000);
      if (Number.isFinite(estimatedSpeed) && estimatedSpeed > 0.25 && estimatedSpeed < 3.5) {
        speedMetersPerSecond = estimatedSpeed;
      }
    }
  }

  lastGeoSnapshot = { latitude, longitude, timestamp: Date.now() };
  currentUserPosition = { latitude, longitude };
  if (journeyGeoStatus) {
    journeyGeoStatus.textContent = `Đã định vị: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
  }

  if (selectedRouteOption) {
    renderJourney(selectedRouteOption);
    updateEtaStatus(selectedRouteOption);
    updateJourneyMap(selectedRouteOption);
    updateOffRouteAlert(selectedRouteOption);
    void tryAutoNarrationForNearestStop();
  }
}

function estimateDistanceBetween(latA, lngA, latB, lngB) {
  const toRad = (value) => value * (Math.PI / 180);
  const earthRadius = 6371000;
  const dLat = toRad(latB - latA);
  const dLng = toRad(lngB - lngA);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(latA)) * Math.cos(toRad(latB)) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function tryAutoNarrationForNearestStop() {
  if (!journeyAutoNarration?.checked || !selectedRouteOption || !currentUserPosition || proximityNarrationBusy) {
    return;
  }

  const remaining = getRemainingStops(selectedRouteOption);
  if (remaining.length === 0) {
    return;
  }

  const nearest = [...remaining]
    .map((stop) => ({ stop, dist: estimateDistanceToStop(stop) }))
    .filter((item) => item.dist !== null)
    .sort((a, b) => a.dist - b.dist)[0];

  if (!nearest || nearest.dist > 90) {
    return;
  }

  const key = getStopKey(nearest.stop);
  if (!key || autoNarratedStopKeys.has(key)) {
    return;
  }

  proximityNarrationBusy = true;
  try {
    await playStopNarration(nearest.stop, 'auto');
    autoNarratedStopKeys.add(key);
  } catch {
    // Ignore autoplay errors; user can still play manually.
  } finally {
    proximityNarrationBusy = false;
  }
}

function estimateDistanceToStop(stop) {
  if (!currentUserPosition || !stop?.latitude || !stop?.longitude) {
    return null;
  }

  const toRad = (value) => value * (Math.PI / 180);
  const earthRadius = 6371000;
  const lat1 = toRad(currentUserPosition.latitude);
  const lat2 = toRad(stop.latitude);
  const dLat = toRad(stop.latitude - currentUserPosition.latitude);
  const dLon = toRad(stop.longitude - currentUserPosition.longitude);

  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;
  return distance;
}

async function playStopNarration(stop, source = 'manual') {
  if (!stop?.locationId) {
    if (source === 'manual') {
      alert('Điểm dừng này chưa có dữ liệu thuyết minh tự động.');
    }
    return;
  }

  const selectedLanguage = getPreferredLanguage();
  const response = await fetch('/api/narrations/instant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ locationId: stop.locationId, targetLanguage: selectedLanguage })
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.detail || result.message || tr('narration_failed'));
  }

  const host = ensureQuickPlayer();
  const title = host.querySelector('#quickPlayerTitle');
  const audio = host.querySelector('#quickPlayerAudio');
  if (!audio) {
    return;
  }

  if (title) {
    title.textContent = `${stop.name} (${selectedLanguage})`;
  }

  host.classList.remove('hidden');
  audio.src = result.audioUrl;
  try {
    await audio.play();
  } catch {
    // Browser may block autoplay.
  }
}

function openDirectionsToStop(stop) {
  if (!stop?.latitude || !stop?.longitude) {
    alert('Điểm dừng này chưa có toạ độ để dẫn đường.');
    return;
  }

  const destination = `${stop.latitude},${stop.longitude}`;
  const origin = currentUserPosition
    ? `${currentUserPosition.latitude},${currentUserPosition.longitude}`
    : null;

  const url = origin
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=walking`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;

  window.open(url, '_blank', 'noopener,noreferrer');
}

function renderJourney(option) {
  if (!journeyPanel || !journeyStops || !journeyTitle) {
    return;
  }

  selectedRouteOption = option;
  journeyPanel.classList.remove('hidden');
  journeyTitle.textContent = `Hành trình: ${option.title}`;
  updateJourneyProgressStatus(option);

  const remainingStops = getRemainingStops(option);
  if (remainingStops.length === 0) {
    journeyStops.innerHTML = '<div class="timeline-item"><h4>Bạn đã hoàn thành hoặc bỏ qua tất cả điểm dừng.</h4><p>Hãy tạo lại option mới để tiếp tục hành trình.</p></div>';
    updateEtaStatus(option);
    updateJourneyMap(option);
    return;
  }

  const nearestKey = currentUserPosition
    ? [...remainingStops]
      .map((stop) => ({ key: getStopKey(stop), distance: estimateDistanceToStop(stop) ?? Number.MAX_SAFE_INTEGER }))
      .sort((a, b) => a.distance - b.distance)[0]?.key
    : getStopKey(remainingStops[0]);

  journeyStops.innerHTML = remainingStops.map((stop, index) => {
    const distance = estimateDistanceToStop(stop);
    const distanceLabel = distance === null
      ? 'Chưa xác định khoảng cách'
      : `Cách bạn khoảng ${Math.round(distance)} m`;
    const stopKey = getStopKey(stop);
    const isActive = nearestKey && stopKey === nearestKey;

    return `
      <div class="timeline-item">
        <h4>${index + 1}. ${escapeHtml(stop.name)} ${isActive ? '<span class="option-badge">Điểm tiếp theo</span>' : ''}</h4>
        <p><strong>${escapeHtml(tr('card_address'))}:</strong> ${escapeHtml(stop.address)}</p>
        <p><strong>${escapeHtml(tr('route_why_visit'))}:</strong> ${escapeHtml(stop.why)}</p>
        <p><strong>${escapeHtml(tr('route_try_dish'))}:</strong> ${escapeHtml(stop.recommendedDish)}</p>
        <p><strong>${escapeHtml(tr('route_best_time'))}:</strong> ${escapeHtml(stop.bestTime)}</p>
        <p><strong>Khoảng cách:</strong> ${escapeHtml(distanceLabel)}</p>
        <div class="journey-stop-actions">
          <button type="button" class="button button-primary" data-stop-narrate="${escapeHtml(stop.locationId || '')}" data-stop-index="${index}">Nghe thuyết minh điểm này</button>
          <button type="button" class="button button-secondary" data-stop-guide="${index}">Dẫn đường</button>
          <button type="button" class="button button-secondary" data-stop-complete="${index}">Đã đến điểm này</button>
          <button type="button" class="button button-secondary" data-stop-skip="${index}">Bỏ qua điểm này</button>
        </div>
      </div>
    `;
  }).join('');

  updateEtaStatus(option);
  updateJourneyMap(option);
  updateOffRouteAlert(option);
}

function renderRouteOptions(response) {
  if (!routeOptionsPanel || !routeOptionsGrid) {
    return;
  }

  latestOptionsResponse = response;
  const options = response?.options ?? [];
  if (!Array.isArray(options) || options.length === 0) {
    routeOptionsPanel.classList.add('hidden');
    return;
  }

  routeOptionsPanel.classList.remove('hidden');
  const sortMode = routeOptionSort?.value || 'recommended';
  const { sorted, recommendedId } = sortOptions(options, sortMode, latestRouteRequest);

  routeOptionsGrid.innerHTML = sorted.map((option, index) => {
    const isRecommended = option.id === recommendedId;
    return `
    <article class="card route-option-card ${isRecommended ? 'recommended' : ''}">
      ${isRecommended ? '<span class="option-badge">Recommended</span>' : ''}
      <h3>${index + 1}. ${escapeHtml(option.title)}</h3>
      <p>${escapeHtml(option.summary)}</p>
      <p style="margin-top:.4rem;"><strong>Chiến lược:</strong> ${escapeHtml(option.strategy)}</p>
      <div class="route-option-metrics">
        <div class="metric">
          <div class="value">${escapeHtml(`${option.estimatedDurationMinutes} phút`)}</div>
          <div class="label">Thời lượng</div>
        </div>
        <div class="metric">
          <div class="value">${escapeHtml(formatCurrencyVnd(option.estimatedBudgetPerPersonVnd))}</div>
          <div class="label">Ngân sách/người</div>
        </div>
        <div class="metric">
          <div class="value">${escapeHtml(formatDistanceKm(option.estimatedWalkingMeters))}</div>
          <div class="label">Đi bộ ước tính</div>
        </div>
      </div>
      <p><strong>Thuyết minh:</strong> ${escapeHtml(option.narrationSummary)}</p>
      <div class="route-option-actions">
        <button type="button" class="button button-primary" data-option-index="${index}">Chọn option này</button>
        <button type="button" class="button button-secondary" data-option-preview="${index}">Xem chi tiết</button>
      </div>
    </article>
  `;
  }).join('');

  routeOptionsGrid.querySelectorAll('[data-option-preview]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number.parseInt(button.getAttribute('data-option-preview') || '-1', 10);
      const option = sorted[index];
      if (option) {
        renderRoutePlan({
          title: option.title,
          summary: option.summary,
          strategy: option.strategy,
          generatedBy: option.generatedBy,
          stops: option.stops
        });
      }
    });
  });

  routeOptionsGrid.querySelectorAll('[data-option-index]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number.parseInt(button.getAttribute('data-option-index') || '-1', 10);
      const option = sorted[index];
      if (!option) {
        return;
      }

      renderRoutePlan({
        title: option.title,
        summary: option.summary,
        strategy: option.strategy,
        generatedBy: option.generatedBy,
        stops: option.stops
      });

      loadJourneyProgress(option);
      renderJourney(option);
      if (journeyPanel) {
        journeyPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

async function locateUser() {
  if (!journeyGeoStatus) {
    return;
  }

  if (!navigator.geolocation) {
    journeyGeoStatus.textContent = 'Thiết bị không hỗ trợ định vị GPS trên trình duyệt.';
    return;
  }

  journeyGeoStatus.textContent = 'Đang lấy vị trí hiện tại...';

  await new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      updateUserPosition(position.coords.latitude, position.coords.longitude);

      if (journeyWatchId === null) {
        journeyWatchId = navigator.geolocation.watchPosition((nextPosition) => {
          updateUserPosition(nextPosition.coords.latitude, nextPosition.coords.longitude);
        }, () => {
          // Keep current snapshot if watch fails later.
        }, {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 8000
        });
      }

      resolve();
    }, (error) => {
      journeyGeoStatus.textContent = `Không lấy được vị trí: ${error.message}`;
      resolve();
    }, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 20000
    });
  });
}

function initNarrationEvents() {
  if (!narrationForm) {
    return;
  }

  narrationForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitBtn = narrationForm.querySelector('button');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = tr('state_generating');
    }

    try {
      await generateNarration();
    } catch (error) {
      alert(error.message);
    } finally {
      if (!narrationBusy && submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = tr('btn_audio_tts');
      }
    }
  });

  if (templateSelect) {
    templateSelect.addEventListener('change', () => {
      const selected = currentTemplates.find(item => item.id === templateSelect.value);
      if (!selected || !customText || !languageSelect || !voiceName || !locationSelect) {
        return;
      }

      customText.value = selected.sourceTextVi ?? '';
      languageSelect.value = selected.targetLanguage ?? languageSelect.value;
      voiceName.value = selected.voiceName ?? '';
      if (selected.locationId) {
        locationSelect.value = selected.locationId;
      }
    });
  }
}

function initLocationsEvents() {
  if (!locationsGrid) {
    return;
  }

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
      const targetSection = document.querySelector('#thuyet-minh');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      alert(error.message);
    }
  });
}

function initRouteEvents() {
  if (!routeForm || !visitorType || !budgetLevel || !startHour || !guestCount || !preferences || !mustTry) {
    return;
  }

  routeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    skippedStopKeys.clear();
    autoNarratedStopKeys.clear();

    const payload = {
      visitorType: visitorType.value.trim() || null,
      budgetLevel: budgetLevel.value || null,
      startHour: startHour.value || null,
      guestCount: guestCount.value ? Number.parseInt(guestCount.value, 10) : null,
      preferences: preferences.value.trim() || null,
      mustTry: mustTry.value.trim() || null,
      language: getPreferredLanguage()
    };
    latestRouteRequest = payload;

    const button = routeForm.querySelector('button');
    if (button) {
      button.disabled = true;
      button.textContent = tr('state_suggesting');
    }

    try {
      const response = await fetch('/api/routes/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || tr('route_failed'));
      }

      const optionsResponse = normalizeOptionsResponse(result);
      renderRouteOptions(optionsResponse);
      const sortMode = routeOptionSort?.value || 'recommended';
      const firstOption = sortOptions(optionsResponse?.options || [], sortMode, latestRouteRequest).sorted[0];
      if (firstOption) {
        renderRoutePlan({
          title: firstOption.title,
          summary: firstOption.summary,
          strategy: firstOption.strategy,
          generatedBy: firstOption.generatedBy,
          stops: firstOption.stops
        });
      }
    } catch (error) {
      alert(error.message);
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = tr('btn_route_suggest');
      }
    }
  });

  if (routeOptionSort) {
    routeOptionSort.addEventListener('change', () => {
      if (latestOptionsResponse) {
        renderRouteOptions(latestOptionsResponse);
      }
    });
  }

  if (journeyLocateBtn) {
    journeyLocateBtn.addEventListener('click', () => {
      void locateUser();
    });
  }

  if (journeyRerouteBtn) {
    journeyRerouteBtn.addEventListener('click', () => {
      rerouteFromCurrentPosition();
    });
  }

  if (journeyBackToNearestBtn) {
    journeyBackToNearestBtn.addEventListener('click', () => {
      const fallback = getRemainingStops(selectedRouteOption)[0];
      const targetStop = nearestRemainingStop || fallback;
      if (!targetStop) {
        alert('Không có điểm dừng phù hợp để dẫn đường.');
        return;
      }

      openDirectionsToStop(targetStop);
    });
  }

  if (journeyStops) {
    journeyStops.addEventListener('click', async (event) => {
      const activeStops = getRemainingStops(selectedRouteOption);

      const narrateBtn = event.target.closest('[data-stop-narrate]');
      if (narrateBtn && selectedRouteOption) {
        const stopIndex = Number.parseInt(narrateBtn.getAttribute('data-stop-index') || '-1', 10);
        const stop = activeStops?.[stopIndex];
        if (stop) {
          try {
            await playStopNarration(stop, 'manual');
          } catch (error) {
            alert(error.message);
          }
        }
        return;
      }

      const guideBtn = event.target.closest('[data-stop-guide]');
      if (guideBtn && selectedRouteOption) {
        const stopIndex = Number.parseInt(guideBtn.getAttribute('data-stop-guide') || '-1', 10);
        const stop = activeStops?.[stopIndex];
        if (stop) {
          openDirectionsToStop(stop);
        }
        return;
      }

      const skipBtn = event.target.closest('[data-stop-skip]');
      if (skipBtn && selectedRouteOption) {
        const stopIndex = Number.parseInt(skipBtn.getAttribute('data-stop-skip') || '-1', 10);
        const stop = activeStops?.[stopIndex];
        const stopKey = getStopKey(stop);
        if (stopKey) {
          skippedStopKeys.add(stopKey);
          saveJourneyProgress(selectedRouteOption);
          renderJourney(selectedRouteOption);
        }
        return;
      }

      const completeBtn = event.target.closest('[data-stop-complete]');
      if (completeBtn && selectedRouteOption) {
        const stopIndex = Number.parseInt(completeBtn.getAttribute('data-stop-complete') || '-1', 10);
        const stop = activeStops?.[stopIndex];
        const stopKey = getStopKey(stop);
        if (stopKey) {
          completedStopKeys.add(stopKey);
          saveJourneyProgress(selectedRouteOption);
          renderJourney(selectedRouteOption);
        }
      }
    });
  }

  window.addEventListener('beforeunload', () => {
    if (journeyWatchId !== null && navigator.geolocation?.clearWatch) {
      navigator.geolocation.clearWatch(journeyWatchId);
      journeyWatchId = null;
    }
  });
}

async function initPage() {
  initNarrationEvents();
  initLocationsEvents();
  initRouteEvents();

  try {
    if (locationsGrid || locationSelect) {
      await loadLocations();
    }

    if (templateSelect) {
      await loadNarrationTemplates();
    }
  } catch (error) {
    if (locationsGrid) {
      locationsGrid.innerHTML = `<article class="card-skeleton">${escapeHtml(error.message)}</article>`;
    }
  }
}

void initPage();
