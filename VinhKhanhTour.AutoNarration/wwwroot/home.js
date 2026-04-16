const homeLocationsGrid = document.getElementById('homeLocationsGrid');
const languageModal = document.getElementById('languageModal');
const assistantForm = document.getElementById('assistantForm');
const assistantQuestion = document.getElementById('assistantQuestion');
const assistantResult = document.getElementById('assistantResult');
const assistantAnswer = document.getElementById('assistantAnswer');
const assistantSuggested = document.getElementById('assistantSuggested');
const merchantAdsGrid = document.getElementById('merchantAdsGrid');
const adsTypeFilter = document.getElementById('adsTypeFilter');
const adsTimeFilter = document.getElementById('adsTimeFilter');
const adsFilterApplyBtn = document.getElementById('adsFilterApplyBtn');
const merchantAdsCarousel = document.getElementById('merchantAdsCarousel');
const merchantAdsPrevBtn = document.getElementById('merchantAdsPrevBtn');
const merchantAdsNextBtn = document.getElementById('merchantAdsNextBtn');
const merchantAdsDots = document.getElementById('merchantAdsDots');
const merchantAdModal = document.getElementById('merchantAdModal');
const merchantAdModalTitle = document.getElementById('merchantAdModalTitle');
const merchantAdModalMeta = document.getElementById('merchantAdModalMeta');
const merchantAdModalDesc = document.getElementById('merchantAdModalDesc');
const merchantAdModalTime = document.getElementById('merchantAdModalTime');
const merchantAdModalDetailLink = document.getElementById('merchantAdModalDetailLink');
const merchantAdModalMapLink = document.getElementById('merchantAdModalMapLink');
const merchantAdModalCloseBtn = document.getElementById('merchantAdModalCloseBtn');
const liveParticipantsText = document.getElementById('liveParticipantsText');
const liveParticipantsHint = document.getElementById('liveParticipantsHint');

const MERCHANT_AD_FALLBACK_IMAGES = [
  '/assets/vinh-khanh-banner.jpg',
  '/assets/vinh-khanh-street.jpg',
  '/assets/map.svg'
];
let merchantAdsData = [];
let merchantAdsCurrentIndex = 0;
let merchantAdsAutoSlideTimer;

const SITE_LANGUAGE_KEY = 'siteLanguage';
const LIVE_PARTICIPANT_KEY = 'vktour.liveParticipantId';
const LIVE_HEARTBEAT_INTERVAL_MS = 15000;
let liveHeartbeatTimer;

const liveParticipantsI18n = {
  vi: {
    onlineText: (count) => `Dang co ${count} nguoi tham gia truc tuyen`,
    hint: 'Mo them 2-3 thiet bi/trinh duyet de xem so luong tang realtime.'
  },
  en: {
    onlineText: (count) => `${count} participants are online now`,
    hint: 'Open 2-3 browsers/devices to verify realtime updates.'
  },
  fr: {
    onlineText: (count) => `${count} participants en ligne actuellement`,
    hint: 'Ouvrez 2-3 navigateurs/appareils pour verifier la mise a jour en temps reel.'
  },
  ja: {
    onlineText: (count) => `現在 ${count} 人がオンラインで参加中`,
    hint: '2-3台の端末またはブラウザを開くとリアルタイム更新を確認できます。'
  },
  ko: {
    onlineText: (count) => `현재 ${count}명이 온라인 참여 중`,
    hint: '브라우저/기기를 2-3개 열어 실시간 증가를 확인하세요.'
  }
};

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

const dealsI18n = {
  vi: {
    sectionTitle: 'Khám phá Vĩnh Khánh với vô vàn ưu đãi',
    typeLabel: 'Loại quảng cáo',
    timeLabel: 'Thời gian',
    typeAll: 'Tất cả',
    typePromotion: 'Khuyến mãi',
    typeAdvertisement: 'Quảng cáo',
    timeAll: 'Tất cả thời gian',
    timeActive: 'Đang diễn ra',
    timeToday: 'Trong hôm nay',
    timeWeek: '7 ngày',
    applyFilter: 'Lọc',
    carouselAria: 'Carousel ưu đãi quán ăn',
    prevAria: 'Ưu đãi trước',
    nextAria: 'Ưu đãi tiếp theo',
    dotsAria: 'Điều hướng ưu đãi',
    dotAria: (index) => `Xem ưu đãi ${index + 1}`,
    loading: 'Đang tải ưu đãi mới nhất...',
    empty: 'Hiện chưa có ưu đãi nào được duyệt.',
    openCta: 'Bấm để xem chi tiết ưu đãi',
    requestPromotion: 'Khuyến mãi',
    requestAdvertisement: 'Quảng cáo',
    topTag: 'TOP',
    fallbackTitle: 'Ưu đãi từ quán',
    fallbackLocation: 'Quán ăn',
    fallbackDescription: 'Ưu đãi đang được cập nhật chi tiết.',
    now: 'Ngay bây giờ',
    unlimited: 'Không giới hạn',
    detailButton: 'Xem ưu đãi chi tiết',
    mapButton: 'Mở bản đồ',
    modalTitle: 'Chi tiết ưu đãi',
    modalClose: 'Đóng',
    modalDetailLink: 'Xem thông tin quán',
    modalMapLink: 'Mở bản đồ',
    modalCloseAria: 'Đóng chi tiết ưu đãi',
    apiError: 'Không tải được quảng cáo từ quán ăn.'
  },
  en: {
    sectionTitle: 'Explore Vinh Khanh with plenty of offers',
    typeLabel: 'Ad type',
    timeLabel: 'Time',
    typeAll: 'All',
    typePromotion: 'Promotion',
    typeAdvertisement: 'Advertisement',
    timeAll: 'All time',
    timeActive: 'Active now',
    timeToday: 'Today',
    timeWeek: '7 days',
    applyFilter: 'Filter',
    carouselAria: 'Restaurant offers carousel',
    prevAria: 'Previous offer',
    nextAria: 'Next offer',
    dotsAria: 'Offer navigation',
    dotAria: (index) => `View offer ${index + 1}`,
    loading: 'Loading latest offers...',
    empty: 'No approved offers yet.',
    openCta: 'Tap to view offer details',
    requestPromotion: 'Promotion',
    requestAdvertisement: 'Advertisement',
    topTag: 'TOP',
    fallbackTitle: 'Offer from restaurant',
    fallbackLocation: 'Restaurant',
    fallbackDescription: 'Offer details are being updated.',
    now: 'Now',
    unlimited: 'No limit',
    detailButton: 'View offer details',
    mapButton: 'Open map',
    modalTitle: 'Offer details',
    modalClose: 'Close',
    modalDetailLink: 'View restaurant details',
    modalMapLink: 'Open map',
    modalCloseAria: 'Close offer details',
    apiError: 'Unable to load restaurant offers.'
  },
  fr: {
    sectionTitle: 'Decouvrez Vinh Khanh avec de nombreuses offres',
    typeLabel: 'Type',
    timeLabel: 'Periode',
    typeAll: 'Tout',
    typePromotion: 'Promotion',
    typeAdvertisement: 'Publicite',
    timeAll: 'Toute periode',
    timeActive: 'En cours',
    timeToday: 'Aujourd hui',
    timeWeek: '7 jours',
    applyFilter: 'Filtrer',
    carouselAria: 'Carrousel des offres',
    prevAria: 'Offre precedente',
    nextAria: 'Offre suivante',
    dotsAria: 'Navigation des offres',
    dotAria: (index) => `Voir offre ${index + 1}`,
    loading: 'Chargement des offres...',
    empty: 'Aucune offre approuvee pour le moment.',
    openCta: 'Touchez pour voir les details',
    requestPromotion: 'Promotion',
    requestAdvertisement: 'Publicite',
    topTag: 'TOP',
    fallbackTitle: 'Offre du restaurant',
    fallbackLocation: 'Restaurant',
    fallbackDescription: 'Details en cours de mise a jour.',
    now: 'Maintenant',
    unlimited: 'Sans limite',
    detailButton: 'Voir les details',
    mapButton: 'Ouvrir la carte',
    modalTitle: 'Details de l offre',
    modalClose: 'Fermer',
    modalDetailLink: 'Voir le restaurant',
    modalMapLink: 'Ouvrir la carte',
    modalCloseAria: 'Fermer les details',
    apiError: 'Impossible de charger les offres.'
  },
  ja: {
    sectionTitle: '特典いっぱいのビンカインを探索',
    typeLabel: '広告タイプ',
    timeLabel: '期間',
    typeAll: 'すべて',
    typePromotion: 'キャンペーン',
    typeAdvertisement: '広告',
    timeAll: 'すべての期間',
    timeActive: '開催中',
    timeToday: '本日',
    timeWeek: '7日間',
    applyFilter: '絞り込み',
    carouselAria: '特典カルーセル',
    prevAria: '前の特典',
    nextAria: '次の特典',
    dotsAria: '特典ナビゲーション',
    dotAria: (index) => `特典 ${index + 1} を表示`,
    loading: '最新特典を読み込み中...',
    empty: '承認済み特典はまだありません。',
    openCta: 'タップして詳細を見る',
    requestPromotion: 'キャンペーン',
    requestAdvertisement: '広告',
    topTag: 'TOP',
    fallbackTitle: '店舗からの特典',
    fallbackLocation: '店舗',
    fallbackDescription: '特典詳細を更新中です。',
    now: '今すぐ',
    unlimited: '期限なし',
    detailButton: '特典詳細を見る',
    mapButton: '地図を開く',
    modalTitle: '特典詳細',
    modalClose: '閉じる',
    modalDetailLink: '店舗情報を見る',
    modalMapLink: '地図を開く',
    modalCloseAria: '特典詳細を閉じる',
    apiError: '特典を読み込めません。'
  },
  ko: {
    sectionTitle: '다양한 혜택으로 빈칸 탐험하기',
    typeLabel: '광고 유형',
    timeLabel: '기간',
    typeAll: '전체',
    typePromotion: '프로모션',
    typeAdvertisement: '광고',
    timeAll: '전체 기간',
    timeActive: '진행 중',
    timeToday: '오늘',
    timeWeek: '7일',
    applyFilter: '필터',
    carouselAria: '혜택 캐러셀',
    prevAria: '이전 혜택',
    nextAria: '다음 혜택',
    dotsAria: '혜택 탐색',
    dotAria: (index) => `혜택 ${index + 1} 보기`,
    loading: '최신 혜택 불러오는 중...',
    empty: '승인된 혜택이 아직 없습니다.',
    openCta: '눌러서 혜택 상세 보기',
    requestPromotion: '프로모션',
    requestAdvertisement: '광고',
    topTag: 'TOP',
    fallbackTitle: '매장 혜택',
    fallbackLocation: '매장',
    fallbackDescription: '혜택 상세를 업데이트 중입니다.',
    now: '지금',
    unlimited: '기한 없음',
    detailButton: '혜택 상세 보기',
    mapButton: '지도 열기',
    modalTitle: '혜택 상세',
    modalClose: '닫기',
    modalDetailLink: '매장 정보 보기',
    modalMapLink: '지도 열기',
    modalCloseAria: '혜택 상세 닫기',
    apiError: '매장 혜택을 불러올 수 없습니다.'
  }
};

function getDealsText(lang) {
  return dealsI18n[lang] ?? dealsI18n.vi;
}

function getDateLocale(lang) {
  const map = {
    vi: 'vi-VN',
    en: 'en-US',
    fr: 'fr-FR',
    ja: 'ja-JP',
    ko: 'ko-KR'
  };

  return map[lang] ?? 'vi-VN';
}

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
  if (!window.narrationPayment?.payForNarration) {
    throw new Error('Thiếu mô-đun thanh toán thuyết minh.');
  }

  const payment = await window.narrationPayment.payForNarration({
    locationId,
    targetLanguage: lang,
    locationName
  });

  const response = await fetch('/api/public/narrations/instant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      locationId,
      targetLanguage: lang,
      participantId: payment.participantId,
      paymentToken: payment.paymentToken
    })
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
  const dealText = getDealsText(lang);
  const liveText = liveParticipantsI18n[lang] ?? liveParticipantsI18n.vi;
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
  if (liveParticipantsText) liveParticipantsText.textContent = liveText.onlineText(0);
  if (liveParticipantsHint) liveParticipantsHint.textContent = liveText.hint;

  const merchantAdsTitle = document.getElementById('merchantAdsTitle');
  const adsTypeFilterLabel = document.getElementById('adsTypeFilterLabel');
  const adsTimeFilterLabel = document.getElementById('adsTimeFilterLabel');
  const adsTypeOptionAll = document.getElementById('adsTypeOptionAll');
  const adsTypeOptionPromotion = document.getElementById('adsTypeOptionPromotion');
  const adsTypeOptionAdvertisement = document.getElementById('adsTypeOptionAdvertisement');
  const adsTimeOptionAll = document.getElementById('adsTimeOptionAll');
  const adsTimeOptionActive = document.getElementById('adsTimeOptionActive');
  const adsTimeOptionToday = document.getElementById('adsTimeOptionToday');
  const adsTimeOptionWeek = document.getElementById('adsTimeOptionWeek');
  const modalBackdrop = merchantAdModal?.querySelector('[data-ad-modal-close]');

  if (merchantAdsTitle) merchantAdsTitle.textContent = dealText.sectionTitle;
  if (adsTypeFilterLabel) adsTypeFilterLabel.textContent = dealText.typeLabel;
  if (adsTimeFilterLabel) adsTimeFilterLabel.textContent = dealText.timeLabel;
  if (adsTypeOptionAll) adsTypeOptionAll.textContent = dealText.typeAll;
  if (adsTypeOptionPromotion) adsTypeOptionPromotion.textContent = dealText.typePromotion;
  if (adsTypeOptionAdvertisement) adsTypeOptionAdvertisement.textContent = dealText.typeAdvertisement;
  if (adsTimeOptionAll) adsTimeOptionAll.textContent = dealText.timeAll;
  if (adsTimeOptionActive) adsTimeOptionActive.textContent = dealText.timeActive;
  if (adsTimeOptionToday) adsTimeOptionToday.textContent = dealText.timeToday;
  if (adsTimeOptionWeek) adsTimeOptionWeek.textContent = dealText.timeWeek;
  if (adsFilterApplyBtn) adsFilterApplyBtn.textContent = dealText.applyFilter;
  if (merchantAdsCarousel) merchantAdsCarousel.setAttribute('aria-label', dealText.carouselAria);
  if (merchantAdsPrevBtn) merchantAdsPrevBtn.setAttribute('aria-label', dealText.prevAria);
  if (merchantAdsNextBtn) merchantAdsNextBtn.setAttribute('aria-label', dealText.nextAria);
  if (merchantAdsDots) merchantAdsDots.setAttribute('aria-label', dealText.dotsAria);
  if (merchantAdModalTitle) merchantAdModalTitle.textContent = dealText.modalTitle;
  if (merchantAdModalCloseBtn) merchantAdModalCloseBtn.textContent = dealText.modalClose;
  if (merchantAdModalDetailLink) merchantAdModalDetailLink.textContent = dealText.modalDetailLink;
  if (merchantAdModalMapLink) merchantAdModalMapLink.textContent = dealText.modalMapLink;
  if (modalBackdrop) modalBackdrop.setAttribute('aria-label', dealText.modalCloseAria);

  if (window.siteI18n?.applySiteLanguage) {
    window.siteI18n.applySiteLanguage(lang);
  }
}

function getLiveParticipantsText(lang, count) {
  const text = liveParticipantsI18n[lang] ?? liveParticipantsI18n.vi;
  return text.onlineText(Math.max(0, Number(count) || 0));
}

function getOrCreateLiveParticipantId() {
  try {
    const existing = localStorage.getItem(LIVE_PARTICIPANT_KEY);
    if (existing && existing.trim()) {
      return existing;
    }

    const fallbackId = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const generated = globalThis.crypto?.randomUUID?.() || fallbackId;
    localStorage.setItem(LIVE_PARTICIPANT_KEY, generated);
    return generated;
  } catch {
    return `guest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

async function refreshLiveParticipants() {
  if (!liveParticipantsText) {
    return;
  }

  const participantId = getOrCreateLiveParticipantId();
  const lang = getLang();

  try {
    const response = await fetch('/api/public/live-participants/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participantId })
    });

    if (!response.ok) {
      throw new Error('Heartbeat failed');
    }

    const data = await response.json();
    const count = Number(data?.activeParticipants) || 0;
    liveParticipantsText.textContent = getLiveParticipantsText(lang, count);
  } catch {
    liveParticipantsText.textContent = getLiveParticipantsText(lang, 0);
  }
}

function initLiveParticipantsHeartbeat() {
  if (!liveParticipantsText) {
    return;
  }

  void refreshLiveParticipants();
  if (liveHeartbeatTimer) {
    clearInterval(liveHeartbeatTimer);
  }

  liveHeartbeatTimer = setInterval(() => {
    void refreshLiveParticipants();
  }, LIVE_HEARTBEAT_INTERVAL_MS);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      void refreshLiveParticipants();
    }
  });
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
      await loadMerchantAds();
      await renderFeaturedLocations(lang);
    });
  });
}

function initMerchantAdModal() {
  if (!merchantAdModal) {
    return;
  }

  const closeModal = () => {
    merchantAdModal.classList.add('hidden');
  };

  merchantAdModalCloseBtn?.addEventListener('click', closeModal);
  merchantAdModal.querySelector('[data-ad-modal-close]')?.addEventListener('click', closeModal);

  merchantAdModal.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.hasAttribute('data-ad-modal-close')) {
      closeModal();
    }
  });
}

function stopMerchantAdsAutoSlide() {
  if (merchantAdsAutoSlideTimer) {
    clearInterval(merchantAdsAutoSlideTimer);
    merchantAdsAutoSlideTimer = undefined;
  }
}

function updateMerchantAdsDots() {
  if (!merchantAdsDots) {
    return;
  }

  const dots = merchantAdsDots.querySelectorAll('[data-ad-dot-index]');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === merchantAdsCurrentIndex);
  });
}

function showMerchantAdSlide(index) {
  if (!merchantAdsGrid || merchantAdsData.length === 0) {
    return;
  }

  const safeIndex = ((index % merchantAdsData.length) + merchantAdsData.length) % merchantAdsData.length;
  merchantAdsCurrentIndex = safeIndex;
  merchantAdsGrid.style.transform = `translateX(-${safeIndex * 100}%)`;
  updateMerchantAdsDots();
}

function startMerchantAdsAutoSlide() {
  stopMerchantAdsAutoSlide();

  if (merchantAdsData.length <= 1) {
    return;
  }

  merchantAdsAutoSlideTimer = setInterval(() => {
    showMerchantAdSlide(merchantAdsCurrentIndex + 1);
  }, 5000);
}

function renderMerchantAdsDots() {
  if (!merchantAdsDots) {
    return;
  }

  if (merchantAdsData.length <= 1) {
    merchantAdsDots.innerHTML = '';
    return;
  }

  const lang = getLang();
  const dealText = getDealsText(lang);

  merchantAdsDots.innerHTML = merchantAdsData
    .map((_, index) => `<button type="button" class="merchant-ads-dot" data-ad-dot-index="${index}" aria-label="${escapeHtml(dealText.dotAria(index))}"></button>`)
    .join('');

  merchantAdsDots.querySelectorAll('[data-ad-dot-index]').forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = Number(dot.getAttribute('data-ad-dot-index'));
      if (Number.isNaN(index)) {
        return;
      }

      showMerchantAdSlide(index);
      startMerchantAdsAutoSlide();
    });
  });

  updateMerchantAdsDots();
}

function initMerchantAdsCarouselControls() {
  merchantAdsPrevBtn?.addEventListener('click', () => {
    showMerchantAdSlide(merchantAdsCurrentIndex - 1);
    startMerchantAdsAutoSlide();
  });

  merchantAdsNextBtn?.addEventListener('click', () => {
    showMerchantAdSlide(merchantAdsCurrentIndex + 1);
    startMerchantAdsAutoSlide();
  });

  merchantAdsGrid?.addEventListener('mouseenter', stopMerchantAdsAutoSlide);
  merchantAdsGrid?.addEventListener('mouseleave', startMerchantAdsAutoSlide);
}

function getMerchantAdImages(item) {
  const fromPayload = [
    item.imageUrl,
    item.thumbnailUrl,
    item.bannerUrl,
    item.coverImage,
    item.photoUrl
  ].filter((value) => typeof value === 'string' && value.trim().length > 0);

  const uniqueImages = [...new Set([...fromPayload, ...MERCHANT_AD_FALLBACK_IMAGES])];
  return uniqueImages.slice(0, 3);
}

function openMerchantAdModal(item) {
  if (!merchantAdModal) {
    return;
  }

  const lang = getLang();
  const locale = getDateLocale(lang);
  const dealText = getDealsText(lang);
  const locationId = item.locationId || '';
  const locationName = item.locationName || locationId || dealText.fallbackLocation;
  const title = item.title || dealText.fallbackTitle;
  const description = item.description || dealText.fallbackDescription;
  const campaignStart = item.campaignStartAt ? new Date(item.campaignStartAt).toLocaleString(locale) : dealText.now;
  const campaignEnd = item.campaignEndAt ? new Date(item.campaignEndAt).toLocaleString(locale) : dealText.unlimited;

  if (merchantAdModalTitle) {
    merchantAdModalTitle.textContent = title;
  }

  if (merchantAdModalMeta) {
    merchantAdModalMeta.textContent = `${item.requestType === 'promotion' ? dealText.requestPromotion : dealText.requestAdvertisement} | ${locationName}`;
  }

  if (merchantAdModalDesc) {
    merchantAdModalDesc.textContent = description;
  }

  if (merchantAdModalTime) {
    merchantAdModalTime.textContent = `${campaignStart} - ${campaignEnd}`;
  }

  if (merchantAdModalDetailLink) {
    merchantAdModalDetailLink.href = `/scan-narration.html?locationId=${encodeURIComponent(locationId)}&lang=${encodeURIComponent(lang)}`;
  }

  if (merchantAdModalMapLink) {
    merchantAdModalMapLink.href = `/ban-do.html?locationId=${encodeURIComponent(locationId)}&lang=${encodeURIComponent(lang)}`;
  }

  merchantAdModal.classList.remove('hidden');
}

async function loadMerchantAds() {
  if (!merchantAdsGrid) {
    return;
  }

  try {
    const lang = getLang();
    const locale = getDateLocale(lang);
    const dealText = getDealsText(lang);
    const selectedType = adsTypeFilter?.value || 'all';
    const selectedTime = adsTimeFilter?.value || 'all';
    const query = new URLSearchParams({
      take: '8',
      type: selectedType,
      time: selectedTime
    });
    const response = await fetch(`/api/public/merchant-ads?${query.toString()}`);
    if (!response.ok) {
      throw new Error(dealText.apiError);
    }

    const ads = await response.json();
    if (!Array.isArray(ads) || ads.length === 0) {
      merchantAdsData = [];
      merchantAdsGrid.style.transform = 'translateX(0)';
      merchantAdsGrid.innerHTML = `<article class="card merchant-ad-card merchant-ad-slide-item"><p>${escapeHtml(dealText.empty)}</p></article>`;
      if (merchantAdsDots) {
        merchantAdsDots.innerHTML = '';
      }
      stopMerchantAdsAutoSlide();
      return;
    }

    merchantAdsData = ads;
    merchantAdsCurrentIndex = 0;
    merchantAdsGrid.style.transform = 'translateX(0)';

    merchantAdsGrid.innerHTML = ads.map((item, index) => {
      const adImages = getMerchantAdImages(item);
      return `
      <article class="card merchant-ad-card merchant-ad-slide-item">
        <button type="button" class="merchant-ad-media" data-open-ad="${index}" aria-label="${escapeHtml(`${dealText.modalTitle} ${item.title || dealText.fallbackLocation}`)}">
          <img class="merchant-ad-slide merchant-ad-slide-a" src="${escapeHtml(adImages[0])}" alt="${escapeHtml(item.locationName || dealText.fallbackLocation)}">
          <img class="merchant-ad-slide merchant-ad-slide-b" src="${escapeHtml(adImages[1] || adImages[0])}" alt="${escapeHtml(item.locationName || dealText.fallbackLocation)}">
          <img class="merchant-ad-slide merchant-ad-slide-c" src="${escapeHtml(adImages[2] || adImages[0])}" alt="${escapeHtml(item.locationName || dealText.fallbackLocation)}">
          <span class="merchant-ad-media-cta">${escapeHtml(dealText.openCta)}</span>
        </button>
        <div class="card-head">
          <span class="tag">${escapeHtml(item.requestType === 'promotion' ? dealText.requestPromotion : dealText.requestAdvertisement)}</span>
          ${item.isPinnedTop ? `<span class="tag ad-top-tag">${escapeHtml(dealText.topTag)}</span>` : ''}
          <span class="tag" style="background:var(--bg); color:var(--text-secondary); border: 1px solid var(--border);">${escapeHtml(new Date(item.approvedAt).toLocaleDateString(locale))}</span>
        </div>
        <h3>${escapeHtml(item.title || dealText.fallbackTitle)}</h3>
        <p><strong>${escapeHtml(item.locationName || item.locationId || dealText.fallbackLocation)}</strong></p>
        <p>${escapeHtml(item.description || '')}</p>
        <p class="merchant-ad-time">${escapeHtml(item.campaignStartAt ? new Date(item.campaignStartAt).toLocaleString(locale) : dealText.now)} - ${escapeHtml(item.campaignEndAt ? new Date(item.campaignEndAt).toLocaleString(locale) : dealText.unlimited)}</p>
        <div class="merchant-ad-actions">
          <button type="button" class="button button-primary" data-open-ad="${index}">${escapeHtml(dealText.detailButton)}</button>
          <a class="button button-secondary" href="/ban-do.html?locationId=${encodeURIComponent(item.locationId || '')}&lang=${encodeURIComponent(lang)}">${escapeHtml(dealText.mapButton)}</a>
        </div>
      </article>
    `;
    }).join('');

    merchantAdsGrid.querySelectorAll('[data-open-ad]').forEach((element) => {
      element.addEventListener('click', () => {
        const adIndex = Number(element.getAttribute('data-open-ad'));
        if (Number.isNaN(adIndex) || !merchantAdsData[adIndex]) {
          return;
        }

        openMerchantAdModal(merchantAdsData[adIndex]);
      });
    });

    renderMerchantAdsDots();
    showMerchantAdSlide(0);
    startMerchantAdsAutoSlide();
  } catch (error) {
    const lang = getLang();
    const dealText = getDealsText(lang);
    merchantAdsData = [];
    merchantAdsGrid.style.transform = 'translateX(0)';
    merchantAdsGrid.innerHTML = `<article class="card merchant-ad-card merchant-ad-slide-item"><p>${escapeHtml(error?.message || dealText.apiError)}</p></article>`;
    if (merchantAdsDots) {
      merchantAdsDots.innerHTML = '';
    }
    stopMerchantAdsAutoSlide();
  }
}

(async function initHomePage() {
  const lang = getLang();
  applyI18n(lang);
  initLiveParticipantsHeartbeat();
  initLanguageModal();
  initAssistant();
  initMerchantAdModal();
  initMerchantAdsCarouselControls();

  adsFilterApplyBtn?.addEventListener('click', () => {
    void loadMerchantAds();
  });

  adsTypeFilter?.addEventListener('change', () => {
    void loadMerchantAds();
  });

  adsTimeFilter?.addEventListener('change', () => {
    void loadMerchantAds();
  });

  await loadMerchantAds();
  await renderFeaturedLocations(lang);
})();
