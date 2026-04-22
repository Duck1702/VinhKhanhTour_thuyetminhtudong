// Browser TTS fallback
let browserVoices = [];

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
      if (done) return;
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
  if (!browserVoices.length) return null;

  const normalizedLangTag = String(langTag || '').replaceAll('_', '-').toLowerCase();

  const exact = browserVoices.find((voice) => String(voice.lang || '').replaceAll('_', '-').toLowerCase() === normalizedLangTag);
  if (exact) return exact;

  const base = normalizedLangTag.split('-')[0].toLowerCase();
  const byBase = browserVoices.find((voice) => {
    const voiceLang = String(voice.lang || '').replaceAll('_', '-').toLowerCase();
    return voiceLang === base || voiceLang.startsWith(`${base}-`);
  });
  if (byBase) return byBase;

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
    if (byNameHint) return byNameHint;
  }

  return null;
}

function getSpeechLangTag(lang) {
  const langTags = {
    vi: 'vi-VN',
    en: 'en-US',
    fr: 'fr-FR',
    ja: 'ja-JP',
    ko: 'ko-KR'
  };
  return langTags[lang] || 'en-US';
}

async function speakWithBrowserTts(location, selectedLang) {
  if (!('speechSynthesis' in window)) {
    throw new Error('Browser không hỗ trợ Web Speech API');
  }

  await ensureVoicesReady();
  refreshBrowserVoices();

  const narrationText = [location.name, location.shortIntro, location.highlight, location.descriptionVi]
    .filter(Boolean)
    .join('. ');

  const utterance = new SpeechSynthesisUtterance(narrationText);
  const speechLangTag = getSpeechLangTag(selectedLang);
  utterance.lang = speechLangTag;
  const selectedVoice = pickBestVoice(speechLangTag, selectedLang);
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }
  utterance.rate = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);

  return true;
}


const detailLoading = document.getElementById('detailLoading');
const detailError = document.getElementById('detailError');
const detailLocationName = document.getElementById('detailLocationName');
const detailLocationCategory = document.getElementById('detailLocationCategory');
const detailImageContainer = document.getElementById('detailImageContainer');
const detailAddress = document.getElementById('detailAddress');
const detailHours = document.getElementById('detailHours');
const detailPhone = document.getElementById('detailPhone');
const detailPrice = document.getElementById('detailPrice');
const detailBestTime = document.getElementById('detailBestTime');
const detailHighlight = document.getElementById('detailHighlight');
const detailShortIntro = document.getElementById('detailShortIntro');
const detailDescription = document.getElementById('detailDescription');
const detailDishes = document.getElementById('detailDishes');
const detailPlayBtn = document.getElementById('detailPlayBtn');
const detailStopBtn = document.getElementById('detailStopBtn');
const detailBackBtn = document.getElementById('detailBackBtn');
const detailAudioPlayer = document.getElementById('detailAudioPlayer');

const SITE_LANGUAGE_KEY = 'SITE_LANGUAGE_KEY';

const i18n = {
  vi: {
    loading: 'Đang tải chi tiết quán...',
    errorLoadingLocation: 'Không thể tải thông tin quán ăn.',
    errorMissingParams: 'Thiếu thông tin cần thiết.',
    languageLabel: 'Chọn ngôn ngữ:',
    playBtn: '🔊 Nghe thuyết minh',
    backBtn: '← Quay lại danh sách',
    basicInfo: 'Thông tin cơ bản',
    highlightSection: 'Điểm nhấn và mô tả',
    narrationSection: 'Nghe thuyết minh',
    address: '📍 Địa chỉ:',
    hours: '🕐 Giờ mở cửa:',
    phone: '📞 Số điện thoại:',
    price: '💰 Giá tham khảo:',
    bestTime: '⭐ Thời gian tốt nhất:',
    generating: 'Đang tạo thuyết minh...',
    errorGenerating: 'Lỗi tạo thuyết minh:'
  },
  en: {
    loading: 'Loading restaurant details...',
    errorLoadingLocation: 'Could not load restaurant info.',
    errorMissingParams: 'Missing required information.',
    languageLabel: 'Choose language:',
    playBtn: '🔊 Listen to narration',
    backBtn: '← Back to list',
    basicInfo: 'Basic Information',
    highlightSection: 'Highlights & Description',
    narrationSection: 'Listen to Narration',
    address: '📍 Address:',
    hours: '🕐 Opening hours:',
    phone: '📞 Phone:',
    price: '💰 Price range:',
    bestTime: '⭐ Best time:',
    generating: 'Generating narration...',
    errorGenerating: 'Error generating narration:'
  },
  fr: {
    loading: 'Chargement des détails du restaurant...',
    errorLoadingLocation: 'Impossible de charger les informations du restaurant.',
    errorMissingParams: 'Informations requises manquantes.',
    languageLabel: 'Choisir la langue:',
    playBtn: '🔊 Écouter la narration',
    backBtn: '← Retour à la liste',
    basicInfo: 'Informations de base',
    highlightSection: 'Points forts et description',
    narrationSection: 'Écouter la narration',
    address: '📍 Adresse:',
    hours: '🕐 Horaires:',
    phone: '📞 Téléphone:',
    price: '💰 Gamme de prix:',
    bestTime: '⭐ Meilleur moment:',
    generating: 'Génération de la narration...',
    errorGenerating: 'Erreur de génération:'
  },
  ja: {
    loading: 'レストラン詳細を読み込み中...',
    errorLoadingLocation: 'レストラン情報を読み込めませんでした。',
    errorMissingParams: '必要な情報が不足しています。',
    languageLabel: '言語を選択:',
    playBtn: '🔊 ナレーションを聴く',
    backBtn: '← リストに戻る',
    basicInfo: '基本情報',
    highlightSection: 'ハイライト & 説明',
    narrationSection: 'ナレーションを聴く',
    address: '📍 住所:',
    hours: '🕐 営業時間:',
    phone: '📞 電話番号:',
    price: '💰 価格帯:',
    bestTime: '⭐ 最適時:',
    generating: 'ナレーションを生成中...',
    errorGenerating: 'ナレーション生成エラー:'
  },
  ko: {
    loading: '식당 상세정보를 로드 중...',
    errorLoadingLocation: '식당 정보를 로드할 수 없습니다.',
    errorMissingParams: '필수 정보가 누락되었습니다.',
    languageLabel: '언어 선택:',
    playBtn: '🔊 음성 설명 듣기',
    backBtn: '← 목록으로 돌아가기',
    basicInfo: '기본 정보',
    highlightSection: '하이라이트 및 설명',
    narrationSection: '음성 설명 듣기',
    address: '📍 주소:',
    hours: '🕐 영업 시간:',
    phone: '📞 전화:',
    price: '💰 가격대:',
    bestTime: '⭐ 최적 시간:',
    generating: '음성 설명을 생성 중...',
    errorGenerating: '음성 설명 생성 오류:'
  }
};

let currentLocation = null;
let currentPaymentToken = null;
let participantId = null;
const locationImages = {
  'oc-oanh': '/assets/vinh-khanh-street.jpg',
  'oc-vu': '/assets/vinh-khanh-street.jpg',
  'thao-oc': '/assets/vinh-khanh-street.jpg',
  'oc-sau-no': '/assets/vinh-khanh-banner.jpg',
  'be-oc': '/assets/vinh-khanh-banner.jpg'
};

function getPreferredLanguage() {
  // Use global i18n if available (which checks URL params first)
  if (window.siteI18n?.getSiteLanguage) {
    return window.siteI18n.getSiteLanguage();
  }
  
  // Fallback to URL params
  const supported = new Set(['vi', 'en', 'fr', 'ja', 'ko']);
  
  const fromQuery = new URLSearchParams(window.location.search).get('lang');
  if (fromQuery && supported.has(fromQuery)) {
    return fromQuery;
  }

  const fromStorage = localStorage.getItem(SITE_LANGUAGE_KEY);
  if (fromStorage && supported.has(fromStorage)) {
    return fromStorage;
  }

  const fromNav = document.getElementById('site-language-select')?.value;
  if (fromNav && supported.has(fromNav)) {
    return fromNav;
  }

  return 'vi';
}

function pageText(key) {
  const lang = getPreferredLanguage();
  return i18n[lang]?.[key] ?? i18n.en[key] ?? key;
}

function updateAllUIText() {
  const lang = getPreferredLanguage();
  
  // Update buttons
  detailPlayBtn.textContent = pageText('playBtn');
  detailBackBtn.textContent = pageText('backBtn');
  
  // Update all section headings
  const h2s = document.querySelectorAll('.location-detail-section h2');
  if (h2s[0]) h2s[0].textContent = pageText('basicInfo');
  if (h2s[1]) h2s[1].textContent = pageText('highlightSection');
  if (h2s[2]) h2s[2].textContent = pageText('narrationSection');
}

function updateUILanguage() {
  updateAllUIText();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getCardImage(locationId) {
  return locationImages[locationId] ?? '/assets/map.svg';
}

function showError(message) {
  detailError.textContent = message;
  detailError.classList.remove('hidden');
}

function hideError() {
  detailError.classList.add('hidden');
}

function showLoading(text = null) {
  detailContent.classList.add('hidden');
  detailLoading.classList.remove('hidden');
  if (text) {
    detailLoading.querySelector('p').textContent = text;
  }
}

function hideLoading() {
  detailContent.classList.remove('hidden');
  detailLoading.classList.add('hidden');
}

function renderLocationDetail() {
  if (!currentLocation) return;

  detailLocationName.textContent = escapeHtml(currentLocation.name);
  detailLocationCategory.textContent = escapeHtml(currentLocation.category);
  
  const imgUrl = getCardImage(currentLocation.id);
  detailImageContainer.innerHTML = `<img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(currentLocation.name)}" class="location-detail-image" />`;

  detailAddress.textContent = escapeHtml(currentLocation.address || 'N/A');
  detailHours.textContent = escapeHtml(currentLocation.openingHours || 'N/A');
  detailPhone.textContent = escapeHtml(currentLocation.contactPhone || 'N/A');
  detailPrice.textContent = escapeHtml(currentLocation.priceRange || 'N/A');
  detailBestTime.textContent = escapeHtml(currentLocation.bestTime || 'N/A');
  
  detailHighlight.textContent = escapeHtml(currentLocation.highlight || '');
  detailShortIntro.textContent = escapeHtml(currentLocation.shortIntro || '');
  detailDescription.textContent = escapeHtml(currentLocation.descriptionVi || '');
  detailDishes.textContent = escapeHtml(currentLocation.dishSamples || '');
}

async function loadLocationData() {
  const params = new URLSearchParams(window.location.search);
  const locationId = params.get('locationId');
  const paymentToken = params.get('paymentToken');

  if (!locationId) {
    showError(pageText('errorMissingParams'));
    return;
  }

  // Payment token may come from URL or cached session
  if (paymentToken) {
    currentPaymentToken = paymentToken;
    // Cache payment token for this location in session storage
    sessionStorage.setItem(`paymentToken_${locationId}`, paymentToken);
  } else {
    // Try to get cached payment token for this location
    currentPaymentToken = sessionStorage.getItem(`paymentToken_${locationId}`);
  }

  participantId = localStorage.getItem('vktour.participantId') || 'participant-unknown';

  showLoading(pageText('loading'));

  try {
    const resp = await fetch(`/api/public/locations/${encodeURIComponent(locationId)}`);
    if (!resp.ok) {
      throw new Error(pageText('errorLoadingLocation'));
    }
    currentLocation = await resp.json();
    hideLoading();
    renderLocationDetail();
    updateUILanguage();
  } catch (error) {
    hideLoading();
    showError(error.message);
  }
}

async function playNarration() {
  if (!currentLocation || !currentPaymentToken) {
    showError('Thông tin không đủ để phát thuyết minh');
    return;
  }

  const selectedLang = getPreferredLanguage();
  const previousText = detailPlayBtn.textContent;
  
  detailPlayBtn.disabled = true;
  detailPlayBtn.textContent = pageText('generating');

  try {
    // Try to get audio from server first
    const req = {
      locationId: currentLocation.id,
      targetLanguage: selectedLang,
      participantId,
      paymentToken: currentPaymentToken
    };

    console.log('Requesting narration:', req);

    const resp = await fetch('/api/public/narrations/instant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });

    if (!resp.ok) {
      const err = await resp.json();
      console.error('Server error:', err);
      throw new Error(err.message || pageText('errorGenerating'));
    }

    const narration = await resp.json();
    console.log('Received narration:', narration);
    
    // Check if server returned a demo beep (fallback tone) - if so, use browser TTS instead
    if (String(narration.voiceName || '').toLowerCase() === 'demo-fallback-tone') {
      console.warn('Server returned fallback beep, using browser TTS instead');
      throw new Error('server-using-fallback');
    }

    // Server returned proper audio - try to play it
    if (narration.audioUrl) {
      detailAudioPlayer.src = narration.audioUrl;
      detailPlayBtn.style.display = 'none';
      detailStopBtn.style.display = 'inline-block';
      
      detailAudioPlayer.play().catch(e => {
        console.warn('Auto-play failed:', e);
        // If autoplay fails, show message but keep player visible
        showError('Nhấn play để phát audio');
      });
      hideError();
      return;
    }

    // No audio URL returned - use browser TTS
    throw new Error('no-audio-url');
  } catch (error) {
    console.log('Server approach failed, falling back to browser TTS:', error.message);
    
    // Fallback to browser TTS
    try {
      detailPlayBtn.textContent = 'Đang phát bằng giọng nói trình duyệt...';
      await speakWithBrowserTts(currentLocation, selectedLang);
      detailPlayBtn.style.display = 'none';
      detailStopBtn.style.display = 'inline-block';
      detailAudioPlayer.removeAttribute('src');
      hideError();
    } catch (browserError) {
      console.error('Browser TTS also failed:', browserError);
      showError(`Không thể phát thuyết minh: ${browserError.message}`);
    }
  } finally {
    detailPlayBtn.disabled = false;
    detailPlayBtn.textContent = previousText;
  }
}

function stopNarration() {
  // Stop audio playback
  detailAudioPlayer.pause();
  detailAudioPlayer.currentTime = 0;
  
  // Stop browser speech synthesis
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  
  // Show play button, hide stop button
  detailPlayBtn.style.display = 'inline-block';
  detailStopBtn.style.display = 'none';
}

function goBackToList() {
  const lang = getPreferredLanguage();
  window.location.href = `/mon-ngon.html?lang=${lang}`;
}

function init() {
  loadLocationData();

  // Listen for language changes from nav bar - either custom event or select change
  const langSelect = document.getElementById('site-language-select');
  if (langSelect) {
    langSelect.addEventListener('change', () => {
      // Update UI text when language changes
      updateAllUIText();
    });
  }
  
  // Also listen for custom event from nav.js
  window.addEventListener('siteLanguageChanged', (e) => {
    updateAllUIText();
  });

  detailPlayBtn.addEventListener('click', playNarration);
  detailStopBtn.addEventListener('click', stopNarration);
  
  // Handle audio end event
  detailAudioPlayer.addEventListener('ended', () => {
    detailPlayBtn.style.display = 'inline-block';
    detailStopBtn.style.display = 'none';
  });
  
  if (detailBackBtn && detailBackBtn.tagName === 'A') {
    // If it's a link, that's fine
  } else if (detailBackBtn) {
    detailBackBtn.addEventListener('click', goBackToList);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
