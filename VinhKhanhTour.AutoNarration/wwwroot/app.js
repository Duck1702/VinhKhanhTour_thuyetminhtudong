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

let currentLocations = [];
let currentTemplates = [];
let narrationBusy = false;
let quickPlayerHost;
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

    const payload = {
      visitorType: visitorType.value.trim() || null,
      budgetLevel: budgetLevel.value || null,
      startHour: startHour.value || null,
      guestCount: guestCount.value ? Number.parseInt(guestCount.value, 10) : null,
      preferences: preferences.value.trim() || null,
      mustTry: mustTry.value.trim() || null,
      language: getPreferredLanguage()
    };

    const button = routeForm.querySelector('button');
    if (button) {
      button.disabled = true;
      button.textContent = tr('state_suggesting');
    }

    try {
      const response = await fetch('/api/routes/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || tr('route_failed'));
      }

      renderRoutePlan(result);
    } catch (error) {
      alert(error.message);
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = tr('btn_route_suggest');
      }
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
