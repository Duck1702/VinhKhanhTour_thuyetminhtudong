const paymentTitle = document.getElementById('paymentTitle');
const locationName = document.getElementById('locationName');
const locationInfo = document.getElementById('locationInfo');
const priceLabel = document.getElementById('priceLabel');
const priceDisplay = document.getElementById('priceDisplay');
const priceNote = document.getElementById('priceNote');
const paymentLanguageSelect = document.getElementById('paymentLanguageSelect');
const paymentLanguageLabel = document.getElementById('paymentLanguageLabel');
const paymentContent = document.getElementById('paymentContent');
const paymentLoading = document.getElementById('paymentLoading');
const paymentError = document.getElementById('paymentError');
const paymentConfirmBtn = document.getElementById('paymentConfirmBtn');
const paymentCancelBtn = document.getElementById('paymentCancelBtn');

const i18n = {
  vi: {
    title: 'Thanh toán',
    languageLabel: 'Ngôn ngữ thuyết minh:',
    priceLabel: 'Giá:',
    confirmBtn: '💳 Xác nhận thanh toán',
    cancelBtn: 'Quay lại danh sách',
    loadingText: 'Đang xử lý thanh toán...',
    errorLoadingLocation: 'Không thể tải thông tin quán ăn.',
    errorLoadingPrice: 'Không thể tải giá tiền.',
    errorProcessingPayment: 'Lỗi xử lý thanh toán:',
    pricePerListen: 'Giá một lần nghe thuyết minh',
    processingPayment: 'Đang xử lý thanh toán...'
  },
  en: {
    title: 'Payment',
    languageLabel: 'Narration language:',
    priceLabel: 'Price:',
    confirmBtn: '💳 Confirm payment',
    cancelBtn: 'Back to list',
    loadingText: 'Processing payment...',
    errorLoadingLocation: 'Could not load restaurant info.',
    errorLoadingPrice: 'Could not load price.',
    errorProcessingPayment: 'Payment error:',
    pricePerListen: 'Price per narration listen',
    processingPayment: 'Processing payment...'
  },
  fr: {
    title: 'Paiement',
    languageLabel: 'Langue de la narration:',
    priceLabel: 'Prix:',
    confirmBtn: '💳 Confirmer le paiement',
    cancelBtn: 'Retour à la liste',
    loadingText: 'Traitement du paiement...',
    errorLoadingLocation: 'Impossible de charger les informations du restaurant.',
    errorLoadingPrice: 'Impossible de charger le prix.',
    errorProcessingPayment: 'Erreur de paiement:',
    pricePerListen: 'Prix par narration',
    processingPayment: 'Traitement du paiement...'
  },
  ja: {
    title: 'お支払い',
    languageLabel: 'ナレーション言語:',
    priceLabel: '価格:',
    confirmBtn: '💳 支払いを確認',
    cancelBtn: 'リストに戻る',
    loadingText: 'お支払いを処理中...',
    errorLoadingLocation: 'レストラン情報を読み込めませんでした。',
    errorLoadingPrice: '価格を読み込めませんでした。',
    errorProcessingPayment: '支払いエラー:',
    pricePerListen: 'ナレーション1回の価格',
    processingPayment: 'お支払いを処理中...'
  },
  ko: {
    title: '결제',
    languageLabel: '음성 설명 언어:',
    priceLabel: '가격:',
    confirmBtn: '💳 결제 확인',
    cancelBtn: '목록으로 돌아가기',
    loadingText: '결제를 처리 중...',
    errorLoadingLocation: '식당 정보를 로드할 수 없습니다.',
    errorLoadingPrice: '가격을 로드할 수 없습니다.',
    errorProcessingPayment: '결제 오류:',
    pricePerListen: '음성 설명 1회당 가격',
    processingPayment: '결제를 처리 중...'
  }
};

let currentLocation = null;
let participantId = null;

function getPreferredLanguage() {
  const supported = new Set(['vi', 'en', 'fr', 'ja', 'ko']);
  
  const fromQuery = new URLSearchParams(window.location.search).get('lang');
  if (fromQuery && supported.has(fromQuery)) {
    return fromQuery;
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

function updateUILanguage() {
  const lang = getPreferredLanguage();
  paymentTitle.textContent = pageText('title');
  paymentLanguageLabel.textContent = pageText('languageLabel');
  priceLabel.textContent = pageText('priceLabel');
  paymentConfirmBtn.textContent = pageText('confirmBtn');
  paymentCancelBtn.textContent = pageText('cancelBtn');
  
  // Update price note
  if (currentLocation) {
    updatePriceDisplay();
  }
}

function ensureParticipantId() {
  const key = 'vktour.participantId';
  let id = localStorage.getItem(key);
  if (!id) {
    id = 'participant-' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem(key, id);
  }
  return id;
}

async function loadLocationData() {
  const params = new URLSearchParams(window.location.search);
  const locationId = params.get('locationId');

  if (!locationId) {
    showError('Thiếu locationId');
    return;
  }

  try {
    const resp = await fetch(`/api/public/locations/${encodeURIComponent(locationId)}`);
    if (!resp.ok) {
      throw new Error(pageText('errorLoadingLocation'));
    }
    currentLocation = await resp.json();
    renderLocationPreview();
  } catch (error) {
    showError(error.message);
  }
}

function renderLocationPreview() {
  if (!currentLocation) return;

  locationName.textContent = currentLocation.name || 'Quán ăn';
  locationInfo.textContent = currentLocation.address || '';
  updatePriceDisplay();
}

async function updatePriceDisplay() {
  if (!currentLocation) return;

  const selectedLang = paymentLanguageSelect.value;
  
  try {
    const resp = await fetch(`/api/public/narrations/pricing?lang=${encodeURIComponent(selectedLang)}`);
    if (!resp.ok) {
      throw new Error(pageText('errorLoadingPrice'));
    }
    const quote = await resp.json();
    
    priceDisplay.textContent = `${quote.currencySymbol}${quote.amount.toFixed(2)} (${quote.amountVnd.toFixed(0)} VND)`;
    priceNote.textContent = pageText('pricePerListen');
  } catch (error) {
    showError(error.message);
  }
}

function showError(message) {
  paymentError.textContent = message;
  paymentError.classList.remove('hidden');
}

function hideError() {
  paymentError.classList.add('hidden');
}

function showLoading() {
  paymentContent.classList.add('hidden');
  paymentLoading.classList.remove('hidden');
}

function hideLoading() {
  paymentContent.classList.remove('hidden');
  paymentLoading.classList.add('hidden');
}

async function processPayment() {
  if (!currentLocation) {
    showError('Chưa tải thông tin quán ăn');
    return;
  }

  hideError();
  showLoading();

  try {
    participantId = ensureParticipantId();
    const selectedLang = paymentLanguageSelect.value;

    const paymentReq = {
      participantId,
      locationId: currentLocation.id,
      targetLanguage: selectedLang
    };

    const resp = await fetch('/api/public/narrations/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentReq)
    });

    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.message || pageText('errorProcessingPayment'));
    }

    const ticket = await resp.json();
    
    // Redirect to location detail page with payment token
    const detailUrl = `/location-detail.html?locationId=${encodeURIComponent(currentLocation.id)}&lang=${encodeURIComponent(selectedLang)}&paymentToken=${encodeURIComponent(ticket.paymentToken)}`;
    window.location.href = detailUrl;
  } catch (error) {
    hideLoading();
    showError(`${pageText('errorProcessingPayment')} ${error.message}`);
  }
}

function init() {
  updateUILanguage();
  loadLocationData();

  paymentLanguageSelect.addEventListener('change', () => {
    updateUILanguage();
  });

  paymentConfirmBtn.addEventListener('click', processPayment);

  paymentCancelBtn.addEventListener('click', () => {
    const lang = getPreferredLanguage();
    window.location.href = `/mon-ngon.html?lang=${lang}`;
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
