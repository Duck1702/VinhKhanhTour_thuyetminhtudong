const foodGroupsHost = document.getElementById('foodGroups');
const foodSearchInput = document.getElementById('foodSearchInput');
let allLocations = [];
let rawLocations = [];
let quickPlayerHost;
let browserVoices = [];
let qrModalHost;
const QR_BASE_URL_STORAGE_KEY = 'qrPublicBaseUrl';

const pageMessages = {
  vi: {
    group_oc: 'Nhóm món Ốc',
    group_ca: 'Nhóm món Cá',
    group_bo: 'Nhóm món Bò',
    group_lau_nuong: 'Nhóm Lẩu & Nướng',
    group_hai_san_khac: 'Nhóm Hải sản khác',
    group_khac: 'Nhóm món khác',
    group_section_number: 'Nhóm món ăn',
    card_address: 'Địa chỉ',
    card_hours: 'Giờ mở cửa',
    card_phone: 'SĐT',
    card_price: 'Giá tham khảo',
    card_highlight: 'Điểm nhấn',
    btn_payment: '💳 Thanh toán để xem chi tiết & nghe thuyết minh',
    btn_close: 'Đóng',
    btn_open_link: 'Mở link',
    qr_title: 'QR nghe thuyết minh',
    qr_hint: 'Quét mã QR để mở trang nghe thuyết minh quán này.',
    qr_direct_link: 'Link trực tiếp',
    qr_base_url_label: 'Domain cho điện thoại',
    qr_base_url_hint: 'Nếu chạy localhost, hãy nhập IP LAN của máy tính. Ví dụ: http://192.168.1.10:5292',
    qr_localhost_warning: 'Bạn đang dùng localhost. Điện thoại không truy cập được localhost của máy tính. Hãy nhập IP LAN ở ô bên dưới.',
    quick_title: 'Thuyết minh',
    quick_hint_browser_tts: 'Đang đọc bằng giọng trình duyệt theo ngôn ngữ đã chọn.',
    quick_link_demo: 'Không dùng file audio cloud (demo miễn phí)',
    quick_no_cloud: 'Không có file audio cloud',
    unsupported_tts: 'Thiết bị không hỗ trợ đọc bằng trình duyệt.',
    unsupported_lang_voice: 'Thiết bị chưa có giọng đọc cho ngôn ngữ đã chọn. Vui lòng cài voice hệ thống tương ứng.',
    loading_data: 'Đang tải dữ liệu...',
    loading_places_failed: 'Không tải được dữ liệu món ăn.',
    no_data: 'Chưa có dữ liệu món ăn.',
    na: 'Không có',
    state_generating: 'Đang tạo...'
  },
  en: {
    group_oc: 'Snail Group',
    group_ca: 'Fish Group',
    group_bo: 'Beef Group',
    group_lau_nuong: 'Hotpot & Grill Group',
    group_hai_san_khac: 'Other Seafood Group',
    group_khac: 'Other Dishes',
    group_section_number: 'Food Group',
    card_address: 'Address',
    card_hours: 'Opening hours',
    card_phone: 'Phone',
    card_price: 'Price range',
    card_highlight: 'Highlights',
    btn_payment: '💳 Pay to view details & listen',
    btn_close: 'Close',
    btn_open_link: 'Open link',
    qr_title: 'Narration QR',
    qr_hint: 'Scan this QR code to open narration for this place.',
    qr_direct_link: 'Direct link',
    qr_base_url_label: 'Phone-accessible domain',
    qr_base_url_hint: 'If running on localhost, enter your computer LAN IP, e.g. http://192.168.1.10:5292',
    qr_localhost_warning: 'You are using localhost. Phones cannot access your PC localhost. Enter your LAN IP below.',
    quick_title: 'Narration',
    quick_hint_browser_tts: 'Reading with browser voice in the selected language.',
    quick_link_demo: 'No cloud audio file (free demo mode)',
    quick_no_cloud: 'No cloud audio file',
    unsupported_tts: 'This device does not support browser speech.',
    unsupported_lang_voice: 'No browser voice is installed for the selected language. Please install a matching system voice.',
    loading_data: 'Loading data...',
    loading_places_failed: 'Could not load food data.',
    no_data: 'No food data available.',
    na: 'N/A',
    state_generating: 'Generating...'
  },
  fr: {
    group_oc: 'Groupe Escargots',
    group_ca: 'Groupe Poisson',
    group_bo: 'Groupe Boeuf',
    group_lau_nuong: 'Groupe Fondue & Grillades',
    group_hai_san_khac: 'Autres Fruits de mer',
    group_khac: 'Autres plats',
    group_section_number: 'Groupe culinaire',
    card_address: 'Adresse',
    card_hours: 'Horaires',
    card_phone: 'Telephone',
    card_price: 'Gamme de prix',
    card_highlight: 'Points forts',
    btn_payment: '💳 Payer pour voir les details & ecouter',
    btn_close: 'Fermer',
    btn_open_link: 'Ouvrir le lien',
    qr_title: 'QR narration',
    qr_hint: 'Scannez ce QR pour ouvrir la narration de ce lieu.',
    qr_direct_link: 'Lien direct',
    qr_base_url_label: 'Domaine mobile',
    qr_base_url_hint: 'Si localhost est utilise, entrez l IP LAN du PC, ex: http://192.168.1.10:5292',
    qr_localhost_warning: 'Vous utilisez localhost. Le telephone ne peut pas y acceder. Entrez l IP LAN ci-dessous.',
    quick_title: 'Narration',
    quick_hint_browser_tts: 'Lecture vocale du navigateur selon la langue choisie.',
    quick_link_demo: 'Pas de fichier audio cloud (mode demo gratuit)',
    quick_no_cloud: 'Pas de fichier audio cloud',
    unsupported_tts: 'Cet appareil ne prend pas en charge la lecture vocale du navigateur.',
    unsupported_lang_voice: 'Aucune voix navigateur pour la langue choisie. Veuillez installer une voix systeme correspondante.',
    loading_data: 'Chargement des donnees...',
    loading_places_failed: 'Impossible de charger les donnees des plats.',
    no_data: 'Aucune donnee culinaire disponible.',
    na: 'N/A',
    state_generating: 'Generation...'
  },
  ja: {
    group_oc: '貝料理グループ',
    group_ca: '魚料理グループ',
    group_bo: '牛肉グループ',
    group_lau_nuong: '鍋・焼きグループ',
    group_hai_san_khac: 'その他の海鮮',
    group_khac: 'その他の料理',
    group_section_number: '料理グループ',
    card_address: '住所',
    card_hours: '営業時間',
    card_phone: '電話番号',
    card_price: '価格帯',
    card_highlight: 'おすすめ',
    btn_payment: '💳 支払って詳細と解説を見る',
    btn_close: '閉じる',
    btn_open_link: 'リンクを開く',
    qr_title: '音声QR',
    qr_hint: 'QRをスキャンしてこの店舗の音声案内ページを開きます。',
    qr_direct_link: '直接リンク',
    qr_base_url_label: 'スマホ用ドメイン',
    qr_base_url_hint: 'localhost の場合はPCのLAN IPを入力: 例 http://192.168.1.10:5292',
    qr_localhost_warning: 'localhost 使用中。スマホからアクセス不可です。下にLAN IPを入力してください。',
    quick_title: 'ナレーション',
    quick_hint_browser_tts: '選択した言語でブラウザ音声を再生しています。',
    quick_link_demo: 'クラウド音声ファイルなし（無料デモ）',
    quick_no_cloud: 'クラウド音声ファイルなし',
    unsupported_tts: 'この端末はブラウザ音声に対応していません。',
    unsupported_lang_voice: '選択した言語のブラウザ音声が見つかりません。対応するシステム音声をインストールしてください。',
    loading_data: 'データを読み込み中...',
    loading_places_failed: 'グルメデータを読み込めませんでした。',
    no_data: 'グルメデータがありません。',
    na: 'なし',
    state_generating: '生成中...'
  },
  ko: {
    group_oc: '달팽이 그룹',
    group_ca: '생선 그룹',
    group_bo: '소고기 그룹',
    group_lau_nuong: '전골·구이 그룹',
    group_hai_san_khac: '기타 해산물',
    group_khac: '기타 메뉴',
    group_section_number: '음식 그룹',
    card_address: '주소',
    card_hours: '영업 시간',
    card_phone: '전화번호',
    card_price: '가격대',
    card_highlight: '포인트',
    btn_payment: '💳 결제 후 상세 및 설명 보기',
    btn_close: '닫기',
    btn_open_link: '링크 열기',
    qr_title: '음성 QR',
    qr_hint: 'QR 코드를 스캔해 이 매장의 음성 안내를 엽니다.',
    qr_direct_link: '직접 링크',
    qr_base_url_label: '휴대폰 접속 도메인',
    qr_base_url_hint: 'localhost 사용 시 PC의 LAN IP를 입력하세요. 예: http://192.168.1.10:5292',
    qr_localhost_warning: 'localhost 사용 중입니다. 휴대폰에서 접속할 수 없습니다. 아래 LAN IP를 입력하세요.',
    quick_title: '내레이션',
    quick_hint_browser_tts: '선택한 언어로 브라우저 음성을 재생 중입니다.',
    quick_link_demo: '클라우드 오디오 없음 (무료 데모)',
    quick_no_cloud: '클라우드 오디오 없음',
    unsupported_tts: '이 기기는 브라우저 음성 재생을 지원하지 않습니다.',
    unsupported_lang_voice: '선택한 언어의 브라우저 음성이 없습니다. 해당 시스템 음성을 설치해 주세요.',
    loading_data: '데이터를 불러오는 중...',
    loading_places_failed: '맛집 데이터를 불러오지 못했습니다.',
    no_data: '맛집 데이터가 없습니다.',
    na: '없음',
    state_generating: '생성 중...'
  }
};

const categoryLabelByLang = {
  vi: {
    'snails & seafood': 'Ốc & hải sản',
    'seafood / snails': 'Ốc & hải sản',
    'hotpot & grill': 'Lẩu & nướng',
    'specialties & single dishes': 'Món đặc trưng',
    'seafood / beer bites': 'Hải sản & món nhắm',
    'beef / hot dishes': 'Bò & món nóng',
    'hotpot / grill': 'Lẩu & nướng'
  },
  en: {
    'snails & seafood': 'Snails & Seafood',
    'seafood / snails': 'Seafood / Snails',
    'hotpot & grill': 'Hotpot & Grill',
    'specialties & single dishes': 'Specialties & Single Dishes',
    'seafood / beer bites': 'Seafood / Beer Bites',
    'beef / hot dishes': 'Beef / Hot Dishes',
    'hotpot / grill': 'Hotpot / Grill'
  },
  fr: {
    'snails & seafood': 'Escargots & fruits de mer',
    'seafood / snails': 'Fruits de mer / escargots',
    'hotpot & grill': 'Fondue & grillades',
    'specialties & single dishes': 'Specialites & plats individuels',
    'seafood / beer bites': 'Fruits de mer / tapas',
    'beef / hot dishes': 'Boeuf / plats chauds',
    'hotpot / grill': 'Fondue / grillades'
  },
  ja: {
    'snails & seafood': '貝料理・海鮮',
    'seafood / snails': '海鮮・貝料理',
    'hotpot & grill': '鍋・焼き物',
    'specialties & single dishes': '名物・一品料理',
    'seafood / beer bites': '海鮮・おつまみ',
    'beef / hot dishes': '牛肉・温かい料理',
    'hotpot / grill': '鍋・焼き物'
  },
  ko: {
    'snails & seafood': '달팽이·해산물',
    'seafood / snails': '해산물·달팽이요리',
    'hotpot & grill': '전골·구이',
    'specialties & single dishes': '대표·단품 요리',
    'seafood / beer bites': '해산물·안주',
    'beef / hot dishes': '소고기·따뜻한 요리',
    'hotpot / grill': '전골·구이'
  }
};

function pageText(key) {
  const lang = getPreferredLanguage();
  return pageMessages[lang]?.[key]
    ?? pageMessages.en[key]
    ?? pageMessages.vi[key]
    ?? key;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function groupKeyFromCategory(category) {
  const normalized = normalizeText(category);
  if (normalized.includes('oc') || normalized.includes('snail')) {
    return 'oc';
  }

  if (normalized.includes('ca ') || normalized.includes('fish')) {
    return 'ca';
  }

  if (normalized.includes('bo') || normalized.includes('beef')) {
    return 'bo';
  }

  if (normalized.includes('lau') || normalized.includes('nuong') || normalized.includes('hotpot') || normalized.includes('grill')) {
    return 'lau-nuong';
  }

  if (normalized.includes('hai san') || normalized.includes('seafood')) {
    return 'hai-san-khac';
  }

  return 'khac';
}

function groupLabel(groupKey) {
  const labels = {
    oc: pageText('group_oc'),
    ca: pageText('group_ca'),
    bo: pageText('group_bo'),
    'lau-nuong': pageText('group_lau_nuong'),
    'hai-san-khac': pageText('group_hai_san_khac'),
    khac: pageText('group_khac')
  };

  return labels[groupKey] ?? labels.khac;
}

function groupIcon(groupKey) {
  const icons = {
    oc: '🐚',
    ca: '🐟',
    bo: '🥩',
    'lau-nuong': '🔥',
    'hai-san-khac': '🦐',
    khac: '🍴'
  };

  return icons[groupKey] ?? icons.khac;
}

function getCardImage(location) {
  // Support both location object and locationId string
  if (typeof location === 'object' && location && location.imageUrl) {
    return location.imageUrl;
  }
  
  const locationId = typeof location === 'string' ? location : (location?.id || '');
  const images = {
    'oc-oanh': '/assets/vinh-khanh-street.jpg',
    'oc-vu': '/assets/vinh-khanh-street.jpg',
    'thao-oc': '/assets/vinh-khanh-street.jpg',
    'oc-sau-no': '/assets/vinh-khanh-banner.jpg',
    'be-oc': '/assets/vinh-khanh-banner.jpg'
  };

  return images[locationId] ?? '/assets/map.svg';
}

function getPreferredLanguage() {
  const supported = new Set(['vi', 'en', 'fr', 'ja', 'ko']);

  const fromNavSelect = document.getElementById('site-language-select')?.value;
  if (fromNavSelect && supported.has(fromNavSelect)) {
    return fromNavSelect;
  }

  const fromI18n = window.siteI18n?.getSiteLanguage?.();
  if (fromI18n && supported.has(fromI18n)) {
    return fromI18n;
  }

  const fromQuery = new URLSearchParams(window.location.search).get('lang');
  if (fromQuery && supported.has(fromQuery)) {
    return fromQuery;
  }

  return 'vi';
}

function getSpeechLangTag(selectedLang) {
  const selected = selectedLang || getPreferredLanguage();
  const map = {
    vi: 'vi-VN',
    en: 'en-US',
    fr: 'fr-FR',
    ja: 'ja-JP',
    ko: 'ko-KR'
  };

  return map[selected] || 'vi-VN';
}

function refreshBrowserVoices() {
  browserVoices = window.speechSynthesis?.getVoices?.() || [];
}

async function ensureVoicesReady(timeoutMs = 450) {
  refreshBrowserVoices();
  if (browserVoices.length > 0 || !window.speechSynthesis?.addEventListener) {
    return;
  }

  await new Promise((resolve) => {
    let done = false;

    const finish = () => {
      if (done) {
        return;
      }

      done = true;
      window.speechSynthesis?.removeEventListener?.('voiceschanged', onVoicesChanged);
      refreshBrowserVoices();
      resolve();
    };

    const onVoicesChanged = () => {
      finish();
    };

    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
    window.setTimeout(finish, timeoutMs);
    window.speechSynthesis.getVoices();
  });
}

function pickBestVoice(langTag, selectedLang) {
  if (!browserVoices.length) {
    return null;
  }

  const normalizedLangTag = String(langTag || '').replaceAll('_', '-').toLowerCase();

  const exact = browserVoices.find((voice) => String(voice.lang || '').replaceAll('_', '-').toLowerCase() === normalizedLangTag);
  if (exact) {
    return exact;
  }

  const base = normalizedLangTag.split('-')[0].toLowerCase();
  const byBase = browserVoices.find((voice) => {
    const voiceLang = String(voice.lang || '').replaceAll('_', '-').toLowerCase();
    return voiceLang === base || voiceLang.startsWith(`${base}-`);
  });
  if (byBase) {
    return byBase;
  }

  const voiceNameHints = {
    vi: ['vietnam', 'viet', 'tieng viet', 'vi-vn'],
    en: ['english', 'en-us', 'en-gb'],
    fr: ['french', 'fr-fr'],
    ja: ['japanese', 'ja-jp'],
    ko: ['korean', 'ko-kr']
  };

  const hints = voiceNameHints[selectedLang] || [];
  if (hints.length > 0) {
    const byNameHint = browserVoices.find((voice) => {
      const name = String(voice.name || '').toLowerCase();
      return hints.some((hint) => name.includes(hint));
    });

    if (byNameHint) {
      return byNameHint;
    }
  }

  return null;
}

function renderCategoryLabel(category) {
  const normalized = normalizeText(category);
  const lang = getPreferredLanguage();
  const localized = categoryLabelByLang[lang]?.[normalized]
    ?? categoryLabelByLang.en[normalized]
    ?? category;

  return localized;
}

function ensureQuickPlayer() {
  if (quickPlayerHost) {
    return quickPlayerHost;
  }

  const host = document.createElement('div');
  host.className = 'quick-player hidden';
  host.innerHTML = `
    <div class="quick-player-head">
      <strong id="quickPlayerTitle">${escapeHtml(pageText('quick_title'))}</strong>
      <button type="button" id="quickPlayerClose" class="button button-secondary">${escapeHtml(pageText('btn_close'))}</button>
    </div>
    <p id="quickPlayerHint" style="margin:0 0 .45rem; font-size:.85rem; color:#e5edf8;"></p>
    <audio id="quickPlayerAudio" controls></audio>
    <a id="quickPlayerLink" class="button button-secondary" href="#" target="_blank" rel="noreferrer" style="margin-top:.5rem; font-size:.82rem;">${escapeHtml(pageText('quick_no_cloud'))}</a>
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

function ensureQrModal() {
  if (qrModalHost) {
    return qrModalHost;
  }

  const host = document.createElement('div');
  host.className = 'qr-modal hidden';
  host.innerHTML = `
    <div class="qr-modal-backdrop" data-qr-close="true"></div>
    <div class="qr-modal-card" role="dialog" aria-modal="true" aria-label="QR narration dialog">
      <div class="qr-modal-head">
        <strong id="qrModalTitle">${escapeHtml(pageText('qr_title'))}</strong>
        <button type="button" class="button button-secondary" data-qr-close="true">${escapeHtml(pageText('btn_close'))}</button>
      </div>
      <p id="qrModalHint" class="qr-modal-hint">${escapeHtml(pageText('qr_hint'))}</p>
      <div class="qr-image-wrap">
        <img id="qrModalImage" alt="QR narration" loading="lazy" />
      </div>
      <p id="qrModalWarning" class="qr-modal-warning hidden"></p>
      <div class="qr-base-url-wrap">
        <label for="qrBaseUrlInput">${escapeHtml(pageText('qr_base_url_label'))}</label>
        <input id="qrBaseUrlInput" type="text" placeholder="http://192.168.1.10:5292" />
        <small>${escapeHtml(pageText('qr_base_url_hint'))}</small>
      </div>
      <div class="qr-link-wrap">
        <span>${escapeHtml(pageText('qr_direct_link'))}:</span>
        <a id="qrModalDirectLink" href="#" target="_blank" rel="noreferrer">${escapeHtml(pageText('btn_open_link'))}</a>
      </div>
    </div>
  `;

  host.addEventListener('click', (event) => {
    if (event.target.closest('[data-qr-close="true"]')) {
      host.classList.add('hidden');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      host.classList.add('hidden');
    }
  });

  document.body.appendChild(host);
  qrModalHost = host;
  return host;
}

function buildQrNarrationUrl(locationId) {
  const savedBaseUrl = localStorage.getItem(QR_BASE_URL_STORAGE_KEY);
  const baseUrl = savedBaseUrl && String(savedBaseUrl).trim()
    ? String(savedBaseUrl).trim()
    : window.location.origin;

  const url = new URL('/scan-narration.html', baseUrl);
  url.searchParams.set('locationId', locationId);
  url.searchParams.set('lang', getPreferredLanguage());
  url.searchParams.set('v', '20260412-8');
  return url.toString();
}

function openQrModalForLocation(location) {
  const host = ensureQrModal();
  const title = host.querySelector('#qrModalTitle');
  const hint = host.querySelector('#qrModalHint');
  const image = host.querySelector('#qrModalImage');
  const link = host.querySelector('#qrModalDirectLink');
  const warning = host.querySelector('#qrModalWarning');
  const baseUrlInput = host.querySelector('#qrBaseUrlInput');

  if (baseUrlInput && !baseUrlInput.dataset.bound) {
    baseUrlInput.value = localStorage.getItem(QR_BASE_URL_STORAGE_KEY) || '';
    baseUrlInput.addEventListener('change', () => {
      const value = String(baseUrlInput.value || '').trim();
      if (!value) {
        localStorage.removeItem(QR_BASE_URL_STORAGE_KEY);
      } else {
        localStorage.setItem(QR_BASE_URL_STORAGE_KEY, value);
      }
      openQrModalForLocation(location);
    });
    baseUrlInput.dataset.bound = 'true';
  }

  const shareUrl = buildQrNarrationUrl(location.id);
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(shareUrl)}`;
  const customBaseUrl = localStorage.getItem(QR_BASE_URL_STORAGE_KEY) || '';
  const isLocalOnly = !customBaseUrl && ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);

  if (title) {
    title.textContent = `${pageText('qr_title')}: ${location.name}`;
  }
  if (hint) {
    hint.textContent = pageText('qr_hint');
  }
  if (warning) {
    warning.textContent = pageText('qr_localhost_warning');
    warning.classList.toggle('hidden', !isLocalOnly);
  }
  if (image) {
    image.setAttribute('src', qrImageUrl);
    image.setAttribute('alt', `QR ${location.name}`);
  }
  if (link) {
    link.setAttribute('href', shareUrl);
    link.textContent = pageText('btn_open_link');
  }

  host.classList.remove('hidden');
}

function stopNarrationPlayback() {
  const host = ensureQuickPlayer();
  const audio = host.querySelector('#quickPlayerAudio');
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  host.classList.add('hidden');
}

function buildNarrationText(location) {
  const lang = getPreferredLanguage();
  const phrases = {
    vi: {
      address: 'Địa chỉ',
      hours: 'Giờ mở cửa',
      phone: 'Số điện thoại liên hệ',
      price: 'Mức giá tham khảo',
      intro: 'Giới thiệu',
      highlight: 'Món nổi bật',
      desc: 'Mô tả'
    },
    en: {
      address: 'Address',
      hours: 'Opening hours',
      phone: 'Contact phone',
      price: 'Price range',
      intro: 'Introduction',
      highlight: 'Signature dishes',
      desc: 'Description'
    },
    fr: {
      address: 'Adresse',
      hours: 'Horaires',
      phone: 'Telephone',
      price: 'Gamme de prix',
      intro: 'Introduction',
      highlight: 'Plats phares',
      desc: 'Description'
    },
    ja: {
      address: '住所',
      hours: '営業時間',
      phone: '連絡先',
      price: '価格帯',
      intro: '紹介',
      highlight: 'おすすめ料理',
      desc: '説明'
    },
    ko: {
      address: '주소',
      hours: '영업 시간',
      phone: '연락처',
      price: '가격대',
      intro: '소개',
      highlight: '대표 메뉴',
      desc: '설명'
    }
  };

  const p = phrases[lang] || phrases.vi;
  const naValue = pageText('na');
  return [
    `${location.name}.`,
    `${p.address}: ${location.address}.`,
    `${p.hours}: ${location.openingHours}.`,
    `${p.phone}: ${location.contactPhone || naValue}.`,
    `${p.price}: ${location.priceRange || naValue}.`,
    `${p.intro}: ${location.shortIntro}.`,
    `${p.highlight}: ${location.highlight}.`,
    `${p.desc}: ${location.descriptionVi}.`
  ].join(' ');
}

async function speakWithBrowserTts(location, overrideText, selectedLang) {
  if (!('speechSynthesis' in window)) {
    alert(pageText('unsupported_tts'));
    return { spoken: false, voiceName: null, speechLangTag: null };
  }

  await ensureVoicesReady();
  refreshBrowserVoices();

  const text = (overrideText && String(overrideText).trim())
    ? String(overrideText).trim()
    : [location.name, location.shortIntro, location.highlight, location.descriptionVi]
      .filter(Boolean)
      .join('. ');

  const utterance = new SpeechSynthesisUtterance(text);
  const speechLangTag = getSpeechLangTag(selectedLang);
  utterance.lang = speechLangTag;
  const selectedVoice = pickBestVoice(speechLangTag, selectedLang);
  // If no exact match is found, keep lang tag and let the browser choose the closest available voice.
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }
  utterance.rate = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);

  return {
    spoken: true,
    voiceName: selectedVoice?.name || 'browser-default',
    speechLangTag
  };
}

async function playNarrationInstant(location) {
  const selectedLang = getPreferredLanguage();
  let narrationLocation = location;

  if (!window.narrationPayment?.payForNarration) {
    throw new Error('Thiếu mô-đun thanh toán thuyết minh.');
  }

  const payment = await window.narrationPayment.payForNarration({
    locationId: location.id,
    targetLanguage: selectedLang,
    locationName: location.name
  });

  // Hard lock: when Vietnamese is selected, always narrate from raw Vietnamese source data.
  if (selectedLang === 'vi') {
    const raw = (Array.isArray(rawLocations) ? rawLocations : []).find((item) => item.id === location.id);
    if (raw) {
      narrationLocation = raw;
    }
  }

  const host = ensureQuickPlayer();
  const title = host.querySelector('#quickPlayerTitle');
  const hint = host.querySelector('#quickPlayerHint');
  const link = host.querySelector('#quickPlayerLink');
  const audio = host.querySelector('#quickPlayerAudio');

  if (!audio) {
    return;
  }

  if (title) {
    title.textContent = `${narrationLocation.name} (${selectedLang})`;
  }

  host.classList.remove('hidden');
  stopNarrationPlayback();
  host.classList.remove('hidden');

  if (selectedLang === 'vi') {
    try {
      const response = await fetch('/api/public/narrations/instant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationId: narrationLocation.id,
          targetLanguage: 'vi',
          participantId: payment.participantId,
          paymentToken: payment.paymentToken
        })
      });

      const result = await response.json();
      if (!response.ok || !result?.audioUrl) {
        throw new Error(result?.detail || result?.message || pageText('narration_failed'));
      }

      // Backend may return a demo beep when cloud TTS keys are not configured.
      if (String(result.voiceName || '').toLowerCase() === 'demo-fallback-tone') {
        throw new Error('server-demo-beep');
      }

      audio.src = result.audioUrl;
      audio.load();
      try {
        await audio.play();
      } catch {
        // Browser autoplay policy may block playback until user interacts again.
      }

      if (hint) {
        hint.textContent = `Đang phát audio tiếng Việt từ server (${result.voiceName || 'server-voice'}).`;
      }
      if (link) {
        link.setAttribute('href', result.audioUrl);
        link.textContent = pageText('audio_open_file');
      }

      return;
    } catch {
      // If server TTS is unavailable, fall back to browser TTS below.
    }
  }

  const narrationText = buildNarrationText(narrationLocation);
  const speakResult = await speakWithBrowserTts(narrationLocation, narrationText, selectedLang);
  if (!speakResult?.spoken) {
    return;
  }

  audio.removeAttribute('src');
  audio.load();

  if (hint) {
    const voiceLabel = speakResult.voiceName || pageText('na');
    hint.textContent = `${pageText('quick_hint_browser_tts')} (${speakResult.speechLangTag}, ${voiceLabel})`;
  }
  if (link) {
    link.setAttribute('href', '#');
    link.textContent = pageText('quick_link_demo');
  }
}

function localizeLocationsByCurrentLanguage(locations) {
  console.log('localizeLocationsByCurrentLanguage input:', locations);
  const lang = getPreferredLanguage();
  console.log('Current language:', lang);
  const result = (Array.isArray(locations) ? locations : []).map((item) => {
    const localized = window.localizeLocationData ? window.localizeLocationData(item, lang) : item;
    console.log('Localized item:', item.id, localized);
    return localized;
  });
  console.log('localizeLocationsByCurrentLanguage output count:', result.length);
  return result;
}

function getNarrationLocationById(locationId) {
  const raw = (Array.isArray(rawLocations) ? rawLocations : []).find((item) => item.id === locationId);
  if (!raw) {
    return allLocations.find((item) => item.id === locationId) || null;
  }

  const lang = getPreferredLanguage();
  if (!window.localizeLocationData) {
    return raw;
  }

  return window.localizeLocationData(raw, lang);
}

function renderFoodGroups(locations) {
  if (!foodGroupsHost) {
    console.error('foodGroupsHost not found');
    return;
  }

  console.log('Rendering with locations count:', locations?.length);
  
  if (!locations || locations.length === 0) {
    foodGroupsHost.innerHTML = `<article class="card">${escapeHtml(pageText('no_data'))}</article>`;
    return;
  }

  const rawCategoryById = new Map(
    (Array.isArray(rawLocations) ? rawLocations : []).map((item) => [item.id, item.category])
  );

  const groups = new Map();
  locations.forEach((location) => {
    const stableCategory = rawCategoryById.get(location.id) || location.category;
    const key = groupKeyFromCategory(stableCategory);
    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push(location);
  });

  const groupOrder = ['oc', 'ca', 'hai-san-khac', 'bo', 'lau-nuong', 'khac'];
  const html = groupOrder
    .filter((groupKey) => (groups.get(groupKey) ?? []).length > 0)
    .map((groupKey) => {
      const items = groups.get(groupKey) ?? [];
      const cards = items
        .map((location) => `
          <article class="card food-card">
            <img class="card-visual" src="${getCardImage(location)}" alt="${escapeHtml(location.name)}" />
            <div class="card-head">
              <span class="tag">${escapeHtml(renderCategoryLabel(location.category))}</span>
              <span class="tag" style="background:var(--bg); color:var(--text-secondary); border: 1px solid var(--border);">${escapeHtml(location.bestTime)}</span>
            </div>
            <h3>${escapeHtml(location.name)}</h3>
            <p>${escapeHtml(location.shortIntro)}</p>
            <p>${escapeHtml(location.descriptionVi)}</p>
            <div class="food-card-actions">
              <button type="button" class="button button-primary" data-payment-id="${escapeHtml(location.id)}">${escapeHtml(pageText('btn_payment'))}</button>
            </div>
          </article>
        `)
        .join('');

      return `
        <section class="food-group" id="food-group-${groupKey}">
          <div class="section-header" style="margin-bottom: 1.1rem;">
            <div class="icon">${groupIcon(groupKey)}</div>
            <div>
              <div class="section-num">${escapeHtml(pageText('group_section_number'))}</div>
              <h2>${escapeHtml(groupLabel(groupKey))}</h2>
            </div>
          </div>
          <div class="card-grid food-group-list">${cards}</div>
        </section>
      `;
    })
    .join('');

  foodGroupsHost.innerHTML = html || `<article class="card">${escapeHtml(pageText('no_data'))}</article>`;
}

function applySearchFilter() {
  const query = normalizeText(foodSearchInput?.value || '');
  if (!query) {
    return allLocations;
  }

  return allLocations.filter((location) => {
    const searchBlob = normalizeText([
      location.name,
      location.category,
      location.shortIntro,
      location.descriptionVi,
      location.highlight,
      location.address,
      location.contactPhone,
      location.priceRange,
      location.bestTime
    ].join(' '));

    return searchBlob.includes(query);
  });
}

async function initFoodPage() {
  if (!foodGroupsHost) {
    return;
  }

  try {
    const searchLabel = document.querySelector('label[for="foodSearchInput"]');
    if (searchLabel) {
      const labelMap = {
        vi: 'Tìm món hoặc quán',
        en: 'Search dishes or places',
        fr: 'Rechercher un plat ou un lieu',
        ja: '料理や店舗を検索',
        ko: '메뉴 또는 매장 검색'
      };
      const lang = getPreferredLanguage();
      searchLabel.textContent = labelMap[lang] || labelMap.en;
    }

    if (foodSearchInput) {
      const placeholderMap = {
        vi: 'Nhập từ khóa: ốc, cá, lẩu, bò, địa chỉ...',
        en: 'Enter keywords: snails, fish, hotpot, beef, address...',
        fr: 'Saisir des mots-cles : escargot, poisson, fondue, boeuf, adresse...',
        ja: 'キーワード入力: 貝、魚、鍋、牛肉、住所...',
        ko: '키워드 입력: 달팽이, 생선, 전골, 소고기, 주소...'
      };
      const lang = getPreferredLanguage();
      foodSearchInput.setAttribute('placeholder', placeholderMap[lang] || placeholderMap.en);
    }

    foodGroupsHost.innerHTML = `<article class="card card-skeleton">${escapeHtml(pageText('loading_data'))}</article>`;

    refreshBrowserVoices();
    if (window.speechSynthesis?.addEventListener) {
      window.speechSynthesis.addEventListener('voiceschanged', refreshBrowserVoices);
    }

    const response = await fetch('/api/public/locations');
    if (!response.ok) {
      throw new Error(pageText('loading_places_failed'));
    }

    const data = await response.json();
    console.log('API response:', data);
    rawLocations = Array.isArray(data) ? data : (data.value ?? []);
    console.log('rawLocations:', rawLocations);
    allLocations = localizeLocationsByCurrentLanguage(rawLocations);
    console.log('allLocations:', allLocations);

    renderFoodGroups(applySearchFilter());

    if (foodSearchInput) {
      foodSearchInput.addEventListener('input', () => {
        renderFoodGroups(applySearchFilter());
      });
    }

    foodGroupsHost.addEventListener('click', (event) => {
      const paymentButton = event.target.closest('[data-payment-id]');
      if (paymentButton) {
        const locationId = paymentButton.getAttribute('data-payment-id');
        const currentLang = getPreferredLanguage();
        window.location.href = `/payment.html?locationId=${encodeURIComponent(locationId)}&lang=${encodeURIComponent(currentLang)}`;
      }
    });
  } catch (error) {
    console.error('Error initializing food page:', error);
    foodGroupsHost.innerHTML = `<article class="card card-skeleton">❌ Lỗi: ${escapeHtml(String(error.message || error))}</article>`;
  }
}

void initFoodPage();
