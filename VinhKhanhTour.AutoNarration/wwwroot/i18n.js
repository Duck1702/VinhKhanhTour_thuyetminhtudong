(function () {
  const SITE_LANGUAGE_KEY = 'siteLanguage';

  const messages = {
    vi: {
      nav_overview: 'Tổng quan',
      nav_food: 'Món ngon',
      nav_map: 'Bản đồ',
      nav_routing: 'AI Routing',
      nav_audio: 'Audio TTS',
      nav_detail: 'Chi tiết',
      nav_admin: 'Admin',
      label_language: 'Ngôn ngữ',
      home_modules_title: 'Đi tới các phân hệ',
      home_offline_banner: 'Offline mode (PWA) hỗ trợ - bạn có thể truy cập nội dung khi mất kết nối mạng!',
      home_stats_spots: 'Điểm / Món mẫu',
      home_stats_languages: 'Ngôn ngữ hỗ trợ',
      home_overview_title: 'Tổng quan dự án',
      home_overview_card1_title: '1. Trải nghiệm phố đêm',
      home_overview_card1_desc: 'Vĩnh Khánh nổi tiếng với hoạt động ăn uống về đêm, nhiều quán mở muộn và không khí rất đặc trưng của Sài Gòn. Nơi hội tụ của hải sản nướng và bia lạnh.',
      home_overview_card2_title: '2. Ẩm thực đa dạng',
      home_overview_card2_desc: 'Từ cơm tấm, ốc nướng, chè cho đến đồ uống sáng tạo, khu phố này đủ chất liệu để tạo nội dung giới thiệu vô cùng hấp dẫn và phong phú.',
      home_overview_card3_title: '3. Du lịch thông minh',
      home_overview_card3_desc: 'Website được thiết kế để gắn QR tại các địa điểm. Khách du lịch quét mã, nghe thuyết minh bằng mọi ngôn ngữ và tiếp cận thông tin offline dễ dàng.',
      home_featured_title: 'Món/quán nổi bật để tạo thuyết minh nhanh',
      home_loading_places: 'Đang tải danh sách quán...',
      home_module_food_title: 'Món ngon',
      home_module_food_desc: 'Xem toàn bộ danh sách điểm đến, món ăn nổi bật và thông tin địa chỉ.',
      home_module_food_cta: 'Mở trang Món ngon',
      home_module_map_title: 'Bản đồ',
      home_module_map_desc: 'Xem phần mô phỏng map và cách phân bố điểm ăn trên trục Vĩnh Khánh.',
      home_module_map_cta: 'Mở trang Bản đồ',
      home_module_route_title: 'AI Routing',
      home_module_route_desc: 'Tạo lộ trình ăn uống gợi ý theo đối tượng khách và ngân sách.',
      home_module_route_cta: 'Mở AI Routing',
      home_module_audio_title: 'Audio TTS',
      home_module_audio_desc: 'Tạo thuyết minh tự động nhiều ngôn ngữ và phát ngay trên trình duyệt.',
      home_module_audio_cta: 'Mở Audio TTS',
      home_module_detail_title: 'Chi tiết',
      home_module_detail_desc: 'Trang mô tả trải nghiệm đầy đủ, timeline và hình ảnh nổi bật của khu phố.',
      home_module_detail_cta: 'Mở Chi tiết',
      home_footer_desc: 'Được xây dựng cho việc tự động hóa dịch ngôn ngữ và giọng đọc. Kết hợp API và giao diện UI tĩnh phục vụ PWA.',
      food_hero_title: 'Món ngon & Điểm đến',
      food_hero_subtitle: 'Danh sách đầy đủ các quán và món nổi bật trên phố ẩm thực Vĩnh Khánh.',
      food_section_title: 'Danh sách Món ngon & Điểm đến (POI)',
      map_hero_title: 'Bản đồ Khu Phố',
      map_hero_subtitle: 'Mô phỏng bố trí các điểm ăn uống nổi bật và khu vực trải nghiệm tại Vĩnh Khánh.',
      map_section_title: 'GPS & Map Pack (Mô phỏng)',
      routing_hero_title: 'AI Routing',
      routing_hero_subtitle: 'Tạo lộ trình ăn uống thông minh theo nhóm khách, khung giờ và ngân sách.',
      routing_section_title: 'Gợi ý lộ trình bằng AI',
      audio_hero_title: 'Audio TTS',
      audio_hero_subtitle: 'Tạo thuyết minh tự động theo ngôn ngữ và giọng đọc mong muốn.',
      audio_section_title: 'Thuyết minh tự động',
      detail_hero_title: 'Vĩnh Khánh sau ánh đèn',
      detail_hero_subtitle: 'Không khí phố đêm, tiếng lóc cóc của đầu bếp gõ chảo, ánh lửa rực ràng xen lẫn mùi vị hải sản ngập tràn, Sài Gòn quy tụ lại nơi này.',
      detail_cta_audio: 'Nghe thuyết minh Audio',
      detail_cta_food: 'Danh sách món ngon',
      detail_timeline_title: 'Gợi ý trải nghiệm (Timeline)',
      detail_stop1_title: '1. Từ Quận 1 di chuyển qua (18:00)',
      detail_stop1_desc: 'Hướng đi dọc ngã Đồng Khởi - Tôn Đức Thắng - Cầu Khánh Hội - Đoàn Như Hải - Hoàng Diệu - Vĩnh Khánh.',
      detail_stop2_title: '2. Điểm mạnh chính (19:00 - 21:00)',
      detail_stop2_desc: 'Ghé các trụ cột như Ốc Oanh, Ốc Vũ, Thảo Ốc. Nơi đây là điểm nóng nhất, rất nhộn nhịp.',
      detail_stop3_title: '3. Trạm nghỉ cuối (22:00)',
      detail_stop3_desc: 'Cảm nhận nhịp chậm hơn tại những quán Bể Ốc hoặc nhâm nhi đồ ngọt trước khi kết thúc lịch trình.',
      detail_gallery_title: 'Hình ảnh nổi bật',
      detail_gallery_card1_title: 'Khung cảnh ban ngày / ban đầu',
      detail_gallery_card1_desc: 'Khung cảnh khu phố chưa lên đèn hoặc các quán bắt đầu đón khách từ buổi chiều.',
      detail_gallery_card2_title: 'Hoạt động sôi nổi về đêm',
      detail_gallery_card2_desc: 'Góc không gian ban đêm, biển bảng đèn neon và hàng dài xe chờ khách đông đúc.',
      detail_note_label: 'Lưu ý:',
      detail_note_desc: 'Cấu trúc trang này cũng được tối ưu hóa cho PWA để giảm thiểu dung lượng tải lại trang (cache asset) trên thiết bị di động.',
      route_label_visitor_type: 'Loại khách',
      route_placeholder_visitor_type: 'Ví dụ: gia đình, cặp đôi, nhóm bạn',
      route_label_budget: 'Ngân sách',
      route_option_any: 'Tùy ý',
      route_option_low: 'Thấp',
      route_option_medium: 'Vừa',
      route_option_high: 'Cao',
      route_label_start_time: 'Giờ bắt đầu',
      route_label_guest_count: 'Số khách',
      route_label_preferences: 'Sở thích / yêu cầu',
      route_placeholder_preferences: 'Ví dụ: thích ốc, đi khuya, chỗ ngồi thoải mái, giá dễ chịu',
      route_label_must_try: 'Món muốn thử',
      route_placeholder_must_try: 'Ví dụ: ốc len xào dừa, cua rang muối, sò điệp nướng',
      route_summary_label: 'Tóm tắt:',
      route_strategy_label: 'Chiến lược:',
      route_source_label: 'Nguồn gợi ý:',
      audio_label_location: 'Chọn nội dung (POI)',
      audio_label_template: 'Hoặc chọn thuyết minh có sẵn',
      audio_label_target_language: 'Ngôn ngữ dịch',
      audio_label_speaking_rate: 'Tốc độ đọc',
      audio_label_custom_text: 'Nội dung tùy chỉnh (ghi đè kịch bản)',
      audio_placeholder_custom_text: 'Để trống nếu muốn dùng nội dung mặc định của POI...',
      audio_result_title: 'Kết quả Audio',
      audio_result_translated_label: 'Nội dung dịch:',
      audio_result_voice_label: 'Giọng đọc (Voice):',
      audio_result_download_cta: 'Tải xuống / Mở tab mới',
      card_address: 'Địa chỉ',
      card_hours: 'Giờ mở cửa',
      card_highlight: 'Điểm nhấn',
      btn_narrate_private: 'Nghe thuyết minh ngay',
      template_none: 'Không dùng template',
      narration_failed: 'Tạo thuyết minh thất bại.',
      audio_open_file: 'Mở file audio',
      state_generating: 'Đang tạo...',
      state_suggesting: 'Đang gợi ý...',
      btn_audio_tts: 'Tạo Audio TTS',
      btn_route_suggest: 'Gợi ý lộ trình',
      route_why_visit: 'Vì sao nên ghé',
      route_try_dish: 'Món nên thử',
      route_best_time: 'Khung giờ đẹp',
      map_status_no_style: 'Chưa tìm thấy style vector local. Đang dùng nền bản đồ OSM fallback để hiển thị đầy đủ.',
      map_status_has_style: 'Đang sử dụng style Vector Tiles offline từ thư mục local.',
      map_status_no_api: 'Không tải được danh sách POI từ API.',
      map_status_no_maplibre: 'MapLibre không tải được. Đang dùng fallback map local.',
      map_status_no_webgl: 'Không khởi tạo được WebGL map. Đang dùng fallback map local.',
      map_status_no_check: 'Không kiểm tra được style vector local. Đang dùng nền bản đồ OSM fallback.',
      assistant_section_title: 'Trợ lý hỏi đáp du lịch',
      assistant_question_placeholder: 'Hỏi về món ngon, quán phù hợp, giờ mở cửa, gợi ý lịch trình...',
      assistant_ask_btn: 'Hỏi trợ lý',
      assistant_thinking: 'Đang suy nghĩ...',
      assistant_answer_label: 'Trả lời:',
      assistant_suggested_label: 'Gợi ý địa điểm:',
      assistant_error: 'Không thể lấy câu trả lời lúc này.'
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
      home_offline_banner: 'Offline mode (PWA) is supported - you can access content without network connection.',
      home_stats_spots: 'Sample Spots / Dishes',
      home_stats_languages: 'Supported Languages',
      home_overview_title: 'Project Overview',
      home_overview_card1_title: '1. Night street experience',
      home_overview_card1_desc: 'Vinh Khanh is famous for late-night dining, lively venues, and a unique Saigon vibe with seafood grills and cold drinks.',
      home_overview_card2_title: '2. Diverse cuisine',
      home_overview_card2_desc: 'From broken rice and grilled snails to desserts and creative drinks, this street offers rich storytelling material.',
      home_overview_card3_title: '3. Smart tourism',
      home_overview_card3_desc: 'The website is designed for QR touchpoints so visitors can scan, listen in many languages, and access information offline.',
      home_featured_title: 'Featured places for quick narration',
      home_loading_places: 'Loading places...',
      home_module_food_title: 'Food Spots',
      home_module_food_desc: 'Browse full POI list with signature dishes and addresses.',
      home_module_food_cta: 'Open Food Spots',
      home_module_map_title: 'Map',
      home_module_map_desc: 'View map simulation and distribution of food locations on Vinh Khanh street.',
      home_module_map_cta: 'Open Map',
      home_module_route_title: 'AI Routing',
      home_module_route_desc: 'Create route suggestions by visitor type and budget.',
      home_module_route_cta: 'Open AI Routing',
      home_module_audio_title: 'Audio TTS',
      home_module_audio_desc: 'Generate multilingual narration and play instantly in browser.',
      home_module_audio_cta: 'Open Audio TTS',
      home_module_detail_title: 'Details',
      home_module_detail_desc: 'Explore full experience timeline and highlighted visuals.',
      home_module_detail_cta: 'Open Details',
      home_footer_desc: 'Built for automated language translation and voice narration, combining API backend with static UI for PWA.',
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
      detail_cta_audio: 'Listen to Audio Narration',
      detail_cta_food: 'View Food List',
      detail_timeline_title: 'Suggested Experience (Timeline)',
      detail_stop1_title: '1. From District 1 transfer (18:00)',
      detail_stop1_desc: 'Suggested route: Dong Khoi - Ton Duc Thang - Khanh Hoi Bridge - Doan Nhu Hai - Hoang Dieu - Vinh Khanh.',
      detail_stop2_title: '2. Main highlights (19:00 - 21:00)',
      detail_stop2_desc: 'Visit core spots like Oc Oanh, Oc Vu, and Thao Oc - the busiest and most vibrant period.',
      detail_stop3_title: '3. Final stop (22:00)',
      detail_stop3_desc: 'Slow down at Be Oc or enjoy dessert before ending the journey.',
      detail_gallery_title: 'Featured Images',
      detail_gallery_card1_title: 'Daytime / early setup scene',
      detail_gallery_card1_desc: 'Street view before full nightlife begins, when shops start setting up.',
      detail_gallery_card2_title: 'Vibrant nightlife activity',
      detail_gallery_card2_desc: 'Night scene with neon signage and busy visitor traffic.',
      detail_note_label: 'Note:',
      detail_note_desc: 'This page structure is optimized for PWA to reduce reload size via asset caching on mobile devices.',
      route_label_visitor_type: 'Visitor type',
      route_placeholder_visitor_type: 'Example: family, couple, friends group',
      route_label_budget: 'Budget',
      route_option_any: 'Any',
      route_option_low: 'Low',
      route_option_medium: 'Medium',
      route_option_high: 'High',
      route_label_start_time: 'Start time',
      route_label_guest_count: 'Guest count',
      route_label_preferences: 'Preferences / requests',
      route_placeholder_preferences: 'Example: likes snails, late-night, comfortable seating, affordable prices',
      route_label_must_try: 'Must-try dish',
      route_placeholder_must_try: 'Example: coconut stir-fried snails, salt roasted crab, grilled scallops',
      route_summary_label: 'Summary:',
      route_strategy_label: 'Strategy:',
      route_source_label: 'Generated by:',
      audio_label_location: 'Select content (POI)',
      audio_label_template: 'Or use saved narration template',
      audio_label_target_language: 'Target language',
      audio_label_speaking_rate: 'Speaking rate',
      audio_label_custom_text: 'Custom content (script override)',
      audio_placeholder_custom_text: 'Leave blank to use POI default content...',
      audio_result_title: 'Audio Result',
      audio_result_translated_label: 'Translated text:',
      audio_result_voice_label: 'Voice:',
      audio_result_download_cta: 'Download / Open New Tab',
      card_address: 'Address',
      card_hours: 'Opening Hours',
      card_highlight: 'Highlights',
      btn_narrate_private: 'Listen now',
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
      map_status_no_check: 'Could not verify offline vector style. OSM fallback is active.',
      assistant_section_title: 'Travel Q&A Assistant',
      assistant_question_placeholder: 'Ask about food spots, opening hours, route ideas, or what to try...',
      assistant_ask_btn: 'Ask Assistant',
      assistant_thinking: 'Thinking...',
      assistant_answer_label: 'Answer:',
      assistant_suggested_label: 'Suggested places:',
      assistant_error: 'Cannot fetch an answer right now.'
    },
    fr: {
      nav_overview: 'Apercu', nav_food: 'Cuisine', nav_map: 'Carte', nav_routing: 'Itineraire IA', nav_audio: 'Audio TTS', nav_detail: 'Details', nav_admin: 'Admin', label_language: 'Langue',
      home_modules_title: 'Explorer les modules', food_hero_title: 'Lieux et plats', food_hero_subtitle: 'Liste complete des lieux et plats phares de la rue Vinh Khanh.', food_section_title: 'Lieux et plats (POI)',
      map_hero_title: 'Carte de la rue', map_hero_subtitle: 'Carte des lieux culinaires remarquables de Vinh Khanh.', map_section_title: 'GPS et Pack Carte (Simulation)',
      routing_hero_title: 'Itineraire IA', routing_hero_subtitle: 'Creer un parcours culinaire selon profil, heure et budget.', routing_section_title: 'Suggestions IA',
      audio_hero_title: 'Audio TTS', audio_hero_subtitle: 'Generer une narration audio selon langue et voix.', audio_section_title: 'Narration automatique',
      detail_hero_title: 'Vinh Khanh la nuit', detail_hero_subtitle: 'Ambiance nocturne, sons de cuisine et parfums marins au coeur de Saigon.',
      card_address: 'Adresse', card_hours: 'Horaires', card_highlight: 'Points forts', btn_narrate_private: 'Ecouter maintenant',
      template_none: 'Sans modele', narration_failed: 'Echec de generation de narration.', audio_open_file: 'Ouvrir le fichier audio',
      state_generating: 'Generation...', state_suggesting: 'Suggestion...', btn_audio_tts: 'Creer Audio TTS', btn_route_suggest: 'Suggere un itineraire',
      route_why_visit: 'Pourquoi visiter', route_try_dish: 'Plat recommande', route_best_time: 'Meilleur moment',
      map_status_no_style: 'Style vectoriel hors ligne introuvable. Fond OSM de secours active.', map_status_has_style: 'Style vectoriel hors ligne actif.',
      map_status_no_api: 'Impossible de charger les POI depuis l API.', map_status_no_maplibre: 'MapLibre indisponible. Carte locale de secours active.',
      map_status_no_webgl: 'WebGL indisponible. Carte locale de secours active.', map_status_no_check: 'Verification du style hors ligne impossible. OSM de secours active.',
      assistant_section_title: 'Assistant Q&R voyage',
      assistant_question_placeholder: 'Posez une question sur les lieux, horaires, plats ou itineraire...',
      assistant_ask_btn: 'Poser une question',
      assistant_thinking: 'Analyse en cours...',
      assistant_answer_label: 'Reponse :',
      assistant_suggested_label: 'Lieux suggeres :',
      assistant_error: 'Impossible de repondre pour le moment.'
    },
    ja: {
      nav_overview: '概要', nav_food: 'グルメ', nav_map: '地図', nav_routing: 'AIルート', nav_audio: '音声TTS', nav_detail: '詳細', nav_admin: '管理', label_language: '言語',
      home_modules_title: 'モジュールを見る', food_hero_title: '人気店と料理', food_hero_subtitle: 'ビンカイン通りの注目スポット一覧。', food_section_title: 'スポット一覧 (POI)',
      map_hero_title: 'ストリートマップ', map_hero_subtitle: 'ビンカインの注目飲食スポットを表示します。', map_section_title: 'GPS & マップパック (シミュレーション)',
      routing_hero_title: 'AIルーティング', routing_hero_subtitle: '客層、時間、予算に応じた食べ歩きルートを作成。', routing_section_title: 'AIおすすめルート',
      audio_hero_title: '音声TTS', audio_hero_subtitle: '言語と音声を選んでナレーションを生成。', audio_section_title: '自動ナレーション',
      detail_hero_title: '夜のビンカイン', detail_hero_subtitle: '夜の活気、調理の音、海鮮の香りが広がる体験。',
      card_address: '住所', card_hours: '営業時間', card_highlight: '見どころ', btn_narrate_private: '今すぐ再生',
      template_none: 'テンプレートなし', narration_failed: 'ナレーション生成に失敗しました。', audio_open_file: '音声ファイルを開く',
      state_generating: '生成中...', state_suggesting: '提案中...', btn_audio_tts: '音声TTSを作成', btn_route_suggest: 'ルート提案',
      route_why_visit: '立ち寄る理由', route_try_dish: 'おすすめ料理', route_best_time: 'おすすめ時間',
      map_status_no_style: 'オフラインベクタースタイルが見つかりません。OSM代替地図を使用中。', map_status_has_style: 'オフラインベクタースタイルを使用中。',
      map_status_no_api: 'APIからPOIを取得できません。', map_status_no_maplibre: 'MapLibreを読み込めません。代替地図を表示します。',
      map_status_no_webgl: 'WebGL地図を初期化できません。代替地図を表示します。', map_status_no_check: 'オフラインスタイルの確認に失敗。OSM代替地図を使用中。',
      assistant_section_title: '旅行Q&Aアシスタント',
      assistant_question_placeholder: '料理、営業時間、おすすめルートなどを質問してください...',
      assistant_ask_btn: '質問する',
      assistant_thinking: '回答を作成中...',
      assistant_answer_label: '回答:',
      assistant_suggested_label: 'おすすめスポット:',
      assistant_error: '現在回答できません。'
    },
    ko: {
      nav_overview: '개요', nav_food: '맛집', nav_map: '지도', nav_routing: 'AI 경로', nav_audio: '오디오 TTS', nav_detail: '상세', nav_admin: '관리', label_language: '언어',
      home_offline_banner: '오프라인 모드(PWA) 지원 - 네트워크 없이도 콘텐츠를 볼 수 있습니다.',
      home_stats_spots: '샘플 장소 / 메뉴',
      home_stats_languages: '지원 언어',
      home_overview_title: '프로젝트 개요',
      home_overview_card1_title: '1. 야간 거리 체험',
      home_overview_card1_desc: '빈칸 거리는 늦은 시간까지 활기찬 식도락 분위기로 유명하며, 해산물과 야시장 감성이 특징입니다.',
      home_overview_card2_title: '2. 다양한 음식',
      home_overview_card2_desc: '분짜, 달팽이 요리, 디저트, 음료까지 다양한 메뉴로 풍부한 미식 경험을 제공합니다.',
      home_overview_card3_title: '3. 스마트 관광',
      home_overview_card3_desc: '각 장소의 QR을 통해 여러 언어 내레이션을 듣고 오프라인 정보도 쉽게 확인할 수 있습니다.',
      home_featured_title: '빠른 내레이션 추천 장소',
      home_loading_places: '장소 목록 로딩 중...',
      home_module_food_title: '맛집',
      home_module_food_desc: '대표 장소와 메뉴, 주소 정보를 한눈에 확인하세요.',
      home_module_food_cta: '맛집 페이지 열기',
      home_module_map_title: '지도',
      home_module_map_desc: '빈칸 거리 주요 포인트의 분포를 지도에서 확인하세요.',
      home_module_map_cta: '지도 열기',
      home_module_route_title: 'AI 경로',
      home_module_route_desc: '방문 유형과 예산에 맞춘 경로를 추천합니다.',
      home_module_route_cta: 'AI 경로 열기',
      home_module_audio_title: '오디오 TTS',
      home_module_audio_desc: '다국어 내레이션을 생성하고 즉시 재생합니다.',
      home_module_audio_cta: '오디오 TTS 열기',
      home_module_detail_title: '상세',
      home_module_detail_desc: '거리 체험 타임라인과 주요 이미지를 확인하세요.',
      home_module_detail_cta: '상세 열기',
      home_footer_desc: '언어 번역과 음성 내레이션 자동화를 위한 시스템으로, API와 정적 UI를 결합한 PWA 구조입니다.',
      home_modules_title: '모듈 보기', food_hero_title: '맛집 & 장소', food_hero_subtitle: '빈칸 거리의 대표 맛집 목록입니다.', food_section_title: '맛집/장소 목록 (POI)',
      map_hero_title: '거리 지도', map_hero_subtitle: '빈칸 거리의 주요 음식점을 지도에서 확인하세요.', map_section_title: 'GPS & 맵 팩 (시뮬레이션)',
      routing_hero_title: 'AI 라우팅', routing_hero_subtitle: '방문 유형, 시간, 예산에 맞는 미식 경로를 생성합니다.', routing_section_title: 'AI 경로 추천',
      audio_hero_title: '오디오 TTS', audio_hero_subtitle: '언어와 음성을 선택해 내레이션을 생성하세요.', audio_section_title: '자동 내레이션',
      detail_hero_title: '밤의 빈칸', detail_hero_subtitle: '밤거리의 분위기와 해산물 향이 어우러진 생생한 경험.',
      detail_cta_audio: '오디오 내레이션 듣기',
      detail_cta_food: '맛집 목록 보기',
      detail_timeline_title: '추천 체험 타임라인',
      detail_stop1_title: '1. 1군에서 이동 (18:00)',
      detail_stop1_desc: '동커이 - 똔득탕 - 카인호이 다리 - 도안느하이 - 호앙지에우 - 빈칸 경로를 추천합니다.',
      detail_stop2_title: '2. 핵심 방문 시간 (19:00 - 21:00)',
      detail_stop2_desc: '옥오안, 옥부, 타오옥 같은 핵심 매장을 방문하면 가장 활기찬 분위기를 느낄 수 있습니다.',
      detail_stop3_title: '3. 마지막 코스 (22:00)',
      detail_stop3_desc: '베옥 또는 디저트 매장에서 여유롭게 일정을 마무리하세요.',
      detail_gallery_title: '대표 이미지',
      detail_gallery_card1_title: '낮/초저녁 분위기',
      detail_gallery_card1_desc: '야간 피크 전 거리와 매장 준비 분위기입니다.',
      detail_gallery_card2_title: '야간 피크 분위기',
      detail_gallery_card2_desc: '네온 간판과 방문객으로 붐비는 밤거리 장면입니다.',
      detail_note_label: '참고:',
      detail_note_desc: '이 페이지는 모바일에서 자산 캐시를 활용하도록 PWA 최적화가 적용되어 있습니다.',
      route_label_visitor_type: '방문 유형',
      route_placeholder_visitor_type: '예: 가족, 커플, 친구 모임',
      route_label_budget: '예산',
      route_option_any: '상관없음',
      route_option_low: '낮음',
      route_option_medium: '중간',
      route_option_high: '높음',
      route_label_start_time: '시작 시간',
      route_label_guest_count: '인원 수',
      route_label_preferences: '선호 / 요청사항',
      route_placeholder_preferences: '예: 달팽이 요리 선호, 늦은 시간, 편한 좌석, 합리적 가격',
      route_label_must_try: '꼭 먹고 싶은 메뉴',
      route_placeholder_must_try: '예: 코코넛 볶음 달팽이, 소금게, 가리비 구이',
      route_summary_label: '요약:',
      route_strategy_label: '전략:',
      route_source_label: '생성 출처:',
      audio_label_location: '콘텐츠 선택 (POI)',
      audio_label_template: '저장된 내레이션 템플릿 사용',
      audio_label_target_language: '대상 언어',
      audio_label_speaking_rate: '재생 속도',
      audio_label_custom_text: '사용자 텍스트 (스크립트 덮어쓰기)',
      audio_placeholder_custom_text: '비워두면 POI 기본 내용을 사용합니다...',
      audio_result_title: '오디오 결과',
      audio_result_translated_label: '번역 텍스트:',
      audio_result_voice_label: '음성(Voice):',
      audio_result_download_cta: '다운로드 / 새 탭 열기',
      card_address: '주소', card_hours: '영업 시간', card_highlight: '포인트', btn_narrate_private: '바로 듣기',
      template_none: '템플릿 없음', narration_failed: '내레이션 생성에 실패했습니다.', audio_open_file: '오디오 파일 열기',
      state_generating: '생성 중...', state_suggesting: '추천 중...', btn_audio_tts: '오디오 TTS 생성', btn_route_suggest: '경로 추천',
      route_why_visit: '방문 이유', route_try_dish: '추천 메뉴', route_best_time: '추천 시간',
      map_status_no_style: '오프라인 벡터 스타일을 찾지 못했습니다. OSM 대체 지도를 사용합니다.', map_status_has_style: '오프라인 벡터 스타일을 사용 중입니다.',
      map_status_no_api: 'API에서 POI 데이터를 불러오지 못했습니다.', map_status_no_maplibre: 'MapLibre 로드 실패. 대체 지도를 표시합니다.',
      map_status_no_webgl: 'WebGL 지도 초기화 실패. 대체 지도를 표시합니다.', map_status_no_check: '오프라인 스타일 확인 실패. OSM 대체 지도를 사용합니다.',
      assistant_section_title: '여행 Q&A 도우미',
      assistant_question_placeholder: '맛집, 영업시간, 추천 동선 등에 대해 질문해 보세요...',
      assistant_ask_btn: '질문하기',
      assistant_thinking: '답변 생성 중...',
      assistant_answer_label: '답변:',
      assistant_suggested_label: '추천 장소:',
      assistant_error: '지금은 답변을 가져올 수 없습니다.'
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
      'Tạo thuyết minh cho món này': 'Listen to narration for this place',
      'Nghe thuyết minh cho món này': 'Listen to narration for this place',
      'Nghe thuyết minh điểm này': 'Play narration for this stop',
      'Dẫn đường': 'Navigate',
      'Đã đến điểm này': 'Mark as arrived',
      'Bỏ qua điểm này': 'Skip this stop',
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
      'Tạo thuyết minh cho món này': 'Ecouter la narration de ce lieu',
      'Nghe thuyết minh cho món này': 'Ecouter la narration de ce lieu',
      'Nghe thuyết minh điểm này': 'Lire la narration de cet arret',
      'Dẫn đường': 'Guider',
      'Đã đến điểm này': 'Marquer comme arrive',
      'Bỏ qua điểm này': 'Ignorer cet arret',
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
      'Tạo thuyết minh cho món này': 'この場所のナレーションを再生',
      'Nghe thuyết minh cho món này': 'この場所のナレーションを再生',
      'Nghe thuyết minh điểm này': 'この停留所を再生',
      'Dẫn đường': '案内する',
      'Đã đến điểm này': '到着済みにする',
      'Bỏ qua điểm này': 'この停留所をスキップ',
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
      'Tạo thuyết minh cho món này': '이 장소 내레이션 듣기',
      'Nghe thuyết minh cho món này': '이 장소 내레이션 듣기',
      'Nghe thuyết minh điểm này': '이 정류장 내레이션 재생',
      'Dẫn đường': '길안내',
      'Đã đến điểm này': '도착 처리',
      'Bỏ qua điểm này': '이 정류장 건너뛰기',
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
    return messages[selected]?.[key] ?? messages.en[key] ?? messages.vi[key] ?? key;
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
