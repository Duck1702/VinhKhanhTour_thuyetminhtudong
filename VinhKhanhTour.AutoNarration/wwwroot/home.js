const homeLocationsGrid = document.getElementById('homeLocationsGrid');
const languageModal = document.getElementById('languageModal');

const SITE_LANGUAGE_KEY = 'siteLanguage';

const i18n = {
  vi: {
    modalTitle: 'Chọn ngôn ngữ trước khi bắt đầu',
    modalHint: 'Nội dung trang chủ và thao tác tạo thuyết minh sẽ theo ngôn ngữ bạn chọn.',
    heroTitle: 'Hệ Thống Phố Ẩm Thực Vĩnh Khánh',
    heroSubtitle: 'Trải nghiệm du lịch ẩm thực hoàn toàn mới với thuyết minh tự động, gợi ý lộ trình AI và kết nối GPS thông minh — Khám phá điểm đến nhộn nhịp nhất về đêm.',
    heroPrimary: 'Tạo thuyết minh Audio',
    heroSecondary: 'Xem món nổi bật',
    featuredTitle: 'Món/quán nổi bật để tạo thuyết minh nhanh',
    featuredButton: 'Tạo thuyết minh',
    featuredHint: 'Nhấn để mở trang Audio TTS cho quán này'
  },
  en: {
    modalTitle: 'Choose your language before starting',
    modalHint: 'Homepage content and narration flow will follow your selected language.',
    heroTitle: 'Vinh Khanh Night Culinary System',
    heroSubtitle: 'Discover night food tours with instant narration, AI route suggestions, and smart GPS guidance.',
    heroPrimary: 'Create Audio Narration',
    heroSecondary: 'Explore Featured Foods',
    featuredTitle: 'Featured places for instant narration',
    featuredButton: 'Narrate this place',
    featuredHint: 'Open Audio TTS with this location pre-selected'
  },
  fr: {
    modalTitle: 'Choisissez votre langue avant de commencer',
    modalHint: 'Le contenu d accueil et la narration suivront la langue choisie.',
    heroTitle: 'Systeme Culinaire Nocturne Vinh Khanh',
    heroSubtitle: 'Explorez la rue gourmande de nuit avec narration automatique, itineraire IA et guidage GPS.',
    heroPrimary: 'Creer une narration audio',
    heroSecondary: 'Voir les plats populaires',
    featuredTitle: 'Lieux recommandes pour narration rapide',
    featuredButton: 'Narrer ce lieu',
    featuredHint: 'Ouvrir Audio TTS avec ce lieu'
  },
  ja: {
    modalTitle: '開始前に言語を選択してください',
    modalHint: 'ホームの内容と音声ガイド作成は選択した言語で表示されます。',
    heroTitle: 'ビンカイン夜のグルメ体験システム',
    heroSubtitle: '自動ナレーション、AIルート提案、GPS連携で夜の食体験を案内します。',
    heroPrimary: '音声ナレーションを作成',
    heroSecondary: '人気スポットを見る',
    featuredTitle: 'すぐにナレーションできる注目スポット',
    featuredButton: 'この場所をナレーション',
    featuredHint: 'この場所を選択した状態でAudio TTSを開く'
  },
  ko: {
    modalTitle: '시작 전에 언어를 선택하세요',
    modalHint: '홈페이지 내용과 내레이션 생성 흐름이 선택 언어에 맞게 표시됩니다.',
    heroTitle: '빈칸 야간 미식 투어 시스템',
    heroSubtitle: '자동 내레이션, AI 경로 추천, GPS 연동으로 밤거리 미식 여행을 안내합니다.',
    heroPrimary: '오디오 내레이션 만들기',
    heroSecondary: '추천 맛집 보기',
    featuredTitle: '빠른 내레이션 추천 맛집',
    featuredButton: '이 장소 내레이션',
    featuredHint: '이 장소를 선택한 상태로 Audio TTS 열기'
  }
};

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
      throw new Error('Khong tai duoc danh sach dia diem.');
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
        <a class="button button-primary" href="/audio-tts.html?locationId=${encodeURIComponent(location.id)}&lang=${encodeURIComponent(lang)}">${escapeHtml(t.featuredButton)}</a>
      </article>
    `).join('');
  } catch (error) {
    homeLocationsGrid.innerHTML = `<article class="card card-skeleton">${escapeHtml(error.message)}</article>`;
  }
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

(async function initHomePage() {
  const lang = getLang();
  applyI18n(lang);
  initLanguageModal();
  await renderFeaturedLocations(lang);
})();
