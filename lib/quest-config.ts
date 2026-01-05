// Quest Configuration: 7 Themes + 20 Vocabulary Topics

// Theme Configuration Interface
export interface ThemeConfig {
  id: string;
  name: {
    ko: string;
    mn: string;
    ru: string;
    vi: string;
  };
  icon: string;
  colorScheme: {
    primary: string;
    secondary: string;
    gradient: string;
    bgGradient: string;
  };
  settings: {
    locations: string[];
    characters: string[];
    objects: string[];
    atmosphere: string;
  };
  imageStyle: string;
}

// Vocabulary Item Interface
export interface VocabularyItem {
  korean: string;
  romanization: string;
  translation: {
    mn: string;
    ru: string;
    vi: string;
  };
}

// Topic Configuration Interface
export interface TopicConfig {
  id: string;
  name: {
    ko: string;
    mn: string;
    ru: string;
    vi: string;
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpRequired: number;
  icon: string;
  vocabulary: VocabularyItem[];
}

// ============================================
// THEMES (7)
// ============================================

export const THEMES: Record<string, ThemeConfig> = {
  medieval: {
    id: 'medieval',
    name: {
      ko: '중세 판타지',
      mn: 'Дундад зууны уран зөгнөлт',
      ru: 'Средневековое фэнтези',
      vi: 'Trung cổ giả tưởng'
    },
    icon: 'Castle',
    colorScheme: {
      primary: 'purple-600',
      secondary: 'indigo-500',
      gradient: 'from-purple-500 to-indigo-600',
      bgGradient: 'from-purple-900/20 to-indigo-900/20'
    },
    settings: {
      locations: ['성', '마을', '숲', '던전', '탑', '광장'],
      characters: ['기사', '마법사', '용', '요정', '대장장이', '왕'],
      objects: ['검', '방패', '마법책', '물약', '보물', '열쇠'],
      atmosphere: '판타지 중세 세계, 성과 용, 마법사와 기사들'
    },
    imageStyle: 'fantasy medieval, magical, colorful anime style, castles and dragons'
  },

  modern: {
    id: 'modern',
    name: {
      ko: '현대',
      mn: 'Орчин үе',
      ru: 'Современность',
      vi: 'Hiện đại'
    },
    icon: 'Building2',
    colorScheme: {
      primary: 'blue-600',
      secondary: 'cyan-500',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-900/20 to-cyan-900/20'
    },
    settings: {
      locations: ['학교', '카페', '쇼핑몰', '공원', '지하철', '병원'],
      characters: ['학생', '선생님', '직원', '경찰', '의사', '친구'],
      objects: ['휴대폰', '노트북', '커피', '가방', '버스카드', '교과서'],
      atmosphere: '현대 한국 도시 생활, 학교, 카페, 지하철'
    },
    imageStyle: 'modern Korean city, slice of life anime style, urban setting'
  },

  ancient: {
    id: 'ancient',
    name: {
      ko: '고대',
      mn: 'Эртний',
      ru: 'Древний мир',
      vi: 'Cổ đại'
    },
    icon: 'Landmark',
    colorScheme: {
      primary: 'amber-600',
      secondary: 'orange-500',
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-900/20 to-orange-900/20'
    },
    settings: {
      locations: ['궁전', '신전', '피라미드', '시장', '항구', '도서관'],
      characters: ['왕', '제사장', '상인', '전사', '학자', '파라오'],
      objects: ['두루마리', '금화', '항아리', '검', '보석', '왕관'],
      atmosphere: '고대 문명, 이집트, 그리스, 로마, 조선'
    },
    imageStyle: 'ancient civilization, historical, warm tones anime style, pyramids and temples'
  },

  primitive: {
    id: 'primitive',
    name: {
      ko: '원시',
      mn: 'Эртний үе',
      ru: 'Первобытный мир',
      vi: 'Nguyên thủy'
    },
    icon: 'Flame',
    colorScheme: {
      primary: 'orange-600',
      secondary: 'amber-700',
      gradient: 'from-orange-500 to-amber-700',
      bgGradient: 'from-orange-900/20 to-amber-900/20'
    },
    settings: {
      locations: ['동굴', '숲', '강', '평원', '산', '호수'],
      characters: ['사냥꾼', '부족장', '주술사', '아이', '동물', '현자'],
      objects: ['창', '불', '가죽', '돌도끼', '열매', '뼈'],
      atmosphere: '선사시대 수렵채집 부족, 자연과 생존'
    },
    imageStyle: 'prehistoric, cave painting inspired, earthy tones anime style, nature and tribes'
  },

  western: {
    id: 'western',
    name: {
      ko: '서부',
      mn: 'Баруун',
      ru: 'Дикий Запад',
      vi: 'Miền Tây hoang dã'
    },
    icon: 'Sun',
    colorScheme: {
      primary: 'yellow-600',
      secondary: 'red-600',
      gradient: 'from-yellow-500 to-red-600',
      bgGradient: 'from-yellow-900/20 to-red-900/20'
    },
    settings: {
      locations: ['마을', '술집', '은행', '보안관 사무실', '농장', '광산'],
      characters: ['카우보이', '보안관', '술집주인', '농부', '원주민', '무법자'],
      objects: ['권총', '말', '모자', '밧줄', '금', '마차'],
      atmosphere: '미국 서부 개척 시대, 카우보이와 황야'
    },
    imageStyle: 'wild west, cowboy, sunset colors anime style, desert and frontier towns'
  },

  eastern: {
    id: 'eastern',
    name: {
      ko: '동양',
      mn: 'Дорнод',
      ru: 'Восточный мир',
      vi: 'Phương Đông'
    },
    icon: 'Cherry',
    colorScheme: {
      primary: 'red-600',
      secondary: 'pink-500',
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-900/20 to-pink-900/20'
    },
    settings: {
      locations: ['도장', '절', '정원', '시장', '산', '대나무숲'],
      characters: ['무사', '승려', '상인', '대사', '닌자', '선비'],
      objects: ['검', '부채', '차', '두루마리', '등불', '한복'],
      atmosphere: '전통 동아시아, 한국, 중국, 일본의 절과 무술'
    },
    imageStyle: 'traditional east asian, hanbok, anime style with ink painting elements, temples and martial arts'
  },

  space: {
    id: 'space',
    name: {
      ko: '우주',
      mn: 'Сансар',
      ru: 'Космос',
      vi: 'Vũ trụ'
    },
    icon: 'Rocket',
    colorScheme: {
      primary: 'violet-600',
      secondary: 'blue-500',
      gradient: 'from-violet-600 to-blue-500',
      bgGradient: 'from-violet-900/20 to-blue-900/20'
    },
    settings: {
      locations: ['우주선', '우주정거장', '행성', '달기지', '소행성', '외계행성'],
      characters: ['우주비행사', '로봇', '외계인', '선장', '과학자', 'AI'],
      objects: ['우주복', '레이저', '산소탱크', '통신기', '우주식량', '홀로그램'],
      atmosphere: 'SF 우주 탐험, 우주선과 외계 행성'
    },
    imageStyle: 'sci-fi space, futuristic, neon lights anime style, spaceships and planets'
  }
};

// ============================================
// VOCABULARY TOPICS (20)
// ============================================

export const TOPICS: TopicConfig[] = [
  // ============================================
  // BEGINNER (0-150 XP) - 9 topics
  // ============================================
  {
    id: 'greetings',
    name: { ko: '인사', mn: 'Мэндчилгээ', ru: 'Приветствия', vi: 'Chào hỏi' },
    difficulty: 'beginner',
    xpRequired: 0,
    icon: 'Hand',
    vocabulary: [
      { korean: '안녕하세요', romanization: 'annyeonghaseyo', translation: { mn: 'Сайн байна уу', ru: 'Здравствуйте', vi: 'Xin chào' } },
      { korean: '감사합니다', romanization: 'gamsahamnida', translation: { mn: 'Баярлалаа', ru: 'Спасибо', vi: 'Cảm ơn' } },
      { korean: '안녕히 가세요', romanization: 'annyeonghi gaseyo', translation: { mn: 'Баяртай', ru: 'До свидания', vi: 'Tạm biệt' } },
      { korean: '죄송합니다', romanization: 'joesonghamnida', translation: { mn: 'Уучлаарай', ru: 'Извините', vi: 'Xin lỗi' } },
      { korean: '네', romanization: 'ne', translation: { mn: 'Тийм', ru: 'Да', vi: 'Vâng' } },
      { korean: '아니요', romanization: 'aniyo', translation: { mn: 'Үгүй', ru: 'Нет', vi: 'Không' } },
      { korean: '만나서 반갑습니다', romanization: 'mannaseo bangapseumnida', translation: { mn: 'Танилцахад таатай байна', ru: 'Приятно познакомиться', vi: 'Rất vui được gặp bạn' } },
      { korean: '잘 지내세요?', romanization: 'jal jinaeseyo?', translation: { mn: 'Сайн байна уу?', ru: 'Как дела?', vi: 'Bạn có khỏe không?' } },
    ]
  },
  {
    id: 'numbers',
    name: { ko: '숫자', mn: 'Тоо', ru: 'Числа', vi: 'Số' },
    difficulty: 'beginner',
    xpRequired: 0,
    icon: 'Hash',
    vocabulary: [
      { korean: '하나', romanization: 'hana', translation: { mn: 'нэг', ru: 'один', vi: 'một' } },
      { korean: '둘', romanization: 'dul', translation: { mn: 'хоёр', ru: 'два', vi: 'hai' } },
      { korean: '셋', romanization: 'set', translation: { mn: 'гурав', ru: 'три', vi: 'ba' } },
      { korean: '넷', romanization: 'net', translation: { mn: 'дөрөв', ru: 'четыре', vi: 'bốn' } },
      { korean: '다섯', romanization: 'daseot', translation: { mn: 'тав', ru: 'пять', vi: 'năm' } },
      { korean: '일', romanization: 'il', translation: { mn: 'нэг (Хятад)', ru: 'один (кит.)', vi: 'một (Hán)' } },
      { korean: '십', romanization: 'sip', translation: { mn: 'арав', ru: 'десять', vi: 'mười' } },
      { korean: '백', romanization: 'baek', translation: { mn: 'зуу', ru: 'сто', vi: 'trăm' } },
    ]
  },
  {
    id: 'colors',
    name: { ko: '색깔', mn: 'Өнгө', ru: 'Цвета', vi: 'Màu sắc' },
    difficulty: 'beginner',
    xpRequired: 50,
    icon: 'Palette',
    vocabulary: [
      { korean: '빨간색', romanization: 'ppalgansaek', translation: { mn: 'улаан', ru: 'красный', vi: 'màu đỏ' } },
      { korean: '파란색', romanization: 'paransaek', translation: { mn: 'цэнхэр', ru: 'синий', vi: 'màu xanh dương' } },
      { korean: '노란색', romanization: 'noransaek', translation: { mn: 'шар', ru: 'жёлтый', vi: 'màu vàng' } },
      { korean: '초록색', romanization: 'choroksaek', translation: { mn: 'ногоон', ru: 'зелёный', vi: 'màu xanh lá' } },
      { korean: '검은색', romanization: 'geomeunsaek', translation: { mn: 'хар', ru: 'чёрный', vi: 'màu đen' } },
      { korean: '흰색', romanization: 'huinsaek', translation: { mn: 'цагаан', ru: 'белый', vi: 'màu trắng' } },
      { korean: '분홍색', romanization: 'bunhongsaek', translation: { mn: 'ягаан', ru: 'розовый', vi: 'màu hồng' } },
      { korean: '보라색', romanization: 'borasaek', translation: { mn: 'нил ягаан', ru: 'фиолетовый', vi: 'màu tím' } },
    ]
  },
  {
    id: 'family',
    name: { ko: '가족', mn: 'Гэр бүл', ru: 'Семья', vi: 'Gia đình' },
    difficulty: 'beginner',
    xpRequired: 50,
    icon: 'Users',
    vocabulary: [
      { korean: '아버지', romanization: 'abeoji', translation: { mn: 'аав', ru: 'отец', vi: 'bố' } },
      { korean: '어머니', romanization: 'eomeoni', translation: { mn: 'ээж', ru: 'мать', vi: 'mẹ' } },
      { korean: '형', romanization: 'hyeong', translation: { mn: 'ах (эрэгтэй)', ru: 'старший брат (м)', vi: 'anh trai' } },
      { korean: '누나', romanization: 'nuna', translation: { mn: 'эгч (эрэгтэй)', ru: 'старшая сестра (м)', vi: 'chị gái' } },
      { korean: '동생', romanization: 'dongsaeng', translation: { mn: 'дүү', ru: 'младший брат/сестра', vi: 'em' } },
      { korean: '할아버지', romanization: 'harabeoji', translation: { mn: 'өвөө', ru: 'дедушка', vi: 'ông' } },
      { korean: '할머니', romanization: 'halmeoni', translation: { mn: 'эмээ', ru: 'бабушка', vi: 'bà' } },
      { korean: '가족', romanization: 'gajok', translation: { mn: 'гэр бүл', ru: 'семья', vi: 'gia đình' } },
    ]
  },
  {
    id: 'food',
    name: { ko: '음식', mn: 'Хоол', ru: 'Еда', vi: 'Đồ ăn' },
    difficulty: 'beginner',
    xpRequired: 100,
    icon: 'UtensilsCrossed',
    vocabulary: [
      { korean: '밥', romanization: 'bap', translation: { mn: 'будаа', ru: 'рис', vi: 'cơm' } },
      { korean: '물', romanization: 'mul', translation: { mn: 'ус', ru: 'вода', vi: 'nước' } },
      { korean: '고기', romanization: 'gogi', translation: { mn: 'мах', ru: 'мясо', vi: 'thịt' } },
      { korean: '생선', romanization: 'saengseon', translation: { mn: 'загас', ru: 'рыба', vi: 'cá' } },
      { korean: '과일', romanization: 'gwail', translation: { mn: 'жимс', ru: 'фрукты', vi: 'trái cây' } },
      { korean: '야채', romanization: 'yachae', translation: { mn: 'хүнсний ногоо', ru: 'овощи', vi: 'rau' } },
      { korean: '김치', romanization: 'gimchi', translation: { mn: 'кимчи', ru: 'кимчи', vi: 'kim chi' } },
      { korean: '라면', romanization: 'ramyeon', translation: { mn: 'рамён', ru: 'рамэн', vi: 'mì ramen' } },
    ]
  },
  {
    id: 'school',
    name: { ko: '학교', mn: 'Сургууль', ru: 'Школа', vi: 'Trường học' },
    difficulty: 'beginner',
    xpRequired: 100,
    icon: 'GraduationCap',
    vocabulary: [
      { korean: '학교', romanization: 'hakgyo', translation: { mn: 'сургууль', ru: 'школа', vi: 'trường học' } },
      { korean: '선생님', romanization: 'seonsaengnim', translation: { mn: 'багш', ru: 'учитель', vi: 'giáo viên' } },
      { korean: '학생', romanization: 'haksaeng', translation: { mn: 'оюутан', ru: 'ученик', vi: 'học sinh' } },
      { korean: '교실', romanization: 'gyosil', translation: { mn: 'анги', ru: 'класс', vi: 'lớp học' } },
      { korean: '책', romanization: 'chaek', translation: { mn: 'ном', ru: 'книга', vi: 'sách' } },
      { korean: '연필', romanization: 'yeonpil', translation: { mn: 'харандаа', ru: 'карандаш', vi: 'bút chì' } },
      { korean: '시험', romanization: 'siheom', translation: { mn: 'шалгалт', ru: 'экзамен', vi: 'kỳ thi' } },
      { korean: '숙제', romanization: 'sukje', translation: { mn: 'гэрийн даалгавар', ru: 'домашнее задание', vi: 'bài tập về nhà' } },
    ]
  },
  {
    id: 'time',
    name: { ko: '시간', mn: 'Цаг', ru: 'Время', vi: 'Thời gian' },
    difficulty: 'beginner',
    xpRequired: 100,
    icon: 'Clock',
    vocabulary: [
      { korean: '오늘', romanization: 'oneul', translation: { mn: 'өнөөдөр', ru: 'сегодня', vi: 'hôm nay' } },
      { korean: '내일', romanization: 'naeil', translation: { mn: 'маргааш', ru: 'завтра', vi: 'ngày mai' } },
      { korean: '어제', romanization: 'eoje', translation: { mn: 'өчигдөр', ru: 'вчера', vi: 'hôm qua' } },
      { korean: '아침', romanization: 'achim', translation: { mn: 'өглөө', ru: 'утро', vi: 'sáng' } },
      { korean: '저녁', romanization: 'jeonyeok', translation: { mn: 'орой', ru: 'вечер', vi: 'tối' } },
      { korean: '시', romanization: 'si', translation: { mn: 'цаг', ru: 'час', vi: 'giờ' } },
      { korean: '분', romanization: 'bun', translation: { mn: 'минут', ru: 'минута', vi: 'phút' } },
      { korean: '요일', romanization: 'yoil', translation: { mn: 'гараг', ru: 'день недели', vi: 'ngày trong tuần' } },
    ]
  },
  {
    id: 'clothes',
    name: { ko: '옷', mn: 'Хувцас', ru: 'Одежда', vi: 'Quần áo' },
    difficulty: 'beginner',
    xpRequired: 150,
    icon: 'Shirt',
    vocabulary: [
      { korean: '옷', romanization: 'ot', translation: { mn: 'хувцас', ru: 'одежда', vi: 'quần áo' } },
      { korean: '바지', romanization: 'baji', translation: { mn: 'өмд', ru: 'брюки', vi: 'quần' } },
      { korean: '치마', romanization: 'chima', translation: { mn: 'юбка', ru: 'юбка', vi: 'váy' } },
      { korean: '신발', romanization: 'sinbal', translation: { mn: 'гутал', ru: 'обувь', vi: 'giày' } },
      { korean: '모자', romanization: 'moja', translation: { mn: 'малгай', ru: 'шапка', vi: 'mũ' } },
      { korean: '양말', romanization: 'yangmal', translation: { mn: 'оймс', ru: 'носки', vi: 'tất' } },
      { korean: '외투', romanization: 'oetu', translation: { mn: 'гадуур хувцас', ru: 'пальто', vi: 'áo khoác' } },
      { korean: '교복', romanization: 'gyobok', translation: { mn: 'дүрэмт хувцас', ru: 'школьная форма', vi: 'đồng phục' } },
    ]
  },
  {
    id: 'body',
    name: { ko: '신체', mn: 'Бие', ru: 'Тело', vi: 'Cơ thể' },
    difficulty: 'beginner',
    xpRequired: 150,
    icon: 'User',
    vocabulary: [
      { korean: '머리', romanization: 'meori', translation: { mn: 'толгой', ru: 'голова', vi: 'đầu' } },
      { korean: '눈', romanization: 'nun', translation: { mn: 'нүд', ru: 'глаз', vi: 'mắt' } },
      { korean: '코', romanization: 'ko', translation: { mn: 'хамар', ru: 'нос', vi: 'mũi' } },
      { korean: '입', romanization: 'ip', translation: { mn: 'ам', ru: 'рот', vi: 'miệng' } },
      { korean: '귀', romanization: 'gwi', translation: { mn: 'чих', ru: 'ухо', vi: 'tai' } },
      { korean: '손', romanization: 'son', translation: { mn: 'гар', ru: 'рука', vi: 'tay' } },
      { korean: '발', romanization: 'bal', translation: { mn: 'хөл', ru: 'нога', vi: 'chân' } },
      { korean: '배', romanization: 'bae', translation: { mn: 'гэдэс', ru: 'живот', vi: 'bụng' } },
    ]
  },

  // ============================================
  // INTERMEDIATE (200-400 XP) - 9 topics
  // ============================================
  {
    id: 'shopping',
    name: { ko: '쇼핑', mn: 'Дэлгүүр', ru: 'Шоппинг', vi: 'Mua sắm' },
    difficulty: 'intermediate',
    xpRequired: 200,
    icon: 'ShoppingBag',
    vocabulary: [
      { korean: '가게', romanization: 'gage', translation: { mn: 'дэлгүүр', ru: 'магазин', vi: 'cửa hàng' } },
      { korean: '돈', romanization: 'don', translation: { mn: 'мөнгө', ru: 'деньги', vi: 'tiền' } },
      { korean: '얼마예요?', romanization: 'eolmayeyo?', translation: { mn: 'хэд вэ?', ru: 'сколько стоит?', vi: 'bao nhiêu?' } },
      { korean: '비싸요', romanization: 'bissayo', translation: { mn: 'үнэтэй', ru: 'дорого', vi: 'đắt' } },
      { korean: '싸요', romanization: 'ssayo', translation: { mn: 'хямд', ru: 'дёшево', vi: 'rẻ' } },
      { korean: '카드', romanization: 'kadeu', translation: { mn: 'карт', ru: 'карта', vi: 'thẻ' } },
      { korean: '현금', romanization: 'hyeongeum', translation: { mn: 'бэлэн мөнгө', ru: 'наличные', vi: 'tiền mặt' } },
      { korean: '영수증', romanization: 'yeongsujeung', translation: { mn: 'баримт', ru: 'чек', vi: 'hóa đơn' } },
    ]
  },
  {
    id: 'transport',
    name: { ko: '교통', mn: 'Тээвэр', ru: 'Транспорт', vi: 'Giao thông' },
    difficulty: 'intermediate',
    xpRequired: 200,
    icon: 'Bus',
    vocabulary: [
      { korean: '버스', romanization: 'beoseu', translation: { mn: 'автобус', ru: 'автобус', vi: 'xe buýt' } },
      { korean: '지하철', romanization: 'jihacheol', translation: { mn: 'метро', ru: 'метро', vi: 'tàu điện ngầm' } },
      { korean: '택시', romanization: 'taeksi', translation: { mn: 'такси', ru: 'такси', vi: 'taxi' } },
      { korean: '기차', romanization: 'gicha', translation: { mn: 'галт тэрэг', ru: 'поезд', vi: 'tàu hỏa' } },
      { korean: '비행기', romanization: 'bihaenggi', translation: { mn: 'онгоц', ru: 'самолёт', vi: 'máy bay' } },
      { korean: '역', romanization: 'yeok', translation: { mn: 'станц', ru: 'станция', vi: 'ga' } },
      { korean: '정류장', romanization: 'jeongnyujang', translation: { mn: 'буудал', ru: 'остановка', vi: 'trạm' } },
      { korean: '표', romanization: 'pyo', translation: { mn: 'билет', ru: 'билет', vi: 'vé' } },
    ]
  },
  {
    id: 'directions',
    name: { ko: '길찾기', mn: 'Чиглэл', ru: 'Направления', vi: 'Chỉ đường' },
    difficulty: 'intermediate',
    xpRequired: 250,
    icon: 'Compass',
    vocabulary: [
      { korean: '왼쪽', romanization: 'oenjjok', translation: { mn: 'зүүн', ru: 'влево', vi: 'bên trái' } },
      { korean: '오른쪽', romanization: 'oreunjjok', translation: { mn: 'баруун', ru: 'вправо', vi: 'bên phải' } },
      { korean: '직진', romanization: 'jikjin', translation: { mn: 'шулуун', ru: 'прямо', vi: 'thẳng' } },
      { korean: '앞', romanization: 'ap', translation: { mn: 'урд', ru: 'впереди', vi: 'phía trước' } },
      { korean: '뒤', romanization: 'dwi', translation: { mn: 'ард', ru: 'позади', vi: 'phía sau' } },
      { korean: '옆', romanization: 'yeop', translation: { mn: 'хажуу', ru: 'рядом', vi: 'bên cạnh' } },
      { korean: '어디', romanization: 'eodi', translation: { mn: 'хаана', ru: 'где', vi: 'ở đâu' } },
      { korean: '지도', romanization: 'jido', translation: { mn: 'газрын зураг', ru: 'карта', vi: 'bản đồ' } },
    ]
  },
  {
    id: 'jobs',
    name: { ko: '직업', mn: 'Мэргэжил', ru: 'Профессии', vi: 'Nghề nghiệp' },
    difficulty: 'intermediate',
    xpRequired: 250,
    icon: 'Briefcase',
    vocabulary: [
      { korean: '의사', romanization: 'uisa', translation: { mn: 'эмч', ru: 'врач', vi: 'bác sĩ' } },
      { korean: '간호사', romanization: 'ganhosa', translation: { mn: 'сувилагч', ru: 'медсестра', vi: 'y tá' } },
      { korean: '경찰', romanization: 'gyeongchal', translation: { mn: 'цагдаа', ru: 'полицейский', vi: 'cảnh sát' } },
      { korean: '요리사', romanization: 'yorisa', translation: { mn: 'тогооч', ru: 'повар', vi: 'đầu bếp' } },
      { korean: '회사원', romanization: 'hoesawon', translation: { mn: 'ажилтан', ru: 'служащий', vi: 'nhân viên' } },
      { korean: '가수', romanization: 'gasu', translation: { mn: 'дуучин', ru: 'певец', vi: 'ca sĩ' } },
      { korean: '배우', romanization: 'baeu', translation: { mn: 'жүжигчин', ru: 'актёр', vi: 'diễn viên' } },
      { korean: '운동선수', romanization: 'undongseonsu', translation: { mn: 'тамирчин', ru: 'спортсмен', vi: 'vận động viên' } },
    ]
  },
  {
    id: 'hobbies',
    name: { ko: '취미', mn: 'Хобби', ru: 'Хобби', vi: 'Sở thích' },
    difficulty: 'intermediate',
    xpRequired: 300,
    icon: 'Gamepad2',
    vocabulary: [
      { korean: '영화', romanization: 'yeonghwa', translation: { mn: 'кино', ru: 'фильм', vi: 'phim' } },
      { korean: '음악', romanization: 'eumak', translation: { mn: 'хөгжим', ru: 'музыка', vi: 'âm nhạc' } },
      { korean: '운동', romanization: 'undong', translation: { mn: 'спорт', ru: 'спорт', vi: 'thể thao' } },
      { korean: '독서', romanization: 'dokseo', translation: { mn: 'уншлага', ru: 'чтение', vi: 'đọc sách' } },
      { korean: '게임', romanization: 'geim', translation: { mn: 'тоглоом', ru: 'игра', vi: 'trò chơi' } },
      { korean: '여행', romanization: 'yeohaeng', translation: { mn: 'аялал', ru: 'путешествие', vi: 'du lịch' } },
      { korean: '요리', romanization: 'yori', translation: { mn: 'хоол хийх', ru: 'готовка', vi: 'nấu ăn' } },
      { korean: '그림', romanization: 'geurim', translation: { mn: 'зураг', ru: 'рисование', vi: 'vẽ' } },
    ]
  },
  {
    id: 'technology',
    name: { ko: '기술', mn: 'Технологи', ru: 'Технологии', vi: 'Công nghệ' },
    difficulty: 'intermediate',
    xpRequired: 300,
    icon: 'Smartphone',
    vocabulary: [
      { korean: '컴퓨터', romanization: 'keompyuteo', translation: { mn: 'компьютер', ru: 'компьютер', vi: 'máy tính' } },
      { korean: '휴대폰', romanization: 'hyudaepon', translation: { mn: 'гар утас', ru: 'телефон', vi: 'điện thoại' } },
      { korean: '인터넷', romanization: 'inteonet', translation: { mn: 'интернет', ru: 'интернет', vi: 'internet' } },
      { korean: '이메일', romanization: 'imeil', translation: { mn: 'имэйл', ru: 'почта', vi: 'email' } },
      { korean: '비밀번호', romanization: 'bimilbeonho', translation: { mn: 'нууц үг', ru: 'пароль', vi: 'mật khẩu' } },
      { korean: '앱', romanization: 'aep', translation: { mn: 'апп', ru: 'приложение', vi: 'ứng dụng' } },
      { korean: '와이파이', romanization: 'waipai', translation: { mn: 'wifi', ru: 'Wi-Fi', vi: 'wifi' } },
      { korean: '충전', romanization: 'chungjeon', translation: { mn: 'цэнэглэх', ru: 'зарядка', vi: 'sạc' } },
    ]
  },
  {
    id: 'weather',
    name: { ko: '날씨', mn: 'Цаг агаар', ru: 'Погода', vi: 'Thời tiết' },
    difficulty: 'intermediate',
    xpRequired: 350,
    icon: 'Cloud',
    vocabulary: [
      { korean: '날씨', romanization: 'nalssi', translation: { mn: 'цаг агаар', ru: 'погода', vi: 'thời tiết' } },
      { korean: '비', romanization: 'bi', translation: { mn: 'бороо', ru: 'дождь', vi: 'mưa' } },
      { korean: '눈', romanization: 'nun', translation: { mn: 'цас', ru: 'снег', vi: 'tuyết' } },
      { korean: '덥다', romanization: 'deopda', translation: { mn: 'халуун', ru: 'жарко', vi: 'nóng' } },
      { korean: '춥다', romanization: 'chupda', translation: { mn: 'хүйтэн', ru: 'холодно', vi: 'lạnh' } },
      { korean: '맑다', romanization: 'makda', translation: { mn: 'цэлмэг', ru: 'ясно', vi: 'trong' } },
      { korean: '흐리다', romanization: 'heurida', translation: { mn: 'үүлэрхэг', ru: 'пасмурно', vi: 'u ám' } },
      { korean: '바람', romanization: 'baram', translation: { mn: 'салхи', ru: 'ветер', vi: 'gió' } },
    ]
  },
  {
    id: 'emotions',
    name: { ko: '감정', mn: 'Сэтгэл хөдлөл', ru: 'Эмоции', vi: 'Cảm xúc' },
    difficulty: 'intermediate',
    xpRequired: 350,
    icon: 'Heart',
    vocabulary: [
      { korean: '기쁘다', romanization: 'gippeuda', translation: { mn: 'баяртай', ru: 'радостно', vi: 'vui' } },
      { korean: '슬프다', romanization: 'seulpeuda', translation: { mn: 'гунигтай', ru: 'грустно', vi: 'buồn' } },
      { korean: '화나다', romanization: 'hwanada', translation: { mn: 'уурлах', ru: 'злиться', vi: 'giận' } },
      { korean: '무섭다', romanization: 'museopda', translation: { mn: 'айх', ru: 'страшно', vi: 'sợ' } },
      { korean: '피곤하다', romanization: 'pigonhada', translation: { mn: 'ядрах', ru: 'устал', vi: 'mệt' } },
      { korean: '행복하다', romanization: 'haengbokhada', translation: { mn: 'аз жаргалтай', ru: 'счастлив', vi: 'hạnh phúc' } },
      { korean: '걱정하다', romanization: 'geokjeonghada', translation: { mn: 'санаа зовох', ru: 'волноваться', vi: 'lo lắng' } },
      { korean: '사랑하다', romanization: 'saranghada', translation: { mn: 'хайрлах', ru: 'любить', vi: 'yêu' } },
    ]
  },
  {
    id: 'health',
    name: { ko: '건강', mn: 'Эрүүл мэнд', ru: 'Здоровье', vi: 'Sức khỏe' },
    difficulty: 'intermediate',
    xpRequired: 400,
    icon: 'Stethoscope',
    vocabulary: [
      { korean: '병원', romanization: 'byeongwon', translation: { mn: 'эмнэлэг', ru: 'больница', vi: 'bệnh viện' } },
      { korean: '약', romanization: 'yak', translation: { mn: 'эм', ru: 'лекарство', vi: 'thuốc' } },
      { korean: '아프다', romanization: 'apeuda', translation: { mn: 'өвдөх', ru: 'болит', vi: 'đau' } },
      { korean: '열', romanization: 'yeol', translation: { mn: 'халуурах', ru: 'температура', vi: 'sốt' } },
      { korean: '감기', romanization: 'gamgi', translation: { mn: 'ханиад', ru: 'простуда', vi: 'cảm cúm' } },
      { korean: '두통', romanization: 'dutong', translation: { mn: 'толгой өвдөлт', ru: 'головная боль', vi: 'đau đầu' } },
      { korean: '기침', romanization: 'gichim', translation: { mn: 'ханиалга', ru: 'кашель', vi: 'ho' } },
      { korean: '건강하다', romanization: 'geonganghada', translation: { mn: 'эрүүл', ru: 'здоровый', vi: 'khỏe mạnh' } },
    ]
  },

  // ============================================
  // ADVANCED (500+ XP) - 2 topics
  // ============================================
  {
    id: 'expressions',
    name: { ko: '표현/속어', mn: 'Хэллэг', ru: 'Выражения', vi: 'Thành ngữ' },
    difficulty: 'advanced',
    xpRequired: 500,
    icon: 'MessageCircle',
    vocabulary: [
      { korean: '대박', romanization: 'daebak', translation: { mn: 'гайхалтай', ru: 'круто', vi: 'tuyệt vời' } },
      { korean: '헐', romanization: 'heol', translation: { mn: 'юу?', ru: 'ого', vi: 'ôi trời' } },
      { korean: '짱', romanization: 'jjang', translation: { mn: 'шилдэг', ru: 'лучший', vi: 'nhất' } },
      { korean: '멘붕', romanization: 'menbung', translation: { mn: 'толгой эргэх', ru: 'шок', vi: 'sốc' } },
      { korean: '극혐', romanization: 'geukhyeom', translation: { mn: 'маш муу', ru: 'отвратительно', vi: 'ghê tởm' } },
      { korean: '레알', romanization: 'real', translation: { mn: 'үнэхээр', ru: 'реально', vi: 'thật sự' } },
      { korean: '꿀잼', romanization: 'kkuljaem', translation: { mn: 'маш сонирхолтой', ru: 'супер интересно', vi: 'cực vui' } },
      { korean: '노잼', romanization: 'nojaem', translation: { mn: 'уйтгартай', ru: 'скучно', vi: 'nhạt' } },
    ]
  },
  {
    id: 'idioms',
    name: { ko: '사자성어', mn: 'Зүйр үг', ru: 'Идиомы', vi: 'Thành ngữ Hán' },
    difficulty: 'advanced',
    xpRequired: 700,
    icon: 'BookText',
    vocabulary: [
      { korean: '일석이조', romanization: 'ilseogijo', translation: { mn: 'нэг чулуугаар хоёр шувуу', ru: 'одним выстрелом двух зайцев', vi: 'một mũi tên trúng hai đích' } },
      { korean: '우공이산', romanization: 'ugongisan', translation: { mn: 'хичээл зүтгэл бол амжилтын түлхүүр', ru: 'усердие побеждает всё', vi: 'kiên trì sẽ thành công' } },
      { korean: '자업자득', romanization: 'jaeobjakdeuk', translation: { mn: 'өөрийн үйлдлийн үр дагавар', ru: 'сам виноват', vi: 'tự làm tự chịu' } },
      { korean: '동고동락', romanization: 'donggodongnak', translation: { mn: 'хамт зовж хамт баярлах', ru: 'вместе в горе и радости', vi: 'cùng vui cùng khổ' } },
      { korean: '유유상종', romanization: 'yuyusangjong', translation: { mn: 'ижил төстэй нь хамтдаа', ru: 'рыбак рыбака видит издалека', vi: 'ngưu tầm ngưu mã tầm mã' } },
      { korean: '천고마비', romanization: 'cheongomabi', translation: { mn: 'намрын цэлмэг тэнгэр', ru: 'ясная осень', vi: 'trời thu trong xanh' } },
      { korean: '백문불여일견', romanization: 'baekmunburyeoilgyeon', translation: { mn: 'зуун удаа сонсохоос нэг удаа харах', ru: 'лучше один раз увидеть', vi: 'trăm nghe không bằng một thấy' } },
      { korean: '고진감래', romanization: 'gojingamnae', translation: { mn: 'гашуун байсны дараа чихэрлэг', ru: 'после трудностей радость', vi: 'khổ tận cam lai' } },
    ]
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getTheme(themeId: string): ThemeConfig | undefined {
  return THEMES[themeId];
}

export function getTopic(topicId: string): TopicConfig | undefined {
  return TOPICS.find(t => t.id === topicId);
}

export function getUnlockedTopics(xp: number): TopicConfig[] {
  return TOPICS.filter(topic => topic.xpRequired <= xp);
}

export function getLockedTopics(xp: number): TopicConfig[] {
  return TOPICS.filter(topic => topic.xpRequired > xp);
}

export function isTopicUnlocked(topicId: string, xp: number): boolean {
  const topic = getTopic(topicId);
  return topic ? topic.xpRequired <= xp : false;
}

export function getTopicsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): TopicConfig[] {
  return TOPICS.filter(topic => topic.difficulty === difficulty);
}

export function getAllThemeIds(): string[] {
  return Object.keys(THEMES);
}

export function getAllTopicIds(): string[] {
  return TOPICS.map(t => t.id);
}
