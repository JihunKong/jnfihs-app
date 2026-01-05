// Sentence Patterns for TOPIK 1 Korean Learning
// Common sentence structures with 4-language translations

import { LocalizedText } from './korean-curriculum';

// ============================================
// Types
// ============================================

export interface SentencePattern {
  id: string;
  unitId: string;
  pattern: string;           // Pattern with placeholders like {noun}, {verb}
  patternKorean: string;     // Korean pattern representation
  name: LocalizedText;
  description: LocalizedText;
  grammarPoints: string[];   // Related grammar point IDs
  examples: PatternExample[];
  difficulty: 1 | 2 | 3;     // 1: Easy, 2: Medium, 3: Hard
  category: PatternCategory;
}

export interface PatternExample {
  korean: string;
  pronunciation: string;
  translation: LocalizedText;
  slots: SlotFill[];         // What fills each slot
}

export interface SlotFill {
  slot: string;              // e.g., "{noun}", "{verb}"
  value: string;             // e.g., "학교", "가다"
  vocabularyId?: string;     // Reference to vocabulary
}

export type PatternCategory =
  | 'introduction'    // Self-introduction patterns
  | 'existence'       // Existence/location patterns
  | 'action'          // Action/activity patterns
  | 'description'     // Description patterns
  | 'request'         // Request/order patterns
  | 'question'        // Question patterns
  | 'time'            // Time expression patterns
  | 'comparison'      // Comparison patterns
  | 'reason'          // Reason/cause patterns
  | 'condition';      // Condition patterns

// ============================================
// TOPIK 1 Sentence Patterns
// ============================================

export const TOPIK1_SENTENCE_PATTERNS: SentencePattern[] = [
  // ============================================
  // Introduction Patterns (자기소개)
  // ============================================
  {
    id: 'sp-001',
    unitId: 'topik1-unit1',
    pattern: '{subject} + 은/는 + {noun} + 이에요/예요',
    patternKorean: '___은/는 ___이에요/예요.',
    name: {
      ko: '~은/는 ~이에요/예요',
      mn: '~бол ~юм',
      ru: '~ является ~',
      vi: '~ là ~'
    },
    description: {
      ko: '주어가 무엇인지 말할 때 사용해요.',
      mn: 'Эзэн бие юу болохыг хэлэхэд хэрэглэнэ.',
      ru: 'Используется для описания того, чем является подлежащее.',
      vi: 'Dùng để nói chủ ngữ là gì.'
    },
    grammarPoints: ['g1-001', 'g1-006'],
    examples: [
      {
        korean: '저는 학생이에요.',
        pronunciation: 'jeoneun haksaengieyo',
        translation: { ko: '저는 학생이에요.', mn: 'Би оюутан байна.', ru: 'Я студент.', vi: 'Tôi là sinh viên.' },
        slots: [{ slot: '{subject}', value: '저' }, { slot: '{noun}', value: '학생' }]
      },
      {
        korean: '이것은 책이에요.',
        pronunciation: 'igeoseun chaegieyo',
        translation: { ko: '이것은 책이에요.', mn: 'Энэ бол ном.', ru: 'Это книга.', vi: 'Đây là sách.' },
        slots: [{ slot: '{subject}', value: '이것' }, { slot: '{noun}', value: '책' }]
      },
      {
        korean: '제 이름은 민수예요.',
        pronunciation: 'je ireumeun minsuye yo',
        translation: { ko: '제 이름은 민수예요.', mn: 'Миний нэр Минсү.', ru: 'Меня зовут Минсу.', vi: 'Tên tôi là Minsu.' },
        slots: [{ slot: '{subject}', value: '제 이름' }, { slot: '{noun}', value: '민수' }]
      }
    ],
    difficulty: 1,
    category: 'introduction'
  },
  {
    id: 'sp-002',
    unitId: 'topik1-unit1',
    pattern: '{subject} + 은/는 + {nationality} + 사람이에요',
    patternKorean: '___은/는 ___ 사람이에요.',
    name: {
      ko: '국적 말하기',
      mn: 'Иргэншил хэлэх',
      ru: 'Говорить о национальности',
      vi: 'Nói về quốc tịch'
    },
    description: {
      ko: '자신의 국적이나 출신을 말할 때 사용해요.',
      mn: 'Өөрийн иргэншил, гарал үүслийг хэлэхэд хэрэглэнэ.',
      ru: 'Используется для описания национальности или происхождения.',
      vi: 'Dùng để nói về quốc tịch hoặc xuất xứ.'
    },
    grammarPoints: ['g1-001', 'g1-006'],
    examples: [
      {
        korean: '저는 몽골 사람이에요.',
        pronunciation: 'jeoneun monggol saramieyo',
        translation: { ko: '저는 몽골 사람이에요.', mn: 'Би Монгол хүн.', ru: 'Я монгол.', vi: 'Tôi là người Mông Cổ.' },
        slots: [{ slot: '{subject}', value: '저' }, { slot: '{nationality}', value: '몽골' }]
      },
      {
        korean: '친구는 베트남 사람이에요.',
        pronunciation: 'chinguneun beteunam saramieyo',
        translation: { ko: '친구는 베트남 사람이에요.', mn: 'Найз маань Вьетнам хүн.', ru: 'Мой друг вьетнамец.', vi: 'Bạn tôi là người Việt Nam.' },
        slots: [{ slot: '{subject}', value: '친구' }, { slot: '{nationality}', value: '베트남' }]
      }
    ],
    difficulty: 1,
    category: 'introduction'
  },

  // ============================================
  // Existence Patterns (존재/소유)
  // ============================================
  {
    id: 'sp-003',
    unitId: 'topik1-unit2',
    pattern: '{location} + 에 + {noun} + 이/가 있어요',
    patternKorean: '___에 ___이/가 있어요.',
    name: {
      ko: '~에 ~이/가 있어요',
      mn: '~д ~байна',
      ru: 'В ~ есть ~',
      vi: 'Ở ~ có ~'
    },
    description: {
      ko: '어떤 장소에 무엇이 있는지 말할 때 사용해요.',
      mn: 'Ямар нэгэн газарт юу байгааг хэлэхэд хэрэглэнэ.',
      ru: 'Используется для описания наличия чего-то где-то.',
      vi: 'Dùng để nói có gì ở đâu đó.'
    },
    grammarPoints: ['g1-002', 'g1-004'],
    examples: [
      {
        korean: '교실에 책상이 있어요.',
        pronunciation: 'gyosire chaeksangi isseoyo',
        translation: { ko: '교실에 책상이 있어요.', mn: 'Ангид ширээ байна.', ru: 'В классе есть стол.', vi: 'Trong lớp có bàn.' },
        slots: [{ slot: '{location}', value: '교실' }, { slot: '{noun}', value: '책상' }]
      },
      {
        korean: '냉장고에 물이 있어요.',
        pronunciation: 'naengjangoe muri isseoyo',
        translation: { ko: '냉장고에 물이 있어요.', mn: 'Хөргөгчинд ус байна.', ru: 'В холодильнике есть вода.', vi: 'Trong tủ lạnh có nước.' },
        slots: [{ slot: '{location}', value: '냉장고' }, { slot: '{noun}', value: '물' }]
      }
    ],
    difficulty: 1,
    category: 'existence'
  },
  {
    id: 'sp-004',
    unitId: 'topik1-unit2',
    pattern: '{subject} + 은/는 + {noun} + 이/가 없어요',
    patternKorean: '___은/는 ___이/가 없어요.',
    name: {
      ko: '~이/가 없어요',
      mn: '~байхгүй',
      ru: 'Нет ~',
      vi: 'Không có ~'
    },
    description: {
      ko: '무엇이 없다고 말할 때 사용해요.',
      mn: 'Юу байхгүй гэдгийг хэлэхэд хэрэглэнэ.',
      ru: 'Используется для выражения отсутствия чего-то.',
      vi: 'Dùng để nói không có gì đó.'
    },
    grammarPoints: ['g1-001', 'g1-002'],
    examples: [
      {
        korean: '저는 시간이 없어요.',
        pronunciation: 'jeoneun sigani eopseoyo',
        translation: { ko: '저는 시간이 없어요.', mn: 'Надад цаг байхгүй.', ru: 'У меня нет времени.', vi: 'Tôi không có thời gian.' },
        slots: [{ slot: '{subject}', value: '저' }, { slot: '{noun}', value: '시간' }]
      },
      {
        korean: '오늘은 수업이 없어요.',
        pronunciation: 'oneureun sueobi eopseoyo',
        translation: { ko: '오늘은 수업이 없어요.', mn: 'Өнөөдөр хичээл байхгүй.', ru: 'Сегодня нет занятий.', vi: 'Hôm nay không có lớp.' },
        slots: [{ slot: '{subject}', value: '오늘' }, { slot: '{noun}', value: '수업' }]
      }
    ],
    difficulty: 1,
    category: 'existence'
  },

  // ============================================
  // Action Patterns (동작)
  // ============================================
  {
    id: 'sp-005',
    unitId: 'topik1-unit2',
    pattern: '{subject} + 은/는 + {object} + 을/를 + {verb} + 아요/어요',
    patternKorean: '___은/는 ___을/를 ___아요/어요.',
    name: {
      ko: '목적어 + 동사',
      mn: 'Тусах бие + үйл үг',
      ru: 'Дополнение + глагол',
      vi: 'Tân ngữ + động từ'
    },
    description: {
      ko: '무엇을 하는지 말할 때 사용해요.',
      mn: 'Юу хийж байгааг хэлэхэд хэрэглэнэ.',
      ru: 'Используется для описания действия с объектом.',
      vi: 'Dùng để nói làm gì với cái gì.'
    },
    grammarPoints: ['g1-001', 'g1-003', 'g1-007'],
    examples: [
      {
        korean: '저는 밥을 먹어요.',
        pronunciation: 'jeoneun babeul meogeoyo',
        translation: { ko: '저는 밥을 먹어요.', mn: 'Би хоол иддэг.', ru: 'Я ем рис.', vi: 'Tôi ăn cơm.' },
        slots: [{ slot: '{subject}', value: '저' }, { slot: '{object}', value: '밥' }, { slot: '{verb}', value: '먹다' }]
      },
      {
        korean: '학생들은 한국어를 공부해요.',
        pronunciation: 'haksaengdeureun hangugeoreul gongbuhaeyo',
        translation: { ko: '학생들은 한국어를 공부해요.', mn: 'Оюутнууд солонгос хэл сурдаг.', ru: 'Студенты изучают корейский.', vi: 'Các sinh viên học tiếng Hàn.' },
        slots: [{ slot: '{subject}', value: '학생들' }, { slot: '{object}', value: '한국어' }, { slot: '{verb}', value: '공부하다' }]
      }
    ],
    difficulty: 1,
    category: 'action'
  },
  {
    id: 'sp-006',
    unitId: 'topik1-unit3',
    pattern: '{subject} + 은/는 + {place} + 에서 + {verb} + 아요/어요',
    patternKorean: '___은/는 ___에서 ___아요/어요.',
    name: {
      ko: '장소에서 동작',
      mn: 'Газарт үйлдэл',
      ru: 'Действие в месте',
      vi: 'Hành động ở nơi'
    },
    description: {
      ko: '어디에서 무엇을 하는지 말할 때 사용해요.',
      mn: 'Хаана юу хийж байгааг хэлэхэд хэрэглэнэ.',
      ru: 'Используется для описания действия в каком-то месте.',
      vi: 'Dùng để nói làm gì ở đâu.'
    },
    grammarPoints: ['g1-001', 'g1-005', 'g1-007'],
    examples: [
      {
        korean: '저는 학교에서 공부해요.',
        pronunciation: 'jeoneun hakgyoeseo gongbuhaeyo',
        translation: { ko: '저는 학교에서 공부해요.', mn: 'Би сургуульд суралцдаг.', ru: 'Я учусь в школе.', vi: 'Tôi học ở trường.' },
        slots: [{ slot: '{subject}', value: '저' }, { slot: '{place}', value: '학교' }, { slot: '{verb}', value: '공부하다' }]
      },
      {
        korean: '우리는 식당에서 밥을 먹어요.',
        pronunciation: 'urineun sikdangeseo babeul meogeoyo',
        translation: { ko: '우리는 식당에서 밥을 먹어요.', mn: 'Бид зоогийн газарт хоол идсэн.', ru: 'Мы едим в ресторане.', vi: 'Chúng tôi ăn ở nhà hàng.' },
        slots: [{ slot: '{subject}', value: '우리' }, { slot: '{place}', value: '식당' }, { slot: '{verb}', value: '먹다' }]
      }
    ],
    difficulty: 1,
    category: 'action'
  },
  {
    id: 'sp-007',
    unitId: 'topik1-unit3',
    pattern: '{subject} + 은/는 + {place} + 에 + 가요/와요',
    patternKorean: '___은/는 ___에 가요/와요.',
    name: {
      ko: '장소로 이동',
      mn: 'Газар руу явах',
      ru: 'Перемещение в место',
      vi: 'Di chuyển đến nơi'
    },
    description: {
      ko: '어디로 가거나 어디서 오는지 말할 때 사용해요.',
      mn: 'Хаашаа явах эсвэл хаанаас ирж байгааг хэлэхэд хэрэглэнэ.',
      ru: 'Используется для описания перемещения куда-то или откуда-то.',
      vi: 'Dùng để nói đi đâu hoặc đến từ đâu.'
    },
    grammarPoints: ['g1-001', 'g1-004', 'g1-007'],
    examples: [
      {
        korean: '저는 학교에 가요.',
        pronunciation: 'jeoneun hakgyoe gayo',
        translation: { ko: '저는 학교에 가요.', mn: 'Би сургуульд явж байна.', ru: 'Я иду в школу.', vi: 'Tôi đi học.' },
        slots: [{ slot: '{subject}', value: '저' }, { slot: '{place}', value: '학교' }]
      },
      {
        korean: '친구가 한국에 와요.',
        pronunciation: 'chinguga hanguge wayo',
        translation: { ko: '친구가 한국에 와요.', mn: 'Найз маань Солонгост ирж байна.', ru: 'Друг приезжает в Корею.', vi: 'Bạn tôi đến Hàn Quốc.' },
        slots: [{ slot: '{subject}', value: '친구' }, { slot: '{place}', value: '한국' }]
      }
    ],
    difficulty: 1,
    category: 'action'
  },

  // ============================================
  // Request Patterns (요청/부탁)
  // ============================================
  {
    id: 'sp-008',
    unitId: 'topik1-unit3',
    pattern: '{object} + 을/를 주세요',
    patternKorean: '___을/를 주세요.',
    name: {
      ko: '~을/를 주세요',
      mn: '~өгнө үү',
      ru: 'Дайте ~',
      vi: 'Cho tôi ~'
    },
    description: {
      ko: '무엇을 달라고 정중하게 부탁할 때 사용해요.',
      mn: 'Ямар нэгэн зүйлийг эелдгээр авахыг хүсэхэд хэрэглэнэ.',
      ru: 'Вежливая просьба дать что-то.',
      vi: 'Dùng để yêu cầu cho cái gì một cách lịch sự.'
    },
    grammarPoints: ['g1-003', 'g1-011'],
    examples: [
      {
        korean: '물을 주세요.',
        pronunciation: 'mureul juseyo',
        translation: { ko: '물을 주세요.', mn: 'Ус өгнө үү.', ru: 'Дайте воды, пожалуйста.', vi: 'Cho tôi nước.' },
        slots: [{ slot: '{object}', value: '물' }]
      },
      {
        korean: '메뉴를 주세요.',
        pronunciation: 'menyureul juseyo',
        translation: { ko: '메뉴를 주세요.', mn: 'Цэс өгнө үү.', ru: 'Меню, пожалуйста.', vi: 'Cho tôi menu.' },
        slots: [{ slot: '{object}', value: '메뉴' }]
      },
      {
        korean: '커피 한 잔 주세요.',
        pronunciation: 'keopi han jan juseyo',
        translation: { ko: '커피 한 잔 주세요.', mn: 'Нэг аяга кофе өгнө үү.', ru: 'Одну чашку кофе, пожалуйста.', vi: 'Cho tôi một ly cà phê.' },
        slots: [{ slot: '{object}', value: '커피 한 잔' }]
      }
    ],
    difficulty: 1,
    category: 'request'
  },
  {
    id: 'sp-009',
    unitId: 'topik1-unit4',
    pattern: '{verb} + 아/어 주세요',
    patternKorean: '___아/어 주세요.',
    name: {
      ko: '~아/어 주세요',
      mn: '~өгнө үү',
      ru: 'Пожалуйста, ~',
      vi: 'Xin hãy ~'
    },
    description: {
      ko: '어떤 행동을 해달라고 정중하게 부탁할 때 사용해요.',
      mn: 'Ямар нэгэн үйлдэл хийхийг эелдгээр хүсэхэд хэрэглэнэ.',
      ru: 'Вежливая просьба сделать что-то.',
      vi: 'Dùng để yêu cầu làm điều gì một cách lịch sự.'
    },
    grammarPoints: ['g1-007', 'g1-011'],
    examples: [
      {
        korean: '천천히 말해 주세요.',
        pronunciation: 'cheoncheonhi malhae juseyo',
        translation: { ko: '천천히 말해 주세요.', mn: 'Аажуухан ярина уу.', ru: 'Говорите медленнее, пожалуйста.', vi: 'Xin hãy nói chậm hơn.' },
        slots: [{ slot: '{verb}', value: '말하다' }]
      },
      {
        korean: '다시 한번 설명해 주세요.',
        pronunciation: 'dasi hanbeon seolmyeonghae juseyo',
        translation: { ko: '다시 한번 설명해 주세요.', mn: 'Дахин нэг удаа тайлбарлана уу.', ru: 'Объясните ещё раз, пожалуйста.', vi: 'Xin giải thích lại một lần nữa.' },
        slots: [{ slot: '{verb}', value: '설명하다' }]
      }
    ],
    difficulty: 2,
    category: 'request'
  },

  // ============================================
  // Question Patterns (질문)
  // ============================================
  {
    id: 'sp-010',
    unitId: 'topik1-unit2',
    pattern: '{noun} + 이/가 뭐예요?',
    patternKorean: '___이/가 뭐예요?',
    name: {
      ko: '~이/가 뭐예요?',
      mn: '~юу вэ?',
      ru: 'Что такое ~?',
      vi: '~ là gì?'
    },
    description: {
      ko: '무엇인지 물어볼 때 사용해요.',
      mn: 'Юу болохыг асуухад хэрэглэнэ.',
      ru: 'Используется для вопроса "что это".',
      vi: 'Dùng để hỏi cái gì đó là gì.'
    },
    grammarPoints: ['g1-002', 'g1-006'],
    examples: [
      {
        korean: '이것이 뭐예요?',
        pronunciation: 'igeosi mwoyeyo',
        translation: { ko: '이것이 뭐예요?', mn: 'Энэ юу вэ?', ru: 'Что это?', vi: 'Cái này là gì?' },
        slots: [{ slot: '{noun}', value: '이것' }]
      },
      {
        korean: '취미가 뭐예요?',
        pronunciation: 'chwimiga mwoyeyo',
        translation: { ko: '취미가 뭐예요?', mn: 'Хобби чинь юу вэ?', ru: 'Какое у вас хобби?', vi: 'Sở thích của bạn là gì?' },
        slots: [{ slot: '{noun}', value: '취미' }]
      }
    ],
    difficulty: 1,
    category: 'question'
  },
  {
    id: 'sp-011',
    unitId: 'topik1-unit2',
    pattern: '{noun} + 이/가 어디예요?',
    patternKorean: '___이/가 어디예요?',
    name: {
      ko: '~이/가 어디예요?',
      mn: '~хаана байна вэ?',
      ru: 'Где ~?',
      vi: '~ ở đâu?'
    },
    description: {
      ko: '어디에 있는지 물어볼 때 사용해요.',
      mn: 'Хаана байгааг асуухад хэрэглэнэ.',
      ru: 'Используется для вопроса о местонахождении.',
      vi: 'Dùng để hỏi ở đâu.'
    },
    grammarPoints: ['g1-002', 'g1-006'],
    examples: [
      {
        korean: '화장실이 어디예요?',
        pronunciation: 'hwajangsiri eodiyeyo',
        translation: { ko: '화장실이 어디예요?', mn: 'Ариун цэврийн өрөө хаана байна вэ?', ru: 'Где туалет?', vi: 'Nhà vệ sinh ở đâu?' },
        slots: [{ slot: '{noun}', value: '화장실' }]
      },
      {
        korean: '학교가 어디예요?',
        pronunciation: 'hakgyoga eodiyeyo',
        translation: { ko: '학교가 어디예요?', mn: 'Сургууль хаана байна вэ?', ru: 'Где школа?', vi: 'Trường học ở đâu?' },
        slots: [{ slot: '{noun}', value: '학교' }]
      }
    ],
    difficulty: 1,
    category: 'question'
  },
  {
    id: 'sp-012',
    unitId: 'topik1-unit3',
    pattern: '{time expression} + 에 뭐 해요?',
    patternKorean: '___에 뭐 해요?',
    name: {
      ko: '~에 뭐 해요?',
      mn: '~д юу хийдэг вэ?',
      ru: 'Что делаете в ~?',
      vi: '~ làm gì?'
    },
    description: {
      ko: '특정 시간에 무엇을 하는지 물어볼 때 사용해요.',
      mn: 'Тодорхой цагт юу хийдгийг асуухад хэрэглэнэ.',
      ru: 'Используется для вопроса о занятиях в определённое время.',
      vi: 'Dùng để hỏi làm gì vào thời điểm nào đó.'
    },
    grammarPoints: ['g1-004', 'g1-007'],
    examples: [
      {
        korean: '주말에 뭐 해요?',
        pronunciation: 'jumare mwo haeyo',
        translation: { ko: '주말에 뭐 해요?', mn: 'Амралтын өдөр юу хийдэг вэ?', ru: 'Что делаете на выходных?', vi: 'Cuối tuần bạn làm gì?' },
        slots: [{ slot: '{time expression}', value: '주말' }]
      },
      {
        korean: '아침에 뭐 해요?',
        pronunciation: 'achime mwo haeyo',
        translation: { ko: '아침에 뭐 해요?', mn: 'Өглөө юу хийдэг вэ?', ru: 'Что делаете утром?', vi: 'Buổi sáng bạn làm gì?' },
        slots: [{ slot: '{time expression}', value: '아침' }]
      }
    ],
    difficulty: 1,
    category: 'question'
  },

  // ============================================
  // Time Patterns (시간)
  // ============================================
  {
    id: 'sp-013',
    unitId: 'topik1-unit3',
    pattern: '{time} + 에 + {verb} + 아요/어요',
    patternKorean: '___에 ___아요/어요.',
    name: {
      ko: '시간에 동작',
      mn: 'Цагт үйлдэл',
      ru: 'Действие во время',
      vi: 'Hành động vào lúc'
    },
    description: {
      ko: '언제 무엇을 하는지 말할 때 사용해요.',
      mn: 'Хэзээ юу хийдгийг хэлэхэд хэрэглэнэ.',
      ru: 'Используется для описания действия в определённое время.',
      vi: 'Dùng để nói làm gì vào lúc nào.'
    },
    grammarPoints: ['g1-004', 'g1-007'],
    examples: [
      {
        korean: '7시에 일어나요.',
        pronunciation: 'ilgopsie ireonayo',
        translation: { ko: '7시에 일어나요.', mn: '7 цагт босдог.', ru: 'Встаю в 7 часов.', vi: 'Tôi dậy lúc 7 giờ.' },
        slots: [{ slot: '{time}', value: '7시' }, { slot: '{verb}', value: '일어나다' }]
      },
      {
        korean: '저녁 6시에 밥을 먹어요.',
        pronunciation: 'jeonyeok yeoseotchie babeul meogeoyo',
        translation: { ko: '저녁 6시에 밥을 먹어요.', mn: 'Орой 6 цагт хоол иддэг.', ru: 'Ужинаю в 6 вечера.', vi: 'Tôi ăn tối lúc 6 giờ.' },
        slots: [{ slot: '{time}', value: '저녁 6시' }, { slot: '{verb}', value: '먹다' }]
      }
    ],
    difficulty: 1,
    category: 'time'
  },
  {
    id: 'sp-014',
    unitId: 'topik1-unit4',
    pattern: '{time1} + 부터 + {time2} + 까지 + {verb} + 아요/어요',
    patternKorean: '___부터 ___까지 ___아요/어요.',
    name: {
      ko: '~부터 ~까지',
      mn: '~аас ~хүртэл',
      ru: 'С ~ до ~',
      vi: 'Từ ~ đến ~'
    },
    description: {
      ko: '시작 시간과 끝 시간을 말할 때 사용해요.',
      mn: 'Эхлэх ба дуусах цагийг хэлэхэд хэрэглэнэ.',
      ru: 'Используется для указания начала и конца периода.',
      vi: 'Dùng để nói thời gian bắt đầu và kết thúc.'
    },
    grammarPoints: ['g1-016', 'g1-007'],
    examples: [
      {
        korean: '9시부터 6시까지 일해요.',
        pronunciation: 'ahopshibuteo yeoseotshikkaji ilhaeyo',
        translation: { ko: '9시부터 6시까지 일해요.', mn: '9 цагаас 6 цаг хүртэл ажилладаг.', ru: 'Работаю с 9 до 6.', vi: 'Tôi làm việc từ 9 giờ đến 6 giờ.' },
        slots: [{ slot: '{time1}', value: '9시' }, { slot: '{time2}', value: '6시' }, { slot: '{verb}', value: '일하다' }]
      },
      {
        korean: '월요일부터 금요일까지 학교에 가요.',
        pronunciation: 'woryoilbuteo geumyoilkkaji hakgyoe gayo',
        translation: { ko: '월요일부터 금요일까지 학교에 가요.', mn: 'Даваагаас Баасан гараг хүртэл сургуульд явдаг.', ru: 'Хожу в школу с понедельника по пятницу.', vi: 'Tôi đi học từ thứ Hai đến thứ Sáu.' },
        slots: [{ slot: '{time1}', value: '월요일' }, { slot: '{time2}', value: '금요일' }, { slot: '{verb}', value: '가다' }]
      }
    ],
    difficulty: 2,
    category: 'time'
  },

  // ============================================
  // Description Patterns (묘사)
  // ============================================
  {
    id: 'sp-015',
    unitId: 'topik1-unit2',
    pattern: '{noun} + 이/가 + {adjective} + 아요/어요',
    patternKorean: '___이/가 ___아요/어요.',
    name: {
      ko: '~이/가 ~아요/어요',
      mn: '~нь ~байна',
      ru: '~ является ~',
      vi: '~ thì ~'
    },
    description: {
      ko: '무엇이 어떤지 묘사할 때 사용해요.',
      mn: 'Ямар нэгэн зүйл ямар байгааг тодорхойлоход хэрэглэнэ.',
      ru: 'Используется для описания качества чего-то.',
      vi: 'Dùng để mô tả tính chất của cái gì đó.'
    },
    grammarPoints: ['g1-002', 'g1-007'],
    examples: [
      {
        korean: '날씨가 좋아요.',
        pronunciation: 'nalssiga joayo',
        translation: { ko: '날씨가 좋아요.', mn: 'Цаг агаар сайхан байна.', ru: 'Погода хорошая.', vi: 'Thời tiết đẹp.' },
        slots: [{ slot: '{noun}', value: '날씨' }, { slot: '{adjective}', value: '좋다' }]
      },
      {
        korean: '한국어가 어려워요.',
        pronunciation: 'hangugeoga eoryeowoyo',
        translation: { ko: '한국어가 어려워요.', mn: 'Солонгос хэл хэцүү.', ru: 'Корейский сложный.', vi: 'Tiếng Hàn khó.' },
        slots: [{ slot: '{noun}', value: '한국어' }, { slot: '{adjective}', value: '어렵다' }]
      }
    ],
    difficulty: 1,
    category: 'description'
  },
  {
    id: 'sp-016',
    unitId: 'topik1-unit4',
    pattern: '{noun} + 은/는 + {adjective} + 지만 + {clause}',
    patternKorean: '___은/는 ___지만 ___.',
    name: {
      ko: '~지만 (대조)',
      mn: '~боловч',
      ru: '~, но',
      vi: '~, nhưng'
    },
    description: {
      ko: '대조되는 두 내용을 연결할 때 사용해요.',
      mn: 'Эсрэгцсэн хоёр зүйлийг холбоход хэрэглэнэ.',
      ru: 'Используется для соединения контрастных утверждений.',
      vi: 'Dùng để nối hai ý trái ngược nhau.'
    },
    grammarPoints: ['g1-001'],
    examples: [
      {
        korean: '비싸지만 맛있어요.',
        pronunciation: 'bissajiman masisseoyo',
        translation: { ko: '비싸지만 맛있어요.', mn: 'Үнэтэй боловч амттай.', ru: 'Дорого, но вкусно.', vi: 'Đắt nhưng ngon.' },
        slots: [{ slot: '{adjective}', value: '비싸다' }, { slot: '{clause}', value: '맛있어요' }]
      },
      {
        korean: '어렵지만 재미있어요.',
        pronunciation: 'eoryeopjiman jaemiisseoyo',
        translation: { ko: '어렵지만 재미있어요.', mn: 'Хэцүү боловч сонирхолтой.', ru: 'Сложно, но интересно.', vi: 'Khó nhưng thú vị.' },
        slots: [{ slot: '{adjective}', value: '어렵다' }, { slot: '{clause}', value: '재미있어요' }]
      }
    ],
    difficulty: 2,
    category: 'description'
  },

  // ============================================
  // Comparison Patterns (비교)
  // ============================================
  {
    id: 'sp-017',
    unitId: 'topik1-unit4',
    pattern: '{noun1} + 보다 + {noun2} + 이/가 + 더 + {adjective}',
    patternKorean: '___보다 ___이/가 더 ___.',
    name: {
      ko: '~보다 더 ~',
      mn: '~аас илүү ~',
      ru: '~ более ~ чем ~',
      vi: '~ hơn ~'
    },
    description: {
      ko: '두 가지를 비교할 때 사용해요.',
      mn: 'Хоёр зүйлийг харьцуулахад хэрэглэнэ.',
      ru: 'Используется для сравнения двух вещей.',
      vi: 'Dùng để so sánh hai thứ.'
    },
    grammarPoints: ['g1-019', 'g1-002'],
    examples: [
      {
        korean: '커피보다 차가 더 좋아요.',
        pronunciation: 'keopi boda chaga deo joayo',
        translation: { ko: '커피보다 차가 더 좋아요.', mn: 'Кофеноос илүү цай дуртай.', ru: 'Чай нравится больше кофе.', vi: 'Tôi thích trà hơn cà phê.' },
        slots: [{ slot: '{noun1}', value: '커피' }, { slot: '{noun2}', value: '차' }, { slot: '{adjective}', value: '좋다' }]
      },
      {
        korean: '여름보다 겨울이 더 추워요.',
        pronunciation: 'yeoreumboda gyeouri deo chuwoyo',
        translation: { ko: '여름보다 겨울이 더 추워요.', mn: 'Зун улираас өвөл улирал илүү хүйтэн.', ru: 'Зима холоднее лета.', vi: 'Mùa đông lạnh hơn mùa hè.' },
        slots: [{ slot: '{noun1}', value: '여름' }, { slot: '{noun2}', value: '겨울' }, { slot: '{adjective}', value: '춥다' }]
      }
    ],
    difficulty: 2,
    category: 'comparison'
  },

  // ============================================
  // Reason Patterns (이유)
  // ============================================
  {
    id: 'sp-018',
    unitId: 'topik1-unit4',
    pattern: '{reason} + 아서/어서 + {result}',
    patternKorean: '___아서/어서 ___.',
    name: {
      ko: '~아서/어서 (이유)',
      mn: '~учраас',
      ru: 'Потому что ~',
      vi: 'Vì ~ nên'
    },
    description: {
      ko: '이유와 결과를 연결할 때 사용해요.',
      mn: 'Шалтгаан ба үр дүнг холбоход хэрэглэнэ.',
      ru: 'Используется для связи причины и следствия.',
      vi: 'Dùng để nối lý do và kết quả.'
    },
    grammarPoints: ['g1-028'],
    examples: [
      {
        korean: '배가 고파서 밥을 먹어요.',
        pronunciation: 'baega gopaseo babeul meogeoyo',
        translation: { ko: '배가 고파서 밥을 먹어요.', mn: 'Өлссөн учраас хоол идсэн.', ru: 'Ем, потому что голоден.', vi: 'Vì đói nên tôi ăn cơm.' },
        slots: [{ slot: '{reason}', value: '배가 고프다' }, { slot: '{result}', value: '밥을 먹어요' }]
      },
      {
        korean: '피곤해서 일찍 자요.',
        pronunciation: 'pigonhaeseo iljjik jayo',
        translation: { ko: '피곤해서 일찍 자요.', mn: 'Ядарсан учраас эрт унтсан.', ru: 'Устал, поэтому рано лёг.', vi: 'Mệt nên ngủ sớm.' },
        slots: [{ slot: '{reason}', value: '피곤하다' }, { slot: '{result}', value: '일찍 자요' }]
      }
    ],
    difficulty: 2,
    category: 'reason'
  },
  {
    id: 'sp-019',
    unitId: 'topik1-unit5',
    pattern: '{reason} + 기 때문에 + {result}',
    patternKorean: '___기 때문에 ___.',
    name: {
      ko: '~기 때문에',
      mn: '~учраас',
      ru: 'Из-за того, что ~',
      vi: 'Vì ~ cho nên'
    },
    description: {
      ko: '더 명확하게 이유를 말할 때 사용해요.',
      mn: 'Шалтгааныг илүү тодорхой хэлэхэд хэрэглэнэ.',
      ru: 'Используется для более явного указания причины.',
      vi: 'Dùng để nói lý do một cách rõ ràng hơn.'
    },
    grammarPoints: ['g1-027'],
    examples: [
      {
        korean: '비가 오기 때문에 우산이 필요해요.',
        pronunciation: 'biga ogi ttaemune usani piryohaeyo',
        translation: { ko: '비가 오기 때문에 우산이 필요해요.', mn: 'Бороо орж байгаа учраас шүхэр хэрэгтэй.', ru: 'Нужен зонт, потому что идёт дождь.', vi: 'Vì trời mưa nên cần ô.' },
        slots: [{ slot: '{reason}', value: '비가 오다' }, { slot: '{result}', value: '우산이 필요해요' }]
      },
      {
        korean: '시험이 있기 때문에 공부해야 해요.',
        pronunciation: 'siheomi itgi ttaemune gongbuhaeya haeyo',
        translation: { ko: '시험이 있기 때문에 공부해야 해요.', mn: 'Шалгалт байгаа учраас хичээлээ хийх хэрэгтэй.', ru: 'Нужно учиться, потому что будет экзамен.', vi: 'Vì có bài thi nên phải học.' },
        slots: [{ slot: '{reason}', value: '시험이 있다' }, { slot: '{result}', value: '공부해야 해요' }]
      }
    ],
    difficulty: 2,
    category: 'reason'
  },

  // ============================================
  // Condition Patterns (조건)
  // ============================================
  {
    id: 'sp-020',
    unitId: 'topik1-unit4',
    pattern: '{condition} + (으)면 + {result}',
    patternKorean: '___(으)면 ___.',
    name: {
      ko: '~(으)면 (조건)',
      mn: '~бол',
      ru: 'Если ~',
      vi: 'Nếu ~'
    },
    description: {
      ko: '조건과 결과를 말할 때 사용해요.',
      mn: 'Нөхцөл ба үр дүнг хэлэхэд хэрэглэнэ.',
      ru: 'Используется для выражения условия и результата.',
      vi: 'Dùng để nói điều kiện và kết quả.'
    },
    grammarPoints: ['g1-022'],
    examples: [
      {
        korean: '시간이 있으면 영화 봐요.',
        pronunciation: 'sigani isseumyeon yeonghwa bwayo',
        translation: { ko: '시간이 있으면 영화 봐요.', mn: 'Цаг байвал кино үзнэ.', ru: 'Если будет время, посмотрим фильм.', vi: 'Nếu có thời gian thì xem phim.' },
        slots: [{ slot: '{condition}', value: '시간이 있다' }, { slot: '{result}', value: '영화 봐요' }]
      },
      {
        korean: '날씨가 좋으면 산책해요.',
        pronunciation: 'nalssiga joeumyeon sanchaekaeyo',
        translation: { ko: '날씨가 좋으면 산책해요.', mn: 'Цаг агаар сайн бол алхана.', ru: 'Если погода хорошая, гуляем.', vi: 'Nếu thời tiết đẹp thì đi dạo.' },
        slots: [{ slot: '{condition}', value: '날씨가 좋다' }, { slot: '{result}', value: '산책해요' }]
      }
    ],
    difficulty: 2,
    category: 'condition'
  },

  // ============================================
  // Desire/Want Patterns (희망/바람)
  // ============================================
  {
    id: 'sp-021',
    unitId: 'topik1-unit4',
    pattern: '{object} + 을/를 + {verb} + 고 싶어요',
    patternKorean: '___을/를 ___고 싶어요.',
    name: {
      ko: '~고 싶어요',
      mn: '~маар байна',
      ru: 'Хочу ~',
      vi: 'Muốn ~'
    },
    description: {
      ko: '하고 싶은 것을 말할 때 사용해요.',
      mn: 'Хийхийг хүссэн зүйлээ хэлэхэд хэрэглэнэ.',
      ru: 'Используется для выражения желания.',
      vi: 'Dùng để nói điều muốn làm.'
    },
    grammarPoints: ['g1-003', 'g1-010'],
    examples: [
      {
        korean: '한국 음식을 먹고 싶어요.',
        pronunciation: 'hanguk eumsigeul meokgo sipeoyo',
        translation: { ko: '한국 음식을 먹고 싶어요.', mn: 'Солонгос хоол идмээр байна.', ru: 'Хочу поесть корейскую еду.', vi: 'Tôi muốn ăn món Hàn.' },
        slots: [{ slot: '{object}', value: '한국 음식' }, { slot: '{verb}', value: '먹다' }]
      },
      {
        korean: '한국어를 잘하고 싶어요.',
        pronunciation: 'hangugeoreul jalhago sipeoyo',
        translation: { ko: '한국어를 잘하고 싶어요.', mn: 'Солонгос хэлийг сайн мэдмээр байна.', ru: 'Хочу хорошо говорить по-корейски.', vi: 'Tôi muốn giỏi tiếng Hàn.' },
        slots: [{ slot: '{object}', value: '한국어' }, { slot: '{verb}', value: '잘하다' }]
      }
    ],
    difficulty: 2,
    category: 'description'
  },

  // ============================================
  // Ability Patterns (능력)
  // ============================================
  {
    id: 'sp-022',
    unitId: 'topik1-unit5',
    pattern: '{object} + 을/를 + {verb} + (으)ㄹ 수 있어요',
    patternKorean: '___을/를 ___(으)ㄹ 수 있어요.',
    name: {
      ko: '~(으)ㄹ 수 있어요',
      mn: '~чадна',
      ru: 'Могу ~',
      vi: 'Có thể ~'
    },
    description: {
      ko: '무엇을 할 수 있는지 말할 때 사용해요.',
      mn: 'Юу хийж чадахыг хэлэхэд хэрэглэнэ.',
      ru: 'Используется для выражения способности.',
      vi: 'Dùng để nói có thể làm được gì.'
    },
    grammarPoints: ['g1-003', 'g1-015'],
    examples: [
      {
        korean: '한국어를 조금 말할 수 있어요.',
        pronunciation: 'hangugeoreul jogeum malhal su isseoyo',
        translation: { ko: '한국어를 조금 말할 수 있어요.', mn: 'Солонгосоор бага зэрэг ярьж чадна.', ru: 'Могу немного говорить по-корейски.', vi: 'Tôi có thể nói tiếng Hàn một chút.' },
        slots: [{ slot: '{object}', value: '한국어' }, { slot: '{verb}', value: '말하다' }]
      },
      {
        korean: '수영을 할 수 있어요.',
        pronunciation: 'suyeongeul hal su isseoyo',
        translation: { ko: '수영을 할 수 있어요.', mn: 'Сэлж чадна.', ru: 'Умею плавать.', vi: 'Tôi có thể bơi.' },
        slots: [{ slot: '{object}', value: '수영' }, { slot: '{verb}', value: '하다' }]
      }
    ],
    difficulty: 2,
    category: 'description'
  },

  // ============================================
  // Prohibition Patterns (금지)
  // ============================================
  {
    id: 'sp-023',
    unitId: 'topik1-unit3',
    pattern: '{verb} + 지 마세요',
    patternKorean: '___지 마세요.',
    name: {
      ko: '~지 마세요',
      mn: '~болохгүй',
      ru: 'Не ~',
      vi: 'Đừng ~'
    },
    description: {
      ko: '무엇을 하지 말라고 할 때 사용해요.',
      mn: 'Юу хийхгүй байхыг хэлэхэд хэрэглэнэ.',
      ru: 'Используется для просьбы не делать что-то.',
      vi: 'Dùng để yêu cầu không làm điều gì đó.'
    },
    grammarPoints: ['g1-030'],
    examples: [
      {
        korean: '담배 피우지 마세요.',
        pronunciation: 'dambae piuji maseyo',
        translation: { ko: '담배 피우지 마세요.', mn: 'Тамхи татаж болохгүй.', ru: 'Не курите.', vi: 'Xin đừng hút thuốc.' },
        slots: [{ slot: '{verb}', value: '피우다' }]
      },
      {
        korean: '걱정하지 마세요.',
        pronunciation: 'geokjeonghaji maseyo',
        translation: { ko: '걱정하지 마세요.', mn: 'Санаа зоволтгүй.', ru: 'Не беспокойтесь.', vi: 'Đừng lo lắng.' },
        slots: [{ slot: '{verb}', value: '걱정하다' }]
      }
    ],
    difficulty: 2,
    category: 'request'
  },

  // ============================================
  // Suggestion Patterns (제안)
  // ============================================
  {
    id: 'sp-024',
    unitId: 'topik1-unit4',
    pattern: '같이 + {verb} + (으)ㄹ까요?',
    patternKorean: '같이 ___(으)ㄹ까요?',
    name: {
      ko: '같이 ~(으)ㄹ까요?',
      mn: 'Хамт ~уу?',
      ru: 'Давай вместе ~?',
      vi: 'Cùng ~ nhé?'
    },
    description: {
      ko: '함께 무엇을 하자고 제안할 때 사용해요.',
      mn: 'Хамт юу хийхийг санал болгоход хэрэглэнэ.',
      ru: 'Используется для предложения сделать что-то вместе.',
      vi: 'Dùng để đề nghị cùng làm gì đó.'
    },
    grammarPoints: ['g1-031'],
    examples: [
      {
        korean: '같이 점심 먹을까요?',
        pronunciation: 'gachi jeomsim meogeulkkayo',
        translation: { ko: '같이 점심 먹을까요?', mn: 'Хамт өдрийн хоол идэх үү?', ru: 'Пообедаем вместе?', vi: 'Cùng ăn trưa nhé?' },
        slots: [{ slot: '{verb}', value: '먹다' }]
      },
      {
        korean: '같이 공부할까요?',
        pronunciation: 'gachi gongbuhalkkayo',
        translation: { ko: '같이 공부할까요?', mn: 'Хамт хичээл хийх үү?', ru: 'Поучимся вместе?', vi: 'Cùng học nhé?' },
        slots: [{ slot: '{verb}', value: '공부하다' }]
      }
    ],
    difficulty: 2,
    category: 'request'
  },
  {
    id: 'sp-025',
    unitId: 'topik1-unit4',
    pattern: '{verb} + (으)ㅂ시다',
    patternKorean: '___(으)ㅂ시다.',
    name: {
      ko: '~(으)ㅂ시다',
      mn: '~цгаая',
      ru: 'Давайте ~',
      vi: 'Chúng ta ~ đi'
    },
    description: {
      ko: '함께 무엇을 하자고 제안할 때 사용해요.',
      mn: 'Хамт юу хийхийг санал болгоход хэрэглэнэ.',
      ru: 'Используется для приглашения делать что-то вместе.',
      vi: 'Dùng để mời cùng làm gì đó.'
    },
    grammarPoints: ['g1-032'],
    examples: [
      {
        korean: '시작합시다!',
        pronunciation: 'sijakhapshida',
        translation: { ko: '시작합시다!', mn: 'Эхлэцгээе!', ru: 'Давайте начнём!', vi: 'Bắt đầu nào!' },
        slots: [{ slot: '{verb}', value: '시작하다' }]
      },
      {
        korean: '같이 갑시다.',
        pronunciation: 'gachi gapshida',
        translation: { ko: '같이 갑시다.', mn: 'Хамт явцгаая.', ru: 'Пойдём вместе.', vi: 'Cùng đi nào.' },
        slots: [{ slot: '{verb}', value: '가다' }]
      }
    ],
    difficulty: 2,
    category: 'request'
  }
];

// ============================================
// Helper Functions
// ============================================

export function getPatternsByCategory(category: PatternCategory): SentencePattern[] {
  return TOPIK1_SENTENCE_PATTERNS.filter(p => p.category === category);
}

export function getPatternsByUnit(unitId: string): SentencePattern[] {
  return TOPIK1_SENTENCE_PATTERNS.filter(p => p.unitId === unitId);
}

export function getPatternsByDifficulty(difficulty: 1 | 2 | 3): SentencePattern[] {
  return TOPIK1_SENTENCE_PATTERNS.filter(p => p.difficulty === difficulty);
}

export function getPatternsByGrammar(grammarId: string): SentencePattern[] {
  return TOPIK1_SENTENCE_PATTERNS.filter(p => p.grammarPoints.includes(grammarId));
}

export function getPatternById(id: string): SentencePattern | undefined {
  return TOPIK1_SENTENCE_PATTERNS.find(p => p.id === id);
}

export function getRandomPatterns(count: number, difficulty?: 1 | 2 | 3): SentencePattern[] {
  let pool = difficulty
    ? TOPIK1_SENTENCE_PATTERNS.filter(p => p.difficulty <= difficulty)
    : TOPIK1_SENTENCE_PATTERNS;

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getTotalPatternCount(): number {
  return TOPIK1_SENTENCE_PATTERNS.length;
}
