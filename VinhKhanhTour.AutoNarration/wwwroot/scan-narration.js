const locationNameEl = document.getElementById('qrLocationName');
const locationMetaEl = document.getElementById('qrLocationMeta');
const statusEl = document.getElementById('qrStatus');
const languageLabelEl = document.getElementById('qrLanguageLabel');
const languageSelectEl = document.getElementById('qrLanguageSelect');
const playButtonEl = document.getElementById('qrPlayBtn');
const backLinkEl = document.getElementById('qrBackLink');
const audioPlayerEl = document.getElementById('qrAudioPlayer');
const openAudioLinkEl = document.getElementById('qrOpenAudioLink');
const qrChipEl = document.getElementById('qrChip');

const PAGE_TEXT = {
  vi: {
    pageTitle: 'Nghe thuyết minh QR - Vĩnh Khánh',
    chip: 'QR Audio Guide',
    loadingLocation: 'Đang tải quán ăn...',
    loadingMeta: 'Vui lòng chờ tải dữ liệu.',
    statusReady: 'Sẵn sàng phát nội dung thuyết trình.',
    statusGenerating: 'Đang tạo nội dung thuyết minh...',
    statusLoaded: 'Sẵn sàng. Nhấn "Nghe thuyết minh" để phát audio.',
    statusPlaying: (name, lang) => `Đang phát: ${name} (${lang})`,
    statusUseBrowserSpeech: (lang) => `Cloud audio chưa sẵn sàng, đã chuyển sang giọng trình duyệt (${lang}).`,
    statusBrowserBlocked: 'Thiết bị chưa phát được giọng trình duyệt. Hãy tăng âm lượng media, tắt chế độ im lặng và bấm lại.',
    statusTapToPlayAudio: 'Audio đã sẵn sàng. Nhấn nút play trên trình phát để nghe.',
    statusNoLocationId: 'Mã QR không hợp lệ: thiếu locationId.',
    statusNotFound: 'Không thể tải dữ liệu từ mã QR.',
    locationUnknown: 'Không xác định quán ăn',
    locationMissing: 'Không tìm thấy quán ăn',
    locationCheckQr: 'Vui lòng kiểm tra lại mã QR.',
    noAddress: 'Chưa có địa chỉ',
    noHours: 'Chưa có giờ mở cửa',
    languageLabel: 'Ngôn ngữ:',
    play: '🔊 Nghe thuyết minh',
    playingBusy: 'Đang tạo audio...',
    back: 'Xem danh sách quán',
    openAudio: 'Mở file audio trực tiếp'
  },
  en: {
    pageTitle: 'QR Narration - Vinh Khanh',
    chip: 'QR Audio Guide',
    loadingLocation: 'Loading place...',
    loadingMeta: 'Please wait while loading.',
    statusReady: 'Ready to play narration.',
    statusGenerating: 'Generating narration...',
    statusLoaded: 'Ready. Tap "Listen" to play narration.',
    statusPlaying: (name, lang) => `Now playing: ${name} (${lang})`,
    statusUseBrowserSpeech: (lang) => `Cloud audio is unavailable, switched to browser speech (${lang}).`,
    statusBrowserBlocked: 'Browser speech is blocked on this device. Increase media volume, disable silent mode, then tap again.',
    statusTapToPlayAudio: 'Audio is ready. Tap play on the audio control.',
    statusNoLocationId: 'Invalid QR: missing locationId.',
    statusNotFound: 'Cannot load data from this QR.',
    locationUnknown: 'Unknown place',
    locationMissing: 'Place not found',
    locationCheckQr: 'Please check this QR code.',
    noAddress: 'Address unavailable',
    noHours: 'Opening hours unavailable',
    languageLabel: 'Language:',
    play: '🔊 Listen',
    playingBusy: 'Generating audio...',
    back: 'Back to places',
    openAudio: 'Open audio file'
  },
  fr: {
    pageTitle: 'Narration QR - Vinh Khanh',
    chip: 'Guide Audio QR',
    loadingLocation: 'Chargement du lieu...',
    loadingMeta: 'Veuillez patienter.',
    statusReady: 'Pret a lire la narration.',
    statusGenerating: 'Generation de la narration...',
    statusLoaded: 'Pret. Appuyez sur "Ecouter" pour lancer la narration.',
    statusPlaying: (name, lang) => `Lecture en cours : ${name} (${lang})`,
    statusUseBrowserSpeech: (lang) => `Audio cloud indisponible, bascule vers la voix navigateur (${lang}).`,
    statusBrowserBlocked: 'La voix navigateur est bloquee sur cet appareil. Augmentez le volume media, desactivez le mode silencieux, puis reessayez.',
    statusTapToPlayAudio: 'Audio pret. Appuyez sur lecture dans le lecteur.',
    statusNoLocationId: 'QR invalide : locationId manquant.',
    statusNotFound: 'Impossible de charger ce QR.',
    locationUnknown: 'Lieu inconnu',
    locationMissing: 'Lieu introuvable',
    locationCheckQr: 'Veuillez verifier ce QR.',
    noAddress: 'Adresse indisponible',
    noHours: 'Horaires indisponibles',
    languageLabel: 'Langue :',
    play: '🔊 Ecouter',
    playingBusy: 'Generation audio...',
    back: 'Voir les lieux',
    openAudio: 'Ouvrir le fichier audio'
  },
  ja: {
    pageTitle: 'QR音声ガイド - Vinh Khanh',
    chip: 'QR Audio Guide',
    loadingLocation: '店舗情報を読み込み中...',
    loadingMeta: 'しばらくお待ちください。',
    statusReady: '音声案内の再生準備ができました。',
    statusGenerating: '音声を生成中...',
    statusLoaded: '準備完了。「音声を聞く」を押してください。',
    statusPlaying: (name, lang) => `再生中: ${name} (${lang})`,
    statusUseBrowserSpeech: (lang) => `クラウド音声が使えないため、ブラウザ音声に切り替えました (${lang})。`,
    statusBrowserBlocked: 'この端末ではブラウザ音声を再生できません。メディア音量を上げ、消音モードをオフにして再試行してください。',
    statusTapToPlayAudio: '音声の準備ができました。プレーヤーの再生ボタンを押してください。',
    statusNoLocationId: '無効なQRです（locationIdなし）。',
    statusNotFound: 'このQRからデータを読み込めません。',
    locationUnknown: '店舗が不明です',
    locationMissing: '店舗が見つかりません',
    locationCheckQr: 'QRコードを確認してください。',
    noAddress: '住所未設定',
    noHours: '営業時間未設定',
    languageLabel: '言語:',
    play: '🔊 音声を聞く',
    playingBusy: '音声生成中...',
    back: '店舗一覧へ',
    openAudio: '音声ファイルを開く'
  },
  ko: {
    pageTitle: 'QR 음성 안내 - Vinh Khanh',
    chip: 'QR Audio Guide',
    loadingLocation: '매장 정보를 불러오는 중...',
    loadingMeta: '잠시만 기다려 주세요.',
    statusReady: '음성 안내를 재생할 준비가 되었습니다.',
    statusGenerating: '음성을 생성하는 중...',
    statusLoaded: '준비 완료. "음성 듣기"를 누르세요.',
    statusPlaying: (name, lang) => `재생 중: ${name} (${lang})`,
    statusUseBrowserSpeech: (lang) => `클라우드 오디오를 사용할 수 없어 브라우저 음성으로 전환했습니다 (${lang}).`,
    statusBrowserBlocked: '이 기기에서 브라우저 음성이 재생되지 않습니다. 미디어 볼륨을 올리고 무음 모드를 해제한 뒤 다시 시도해 주세요.',
    statusTapToPlayAudio: '오디오 준비 완료. 플레이어의 재생 버튼을 눌러 주세요.',
    statusNoLocationId: '잘못된 QR: locationId가 없습니다.',
    statusNotFound: '이 QR에서 데이터를 불러올 수 없습니다.',
    locationUnknown: '매장을 확인할 수 없습니다',
    locationMissing: '매장을 찾을 수 없습니다',
    locationCheckQr: 'QR 코드를 확인해 주세요.',
    noAddress: '주소 정보 없음',
    noHours: '영업시간 정보 없음',
    languageLabel: '언어:',
    play: '🔊 음성 듣기',
    playingBusy: '오디오 생성 중...',
    back: '매장 목록 보기',
    openAudio: '오디오 파일 열기'
  }
};

let activeLocation = null;
let pageLanguage = 'vi';
let cloudNarrationAvailable = false;

function t(key, ...args) {
  const dict = PAGE_TEXT[pageLanguage] || PAGE_TEXT.vi;
  const value = dict[key] ?? PAGE_TEXT.vi[key] ?? key;
  return typeof value === 'function' ? value(...args) : value;
}

function getSpeechLangTag(language) {
  const map = {
    vi: 'vi-VN',
    en: 'en-US',
    fr: 'fr-FR',
    ja: 'ja-JP',
    ko: 'ko-KR'
  };

  return map[language] || 'vi-VN';
}

function stopBrowserSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

async function ensureVoicesReady() {
  if (!('speechSynthesis' in window)) {
    return [];
  }

  const existing = window.speechSynthesis.getVoices() || [];
  if (existing.length > 0) {
    return existing;
  }

  return new Promise((resolve) => {
    const done = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', done);
      resolve(window.speechSynthesis.getVoices() || []);
    };

    window.speechSynthesis.addEventListener('voiceschanged', done, { once: true });
    setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', done);
      resolve(window.speechSynthesis.getVoices() || []);
    }, 1000);
  });
}

function pickVoice(voices, speechLangTag) {
  if (!Array.isArray(voices) || voices.length === 0) {
    return null;
  }

  const normalizedTag = String(speechLangTag || '').toLowerCase();
  const exact = voices.find((voice) => String(voice.lang || '').toLowerCase() === normalizedTag);
  if (exact) {
    return exact;
  }

  const base = normalizedTag.split('-')[0];
  if (!base) {
    return null;
  }

  return voices.find((voice) => {
    const voiceLang = String(voice.lang || '').toLowerCase();
    return voiceLang === base || voiceLang.startsWith(`${base}-`);
  }) || null;
}

function splitTextForCloudTts(text, maxLength = 180) {
  const normalized = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) {
    return [];
  }

  const chunks = [];
  let remaining = normalized;

  while (remaining.length > maxLength) {
    const candidate = remaining.slice(0, maxLength);
    const splitAt = Math.max(
      candidate.lastIndexOf('. '),
      candidate.lastIndexOf(', '),
      candidate.lastIndexOf('; '),
      candidate.lastIndexOf(' ')
    );
    const cut = splitAt > 40 ? splitAt + 1 : maxLength;
    chunks.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }

  if (remaining.length > 0) {
    chunks.push(remaining);
  }

  return chunks.filter(Boolean);
}

function buildGoogleTtsUrl(text, language) {
  const speechLangTag = getSpeechLangTag(language);
  const langCode = speechLangTag.split('-')[0] || 'vi';
  const url = new URL('/api/public/tts-proxy', window.location.origin);
  url.searchParams.set('lang', langCode);
  url.searchParams.set('text', text);
  return url.toString();
}

async function playGoogleTtsFallback(text, language) {
  if (!audioPlayerEl) {
    return { played: false, firstUrl: null };
  }

  const chunks = splitTextForCloudTts(text, 180);
  if (chunks.length === 0) {
    return { played: false, firstUrl: null };
  }

  const urls = chunks.map((chunk) => buildGoogleTtsUrl(chunk, language));
  let index = 0;
  audioPlayerEl.src = urls[index];
  audioPlayerEl.load();

  const playCurrent = async () => {
    try {
      await audioPlayerEl.play();
      return true;
    } catch {
      return false;
    }
  };

  const played = await playCurrent();
  if (!played) {
    return { played: false, firstUrl: urls[0] };
  }

  const onEnded = async () => {
    index += 1;
    if (index >= urls.length) {
      audioPlayerEl.removeEventListener('ended', onEnded);
      return;
    }

    audioPlayerEl.src = urls[index];
    audioPlayerEl.load();
    await playCurrent();
  };

  audioPlayerEl.addEventListener('ended', onEnded);
  return { played: true, firstUrl: urls[0] };
}

async function playBrowserSpeechFallback(text, language) {
  if (!('speechSynthesis' in window)) {
    return false;
  }

  const content = String(text || '').trim();
  if (!content) {
    return false;
  }

  const voices = await ensureVoicesReady();
  const speechLangTag = getSpeechLangTag(language);
  const voice = pickVoice(voices, speechLangTag);

  stopBrowserSpeech();
  const utterance = new SpeechSynthesisUtterance(content);
  utterance.lang = speechLangTag;
  if (voice) {
    utterance.voice = voice;
  }
  utterance.rate = 1;

  const result = await new Promise((resolve) => {
    let settled = false;
    utterance.onstart = () => {
      settled = true;
      resolve(true);
    };
    utterance.onerror = () => {
      resolve(false);
    };
    utterance.onend = () => {
      if (!settled) {
        resolve(true);
      }
    };

    window.speechSynthesis.speak(utterance);
    window.speechSynthesis.resume();
    setTimeout(() => {
      if (!settled && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) {
        settled = true;
        resolve(true);
      }
    }, 180);
    setTimeout(() => {
      if (!settled) {
        resolve(false);
      }
    }, 3000);
  });

  return result;
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function setStatus(message) {
  if (statusEl) {
    statusEl.textContent = message;
  }
}

function setBusy(isBusy) {
  if (!playButtonEl) {
    return;
  }

  if (isBusy) {
    playButtonEl.setAttribute('disabled', 'disabled');
    playButtonEl.textContent = t('playingBusy');
    return;
  }

  playButtonEl.removeAttribute('disabled');
  playButtonEl.textContent = t('play');
}

function buildFullNarrationText(location) {
  if (!location) {
    return '';
  }

  const safe = (value) => String(value || '').trim();
  const name = safe(location.name);
  const category = safe(location.category);
  const address = safe(location.address);
  const openingHours = safe(location.openingHours);
  const priceRange = safe(location.priceRange);
  const highlight = safe(location.highlight);
  const dishSamples = safe(location.dishSamples);
  const bestTime = safe(location.bestTime);
  const shortIntro = safe(location.shortIntro);
  const description = safe(location.descriptionVi);

  const parts = [
    name && category ? `${name} là quán thuộc nhóm ${category} trên phố ẩm thực Vĩnh Khánh.` : name,
    address ? `Địa chỉ: ${address}.` : '',
    openingHours ? `Giờ mở cửa: ${openingHours}.` : '',
    priceRange ? `Mức giá tham khảo: ${priceRange}.` : '',
    highlight ? `Điểm nổi bật: ${highlight}.` : '',
    dishSamples ? `Món nên thử: ${dishSamples}.` : '',
    bestTime ? `Thời điểm phù hợp để ghé quán: ${bestTime}.` : '',
    shortIntro ? `Tổng quan: ${shortIntro}.` : '',
    description
  ];

  return parts.filter(Boolean).join(' ');
}

function localizePage(language) {
  pageLanguage = normalizeLanguage(language);
  document.documentElement.lang = pageLanguage;
  document.title = t('pageTitle');

  if (qrChipEl) qrChipEl.textContent = t('chip');
  if (languageLabelEl) languageLabelEl.textContent = t('languageLabel');
  if (backLinkEl) backLinkEl.textContent = t('back');
  if (openAudioLinkEl) openAudioLinkEl.textContent = t('openAudio');

  setBusy(false);
}

function normalizeLanguage(input) {
  const supported = new Set(['vi', 'en', 'fr', 'ja', 'ko']);
  if (!input) {
    return 'vi';
  }

  const normalized = String(input).trim().toLowerCase();
  return supported.has(normalized) ? normalized : 'vi';
}

async function loadLocation(locationId) {
  const response = await fetch(`/api/public/locations/${encodeURIComponent(locationId)}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || 'Không tải được thông tin quán ăn từ mã QR.');
  }

  return result;
}

async function requestNarrationAudio(locationId, language, payment) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort('timeout'), 8000);

  let response;
  try {
    response = await fetch('/api/public/narrations/instant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locationId,
        targetLanguage: language,
        participantId: payment?.participantId,
        paymentToken: payment?.paymentToken
      }),
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeoutId);
  }

  const result = await response.json();
  if (!response.ok || !result?.audioUrl) {
    throw new Error(result?.detail || result?.message || 'Không tạo được audio thuyết minh.');
  }

  return result;
}

async function onPlayClick() {
  if (!activeLocation || !audioPlayerEl) {
    return;
  }

  try {
    setBusy(true);
    setStatus(t('statusGenerating'));

    const selectedLanguage = normalizeLanguage(languageSelectEl?.value);
    const fallbackText = buildFullNarrationText(activeLocation) || activeLocation.name;
    if (!window.narrationPayment?.payForNarration) {
      throw new Error('Thiếu mô-đun thanh toán thuyết minh.');
    }

    const payment = await window.narrationPayment.payForNarration({
      locationId: activeLocation.id,
      targetLanguage: selectedLanguage,
      locationName: activeLocation.name
    });

    if (!cloudNarrationAvailable) {
      const googlePlayback = await playGoogleTtsFallback(fallbackText, selectedLanguage);
      if (googlePlayback.played) {
        setStatus(t('statusUseBrowserSpeech', selectedLanguage));
        if (openAudioLinkEl) {
          openAudioLinkEl.setAttribute('href', googlePlayback.firstUrl || '#');
          openAudioLinkEl.classList.remove('hidden');
        }
        return;
      }

      const spokenNoCloud = await playBrowserSpeechFallback(fallbackText, selectedLanguage);
      if (spokenNoCloud) {
        setStatus(t('statusUseBrowserSpeech', selectedLanguage));
        if (openAudioLinkEl) {
          openAudioLinkEl.classList.add('hidden');
        }
        return;
      }

      setStatus(t('statusBrowserBlocked'));
      return;
    }

    const narration = await requestNarrationAudio(activeLocation.id, selectedLanguage, payment);

    if (String(narration.voiceName || '').toLowerCase() === 'demo-fallback-tone') {
      const cloudFallbackText = narration.translatedText || narration.sourceTextVi || fallbackText;
      const googlePlayback = await playGoogleTtsFallback(fallbackText, selectedLanguage);
      if (googlePlayback.played) {
        setStatus(t('statusUseBrowserSpeech', selectedLanguage));
        if (openAudioLinkEl) {
          openAudioLinkEl.setAttribute('href', googlePlayback.firstUrl || '#');
          openAudioLinkEl.classList.remove('hidden');
        }
        stopBrowserSpeech();
        return;
      }

      const spoken = await playBrowserSpeechFallback(
        cloudFallbackText,
        selectedLanguage
      );
      if (spoken) {
        setStatus(t('statusUseBrowserSpeech', selectedLanguage));
        if (openAudioLinkEl) {
          openAudioLinkEl.classList.add('hidden');
        }
        audioPlayerEl.removeAttribute('src');
        audioPlayerEl.load();
        return;
      } else {
        setStatus(t('statusBrowserBlocked'));
        return;
      }
    }

    stopBrowserSpeech();
    audioPlayerEl.src = narration.audioUrl;
    audioPlayerEl.load();

    try {
      await audioPlayerEl.play();
      setStatus(t('statusPlaying', activeLocation.name, selectedLanguage));
    } catch {
      setStatus(t('statusTapToPlayAudio'));
    }

    if (openAudioLinkEl) {
      openAudioLinkEl.setAttribute('href', narration.audioUrl);
      openAudioLinkEl.classList.remove('hidden');
    }
  } catch (error) {
    const message = String(error?.message || '');
    const paymentError = message.toLowerCase().includes('thanh toán')
      || message.toLowerCase().includes('payment')
      || message.toLowerCase().includes('hủy thanh toán');
    if (paymentError) {
      setStatus(message);
      return;
    }

    const selectedLanguage = normalizeLanguage(languageSelectEl?.value);
    const fallbackText = buildFullNarrationText(activeLocation) || activeLocation.name;
    const googlePlayback = await playGoogleTtsFallback(fallbackText, selectedLanguage);
    if (googlePlayback.played) {
      setStatus(t('statusUseBrowserSpeech', selectedLanguage));
      if (openAudioLinkEl) {
        openAudioLinkEl.setAttribute('href', googlePlayback.firstUrl || '#');
        openAudioLinkEl.classList.remove('hidden');
      }
    } else {
      const spoken = await playBrowserSpeechFallback(fallbackText, selectedLanguage);
      if (spoken) {
        setStatus(t('statusUseBrowserSpeech', selectedLanguage));
      } else {
        setStatus(error?.message || t('statusBrowserBlocked'));
      }
    }
  } finally {
    setBusy(false);
  }
}

async function loadCloudCapabilities() {
  try {
    const response = await fetch('/api/public/tts-capabilities');
    const result = await response.json();
    cloudNarrationAvailable = Boolean(result?.cloudNarrationAvailable);
  } catch {
    cloudNarrationAvailable = false;
  }
}

async function initQrNarrationPage() {
  const locationId = getQueryParam('locationId');
  const languageFromQuery = normalizeLanguage(getQueryParam('lang'));
  localizePage(languageFromQuery);
  if (locationNameEl) {
    locationNameEl.textContent = t('loadingLocation');
  }
  if (locationMetaEl) {
    locationMetaEl.textContent = t('loadingMeta');
  }
  setStatus(t('statusReady'));

  if (languageSelectEl) {
    languageSelectEl.value = languageFromQuery;
    languageSelectEl.addEventListener('change', () => {
      localizePage(languageSelectEl.value);
    });
  }

  if (!locationId) {
    setStatus(t('statusNoLocationId'));
    if (locationNameEl) {
      locationNameEl.textContent = t('locationUnknown');
    }
    if (playButtonEl) {
      playButtonEl.setAttribute('disabled', 'disabled');
    }
    return;
  }

  await loadCloudCapabilities();

  try {
    setStatus(t('loadingLocation'));
    activeLocation = await loadLocation(locationId);

    if (locationNameEl) {
      locationNameEl.textContent = activeLocation.name || t('locationUnknown');
    }
    if (locationMetaEl) {
      const address = activeLocation.address || t('noAddress');
      const openHours = activeLocation.openingHours || t('noHours');
      locationMetaEl.textContent = `${address} | ${openHours}`;
    }

    setStatus(t('statusLoaded'));
  } catch (error) {
    if (locationNameEl) {
      locationNameEl.textContent = t('locationMissing');
    }
    if (locationMetaEl) {
      locationMetaEl.textContent = t('locationCheckQr');
    }
    setStatus(error?.message || t('statusNotFound'));
    if (playButtonEl) {
      playButtonEl.setAttribute('disabled', 'disabled');
    }
  }

  playButtonEl?.addEventListener('click', onPlayClick);
}

void initQrNarrationPage();
