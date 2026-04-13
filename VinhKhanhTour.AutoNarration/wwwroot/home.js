const homeLocationsGrid = document.getElementById('homeLocationsGrid');
const languageModal = document.getElementById('languageModal');
const assistantForm = document.getElementById('assistantForm');
const assistantQuestion = document.getElementById('assistantQuestion');
const assistantResult = document.getElementById('assistantResult');
const assistantAnswer = document.getElementById('assistantAnswer');
const assistantSuggested = document.getElementById('assistantSuggested');
const accountFullName = document.getElementById('accountFullName');
const accountEmail = document.getElementById('accountEmail');
const accountLogoutBtn = document.getElementById('accountLogoutBtn');
const metricVisits = document.getElementById('metricVisits');
const metricNarrations = document.getElementById('metricNarrations');
const metricRoutes = document.getElementById('metricRoutes');
const visitHistoryList = document.getElementById('visitHistoryList');
const routeHistoryList = document.getElementById('routeHistoryList');
const narrationHistoryList = document.getElementById('narrationHistoryList');
const merchantAdsGrid = document.getElementById('merchantAdsGrid');
const adsTypeFilter = document.getElementById('adsTypeFilter');
const adsTimeFilter = document.getElementById('adsTimeFilter');
const adsFilterApplyBtn = document.getElementById('adsFilterApplyBtn');

const SITE_LANGUAGE_KEY = 'siteLanguage';

const i18n = {
  vi: {
    modalTitle: 'Chọn ngôn ngữ trước khi bắt đầu',
    modalHint: 'Nội dung trang chủ và gợi ý trải nghiệm sẽ theo ngôn ngữ bạn chọn.',
    heroTitle: 'Hệ Thống Phố Ẩm Thực Vĩnh Khánh',
    heroSubtitle: 'Trải nghiệm du lịch ẩm thực hoàn toàn mới với thuyết minh tự động, gợi ý lộ trình AI và kết nối GPS thông minh — Khám phá điểm đến nhộn nhịp nhất về đêm.',
    heroPrimary: 'Khám phá món nổi bật',
    heroSecondary: 'Xem món nổi bật',
    featuredTitle: 'Món/quán nổi bật để tạo thuyết minh nhanh',
    featuredButton: 'Nghe ngay',
    featuredHint: 'Nhấn để nghe thuyết minh ngay theo ngôn ngữ đã chọn'
  },
  en: {
    modalTitle: 'Choose your language before starting',
    modalHint: 'Homepage content and trip suggestions will follow your selected language.',
    heroTitle: 'Vinh Khanh Night Culinary System',
    heroSubtitle: 'Discover night food tours with instant narration, AI route suggestions, and smart GPS guidance.',
    heroPrimary: 'Explore Featured Foods',
    heroSecondary: 'Explore Featured Foods',
    featuredTitle: 'Featured places for instant narration',
    featuredButton: 'Listen now',
    featuredHint: 'Tap to listen immediately in your selected language'
  },
  fr: {
    modalTitle: 'Choisissez votre langue avant de commencer',
    modalHint: 'Le contenu d accueil et les suggestions suivront la langue choisie.',
    heroTitle: 'Systeme Culinaire Nocturne Vinh Khanh',
    heroSubtitle: 'Explorez la rue gourmande de nuit avec narration automatique, itineraire IA et guidage GPS.',
    heroPrimary: 'Voir les plats populaires',
    heroSecondary: 'Voir les plats populaires',
    featuredTitle: 'Lieux recommandes pour narration rapide',
    featuredButton: 'Ecouter',
    featuredHint: 'Appuyez pour ecouter immediatement dans la langue choisie'
  },
  ja: {
    modalTitle: '開始前に言語を選択してください',
    modalHint: 'ホームの内容とおすすめ情報は選択した言語で表示されます。',
    heroTitle: 'ビンカイン夜のグルメ体験システム',
    heroSubtitle: '自動ナレーション、AIルート提案、GPS連携で夜の食体験を案内します。',
    heroPrimary: '人気スポットを見る',
    heroSecondary: '人気スポットを見る',
    featuredTitle: 'すぐにナレーションできる注目スポット',
    featuredButton: '今すぐ再生',
    featuredHint: '選択した言語でそのまま再生します'
  },
  ko: {
    modalTitle: '시작 전에 언어를 선택하세요',
    modalHint: '홈페이지 내용과 추천 정보가 선택 언어에 맞게 표시됩니다.',
    heroTitle: '빈칸 야간 미식 투어 시스템',
    heroSubtitle: '자동 내레이션, AI 경로 추천, GPS 연동으로 밤거리 미식 여행을 안내합니다.',
    heroPrimary: '추천 맛집 보기',
    heroSecondary: '추천 맛집 보기',
    featuredTitle: '빠른 내레이션 추천 맛집',
    featuredButton: '바로 듣기',
    featuredHint: '선택한 언어로 바로 재생됩니다'
  }
};

let quickPlayer;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getLang() {
  const lang = window.siteI18n?.getSiteLanguage?.() || localStorage.getItem(SITE_LANGUAGE_KEY) || 'vi';
  return i18n[lang] ? lang : 'vi';
}

function setLang(lang) {
  const normalized = i18n[lang] ? lang : 'vi';
  localStorage.setItem(SITE_LANGUAGE_KEY, normalized);
  if (window.siteI18n?.setSiteLanguage) {
    window.siteI18n.setSiteLanguage(normalized);
  }
}

function ensureQuickPlayer() {
  if (quickPlayer) {
    return quickPlayer;
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

  quickPlayer = host;
  return host;
}

async function playInstantNarration(locationId, locationName, lang) {
  const response = await fetch('/api/narrations/instant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ locationId, targetLanguage: lang })
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result?.detail || result?.message || i18n.vi.narration_failed || 'Play failed.');
  }

  const host = ensureQuickPlayer();
  const title = host.querySelector('#quickPlayerTitle');
  const audio = host.querySelector('#quickPlayerAudio');
  if (!audio) {
    return;
  }

  if (title) {
    title.textContent = `Đang phát: ${locationName}`;
  }

  host.classList.remove('hidden');
  audio.src = result.audioUrl;

  try {
    await audio.play();
  } catch {
    // Browser autoplay policy may block play without direct gesture.
  }
}

function applyI18n(lang) {
  const t = i18n[lang] ?? i18n.vi;
  const heroTitle = document.getElementById('heroTitle');
  const heroSubtitle = document.getElementById('heroSubtitle');
  const heroPrimary = document.getElementById('heroPrimaryAction');
  const heroSecondary = document.getElementById('heroSecondaryAction');
  const featuredTitle = document.getElementById('featuredSectionTitle');
  const modalTitle = document.getElementById('languageModalTitle');
  const modalHint = document.getElementById('languageModalHint');

  if (heroTitle) heroTitle.textContent = t.heroTitle;
  if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;
  if (heroPrimary) heroPrimary.textContent = t.heroPrimary;
  if (heroSecondary) heroSecondary.textContent = t.heroSecondary;
  if (featuredTitle) featuredTitle.textContent = t.featuredTitle;
  if (modalTitle) modalTitle.textContent = t.modalTitle;
  if (modalHint) modalHint.textContent = t.modalHint;

  if (window.siteI18n?.applySiteLanguage) {
    window.siteI18n.applySiteLanguage(lang);
  }
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

async function renderFeaturedLocations(lang) {
  if (!homeLocationsGrid) {
    return;
  }

  const t = i18n[lang] ?? i18n.vi;

  try {
    const response = await fetch('/api/locations');
    if (!response.ok) {
      throw new Error('Không tải được danh sách địa điểm.');
    }

    const data = await response.json();
    const locations = (Array.isArray(data) ? data : (data.value ?? []))
      .slice(0, 6)
      .map((item) => window.localizeLocationData ? window.localizeLocationData(item, lang) : item);

    homeLocationsGrid.innerHTML = locations.map((location) => `
      <article class="card">
        <img class="card-visual" src="${getCardImage(location.id)}" alt="${escapeHtml(location.name)}" />
        <div class="card-head">
          <span class="tag">${escapeHtml(location.category)}</span>
          <span class="tag" style="background:var(--bg); color:var(--text-secondary); border: 1px solid var(--border);">${escapeHtml(location.bestTime)}</span>
        </div>
        <h3>${escapeHtml(location.name)}</h3>
        <p>${escapeHtml(location.shortIntro)}</p>
        <p style="margin-top:.4rem; font-size:.84rem; color:var(--text-secondary);">${escapeHtml(t.featuredHint)}</p>
        <button type="button" class="button button-primary" data-listen-id="${escapeHtml(location.id)}" data-listen-name="${escapeHtml(location.name)}">${escapeHtml(t.featuredButton)}</button>
      </article>
    `).join('');

    homeLocationsGrid.querySelectorAll('[data-listen-id]').forEach((button) => {
      button.addEventListener('click', async () => {
        const listenId = button.getAttribute('data-listen-id');
        const listenName = button.getAttribute('data-listen-name') || 'Audio';
        if (!listenId) {
          return;
        }

        button.setAttribute('disabled', 'disabled');
        const previous = button.textContent;
        button.textContent = '...';

        try {
          await playInstantNarration(listenId, listenName, lang);
        } catch (error) {
          alert(error.message);
        } finally {
          button.removeAttribute('disabled');
          button.textContent = previous;
        }
      });
    });
  } catch (error) {
    homeLocationsGrid.innerHTML = `<article class="card card-skeleton">${escapeHtml(error.message)}</article>`;
  }
}

function initAssistant() {
  if (!assistantForm || !assistantQuestion || !assistantResult || !assistantAnswer || !assistantSuggested) {
    return;
  }

  assistantForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const lang = getLang();
    const question = assistantQuestion.value.trim();
    if (!question) {
      return;
    }

    const button = assistantForm.querySelector('button');
    if (button) {
      button.setAttribute('disabled', 'disabled');
      button.textContent = window.siteI18n?.translate?.('assistant_thinking', lang) || 'Thinking...';
    }

    assistantResult.classList.remove('hidden');
    assistantAnswer.textContent = window.siteI18n?.translate?.('assistant_thinking', lang) || 'Thinking...';
    assistantSuggested.textContent = '';

    try {
      const response = await fetch('/api/assistant/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, language: lang })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.detail || result?.message || window.siteI18n?.translate?.('assistant_error', lang) || 'Error');
      }

      assistantAnswer.textContent = result.answer;
      assistantSuggested.textContent = (result.suggestedLocations || []).join(' | ');
    } catch (error) {
      assistantAnswer.textContent = error.message;
    } finally {
      if (button) {
        button.removeAttribute('disabled');
        button.textContent = window.siteI18n?.translate?.('assistant_ask_btn', lang) || 'Ask';
      }
    }
  });
}

function initLanguageModal() {
  if (!languageModal) {
    return;
  }

  const saved = localStorage.getItem(SITE_LANGUAGE_KEY);
  if (!saved || !i18n[saved]) {
    languageModal.classList.remove('hidden');
  }

  languageModal.querySelectorAll('[data-lang-choice]').forEach((button) => {
    button.addEventListener('click', async () => {
      const lang = button.getAttribute('data-lang-choice') || 'vi';
      setLang(lang);
      applyI18n(lang);
      languageModal.classList.add('hidden');
      await renderFeaturedLocations(lang);
    });
  });
}

function formatDateTime(value) {
  if (!value) {
    return '';
  }

  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) {
    return '';
  }

  return dt.toLocaleString('vi-VN');
}

function renderHistoryList(container, items) {
  if (!container) {
    return;
  }

  if (!items || items.length === 0) {
    container.innerHTML = '<li>Chưa có dữ liệu.</li>';
    return;
  }

  container.innerHTML = items.map((item) => `<li>${item}</li>`).join('');
}

async function loadAccountDashboard() {
  if (!accountFullName || !accountEmail) {
    return;
  }

  try {
    const response = await fetch('/api/account/dashboard');
    if (!response.ok) {
      throw new Error('Không tải được dữ liệu tài khoản.');
    }

    const data = await response.json();
    const user = data.user || {};
    const metrics = data.metrics || {};
    const visits = Array.isArray(data.visitHistory) ? data.visitHistory : [];
    const routes = Array.isArray(data.routeHistory) ? data.routeHistory : [];
    const narrations = Array.isArray(data.narrationHistory) ? data.narrationHistory : [];

    accountFullName.textContent = user.fullName || 'Tài khoản cá nhân';
    accountEmail.textContent = user.email || '';

    if (metricVisits) {
      metricVisits.textContent = String(metrics.totalVisits ?? visits.length ?? 0);
    }

    if (metricNarrations) {
      metricNarrations.textContent = String(metrics.totalNarrations ?? narrations.length ?? 0);
    }

    if (metricRoutes) {
      metricRoutes.textContent = String(metrics.totalRoutes ?? routes.length ?? 0);
    }

    renderHistoryList(visitHistoryList, visits.map((x) => `${escapeHtml(x.path || '/')} - ${formatDateTime(x.visitedAt)}`));
    renderHistoryList(routeHistoryList, routes.map((x) => {
      const pref = x.preferences ? ` | sở thích: ${escapeHtml(x.preferences)}` : '';
      const stops = x.stopSummary ? ` | điểm: ${escapeHtml(x.stopSummary)}` : '';
      return `${escapeHtml(x.planTitle || 'Lộ trình')} (${escapeHtml(x.generatedBy || 'AI')})${pref}${stops} - ${formatDateTime(x.createdAt)}`;
    }));
    renderHistoryList(narrationHistoryList, narrations.map((x) => {
      const locationName = x.locationName || 'Nội dung tùy chỉnh';
      return `${escapeHtml(locationName)} | ${escapeHtml(x.targetLanguage || '')} | ${escapeHtml(x.voiceName || '')} - ${formatDateTime(x.generatedAt)}`;
    }));
  } catch (error) {
    accountFullName.textContent = 'Không tải được dashboard';
    accountEmail.textContent = error.message || 'Vui lòng thử lại.';
  }
}

function initAccountLogout() {
  if (!accountLogoutBtn) {
    return;
  }

  accountLogoutBtn.addEventListener('click', async () => {
    accountLogoutBtn.setAttribute('disabled', 'disabled');

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      window.location.href = '/login.html';
    }
  });
}

async function loadMerchantAds() {
  if (!merchantAdsGrid) {
    return;
  }

  try {
    const selectedType = adsTypeFilter?.value || 'all';
    const selectedTime = adsTimeFilter?.value || 'all';
    const query = new URLSearchParams({
      take: '8',
      type: selectedType,
      time: selectedTime
    });
    const response = await fetch(`/api/public/merchant-ads?${query.toString()}`);
    if (!response.ok) {
      throw new Error('Không tải được quảng cáo từ quán ăn.');
    }

    const ads = await response.json();
    if (!Array.isArray(ads) || ads.length === 0) {
      merchantAdsGrid.innerHTML = '<article class="card"><p>Hiện chưa có ưu đãi nào được duyệt.</p></article>';
      return;
    }

    const lang = getLang();
    merchantAdsGrid.innerHTML = ads.map((item) => `
      <article class="card merchant-ad-card">
        <div class="card-head">
          <span class="tag">${escapeHtml(item.requestType === 'promotion' ? 'Khuyến mãi' : 'Quảng cáo')}</span>
          ${item.isPinnedTop ? '<span class="tag ad-top-tag">TOP</span>' : ''}
          <span class="tag" style="background:var(--bg); color:var(--text-secondary); border: 1px solid var(--border);">${escapeHtml(new Date(item.approvedAt).toLocaleDateString('vi-VN'))}</span>
        </div>
        <h3>${escapeHtml(item.title || 'Ưu đãi từ quán')}</h3>
        <p><strong>${escapeHtml(item.locationName || item.locationId || 'Quán ăn')}</strong></p>
        <p>${escapeHtml(item.description || '')}</p>
        <p class="merchant-ad-time">${escapeHtml(item.campaignStartAt ? new Date(item.campaignStartAt).toLocaleString('vi-VN') : 'Ngay bây giờ')} - ${escapeHtml(item.campaignEndAt ? new Date(item.campaignEndAt).toLocaleString('vi-VN') : 'Không giới hạn')}</p>
        <div class="merchant-ad-actions">
          <a class="button button-primary" href="/scan-narration.html?locationId=${encodeURIComponent(item.locationId || '')}&lang=${encodeURIComponent(lang)}">Xem chi tiết quán</a>
          <a class="button button-secondary" href="/ban-do.html?locationId=${encodeURIComponent(item.locationId || '')}&lang=${encodeURIComponent(lang)}">Mở bản đồ</a>
        </div>
      </article>
    `).join('');
  } catch (error) {
    merchantAdsGrid.innerHTML = `<article class="card"><p>${escapeHtml(error?.message || 'Không tải được ưu đãi.')}</p></article>`;
  }
}

(async function initHomePage() {
  const lang = getLang();
  applyI18n(lang);
  initLanguageModal();
  initAssistant();
  initAccountLogout();

  adsFilterApplyBtn?.addEventListener('click', () => {
    void loadMerchantAds();
  });

  adsTypeFilter?.addEventListener('change', () => {
    void loadMerchantAds();
  });

  adsTimeFilter?.addEventListener('change', () => {
    void loadMerchantAds();
  });

  await loadAccountDashboard();
  await loadMerchantAds();
  await renderFeaturedLocations(lang);
})();
