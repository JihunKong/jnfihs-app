/**
 * TOPIK 기반 한국어 학습 커리큘럼
 * Duolingo 스타일의 구조화된 학습 경로
 */

// 다국어 지원 타입
export interface LocalizedText {
  ko: string;
  mn: string;
  ru: string;
  vi: string;
}

// TOPIK 레벨 정의
export interface TopikLevel {
  id: number;
  name: LocalizedText;
  description: LocalizedText;
  requiredXP: number;
  vocabCount: number;
  grammarCount: number;
  color: string;
  gradient: string;
}

// 유닛 (상황/주제별)
export interface Unit {
  id: string;
  levelId: number;
  order: number;
  name: LocalizedText;
  description: LocalizedText;
  icon: string;
  sections: Section[];
}

// 섹션 (세부 주제)
export interface Section {
  id: string;
  unitId: string;
  order: number;
  name: LocalizedText;
  lessons: Lesson[];
}

// 레슨 (학습 단위)
export interface Lesson {
  id: string;
  sectionId: string;
  order: number;
  name: LocalizedText;
  description: LocalizedText;
  xpReward: number;
  exerciseCount: number;
  vocabularyIds: string[];
  grammarIds: string[];
}

// TOPIK 레벨 정의 (1-5급)
export const TOPIK_LEVELS: TopikLevel[] = [
  {
    id: 1,
    name: { ko: 'TOPIK 1급', mn: 'ТОПИК 1-р түвшин', ru: 'ТОПИК 1 уровень', vi: 'TOPIK Cấp 1' },
    description: {
      ko: '생존 한국어 - 기본 인사, 자기소개, 일상 표현',
      mn: 'Амьдралын солонгос хэл - Үндсэн мэндчилгээ',
      ru: 'Базовый корейский - Приветствия, самопредставление',
      vi: 'Tiếng Hàn cơ bản - Chào hỏi, giới thiệu bản thân'
    },
    requiredXP: 0,
    vocabCount: 800,
    grammarCount: 50,
    color: '#22c55e',
    gradient: 'bg-gradient-to-r from-green-400 to-emerald-500'
  },
  {
    id: 2,
    name: { ko: 'TOPIK 2급', mn: 'ТОПИК 2-р түвшин', ru: 'ТОПИК 2 уровень', vi: 'TOPIK Cấp 2' },
    description: {
      ko: '일상 대화 - 쇼핑, 음식 주문, 교통 이용',
      mn: 'Өдөр тутмын яриа - Дэлгүүр, хоол захиалга',
      ru: 'Повседневные разговоры - Магазин, заказ еды',
      vi: 'Hội thoại hàng ngày - Mua sắm, gọi món'
    },
    requiredXP: 5000,
    vocabCount: 1500,
    grammarCount: 80,
    color: '#3b82f6',
    gradient: 'bg-gradient-to-r from-blue-400 to-blue-500'
  },
  {
    id: 3,
    name: { ko: 'TOPIK 3급', mn: 'ТОПИК 3-р түвшин', ru: 'ТОПИК 3 уровень', vi: 'TOPIK Cấp 3' },
    description: {
      ko: '사회생활 - 학교, 직장, 공공기관 이용',
      mn: 'Нийгмийн амьдрал - Сургууль, ажлын байр',
      ru: 'Социальная жизнь - Школа, работа',
      vi: 'Đời sống xã hội - Trường học, công việc'
    },
    requiredXP: 15000,
    vocabCount: 3000,
    grammarCount: 120,
    color: '#8b5cf6',
    gradient: 'bg-gradient-to-r from-violet-400 to-purple-500'
  },
  {
    id: 4,
    name: { ko: 'TOPIK 4급', mn: 'ТОПИК 4-р түвшин', ru: 'ТОПИК 4 уровень', vi: 'TOPIK Cấp 4' },
    description: {
      ko: '업무/학업 - 뉴스 이해, 보고서 작성',
      mn: 'Ажил/Сургалт - Мэдээ ойлгох, тайлан бичих',
      ru: 'Работа/Учёба - Понимание новостей, отчёты',
      vi: 'Công việc/Học tập - Đọc tin tức, viết báo cáo'
    },
    requiredXP: 30000,
    vocabCount: 5000,
    grammarCount: 180,
    color: '#f59e0b',
    gradient: 'bg-gradient-to-r from-amber-400 to-orange-500'
  },
  {
    id: 5,
    name: { ko: 'TOPIK 5급', mn: 'ТОПИК 5-р түвшин', ru: 'ТОПИК 5 уровень', vi: 'TOPIK Cấp 5' },
    description: {
      ko: '전문 분야 - 학술 글, 관용어, 속담',
      mn: 'Мэргэжлийн салбар - Эрдмийн бичиг, зүйр цэцэн үг',
      ru: 'Профессиональная сфера - Академические тексты',
      vi: 'Chuyên ngành - Văn bản học thuật, thành ngữ'
    },
    requiredXP: 50000,
    vocabCount: 7000,
    grammarCount: 250,
    color: '#ef4444',
    gradient: 'bg-gradient-to-r from-red-400 to-rose-500'
  }
];

// TOPIK 1급 유닛 정의
export const TOPIK1_UNITS: Unit[] = [
  {
    id: 'unit-1-1',
    levelId: 1,
    order: 1,
    name: { ko: '인사하기', mn: 'Мэндчилгээ', ru: 'Приветствия', vi: 'Chào hỏi' },
    description: {
      ko: '만남과 헤어짐의 인사, 자기소개',
      mn: 'Уулзах, салах мэндчилгээ',
      ru: 'Приветствия при встрече и прощании',
      vi: 'Chào hỏi khi gặp và chia tay'
    },
    icon: '👋',
    sections: [
      {
        id: 'sec-1-1-1',
        unitId: 'unit-1-1',
        order: 1,
        name: { ko: '만나요', mn: 'Уулзах', ru: 'Встреча', vi: 'Gặp mặt' },
        lessons: [
          {
            id: 'les-1-1-1-1',
            sectionId: 'sec-1-1-1',
            order: 1,
            name: { ko: '인사 단어', mn: 'Мэндчилгээний үгс', ru: 'Слова приветствия', vi: 'Từ vựng chào hỏi' },
            description: { ko: '안녕하세요, 반갑습니다', mn: 'Сайн байна уу', ru: 'Здравствуйте', vi: 'Xin chào' },
            xpReward: 15,
            exerciseCount: 12,
            vocabularyIds: ['v-hello', 'v-nice-to-meet', 'v-yes', 'v-no', 'v-thank-you'],
            grammarIds: ['g-haeyo']
          },
          {
            id: 'les-1-1-1-2',
            sectionId: 'sec-1-1-1',
            order: 2,
            name: { ko: '자기소개', mn: 'Өөрийгөө танилцуулах', ru: 'Самопредставление', vi: 'Tự giới thiệu' },
            description: { ko: '저는 ___입니다', mn: 'Би ___', ru: 'Я - ___', vi: 'Tôi là ___' },
            xpReward: 15,
            exerciseCount: 12,
            vocabularyIds: ['v-i', 'v-name', 'v-what', 'v-to-be'],
            grammarIds: ['g-imnida', 'g-neun']
          },
          {
            id: 'les-1-1-1-3',
            sectionId: 'sec-1-1-1',
            order: 3,
            name: { ko: '나라와 직업', mn: 'Улс ба мэргэжил', ru: 'Страна и профессия', vi: 'Quốc gia và nghề nghiệp' },
            description: { ko: '어디에서 왔어요?', mn: 'Хаанаас ирсэн бэ?', ru: 'Откуда вы?', vi: 'Bạn đến từ đâu?' },
            xpReward: 15,
            exerciseCount: 12,
            vocabularyIds: ['v-where', 'v-country', 'v-korea', 'v-student', 'v-teacher'],
            grammarIds: ['g-eseo', 'g-ieyo']
          }
        ]
      },
      {
        id: 'sec-1-1-2',
        unitId: 'unit-1-1',
        order: 2,
        name: { ko: '헤어져요', mn: 'Салах', ru: 'Прощание', vi: 'Chia tay' },
        lessons: [
          {
            id: 'les-1-1-2-1',
            sectionId: 'sec-1-1-2',
            order: 1,
            name: { ko: '작별 인사', mn: 'Баяртай', ru: 'Прощание', vi: 'Tạm biệt' },
            description: { ko: '안녕히 가세요/계세요', mn: 'Баяртай', ru: 'До свидания', vi: 'Tạm biệt' },
            xpReward: 15,
            exerciseCount: 12,
            vocabularyIds: ['v-goodbye-go', 'v-goodbye-stay', 'v-see-you', 'v-later'],
            grammarIds: ['g-seyo']
          },
          {
            id: 'les-1-1-2-2',
            sectionId: 'sec-1-1-2',
            order: 2,
            name: { ko: '감사와 사과', mn: 'Талархал ба уучлал', ru: 'Благодарность и извинение', vi: 'Cảm ơn và xin lỗi' },
            description: { ko: '감사합니다, 죄송합니다', mn: 'Баярлалаа, Уучлаарай', ru: 'Спасибо, Извините', vi: 'Cảm ơn, Xin lỗi' },
            xpReward: 15,
            exerciseCount: 12,
            vocabularyIds: ['v-thank-you-formal', 'v-sorry', 'v-excuse-me', 'v-no-problem'],
            grammarIds: ['g-hamnida']
          }
        ]
      },
      {
        id: 'sec-1-1-3',
        unitId: 'unit-1-1',
        order: 3,
        name: { ko: '전화해요', mn: 'Утасдах', ru: 'Телефон', vi: 'Gọi điện' },
        lessons: [
          {
            id: 'les-1-1-3-1',
            sectionId: 'sec-1-1-3',
            order: 1,
            name: { ko: '전화 인사', mn: 'Утасны мэндчилгээ', ru: 'Телефонное приветствие', vi: 'Chào điện thoại' },
            description: { ko: '여보세요', mn: 'Байна уу', ru: 'Алло', vi: 'A lô' },
            xpReward: 15,
            exerciseCount: 12,
            vocabularyIds: ['v-hello-phone', 'v-this-is', 'v-speaking', 'v-moment'],
            grammarIds: ['g-yo']
          }
        ]
      }
    ]
  },
  {
    id: 'unit-1-2',
    levelId: 1,
    order: 2,
    name: { ko: '숫자와 시간', mn: 'Тоо ба цаг', ru: 'Числа и время', vi: 'Số và thời gian' },
    description: {
      ko: '숫자 세기, 시간 말하기',
      mn: 'Тоо тоолох, цаг хэлэх',
      ru: 'Счёт, называние времени',
      vi: 'Đếm số, nói giờ'
    },
    icon: '🔢',
    sections: [
      {
        id: 'sec-1-2-1',
        unitId: 'unit-1-2',
        order: 1,
        name: { ko: '숫자', mn: 'Тоо', ru: 'Числа', vi: 'Số' },
        lessons: [
          {
            id: 'les-1-2-1-1',
            sectionId: 'sec-1-2-1',
            order: 1,
            name: { ko: '고유어 숫자', mn: 'Уугуул тоо', ru: 'Исконные числа', vi: 'Số thuần Hàn' },
            description: { ko: '하나, 둘, 셋...', mn: 'Нэг, хоёр, гурав...', ru: 'Один, два, три...', vi: 'Một, hai, ba...' },
            xpReward: 15,
            exerciseCount: 12,
            vocabularyIds: ['v-one-k', 'v-two-k', 'v-three-k', 'v-four-k', 'v-five-k'],
            grammarIds: []
          },
          {
            id: 'les-1-2-1-2',
            sectionId: 'sec-1-2-1',
            order: 2,
            name: { ko: '한자어 숫자', mn: 'Хятад тоо', ru: 'Китайские числа', vi: 'Số Hán Hàn' },
            description: { ko: '일, 이, 삼...', mn: 'Ил, И, Сам...', ru: 'Иль, И, Сам...', vi: 'Nhất, nhị, tam...' },
            xpReward: 15,
            exerciseCount: 12,
            vocabularyIds: ['v-one-c', 'v-two-c', 'v-three-c', 'v-four-c', 'v-five-c'],
            grammarIds: []
          }
        ]
      },
      {
        id: 'sec-1-2-2',
        unitId: 'unit-1-2',
        order: 2,
        name: { ko: '시간', mn: 'Цаг', ru: 'Время', vi: 'Thời gian' },
        lessons: [
          {
            id: 'les-1-2-2-1',
            sectionId: 'sec-1-2-2',
            order: 1,
            name: { ko: '몇 시예요?', mn: 'Хэдэн цаг вэ?', ru: 'Который час?', vi: 'Mấy giờ?' },
            description: { ko: '시간 묻고 답하기', mn: 'Цаг асууж хариулах', ru: 'Спрашивать и отвечать о времени', vi: 'Hỏi và trả lời về giờ' },
            xpReward: 15,
            exerciseCount: 12,
            vocabularyIds: ['v-hour', 'v-minute', 'v-oclock', 'v-half', 'v-now'],
            grammarIds: ['g-myeot']
          },
          {
            id: 'les-1-2-2-2',
            sectionId: 'sec-1-2-2',
            order: 2,
            name: { ko: '요일과 날짜', mn: 'Гариг ба огноо', ru: 'День и дата', vi: 'Ngày và thứ' },
            description: { ko: '월요일, 1월 1일', mn: 'Даваа, 1 сарын 1', ru: 'Понедельник, 1 января', vi: 'Thứ hai, ngày 1 tháng 1' },
            xpReward: 15,
            exerciseCount: 12,
            vocabularyIds: ['v-monday', 'v-tuesday', 'v-month', 'v-day', 'v-year'],
            grammarIds: ['g-il']
          }
        ]
      }
    ]
  },
  {
    id: 'unit-1-3',
    levelId: 1,
    order: 3,
    name: { ko: '장소와 위치', mn: 'Газар ба байршил', ru: 'Место и расположение', vi: 'Địa điểm và vị trí' },
    description: {
      ko: '장소 이름, 위치 표현',
      mn: 'Газрын нэр, байршил',
      ru: 'Названия мест, расположение',
      vi: 'Tên địa điểm, vị trí'
    },
    icon: '📍',
    sections: [
      {
        id: 'sec-1-3-1',
        unitId: 'unit-1-3',
        order: 1,
        name: { ko: '장소', mn: 'Газар', ru: 'Места', vi: 'Địa điểm' },
        lessons: [
          {
            id: 'les-1-3-1-1',
            sectionId: 'sec-1-3-1',
            order: 1,
            name: { ko: '학교와 집', mn: 'Сургууль ба гэр', ru: 'Школа и дом', vi: 'Trường và nhà' },
            description: { ko: '학교에 가요', mn: 'Сургуульд явна', ru: 'Иду в школу', vi: 'Đi học' },
            xpReward: 15,
            exerciseCount: 12,
            vocabularyIds: ['v-school', 'v-home', 'v-classroom', 'v-library', 'v-cafeteria'],
            grammarIds: ['g-e', 'g-gayo']
          }
        ]
      },
      {
        id: 'sec-1-3-2',
        unitId: 'unit-1-3',
        order: 2,
        name: { ko: '위치', mn: 'Байршил', ru: 'Расположение', vi: 'Vị trí' },
        lessons: [
          {
            id: 'les-1-3-2-1',
            sectionId: 'sec-1-3-2',
            order: 1,
            name: { ko: '어디 있어요?', mn: 'Хаана байна?', ru: 'Где находится?', vi: 'Ở đâu?' },
            description: { ko: '위, 아래, 옆', mn: 'Дээр, доор, хажууд', ru: 'Сверху, снизу, рядом', vi: 'Trên, dưới, bên cạnh' },
            xpReward: 15,
            exerciseCount: 12,
            vocabularyIds: ['v-above', 'v-below', 'v-next-to', 'v-in-front', 'v-behind'],
            grammarIds: ['g-e-isseoyo']
          }
        ]
      }
    ]
  },
  {
    id: 'unit-1-4',
    levelId: 1,
    order: 4,
    name: { ko: '음식과 주문', mn: 'Хоол ба захиалга', ru: 'Еда и заказ', vi: 'Thức ăn và gọi món' },
    description: {
      ko: '음식 이름, 식당에서 주문하기',
      mn: 'Хоолны нэр, ресторанд захиалах',
      ru: 'Названия еды, заказ в ресторане',
      vi: 'Tên món ăn, gọi món ở nhà hàng'
    },
    icon: '🍚',
    sections: [
      {
        id: 'sec-1-4-1',
        unitId: 'unit-1-4',
        order: 1,
        name: { ko: '음식', mn: 'Хоол', ru: 'Еда', vi: 'Thức ăn' },
        lessons: [
          {
            id: 'les-1-4-1-1',
            sectionId: 'sec-1-4-1',
            order: 1,
            name: { ko: '한국 음식', mn: 'Солонгос хоол', ru: 'Корейская еда', vi: 'Món Hàn Quốc' },
            description: { ko: '김치, 비빔밥, 불고기', mn: 'Кимчи, бибимбап', ru: 'Кимчи, пибимпап', vi: 'Kimchi, bibimbap' },
            xpReward: 15,
            exerciseCount: 12,
            vocabularyIds: ['v-kimchi', 'v-bibimbap', 'v-bulgogi', 'v-rice', 'v-soup'],
            grammarIds: []
          },
          {
            id: 'les-1-4-1-2',
            sectionId: 'sec-1-4-1',
            order: 2,
            name: { ko: '음료와 디저트', mn: 'Ундаа ба амттан', ru: 'Напитки и десерты', vi: 'Đồ uống và tráng miệng' },
            description: { ko: '커피, 차, 케이크', mn: 'Кофе, цай, бялуу', ru: 'Кофе, чай, торт', vi: 'Cà phê, trà, bánh' },
            xpReward: 15,
            exerciseCount: 12,
            vocabularyIds: ['v-coffee', 'v-tea', 'v-water', 'v-cake', 'v-ice-cream'],
            grammarIds: []
          }
        ]
      },
      {
        id: 'sec-1-4-2',
        unitId: 'unit-1-4',
        order: 2,
        name: { ko: '주문하기', mn: 'Захиалах', ru: 'Заказ', vi: 'Gọi món' },
        lessons: [
          {
            id: 'les-1-4-2-1',
            sectionId: 'sec-1-4-2',
            order: 1,
            name: { ko: '뭘 드릴까요?', mn: 'Юу авах вэ?', ru: 'Что вам?', vi: 'Bạn dùng gì?' },
            description: { ko: '식당에서 주문하기', mn: 'Ресторанд захиалах', ru: 'Заказ в ресторане', vi: 'Gọi món ở nhà hàng' },
            xpReward: 15,
            exerciseCount: 12,
            vocabularyIds: ['v-please-give', 'v-menu', 'v-bill', 'v-delicious', 'v-spicy'],
            grammarIds: ['g-juseyo', 'g-eul']
          }
        ]
      }
    ]
  },
  {
    id: 'unit-1-5',
    levelId: 1,
    order: 5,
    name: { ko: '쇼핑하기', mn: 'Дэлгүүр хэсэх', ru: 'Шопинг', vi: 'Mua sắm' },
    description: {
      ko: '물건 이름, 가격 묻기, 계산하기',
      mn: 'Бараа, үнэ асуух, төлбөр хийх',
      ru: 'Товары, цены, оплата',
      vi: 'Đồ vật, hỏi giá, thanh toán'
    },
    icon: '🛒',
    sections: [
      {
        id: 'sec-1-5-1',
        unitId: 'unit-1-5',
        order: 1,
        name: { ko: '물건', mn: 'Бараа', ru: 'Товары', vi: 'Đồ vật' },
        lessons: [
          {
            id: 'les-1-5-1-1',
            sectionId: 'sec-1-5-1',
            order: 1,
            name: { ko: '옷과 신발', mn: 'Хувцас ба гутал', ru: 'Одежда и обувь', vi: 'Quần áo và giày dép' },
            description: { ko: '셔츠, 바지, 운동화', mn: 'Цамц, өмд, пүүз', ru: 'Рубашка, брюки, кроссовки', vi: 'Áo, quần, giày' },
            xpReward: 15,
            exerciseCount: 12,
            vocabularyIds: ['v-shirt', 'v-pants', 'v-shoes', 'v-hat', 'v-bag'],
            grammarIds: []
          }
        ]
      },
      {
        id: 'sec-1-5-2',
        unitId: 'unit-1-5',
        order: 2,
        name: { ko: '가격', mn: 'Үнэ', ru: 'Цены', vi: 'Giá cả' },
        lessons: [
          {
            id: 'les-1-5-2-1',
            sectionId: 'sec-1-5-2',
            order: 1,
            name: { ko: '얼마예요?', mn: 'Хэд вэ?', ru: 'Сколько стоит?', vi: 'Bao nhiêu tiền?' },
            description: { ko: '가격 묻고 답하기', mn: 'Үнэ асууж хариулах', ru: 'Спрашивать и называть цену', vi: 'Hỏi và trả lời về giá' },
            xpReward: 15,
            exerciseCount: 12,
            vocabularyIds: ['v-how-much', 'v-won', 'v-expensive', 'v-cheap', 'v-discount'],
            grammarIds: ['g-eolma']
          }
        ]
      }
    ]
  }
];

// 헬퍼 함수들
export function getLevel(levelId: number): TopikLevel | undefined {
  return TOPIK_LEVELS.find(l => l.id === levelId);
}

export function getUnitsForLevel(levelId: number): Unit[] {
  if (levelId === 1) return TOPIK1_UNITS;
  // TODO: Add units for other levels
  return [];
}

export function getUnit(unitId: string): Unit | undefined {
  return TOPIK1_UNITS.find(u => u.id === unitId);
}

export function getSection(sectionId: string): Section | undefined {
  for (const unit of TOPIK1_UNITS) {
    const section = unit.sections.find(s => s.id === sectionId);
    if (section) return section;
  }
  return undefined;
}

export function getLesson(lessonId: string): Lesson | undefined {
  for (const unit of TOPIK1_UNITS) {
    for (const section of unit.sections) {
      const lesson = section.lessons.find(l => l.id === lessonId);
      if (lesson) return lesson;
    }
  }
  return undefined;
}

export function getLessonContext(lessonId: string): { unit: Unit; section: Section; lesson: Lesson } | undefined {
  for (const unit of TOPIK1_UNITS) {
    for (const section of unit.sections) {
      const lesson = section.lessons.find(l => l.id === lessonId);
      if (lesson) {
        return { unit, section, lesson };
      }
    }
  }
  return undefined;
}

export function getAllLessonsForLevel(levelId: number): Lesson[] {
  const units = getUnitsForLevel(levelId);
  const lessons: Lesson[] = [];
  for (const unit of units) {
    for (const section of unit.sections) {
      lessons.push(...section.lessons);
    }
  }
  return lessons;
}

export function getTotalLessonsForLevel(levelId: number): number {
  return getAllLessonsForLevel(levelId).length;
}

export function getTotalXPForLevel(levelId: number): number {
  return getAllLessonsForLevel(levelId).reduce((sum, l) => sum + l.xpReward, 0);
}
