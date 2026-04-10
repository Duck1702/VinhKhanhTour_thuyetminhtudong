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

const ROUTING_I18N = {
  vi: {
    fallbackRequestLabel: 'du-phong',
    fallbackNarrationReady: (count) => `Đã sẵn sàng thuyết minh cho ${count} điểm dừng.`,
    fallbackQuickTitle: 'Lộ trình nhanh gọn',
    fallbackQuickSummary: 'Đi nhanh, chọn các điểm nổi bật nhất.',
    fallbackQuickStrategy: 'Ưu tiên tiết kiệm thời gian.',
    fallbackBalancedTitle: 'Lộ trình cân bằng',
    fallbackBalancedSummary: 'Cân bằng trải nghiệm, thời gian và ngân sách.',
    fallbackBalancedStrategy: 'Phù hợp đa số du khách.',
    fallbackNightTitle: 'Lộ trình trải nghiệm đêm',
    fallbackNightSummary: 'Nhiều điểm dừng, trải nghiệm sâu hơn về đêm.',
    fallbackNightStrategy: 'Ưu tiên đa dạng món và không khí.',
    progressStatus: (completed, total, skipped, remaining) => `Hoàn thành ${completed}/${total} điểm, bỏ qua ${skipped}, còn lại ${remaining}.`,
    etaUnknown: 'Chưa xác định',
    etaValue: (minutes, meters) => `${minutes} phút (${meters} m)`,
    offRouteText: (name, meters) => `Bạn đang cách điểm gần nhất "${name}" khoảng ${meters} m. Nên quay lại hoặc bấm tính lại lộ trình.`,
    yourLocation: 'Vị trí của bạn',
    needOption: 'Bạn cần chọn một phương án lộ trình trước.',
    needLocation: 'Hãy lấy vị trí hiện tại trước khi tính lại lộ trình.',
    noNarrationData: 'Điểm dừng này chưa có dữ liệu thuyết minh tự động.',
    noCoordinate: 'Điểm dừng này chưa có toạ độ để dẫn đường.',
    noGuideStop: 'Không có điểm dừng phù hợp để dẫn đường.',
    journeyPrefix: 'Hành trình:',
    doneTitle: 'Bạn đã hoàn thành hoặc bỏ qua tất cả điểm dừng.',
    doneDesc: 'Hãy tạo lại option mới để tiếp tục hành trình.',
    distanceUnknown: 'Chưa xác định khoảng cách',
    distanceValue: (meters) => `Cách bạn khoảng ${meters} m`,
    nextStop: 'Điểm tiếp theo',
    distanceLabel: 'Khoảng cách',
    narrateStop: 'Nghe thuyết minh điểm này',
    guideStop: 'Dẫn đường',
    completeStop: 'Đã đến điểm này',
    skipStop: 'Bỏ qua điểm này',
    optionRecommended: 'Khuyến nghị',
    optionStrategy: 'Chiến lược',
    optionDuration: 'Thời lượng',
    optionBudget: 'Ngân sách/người',
    optionBudgetLocal: 'Quy đổi tiền tệ',
    optionWalking: 'Đi bộ ước tính',
    optionNarration: 'Thuyết minh',
    optionChoose: 'Chọn option này',
    optionPreview: 'Xem chi tiết',
    durationUnit: 'phút',
    geoUnsupported: 'Thiết bị không hỗ trợ định vị GPS trên trình duyệt.',
    geoLoading: 'Đang lấy vị trí hiện tại...',
    geoLocated: (lat, lng) => `Đã định vị: ${lat}, ${lng}`,
    geoFailed: (message) => `Không lấy được vị trí: ${message}`,
    panelOptionsNum: 'Options',
    panelOptionsTitle: 'Các phương án lộ trình',
    panelPriority: 'Ưu tiên:',
    sortRecommended: 'Khuyến nghị cho yêu cầu hiện tại',
    sortDuration: 'Nhanh nhất',
    sortBudget: 'Tiết kiệm ngân sách',
    sortWalking: 'Ít đi bộ nhất',
    panelJourneyNum: 'Journey',
    panelJourneyTitle: 'Hành trình đã chọn',
    panelYourLocation: 'Định vị của bạn:',
    panelLocateBtn: 'Dùng vị trí của tôi',
    panelRerouteBtn: 'Tính lại lộ trình từ vị trí hiện tại',
    panelBackNearestBtn: 'Quay về điểm gần nhất',
    panelAutoNarration: 'Tự phát thuyết minh khi đến gần điểm dừng',
    panelOffRouteStrong: 'Bạn đang lệch hướng.',
    panelProgressStrong: 'Tiến độ hành trình:',
    panelEtaStrong: 'ETA điểm tiếp theo:'
  },
  en: {
    fallbackRequestLabel: 'fallback',
    fallbackNarrationReady: (count) => `Narration is ready for ${count} stops.`,
    fallbackQuickTitle: 'Quick Route',
    fallbackQuickSummary: 'Move quickly and focus on top highlights.',
    fallbackQuickStrategy: 'Prioritize time efficiency.',
    fallbackBalancedTitle: 'Balanced Route',
    fallbackBalancedSummary: 'Balance experience, time, and budget.',
    fallbackBalancedStrategy: 'Suitable for most visitors.',
    fallbackNightTitle: 'Night Experience Route',
    fallbackNightSummary: 'More stops for deeper night exploration.',
    fallbackNightStrategy: 'Prioritize food variety and atmosphere.',
    progressStatus: (completed, total, skipped, remaining) => `Completed ${completed}/${total} stops, skipped ${skipped}, remaining ${remaining}.`,
    etaUnknown: 'Unknown',
    etaValue: (minutes, meters) => `${minutes} min (${meters} m)`,
    offRouteText: (name, meters) => `You are about ${meters} m away from the nearest stop "${name}". Return or recalculate the route.`,
    yourLocation: 'Your location',
    needOption: 'Please select a route option first.',
    needLocation: 'Please get your current location before recalculating.',
    noNarrationData: 'This stop does not have auto narration data yet.',
    noCoordinate: 'This stop has no coordinates for navigation.',
    noGuideStop: 'No suitable stop available for navigation.',
    journeyPrefix: 'Journey:',
    doneTitle: 'You completed or skipped all stops.',
    doneDesc: 'Create a new option to continue your journey.',
    distanceUnknown: 'Distance unavailable',
    distanceValue: (meters) => `About ${meters} m from your position`,
    nextStop: 'Next stop',
    distanceLabel: 'Distance',
    narrateStop: 'Play narration for this stop',
    guideStop: 'Navigate',
    completeStop: 'Mark as arrived',
    skipStop: 'Skip this stop',
    optionRecommended: 'Recommended',
    optionStrategy: 'Strategy',
    optionDuration: 'Duration',
    optionBudget: 'Budget/person',
    optionBudgetLocal: 'Converted currency',
    optionWalking: 'Estimated walking',
    optionNarration: 'Narration',
    optionChoose: 'Choose this option',
    optionPreview: 'View details',
    durationUnit: 'min',
    geoUnsupported: 'This device does not support browser GPS.',
    geoLoading: 'Getting current location...',
    geoLocated: (lat, lng) => `Located: ${lat}, ${lng}`,
    geoFailed: (message) => `Cannot get location: ${message}`,
    panelOptionsNum: 'Options',
    panelOptionsTitle: 'Route Options',
    panelPriority: 'Priority:',
    sortRecommended: 'Recommended for current request',
    sortDuration: 'Fastest',
    sortBudget: 'Budget saver',
    sortWalking: 'Least walking',
    panelJourneyNum: 'Journey',
    panelJourneyTitle: 'Selected Journey',
    panelYourLocation: 'Your location:',
    panelLocateBtn: 'Use my location',
    panelRerouteBtn: 'Recalculate from current location',
    panelBackNearestBtn: 'Back to nearest stop',
    panelAutoNarration: 'Auto-play narration when near a stop',
    panelOffRouteStrong: 'You are off route.',
    panelProgressStrong: 'Journey progress:',
    panelEtaStrong: 'ETA to next stop:'
  },
  fr: {
    fallbackRequestLabel: 'fallback',
    fallbackNarrationReady: (count) => `La narration est prete pour ${count} arrets.`,
    fallbackQuickTitle: 'Parcours rapide',
    fallbackQuickSummary: 'Avancez vite en ciblant les points forts.',
    fallbackQuickStrategy: 'Priorite au gain de temps.',
    fallbackBalancedTitle: 'Parcours equilibre',
    fallbackBalancedSummary: 'Equilibre entre experience, temps et budget.',
    fallbackBalancedStrategy: 'Convient a la plupart des visiteurs.',
    fallbackNightTitle: 'Parcours de nuit',
    fallbackNightSummary: 'Plus d arrets pour une exploration nocturne plus riche.',
    fallbackNightStrategy: 'Priorite a la diversite culinaire et a l ambiance.',
    progressStatus: (completed, total, skipped, remaining) => `Termine ${completed}/${total}, ignore ${skipped}, restant ${remaining}.`,
    etaUnknown: 'Inconnu',
    etaValue: (minutes, meters) => `${minutes} min (${meters} m)`,
    offRouteText: (name, meters) => `Vous etes a environ ${meters} m de l arret le plus proche "${name}". Revenez ou recalculez l itineraire.`,
    yourLocation: 'Votre position',
    needOption: 'Veuillez d abord choisir une option d itineraire.',
    needLocation: 'Veuillez obtenir votre position avant de recalculer.',
    noNarrationData: 'Cet arret n a pas encore de narration automatique.',
    noCoordinate: 'Cet arret n a pas de coordonnees de navigation.',
    noGuideStop: 'Aucun arret adapte pour la navigation.',
    journeyPrefix: 'Parcours :',
    doneTitle: 'Vous avez termine ou ignore tous les arrets.',
    doneDesc: 'Creez une nouvelle option pour continuer.',
    distanceUnknown: 'Distance indisponible',
    distanceValue: (meters) => `A environ ${meters} m de votre position`,
    nextStop: 'Prochain arret',
    distanceLabel: 'Distance',
    narrateStop: 'Lire la narration de cet arret',
    guideStop: 'Guider',
    completeStop: 'Marquer comme arrive',
    skipStop: 'Ignorer cet arret',
    optionRecommended: 'Recommande',
    optionStrategy: 'Strategie',
    optionDuration: 'Duree',
    optionBudget: 'Budget/personne',
    optionBudgetLocal: 'Conversion devise',
    optionWalking: 'Marche estimee',
    optionNarration: 'Narration',
    optionChoose: 'Choisir cette option',
    optionPreview: 'Voir details',
    durationUnit: 'min',
    geoUnsupported: 'Cet appareil ne prend pas en charge le GPS du navigateur.',
    geoLoading: 'Recuperation de la position...',
    geoLocated: (lat, lng) => `Position recue : ${lat}, ${lng}`,
    geoFailed: (message) => `Impossible d obtenir la position : ${message}`,
    panelOptionsNum: 'Options',
    panelOptionsTitle: 'Options d itineraire',
    panelPriority: 'Priorite :',
    sortRecommended: 'Recommande pour la demande actuelle',
    sortDuration: 'Le plus rapide',
    sortBudget: 'Economiser le budget',
    sortWalking: 'Moins de marche',
    panelJourneyNum: 'Journey',
    panelJourneyTitle: 'Parcours selectionne',
    panelYourLocation: 'Votre position :',
    panelLocateBtn: 'Utiliser ma position',
    panelRerouteBtn: 'Recalculer depuis la position actuelle',
    panelBackNearestBtn: 'Retour au point le plus proche',
    panelAutoNarration: 'Lecture automatique pres d un arret',
    panelOffRouteStrong: 'Vous etes hors itineraire.',
    panelProgressStrong: 'Progression du parcours :',
    panelEtaStrong: 'ETA prochain arret :'
  },
  ja: {
    fallbackRequestLabel: 'fallback',
    fallbackNarrationReady: (count) => `${count} か所分のナレーションを準備しました。`,
    fallbackQuickTitle: 'クイックルート',
    fallbackQuickSummary: '主要スポットを短時間で巡ります。',
    fallbackQuickStrategy: '時間効率を優先します。',
    fallbackBalancedTitle: 'バランスルート',
    fallbackBalancedSummary: '体験、時間、予算のバランスを重視します。',
    fallbackBalancedStrategy: '多くの旅行者に適しています。',
    fallbackNightTitle: 'ナイト体験ルート',
    fallbackNightSummary: '停留所を増やして夜を深く体験します。',
    fallbackNightStrategy: '料理の多様性と雰囲気を優先します。',
    progressStatus: (completed, total, skipped, remaining) => `完了 ${completed}/${total}、スキップ ${skipped}、残り ${remaining}。`,
    etaUnknown: '未確定',
    etaValue: (minutes, meters) => `${minutes} 分 (${meters} m)`,
    offRouteText: (name, meters) => `最寄りの停留所「${name}」から約 ${meters} m 離れています。戻るか再計算してください。`,
    yourLocation: '現在地',
    needOption: '先にルートオプションを選択してください。',
    needLocation: '再計算の前に現在地を取得してください。',
    noNarrationData: 'この停留所には自動ナレーションデータがありません。',
    noCoordinate: 'この停留所には案内用座標がありません。',
    noGuideStop: '案内できる停留所がありません。',
    journeyPrefix: '旅程:',
    doneTitle: 'すべての停留所を完了またはスキップしました。',
    doneDesc: '続行するには新しいオプションを作成してください。',
    distanceUnknown: '距離を取得できません',
    distanceValue: (meters) => `現在地から約 ${meters} m`,
    nextStop: '次の停留所',
    distanceLabel: '距離',
    narrateStop: 'この停留所を再生',
    guideStop: '案内する',
    completeStop: '到着済みにする',
    skipStop: 'この停留所をスキップ',
    optionRecommended: 'おすすめ',
    optionStrategy: '戦略',
    optionDuration: '所要時間',
    optionBudget: '1人あたり予算',
    optionBudgetLocal: '現地通貨換算',
    optionWalking: '推定徒歩',
    optionNarration: 'ナレーション',
    optionChoose: 'このオプションを選択',
    optionPreview: '詳細を見る',
    durationUnit: '分',
    geoUnsupported: 'この端末はブラウザGPSに対応していません。',
    geoLoading: '現在地を取得中...',
    geoLocated: (lat, lng) => `位置取得: ${lat}, ${lng}`,
    geoFailed: (message) => `位置を取得できません: ${message}`,
    panelOptionsNum: 'Options',
    panelOptionsTitle: 'ルートオプション',
    panelPriority: '優先:',
    sortRecommended: '現在の条件におすすめ',
    sortDuration: '最短',
    sortBudget: '予算重視',
    sortWalking: '徒歩最小',
    panelJourneyNum: 'Journey',
    panelJourneyTitle: '選択した旅程',
    panelYourLocation: '現在地:',
    panelLocateBtn: '現在地を使う',
    panelRerouteBtn: '現在地から再計算',
    panelBackNearestBtn: '最寄り停留所へ戻る',
    panelAutoNarration: '停留所付近で自動再生',
    panelOffRouteStrong: 'ルートから外れています。',
    panelProgressStrong: '進行状況:',
    panelEtaStrong: '次の停留所ETA:'
  },
  ko: {
    fallbackRequestLabel: 'fallback',
    fallbackNarrationReady: (count) => `${count}개 정류장 내레이션이 준비되었습니다.`,
    fallbackQuickTitle: '빠른 경로',
    fallbackQuickSummary: '핵심 장소를 빠르게 방문합니다.',
    fallbackQuickStrategy: '시간 효율을 우선합니다.',
    fallbackBalancedTitle: '균형 경로',
    fallbackBalancedSummary: '경험, 시간, 예산의 균형을 맞춥니다.',
    fallbackBalancedStrategy: '대부분의 방문자에게 적합합니다.',
    fallbackNightTitle: '야간 체험 경로',
    fallbackNightSummary: '정류장을 늘려 더 깊은 야간 체험을 제공합니다.',
    fallbackNightStrategy: '음식 다양성과 분위기를 우선합니다.',
    progressStatus: (completed, total, skipped, remaining) => `완료 ${completed}/${total}, 건너뜀 ${skipped}, 남음 ${remaining}.`,
    etaUnknown: '알 수 없음',
    etaValue: (minutes, meters) => `${minutes}분 (${meters}m)`,
    offRouteText: (name, meters) => `가장 가까운 정류장 "${name}"에서 약 ${meters}m 떨어져 있습니다. 돌아가거나 재계산하세요.`,
    yourLocation: '내 위치',
    needOption: '먼저 경로 옵션을 선택하세요.',
    needLocation: '재계산 전에 현재 위치를 가져오세요.',
    noNarrationData: '이 정류장에는 자동 내레이션 데이터가 없습니다.',
    noCoordinate: '이 정류장에는 길안내 좌표가 없습니다.',
    noGuideStop: '길안내 가능한 정류장이 없습니다.',
    journeyPrefix: '여정:',
    doneTitle: '모든 정류장을 완료하거나 건너뛰었습니다.',
    doneDesc: '계속하려면 새 옵션을 생성하세요.',
    distanceUnknown: '거리 정보 없음',
    distanceValue: (meters) => `내 위치에서 약 ${meters}m`,
    nextStop: '다음 정류장',
    distanceLabel: '거리',
    narrateStop: '이 정류장 내레이션 재생',
    guideStop: '길안내',
    completeStop: '도착 처리',
    skipStop: '이 정류장 건너뛰기',
    optionRecommended: '추천',
    optionStrategy: '전략',
    optionDuration: '소요시간',
    optionBudget: '1인 예산',
    optionBudgetLocal: '현지 통화 환산',
    optionWalking: '예상 도보',
    optionNarration: '내레이션',
    optionChoose: '이 옵션 선택',
    optionPreview: '상세 보기',
    durationUnit: '분',
    geoUnsupported: '이 기기는 브라우저 GPS를 지원하지 않습니다.',
    geoLoading: '현재 위치를 가져오는 중...',
    geoLocated: (lat, lng) => `위치 확인: ${lat}, ${lng}`,
    geoFailed: (message) => `위치를 가져올 수 없습니다: ${message}`,
    panelOptionsNum: 'Options',
    panelOptionsTitle: '경로 옵션',
    panelPriority: '우선순위:',
    sortRecommended: '현재 요청 기준 추천',
    sortDuration: '가장 빠름',
    sortBudget: '예산 절약',
    sortWalking: '도보 최소',
    panelJourneyNum: 'Journey',
    panelJourneyTitle: '선택한 여정',
    panelYourLocation: '내 위치:',
    panelLocateBtn: '내 위치 사용',
    panelRerouteBtn: '현재 위치에서 재계산',
    panelBackNearestBtn: '가장 가까운 정류장으로 이동',
    panelAutoNarration: '정류장 근처에서 자동 재생',
    panelOffRouteStrong: '경로에서 벗어났습니다.',
    panelProgressStrong: '여정 진행:',
    panelEtaStrong: '다음 정류장 ETA:'
  }
};

function tr(key) {
  return window.siteI18n?.translate?.(key, getPreferredLanguage()) ?? key;
}

function getPreferredLanguage() {
  const queryLang = new URLSearchParams(window.location.search).get('lang');
  const selected = queryLang || localStorage.getItem(SITE_LANGUAGE_KEY) || 'vi';
  return ['vi', 'en', 'fr', 'ja', 'ko'].includes(selected) ? selected : 'vi';
}

function routeUi(key, ...args) {
  const selected = getPreferredLanguage();
  const lang = ROUTING_I18N[selected] ? selected : 'vi';
  const value = ROUTING_I18N[lang][key] ?? ROUTING_I18N.vi[key] ?? key;
  return typeof value === 'function' ? value(...args) : value;
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

function mapLanguageToSpeechLocale(language) {
  const normalized = String(language || 'vi').toLowerCase();
  if (normalized.startsWith('en')) return 'en-US';
  if (normalized.startsWith('fr')) return 'fr-FR';
  if (normalized.startsWith('ja')) return 'ja-JP';
  if (normalized.startsWith('ko')) return 'ko-KR';
  return 'vi-VN';
}

function speakWithBrowserFallback(text, language) {
  if (!('speechSynthesis' in window)) {
    return false;
  }

  const content = String(text || '').trim();
  if (!content) {
    return false;
  }

  const utterance = new SpeechSynthesisUtterance(content);
  utterance.lang = mapLanguageToSpeechLocale(language);
  utterance.rate = 1;
  utterance.pitch = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
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

  const isToneFallback = String(result.voiceName || '').toLowerCase() === 'demo-fallback-tone'
    || String(result.audioUrl || '').toLowerCase().endsWith('.wav');

  if (isToneFallback) {
    const preferredLocation = window.localizeLocationData
      ? window.localizeLocationData(location, selectedLanguage)
      : location;
    const fallbackText = buildNarrationText(preferredLocation);
    const spoken = speakWithBrowserFallback(fallbackText, selectedLanguage);
    if (spoken) {
      return;
    }
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

  const localizedStops = (plan.stops ?? []).map((stop) => localizeRouteStop(stop));

  routeResult.classList.remove('hidden');
  routeTitle.textContent = plan.title;
  routeSummary.textContent = plan.summary;
  routeStrategy.textContent = plan.strategy;
  routeGeneratedBy.textContent = plan.generatedBy;
  routeStops.innerHTML = localizedStops.map((stop, index) => `
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
  const locale = getPreferredLanguage() === 'vi' ? 'vi-VN' : 'en-US';
  return `${new Intl.NumberFormat(locale).format(amount)} VND`;
}

function formatConvertedCurrencyFromVnd(value) {
  const amountVnd = Number(value || 0);
  const language = getPreferredLanguage();

  const configs = {
    vi: { currency: 'VND', locale: 'vi-VN', vndPerUnit: 1 },
    en: { currency: 'USD', locale: 'en-US', vndPerUnit: 25500 },
    fr: { currency: 'EUR', locale: 'fr-FR', vndPerUnit: 27800 },
    ja: { currency: 'JPY', locale: 'ja-JP', vndPerUnit: 170 },
    ko: { currency: 'KRW', locale: 'ko-KR', vndPerUnit: 19 }
  };

  const config = configs[language] || configs.vi;
  const amount = amountVnd / config.vndPerUnit;

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    maximumFractionDigits: config.currency === 'JPY' || config.currency === 'KRW' ? 0 : 2
  }).format(amount);
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
    narrationSummary: routeUi('fallbackNarrationReady', Math.min(stopCount, stops.length)),
    stops: stops.slice(0, Math.min(stopCount, stops.length))
  });

  return [
    make('quick-fallback', routeUi('fallbackQuickTitle'), routeUi('fallbackQuickSummary'), routeUi('fallbackQuickStrategy'), 3, 95, 180000, 900),
    make('balanced-fallback', routeUi('fallbackBalancedTitle'), routeUi('fallbackBalancedSummary'), routeUi('fallbackBalancedStrategy'), 4, 140, 240000, 1500),
    make('night-fallback', routeUi('fallbackNightTitle'), routeUi('fallbackNightSummary'), routeUi('fallbackNightStrategy'), 6, 200, 320000, 2400)
  ];
}

function normalizeOptionsResponse(result) {
  if (result && Array.isArray(result.options)) {
    return result;
  }

  const fallbackOptions = buildClientOptionsFromPlan(result);
  return {
    requestLabel: routeUi('fallbackRequestLabel'),
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
  journeyProgressStatus.textContent = routeUi('progressStatus', completed, total, skipped, remaining);
}

function updateEtaStatus(option) {
  if (!journeyEtaStatus) {
    return;
  }

  const nextStop = getRemainingStops(option)[0];
  const distance = estimateDistanceToStop(nextStop);
  if (distance === null) {
    journeyEtaStatus.textContent = routeUi('etaUnknown');
    return;
  }

  const speed = Math.max(0.4, speedMetersPerSecond || 1.25);
  const etaMinutes = Math.max(1, Math.round(distance / speed / 60));
  journeyEtaStatus.textContent = routeUi('etaValue', etaMinutes, Math.round(distance));
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
    journeyOffRouteText.textContent = routeUi('offRouteText', nearest.stop.name, distance);
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
      .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(`<strong>${escapeHtml(routeUi('yourLocation'))}</strong>`))
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
    alert(routeUi('needOption'));
    return;
  }

  if (!currentUserPosition) {
    alert(routeUi('needLocation'));
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
    journeyGeoStatus.textContent = routeUi('geoLocated', latitude.toFixed(5), longitude.toFixed(5));
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
      alert(routeUi('noNarrationData'));
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

  const isToneFallback = String(result.voiceName || '').toLowerCase() === 'demo-fallback-tone'
    || String(result.audioUrl || '').toLowerCase().endsWith('.wav');

  if (isToneFallback) {
    const localizedStop = localizeRouteStop(stop);
    const fallbackText = `${localizedStop.name}. ${localizedStop.why}. ${localizedStop.recommendedDish}.`;
    const spoken = speakWithBrowserFallback(fallbackText, selectedLanguage);
    if (spoken) {
      return;
    }
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
    alert(routeUi('noCoordinate'));
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

function findLocalizedLocationForStop(stop) {
  if (!stop || !Array.isArray(currentLocations) || currentLocations.length === 0) {
    return null;
  }

  const byId = stop.locationId
    ? currentLocations.find((location) => location.id === stop.locationId)
    : null;
  if (byId) {
    return byId;
  }

  const stopName = String(stop.name || '').trim();
  if (!stopName) {
    return null;
  }

  const normalizeLookup = (value) => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();

  const normalizedStopName = normalizeLookup(stopName);
  return currentLocations.find((location) => {
    const normalizedLocationName = normalizeLookup(location.name);
    return normalizedLocationName === normalizedStopName
      || normalizedLocationName.includes(normalizedStopName)
      || normalizedStopName.includes(normalizedLocationName);
  }) || null;
}

function localizeAddressByLanguage(address) {
  const original = String(address || '').trim();
  if (!original) {
    return original;
  }

  if (getPreferredLanguage() === 'vi') {
    return original;
  }

  return original
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/\bP\.\s*(\d+)/gi, 'Ward $1')
    .replace(/\bPhuong\s*(\d+)/gi, 'Ward $1')
    .replace(/\bQ\.\s*(\d+)/gi, 'District $1')
    .replace(/\bQuan\s*(\d+)/gi, 'District $1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function localizeRouteStop(stop) {
  const location = findLocalizedLocationForStop(stop);
  if (location) {
    return {
      ...stop,
      name: location.name || stop.name,
      address: localizeAddressByLanguage(location.address || stop.address),
      why: location.shortIntro || stop.why,
      recommendedDish: location.highlight || stop.recommendedDish,
      bestTime: location.bestTime || stop.bestTime
    };
  }

  if (typeof window.localizeLocationData === 'function' && stop?.locationId) {
    const localized = window.localizeLocationData({
      id: stop.locationId,
      name: stop.name,
      address: stop.address,
      category: '',
      shortIntro: stop.why,
      bestTime: stop.bestTime,
      highlight: stop.recommendedDish,
      descriptionVi: stop.why
    }, getPreferredLanguage());

    return {
      ...stop,
      name: localized?.name || stop.name,
      address: localizeAddressByLanguage(localized?.address || stop.address),
      why: localized?.shortIntro || stop.why,
      recommendedDish: localized?.highlight || stop.recommendedDish,
      bestTime: localized?.bestTime || stop.bestTime
    };
  }

  return stop;
}

function renderJourney(option) {
  if (!journeyPanel || !journeyStops || !journeyTitle) {
    return;
  }

  selectedRouteOption = option;
  journeyPanel.classList.remove('hidden');
  journeyTitle.textContent = `${routeUi('journeyPrefix')} ${option.title}`;
  updateJourneyProgressStatus(option);

  const remainingStops = getRemainingStops(option);
  if (remainingStops.length === 0) {
    journeyStops.innerHTML = `<div class="timeline-item"><h4>${escapeHtml(routeUi('doneTitle'))}</h4><p>${escapeHtml(routeUi('doneDesc'))}</p></div>`;
    updateEtaStatus(option);
    updateJourneyMap(option);
    return;
  }

  const nearestKey = currentUserPosition
    ? [...remainingStops]
      .map((stop) => ({ key: getStopKey(stop), distance: estimateDistanceToStop(stop) ?? Number.MAX_SAFE_INTEGER }))
      .sort((a, b) => a.distance - b.distance)[0]?.key
    : getStopKey(remainingStops[0]);

  journeyStops.innerHTML = remainingStops.map((rawStop, index) => {
    const stop = localizeRouteStop(rawStop);
    const distance = estimateDistanceToStop(stop);
    const distanceLabel = distance === null
      ? routeUi('distanceUnknown')
      : routeUi('distanceValue', Math.round(distance));
    const stopKey = getStopKey(stop);
    const isActive = nearestKey && stopKey === nearestKey;

    return `
      <div class="timeline-item">
        <h4>${index + 1}. ${escapeHtml(stop.name)} ${isActive ? `<span class="option-badge">${escapeHtml(routeUi('nextStop'))}</span>` : ''}</h4>
        <p><strong>${escapeHtml(tr('card_address'))}:</strong> ${escapeHtml(stop.address)}</p>
        <p><strong>${escapeHtml(tr('route_why_visit'))}:</strong> ${escapeHtml(stop.why)}</p>
        <p><strong>${escapeHtml(tr('route_try_dish'))}:</strong> ${escapeHtml(stop.recommendedDish)}</p>
        <p><strong>${escapeHtml(tr('route_best_time'))}:</strong> ${escapeHtml(stop.bestTime)}</p>
        <p><strong>${escapeHtml(routeUi('distanceLabel'))}:</strong> ${escapeHtml(distanceLabel)}</p>
        <div class="journey-stop-actions">
          <button type="button" class="button button-primary" data-stop-narrate="${escapeHtml(stop.locationId || '')}" data-stop-index="${index}">${escapeHtml(routeUi('narrateStop'))}</button>
          <button type="button" class="button button-secondary" data-stop-guide="${index}">${escapeHtml(routeUi('guideStop'))}</button>
          <button type="button" class="button button-secondary" data-stop-complete="${index}">${escapeHtml(routeUi('completeStop'))}</button>
          <button type="button" class="button button-secondary" data-stop-skip="${index}">${escapeHtml(routeUi('skipStop'))}</button>
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
  const showConvertedBudget = getPreferredLanguage() !== 'vi';

  routeOptionsGrid.innerHTML = sorted.map((option, index) => {
    const isRecommended = option.id === recommendedId;
    return `
    <article class="card route-option-card ${isRecommended ? 'recommended' : ''}">
      ${isRecommended ? `<span class="option-badge">${escapeHtml(routeUi('optionRecommended'))}</span>` : ''}
      <h3>${index + 1}. ${escapeHtml(option.title)}</h3>
      <p>${escapeHtml(option.summary)}</p>
      <p style="margin-top:.4rem;"><strong>${escapeHtml(routeUi('optionStrategy'))}:</strong> ${escapeHtml(option.strategy)}</p>
      <div class="route-option-metrics">
        <div class="metric">
          <div class="value">${escapeHtml(`${option.estimatedDurationMinutes} ${routeUi('durationUnit')}`)}</div>
          <div class="label">${escapeHtml(routeUi('optionDuration'))}</div>
        </div>
        <div class="metric">
          <div class="value">${escapeHtml(formatCurrencyVnd(option.estimatedBudgetPerPersonVnd))}</div>
          <div class="label">${escapeHtml(routeUi('optionBudget'))}</div>
        </div>
        ${showConvertedBudget ? `
        <div class="metric">
          <div class="value">${escapeHtml(formatConvertedCurrencyFromVnd(option.estimatedBudgetPerPersonVnd))}</div>
          <div class="label">${escapeHtml(routeUi('optionBudgetLocal'))}</div>
        </div>
        ` : ''}
        <div class="metric">
          <div class="value">${escapeHtml(formatDistanceKm(option.estimatedWalkingMeters))}</div>
          <div class="label">${escapeHtml(routeUi('optionWalking'))}</div>
        </div>
      </div>
      <p><strong>${escapeHtml(routeUi('optionNarration'))}:</strong> ${escapeHtml(option.narrationSummary)}</p>
      <div class="route-option-actions">
        <button type="button" class="button button-primary" data-option-index="${index}">${escapeHtml(routeUi('optionChoose'))}</button>
        <button type="button" class="button button-secondary" data-option-preview="${index}">${escapeHtml(routeUi('optionPreview'))}</button>
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
    journeyGeoStatus.textContent = routeUi('geoUnsupported');
    return;
  }

  journeyGeoStatus.textContent = routeUi('geoLoading');

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
      journeyGeoStatus.textContent = routeUi('geoFailed', error.message);
      resolve();
    }, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 20000
    });
  });
}

function setTextById(id, text) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  }
}

function applyRouteStaticLabels() {
  setTextById('routeOptionsSectionNum', routeUi('panelOptionsNum'));
  setTextById('routeOptionsTitle', routeUi('panelOptionsTitle'));
  setTextById('routeOptionSortLabel', routeUi('panelPriority'));
  setTextById('routeSortRecommended', routeUi('sortRecommended'));
  setTextById('routeSortDuration', routeUi('sortDuration'));
  setTextById('routeSortBudget', routeUi('sortBudget'));
  setTextById('routeSortWalking', routeUi('sortWalking'));

  setTextById('journeySectionNum', routeUi('panelJourneyNum'));
  setTextById('journeyTitle', routeUi('panelJourneyTitle'));
  setTextById('journeyGeoStrong', routeUi('panelYourLocation'));
  setTextById('journeyLocateBtn', routeUi('panelLocateBtn'));
  setTextById('journeyRerouteBtn', routeUi('panelRerouteBtn'));
  setTextById('journeyBackToNearestBtn', routeUi('panelBackNearestBtn'));
  setTextById('journeyAutoNarrationLabel', routeUi('panelAutoNarration'));
  setTextById('journeyOffRouteStrong', routeUi('panelOffRouteStrong'));
  setTextById('journeyProgressStrong', routeUi('panelProgressStrong'));
  setTextById('journeyEtaStrong', routeUi('panelEtaStrong'));
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
        alert(routeUi('noGuideStop'));
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
  applyRouteStaticLabels();
  initNarrationEvents();
  initLocationsEvents();
  initRouteEvents();

  try {
    if (locationsGrid || locationSelect || routeForm) {
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
