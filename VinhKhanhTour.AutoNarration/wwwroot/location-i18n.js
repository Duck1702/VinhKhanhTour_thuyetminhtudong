(function () {
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

    const translated = locationTranslations[lang]?.[location.id];
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
