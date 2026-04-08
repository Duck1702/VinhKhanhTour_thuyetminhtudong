(function () {
  const englishFallback = {
    'oc-oanh': {
      name: 'Oc Oanh', category: 'Snails & Seafood', shortIntro: 'The most famous snail restaurant on Vinh Khanh street.', bestTime: 'After 18:00',
      highlight: 'Salt chili fragrant snails, grilled octopus, grilled chicken feet',
      descriptionVi: 'Always crowded at night thanks to fresh seafood and bold flavors.'
    },
    'oc-thao': {
      name: 'Oc Thao', category: 'Snails & Seafood', shortIntro: 'Long-running seafood stop with a spacious dining area.', bestTime: '19:00 - 23:00',
      highlight: 'Coconut stir-fried snails, Thai steamed clams, razor-snail fried noodles',
      descriptionVi: 'Known for a diverse menu and stable taste over many years.'
    },
    'oc-dao-2': {
      name: 'Oc Dao 2', category: 'Snails & Seafood', shortIntro: 'A branch of a well-known Saigon snail brand.', bestTime: '18:00 - 21:00',
      highlight: 'Butter-fried squid teeth, razor clams with morning glory',
      descriptionVi: 'Popular for buttery garlic-style stir-fried seafood dishes.'
    },
    'oc-vu': {
      name: 'Oc Vu', category: 'Snails & Seafood', shortIntro: 'A famous district icon for tamarind and salted egg sauces.', bestTime: '19:00 - 23:30',
      highlight: 'Tamarind snails, salted egg snails',
      descriptionVi: 'Well known for signature dipping sauce and rich flavors.'
    },
    'oc-sau-no': {
      name: 'Oc Sau No', category: 'Snails & Seafood', shortIntro: 'Spacious and fast service, suitable for groups.', bestTime: '18:30 - 22:30',
      highlight: 'Stir-fried snails with morning glory, grilled blood cockles',
      descriptionVi: 'A familiar local gathering place with hearty dishes.'
    },
    'be-oc': {
      name: 'Be Oc', category: 'Snails & Seafood', shortIntro: 'A budget-friendly alley spot with steady quality.', bestTime: '18:00 - 22:00',
      highlight: 'Coconut snails, garlic-burnt blood cockles',
      descriptionVi: 'Great value option for a casual seafood night.'
    },
    'alo-quan-seafood-beer': {
      name: 'Alo Quan - Seafood & Beer', category: 'Snails & Seafood', shortIntro: 'A youthful seafood-and-beer concept.', bestTime: '20:00 - 01:00',
      highlight: 'Crawfish, chili-salt grilled seafood',
      descriptionVi: 'Lively late-night atmosphere, ideal for friend groups.'
    },
    'chilli-bbq-hotpot': {
      name: 'Chilli BBQ Hotpot', category: 'Hotpot & Grill', shortIntro: 'Late-night hotpot and grill venue with energetic vibe.', bestTime: '20:00 - 01:00',
      highlight: '24-flavor oysters, salted-egg grilled beef block',
      descriptionVi: 'Good for long evening sessions and group dining.'
    },
    'the-gioi-bo': {
      name: 'Beef World', category: 'Hotpot & Grill', shortIntro: 'Higher-end beef-focused restaurant on Vinh Khanh.', bestTime: '18:00 - 22:00',
      highlight: 'Wagyu A5, gold-leaf beef, Mongolian hotpot',
      descriptionVi: 'Suitable for premium beef tasting experiences.'
    },
    'a-fat-hot-pot': {
      name: 'A Fat Hot Pot', category: 'Hotpot & Grill', shortIntro: 'Hong Kong-style hotpot venue with neon decor.', bestTime: '19:00 - 00:00',
      highlight: 'Dual-pot Hong Kong hotpot, assorted hotpot balls',
      descriptionVi: 'A good check-in place with rich hotpot options.'
    },
    'ot-xiem-quan': {
      name: 'Ot Xiem Quan', category: 'Hotpot & Grill', shortIntro: 'Spacious place with spicy signature seasoning.', bestTime: '19:00 - 23:30',
      highlight: 'Shaking beef, tamarind crab, chili grilled squid',
      descriptionVi: 'Great for spicy food lovers and social dinners.'
    },
    'lang-quan': {
      name: 'Lang Quan', category: 'Hotpot & Grill', shortIntro: 'Popular casual drinking-food venue with bold dishes.', bestTime: '19:00 - 23:00',
      highlight: 'Crispy fried pork leg, offal stew, duck tongue claypot',
      descriptionVi: 'A familiar stop for local-style evening gatherings.'
    },
    'quan-hoa': {
      name: 'Quan Hoa', category: 'Hotpot & Grill', shortIntro: 'Table-side grilled dishes with cozy charcoal setup.', bestTime: '19:00 - 23:00',
      highlight: 'Tile grill, chili-salt grilled udder',
      descriptionVi: 'Warm, close-up grilling style for groups and families.'
    },
    'sushi-ko': {
      name: 'Sushi Ko', category: 'Specialties & Single Dishes', shortIntro: 'Affordable street-style sushi with stable quality.', bestTime: '11:30 - 20:30',
      highlight: 'Salmon sashimi, grilled shrimp maki, seaweed salad',
      descriptionVi: 'A refreshing non-seafood-grill option in the area.'
    },
    'bun-ca-di-tu': {
      name: 'Bun Ca Chau Doc Di Tu', category: 'Specialties & Single Dishes', shortIntro: 'A light soup stop with Mekong-style flavor.', bestTime: 'Morning - Afternoon',
      highlight: 'Fish noodle soup, fermented fish noodle soup',
      descriptionVi: 'Good break option between heavier grilled dishes.'
    },
    'bun-thit-nuong-co-nga': {
      name: 'Bun Thit Nuong Co Nga', category: 'Specialties & Single Dishes', shortIntro: 'Well-known breakfast/lunch spot with fragrant grilled meat.', bestTime: '07:00 - 11:00',
      highlight: 'Grilled pork noodle bowl, grilled spring rolls',
      descriptionVi: 'Fast, tasty and filling choice for daytime meals.'
    },
    'an-an-quan': {
      name: 'An An Quan', category: 'Specialties & Single Dishes', shortIntro: 'Vietnamese menu with friendly service.', bestTime: '18:00 - 22:30',
      highlight: 'Seafood fried rice, salted fried chicken cartilage',
      descriptionVi: 'A versatile place for family and friend groups.'
    },
    'nem-nuong-que-nha': {
      name: 'Nem Nuong Que Nha', category: 'Specialties & Single Dishes', shortIntro: 'Specialized grilled fermented pork rolls.', bestTime: '16:30 - 20:30',
      highlight: 'Nha Trang-style grilled pork rolls',
      descriptionVi: 'Loved for peanut dipping sauce and fresh herbs.'
    },
    'bun-bo-hue-14b': {
      name: 'Bun Bo Hue 14B', category: 'Specialties & Single Dishes', shortIntro: 'Reliable spicy beef noodle soup with rich broth.', bestTime: 'Morning - Afternoon',
      highlight: 'Beef noodle soup with tendon and brisket',
      descriptionVi: 'A trusted local noodle soup stop on this street.'
    },
    'lau-met-nuong-79k': {
      name: 'Lau Met Nuong 79k', category: 'Specialties & Single Dishes', shortIntro: 'Student-friendly hotpot and grill combo pricing.', bestTime: '18:00 - 22:00',
      highlight: 'Mixed hotpot trays, fixed-price grilled items',
      descriptionVi: 'Budget-friendly and suitable for larger groups.'
    }
  };

  const localizedCategoryByLang = {
    fr: {
      'snails & seafood': 'Escargots et fruits de mer',
      'hotpot & grill': 'Fondue et grillades',
      'specialties & single dishes': 'Specialites et plats individuels'
    },
    ja: {
      'snails & seafood': '貝料理・海鮮',
      'hotpot & grill': '鍋・焼き物',
      'specialties & single dishes': '名物・一品料理'
    },
    ko: {
      'snails & seafood': '달팽이·해산물',
      'hotpot & grill': '전골·구이',
      'specialties & single dishes': '대표·단품 요리'
    }
  };

  const localizedHighlightByLang = {
    fr: {
      'snails & seafood': 'Fruits de mer frais, plats signatures et sauces maison.',
      'hotpot & grill': 'Fondue chaude, grillades et assaisonnements riches.',
      'specialties & single dishes': 'Plats locaux recommandes, portions genereuses et gout equilibre.'
    },
    ja: {
      'snails & seafood': '新鮮な海鮮、看板メニュー、特製ソース。',
      'hotpot & grill': '鍋料理、焼き物、香り高い味付け。',
      'specialties & single dishes': '地元のおすすめ一品、満足感のある量、バランスの良い味。'
    },
    ko: {
      'snails & seafood': '신선한 해산물, 대표 메뉴, 특제 소스.',
      'hotpot & grill': '따뜻한 전골, 구이 메뉴, 풍부한 양념.',
      'specialties & single dishes': '현지 추천 단품, 든든한 양, 균형 잡힌 맛.'
    }
  };

  function normalizeCategoryKey(value) {
    return String(value || '').trim().toLowerCase();
  }

  function localizeBestTime(bestTime, lang) {
    const value = String(bestTime || '').trim();
    if (!value) {
      return value;
    }

    if (lang === 'fr') {
      return value
        .replaceAll('Morning - Afternoon', 'Matin - Apres-midi')
        .replaceAll('Late evening', 'Soiree tardive')
        .replaceAll('After ', 'Apres ')
        .replaceAll(' onward', ' et plus tard');
    }

    if (lang === 'ja') {
      return value
        .replaceAll('Morning - Afternoon', '午前〜午後')
        .replaceAll('Late evening', '夜遅く')
        .replaceAll('After ', '')
        .replaceAll(' onward', '以降')
        .replaceAll('After', '以降');
    }

    if (lang === 'ko') {
      return value
        .replaceAll('Morning - Afternoon', '오전 - 오후')
        .replaceAll('Late evening', '늦은 저녁')
        .replaceAll('After ', '')
        .replaceAll(' onward', ' 이후')
        .replaceAll('After', '이후');
    }

    return value;
  }

  function buildLocalizedFallback(lang) {
    const categoryMap = localizedCategoryByLang[lang] || {};
    const highlightMap = localizedHighlightByLang[lang] || {};
    const result = {};

    Object.entries(englishFallback).forEach(([id, item]) => {
      const categoryKey = normalizeCategoryKey(item.category);
      const category = categoryMap[categoryKey] || item.category;
      const highlight = highlightMap[categoryKey] || item.highlight;

      let shortIntro = item.shortIntro;
      let description = item.descriptionVi;

      if (lang === 'fr') {
        shortIntro = `${item.name} est une adresse tres appreciee de Vinh Khanh pour decouvrir ${category.toLowerCase()}.`;
        description = `Ce lieu est recommande pour une experience culinaire locale avec une ambiance animee en soiree.`;
      }

      if (lang === 'ja') {
        shortIntro = `${item.name}は、ビンカイン通りで${category}を楽しめる人気スポットです。`;
        description = `夜の活気ある雰囲気の中で、ローカルグルメを体験できるおすすめの店舗です。`;
      }

      if (lang === 'ko') {
        shortIntro = `${item.name}은(는) 빈칸 거리에서 ${category}을(를) 즐기기 좋은 인기 매장입니다.`;
        description = `활기찬 저녁 분위기 속에서 현지 미식을 경험하기 좋은 추천 장소입니다.`;
      }

      result[id] = {
        ...item,
        category,
        shortIntro,
        bestTime: localizeBestTime(item.bestTime, lang),
        highlight,
        descriptionVi: description
      };
    });

    return result;
  }

  const localizedFallbackByLang = {
    fr: buildLocalizedFallback('fr'),
    ja: buildLocalizedFallback('ja'),
    ko: buildLocalizedFallback('ko')
  };

  const locationTranslations = {
    en: {
      'oc-oanh': {
        name: 'Oc Oanh',
        category: 'Seafood / Snails',
        shortIntro: 'A signature stop on Vinh Khanh street, great for starting a night food route.',
        bestTime: 'After 18:00',
        highlight: 'Salt-roasted crab, grilled shrimp, spicy snail sauce',
        descriptionVi: 'Oc Oanh is one of the most iconic seafood stops on Vinh Khanh street, known for strong flavors and lively night atmosphere.'
      },
      'oc-vu': {
        name: 'Oc Vu',
        category: 'Seafood / Snails',
        shortIntro: 'Popular for late-night dining and fresh seafood preparation.',
        bestTime: '20:00 onward',
        highlight: 'Grilled scallops with egg, chili salt garlic snails, salt-roasted crab claws',
        descriptionVi: 'Oc Vu is known for preserving seafood freshness and serving flavor-packed dishes ideal for long night food journeys.'
      },
      'thao-oc': {
        name: 'Thao Oc',
        category: 'Seafood / Snails',
        shortIntro: 'From a small cart to a busy seafood destination with affordable prices.',
        bestTime: '19:00 - 23:30',
        highlight: 'Snails, clams, shellfish, squid, shrimp and seafood hotpot',
        descriptionVi: 'Thao Oc has grown into a favorite place for both locals and visitors, featuring rich seafood dishes and night market vibes.'
      },
      'oc-sau-no': {
        name: 'Oc Sau No',
        category: 'Seafood / Snails',
        shortIntro: 'Spacious setting for groups and family night meals.',
        bestTime: 'After 18:30',
        highlight: 'Salted egg snail sauce, Thai steamed clams, grilled coconut snails',
        descriptionVi: 'Oc Sau No is a common group choice with spacious seating and rich seafood combinations for long evening meals.'
      },
      'be-oc': {
        name: 'Be Oc',
        category: 'Seafood / Snails',
        shortIntro: 'A relaxed final stop for lighter seafood dishes late at night.',
        bestTime: 'Late evening',
        highlight: 'Fresh snails, balanced flavors, budget-friendly menu',
        descriptionVi: 'Be Oc is ideal for ending the route with lighter but flavorful dishes in a comfortable setting.'
      },
      'lang-quan': {
        name: 'Lang Quan',
        category: 'Seafood / Beer Bites',
        shortIntro: 'A value-friendly stop if you want many small dishes with friends.',
        bestTime: 'Lunch or late evening',
        highlight: 'Fresh seafood, creative beer bites, affordable pricing',
        descriptionVi: 'Lang Quan serves accessible seafood with varied menu options, suitable for groups who want to sample multiple dishes.'
      },
      'chilli-quan': {
        name: 'Chilli Quan',
        category: 'Hotpot / Grill',
        shortIntro: 'Perfect for groups who want a fuller meal with hotpot and grilled items.',
        bestTime: '19:00 - 22:30',
        highlight: 'Thai hotpot, spicy chicken feet, grilled dishes',
        descriptionVi: 'Chilli Quan is a good break from snail-focused stops, offering hotpot and grilled dishes for group dining.'
      },
      'the-gioi-bo': {
        name: 'Beef World',
        category: 'Beef / Hot Dishes',
        shortIntro: 'For visitors who prefer beef dishes beyond seafood.',
        bestTime: 'After 17:30',
        highlight: 'Korean-Japanese style beef, beef hotpot, grilled beef cuts',
        descriptionVi: 'Beef World is suitable for guests wanting red-meat options, with Korean-Japanese inspired flavors and group-friendly portions.'
      }
    },
    fr: {
      'oc-oanh': {
        name: 'Oc Oanh',
        category: 'Fruits de mer / Escargots',
        shortIntro: 'Une adresse emblematique de Vinh Khanh, parfaite pour debuter la soiree.',
        bestTime: 'Apres 18:00',
        highlight: 'Crabe grille au sel, crevettes grillees, sauce escargot epicee',
        descriptionVi: 'Oc Oanh est un lieu phare de Vinh Khanh, connu pour ses saveurs prononcees et son ambiance animee la nuit.'
      },
      'oc-vu': {
        name: 'Oc Vu',
        category: 'Fruits de mer / Escargots',
        shortIntro: 'Tres apprecie pour les sorties nocturnes et ses produits frais.',
        bestTime: 'Des 20:00',
        highlight: 'Coquilles grillees a l oeuf, escargots ail-piment-sel, pinces de crabe au sel',
        descriptionVi: 'Oc Vu est reconnu pour la fraicheur des ingredients et ses plats riches en gout pour les longues soirees.'
      },
      'thao-oc': {
        name: 'Thao Oc',
        category: 'Fruits de mer / Escargots',
        shortIntro: 'D un petit stand a une adresse populaire, avec des prix accessibles.',
        bestTime: '19:00 - 23:30',
        highlight: 'Escargots, palourdes, coquillages, calamars, crevettes, fondue de fruits de mer',
        descriptionVi: 'Thao Oc attire habitants et visiteurs grace a ses plats varies et son ambiance de marche nocturne.'
      },
      'oc-sau-no': {
        name: 'Oc Sau No',
        category: 'Fruits de mer / Escargots',
        shortIntro: 'Un espace confortable pour les groupes et les familles.',
        bestTime: 'Apres 18:30',
        highlight: 'Sauce escargot jaune d oeuf sale, palourdes vapeur thai, escargots coco grilles',
        descriptionVi: 'Oc Sau No est un choix frequent pour les groupes grace a son espace et ses combinaisons de fruits de mer.'
      },
      'be-oc': {
        name: 'Be Oc',
        category: 'Fruits de mer / Escargots',
        shortIntro: 'Une halte detendue pour finir la soiree avec des saveurs legeres.',
        bestTime: 'Fin de soiree',
        highlight: 'Escargots frais, assaisonnement equilibre, menu economique',
        descriptionVi: 'Be Oc convient pour cloturer l itineraire dans une ambiance calme et gourmande.'
      },
      'lang-quan': {
        name: 'Lang Quan',
        category: 'Fruits de mer / Plats a partager',
        shortIntro: 'Bon rapport qualite-prix pour deguster plusieurs plats entre amis.',
        bestTime: 'Midi ou soiree tardive',
        highlight: 'Fruits de mer frais, plats varies, prix abordables',
        descriptionVi: 'Lang Quan propose une carte diversifiee, ideale pour les groupes qui veulent tout gouter.'
      },
      'chilli-quan': {
        name: 'Chilli Quan',
        category: 'Fondue / Grillades',
        shortIntro: 'Ideal pour les groupes qui veulent une experience plus complete.',
        bestTime: '19:00 - 22:30',
        highlight: 'Fondue thai, pieds de poulet epices, grillades',
        descriptionVi: 'Chilli Quan apporte une alternative aux escargots avec des plats copieux et conviviaux.'
      },
      'the-gioi-bo': {
        name: 'Monde du Boeuf',
        category: 'Boeuf / Plats chauds',
        shortIntro: 'Une option parfaite pour les visiteurs qui preferent la viande rouge.',
        bestTime: 'Apres 17:30',
        highlight: 'Boeuf style coreen-japonais, fondue boeuf, boeuf grille',
        descriptionVi: 'Monde du Boeuf convient aux groupes cherchant des saveurs viandees en complement des fruits de mer.'
      }
    },
    ja: {
      'oc-oanh': {
        name: 'オック・オアイン',
        category: 'シーフード / 貝料理',
        shortIntro: 'ビンカイン通りの代表店で、夜の食べ歩きの最初に最適です。',
        bestTime: '18:00以降',
        highlight: '塩焼きカニ、焼きエビ、ピリ辛貝ソース',
        descriptionVi: 'オック・オアインは力強い味と活気ある夜の雰囲気で有名な人気店です。'
      },
      'oc-vu': {
        name: 'オック・ヴー',
        category: 'シーフード / 貝料理',
        shortIntro: '深夜まで賑わう人気店で、新鮮な海鮮が魅力です。',
        bestTime: '20:00以降',
        highlight: 'ホタテ卵焼き、にんにく唐辛子塩の貝、塩焼きカニ爪',
        descriptionVi: '鮮度を大切にした調理で、夜の食巡りに合う濃い味わいを提供します。'
      },
      'thao-oc': {
        name: 'タオ・オック',
        category: 'シーフード / 貝料理',
        shortIntro: '屋台から成長した人気店で、手頃な価格が特徴です。',
        bestTime: '19:00 - 23:30',
        highlight: '貝、ハマグリ、イカ、エビ、海鮮鍋',
        descriptionVi: '地元客にも旅行者にも愛される、夜市の空気感を楽しめる一軒です。'
      },
      'oc-sau-no': {
        name: 'オック・サウ・ノー',
        category: 'シーフード / 貝料理',
        shortIntro: 'グループや家族向けの広い座席がある店です。',
        bestTime: '18:30以降',
        highlight: '塩卵ソース貝、タイ風蒸しハマグリ、ココナッツ焼き貝',
        descriptionVi: '広々とした空間で、複数人でもゆったり楽しめる定番スポットです。'
      },
      'be-oc': {
        name: 'ベー・オック',
        category: 'シーフード / 貝料理',
        shortIntro: '夜の締めにぴったりな、落ち着いた軽めの一軒です。',
        bestTime: '夜遅め',
        highlight: '新鮮な貝、バランスの良い味、手頃な価格',
        descriptionVi: 'ルートの最後を穏やかに締めくくるのに向いたお店です。'
      },
      'lang-quan': {
        name: 'ラン・クアン',
        category: 'シーフード / おつまみ',
        shortIntro: '友人同士で色々な小皿を楽しみたい時に最適です。',
        bestTime: '昼または夜遅め',
        highlight: '新鮮な海鮮、多彩なおつまみ、手頃な価格',
        descriptionVi: '複数メニューを少しずつ試したいグループに向いています。'
      },
      'chilli-quan': {
        name: 'チリ・クアン',
        category: '鍋 / 焼き物',
        shortIntro: '鍋と焼き物でしっかり食べたいグループ向け。',
        bestTime: '19:00 - 22:30',
        highlight: 'タイ鍋、辛味チキンフィート、焼き料理',
        descriptionVi: '貝料理中心の流れに変化をつける、食べ応えのある店です。'
      },
      'the-gioi-bo': {
        name: 'ビーフワールド',
        category: '牛肉 / 温かい料理',
        shortIntro: 'シーフード以外で牛肉料理を楽しみたい方に。',
        bestTime: '17:30以降',
        highlight: '韓日スタイル牛肉、牛鍋、牛焼き',
        descriptionVi: '赤身料理を求める来訪者に合う、グループ利用しやすい店舗です。'
      }
    },
    ko: {
      'oc-oanh': {
        name: '옥 오안',
        category: '해산물 / 달팽이요리',
        shortIntro: '빈칸 거리의 대표 매장으로 야간 미식 코스 시작에 좋습니다.',
        bestTime: '18:00 이후',
        highlight: '소금구이 게, 구운 새우, 매콤 달팽이 소스',
        descriptionVi: '옥 오안은 강한 풍미와 활기찬 야간 분위기로 유명한 대표 해산물 매장입니다.'
      },
      'oc-vu': {
        name: '옥 부',
        category: '해산물 / 달팽이요리',
        shortIntro: '늦은 시간까지 인기 있는 매장으로 신선한 해산물이 강점입니다.',
        bestTime: '20:00 이후',
        highlight: '가리비 계란구이, 마늘 고추 소금 달팽이, 소금구이 게 집게',
        descriptionVi: '신선도를 살린 조리와 진한 맛으로 야간 식도락 코스에 잘 어울립니다.'
      },
      'thao-oc': {
        name: '타오 옥',
        category: '해산물 / 달팽이요리',
        shortIntro: '작은 노점에서 성장한 인기 매장으로 가격이 합리적입니다.',
        bestTime: '19:00 - 23:30',
        highlight: '달팽이, 조개, 오징어, 새우, 해산물 전골',
        descriptionVi: '현지인과 여행객 모두가 찾는 곳으로 밤거리 분위기를 느낄 수 있습니다.'
      },
      'oc-sau-no': {
        name: '옥 싸우 노',
        category: '해산물 / 달팽이요리',
        shortIntro: '단체와 가족 방문에 적합한 넓은 공간이 장점입니다.',
        bestTime: '18:30 이후',
        highlight: '소금달걀 소스 달팽이, 태국식 찐조개, 코코넛 구이 달팽이',
        descriptionVi: '넓은 좌석과 다양한 조합으로 단체 저녁 식사에 자주 선택됩니다.'
      },
      'be-oc': {
        name: '베 옥',
        category: '해산물 / 달팽이요리',
        shortIntro: '밤 코스 마무리에 가볍게 즐기기 좋은 편안한 매장입니다.',
        bestTime: '늦은 저녁',
        highlight: '신선한 달팽이, 균형 잡힌 간, 합리적 가격',
        descriptionVi: '편안한 분위기에서 코스를 마무리하기 좋은 선택입니다.'
      },
      'lang-quan': {
        name: '랑 꾸안',
        category: '해산물 / 안주류',
        shortIntro: '친구들과 여러 소접시를 즐기기에 좋은 가성비 매장입니다.',
        bestTime: '점심 또는 늦은 저녁',
        highlight: '신선한 해산물, 다양한 안주, 합리적 가격',
        descriptionVi: '여러 메뉴를 나눠 맛보고 싶은 그룹 방문에 잘 맞습니다.'
      },
      'chilli-quan': {
        name: '칠리 꾸안',
        category: '전골 / 구이',
        shortIntro: '전골과 구이로 든든한 식사를 원하는 그룹에게 적합합니다.',
        bestTime: '19:00 - 22:30',
        highlight: '태국식 전골, 매운 닭발, 구이 메뉴',
        descriptionVi: '달팽이 중심 코스에 변화를 주는 든든한 메뉴를 제공합니다.'
      },
      'the-gioi-bo': {
        name: '비프 월드',
        category: '소고기 / 따뜻한 요리',
        shortIntro: '해산물 외에 소고기 메뉴를 선호하는 방문객에게 추천합니다.',
        bestTime: '17:30 이후',
        highlight: '한일 스타일 소고기, 소고기 전골, 구이',
        descriptionVi: '붉은 고기 메뉴를 찾는 고객에게 적합한 단체 친화형 매장입니다.'
      }
    }
  };

  function localizeLocationData(location, lang) {
    if (!location || !lang || lang === 'vi') {
      return location;
    }

    const translated = locationTranslations[lang]?.[location.id]
      || localizedFallbackByLang[lang]?.[location.id]
      || (lang === 'en' ? englishFallback[location.id] : null)
      || null;
    if (!translated) {
      return location;
    }

    return {
      ...location,
      ...translated
    };
  }

  window.localizeLocationData = localizeLocationData;
})();
