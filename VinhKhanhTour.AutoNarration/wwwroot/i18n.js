(function () {
  const SITE_LANGUAGE_KEY = 'siteLanguage';

  const messages = {
    vi: {
      nav_overview: 'Tong quan',
      nav_food: 'Mon ngon',
      nav_map: 'Ban do',
      nav_routing: 'AI Routing',
      nav_audio: 'Audio TTS',
      nav_detail: 'Chi tiet',
      nav_admin: 'Admin',
      label_language: 'Ngon ngu',
      home_modules_title: 'Di toi cac phan he',
      food_hero_title: 'Mon ngon & Diem den',
      food_hero_subtitle: 'Danh sach day du cac quan va mon noi bat tren pho am thuc Vinh Khanh.',
      food_section_title: 'Danh sach Mon ngon & Diem den (POI)',
      map_hero_title: 'Ban do Khu Pho',
      map_hero_subtitle: 'Mo phong bo tri cac diem an uong noi bat va khu vuc trai nghiem tai Vinh Khanh.',
      map_section_title: 'GPS & Map Pack (Mo phong)',
      routing_hero_title: 'AI Routing',
      routing_hero_subtitle: 'Tao lo trinh an uong thong minh theo nhom khach, khung gio va ngan sach.',
      routing_section_title: 'Goi y lo trinh bang AI',
      audio_hero_title: 'Audio TTS',
      audio_hero_subtitle: 'Tao thuyet minh tu dong theo ngon ngu va giong doc mong muon.',
      audio_section_title: 'Thuyet minh tu dong',
      detail_hero_title: 'Vinh Khanh sau anh den',
      detail_hero_subtitle: 'Khong khi pho dem, tieng loc coc cua dau bep go chao, anh lua ruc rang xen lan mui vi hai san ngap tran Sai Gon quy tu lai noi nay.',
      card_address: 'Dia chi',
      card_hours: 'Gio mo cua',
      card_highlight: 'Diem nhan',
      btn_narrate_private: 'Tao thuyet minh rieng',
      template_none: 'Khong dung template',
      narration_failed: 'Tao thuyet minh that bai.',
      audio_open_file: 'Mo file audio',
      state_generating: 'Dang tao...',
      state_suggesting: 'Dang goi y...',
      btn_audio_tts: 'Tao Audio TTS',
      btn_route_suggest: 'Goi y lo trinh',
      route_why_visit: 'Vi sao nen ghe',
      route_try_dish: 'Mon nen thu',
      route_best_time: 'Khung gio dep',
      map_status_no_style: 'Chua tim thay style vector local. Dang dung nen ban do OSM fallback de hien thi day du.',
      map_status_has_style: 'Dang su dung style Vector Tiles offline tu thu muc local.',
      map_status_no_api: 'Khong tai duoc danh sach POI tu API.',
      map_status_no_maplibre: 'MapLibre khong tai duoc. Dang dung fallback map local.',
      map_status_no_webgl: 'Khong khoi tao duoc WebGL map. Dang dung fallback map local.',
      map_status_no_check: 'Khong kiem tra duoc style vector local. Dang dung nen ban do OSM fallback.'
    },
    en: {
      nav_overview: 'Overview',
      nav_food: 'Food Spots',
      nav_map: 'Map',
      nav_routing: 'AI Routing',
      nav_audio: 'Audio TTS',
      nav_detail: 'Details',
      nav_admin: 'Admin',
      label_language: 'Language',
      home_modules_title: 'Explore Modules',
      food_hero_title: 'Food Spots & Places',
      food_hero_subtitle: 'Full list of signature places and dishes on Vinh Khanh culinary street.',
      food_section_title: 'Food Spots & Places (POI)',
      map_hero_title: 'Street Map',
      map_hero_subtitle: 'A map view of highlighted food places across Vinh Khanh street.',
      map_section_title: 'GPS & Map Pack (Simulation)',
      routing_hero_title: 'AI Routing',
      routing_hero_subtitle: 'Build smart food routes by visitor type, time, and budget.',
      routing_section_title: 'AI Route Suggestions',
      audio_hero_title: 'Audio TTS',
      audio_hero_subtitle: 'Generate narration audio in your selected language and voice.',
      audio_section_title: 'Automatic Narration',
      detail_hero_title: 'Vinh Khanh After Dark',
      detail_hero_subtitle: 'Night vibes, sizzling pans, and seafood aromas create a vivid Saigon food street experience.',
      card_address: 'Address',
      card_hours: 'Opening Hours',
      card_highlight: 'Highlights',
      btn_narrate_private: 'Generate narration',
      template_none: 'No template',
      narration_failed: 'Narration generation failed.',
      audio_open_file: 'Open audio file',
      state_generating: 'Generating...',
      state_suggesting: 'Suggesting...',
      btn_audio_tts: 'Create Audio TTS',
      btn_route_suggest: 'Suggest route',
      route_why_visit: 'Why visit',
      route_try_dish: 'Dish to try',
      route_best_time: 'Best time',
      map_status_no_style: 'Offline vector style was not found. OSM fallback basemap is being used.',
      map_status_has_style: 'Offline vector style is active.',
      map_status_no_api: 'Could not load POI data from API.',
      map_status_no_maplibre: 'MapLibre failed to load. Using local fallback map.',
      map_status_no_webgl: 'WebGL map failed to initialize. Using local fallback map.',
      map_status_no_check: 'Could not verify offline vector style. OSM fallback is active.'
    },
    fr: {
      nav_overview: 'Apercu', nav_food: 'Cuisine', nav_map: 'Carte', nav_routing: 'Itineraire IA', nav_audio: 'Audio TTS', nav_detail: 'Details', nav_admin: 'Admin', label_language: 'Langue',
      home_modules_title: 'Explorer les modules', food_hero_title: 'Lieux et plats', food_hero_subtitle: 'Liste complete des lieux et plats phares de la rue Vinh Khanh.', food_section_title: 'Lieux et plats (POI)',
      map_hero_title: 'Carte de la rue', map_hero_subtitle: 'Carte des lieux culinaires remarquables de Vinh Khanh.', map_section_title: 'GPS et Pack Carte (Simulation)',
      routing_hero_title: 'Itineraire IA', routing_hero_subtitle: 'Creer un parcours culinaire selon profil, heure et budget.', routing_section_title: 'Suggestions IA',
      audio_hero_title: 'Audio TTS', audio_hero_subtitle: 'Generer une narration audio selon langue et voix.', audio_section_title: 'Narration automatique',
      detail_hero_title: 'Vinh Khanh la nuit', detail_hero_subtitle: 'Ambiance nocturne, sons de cuisine et parfums marins au coeur de Saigon.',
      card_address: 'Adresse', card_hours: 'Horaires', card_highlight: 'Points forts', btn_narrate_private: 'Generer narration',
      template_none: 'Sans modele', narration_failed: 'Echec de generation de narration.', audio_open_file: 'Ouvrir le fichier audio',
      state_generating: 'Generation...', state_suggesting: 'Suggestion...', btn_audio_tts: 'Creer Audio TTS', btn_route_suggest: 'Suggere un itineraire',
      route_why_visit: 'Pourquoi visiter', route_try_dish: 'Plat recommande', route_best_time: 'Meilleur moment',
      map_status_no_style: 'Style vectoriel hors ligne introuvable. Fond OSM de secours active.', map_status_has_style: 'Style vectoriel hors ligne actif.',
      map_status_no_api: 'Impossible de charger les POI depuis l API.', map_status_no_maplibre: 'MapLibre indisponible. Carte locale de secours active.',
      map_status_no_webgl: 'WebGL indisponible. Carte locale de secours active.', map_status_no_check: 'Verification du style hors ligne impossible. OSM de secours active.'
    },
    ja: {
      nav_overview: '概要', nav_food: 'グルメ', nav_map: '地図', nav_routing: 'AIルート', nav_audio: '音声TTS', nav_detail: '詳細', nav_admin: '管理', label_language: '言語',
      home_modules_title: 'モジュールを見る', food_hero_title: '人気店と料理', food_hero_subtitle: 'ビンカイン通りの注目スポット一覧。', food_section_title: 'スポット一覧 (POI)',
      map_hero_title: 'ストリートマップ', map_hero_subtitle: 'ビンカインの注目飲食スポットを表示します。', map_section_title: 'GPS & マップパック (シミュレーション)',
      routing_hero_title: 'AIルーティング', routing_hero_subtitle: '客層、時間、予算に応じた食べ歩きルートを作成。', routing_section_title: 'AIおすすめルート',
      audio_hero_title: '音声TTS', audio_hero_subtitle: '言語と音声を選んでナレーションを生成。', audio_section_title: '自動ナレーション',
      detail_hero_title: '夜のビンカイン', detail_hero_subtitle: '夜の活気、調理の音、海鮮の香りが広がる体験。',
      card_address: '住所', card_hours: '営業時間', card_highlight: '見どころ', btn_narrate_private: 'ナレーション作成',
      template_none: 'テンプレートなし', narration_failed: 'ナレーション生成に失敗しました。', audio_open_file: '音声ファイルを開く',
      state_generating: '生成中...', state_suggesting: '提案中...', btn_audio_tts: '音声TTSを作成', btn_route_suggest: 'ルート提案',
      route_why_visit: '立ち寄る理由', route_try_dish: 'おすすめ料理', route_best_time: 'おすすめ時間',
      map_status_no_style: 'オフラインベクタースタイルが見つかりません。OSM代替地図を使用中。', map_status_has_style: 'オフラインベクタースタイルを使用中。',
      map_status_no_api: 'APIからPOIを取得できません。', map_status_no_maplibre: 'MapLibreを読み込めません。代替地図を表示します。',
      map_status_no_webgl: 'WebGL地図を初期化できません。代替地図を表示します。', map_status_no_check: 'オフラインスタイルの確認に失敗。OSM代替地図を使用中。'
    },
    ko: {
      nav_overview: '개요', nav_food: '맛집', nav_map: '지도', nav_routing: 'AI 경로', nav_audio: '오디오 TTS', nav_detail: '상세', nav_admin: '관리', label_language: '언어',
      home_modules_title: '모듈 보기', food_hero_title: '맛집 & 장소', food_hero_subtitle: '빈칸 거리의 대표 맛집 목록입니다.', food_section_title: '맛집/장소 목록 (POI)',
      map_hero_title: '거리 지도', map_hero_subtitle: '빈칸 거리의 주요 음식점을 지도에서 확인하세요.', map_section_title: 'GPS & 맵 팩 (시뮬레이션)',
      routing_hero_title: 'AI 라우팅', routing_hero_subtitle: '방문 유형, 시간, 예산에 맞는 미식 경로를 생성합니다.', routing_section_title: 'AI 경로 추천',
      audio_hero_title: '오디오 TTS', audio_hero_subtitle: '언어와 음성을 선택해 내레이션을 생성하세요.', audio_section_title: '자동 내레이션',
      detail_hero_title: '밤의 빈칸', detail_hero_subtitle: '밤거리의 분위기와 해산물 향이 어우러진 생생한 경험.',
      card_address: '주소', card_hours: '영업 시간', card_highlight: '포인트', btn_narrate_private: '내레이션 생성',
      template_none: '템플릿 없음', narration_failed: '내레이션 생성에 실패했습니다.', audio_open_file: '오디오 파일 열기',
      state_generating: '생성 중...', state_suggesting: '추천 중...', btn_audio_tts: '오디오 TTS 생성', btn_route_suggest: '경로 추천',
      route_why_visit: '방문 이유', route_try_dish: '추천 메뉴', route_best_time: '추천 시간',
      map_status_no_style: '오프라인 벡터 스타일을 찾지 못했습니다. OSM 대체 지도를 사용합니다.', map_status_has_style: '오프라인 벡터 스타일을 사용 중입니다.',
      map_status_no_api: 'API에서 POI 데이터를 불러오지 못했습니다.', map_status_no_maplibre: 'MapLibre 로드 실패. 대체 지도를 표시합니다.',
      map_status_no_webgl: 'WebGL 지도 초기화 실패. 대체 지도를 표시합니다.', map_status_no_check: '오프라인 스타일 확인 실패. OSM 대체 지도를 사용합니다.'
    }
  };

  const phraseTranslations = {
    en: {
      'Hỗ trợ chế độ Offline (PWA) — Bạn có thể truy cập nội dung khi mất kết nối mạng!': 'Offline mode (PWA) is supported - you can access content without network connection.',
      'Điểm / Món Mẫu': 'Sample Spots / Dishes',
      'Ngôn Ngữ Hỗ Trợ': 'Supported Languages',
      'Tổng quan dự án': 'Project Overview',
      '1. Trải nghiệm phố đêm': '1. Night street experience',
      '2. Ẩm thực đa dạng': '2. Diverse cuisine',
      '3. Du lịch thông minh': '3. Smart tourism',
      'Món/quán nổi bật để tạo thuyết minh nhanh': 'Featured places for quick narration',
      'Đang tải danh sách quán...': 'Loading places...',
      'Mở trang Món ngon': 'Open Food Spots',
      'Mở trang Bản đồ': 'Open Map',
      'Mở AI Routing': 'Open AI Routing',
      'Mở Audio TTS': 'Open Audio TTS',
      'Mở Chi tiết': 'Open Details',
      'Gợi ý trải nghiệm (Timeline)': 'Suggested Experience (Timeline)',
      'Hình ảnh nổi bật': 'Featured Images',
      'Lưu ý:': 'Note:',
      'Đang tải dữ liệu...': 'Loading data...',
      'Tạo thuyết minh cho món này': 'Create narration for this place',
      'Tích hợp bản đồ Vector Tiles offline và đánh dấu các vị trí quán ăn nổi bật trên trục đường Vĩnh Khánh.': 'Integrated offline vector tiles and highlighted food spots on Vinh Khanh street.',
      'Đang khởi tạo bản đồ...': 'Initializing map...'
    },
    fr: {
      'Hỗ trợ chế độ Offline (PWA) — Bạn có thể truy cập nội dung khi mất kết nối mạng!': 'Mode hors ligne (PWA) pris en charge : acces au contenu sans connexion reseau.',
      'Điểm / Món Mẫu': 'Points / Plats exemples',
      'Ngôn Ngữ Hỗ Trợ': 'Langues prises en charge',
      'Tổng quan dự án': 'Vue d ensemble du projet',
      'Món/quán nổi bật để tạo thuyết minh nhanh': 'Lieux recommandes pour narration rapide',
      'Đang tải danh sách quán...': 'Chargement des lieux...',
      'Đang tải dữ liệu...': 'Chargement des donnees...',
      'Tạo thuyết minh cho món này': 'Creer une narration pour ce lieu',
      'Đang khởi tạo bản đồ...': 'Initialisation de la carte...'
    },
    ja: {
      'Hỗ trợ chế độ Offline (PWA) — Bạn có thể truy cập nội dung khi mất kết nối mạng!': 'オフラインモード（PWA）対応。ネット接続がなくても閲覧できます。',
      'Điểm / Món Mẫu': 'スポット / 料理サンプル',
      'Ngôn Ngữ Hỗ Trợ': '対応言語',
      'Tổng quan dự án': 'プロジェクト概要',
      'Món/quán nổi bật để tạo thuyết minh nhanh': 'すぐにナレーションできる注目スポット',
      'Đang tải danh sách quán...': 'スポットを読み込み中...',
      'Đang tải dữ liệu...': 'データを読み込み中...',
      'Tạo thuyết minh cho món này': 'この場所のナレーションを作成',
      'Đang khởi tạo bản đồ...': '地図を初期化中...'
    },
    ko: {
      'Hỗ trợ chế độ Offline (PWA) — Bạn có thể truy cập nội dung khi mất kết nối mạng!': '오프라인 모드(PWA) 지원 - 네트워크 없이도 콘텐츠를 볼 수 있습니다.',
      'Điểm / Món Mẫu': '샘플 장소 / 메뉴',
      'Ngôn Ngữ Hỗ Trợ': '지원 언어',
      'Tổng quan dự án': '프로젝트 개요',
      'Món/quán nổi bật để tạo thuyết minh nhanh': '빠른 내레이션 추천 장소',
      'Đang tải danh sách quán...': '장소 목록 로딩 중...',
      'Đang tải dữ liệu...': '데이터 로딩 중...',
      'Tạo thuyết minh cho món này': '이 장소 내레이션 만들기',
      'Đang khởi tạo bản đồ...': '지도 초기화 중...'
    }
  };

  function normalize(lang) {
    return messages[lang] ? lang : 'vi';
  }

  function getSiteLanguage() {
    return normalize(localStorage.getItem(SITE_LANGUAGE_KEY) || 'vi');
  }

  function setSiteLanguage(lang) {
    localStorage.setItem(SITE_LANGUAGE_KEY, normalize(lang));
  }

  function translate(key, lang) {
    const selected = normalize(lang || getSiteLanguage());
    return messages[selected]?.[key] ?? messages.vi[key] ?? key;
  }

  function applyNavLabels(lang) {
    const nav = document.querySelector('nav');
    if (!nav) return;

    const mapByPath = {
      '/': 'nav_overview',
      '/index.html': 'nav_overview',
      '/mon-ngon.html': 'nav_food',
      '/ban-do.html': 'nav_map',
      '/ai-routing.html': 'nav_routing',
      '/audio-tts.html': 'nav_audio',
      '/about.html': 'nav_detail',
      '/admin.html': 'nav_admin'
    };

    nav.querySelectorAll('.nav-links a').forEach((link) => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      const key = mapByPath[href];
      if (key) {
        link.textContent = translate(key, lang);
      }
    });
  }

  function applyDataI18n(lang) {
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.getAttribute('data-i18n');
      if (key) node.textContent = translate(key, lang);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
      const key = node.getAttribute('data-i18n-placeholder');
      if (key) node.setAttribute('placeholder', translate(key, lang));
    });
  }

  function applyPhraseTranslations(lang) {
    const table = phraseTranslations[lang];
    if (!table) {
      return;
    }

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    const nodes = [];

    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node?.parentElement) {
        continue;
      }

      const tag = node.parentElement.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE') {
        continue;
      }

      nodes.push(node);
    }

    nodes.forEach((node) => {
      const original = node.textContent || '';
      let updated = original;

      Object.entries(table).forEach(([viText, localized]) => {
        if (updated.includes(viText)) {
          updated = updated.replaceAll(viText, localized);
        }
      });

      if (updated !== original) {
        node.textContent = updated;
      }
    });
  }

  function applySiteLanguage(lang) {
    const selected = normalize(lang || getSiteLanguage());
    applyNavLabels(selected);
    applyDataI18n(selected);
    applyPhraseTranslations(selected);
  }

  applySiteLanguage(getSiteLanguage());

  window.siteI18n = {
    getSiteLanguage,
    setSiteLanguage,
    applySiteLanguage,
    translate
  };
})();
