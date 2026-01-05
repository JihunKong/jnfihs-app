// TOPIK 1 Vocabulary Database
// Organized by units and lessons from korean-curriculum.ts

import { LocalizedText } from './korean-curriculum';
import { WordItem } from './exercise-types';

// ============================================
// Vocabulary Type Extensions
// ============================================

export interface VocabularyWord extends WordItem {
  unitId: string;
  sectionId: string;
  lessonId: string;
  level: 1 | 2 | 3 | 4 | 5;  // TOPIK level
  frequency: number;         // Usage frequency rank (lower = more common)
  tags: string[];            // Categories like 'greeting', 'number', 'food'
}

export interface GrammarPoint {
  id: string;
  unitId: string;
  korean: string;
  name: LocalizedText;
  description: LocalizedText;
  pattern: string;
  examples: {
    korean: string;
    translation: LocalizedText;
  }[];
  level: 1 | 2 | 3 | 4 | 5;
}

// ============================================
// Unit 1: 인사하기 (Greetings)
// ============================================

export const UNIT1_VOCABULARY: VocabularyWord[] = [
  // Section 1: 기본 인사 (Basic Greetings)
  {
    id: 'v1-001',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec1',
    lessonId: 'topik1-unit1-sec1-lesson1',
    korean: '안녕하세요',
    pronunciation: 'annyeonghaseyo',
    meaning: { ko: '안녕하세요', mn: 'Сайн байна уу', ru: 'Здравствуйте', vi: 'Xin chào' },
    partOfSpeech: 'expression',
    exampleSentence: { korean: '안녕하세요, 저는 민수예요.', translation: { ko: '안녕하세요, 저는 민수예요.', mn: 'Сайн байна уу, би Минсу байна.', ru: 'Здравствуйте, я Минсу.', vi: 'Xin chào, tôi là Minsu.' } },
    level: 1,
    frequency: 1,
    tags: ['greeting', 'basic', 'polite']
  },
  {
    id: 'v1-002',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec1',
    lessonId: 'topik1-unit1-sec1-lesson1',
    korean: '안녕히 가세요',
    pronunciation: 'annyeonghi gaseyo',
    meaning: { ko: '안녕히 가세요', mn: 'Баяртай (явж буй хүнд)', ru: 'До свидания (уходящему)', vi: 'Tạm biệt (người đi)' },
    partOfSpeech: 'expression',
    exampleSentence: { korean: '수업 끝났어요. 안녕히 가세요!', translation: { ko: '수업 끝났어요. 안녕히 가세요!', mn: 'Хичээл дууслаа. Баяртай!', ru: 'Урок окончен. До свидания!', vi: 'Lớp học kết thúc. Tạm biệt!' } },
    level: 1,
    frequency: 5,
    tags: ['greeting', 'farewell', 'polite']
  },
  {
    id: 'v1-003',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec1',
    lessonId: 'topik1-unit1-sec1-lesson1',
    korean: '안녕히 계세요',
    pronunciation: 'annyeonghi gyeseyo',
    meaning: { ko: '안녕히 계세요', mn: 'Баяртай (үлдэж буй хүнд)', ru: 'До свидания (остающемуся)', vi: 'Tạm biệt (người ở lại)' },
    partOfSpeech: 'expression',
    exampleSentence: { korean: '저 먼저 가요. 안녕히 계세요!', translation: { ko: '저 먼저 가요. 안녕히 계세요!', mn: 'Би эхэлж явъя. Баяртай!', ru: 'Я пойду первым. До свидания!', vi: 'Tôi đi trước. Tạm biệt!' } },
    level: 1,
    frequency: 6,
    tags: ['greeting', 'farewell', 'polite']
  },
  {
    id: 'v1-004',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec1',
    lessonId: 'topik1-unit1-sec1-lesson1',
    korean: '감사합니다',
    pronunciation: 'gamsahamnida',
    meaning: { ko: '감사합니다', mn: 'Баярлалаа', ru: 'Спасибо', vi: 'Cảm ơn' },
    partOfSpeech: 'expression',
    exampleSentence: { korean: '도와주셔서 감사합니다.', translation: { ko: '도와주셔서 감사합니다.', mn: 'Туслсанд баярлалаа.', ru: 'Спасибо за помощь.', vi: 'Cảm ơn bạn đã giúp đỡ.' } },
    level: 1,
    frequency: 2,
    tags: ['greeting', 'thanks', 'polite']
  },
  {
    id: 'v1-005',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec1',
    lessonId: 'topik1-unit1-sec1-lesson1',
    korean: '고마워요',
    pronunciation: 'gomawoyo',
    meaning: { ko: '고마워요', mn: 'Баярлалаа (энгийн)', ru: 'Спасибо (неформально)', vi: 'Cảm ơn (thân mật)' },
    partOfSpeech: 'expression',
    exampleSentence: { korean: '선물 고마워요!', translation: { ko: '선물 고마워요!', mn: 'Бэлэгт баярлалаа!', ru: 'Спасибо за подарок!', vi: 'Cảm ơn món quà!' } },
    level: 1,
    frequency: 8,
    tags: ['greeting', 'thanks', 'casual']
  },
  {
    id: 'v1-006',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec1',
    lessonId: 'topik1-unit1-sec1-lesson2',
    korean: '죄송합니다',
    pronunciation: 'joesonghamnida',
    meaning: { ko: '죄송합니다', mn: 'Уучлаарай', ru: 'Извините', vi: 'Xin lỗi' },
    partOfSpeech: 'expression',
    exampleSentence: { korean: '늦어서 죄송합니다.', translation: { ko: '늦어서 죄송합니다.', mn: 'Хоцорсонд уучлаарай.', ru: 'Извините за опоздание.', vi: 'Xin lỗi vì đến muộn.' } },
    level: 1,
    frequency: 3,
    tags: ['greeting', 'apology', 'polite']
  },
  {
    id: 'v1-007',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec1',
    lessonId: 'topik1-unit1-sec1-lesson2',
    korean: '미안해요',
    pronunciation: 'mianhaeyo',
    meaning: { ko: '미안해요', mn: 'Уучлаарай (энгийн)', ru: 'Прости (неформально)', vi: 'Xin lỗi (thân mật)' },
    partOfSpeech: 'expression',
    exampleSentence: { korean: '미안해요, 제 잘못이에요.', translation: { ko: '미안해요, 제 잘못이에요.', mn: 'Уучлаарай, миний буруу.', ru: 'Прости, это моя вина.', vi: 'Xin lỗi, đó là lỗi của tôi.' } },
    level: 1,
    frequency: 10,
    tags: ['greeting', 'apology', 'casual']
  },
  {
    id: 'v1-008',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec1',
    lessonId: 'topik1-unit1-sec1-lesson2',
    korean: '네',
    pronunciation: 'ne',
    meaning: { ko: '네', mn: 'Тийм', ru: 'Да', vi: 'Vâng' },
    partOfSpeech: 'expression',
    exampleSentence: { korean: '네, 알겠어요.', translation: { ko: '네, 알겠어요.', mn: 'Тийм, ойлголоо.', ru: 'Да, понял.', vi: 'Vâng, tôi hiểu.' } },
    level: 1,
    frequency: 4,
    tags: ['response', 'basic']
  },
  {
    id: 'v1-009',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec1',
    lessonId: 'topik1-unit1-sec1-lesson2',
    korean: '아니요',
    pronunciation: 'aniyo',
    meaning: { ko: '아니요', mn: 'Үгүй', ru: 'Нет', vi: 'Không' },
    partOfSpeech: 'expression',
    exampleSentence: { korean: '아니요, 괜찮아요.', translation: { ko: '아니요, 괜찮아요.', mn: 'Үгүй, зүгээр.', ru: 'Нет, всё в порядке.', vi: 'Không, không sao.' } },
    level: 1,
    frequency: 7,
    tags: ['response', 'basic']
  },

  // Section 2: 자기소개 (Self Introduction)
  {
    id: 'v1-010',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson1',
    korean: '저',
    pronunciation: 'jeo',
    meaning: { ko: '저', mn: 'Би (хүндэтгэлтэй)', ru: 'Я (вежливо)', vi: 'Tôi (lịch sự)' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '저는 학생이에요.', translation: { ko: '저는 학생이에요.', mn: 'Би оюутан байна.', ru: 'Я студент.', vi: 'Tôi là sinh viên.' } },
    level: 1,
    frequency: 9,
    tags: ['pronoun', 'self', 'polite']
  },
  {
    id: 'v1-011',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson1',
    korean: '이름',
    pronunciation: 'ireum',
    meaning: { ko: '이름', mn: 'Нэр', ru: 'Имя', vi: 'Tên' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '이름이 뭐예요?', translation: { ko: '이름이 뭐예요?', mn: 'Таны нэр хэн бэ?', ru: 'Как вас зовут?', vi: 'Tên bạn là gì?' } },
    level: 1,
    frequency: 15,
    tags: ['personal', 'basic']
  },
  {
    id: 'v1-012',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson1',
    korean: '나라',
    pronunciation: 'nara',
    meaning: { ko: '나라', mn: 'Улс', ru: 'Страна', vi: 'Đất nước' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '어느 나라에서 왔어요?', translation: { ko: '어느 나라에서 왔어요?', mn: 'Та ямар улсаас ирсэн бэ?', ru: 'Из какой вы страны?', vi: 'Bạn đến từ nước nào?' } },
    level: 1,
    frequency: 25,
    tags: ['country', 'origin']
  },
  {
    id: 'v1-013',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson1',
    korean: '학생',
    pronunciation: 'haksaeng',
    meaning: { ko: '학생', mn: 'Оюутан', ru: 'Студент', vi: 'Học sinh' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '저는 고등학생이에요.', translation: { ko: '저는 고등학생이에요.', mn: 'Би ахлах сургуулийн сурагч.', ru: 'Я старшеклассник.', vi: 'Tôi là học sinh cấp ba.' } },
    level: 1,
    frequency: 20,
    tags: ['person', 'occupation']
  },
  {
    id: 'v1-014',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson1',
    korean: '선생님',
    pronunciation: 'seonsaengnim',
    meaning: { ko: '선생님', mn: 'Багш', ru: 'Учитель', vi: 'Thầy/Cô giáo' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '선생님, 질문 있어요.', translation: { ko: '선생님, 질문 있어요.', mn: 'Багш аа, асуулт байна.', ru: 'Учитель, у меня вопрос.', vi: 'Thầy ơi, em có câu hỏi.' } },
    level: 1,
    frequency: 18,
    tags: ['person', 'occupation', 'respect']
  },
  {
    id: 'v1-015',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '친구',
    pronunciation: 'chingu',
    meaning: { ko: '친구', mn: 'Найз', ru: 'Друг', vi: 'Bạn bè' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '제 친구예요.', translation: { ko: '제 친구예요.', mn: 'Энэ бол миний найз.', ru: 'Это мой друг.', vi: 'Đây là bạn của tôi.' } },
    level: 1,
    frequency: 12,
    tags: ['person', 'relationship']
  },
  {
    id: 'v1-016',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '가족',
    pronunciation: 'gajok',
    meaning: { ko: '가족', mn: 'Гэр бүл', ru: 'Семья', vi: 'Gia đình' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '가족이 몇 명이에요?', translation: { ko: '가족이 몇 명이에요?', mn: 'Гэр бүлд хэдэн хүн байдаг вэ?', ru: 'Сколько человек в семье?', vi: 'Gia đình bạn có bao nhiêu người?' } },
    level: 1,
    frequency: 22,
    tags: ['family', 'personal']
  },
  {
    id: 'v1-017',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '아버지',
    pronunciation: 'abeoji',
    meaning: { ko: '아버지', mn: 'Аав', ru: 'Отец', vi: 'Bố' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '아버지는 회사원이에요.', translation: { ko: '아버지는 회사원이에요.', mn: 'Аав маань компанид ажилладаг.', ru: 'Мой отец офисный работник.', vi: 'Bố tôi là nhân viên văn phòng.' } },
    level: 1,
    frequency: 30,
    tags: ['family', 'person']
  },
  {
    id: 'v1-018',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '어머니',
    pronunciation: 'eomeoni',
    meaning: { ko: '어머니', mn: 'Ээж', ru: 'Мать', vi: 'Mẹ' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '어머니는 요리를 잘해요.', translation: { ko: '어머니는 요리를 잘해요.', mn: 'Ээж маань хоол сайн хийдэг.', ru: 'Моя мама хорошо готовит.', vi: 'Mẹ tôi nấu ăn rất ngon.' } },
    level: 1,
    frequency: 31,
    tags: ['family', 'person']
  },
  // Additional family members
  {
    id: 'v1-019',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '형',
    pronunciation: 'hyeong',
    meaning: { ko: '형', mn: 'Ах (эрэгтэй хүний)', ru: 'Старший брат (муж.)', vi: 'Anh trai (nam nói)' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '형이 대학생이에요.', translation: { ko: '형이 대학생이에요.', mn: 'Ах маань их сургуулийн оюутан.', ru: 'Мой старший брат студент.', vi: 'Anh trai tôi là sinh viên đại học.' } },
    level: 1,
    frequency: 32,
    tags: ['family', 'sibling']
  },
  {
    id: 'v1-020',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '누나',
    pronunciation: 'nuna',
    meaning: { ko: '누나', mn: 'Эгч (эрэгтэй хүний)', ru: 'Старшая сестра (муж.)', vi: 'Chị gái (nam nói)' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '누나가 회사에 다녀요.', translation: { ko: '누나가 회사에 다녀요.', mn: 'Эгч маань компанид ажилладаг.', ru: 'Моя старшая сестра работает в компании.', vi: 'Chị gái tôi làm việc ở công ty.' } },
    level: 1,
    frequency: 33,
    tags: ['family', 'sibling']
  },
  {
    id: 'v1-021',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '오빠',
    pronunciation: 'oppa',
    meaning: { ko: '오빠', mn: 'Ах (эмэгтэй хүний)', ru: 'Старший брат (жен.)', vi: 'Anh trai (nữ nói)' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '오빠가 키가 커요.', translation: { ko: '오빠가 키가 커요.', mn: 'Ах маань өндөр.', ru: 'Мой старший брат высокий.', vi: 'Anh trai tôi cao.' } },
    level: 1,
    frequency: 34,
    tags: ['family', 'sibling']
  },
  {
    id: 'v1-022',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '언니',
    pronunciation: 'eonni',
    meaning: { ko: '언니', mn: 'Эгч (эмэгтэй хүний)', ru: 'Старшая сестра (жен.)', vi: 'Chị gái (nữ nói)' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '언니가 예뻐요.', translation: { ko: '언니가 예뻐요.', mn: 'Эгч маань гоо үзэсгэлэнтэй.', ru: 'Моя старшая сестра красивая.', vi: 'Chị gái tôi đẹp.' } },
    level: 1,
    frequency: 35,
    tags: ['family', 'sibling']
  },
  {
    id: 'v1-023',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '동생',
    pronunciation: 'dongsaeng',
    meaning: { ko: '동생', mn: 'Дүү', ru: 'Младший брат/сестра', vi: 'Em trai/Em gái' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '동생이 두 명 있어요.', translation: { ko: '동생이 두 명 있어요.', mn: 'Хоёр дүү байна.', ru: 'У меня двое младших братьев/сестёр.', vi: 'Tôi có hai em.' } },
    level: 1,
    frequency: 36,
    tags: ['family', 'sibling']
  },
  {
    id: 'v1-024',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '할아버지',
    pronunciation: 'harabeoji',
    meaning: { ko: '할아버지', mn: 'Өвөө', ru: 'Дедушка', vi: 'Ông' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '할아버지가 건강하세요.', translation: { ko: '할아버지가 건강하세요.', mn: 'Өвөө эрүүл байна.', ru: 'Дедушка здоров.', vi: 'Ông khỏe mạnh.' } },
    level: 1,
    frequency: 37,
    tags: ['family', 'person']
  },
  {
    id: 'v1-025',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '할머니',
    pronunciation: 'halmeoni',
    meaning: { ko: '할머니', mn: 'Эмээ', ru: 'Бабушка', vi: 'Bà' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '할머니가 김치를 만들어요.', translation: { ko: '할머니가 김치를 만들어요.', mn: 'Эмээ кимчи хийдэг.', ru: 'Бабушка делает кимчи.', vi: 'Bà làm kim chi.' } },
    level: 1,
    frequency: 38,
    tags: ['family', 'person']
  },
  // Additional pronouns and basic words
  {
    id: 'v1-026',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson1',
    korean: '나',
    pronunciation: 'na',
    meaning: { ko: '나', mn: 'Би (энгийн)', ru: 'Я (неформально)', vi: 'Tôi (thân mật)' },
    partOfSpeech: 'pronoun',
    exampleSentence: { korean: '나는 학생이야.', translation: { ko: '나는 학생이야.', mn: 'Би оюутан.', ru: 'Я студент.', vi: 'Tôi là sinh viên.' } },
    level: 1,
    frequency: 10,
    tags: ['pronoun', 'basic', 'casual']
  },
  {
    id: 'v1-027',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson1',
    korean: '우리',
    pronunciation: 'uri',
    meaning: { ko: '우리', mn: 'Бид', ru: 'Мы/наш', vi: 'Chúng tôi' },
    partOfSpeech: 'pronoun',
    exampleSentence: { korean: '우리 학교가 커요.', translation: { ko: '우리 학교가 커요.', mn: 'Манай сургууль том.', ru: 'Наша школа большая.', vi: 'Trường chúng tôi lớn.' } },
    level: 1,
    frequency: 11,
    tags: ['pronoun', 'basic']
  },
  {
    id: 'v1-028',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec1',
    lessonId: 'topik1-unit1-sec1-lesson2',
    korean: '처음 뵙겠습니다',
    pronunciation: 'cheoeum boepgesseumnida',
    meaning: { ko: '처음 뵙겠습니다', mn: 'Танилцахад таатай байна', ru: 'Приятно познакомиться', vi: 'Rất vui được gặp' },
    partOfSpeech: 'expression',
    exampleSentence: { korean: '처음 뵙겠습니다. 저는 김민수예요.', translation: { ko: '처음 뵙겠습니다. 저는 김민수예요.', mn: 'Танилцахад таатай байна. Би Ким Минсү байна.', ru: 'Приятно познакомиться. Я Ким Минсу.', vi: 'Rất vui được gặp. Tôi là Kim Minsu.' } },
    level: 1,
    frequency: 13,
    tags: ['greeting', 'introduction', 'polite']
  },
  {
    id: 'v1-029',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec1',
    lessonId: 'topik1-unit1-sec1-lesson2',
    korean: '반갑습니다',
    pronunciation: 'bangapseumnida',
    meaning: { ko: '반갑습니다', mn: 'Баяртай байна', ru: 'Рад встрече', vi: 'Rất vui' },
    partOfSpeech: 'expression',
    exampleSentence: { korean: '만나서 반갑습니다.', translation: { ko: '만나서 반갑습니다.', mn: 'Уулзсандаа баяртай байна.', ru: 'Рад познакомиться.', vi: 'Rất vui được gặp bạn.' } },
    level: 1,
    frequency: 14,
    tags: ['greeting', 'introduction', 'polite']
  },
  {
    id: 'v1-030',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec1',
    lessonId: 'topik1-unit1-sec1-lesson1',
    korean: '잘 지내요',
    pronunciation: 'jal jinaeyo',
    meaning: { ko: '잘 지내요', mn: 'Сайн байна', ru: 'Хорошо живу', vi: 'Tôi khỏe' },
    partOfSpeech: 'expression',
    exampleSentence: { korean: '잘 지내요? 저도 잘 지내요.', translation: { ko: '잘 지내요? 저도 잘 지내요.', mn: 'Сайн байна уу? Би ч сайн байна.', ru: 'Как дела? У меня тоже хорошо.', vi: 'Bạn khỏe không? Tôi cũng khỏe.' } },
    level: 1,
    frequency: 16,
    tags: ['greeting', 'wellbeing']
  }
];

// ============================================
// Unit 2: 숫자와 시간 (Numbers and Time)
// ============================================

export const UNIT2_VOCABULARY: VocabularyWord[] = [
  // Section 1: 숫자 (Numbers)
  {
    id: 'v2-001',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec1',
    lessonId: 'topik1-unit2-sec1-lesson1',
    korean: '하나',
    pronunciation: 'hana',
    meaning: { ko: '하나', mn: 'Нэг', ru: 'Один', vi: 'Một' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '사과 하나 주세요.', translation: { ko: '사과 하나 주세요.', mn: 'Нэг алим өгнө үү.', ru: 'Дайте одно яблоко, пожалуйста.', vi: 'Cho tôi một quả táo.' } },
    level: 1,
    frequency: 35,
    tags: ['number', 'native-korean']
  },
  {
    id: 'v2-002',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec1',
    lessonId: 'topik1-unit2-sec1-lesson1',
    korean: '둘',
    pronunciation: 'dul',
    meaning: { ko: '둘', mn: 'Хоёр', ru: 'Два', vi: 'Hai' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '친구 둘이 왔어요.', translation: { ko: '친구 둘이 왔어요.', mn: 'Хоёр найз ирлээ.', ru: 'Пришли два друга.', vi: 'Hai người bạn đã đến.' } },
    level: 1,
    frequency: 36,
    tags: ['number', 'native-korean']
  },
  {
    id: 'v2-003',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec1',
    lessonId: 'topik1-unit2-sec1-lesson1',
    korean: '셋',
    pronunciation: 'set',
    meaning: { ko: '셋', mn: 'Гурав', ru: 'Три', vi: 'Ba' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '책이 셋 있어요.', translation: { ko: '책이 셋 있어요.', mn: 'Гурван ном байна.', ru: 'Есть три книги.', vi: 'Có ba quyển sách.' } },
    level: 1,
    frequency: 37,
    tags: ['number', 'native-korean']
  },
  {
    id: 'v2-004',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec1',
    lessonId: 'topik1-unit2-sec1-lesson1',
    korean: '넷',
    pronunciation: 'net',
    meaning: { ko: '넷', mn: 'Дөрөв', ru: 'Четыре', vi: 'Bốn' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '의자가 넷 있어요.', translation: { ko: '의자가 넷 있어요.', mn: 'Дөрвөн сандал байна.', ru: 'Есть четыре стула.', vi: 'Có bốn cái ghế.' } },
    level: 1,
    frequency: 38,
    tags: ['number', 'native-korean']
  },
  {
    id: 'v2-005',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec1',
    lessonId: 'topik1-unit2-sec1-lesson1',
    korean: '다섯',
    pronunciation: 'daseot',
    meaning: { ko: '다섯', mn: 'Тав', ru: 'Пять', vi: 'Năm' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '손가락이 다섯 개예요.', translation: { ko: '손가락이 다섯 개예요.', mn: 'Таван хуруу байна.', ru: 'Пять пальцев.', vi: 'Có năm ngón tay.' } },
    level: 1,
    frequency: 39,
    tags: ['number', 'native-korean']
  },
  {
    id: 'v2-006',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec1',
    lessonId: 'topik1-unit2-sec1-lesson2',
    korean: '일',
    pronunciation: 'il',
    meaning: { ko: '일', mn: 'Нэг (Хятад)', ru: 'Один (китайск.)', vi: 'Một (Hán)' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '일월 일일이에요.', translation: { ko: '일월 일일이에요.', mn: 'Нэгдүгээр сарын нэгний өдөр.', ru: 'Первое января.', vi: 'Ngày 1 tháng 1.' } },
    level: 1,
    frequency: 40,
    tags: ['number', 'sino-korean']
  },
  {
    id: 'v2-007',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec1',
    lessonId: 'topik1-unit2-sec1-lesson2',
    korean: '이',
    pronunciation: 'i',
    meaning: { ko: '이', mn: 'Хоёр (Хятад)', ru: 'Два (китайск.)', vi: 'Hai (Hán)' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '이천이십오년이에요.', translation: { ko: '이천이십오년이에요.', mn: '2025 он.', ru: '2025 год.', vi: 'Năm 2025.' } },
    level: 1,
    frequency: 41,
    tags: ['number', 'sino-korean']
  },
  {
    id: 'v2-008',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec1',
    lessonId: 'topik1-unit2-sec1-lesson2',
    korean: '삼',
    pronunciation: 'sam',
    meaning: { ko: '삼', mn: 'Гурав (Хятад)', ru: 'Три (китайск.)', vi: 'Ba (Hán)' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '삼월에 봄이 와요.', translation: { ko: '삼월에 봄이 와요.', mn: 'Гуравдугаар сард хавар ирдэг.', ru: 'В марте наступает весна.', vi: 'Tháng 3 là mùa xuân.' } },
    level: 1,
    frequency: 42,
    tags: ['number', 'sino-korean']
  },

  // Section 2: 시간 (Time)
  {
    id: 'v2-009',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson1',
    korean: '시',
    pronunciation: 'si',
    meaning: { ko: '시', mn: 'Цаг', ru: 'Час', vi: 'Giờ' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '지금 몇 시예요?', translation: { ko: '지금 몇 시예요?', mn: 'Одоо хэдэн цаг болж байна?', ru: 'Который сейчас час?', vi: 'Bây giờ là mấy giờ?' } },
    level: 1,
    frequency: 45,
    tags: ['time', 'basic']
  },
  {
    id: 'v2-010',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson1',
    korean: '분',
    pronunciation: 'bun',
    meaning: { ko: '분', mn: 'Минут', ru: 'Минута', vi: 'Phút' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '십 분 후에 만나요.', translation: { ko: '십 분 후에 만나요.', mn: 'Арван минутын дараа уулзъя.', ru: 'Встретимся через 10 минут.', vi: 'Gặp nhau sau 10 phút.' } },
    level: 1,
    frequency: 46,
    tags: ['time', 'basic']
  },
  {
    id: 'v2-011',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson1',
    korean: '오전',
    pronunciation: 'ojeon',
    meaning: { ko: '오전', mn: 'Өглөө', ru: 'Утро/AM', vi: 'Buổi sáng' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '오전 아홉 시에 학교에 가요.', translation: { ko: '오전 아홉 시에 학교에 가요.', mn: 'Өглөөний 9 цагт сургууль руу явна.', ru: 'Иду в школу в 9 утра.', vi: 'Tôi đi học lúc 9 giờ sáng.' } },
    level: 1,
    frequency: 50,
    tags: ['time', 'period']
  },
  {
    id: 'v2-012',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson1',
    korean: '오후',
    pronunciation: 'ohu',
    meaning: { ko: '오후', mn: 'Үдээс хойш', ru: 'После обеда/PM', vi: 'Buổi chiều' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '오후 세 시에 수업이 끝나요.', translation: { ko: '오후 세 시에 수업이 끝나요.', mn: 'Үдээс хойш 3 цагт хичээл дуусна.', ru: 'Занятия заканчиваются в 3 часа дня.', vi: 'Lớp học kết thúc lúc 3 giờ chiều.' } },
    level: 1,
    frequency: 51,
    tags: ['time', 'period']
  },
  {
    id: 'v2-013',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '오늘',
    pronunciation: 'oneul',
    meaning: { ko: '오늘', mn: 'Өнөөдөр', ru: 'Сегодня', vi: 'Hôm nay' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '오늘 날씨가 좋아요.', translation: { ko: '오늘 날씨가 좋아요.', mn: 'Өнөөдөр цаг агаар сайхан байна.', ru: 'Сегодня хорошая погода.', vi: 'Hôm nay thời tiết đẹp.' } },
    level: 1,
    frequency: 55,
    tags: ['time', 'day']
  },
  {
    id: 'v2-014',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '내일',
    pronunciation: 'naeil',
    meaning: { ko: '내일', mn: 'Маргааш', ru: 'Завтра', vi: 'Ngày mai' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '내일 시험이 있어요.', translation: { ko: '내일 시험이 있어요.', mn: 'Маргааш шалгалт байна.', ru: 'Завтра экзамен.', vi: 'Ngày mai có kỳ thi.' } },
    level: 1,
    frequency: 56,
    tags: ['time', 'day']
  },
  {
    id: 'v2-015',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '어제',
    pronunciation: 'eoje',
    meaning: { ko: '어제', mn: 'Өчигдөр', ru: 'Вчера', vi: 'Hôm qua' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '어제 영화를 봤어요.', translation: { ko: '어제 영화를 봤어요.', mn: 'Өчигдөр кино үзсэн.', ru: 'Вчера смотрел фильм.', vi: 'Hôm qua tôi đã xem phim.' } },
    level: 1,
    frequency: 57,
    tags: ['time', 'day']
  },
  // More native Korean numbers (6-10)
  {
    id: 'v2-016',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec1',
    lessonId: 'topik1-unit2-sec1-lesson1',
    korean: '여섯',
    pronunciation: 'yeoseot',
    meaning: { ko: '여섯', mn: 'Зургаа', ru: 'Шесть', vi: 'Sáu' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '사과가 여섯 개 있어요.', translation: { ko: '사과가 여섯 개 있어요.', mn: 'Зургаан алим байна.', ru: 'Есть шесть яблок.', vi: 'Có sáu quả táo.' } },
    level: 1,
    frequency: 58,
    tags: ['number', 'native-korean']
  },
  {
    id: 'v2-017',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec1',
    lessonId: 'topik1-unit2-sec1-lesson1',
    korean: '일곱',
    pronunciation: 'ilgop',
    meaning: { ko: '일곱', mn: 'Долоо', ru: 'Семь', vi: 'Bảy' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '일주일은 일곱 날이에요.', translation: { ko: '일주일은 일곱 날이에요.', mn: 'Нэг долоо хоног долоон өдөр.', ru: 'В неделе семь дней.', vi: 'Một tuần có bảy ngày.' } },
    level: 1,
    frequency: 59,
    tags: ['number', 'native-korean']
  },
  {
    id: 'v2-018',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec1',
    lessonId: 'topik1-unit2-sec1-lesson1',
    korean: '여덟',
    pronunciation: 'yeodeol',
    meaning: { ko: '여덟', mn: 'Найм', ru: 'Восемь', vi: 'Tám' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '여덟 시에 일어나요.', translation: { ko: '여덟 시에 일어나요.', mn: 'Найман цагт босно.', ru: 'Встаю в восемь часов.', vi: 'Tôi dậy lúc tám giờ.' } },
    level: 1,
    frequency: 60,
    tags: ['number', 'native-korean']
  },
  {
    id: 'v2-019',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec1',
    lessonId: 'topik1-unit2-sec1-lesson1',
    korean: '아홉',
    pronunciation: 'ahop',
    meaning: { ko: '아홉', mn: 'Ес', ru: 'Девять', vi: 'Chín' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '아홉 시에 학교에 가요.', translation: { ko: '아홉 시에 학교에 가요.', mn: 'Есөн цагт сургууль руу явна.', ru: 'Иду в школу в девять.', vi: 'Tôi đi học lúc chín giờ.' } },
    level: 1,
    frequency: 61,
    tags: ['number', 'native-korean']
  },
  {
    id: 'v2-020',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec1',
    lessonId: 'topik1-unit2-sec1-lesson1',
    korean: '열',
    pronunciation: 'yeol',
    meaning: { ko: '열', mn: 'Арав', ru: 'Десять', vi: 'Mười' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '열 명이 왔어요.', translation: { ko: '열 명이 왔어요.', mn: 'Арван хүн ирлээ.', ru: 'Пришли десять человек.', vi: 'Mười người đã đến.' } },
    level: 1,
    frequency: 62,
    tags: ['number', 'native-korean']
  },
  // More sino-Korean numbers
  {
    id: 'v2-021',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec1',
    lessonId: 'topik1-unit2-sec1-lesson2',
    korean: '사',
    pronunciation: 'sa',
    meaning: { ko: '사', mn: 'Дөрөв (Хятад)', ru: 'Четыре (китайск.)', vi: 'Bốn (Hán)' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '사월은 봄이에요.', translation: { ko: '사월은 봄이에요.', mn: 'Дөрөвдүгээр сар хавар байна.', ru: 'Апрель - весна.', vi: 'Tháng 4 là mùa xuân.' } },
    level: 1,
    frequency: 63,
    tags: ['number', 'sino-korean']
  },
  {
    id: 'v2-022',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec1',
    lessonId: 'topik1-unit2-sec1-lesson2',
    korean: '오',
    pronunciation: 'o',
    meaning: { ko: '오', mn: 'Тав (Хятад)', ru: 'Пять (китайск.)', vi: 'Năm (Hán)' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '오월 오일은 어린이날이에요.', translation: { ko: '오월 오일은 어린이날이에요.', mn: '5-р сарын 5 бол хүүхдийн өдөр.', ru: '5 мая - День детей.', vi: 'Ngày 5 tháng 5 là ngày Thiếu nhi.' } },
    level: 1,
    frequency: 64,
    tags: ['number', 'sino-korean']
  },
  {
    id: 'v2-023',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec1',
    lessonId: 'topik1-unit2-sec1-lesson2',
    korean: '십',
    pronunciation: 'sip',
    meaning: { ko: '십', mn: 'Арав (Хятад)', ru: 'Десять (китайск.)', vi: 'Mười (Hán)' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '십 분 후에 와요.', translation: { ko: '십 분 후에 와요.', mn: '10 минутын дараа ирнэ.', ru: 'Приду через 10 минут.', vi: 'Tôi sẽ đến sau 10 phút.' } },
    level: 1,
    frequency: 65,
    tags: ['number', 'sino-korean']
  },
  {
    id: 'v2-024',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec1',
    lessonId: 'topik1-unit2-sec1-lesson2',
    korean: '백',
    pronunciation: 'baek',
    meaning: { ko: '백', mn: 'Зуу', ru: 'Сто', vi: 'Một trăm' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '백 원짜리 동전이에요.', translation: { ko: '백 원짜리 동전이에요.', mn: 'Зуун воны зоос байна.', ru: 'Это монета в сто вон.', vi: 'Đây là đồng xu 100 won.' } },
    level: 1,
    frequency: 66,
    tags: ['number', 'sino-korean', 'money']
  },
  {
    id: 'v2-025',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec1',
    lessonId: 'topik1-unit2-sec1-lesson2',
    korean: '천',
    pronunciation: 'cheon',
    meaning: { ko: '천', mn: 'Мянга', ru: 'Тысяча', vi: 'Một nghìn' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '천 원이에요.', translation: { ko: '천 원이에요.', mn: 'Мянган вон байна.', ru: 'Это тысяча вон.', vi: 'Một nghìn won.' } },
    level: 1,
    frequency: 67,
    tags: ['number', 'sino-korean', 'money']
  },
  {
    id: 'v2-026',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec1',
    lessonId: 'topik1-unit2-sec1-lesson2',
    korean: '만',
    pronunciation: 'man',
    meaning: { ko: '만', mn: 'Арван мянга', ru: 'Десять тысяч', vi: 'Mười nghìn' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '만 원 주세요.', translation: { ko: '만 원 주세요.', mn: 'Арван мянган вон өгнө үү.', ru: 'Дайте десять тысяч вон.', vi: 'Cho tôi mười nghìn won.' } },
    level: 1,
    frequency: 68,
    tags: ['number', 'sino-korean', 'money']
  },
  // Days of the week
  {
    id: 'v2-027',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '월요일',
    pronunciation: 'woryoil',
    meaning: { ko: '월요일', mn: 'Даваа', ru: 'Понедельник', vi: 'Thứ Hai' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '월요일에 학교에 가요.', translation: { ko: '월요일에 학교에 가요.', mn: 'Даваа гарагт сургууль руу явна.', ru: 'В понедельник иду в школу.', vi: 'Thứ Hai tôi đi học.' } },
    level: 1,
    frequency: 69,
    tags: ['time', 'weekday']
  },
  {
    id: 'v2-028',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '화요일',
    pronunciation: 'hwayoil',
    meaning: { ko: '화요일', mn: 'Мягмар', ru: 'Вторник', vi: 'Thứ Ba' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '화요일에 수영해요.', translation: { ko: '화요일에 수영해요.', mn: 'Мягмар гарагт сэлдэг.', ru: 'Во вторник плаваю.', vi: 'Thứ Ba tôi đi bơi.' } },
    level: 1,
    frequency: 70,
    tags: ['time', 'weekday']
  },
  {
    id: 'v2-029',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '수요일',
    pronunciation: 'suyoil',
    meaning: { ko: '수요일', mn: 'Лхагва', ru: 'Среда', vi: 'Thứ Tư' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '수요일에 영화 볼까요?', translation: { ko: '수요일에 영화 볼까요?', mn: 'Лхагва гарагт кино үзэх үү?', ru: 'Посмотрим кино в среду?', vi: 'Thứ Tư đi xem phim nhé?' } },
    level: 1,
    frequency: 71,
    tags: ['time', 'weekday']
  },
  {
    id: 'v2-030',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '목요일',
    pronunciation: 'mogyoil',
    meaning: { ko: '목요일', mn: 'Пүрэв', ru: 'Четверг', vi: 'Thứ Năm' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '목요일에 시험이 있어요.', translation: { ko: '목요일에 시험이 있어요.', mn: 'Пүрэв гарагт шалгалт байна.', ru: 'В четверг экзамен.', vi: 'Thứ Năm có kỳ thi.' } },
    level: 1,
    frequency: 72,
    tags: ['time', 'weekday']
  },
  {
    id: 'v2-031',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '금요일',
    pronunciation: 'geumyoil',
    meaning: { ko: '금요일', mn: 'Баасан', ru: 'Пятница', vi: 'Thứ Sáu' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '금요일에 파티해요.', translation: { ko: '금요일에 파티해요.', mn: 'Баасан гарагт үдэшлэг хийнэ.', ru: 'В пятницу вечеринка.', vi: 'Thứ Sáu có tiệc.' } },
    level: 1,
    frequency: 73,
    tags: ['time', 'weekday']
  },
  {
    id: 'v2-032',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '토요일',
    pronunciation: 'toyoil',
    meaning: { ko: '토요일', mn: 'Бямба', ru: 'Суббота', vi: 'Thứ Bảy' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '토요일에 쉬어요.', translation: { ko: '토요일에 쉬어요.', mn: 'Бямба гарагт амарна.', ru: 'В субботу отдыхаю.', vi: 'Thứ Bảy tôi nghỉ.' } },
    level: 1,
    frequency: 74,
    tags: ['time', 'weekend']
  },
  {
    id: 'v2-033',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '일요일',
    pronunciation: 'iryoil',
    meaning: { ko: '일요일', mn: 'Ням', ru: 'Воскресенье', vi: 'Chủ Nhật' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '일요일에 가족과 함께 있어요.', translation: { ko: '일요일에 가족과 함께 있어요.', mn: 'Ням гарагт гэр бүлийнхэнтэйгээ хамт байдаг.', ru: 'В воскресенье с семьёй.', vi: 'Chủ Nhật tôi ở cùng gia đình.' } },
    level: 1,
    frequency: 75,
    tags: ['time', 'weekend']
  },
  // Additional time words
  {
    id: 'v2-034',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson1',
    korean: '아침',
    pronunciation: 'achim',
    meaning: { ko: '아침', mn: 'Өглөө', ru: 'Утро', vi: 'Buổi sáng' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '아침에 운동해요.', translation: { ko: '아침에 운동해요.', mn: 'Өглөө дасгал хийдэг.', ru: 'Утром делаю зарядку.', vi: 'Buổi sáng tôi tập thể dục.' } },
    level: 1,
    frequency: 76,
    tags: ['time', 'period']
  },
  {
    id: 'v2-035',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson1',
    korean: '점심',
    pronunciation: 'jeomsim',
    meaning: { ko: '점심', mn: 'Үдийн хоол', ru: 'Обед', vi: 'Bữa trưa' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '점심 먹었어요?', translation: { ko: '점심 먹었어요?', mn: 'Үдийн хоол идсэн үү?', ru: 'Обедали?', vi: 'Bạn đã ăn trưa chưa?' } },
    level: 1,
    frequency: 77,
    tags: ['time', 'meal']
  },
  {
    id: 'v2-036',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson1',
    korean: '저녁',
    pronunciation: 'jeonyeok',
    meaning: { ko: '저녁', mn: 'Орой', ru: 'Вечер', vi: 'Buổi tối' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '저녁에 뭐 해요?', translation: { ko: '저녁에 뭐 해요?', mn: 'Орой юу хийх вэ?', ru: 'Что делаете вечером?', vi: 'Buổi tối bạn làm gì?' } },
    level: 1,
    frequency: 78,
    tags: ['time', 'period']
  },
  {
    id: 'v2-037',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson1',
    korean: '밤',
    pronunciation: 'bam',
    meaning: { ko: '밤', mn: 'Шөнө', ru: 'Ночь', vi: 'Đêm' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '밤에 잘 자요.', translation: { ko: '밤에 잘 자요.', mn: 'Шөнө сайн унтаарай.', ru: 'Спокойной ночи.', vi: 'Ngủ ngon nhé.' } },
    level: 1,
    frequency: 79,
    tags: ['time', 'period']
  },
  {
    id: 'v2-038',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '주',
    pronunciation: 'ju',
    meaning: { ko: '주', mn: 'Долоо хоног', ru: 'Неделя', vi: 'Tuần' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '다음 주에 만나요.', translation: { ko: '다음 주에 만나요.', mn: 'Дараа долоо хоногт уулзъя.', ru: 'Увидимся на следующей неделе.', vi: 'Gặp nhau tuần sau.' } },
    level: 1,
    frequency: 80,
    tags: ['time', 'week']
  },
  {
    id: 'v2-039',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '달',
    pronunciation: 'dal',
    meaning: { ko: '달', mn: 'Сар', ru: 'Месяц', vi: 'Tháng' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '한 달 후에 돌아와요.', translation: { ko: '한 달 후에 돌아와요.', mn: 'Нэг сарын дараа эргэж ирнэ.', ru: 'Вернусь через месяц.', vi: 'Tôi sẽ quay lại sau một tháng.' } },
    level: 1,
    frequency: 81,
    tags: ['time', 'month']
  },
  {
    id: 'v2-040',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '년',
    pronunciation: 'nyeon',
    meaning: { ko: '년', mn: 'Жил', ru: 'Год', vi: 'Năm' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '새해 복 많이 받으세요!', translation: { ko: '새해 복 많이 받으세요!', mn: 'Шинэ жилийн мэнд хүргэе!', ru: 'С Новым годом!', vi: 'Chúc mừng năm mới!' } },
    level: 1,
    frequency: 82,
    tags: ['time', 'year']
  }
];

// ============================================
// Unit 3: 장소와 위치 (Places and Locations)
// ============================================

export const UNIT3_VOCABULARY: VocabularyWord[] = [
  // Section 1: 장소 (Places)
  {
    id: 'v3-001',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '학교',
    pronunciation: 'hakgyo',
    meaning: { ko: '학교', mn: 'Сургууль', ru: 'Школа', vi: 'Trường học' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '학교에 가요.', translation: { ko: '학교에 가요.', mn: 'Сургууль руу явна.', ru: 'Иду в школу.', vi: 'Tôi đi học.' } },
    level: 1,
    frequency: 60,
    tags: ['place', 'education']
  },
  {
    id: 'v3-002',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '집',
    pronunciation: 'jip',
    meaning: { ko: '집', mn: 'Гэр', ru: 'Дом', vi: 'Nhà' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '집에서 공부해요.', translation: { ko: '집에서 공부해요.', mn: 'Гэртээ хичээл хийнэ.', ru: 'Учусь дома.', vi: 'Tôi học ở nhà.' } },
    level: 1,
    frequency: 61,
    tags: ['place', 'home']
  },
  {
    id: 'v3-003',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '식당',
    pronunciation: 'sikdang',
    meaning: { ko: '식당', mn: 'Зоогийн газар', ru: 'Ресторан', vi: 'Nhà hàng' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '식당에서 밥을 먹어요.', translation: { ko: '식당에서 밥을 먹어요.', mn: 'Зоогийн газарт хоол идэж байна.', ru: 'Ем в ресторане.', vi: 'Tôi ăn ở nhà hàng.' } },
    level: 1,
    frequency: 65,
    tags: ['place', 'food']
  },
  {
    id: 'v3-004',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '가게',
    pronunciation: 'gage',
    meaning: { ko: '가게', mn: 'Дэлгүүр', ru: 'Магазин', vi: 'Cửa hàng' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '가게에서 물건을 사요.', translation: { ko: '가게에서 물건을 사요.', mn: 'Дэлгүүрээс юм худалдаж авна.', ru: 'Покупаю вещи в магазине.', vi: 'Tôi mua đồ ở cửa hàng.' } },
    level: 1,
    frequency: 70,
    tags: ['place', 'shopping']
  },
  {
    id: 'v3-005',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson2',
    korean: '은행',
    pronunciation: 'eunhaeng',
    meaning: { ko: '은행', mn: 'Банк', ru: 'Банк', vi: 'Ngân hàng' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '은행에서 돈을 찾아요.', translation: { ko: '은행에서 돈을 찾아요.', mn: 'Банкнаас мөнгө авна.', ru: 'Снимаю деньги в банке.', vi: 'Tôi rút tiền ở ngân hàng.' } },
    level: 1,
    frequency: 75,
    tags: ['place', 'service']
  },
  {
    id: 'v3-006',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson2',
    korean: '병원',
    pronunciation: 'byeongwon',
    meaning: { ko: '병원', mn: 'Эмнэлэг', ru: 'Больница', vi: 'Bệnh viện' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '아파서 병원에 가요.', translation: { ko: '아파서 병원에 가요.', mn: 'Өвдөж байгаа тул эмнэлэг рүү явна.', ru: 'Иду в больницу, потому что болею.', vi: 'Tôi đi bệnh viện vì bị ốm.' } },
    level: 1,
    frequency: 80,
    tags: ['place', 'health']
  },

  // Section 2: 위치 (Locations/Directions)
  {
    id: 'v3-007',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '위',
    pronunciation: 'wi',
    meaning: { ko: '위', mn: 'Дээр', ru: 'Верх/над', vi: 'Trên' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '책상 위에 책이 있어요.', translation: { ko: '책상 위에 책이 있어요.', mn: 'Ширээн дээр ном байна.', ru: 'На столе лежит книга.', vi: 'Có quyển sách trên bàn.' } },
    level: 1,
    frequency: 85,
    tags: ['location', 'position']
  },
  {
    id: 'v3-008',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '아래',
    pronunciation: 'arae',
    meaning: { ko: '아래', mn: 'Доор', ru: 'Низ/под', vi: 'Dưới' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '의자 아래에 가방이 있어요.', translation: { ko: '의자 아래에 가방이 있어요.', mn: 'Сандлын доор цүнх байна.', ru: 'Под стулом лежит сумка.', vi: 'Có cái túi dưới ghế.' } },
    level: 1,
    frequency: 86,
    tags: ['location', 'position']
  },
  {
    id: 'v3-009',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '앞',
    pronunciation: 'ap',
    meaning: { ko: '앞', mn: 'Урд', ru: 'Перед', vi: 'Trước' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '학교 앞에서 만나요.', translation: { ko: '학교 앞에서 만나요.', mn: 'Сургуулийн урд уулзъя.', ru: 'Встретимся перед школой.', vi: 'Gặp nhau trước trường.' } },
    level: 1,
    frequency: 87,
    tags: ['location', 'position']
  },
  {
    id: 'v3-010',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '뒤',
    pronunciation: 'dwi',
    meaning: { ko: '뒤', mn: 'Ард', ru: 'Сзади', vi: 'Sau' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '건물 뒤에 공원이 있어요.', translation: { ko: '건물 뒤에 공원이 있어요.', mn: 'Барилгын ард цэцэрлэгт хүрээлэн байна.', ru: 'За зданием есть парк.', vi: 'Có công viên sau tòa nhà.' } },
    level: 1,
    frequency: 88,
    tags: ['location', 'position']
  },
  {
    id: 'v3-011',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson2',
    korean: '옆',
    pronunciation: 'yeop',
    meaning: { ko: '옆', mn: 'Хажуу', ru: 'Рядом', vi: 'Bên cạnh' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '제 옆에 앉으세요.', translation: { ko: '제 옆에 앉으세요.', mn: 'Миний хажууд суугаарай.', ru: 'Садитесь рядом со мной.', vi: 'Ngồi bên cạnh tôi.' } },
    level: 1,
    frequency: 89,
    tags: ['location', 'position']
  },
  {
    id: 'v3-012',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson2',
    korean: '안',
    pronunciation: 'an',
    meaning: { ko: '안', mn: 'Дотор', ru: 'Внутри', vi: 'Bên trong' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '가방 안에 책이 있어요.', translation: { ko: '가방 안에 책이 있어요.', mn: 'Цүнхний дотор ном байна.', ru: 'В сумке есть книга.', vi: 'Có sách trong túi.' } },
    level: 1,
    frequency: 90,
    tags: ['location', 'position']
  },
  {
    id: 'v3-013',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson2',
    korean: '밖',
    pronunciation: 'bak',
    meaning: { ko: '밖', mn: 'Гадна', ru: 'Снаружи', vi: 'Bên ngoài' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '밖에 비가 와요.', translation: { ko: '밖에 비가 와요.', mn: 'Гадаа бороо орж байна.', ru: 'На улице идёт дождь.', vi: 'Bên ngoài đang mưa.' } },
    level: 1,
    frequency: 91,
    tags: ['location', 'position']
  },
  // More places
  {
    id: 'v3-014',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson2',
    korean: '공원',
    pronunciation: 'gongwon',
    meaning: { ko: '공원', mn: 'Цэцэрлэгт хүрээлэн', ru: 'Парк', vi: 'Công viên' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '공원에서 산책해요.', translation: { ko: '공원에서 산책해요.', mn: 'Цэцэрлэгт хүрээлэнд алхдаг.', ru: 'Гуляю в парке.', vi: 'Tôi đi dạo ở công viên.' } },
    level: 1,
    frequency: 92,
    tags: ['place', 'leisure']
  },
  {
    id: 'v3-015',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson2',
    korean: '도서관',
    pronunciation: 'doseogwan',
    meaning: { ko: '도서관', mn: 'Номын сан', ru: 'Библиотека', vi: 'Thư viện' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '도서관에서 책을 읽어요.', translation: { ko: '도서관에서 책을 읽어요.', mn: 'Номын санд ном уншдаг.', ru: 'Читаю книги в библиотеке.', vi: 'Tôi đọc sách ở thư viện.' } },
    level: 1,
    frequency: 93,
    tags: ['place', 'education']
  },
  {
    id: 'v3-016',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson2',
    korean: '화장실',
    pronunciation: 'hwajangsil',
    meaning: { ko: '화장실', mn: 'Ариун цэврийн өрөө', ru: 'Туалет', vi: 'Nhà vệ sinh' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '화장실이 어디예요?', translation: { ko: '화장실이 어디예요?', mn: 'Ариун цэврийн өрөө хаана байна?', ru: 'Где туалет?', vi: 'Nhà vệ sinh ở đâu?' } },
    level: 1,
    frequency: 94,
    tags: ['place', 'basic']
  },
  {
    id: 'v3-017',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson2',
    korean: '역',
    pronunciation: 'yeok',
    meaning: { ko: '역', mn: 'Буудал', ru: 'Станция', vi: 'Ga' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '역에서 친구를 만나요.', translation: { ko: '역에서 친구를 만나요.', mn: 'Буудалд найзтайгаа уулздаг.', ru: 'Встречаю друга на станции.', vi: 'Tôi gặp bạn ở ga.' } },
    level: 1,
    frequency: 95,
    tags: ['place', 'transport']
  },
  {
    id: 'v3-018',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson2',
    korean: '공항',
    pronunciation: 'gonghang',
    meaning: { ko: '공항', mn: 'Нисэх буудал', ru: 'Аэропорт', vi: 'Sân bay' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '공항에서 비행기를 타요.', translation: { ko: '공항에서 비행기를 타요.', mn: 'Нисэх буудалд онгоцонд суудаг.', ru: 'Сажусь на самолёт в аэропорту.', vi: 'Tôi lên máy bay ở sân bay.' } },
    level: 1,
    frequency: 96,
    tags: ['place', 'transport']
  },
  {
    id: 'v3-019',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '방',
    pronunciation: 'bang',
    meaning: { ko: '방', mn: 'Өрөө', ru: 'Комната', vi: 'Phòng' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '방이 깨끗해요.', translation: { ko: '방이 깨끗해요.', mn: 'Өрөө цэвэрхэн байна.', ru: 'Комната чистая.', vi: 'Phòng sạch sẽ.' } },
    level: 1,
    frequency: 97,
    tags: ['place', 'home']
  },
  {
    id: 'v3-020',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '교실',
    pronunciation: 'gyosil',
    meaning: { ko: '교실', mn: 'Анги', ru: 'Класс/аудитория', vi: 'Phòng học' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '교실에서 공부해요.', translation: { ko: '교실에서 공부해요.', mn: 'Ангид хичээллэдэг.', ru: 'Учусь в классе.', vi: 'Tôi học trong lớp.' } },
    level: 1,
    frequency: 98,
    tags: ['place', 'education']
  },
  // Transportation vocabulary
  {
    id: 'v3-021',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson2',
    korean: '버스',
    pronunciation: 'beoseu',
    meaning: { ko: '버스', mn: 'Автобус', ru: 'Автобус', vi: 'Xe buýt' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '버스로 학교에 가요.', translation: { ko: '버스로 학교에 가요.', mn: 'Автобусаар сургууль руу явдаг.', ru: 'Еду в школу на автобусе.', vi: 'Tôi đi học bằng xe buýt.' } },
    level: 1,
    frequency: 99,
    tags: ['transport', 'vehicle']
  },
  {
    id: 'v3-022',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson2',
    korean: '지하철',
    pronunciation: 'jihacheol',
    meaning: { ko: '지하철', mn: 'Метро', ru: 'Метро', vi: 'Tàu điện ngầm' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '지하철이 빨라요.', translation: { ko: '지하철이 빨라요.', mn: 'Метро хурдан.', ru: 'Метро быстрое.', vi: 'Tàu điện ngầm nhanh.' } },
    level: 1,
    frequency: 100,
    tags: ['transport', 'vehicle']
  },
  {
    id: 'v3-023',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson2',
    korean: '택시',
    pronunciation: 'taeksi',
    meaning: { ko: '택시', mn: 'Такси', ru: 'Такси', vi: 'Taxi' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '택시가 비싸요.', translation: { ko: '택시가 비싸요.', mn: 'Такси үнэтэй.', ru: 'Такси дорогое.', vi: 'Taxi đắt.' } },
    level: 1,
    frequency: 101,
    tags: ['transport', 'vehicle']
  },
  // Direction verbs
  {
    id: 'v3-024',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '가다',
    pronunciation: 'gada',
    meaning: { ko: '가다', mn: 'Явах', ru: 'Идти/ехать', vi: 'Đi' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '학교에 가요.', translation: { ko: '학교에 가요.', mn: 'Сургууль руу явна.', ru: 'Иду в школу.', vi: 'Tôi đi học.' } },
    level: 1,
    frequency: 102,
    tags: ['action', 'movement']
  },
  {
    id: 'v3-025',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '오다',
    pronunciation: 'oda',
    meaning: { ko: '오다', mn: 'Ирэх', ru: 'Приходить', vi: 'Đến' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '친구가 우리 집에 와요.', translation: { ko: '친구가 우리 집에 와요.', mn: 'Найз манай гэрт ирдэг.', ru: 'Друг приходит к нам домой.', vi: 'Bạn đến nhà tôi.' } },
    level: 1,
    frequency: 103,
    tags: ['action', 'movement']
  },
  {
    id: 'v3-026',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '있다',
    pronunciation: 'itda',
    meaning: { ko: '있다', mn: 'Байх', ru: 'Быть/находиться', vi: 'Có/ở' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '책이 책상 위에 있어요.', translation: { ko: '책이 책상 위에 있어요.', mn: 'Ном ширээн дээр байна.', ru: 'Книга на столе.', vi: 'Sách ở trên bàn.' } },
    level: 1,
    frequency: 104,
    tags: ['existence', 'basic']
  },
  {
    id: 'v3-027',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '없다',
    pronunciation: 'eopda',
    meaning: { ko: '없다', mn: 'Байхгүй', ru: 'Не иметь/не быть', vi: 'Không có' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '시간이 없어요.', translation: { ko: '시간이 없어요.', mn: 'Цаг байхгүй.', ru: 'Нет времени.', vi: 'Không có thời gian.' } },
    level: 1,
    frequency: 105,
    tags: ['existence', 'basic']
  }
];

// ============================================
// Unit 4: 음식과 주문 (Food and Ordering)
// ============================================

export const UNIT4_VOCABULARY: VocabularyWord[] = [
  // Section 1: 음식 (Food)
  {
    id: 'v4-001',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec1',
    lessonId: 'topik1-unit4-sec1-lesson1',
    korean: '밥',
    pronunciation: 'bap',
    meaning: { ko: '밥', mn: 'Будаа', ru: 'Рис/еда', vi: 'Cơm' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '밥 먹었어요?', translation: { ko: '밥 먹었어요?', mn: 'Та хоол идсэн үү?', ru: 'Вы поели?', vi: 'Bạn đã ăn chưa?' } },
    level: 1,
    frequency: 95,
    tags: ['food', 'basic']
  },
  {
    id: 'v4-002',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec1',
    lessonId: 'topik1-unit4-sec1-lesson1',
    korean: '물',
    pronunciation: 'mul',
    meaning: { ko: '물', mn: 'Ус', ru: 'Вода', vi: 'Nước' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '물 주세요.', translation: { ko: '물 주세요.', mn: 'Ус өгөөч.', ru: 'Воды, пожалуйста.', vi: 'Cho tôi nước.' } },
    level: 1,
    frequency: 96,
    tags: ['drink', 'basic']
  },
  {
    id: 'v4-003',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec1',
    lessonId: 'topik1-unit4-sec1-lesson1',
    korean: '김치',
    pronunciation: 'gimchi',
    meaning: { ko: '김치', mn: 'Кимчи', ru: 'Кимчи', vi: 'Kim chi' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '김치가 매워요.', translation: { ko: '김치가 매워요.', mn: 'Кимчи халуун амттай байна.', ru: 'Кимчи острое.', vi: 'Kim chi cay.' } },
    level: 1,
    frequency: 100,
    tags: ['food', 'korean']
  },
  {
    id: 'v4-004',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec1',
    lessonId: 'topik1-unit4-sec1-lesson1',
    korean: '고기',
    pronunciation: 'gogi',
    meaning: { ko: '고기', mn: 'Мах', ru: 'Мясо', vi: 'Thịt' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '고기를 좋아해요.', translation: { ko: '고기를 좋아해요.', mn: 'Би мах дуртай.', ru: 'Я люблю мясо.', vi: 'Tôi thích thịt.' } },
    level: 1,
    frequency: 105,
    tags: ['food', 'meat']
  },
  {
    id: 'v4-005',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec1',
    lessonId: 'topik1-unit4-sec1-lesson2',
    korean: '불고기',
    pronunciation: 'bulgogi',
    meaning: { ko: '불고기', mn: 'Булгоги', ru: 'Пулькоги', vi: 'Bulgogi' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '불고기 맛있어요.', translation: { ko: '불고기 맛있어요.', mn: 'Булгоги амттай байна.', ru: 'Пулькоги вкусное.', vi: 'Bulgogi ngon.' } },
    level: 1,
    frequency: 110,
    tags: ['food', 'korean']
  },
  {
    id: 'v4-006',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec1',
    lessonId: 'topik1-unit4-sec1-lesson2',
    korean: '비빔밥',
    pronunciation: 'bibimbap',
    meaning: { ko: '비빔밥', mn: 'Бибимбаб', ru: 'Пибимпап', vi: 'Bibimbap' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '비빔밥 하나 주세요.', translation: { ko: '비빔밥 하나 주세요.', mn: 'Нэг бибимбаб өгнө үү.', ru: 'Один пибимпап, пожалуйста.', vi: 'Cho tôi một bibimbap.' } },
    level: 1,
    frequency: 111,
    tags: ['food', 'korean']
  },

  // Section 2: 주문하기 (Ordering)
  {
    id: 'v4-007',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec2',
    lessonId: 'topik1-unit4-sec2-lesson1',
    korean: '주세요',
    pronunciation: 'juseyo',
    meaning: { ko: '주세요', mn: 'Өгөөч', ru: 'Дайте, пожалуйста', vi: 'Cho tôi' },
    partOfSpeech: 'expression',
    exampleSentence: { korean: '커피 주세요.', translation: { ko: '커피 주세요.', mn: 'Кофе өгөөч.', ru: 'Кофе, пожалуйста.', vi: 'Cho tôi cà phê.' } },
    level: 1,
    frequency: 115,
    tags: ['order', 'request', 'polite']
  },
  {
    id: 'v4-008',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec2',
    lessonId: 'topik1-unit4-sec2-lesson1',
    korean: '얼마예요',
    pronunciation: 'eolmayeyo',
    meaning: { ko: '얼마예요?', mn: 'Хэд вэ?', ru: 'Сколько стоит?', vi: 'Bao nhiêu tiền?' },
    partOfSpeech: 'expression',
    exampleSentence: { korean: '이거 얼마예요?', translation: { ko: '이거 얼마예요?', mn: 'Энэ хэд вэ?', ru: 'Сколько это стоит?', vi: 'Cái này bao nhiêu tiền?' } },
    level: 1,
    frequency: 116,
    tags: ['order', 'price', 'question']
  },
  {
    id: 'v4-009',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec2',
    lessonId: 'topik1-unit4-sec2-lesson1',
    korean: '맛있어요',
    pronunciation: 'masisseoyo',
    meaning: { ko: '맛있어요', mn: 'Амттай', ru: 'Вкусно', vi: 'Ngon' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '이 음식 맛있어요.', translation: { ko: '이 음식 맛있어요.', mn: 'Энэ хоол амттай байна.', ru: 'Эта еда вкусная.', vi: 'Món này ngon.' } },
    level: 1,
    frequency: 120,
    tags: ['taste', 'description']
  },
  {
    id: 'v4-010',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec2',
    lessonId: 'topik1-unit4-sec2-lesson1',
    korean: '매워요',
    pronunciation: 'maewoyo',
    meaning: { ko: '매워요', mn: 'Халуун амттай', ru: 'Острое', vi: 'Cay' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '너무 매워요!', translation: { ko: '너무 매워요!', mn: 'Дэндүү халуун амттай!', ru: 'Слишком острое!', vi: 'Quá cay!' } },
    level: 1,
    frequency: 125,
    tags: ['taste', 'description']
  },
  {
    id: 'v4-011',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec2',
    lessonId: 'topik1-unit4-sec2-lesson2',
    korean: '계산',
    pronunciation: 'gyesan',
    meaning: { ko: '계산', mn: 'Төлбөр', ru: 'Расчёт', vi: 'Tính tiền' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '계산해 주세요.', translation: { ko: '계산해 주세요.', mn: 'Төлбөр хийгээд өгөөч.', ru: 'Посчитайте, пожалуйста.', vi: 'Tính tiền cho tôi.' } },
    level: 1,
    frequency: 130,
    tags: ['order', 'payment']
  },
  {
    id: 'v4-012',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec2',
    lessonId: 'topik1-unit4-sec2-lesson2',
    korean: '메뉴',
    pronunciation: 'menyu',
    meaning: { ko: '메뉴', mn: 'Меню', ru: 'Меню', vi: 'Menu' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '메뉴 좀 보여 주세요.', translation: { ko: '메뉴 좀 보여 주세요.', mn: 'Меню үзүүлэхч.', ru: 'Покажите меню, пожалуйста.', vi: 'Cho tôi xem menu.' } },
    level: 1,
    frequency: 131,
    tags: ['order', 'restaurant']
  },
  // More drinks
  {
    id: 'v4-013',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec1',
    lessonId: 'topik1-unit4-sec1-lesson2',
    korean: '커피',
    pronunciation: 'keopi',
    meaning: { ko: '커피', mn: 'Кофе', ru: 'Кофе', vi: 'Cà phê' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '커피 한 잔 주세요.', translation: { ko: '커피 한 잔 주세요.', mn: 'Нэг аяга кофе өгнө үү.', ru: 'Чашку кофе, пожалуйста.', vi: 'Cho tôi một ly cà phê.' } },
    level: 1,
    frequency: 132,
    tags: ['drink', 'beverage']
  },
  {
    id: 'v4-014',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec1',
    lessonId: 'topik1-unit4-sec1-lesson2',
    korean: '차',
    pronunciation: 'cha',
    meaning: { ko: '차', mn: 'Цай', ru: 'Чай', vi: 'Trà' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '녹차 좋아해요.', translation: { ko: '녹차 좋아해요.', mn: 'Ногоон цай дуртай.', ru: 'Люблю зелёный чай.', vi: 'Tôi thích trà xanh.' } },
    level: 1,
    frequency: 133,
    tags: ['drink', 'beverage']
  },
  {
    id: 'v4-015',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec1',
    lessonId: 'topik1-unit4-sec1-lesson2',
    korean: '우유',
    pronunciation: 'uyu',
    meaning: { ko: '우유', mn: 'Сүү', ru: 'Молоко', vi: 'Sữa' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '아침에 우유를 마셔요.', translation: { ko: '아침에 우유를 마셔요.', mn: 'Өглөө сүү уудаг.', ru: 'Пью молоко по утрам.', vi: 'Tôi uống sữa vào buổi sáng.' } },
    level: 1,
    frequency: 134,
    tags: ['drink', 'beverage']
  },
  {
    id: 'v4-016',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec1',
    lessonId: 'topik1-unit4-sec1-lesson2',
    korean: '주스',
    pronunciation: 'juseu',
    meaning: { ko: '주스', mn: 'Шүүс', ru: 'Сок', vi: 'Nước ép' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '오렌지 주스 있어요?', translation: { ko: '오렌지 주스 있어요?', mn: 'Жүржийн шүүс байна уу?', ru: 'Есть апельсиновый сок?', vi: 'Có nước cam không?' } },
    level: 1,
    frequency: 135,
    tags: ['drink', 'beverage']
  },
  // More food
  {
    id: 'v4-017',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec1',
    lessonId: 'topik1-unit4-sec1-lesson1',
    korean: '빵',
    pronunciation: 'ppang',
    meaning: { ko: '빵', mn: 'Талх', ru: 'Хлеб', vi: 'Bánh mì' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '빵이 맛있어요.', translation: { ko: '빵이 맛있어요.', mn: 'Талх амттай.', ru: 'Хлеб вкусный.', vi: 'Bánh mì ngon.' } },
    level: 1,
    frequency: 136,
    tags: ['food', 'bakery']
  },
  {
    id: 'v4-018',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec1',
    lessonId: 'topik1-unit4-sec1-lesson1',
    korean: '과일',
    pronunciation: 'gwail',
    meaning: { ko: '과일', mn: 'Жимс', ru: 'Фрукт', vi: 'Trái cây' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '과일을 좋아해요.', translation: { ko: '과일을 좋아해요.', mn: 'Жимс дуртай.', ru: 'Люблю фрукты.', vi: 'Tôi thích trái cây.' } },
    level: 1,
    frequency: 137,
    tags: ['food', 'fruit']
  },
  {
    id: 'v4-019',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec1',
    lessonId: 'topik1-unit4-sec1-lesson1',
    korean: '사과',
    pronunciation: 'sagwa',
    meaning: { ko: '사과', mn: 'Алим', ru: 'Яблоко', vi: 'Táo' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '사과가 달아요.', translation: { ko: '사과가 달아요.', mn: 'Алим амттай.', ru: 'Яблоко сладкое.', vi: 'Táo ngọt.' } },
    level: 1,
    frequency: 138,
    tags: ['food', 'fruit']
  },
  {
    id: 'v4-020',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec1',
    lessonId: 'topik1-unit4-sec1-lesson1',
    korean: '야채',
    pronunciation: 'yachae',
    meaning: { ko: '야채', mn: 'Хүнсний ногоо', ru: 'Овощи', vi: 'Rau củ' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '야채를 많이 먹어요.', translation: { ko: '야채를 많이 먹어요.', mn: 'Ногоо их иддэг.', ru: 'Ем много овощей.', vi: 'Tôi ăn nhiều rau.' } },
    level: 1,
    frequency: 139,
    tags: ['food', 'vegetable']
  },
  {
    id: 'v4-021',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec1',
    lessonId: 'topik1-unit4-sec1-lesson2',
    korean: '라면',
    pronunciation: 'ramyeon',
    meaning: { ko: '라면', mn: 'Рамён', ru: 'Рамён', vi: 'Mì Hàn Quốc' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '라면 좋아해요?', translation: { ko: '라면 좋아해요?', mn: 'Рамён дуртай юу?', ru: 'Любите рамён?', vi: 'Bạn có thích mì Hàn Quốc không?' } },
    level: 1,
    frequency: 140,
    tags: ['food', 'korean']
  },
  {
    id: 'v4-022',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec1',
    lessonId: 'topik1-unit4-sec1-lesson2',
    korean: '치킨',
    pronunciation: 'chikin',
    meaning: { ko: '치킨', mn: 'Шарсан тахиа', ru: 'Курица', vi: 'Gà rán' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '치킨 배달 시켜요.', translation: { ko: '치킨 배달 시켜요.', mn: 'Шарсан тахиа захиалъя.', ru: 'Закажем курицу.', vi: 'Đặt gà rán giao hàng.' } },
    level: 1,
    frequency: 141,
    tags: ['food', 'popular']
  },
  // Taste adjectives
  {
    id: 'v4-023',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec2',
    lessonId: 'topik1-unit4-sec2-lesson1',
    korean: '달다',
    pronunciation: 'dalda',
    meaning: { ko: '달다', mn: 'Амттай', ru: 'Сладкий', vi: 'Ngọt' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '케이크가 달아요.', translation: { ko: '케이크가 달아요.', mn: 'Бялуу амттай.', ru: 'Торт сладкий.', vi: 'Bánh ngọt.' } },
    level: 1,
    frequency: 142,
    tags: ['taste', 'description']
  },
  {
    id: 'v4-024',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec2',
    lessonId: 'topik1-unit4-sec2-lesson1',
    korean: '짜다',
    pronunciation: 'jjada',
    meaning: { ko: '짜다', mn: 'Давстай', ru: 'Солёный', vi: 'Mặn' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '이 음식은 짜요.', translation: { ko: '이 음식은 짜요.', mn: 'Энэ хоол давстай.', ru: 'Эта еда солёная.', vi: 'Món này mặn.' } },
    level: 1,
    frequency: 143,
    tags: ['taste', 'description']
  },
  {
    id: 'v4-025',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec2',
    lessonId: 'topik1-unit4-sec2-lesson1',
    korean: '시다',
    pronunciation: 'sida',
    meaning: { ko: '시다', mn: 'Гашуун', ru: 'Кислый', vi: 'Chua' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '레몬이 셔요.', translation: { ko: '레몬이 셔요.', mn: 'Нимбэг гашуун.', ru: 'Лимон кислый.', vi: 'Chanh chua.' } },
    level: 1,
    frequency: 144,
    tags: ['taste', 'description']
  },
  // Food actions
  {
    id: 'v4-026',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec2',
    lessonId: 'topik1-unit4-sec2-lesson1',
    korean: '먹다',
    pronunciation: 'meokda',
    meaning: { ko: '먹다', mn: 'Идэх', ru: 'Есть', vi: 'Ăn' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '밥을 먹어요.', translation: { ko: '밥을 먹어요.', mn: 'Хоол иддэг.', ru: 'Ем рис.', vi: 'Tôi ăn cơm.' } },
    level: 1,
    frequency: 145,
    tags: ['action', 'food']
  },
  {
    id: 'v4-027',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec2',
    lessonId: 'topik1-unit4-sec2-lesson1',
    korean: '마시다',
    pronunciation: 'masida',
    meaning: { ko: '마시다', mn: 'Уух', ru: 'Пить', vi: 'Uống' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '물을 마셔요.', translation: { ko: '물을 마셔요.', mn: 'Ус уудаг.', ru: 'Пью воду.', vi: 'Tôi uống nước.' } },
    level: 1,
    frequency: 146,
    tags: ['action', 'drink']
  },
  {
    id: 'v4-028',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec2',
    lessonId: 'topik1-unit4-sec2-lesson2',
    korean: '좋아하다',
    pronunciation: 'joahada',
    meaning: { ko: '좋아하다', mn: 'Дуртай байх', ru: 'Нравиться/любить', vi: 'Thích' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '한국 음식을 좋아해요.', translation: { ko: '한국 음식을 좋아해요.', mn: 'Солонгос хоол дуртай.', ru: 'Люблю корейскую еду.', vi: 'Tôi thích đồ ăn Hàn Quốc.' } },
    level: 1,
    frequency: 147,
    tags: ['action', 'preference']
  },
  {
    id: 'v4-029',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec2',
    lessonId: 'topik1-unit4-sec2-lesson2',
    korean: '싫어하다',
    pronunciation: 'sireohada',
    meaning: { ko: '싫어하다', mn: 'Дургүй байх', ru: 'Не нравиться', vi: 'Không thích' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '매운 음식을 싫어해요.', translation: { ko: '매운 음식을 싫어해요.', mn: 'Халуун хоол дургүй.', ru: 'Не люблю острую еду.', vi: 'Tôi không thích đồ ăn cay.' } },
    level: 1,
    frequency: 148,
    tags: ['action', 'preference']
  }
];

// ============================================
// Unit 5: 쇼핑하기 (Shopping)
// ============================================

export const UNIT5_VOCABULARY: VocabularyWord[] = [
  // Section 1: 물건 (Items)
  {
    id: 'v5-001',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec1',
    lessonId: 'topik1-unit5-sec1-lesson1',
    korean: '옷',
    pronunciation: 'ot',
    meaning: { ko: '옷', mn: 'Хувцас', ru: 'Одежда', vi: 'Quần áo' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '이 옷 예뻐요.', translation: { ko: '이 옷 예뻐요.', mn: 'Энэ хувцас гоё байна.', ru: 'Эта одежда красивая.', vi: 'Quần áo này đẹp.' } },
    level: 1,
    frequency: 135,
    tags: ['shopping', 'clothing']
  },
  {
    id: 'v5-002',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec1',
    lessonId: 'topik1-unit5-sec1-lesson1',
    korean: '신발',
    pronunciation: 'sinbal',
    meaning: { ko: '신발', mn: 'Гутал', ru: 'Обувь', vi: 'Giày dép' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '신발이 작아요.', translation: { ko: '신발이 작아요.', mn: 'Гутал жижиг байна.', ru: 'Обувь маленькая.', vi: 'Giày nhỏ.' } },
    level: 1,
    frequency: 140,
    tags: ['shopping', 'clothing']
  },
  {
    id: 'v5-003',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec1',
    lessonId: 'topik1-unit5-sec1-lesson1',
    korean: '가방',
    pronunciation: 'gabang',
    meaning: { ko: '가방', mn: 'Цүнх', ru: 'Сумка', vi: 'Túi xách' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '가방이 무거워요.', translation: { ko: '가방이 무거워요.', mn: 'Цүнх хүнд байна.', ru: 'Сумка тяжёлая.', vi: 'Túi nặng.' } },
    level: 1,
    frequency: 145,
    tags: ['shopping', 'accessory']
  },
  {
    id: 'v5-004',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec1',
    lessonId: 'topik1-unit5-sec1-lesson2',
    korean: '크다',
    pronunciation: 'keuda',
    meaning: { ko: '크다', mn: 'Том', ru: 'Большой', vi: 'Lớn' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '이 옷이 커요.', translation: { ko: '이 옷이 커요.', mn: 'Энэ хувцас том байна.', ru: 'Эта одежда большая.', vi: 'Quần áo này to.' } },
    level: 1,
    frequency: 150,
    tags: ['size', 'description']
  },
  {
    id: 'v5-005',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec1',
    lessonId: 'topik1-unit5-sec1-lesson2',
    korean: '작다',
    pronunciation: 'jakda',
    meaning: { ko: '작다', mn: 'Жижиг', ru: 'Маленький', vi: 'Nhỏ' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '더 작은 사이즈 있어요?', translation: { ko: '더 작은 사이즈 있어요?', mn: 'Илүү жижиг хэмжээ байна уу?', ru: 'Есть размер поменьше?', vi: 'Có size nhỏ hơn không?' } },
    level: 1,
    frequency: 151,
    tags: ['size', 'description']
  },

  // Section 2: 가격 (Prices)
  {
    id: 'v5-006',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec2',
    lessonId: 'topik1-unit5-sec2-lesson1',
    korean: '원',
    pronunciation: 'won',
    meaning: { ko: '원', mn: 'Вон', ru: 'Вон', vi: 'Won' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '천 원이에요.', translation: { ko: '천 원이에요.', mn: 'Мянган вон байна.', ru: 'Одна тысяча вон.', vi: 'Một nghìn won.' } },
    level: 1,
    frequency: 155,
    tags: ['money', 'price']
  },
  {
    id: 'v5-007',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec2',
    lessonId: 'topik1-unit5-sec2-lesson1',
    korean: '비싸다',
    pronunciation: 'bissada',
    meaning: { ko: '비싸다', mn: 'Үнэтэй', ru: 'Дорогой', vi: 'Đắt' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '너무 비싸요!', translation: { ko: '너무 비싸요!', mn: 'Дэндүү үнэтэй!', ru: 'Слишком дорого!', vi: 'Quá đắt!' } },
    level: 1,
    frequency: 160,
    tags: ['price', 'description']
  },
  {
    id: 'v5-008',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec2',
    lessonId: 'topik1-unit5-sec2-lesson1',
    korean: '싸다',
    pronunciation: 'ssada',
    meaning: { ko: '싸다', mn: 'Хямд', ru: 'Дешёвый', vi: 'Rẻ' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '여기가 싸요.', translation: { ko: '여기가 싸요.', mn: 'Энд хямд байна.', ru: 'Здесь дёшево.', vi: 'Ở đây rẻ.' } },
    level: 1,
    frequency: 161,
    tags: ['price', 'description']
  },
  {
    id: 'v5-009',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec2',
    lessonId: 'topik1-unit5-sec2-lesson2',
    korean: '사다',
    pronunciation: 'sada',
    meaning: { ko: '사다', mn: 'Худалдаж авах', ru: 'Покупать', vi: 'Mua' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '이거 살게요.', translation: { ko: '이거 살게요.', mn: 'Үүнийг авъя.', ru: 'Я куплю это.', vi: 'Tôi sẽ mua cái này.' } },
    level: 1,
    frequency: 165,
    tags: ['action', 'shopping']
  },
  {
    id: 'v5-010',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec2',
    lessonId: 'topik1-unit5-sec2-lesson2',
    korean: '카드',
    pronunciation: 'kadeu',
    meaning: { ko: '카드', mn: 'Карт', ru: 'Карта', vi: 'Thẻ' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '카드로 해도 돼요?', translation: { ko: '카드로 해도 돼요?', mn: 'Картаар төлж болох уу?', ru: 'Можно картой?', vi: 'Trả bằng thẻ được không?' } },
    level: 1,
    frequency: 170,
    tags: ['payment', 'shopping']
  },
  {
    id: 'v5-011',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec2',
    lessonId: 'topik1-unit5-sec2-lesson2',
    korean: '현금',
    pronunciation: 'hyeongeum',
    meaning: { ko: '현금', mn: 'Бэлэн мөнгө', ru: 'Наличные', vi: 'Tiền mặt' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '현금으로 계산할게요.', translation: { ko: '현금으로 계산할게요.', mn: 'Бэлэн мөнгөөр төлье.', ru: 'Заплачу наличными.', vi: 'Tôi sẽ trả bằng tiền mặt.' } },
    level: 1,
    frequency: 175,
    tags: ['payment', 'shopping']
  },
  // Colors
  {
    id: 'v5-012',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec1',
    lessonId: 'topik1-unit5-sec1-lesson2',
    korean: '빨간색',
    pronunciation: 'ppalgangsaek',
    meaning: { ko: '빨간색', mn: 'Улаан', ru: 'Красный', vi: 'Màu đỏ' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '빨간색 좋아해요.', translation: { ko: '빨간색 좋아해요.', mn: 'Улаан өнгө дуртай.', ru: 'Люблю красный цвет.', vi: 'Tôi thích màu đỏ.' } },
    level: 1,
    frequency: 176,
    tags: ['color', 'description']
  },
  {
    id: 'v5-013',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec1',
    lessonId: 'topik1-unit5-sec1-lesson2',
    korean: '파란색',
    pronunciation: 'paransaek',
    meaning: { ko: '파란색', mn: 'Цэнхэр', ru: 'Синий', vi: 'Màu xanh dương' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '파란색 티셔츠 있어요?', translation: { ko: '파란색 티셔츠 있어요?', mn: 'Цэнхэр өнгийн футболк байна уу?', ru: 'Есть синяя футболка?', vi: 'Có áo phông màu xanh không?' } },
    level: 1,
    frequency: 177,
    tags: ['color', 'description']
  },
  {
    id: 'v5-014',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec1',
    lessonId: 'topik1-unit5-sec1-lesson2',
    korean: '노란색',
    pronunciation: 'noransaek',
    meaning: { ko: '노란색', mn: 'Шар', ru: 'Жёлтый', vi: 'Màu vàng' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '노란색이 예뻐요.', translation: { ko: '노란색이 예뻐요.', mn: 'Шар өнгө гоё.', ru: 'Жёлтый красивый.', vi: 'Màu vàng đẹp.' } },
    level: 1,
    frequency: 178,
    tags: ['color', 'description']
  },
  {
    id: 'v5-015',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec1',
    lessonId: 'topik1-unit5-sec1-lesson2',
    korean: '검은색',
    pronunciation: 'geomeunsaek',
    meaning: { ko: '검은색', mn: 'Хар', ru: 'Чёрный', vi: 'Màu đen' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '검은색 바지 주세요.', translation: { ko: '검은색 바지 주세요.', mn: 'Хар өмд өгнө үү.', ru: 'Чёрные брюки, пожалуйста.', vi: 'Cho tôi quần màu đen.' } },
    level: 1,
    frequency: 179,
    tags: ['color', 'description']
  },
  {
    id: 'v5-016',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec1',
    lessonId: 'topik1-unit5-sec1-lesson2',
    korean: '흰색',
    pronunciation: 'huinsaek',
    meaning: { ko: '흰색', mn: 'Цагаан', ru: 'Белый', vi: 'Màu trắng' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '흰색 셔츠가 깨끗해요.', translation: { ko: '흰색 셔츠가 깨끗해요.', mn: 'Цагаан цамц цэвэрхэн.', ru: 'Белая рубашка чистая.', vi: 'Áo sơ mi trắng sạch sẽ.' } },
    level: 1,
    frequency: 180,
    tags: ['color', 'description']
  },
  // More clothing
  {
    id: 'v5-017',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec1',
    lessonId: 'topik1-unit5-sec1-lesson1',
    korean: '바지',
    pronunciation: 'baji',
    meaning: { ko: '바지', mn: 'Өмд', ru: 'Брюки', vi: 'Quần' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '청바지를 입어요.', translation: { ko: '청바지를 입어요.', mn: 'Жинс өмддөг.', ru: 'Ношу джинсы.', vi: 'Tôi mặc quần jeans.' } },
    level: 1,
    frequency: 181,
    tags: ['clothing', 'shopping']
  },
  {
    id: 'v5-018',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec1',
    lessonId: 'topik1-unit5-sec1-lesson1',
    korean: '치마',
    pronunciation: 'chima',
    meaning: { ko: '치마', mn: 'Юбка', ru: 'Юбка', vi: 'Váy' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '이 치마 예뻐요.', translation: { ko: '이 치마 예뻐요.', mn: 'Энэ юбка гоё.', ru: 'Эта юбка красивая.', vi: 'Chiếc váy này đẹp.' } },
    level: 1,
    frequency: 182,
    tags: ['clothing', 'shopping']
  },
  {
    id: 'v5-019',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec1',
    lessonId: 'topik1-unit5-sec1-lesson1',
    korean: '모자',
    pronunciation: 'moja',
    meaning: { ko: '모자', mn: 'Малгай', ru: 'Шапка/кепка', vi: 'Mũ' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '모자를 쓰세요.', translation: { ko: '모자를 쓰세요.', mn: 'Малгай өмсөөрэй.', ru: 'Наденьте шапку.', vi: 'Hãy đội mũ.' } },
    level: 1,
    frequency: 183,
    tags: ['clothing', 'accessory']
  },
  // Common adjectives for shopping
  {
    id: 'v5-020',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec2',
    lessonId: 'topik1-unit5-sec2-lesson1',
    korean: '예쁘다',
    pronunciation: 'yeppeuda',
    meaning: { ko: '예쁘다', mn: 'Гоё', ru: 'Красивый', vi: 'Đẹp' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '이 옷이 예뻐요.', translation: { ko: '이 옷이 예뻐요.', mn: 'Энэ хувцас гоё.', ru: 'Эта одежда красивая.', vi: 'Quần áo này đẹp.' } },
    level: 1,
    frequency: 184,
    tags: ['description', 'appearance']
  },
  {
    id: 'v5-021',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec2',
    lessonId: 'topik1-unit5-sec2-lesson1',
    korean: '좋다',
    pronunciation: 'jota',
    meaning: { ko: '좋다', mn: 'Сайн', ru: 'Хороший', vi: 'Tốt' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '날씨가 좋아요.', translation: { ko: '날씨가 좋아요.', mn: 'Цаг агаар сайн.', ru: 'Погода хорошая.', vi: 'Thời tiết đẹp.' } },
    level: 1,
    frequency: 185,
    tags: ['description', 'quality']
  },
  {
    id: 'v5-022',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec2',
    lessonId: 'topik1-unit5-sec2-lesson1',
    korean: '나쁘다',
    pronunciation: 'nappeuda',
    meaning: { ko: '나쁘다', mn: 'Муу', ru: 'Плохой', vi: 'Xấu' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '품질이 나빠요.', translation: { ko: '품질이 나빠요.', mn: 'Чанар муу.', ru: 'Качество плохое.', vi: 'Chất lượng kém.' } },
    level: 1,
    frequency: 186,
    tags: ['description', 'quality']
  },
  {
    id: 'v5-023',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec1',
    lessonId: 'topik1-unit5-sec1-lesson2',
    korean: '새',
    pronunciation: 'sae',
    meaning: { ko: '새', mn: 'Шинэ', ru: 'Новый', vi: 'Mới' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '새 옷을 샀어요.', translation: { ko: '새 옷을 샀어요.', mn: 'Шинэ хувцас авсан.', ru: 'Купил новую одежду.', vi: 'Tôi đã mua quần áo mới.' } },
    level: 1,
    frequency: 187,
    tags: ['description', 'condition']
  },
  // Shopping actions
  {
    id: 'v5-024',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec2',
    lessonId: 'topik1-unit5-sec2-lesson2',
    korean: '입다',
    pronunciation: 'ipda',
    meaning: { ko: '입다', mn: 'Өмсөх', ru: 'Надевать/носить', vi: 'Mặc' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '옷을 입어요.', translation: { ko: '옷을 입어요.', mn: 'Хувцас өмсдөг.', ru: 'Надеваю одежду.', vi: 'Tôi mặc quần áo.' } },
    level: 1,
    frequency: 188,
    tags: ['action', 'clothing']
  },
  {
    id: 'v5-025',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec2',
    lessonId: 'topik1-unit5-sec2-lesson2',
    korean: '신다',
    pronunciation: 'sinda',
    meaning: { ko: '신다', mn: 'Гутал өмсөх', ru: 'Надевать (обувь)', vi: 'Đi (giày)' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '신발을 신어요.', translation: { ko: '신발을 신어요.', mn: 'Гутал өмсдөг.', ru: 'Надеваю обувь.', vi: 'Tôi đi giày.' } },
    level: 1,
    frequency: 189,
    tags: ['action', 'clothing']
  },
  {
    id: 'v5-026',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec2',
    lessonId: 'topik1-unit5-sec2-lesson2',
    korean: '보다',
    pronunciation: 'boda',
    meaning: { ko: '보다', mn: 'Харах', ru: 'Смотреть', vi: 'Xem' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '옷을 봐요.', translation: { ko: '옷을 봐요.', mn: 'Хувцас хардаг.', ru: 'Смотрю одежду.', vi: 'Tôi xem quần áo.' } },
    level: 1,
    frequency: 190,
    tags: ['action', 'shopping']
  },
  // Common question words
  {
    id: 'v5-027',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec2',
    lessonId: 'topik1-unit5-sec2-lesson1',
    korean: '이것',
    pronunciation: 'igeot',
    meaning: { ko: '이것', mn: 'Энэ', ru: 'Это', vi: 'Cái này' },
    partOfSpeech: 'pronoun',
    exampleSentence: { korean: '이것 얼마예요?', translation: { ko: '이것 얼마예요?', mn: 'Энэ хэд вэ?', ru: 'Сколько это?', vi: 'Cái này bao nhiêu?' } },
    level: 1,
    frequency: 191,
    tags: ['demonstrative', 'basic']
  },
  {
    id: 'v5-028',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec2',
    lessonId: 'topik1-unit5-sec2-lesson1',
    korean: '저것',
    pronunciation: 'jeogeot',
    meaning: { ko: '저것', mn: 'Тэр', ru: 'То', vi: 'Cái kia' },
    partOfSpeech: 'pronoun',
    exampleSentence: { korean: '저것 좀 보여 주세요.', translation: { ko: '저것 좀 보여 주세요.', mn: 'Тэрийг үзүүлнэ үү.', ru: 'Покажите то, пожалуйста.', vi: 'Cho tôi xem cái kia.' } },
    level: 1,
    frequency: 192,
    tags: ['demonstrative', 'basic']
  },
  {
    id: 'v5-029',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec2',
    lessonId: 'topik1-unit5-sec2-lesson1',
    korean: '뭐',
    pronunciation: 'mwo',
    meaning: { ko: '뭐', mn: 'Юу', ru: 'Что', vi: 'Cái gì' },
    partOfSpeech: 'pronoun',
    exampleSentence: { korean: '뭐 찾으세요?', translation: { ko: '뭐 찾으세요?', mn: 'Юу хайж байна вэ?', ru: 'Что ищете?', vi: 'Bạn tìm gì?' } },
    level: 1,
    frequency: 193,
    tags: ['question', 'basic']
  },
  {
    id: 'v5-030',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec2',
    lessonId: 'topik1-unit5-sec2-lesson1',
    korean: '어디',
    pronunciation: 'eodi',
    meaning: { ko: '어디', mn: 'Хаана', ru: 'Где', vi: 'Ở đâu' },
    partOfSpeech: 'pronoun',
    exampleSentence: { korean: '화장실이 어디예요?', translation: { ko: '화장실이 어디예요?', mn: 'Ариун цэврийн өрөө хаана байна?', ru: 'Где туалет?', vi: 'Nhà vệ sinh ở đâu?' } },
    level: 1,
    frequency: 194,
    tags: ['question', 'location']
  }
];

// ============================================
// Extra Vocabulary: 신체 (Body Parts)
// ============================================

export const BODY_VOCABULARY: VocabularyWord[] = [
  {
    id: 'vb-001',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '머리',
    pronunciation: 'meori',
    meaning: { ko: '머리', mn: 'Толгой', ru: 'Голова', vi: 'Đầu' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '머리가 아파요.', translation: { ko: '머리가 아파요.', mn: 'Толгой өвддөг.', ru: 'Болит голова.', vi: 'Tôi đau đầu.' } },
    level: 1,
    frequency: 200,
    tags: ['body', 'health']
  },
  {
    id: 'vb-002',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '눈',
    pronunciation: 'nun',
    meaning: { ko: '눈', mn: 'Нүд', ru: 'Глаз', vi: 'Mắt' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '눈이 예뻐요.', translation: { ko: '눈이 예뻐요.', mn: 'Нүд нь гоё.', ru: 'Красивые глаза.', vi: 'Mắt đẹp.' } },
    level: 1,
    frequency: 201,
    tags: ['body', 'face']
  },
  {
    id: 'vb-003',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '코',
    pronunciation: 'ko',
    meaning: { ko: '코', mn: 'Хамар', ru: 'Нос', vi: 'Mũi' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '코가 높아요.', translation: { ko: '코가 높아요.', mn: 'Хамар өндөр.', ru: 'Высокий нос.', vi: 'Mũi cao.' } },
    level: 1,
    frequency: 202,
    tags: ['body', 'face']
  },
  {
    id: 'vb-004',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '입',
    pronunciation: 'ip',
    meaning: { ko: '입', mn: 'Ам', ru: 'Рот', vi: 'Miệng' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '입이 작아요.', translation: { ko: '입이 작아요.', mn: 'Ам жижиг.', ru: 'Маленький рот.', vi: 'Miệng nhỏ.' } },
    level: 1,
    frequency: 203,
    tags: ['body', 'face']
  },
  {
    id: 'vb-005',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '귀',
    pronunciation: 'gwi',
    meaning: { ko: '귀', mn: 'Чих', ru: 'Ухо', vi: 'Tai' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '귀가 아파요.', translation: { ko: '귀가 아파요.', mn: 'Чих өвддөг.', ru: 'Болит ухо.', vi: 'Tôi đau tai.' } },
    level: 1,
    frequency: 204,
    tags: ['body', 'face']
  },
  {
    id: 'vb-006',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '손',
    pronunciation: 'son',
    meaning: { ko: '손', mn: 'Гар', ru: 'Рука (кисть)', vi: 'Tay' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '손을 씻어요.', translation: { ko: '손을 씻어요.', mn: 'Гараа угаана.', ru: 'Мою руки.', vi: 'Tôi rửa tay.' } },
    level: 1,
    frequency: 205,
    tags: ['body', 'limbs']
  },
  {
    id: 'vb-007',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '발',
    pronunciation: 'bal',
    meaning: { ko: '발', mn: 'Хөл', ru: 'Нога (ступня)', vi: 'Chân' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '발이 커요.', translation: { ko: '발이 커요.', mn: 'Хөл том.', ru: 'Большие ноги.', vi: 'Chân to.' } },
    level: 1,
    frequency: 206,
    tags: ['body', 'limbs']
  },
  {
    id: 'vb-008',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '배',
    pronunciation: 'bae',
    meaning: { ko: '배', mn: 'Гэдэс', ru: 'Живот', vi: 'Bụng' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '배가 고파요.', translation: { ko: '배가 고파요.', mn: 'Гэдэс өлсчихлөө.', ru: 'Хочу есть.', vi: 'Tôi đói bụng.' } },
    level: 1,
    frequency: 207,
    tags: ['body', 'torso']
  },
  {
    id: 'vb-009',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '등',
    pronunciation: 'deung',
    meaning: { ko: '등', mn: 'Нуруу', ru: 'Спина', vi: 'Lưng' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '등이 아파요.', translation: { ko: '등이 아파요.', mn: 'Нуруу өвддөг.', ru: 'Болит спина.', vi: 'Tôi đau lưng.' } },
    level: 1,
    frequency: 208,
    tags: ['body', 'torso']
  },
  {
    id: 'vb-010',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '목',
    pronunciation: 'mok',
    meaning: { ko: '목', mn: 'Хүзүү', ru: 'Шея/горло', vi: 'Cổ' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '목이 마르요.', translation: { ko: '목이 마르요.', mn: 'Хоолой хатаж байна.', ru: 'Хочу пить.', vi: 'Tôi khát nước.' } },
    level: 1,
    frequency: 209,
    tags: ['body', 'torso']
  },
  {
    id: 'vb-011',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '얼굴',
    pronunciation: 'eolgul',
    meaning: { ko: '얼굴', mn: 'Царай', ru: 'Лицо', vi: 'Mặt' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '얼굴이 예뻐요.', translation: { ko: '얼굴이 예뻐요.', mn: 'Царай гоё.', ru: 'Красивое лицо.', vi: 'Mặt đẹp.' } },
    level: 1,
    frequency: 210,
    tags: ['body', 'face']
  },
  {
    id: 'vb-012',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson2',
    korean: '다리',
    pronunciation: 'dari',
    meaning: { ko: '다리', mn: 'Хөл', ru: 'Нога', vi: 'Chân' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '다리가 길어요.', translation: { ko: '다리가 길어요.', mn: 'Хөл урт.', ru: 'Длинные ноги.', vi: 'Chân dài.' } },
    level: 1,
    frequency: 211,
    tags: ['body', 'limbs']
  }
];

// ============================================
// Extra Vocabulary: 날씨 (Weather)
// ============================================

export const WEATHER_VOCABULARY: VocabularyWord[] = [
  {
    id: 'vw-001',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '날씨',
    pronunciation: 'nalssi',
    meaning: { ko: '날씨', mn: 'Цаг агаар', ru: 'Погода', vi: 'Thời tiết' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '오늘 날씨가 좋아요.', translation: { ko: '오늘 날씨가 좋아요.', mn: 'Өнөөдөр цаг агаар сайн.', ru: 'Сегодня хорошая погода.', vi: 'Hôm nay thời tiết đẹp.' } },
    level: 1,
    frequency: 220,
    tags: ['weather', 'basic']
  },
  {
    id: 'vw-002',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '비',
    pronunciation: 'bi',
    meaning: { ko: '비', mn: 'Бороо', ru: 'Дождь', vi: 'Mưa' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '비가 와요.', translation: { ko: '비가 와요.', mn: 'Бороо орж байна.', ru: 'Идёт дождь.', vi: 'Trời đang mưa.' } },
    level: 1,
    frequency: 221,
    tags: ['weather', 'precipitation']
  },
  {
    id: 'vw-003',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '눈',
    pronunciation: 'nun',
    meaning: { ko: '눈', mn: 'Цас', ru: 'Снег', vi: 'Tuyết' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '눈이 와요.', translation: { ko: '눈이 와요.', mn: 'Цас орж байна.', ru: 'Идёт снег.', vi: 'Trời đang có tuyết.' } },
    level: 1,
    frequency: 222,
    tags: ['weather', 'precipitation']
  },
  {
    id: 'vw-004',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '바람',
    pronunciation: 'baram',
    meaning: { ko: '바람', mn: 'Салхи', ru: 'Ветер', vi: 'Gió' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '바람이 불어요.', translation: { ko: '바람이 불어요.', mn: 'Салхи салхилж байна.', ru: 'Дует ветер.', vi: 'Gió đang thổi.' } },
    level: 1,
    frequency: 223,
    tags: ['weather', 'wind']
  },
  {
    id: 'vw-005',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '구름',
    pronunciation: 'gureum',
    meaning: { ko: '구름', mn: 'Үүл', ru: 'Облако', vi: 'Mây' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '구름이 많아요.', translation: { ko: '구름이 많아요.', mn: 'Үүл их байна.', ru: 'Много облаков.', vi: 'Nhiều mây.' } },
    level: 1,
    frequency: 224,
    tags: ['weather', 'sky']
  },
  {
    id: 'vw-006',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '덥다',
    pronunciation: 'deopda',
    meaning: { ko: '덥다', mn: 'Халуун', ru: 'Жарко', vi: 'Nóng' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '오늘 너무 더워요.', translation: { ko: '오늘 너무 더워요.', mn: 'Өнөөдөр маш халуун.', ru: 'Сегодня очень жарко.', vi: 'Hôm nay rất nóng.' } },
    level: 1,
    frequency: 225,
    tags: ['weather', 'temperature']
  },
  {
    id: 'vw-007',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '춥다',
    pronunciation: 'chupda',
    meaning: { ko: '춥다', mn: 'Хүйтэн', ru: 'Холодно', vi: 'Lạnh' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '겨울에 추워요.', translation: { ko: '겨울에 추워요.', mn: 'Өвөлдөө хүйтэн.', ru: 'Зимой холодно.', vi: 'Mùa đông lạnh.' } },
    level: 1,
    frequency: 226,
    tags: ['weather', 'temperature']
  },
  {
    id: 'vw-008',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '맑다',
    pronunciation: 'makda',
    meaning: { ko: '맑다', mn: 'Цэлмэг', ru: 'Ясный', vi: 'Trong' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '하늘이 맑아요.', translation: { ko: '하늘이 맑아요.', mn: 'Тэнгэр цэлмэг.', ru: 'Небо ясное.', vi: 'Trời trong.' } },
    level: 1,
    frequency: 227,
    tags: ['weather', 'sky']
  },
  {
    id: 'vw-009',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '흐리다',
    pronunciation: 'heurida',
    meaning: { ko: '흐리다', mn: 'Бүрхэг', ru: 'Пасмурный', vi: 'Âm u' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '오늘 날씨가 흐려요.', translation: { ko: '오늘 날씨가 흐려요.', mn: 'Өнөөдөр бүрхэг.', ru: 'Сегодня пасмурно.', vi: 'Hôm nay trời âm u.' } },
    level: 1,
    frequency: 228,
    tags: ['weather', 'sky']
  },
  {
    id: 'vw-010',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '봄',
    pronunciation: 'bom',
    meaning: { ko: '봄', mn: 'Хавар', ru: 'Весна', vi: 'Mùa xuân' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '봄에 꽃이 피어요.', translation: { ko: '봄에 꽃이 피어요.', mn: 'Хаварт цэцэг дэлгэрдэг.', ru: 'Весной цветут цветы.', vi: 'Mùa xuân hoa nở.' } },
    level: 1,
    frequency: 229,
    tags: ['weather', 'season']
  },
  {
    id: 'vw-011',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '여름',
    pronunciation: 'yeoreum',
    meaning: { ko: '여름', mn: 'Зун', ru: 'Лето', vi: 'Mùa hè' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '여름에 바다에 가요.', translation: { ko: '여름에 바다에 가요.', mn: 'Зунд далайд явдаг.', ru: 'Летом едем на море.', vi: 'Mùa hè đi biển.' } },
    level: 1,
    frequency: 230,
    tags: ['weather', 'season']
  },
  {
    id: 'vw-012',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '가을',
    pronunciation: 'gaeul',
    meaning: { ko: '가을', mn: 'Намар', ru: 'Осень', vi: 'Mùa thu' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '가을에 단풍이 예뻐요.', translation: { ko: '가을에 단풍이 예뻐요.', mn: 'Намарт навчны өнгө гоё.', ru: 'Осенью красивые листья.', vi: 'Mùa thu lá đẹp.' } },
    level: 1,
    frequency: 231,
    tags: ['weather', 'season']
  },
  {
    id: 'vw-013',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '겨울',
    pronunciation: 'gyeoul',
    meaning: { ko: '겨울', mn: 'Өвөл', ru: 'Зима', vi: 'Mùa đông' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '겨울에 눈이 와요.', translation: { ko: '겨울에 눈이 와요.', mn: 'Өвөлд цас орно.', ru: 'Зимой идёт снег.', vi: 'Mùa đông có tuyết.' } },
    level: 1,
    frequency: 232,
    tags: ['weather', 'season']
  }
];

// ============================================
// Extra Vocabulary: 동작 (Actions)
// ============================================

export const ACTION_VOCABULARY: VocabularyWord[] = [
  {
    id: 'va-001',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '자다',
    pronunciation: 'jada',
    meaning: { ko: '자다', mn: 'Унтах', ru: 'Спать', vi: 'Ngủ' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '일찍 자요.', translation: { ko: '일찍 자요.', mn: 'Эрт унтдаг.', ru: 'Сплю рано.', vi: 'Tôi ngủ sớm.' } },
    level: 1,
    frequency: 240,
    tags: ['action', 'daily']
  },
  {
    id: 'va-002',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '일어나다',
    pronunciation: 'ireonada',
    meaning: { ko: '일어나다', mn: 'Босох', ru: 'Вставать', vi: 'Thức dậy' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '아침에 일어나요.', translation: { ko: '아침에 일어나요.', mn: 'Өглөө босно.', ru: 'Встаю утром.', vi: 'Tôi thức dậy vào buổi sáng.' } },
    level: 1,
    frequency: 241,
    tags: ['action', 'daily']
  },
  {
    id: 'va-003',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '씻다',
    pronunciation: 'ssitda',
    meaning: { ko: '씻다', mn: 'Угаах', ru: 'Мыть', vi: 'Rửa' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '손을 씻어요.', translation: { ko: '손을 씻어요.', mn: 'Гараа угаадаг.', ru: 'Мою руки.', vi: 'Tôi rửa tay.' } },
    level: 1,
    frequency: 242,
    tags: ['action', 'daily']
  },
  {
    id: 'va-004',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '걷다',
    pronunciation: 'geotda',
    meaning: { ko: '걷다', mn: 'Алхах', ru: 'Ходить', vi: 'Đi bộ' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '공원에서 걸어요.', translation: { ko: '공원에서 걸어요.', mn: 'Цэцэрлэгт хүрээлэнд алхдаг.', ru: 'Гуляю в парке.', vi: 'Tôi đi bộ trong công viên.' } },
    level: 1,
    frequency: 243,
    tags: ['action', 'movement']
  },
  {
    id: 'va-005',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '뛰다',
    pronunciation: 'ttwida',
    meaning: { ko: '뛰다', mn: 'Гүйх', ru: 'Бегать', vi: 'Chạy' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '빨리 뛰어요.', translation: { ko: '빨리 뛰어요.', mn: 'Хурдан гүйдэг.', ru: 'Бегу быстро.', vi: 'Tôi chạy nhanh.' } },
    level: 1,
    frequency: 244,
    tags: ['action', 'movement']
  },
  {
    id: 'va-006',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '앉다',
    pronunciation: 'anda',
    meaning: { ko: '앉다', mn: 'Суух', ru: 'Сидеть', vi: 'Ngồi' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '의자에 앉아요.', translation: { ko: '의자에 앉아요.', mn: 'Сандал дээр суудаг.', ru: 'Сижу на стуле.', vi: 'Tôi ngồi trên ghế.' } },
    level: 1,
    frequency: 245,
    tags: ['action', 'position']
  },
  {
    id: 'va-007',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '서다',
    pronunciation: 'seoda',
    meaning: { ko: '서다', mn: 'Зогсох', ru: 'Стоять', vi: 'Đứng' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '여기 서세요.', translation: { ko: '여기 서세요.', mn: 'Энд зогсоорой.', ru: 'Стойте здесь.', vi: 'Xin đứng ở đây.' } },
    level: 1,
    frequency: 246,
    tags: ['action', 'position']
  },
  {
    id: 'va-008',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '읽다',
    pronunciation: 'ikda',
    meaning: { ko: '읽다', mn: 'Унших', ru: 'Читать', vi: 'Đọc' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '책을 읽어요.', translation: { ko: '책을 읽어요.', mn: 'Ном уншдаг.', ru: 'Читаю книгу.', vi: 'Tôi đọc sách.' } },
    level: 1,
    frequency: 247,
    tags: ['action', 'study']
  },
  {
    id: 'va-009',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '쓰다',
    pronunciation: 'sseuda',
    meaning: { ko: '쓰다', mn: 'Бичих', ru: 'Писать', vi: 'Viết' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '편지를 써요.', translation: { ko: '편지를 써요.', mn: 'Захиа бичдэг.', ru: 'Пишу письмо.', vi: 'Tôi viết thư.' } },
    level: 1,
    frequency: 248,
    tags: ['action', 'study']
  },
  {
    id: 'va-010',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '듣다',
    pronunciation: 'deutda',
    meaning: { ko: '듣다', mn: 'Сонсох', ru: 'Слушать', vi: 'Nghe' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '음악을 들어요.', translation: { ko: '음악을 들어요.', mn: 'Хөгжим сонсдог.', ru: 'Слушаю музыку.', vi: 'Tôi nghe nhạc.' } },
    level: 1,
    frequency: 249,
    tags: ['action', 'senses']
  },
  {
    id: 'va-011',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '말하다',
    pronunciation: 'malhada',
    meaning: { ko: '말하다', mn: 'Ярих', ru: 'Говорить', vi: 'Nói' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '한국어로 말해요.', translation: { ko: '한국어로 말해요.', mn: 'Солонгосоор ярьдаг.', ru: 'Говорю по-корейски.', vi: 'Tôi nói tiếng Hàn.' } },
    level: 1,
    frequency: 250,
    tags: ['action', 'communication']
  },
  {
    id: 'va-012',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '배우다',
    pronunciation: 'baeuda',
    meaning: { ko: '배우다', mn: 'Сурах', ru: 'Учиться', vi: 'Học' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '한국어를 배워요.', translation: { ko: '한국어를 배워요.', mn: 'Солонгос хэл сурдаг.', ru: 'Учу корейский.', vi: 'Tôi học tiếng Hàn.' } },
    level: 1,
    frequency: 251,
    tags: ['action', 'study']
  },
  {
    id: 'va-013',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '가르치다',
    pronunciation: 'gareuchida',
    meaning: { ko: '가르치다', mn: 'Заах', ru: 'Учить (кого-то)', vi: 'Dạy' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '영어를 가르쳐요.', translation: { ko: '영어를 가르쳐요.', mn: 'Англи хэл заадаг.', ru: 'Преподаю английский.', vi: 'Tôi dạy tiếng Anh.' } },
    level: 1,
    frequency: 252,
    tags: ['action', 'study']
  },
  {
    id: 'va-014',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '일하다',
    pronunciation: 'ilhada',
    meaning: { ko: '일하다', mn: 'Ажиллах', ru: 'Работать', vi: 'Làm việc' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '회사에서 일해요.', translation: { ko: '회사에서 일해요.', mn: 'Компанид ажилладаг.', ru: 'Работаю в компании.', vi: 'Tôi làm việc ở công ty.' } },
    level: 1,
    frequency: 253,
    tags: ['action', 'work']
  },
  {
    id: 'va-015',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '쉬다',
    pronunciation: 'swida',
    meaning: { ko: '쉬다', mn: 'Амрах', ru: 'Отдыхать', vi: 'Nghỉ ngơi' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '주말에 쉬어요.', translation: { ko: '주말에 쉬어요.', mn: 'Амралтын өдөр амардаг.', ru: 'Отдыхаю в выходные.', vi: 'Tôi nghỉ ngơi vào cuối tuần.' } },
    level: 1,
    frequency: 254,
    tags: ['action', 'daily']
  },
  {
    id: 'va-016',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec2',
    lessonId: 'topik1-unit4-sec2-lesson1',
    korean: '먹다',
    pronunciation: 'meokda',
    meaning: { ko: '먹다', mn: 'Идэх', ru: 'Есть', vi: 'Ăn' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '밥을 먹어요.', translation: { ko: '밥을 먹어요.', mn: 'Хоол иддэг.', ru: 'Ем еду.', vi: 'Tôi ăn cơm.' } },
    level: 1,
    frequency: 255,
    tags: ['action', 'food']
  },
  {
    id: 'va-017',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec2',
    lessonId: 'topik1-unit4-sec2-lesson1',
    korean: '마시다',
    pronunciation: 'masida',
    meaning: { ko: '마시다', mn: 'Уух', ru: 'Пить', vi: 'Uống' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '물을 마셔요.', translation: { ko: '물을 마셔요.', mn: 'Ус уудаг.', ru: 'Пью воду.', vi: 'Tôi uống nước.' } },
    level: 1,
    frequency: 256,
    tags: ['action', 'food']
  },
  {
    id: 'va-018',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec2',
    lessonId: 'topik1-unit4-sec2-lesson1',
    korean: '좋아하다',
    pronunciation: 'joahada',
    meaning: { ko: '좋아하다', mn: 'Дуртай', ru: 'Любить/нравиться', vi: 'Thích' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '음악을 좋아해요.', translation: { ko: '음악을 좋아해요.', mn: 'Хөгжимд дуртай.', ru: 'Люблю музыку.', vi: 'Tôi thích âm nhạc.' } },
    level: 1,
    frequency: 257,
    tags: ['action', 'emotion']
  },
  {
    id: 'va-019',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec2',
    lessonId: 'topik1-unit4-sec2-lesson1',
    korean: '싫어하다',
    pronunciation: 'sileohada',
    meaning: { ko: '싫어하다', mn: 'Дургүй', ru: 'Не любить', vi: 'Ghét' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '채소를 싫어해요.', translation: { ko: '채소를 싫어해요.', mn: 'Ногоонд дургүй.', ru: 'Не люблю овощи.', vi: 'Tôi ghét rau.' } },
    level: 1,
    frequency: 258,
    tags: ['action', 'emotion']
  },
  {
    id: 'va-020',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec1',
    lessonId: 'topik1-unit5-sec1-lesson1',
    korean: '사다',
    pronunciation: 'sada',
    meaning: { ko: '사다', mn: 'Худалдаж авах', ru: 'Покупать', vi: 'Mua' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '옷을 사요.', translation: { ko: '옷을 사요.', mn: 'Хувцас худалдаж авдаг.', ru: 'Покупаю одежду.', vi: 'Tôi mua quần áo.' } },
    level: 1,
    frequency: 259,
    tags: ['action', 'shopping']
  },
  {
    id: 'va-021',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec1',
    lessonId: 'topik1-unit5-sec1-lesson1',
    korean: '입다',
    pronunciation: 'ipda',
    meaning: { ko: '입다', mn: 'Өмсөх', ru: 'Надевать (одежду)', vi: 'Mặc' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '청바지를 입어요.', translation: { ko: '청바지를 입어요.', mn: 'Жинс өмддөг.', ru: 'Надеваю джинсы.', vi: 'Tôi mặc quần jeans.' } },
    level: 1,
    frequency: 260,
    tags: ['action', 'clothing']
  },
  {
    id: 'va-022',
    unitId: 'topik1-unit5',
    sectionId: 'topik1-unit5-sec1',
    lessonId: 'topik1-unit5-sec1-lesson1',
    korean: '신다',
    pronunciation: 'sinda',
    meaning: { ko: '신다', mn: 'Өмсөх (гутал)', ru: 'Обувать', vi: 'Đi (giày)' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '운동화를 신어요.', translation: { ko: '운동화를 신어요.', mn: 'Пүүз өмсдөг.', ru: 'Ношу кроссовки.', vi: 'Tôi đi giày thể thao.' } },
    level: 1,
    frequency: 261,
    tags: ['action', 'clothing']
  },
  {
    id: 'va-023',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec2',
    lessonId: 'topik1-unit3-sec2-lesson1',
    korean: '보다',
    pronunciation: 'boda',
    meaning: { ko: '보다', mn: 'Харах', ru: 'Смотреть', vi: 'Xem' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '영화를 봐요.', translation: { ko: '영화를 봐요.', mn: 'Кино үздэг.', ru: 'Смотрю фильм.', vi: 'Tôi xem phim.' } },
    level: 1,
    frequency: 262,
    tags: ['action', 'senses']
  },
  {
    id: 'va-024',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec1',
    lessonId: 'topik1-unit1-sec1-lesson1',
    korean: '만나다',
    pronunciation: 'mannada',
    meaning: { ko: '만나다', mn: 'Уулзах', ru: 'Встречать', vi: 'Gặp' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '친구를 만나요.', translation: { ko: '친구를 만나요.', mn: 'Найзтайгаа уулздаг.', ru: 'Встречаюсь с другом.', vi: 'Tôi gặp bạn.' } },
    level: 1,
    frequency: 263,
    tags: ['action', 'social']
  }
];

// ============================================
// Extra Vocabulary: 감정 (Feelings)
// ============================================

export const FEELING_VOCABULARY: VocabularyWord[] = [
  {
    id: 'vf-001',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec1',
    lessonId: 'topik1-unit1-sec1-lesson1',
    korean: '기쁘다',
    pronunciation: 'gippeuda',
    meaning: { ko: '기쁘다', mn: 'Баяртай', ru: 'Радостный', vi: 'Vui' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '오늘 기뻐요.', translation: { ko: '오늘 기뻐요.', mn: 'Өнөөдөр баяртай байна.', ru: 'Сегодня радостно.', vi: 'Hôm nay tôi vui.' } },
    level: 1,
    frequency: 270,
    tags: ['feeling', 'positive']
  },
  {
    id: 'vf-002',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec1',
    lessonId: 'topik1-unit1-sec1-lesson1',
    korean: '슬프다',
    pronunciation: 'seulpeuda',
    meaning: { ko: '슬프다', mn: 'Гунигтай', ru: 'Грустный', vi: 'Buồn' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '영화가 슬퍼요.', translation: { ko: '영화가 슬퍼요.', mn: 'Кино гунигтай байна.', ru: 'Фильм грустный.', vi: 'Phim buồn.' } },
    level: 1,
    frequency: 271,
    tags: ['feeling', 'negative']
  },
  {
    id: 'vf-003',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec1',
    lessonId: 'topik1-unit1-sec1-lesson1',
    korean: '화나다',
    pronunciation: 'hwanada',
    meaning: { ko: '화나다', mn: 'Уурлах', ru: 'Злиться', vi: 'Tức giận' },
    partOfSpeech: 'verb',
    exampleSentence: { korean: '왜 화났어요?', translation: { ko: '왜 화났어요?', mn: 'Яагаад уурласан юм бэ?', ru: 'Почему злишься?', vi: 'Tại sao bạn tức giận?' } },
    level: 1,
    frequency: 272,
    tags: ['feeling', 'negative']
  },
  {
    id: 'vf-004',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec1',
    lessonId: 'topik1-unit1-sec1-lesson1',
    korean: '무섭다',
    pronunciation: 'museopda',
    meaning: { ko: '무섭다', mn: 'Айдас', ru: 'Страшный', vi: 'Sợ' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '무서운 영화예요.', translation: { ko: '무서운 영화예요.', mn: 'Айдас төрүүлэм кино.', ru: 'Страшный фильм.', vi: 'Đây là phim kinh dị.' } },
    level: 1,
    frequency: 273,
    tags: ['feeling', 'negative']
  },
  {
    id: 'vf-005',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec1',
    lessonId: 'topik1-unit1-sec1-lesson1',
    korean: '피곤하다',
    pronunciation: 'pigonhada',
    meaning: { ko: '피곤하다', mn: 'Ядарсан', ru: 'Уставший', vi: 'Mệt' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '오늘 피곤해요.', translation: { ko: '오늘 피곤해요.', mn: 'Өнөөдөр ядарсан.', ru: 'Сегодня устал.', vi: 'Hôm nay tôi mệt.' } },
    level: 1,
    frequency: 274,
    tags: ['feeling', 'physical']
  },
  {
    id: 'vf-006',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec2',
    lessonId: 'topik1-unit4-sec2-lesson1',
    korean: '배고프다',
    pronunciation: 'baegopeuda',
    meaning: { ko: '배고프다', mn: 'Өлсөх', ru: 'Голодный', vi: 'Đói' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '배고파요.', translation: { ko: '배고파요.', mn: 'Өлссөн байна.', ru: 'Хочу есть.', vi: 'Tôi đói.' } },
    level: 1,
    frequency: 275,
    tags: ['feeling', 'physical']
  },
  {
    id: 'vf-007',
    unitId: 'topik1-unit4',
    sectionId: 'topik1-unit4-sec2',
    lessonId: 'topik1-unit4-sec2-lesson1',
    korean: '목마르다',
    pronunciation: 'mongmareuda',
    meaning: { ko: '목마르다', mn: 'Цангах', ru: 'Хотеть пить', vi: 'Khát' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '목말라요.', translation: { ko: '목말라요.', mn: 'Цангаж байна.', ru: 'Хочу пить.', vi: 'Tôi khát.' } },
    level: 1,
    frequency: 276,
    tags: ['feeling', 'physical']
  },
  {
    id: 'vf-008',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec1',
    lessonId: 'topik1-unit1-sec1-lesson1',
    korean: '아프다',
    pronunciation: 'apeuda',
    meaning: { ko: '아프다', mn: 'Өвдөх', ru: 'Болеть', vi: 'Đau' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '머리가 아파요.', translation: { ko: '머리가 아파요.', mn: 'Толгой өвддөг.', ru: 'Болит голова.', vi: 'Tôi đau đầu.' } },
    level: 1,
    frequency: 277,
    tags: ['feeling', 'physical']
  },
  {
    id: 'vf-009',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec1',
    lessonId: 'topik1-unit1-sec1-lesson1',
    korean: '행복하다',
    pronunciation: 'haengbokhada',
    meaning: { ko: '행복하다', mn: 'Аз жаргалтай', ru: 'Счастливый', vi: 'Hạnh phúc' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '행복해요.', translation: { ko: '행복해요.', mn: 'Аз жаргалтай байна.', ru: 'Я счастлив.', vi: 'Tôi hạnh phúc.' } },
    level: 1,
    frequency: 278,
    tags: ['feeling', 'positive']
  },
  {
    id: 'vf-010',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec1',
    lessonId: 'topik1-unit1-sec1-lesson1',
    korean: '심심하다',
    pronunciation: 'simsimhada',
    meaning: { ko: '심심하다', mn: 'Уйтгартай', ru: 'Скучно', vi: 'Chán' },
    partOfSpeech: 'adjective',
    exampleSentence: { korean: '심심해요.', translation: { ko: '심심해요.', mn: 'Уйтгартай байна.', ru: 'Скучно.', vi: 'Tôi chán.' } },
    level: 1,
    frequency: 279,
    tags: ['feeling', 'negative']
  }
];

// ============================================
// Extra Vocabulary: 자연 (Nature)
// ============================================

export const NATURE_VOCABULARY: VocabularyWord[] = [
  {
    id: 'vn-001',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson2',
    korean: '산',
    pronunciation: 'san',
    meaning: { ko: '산', mn: 'Уул', ru: 'Гора', vi: 'Núi' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '산에 가요.', translation: { ko: '산에 가요.', mn: 'Уулд явдаг.', ru: 'Иду в горы.', vi: 'Tôi đi núi.' } },
    level: 1,
    frequency: 280,
    tags: ['nature', 'place']
  },
  {
    id: 'vn-002',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson2',
    korean: '바다',
    pronunciation: 'bada',
    meaning: { ko: '바다', mn: 'Далай', ru: 'Море', vi: 'Biển' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '바다가 예뻐요.', translation: { ko: '바다가 예뻐요.', mn: 'Далай гоё.', ru: 'Море красивое.', vi: 'Biển đẹp.' } },
    level: 1,
    frequency: 281,
    tags: ['nature', 'place']
  },
  {
    id: 'vn-003',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson2',
    korean: '강',
    pronunciation: 'gang',
    meaning: { ko: '강', mn: 'Гол', ru: 'Река', vi: 'Sông' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '강에서 수영해요.', translation: { ko: '강에서 수영해요.', mn: 'Голд сэлдэг.', ru: 'Плаваю в реке.', vi: 'Tôi bơi ở sông.' } },
    level: 1,
    frequency: 282,
    tags: ['nature', 'place']
  },
  {
    id: 'vn-004',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson2',
    korean: '나무',
    pronunciation: 'namu',
    meaning: { ko: '나무', mn: 'Мод', ru: 'Дерево', vi: 'Cây' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '나무가 많아요.', translation: { ko: '나무가 많아요.', mn: 'Мод их байна.', ru: 'Много деревьев.', vi: 'Có nhiều cây.' } },
    level: 1,
    frequency: 283,
    tags: ['nature', 'plant']
  },
  {
    id: 'vn-005',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson2',
    korean: '꽃',
    pronunciation: 'kkot',
    meaning: { ko: '꽃', mn: 'Цэцэг', ru: 'Цветок', vi: 'Hoa' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '꽃이 예뻐요.', translation: { ko: '꽃이 예뻐요.', mn: 'Цэцэг гоё.', ru: 'Красивый цветок.', vi: 'Hoa đẹp.' } },
    level: 1,
    frequency: 284,
    tags: ['nature', 'plant']
  },
  {
    id: 'vn-006',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '하늘',
    pronunciation: 'haneul',
    meaning: { ko: '하늘', mn: 'Тэнгэр', ru: 'Небо', vi: 'Bầu trời' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '하늘이 파래요.', translation: { ko: '하늘이 파래요.', mn: 'Тэнгэр хөх байна.', ru: 'Небо голубое.', vi: 'Trời xanh.' } },
    level: 1,
    frequency: 285,
    tags: ['nature', 'sky']
  },
  {
    id: 'vn-007',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '해',
    pronunciation: 'hae',
    meaning: { ko: '해', mn: 'Нар', ru: 'Солнце', vi: 'Mặt trời' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '해가 떠요.', translation: { ko: '해가 떠요.', mn: 'Нар мандаж байна.', ru: 'Солнце восходит.', vi: 'Mặt trời mọc.' } },
    level: 1,
    frequency: 286,
    tags: ['nature', 'sky']
  },
  {
    id: 'vn-008',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '달',
    pronunciation: 'dal',
    meaning: { ko: '달', mn: 'Сар', ru: 'Луна', vi: 'Mặt trăng' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '달이 밝아요.', translation: { ko: '달이 밝아요.', mn: 'Сар гэрэлтэй байна.', ru: 'Луна яркая.', vi: 'Mặt trăng sáng.' } },
    level: 1,
    frequency: 287,
    tags: ['nature', 'sky']
  },
  {
    id: 'vn-009',
    unitId: 'topik1-unit2',
    sectionId: 'topik1-unit2-sec2',
    lessonId: 'topik1-unit2-sec2-lesson2',
    korean: '별',
    pronunciation: 'byeol',
    meaning: { ko: '별', mn: 'Од', ru: 'Звезда', vi: 'Ngôi sao' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '별이 많아요.', translation: { ko: '별이 많아요.', mn: 'Од их байна.', ru: 'Много звёзд.', vi: 'Có nhiều ngôi sao.' } },
    level: 1,
    frequency: 288,
    tags: ['nature', 'sky']
  }
];

// ============================================
// Extra Vocabulary: 나라 (Countries)
// ============================================

export const COUNTRY_VOCABULARY: VocabularyWord[] = [
  {
    id: 'vc-001',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson1',
    korean: '한국',
    pronunciation: 'hanguk',
    meaning: { ko: '한국', mn: 'Солонгос', ru: 'Корея', vi: 'Hàn Quốc' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '한국에 살아요.', translation: { ko: '한국에 살아요.', mn: 'Солонгост амьдардаг.', ru: 'Живу в Корее.', vi: 'Tôi sống ở Hàn Quốc.' } },
    level: 1,
    frequency: 290,
    tags: ['country', 'place']
  },
  {
    id: 'vc-002',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson1',
    korean: '몽골',
    pronunciation: 'monggol',
    meaning: { ko: '몽골', mn: 'Монгол', ru: 'Монголия', vi: 'Mông Cổ' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '몽골에서 왔어요.', translation: { ko: '몽골에서 왔어요.', mn: 'Монголоос ирсэн.', ru: 'Из Монголии.', vi: 'Tôi đến từ Mông Cổ.' } },
    level: 1,
    frequency: 291,
    tags: ['country', 'place']
  },
  {
    id: 'vc-003',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson1',
    korean: '러시아',
    pronunciation: 'reosia',
    meaning: { ko: '러시아', mn: 'Орос', ru: 'Россия', vi: 'Nga' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '러시아가 커요.', translation: { ko: '러시아가 커요.', mn: 'Орос улс том.', ru: 'Россия большая.', vi: 'Nước Nga lớn.' } },
    level: 1,
    frequency: 292,
    tags: ['country', 'place']
  },
  {
    id: 'vc-004',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson1',
    korean: '베트남',
    pronunciation: 'beteunam',
    meaning: { ko: '베트남', mn: 'Вьетнам', ru: 'Вьетнам', vi: 'Việt Nam' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '베트남 음식을 좋아해요.', translation: { ko: '베트남 음식을 좋아해요.', mn: 'Вьетнам хоолонд дуртай.', ru: 'Люблю вьетнамскую еду.', vi: 'Tôi thích món Việt.' } },
    level: 1,
    frequency: 293,
    tags: ['country', 'place']
  },
  {
    id: 'vc-005',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson1',
    korean: '카자흐스탄',
    pronunciation: 'kajaheusutan',
    meaning: { ko: '카자흐스탄', mn: 'Казахстан', ru: 'Казахстан', vi: 'Kazakhstan' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '카자흐스탄에서 왔어요.', translation: { ko: '카자흐스탄에서 왔어요.', mn: 'Казахстанаас ирсэн.', ru: 'Из Казахстана.', vi: 'Tôi đến từ Kazakhstan.' } },
    level: 1,
    frequency: 294,
    tags: ['country', 'place']
  },
  {
    id: 'vc-006',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson1',
    korean: '우즈베키스탄',
    pronunciation: 'ujeubekiseutan',
    meaning: { ko: '우즈베키스탄', mn: 'Узбекистан', ru: 'Узбекистан', vi: 'Uzbekistan' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '우즈베키스탄에서 왔어요.', translation: { ko: '우즈베키스탄에서 왔어요.', mn: 'Узбекистанаас ирсэн.', ru: 'Из Узбекистана.', vi: 'Tôi đến từ Uzbekistan.' } },
    level: 1,
    frequency: 295,
    tags: ['country', 'place']
  },
  {
    id: 'vc-007',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson1',
    korean: '일본',
    pronunciation: 'ilbon',
    meaning: { ko: '일본', mn: 'Япон', ru: 'Япония', vi: 'Nhật Bản' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '일본에 여행 가요.', translation: { ko: '일본에 여행 가요.', mn: 'Японд аялал хийдэг.', ru: 'Еду путешествовать в Японию.', vi: 'Tôi đi du lịch Nhật Bản.' } },
    level: 1,
    frequency: 296,
    tags: ['country', 'place']
  },
  {
    id: 'vc-008',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson1',
    korean: '중국',
    pronunciation: 'jungguk',
    meaning: { ko: '중국', mn: 'Хятад', ru: 'Китай', vi: 'Trung Quốc' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '중국 음식을 좋아해요.', translation: { ko: '중국 음식을 좋아해요.', mn: 'Хятад хоолонд дуртай.', ru: 'Люблю китайскую еду.', vi: 'Tôi thích món Trung Quốc.' } },
    level: 1,
    frequency: 297,
    tags: ['country', 'place']
  },
  {
    id: 'vc-009',
    unitId: 'topik1-unit1',
    sectionId: 'topik1-unit1-sec2',
    lessonId: 'topik1-unit1-sec2-lesson1',
    korean: '미국',
    pronunciation: 'miguk',
    meaning: { ko: '미국', mn: 'Америк', ru: 'США', vi: 'Mỹ' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '미국에 친구가 있어요.', translation: { ko: '미국에 친구가 있어요.', mn: 'Америкт найз байдаг.', ru: 'У меня есть друг в США.', vi: 'Tôi có bạn ở Mỹ.' } },
    level: 1,
    frequency: 298,
    tags: ['country', 'place']
  }
];

// ============================================
// Extra Vocabulary: 학교/집 (School/Home)
// ============================================

export const SCHOOL_HOME_VOCABULARY: VocabularyWord[] = [
  {
    id: 'vsh-001',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '수업',
    pronunciation: 'sueop',
    meaning: { ko: '수업', mn: 'Хичээл', ru: 'Урок', vi: 'Bài học' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '수업이 재미있어요.', translation: { ko: '수업이 재미있어요.', mn: 'Хичээл сонирхолтой.', ru: 'Урок интересный.', vi: 'Bài học thú vị.' } },
    level: 1,
    frequency: 300,
    tags: ['school', 'education']
  },
  {
    id: 'vsh-002',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '시험',
    pronunciation: 'siheom',
    meaning: { ko: '시험', mn: 'Шалгалт', ru: 'Экзамен', vi: 'Bài thi' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '시험이 있어요.', translation: { ko: '시험이 있어요.', mn: 'Шалгалт байна.', ru: 'Есть экзамен.', vi: 'Có bài thi.' } },
    level: 1,
    frequency: 301,
    tags: ['school', 'education']
  },
  {
    id: 'vsh-003',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '숙제',
    pronunciation: 'sukje',
    meaning: { ko: '숙제', mn: 'Гэрийн даалгавар', ru: 'Домашнее задание', vi: 'Bài tập về nhà' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '숙제를 해요.', translation: { ko: '숙제를 해요.', mn: 'Гэрийн даалгавар хийдэг.', ru: 'Делаю домашнее задание.', vi: 'Tôi làm bài tập.' } },
    level: 1,
    frequency: 302,
    tags: ['school', 'education']
  },
  {
    id: 'vsh-004',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '공부',
    pronunciation: 'gongbu',
    meaning: { ko: '공부', mn: 'Сурлага', ru: 'Учёба', vi: 'Học tập' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '공부를 열심히 해요.', translation: { ko: '공부를 열심히 해요.', mn: 'Хичээнгүйлэн суралцдаг.', ru: 'Усердно учусь.', vi: 'Tôi học chăm chỉ.' } },
    level: 1,
    frequency: 303,
    tags: ['school', 'education']
  },
  {
    id: 'vsh-005',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '책',
    pronunciation: 'chaek',
    meaning: { ko: '책', mn: 'Ном', ru: 'Книга', vi: 'Sách' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '책을 읽어요.', translation: { ko: '책을 읽어요.', mn: 'Ном уншдаг.', ru: 'Читаю книгу.', vi: 'Tôi đọc sách.' } },
    level: 1,
    frequency: 304,
    tags: ['school', 'education']
  },
  {
    id: 'vsh-006',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '펜',
    pronunciation: 'pen',
    meaning: { ko: '펜', mn: 'Үзэг', ru: 'Ручка', vi: 'Bút' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '펜으로 써요.', translation: { ko: '펜으로 써요.', mn: 'Үзгээр бичдэг.', ru: 'Пишу ручкой.', vi: 'Tôi viết bằng bút.' } },
    level: 1,
    frequency: 305,
    tags: ['school', 'stationery']
  },
  {
    id: 'vsh-007',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '노트',
    pronunciation: 'noteu',
    meaning: { ko: '노트', mn: 'Дэвтэр', ru: 'Тетрадь', vi: 'Vở' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '노트에 써요.', translation: { ko: '노트에 써요.', mn: 'Дэвтэрт бичдэг.', ru: 'Пишу в тетради.', vi: 'Tôi viết vào vở.' } },
    level: 1,
    frequency: 306,
    tags: ['school', 'stationery']
  },
  {
    id: 'vsh-008',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '운동장',
    pronunciation: 'undongjang',
    meaning: { ko: '운동장', mn: 'Тоглоомын талбай', ru: 'Спортплощадка', vi: 'Sân vận động' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '운동장에서 놀아요.', translation: { ko: '운동장에서 놀아요.', mn: 'Тоглоомын талбайд тоглодог.', ru: 'Играю на площадке.', vi: 'Tôi chơi ở sân.' } },
    level: 1,
    frequency: 307,
    tags: ['school', 'place']
  },
  {
    id: 'vsh-009',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '부엌',
    pronunciation: 'bueok',
    meaning: { ko: '부엌', mn: 'Гал тогоо', ru: 'Кухня', vi: 'Nhà bếp' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '부엌에서 요리해요.', translation: { ko: '부엌에서 요리해요.', mn: 'Гал тогоонд хоол хийдэг.', ru: 'Готовлю на кухне.', vi: 'Tôi nấu ăn ở bếp.' } },
    level: 1,
    frequency: 308,
    tags: ['home', 'place']
  },
  {
    id: 'vsh-010',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '거실',
    pronunciation: 'geosil',
    meaning: { ko: '거실', mn: 'Зочны өрөө', ru: 'Гостиная', vi: 'Phòng khách' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '거실에서 TV를 봐요.', translation: { ko: '거실에서 TV를 봐요.', mn: 'Зочны өрөөнд ТВ үздэг.', ru: 'Смотрю ТВ в гостиной.', vi: 'Tôi xem TV ở phòng khách.' } },
    level: 1,
    frequency: 309,
    tags: ['home', 'place']
  },
  {
    id: 'vsh-011',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '침실',
    pronunciation: 'chimsil',
    meaning: { ko: '침실', mn: 'Унтлагын өрөө', ru: 'Спальня', vi: 'Phòng ngủ' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '침실에서 자요.', translation: { ko: '침실에서 자요.', mn: 'Унтлагын өрөөнд унтдаг.', ru: 'Сплю в спальне.', vi: 'Tôi ngủ ở phòng ngủ.' } },
    level: 1,
    frequency: 310,
    tags: ['home', 'place']
  },
  {
    id: 'vsh-012',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '문',
    pronunciation: 'mun',
    meaning: { ko: '문', mn: 'Хаалга', ru: 'Дверь', vi: 'Cửa' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '문을 열어요.', translation: { ko: '문을 열어요.', mn: 'Хаалга нээдэг.', ru: 'Открываю дверь.', vi: 'Tôi mở cửa.' } },
    level: 1,
    frequency: 311,
    tags: ['home', 'object']
  },
  {
    id: 'vsh-013',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '창문',
    pronunciation: 'changmun',
    meaning: { ko: '창문', mn: 'Цонх', ru: 'Окно', vi: 'Cửa sổ' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '창문을 닫아요.', translation: { ko: '창문을 닫아요.', mn: 'Цонхыг хаадаг.', ru: 'Закрываю окно.', vi: 'Tôi đóng cửa sổ.' } },
    level: 1,
    frequency: 312,
    tags: ['home', 'object']
  },
  {
    id: 'vsh-014',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '의자',
    pronunciation: 'uija',
    meaning: { ko: '의자', mn: 'Сандал', ru: 'Стул', vi: 'Ghế' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '의자에 앉아요.', translation: { ko: '의자에 앉아요.', mn: 'Сандал дээр суудаг.', ru: 'Сижу на стуле.', vi: 'Tôi ngồi trên ghế.' } },
    level: 1,
    frequency: 313,
    tags: ['home', 'furniture']
  },
  {
    id: 'vsh-015',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '침대',
    pronunciation: 'chimdae',
    meaning: { ko: '침대', mn: 'Ор', ru: 'Кровать', vi: 'Giường' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '침대에서 자요.', translation: { ko: '침대에서 자요.', mn: 'Орондоо унтдаг.', ru: 'Сплю в кровати.', vi: 'Tôi ngủ trên giường.' } },
    level: 1,
    frequency: 314,
    tags: ['home', 'furniture']
  },
  {
    id: 'vsh-016',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '책상',
    pronunciation: 'chaeksang',
    meaning: { ko: '책상', mn: 'Ширээ', ru: 'Письменный стол', vi: 'Bàn học' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '책상에서 공부해요.', translation: { ko: '책상에서 공부해요.', mn: 'Ширээн дээр хичээллэдэг.', ru: 'Учусь за столом.', vi: 'Tôi học ở bàn.' } },
    level: 1,
    frequency: 315,
    tags: ['home', 'furniture']
  },
  {
    id: 'vsh-017',
    unitId: 'topik1-unit3',
    sectionId: 'topik1-unit3-sec1',
    lessonId: 'topik1-unit3-sec1-lesson1',
    korean: '냉장고',
    pronunciation: 'naengjanggo',
    meaning: { ko: '냉장고', mn: 'Хөргөгч', ru: 'Холодильник', vi: 'Tủ lạnh' },
    partOfSpeech: 'noun',
    exampleSentence: { korean: '냉장고에 음식이 있어요.', translation: { ko: '냉장고에 음식이 있어요.', mn: 'Хөргөгчинд хоол байна.', ru: 'В холодильнике есть еда.', vi: 'Có thức ăn trong tủ lạnh.' } },
    level: 1,
    frequency: 316,
    tags: ['home', 'appliance']
  }
];

// ============================================
// All TOPIK 1 Vocabulary Combined
// ============================================

export const TOPIK1_VOCABULARY: VocabularyWord[] = [
  ...UNIT1_VOCABULARY,
  ...UNIT2_VOCABULARY,
  ...UNIT3_VOCABULARY,
  ...UNIT4_VOCABULARY,
  ...UNIT5_VOCABULARY,
  ...BODY_VOCABULARY,
  ...WEATHER_VOCABULARY,
  ...ACTION_VOCABULARY,
  ...FEELING_VOCABULARY,
  ...NATURE_VOCABULARY,
  ...COUNTRY_VOCABULARY,
  ...SCHOOL_HOME_VOCABULARY
];

// ============================================
// Basic Grammar Points for TOPIK 1
// ============================================

export const TOPIK1_GRAMMAR: GrammarPoint[] = [
  {
    id: 'g1-001',
    unitId: 'topik1-unit1',
    korean: '은/는',
    name: { ko: '주제 조사', mn: 'Сэдвийн нөхцөл', ru: 'Тематическая частица', vi: 'Trợ từ chủ đề' },
    description: {
      ko: '주제를 나타내는 조사. 받침 있는 말 뒤에는 "은", 받침 없는 말 뒤에는 "는"을 붙여요.',
      mn: 'Сэдэв заасан нөхцөл. Үгийн төгсгөлд хамаарч "은" эсвэл "는" хэрэглэнэ.',
      ru: 'Частица для обозначения темы. После согласного "은", после гласного "는".',
      vi: 'Trợ từ chỉ chủ đề. Sau phụ âm cuối "은", sau nguyên âm "는".'
    },
    pattern: '명사 + 은/는',
    examples: [
      { korean: '저는 학생이에요.', translation: { ko: '저는 학생이에요.', mn: 'Би оюутан байна.', ru: 'Я студент.', vi: 'Tôi là sinh viên.' } },
      { korean: '오늘은 날씨가 좋아요.', translation: { ko: '오늘은 날씨가 좋아요.', mn: 'Өнөөдөр цаг агаар сайхан байна.', ru: 'Сегодня хорошая погода.', vi: 'Hôm nay thời tiết đẹp.' } }
    ],
    level: 1
  },
  {
    id: 'g1-002',
    unitId: 'topik1-unit1',
    korean: '이/가',
    name: { ko: '주어 조사', mn: 'Эзэн биеийн нөхцөл', ru: 'Частица подлежащего', vi: 'Trợ từ chủ ngữ' },
    description: {
      ko: '주어를 나타내는 조사. 받침 있는 말 뒤에는 "이", 받침 없는 말 뒤에는 "가"를 붙여요.',
      mn: 'Эзэн биеийг заасан нөхцөл. Үгийн төгсгөлд хамаарч "이" эсвэл "가" хэрэглэнэ.',
      ru: 'Частица для обозначения подлежащего. После согласного "이", после гласного "가".',
      vi: 'Trợ từ chỉ chủ ngữ. Sau phụ âm cuối "이", sau nguyên âm "가".'
    },
    pattern: '명사 + 이/가',
    examples: [
      { korean: '친구가 왔어요.', translation: { ko: '친구가 왔어요.', mn: 'Найз ирлээ.', ru: 'Друг пришёл.', vi: 'Bạn đã đến.' } },
      { korean: '책이 있어요.', translation: { ko: '책이 있어요.', mn: 'Ном байна.', ru: 'Книга есть.', vi: 'Có sách.' } }
    ],
    level: 1
  },
  {
    id: 'g1-003',
    unitId: 'topik1-unit1',
    korean: '을/를',
    name: { ko: '목적어 조사', mn: 'Тусах биеийн нөхцөл', ru: 'Частица дополнения', vi: 'Trợ từ tân ngữ' },
    description: {
      ko: '목적어를 나타내는 조사. 받침 있는 말 뒤에는 "을", 받침 없는 말 뒤에는 "를"을 붙여요.',
      mn: 'Тусах биеийг заасан нөхцөл. Үгийн төгсгөлд хамаарч "을" эсвэл "를" хэрэглэнэ.',
      ru: 'Частица для обозначения дополнения. После согласного "을", после гласного "를".',
      vi: 'Trợ từ chỉ tân ngữ. Sau phụ âm cuối "을", sau nguyên âm "를".'
    },
    pattern: '명사 + 을/를',
    examples: [
      { korean: '밥을 먹어요.', translation: { ko: '밥을 먹어요.', mn: 'Хоол идэж байна.', ru: 'Ем рис.', vi: 'Tôi ăn cơm.' } },
      { korean: '커피를 마셔요.', translation: { ko: '커피를 마셔요.', mn: 'Кофе уужиндаа.', ru: 'Пью кофе.', vi: 'Tôi uống cà phê.' } }
    ],
    level: 1
  },
  {
    id: 'g1-004',
    unitId: 'topik1-unit3',
    korean: '에',
    name: { ko: '장소 조사 (방향/시간)', mn: 'Байршлын нөхцөл', ru: 'Частица места/времени', vi: 'Trợ từ địa điểm' },
    description: {
      ko: '장소(방향)나 시간을 나타내는 조사예요.',
      mn: 'Байршил (чиглэл) эсвэл цаг хугацааг заана.',
      ru: 'Указывает место (направление) или время.',
      vi: 'Chỉ địa điểm (hướng) hoặc thời gian.'
    },
    pattern: '명사 + 에',
    examples: [
      { korean: '학교에 가요.', translation: { ko: '학교에 가요.', mn: 'Сургууль руу явна.', ru: 'Иду в школу.', vi: 'Tôi đi học.' } },
      { korean: '세 시에 만나요.', translation: { ko: '세 시에 만나요.', mn: '3 цагт уулзъя.', ru: 'Встретимся в 3 часа.', vi: 'Gặp nhau lúc 3 giờ.' } }
    ],
    level: 1
  },
  {
    id: 'g1-005',
    unitId: 'topik1-unit3',
    korean: '에서',
    name: { ko: '장소 조사 (동작)', mn: 'Үйлдлийн байршил', ru: 'Частица места действия', vi: 'Trợ từ nơi hành động' },
    description: {
      ko: '동작이 일어나는 장소를 나타내는 조사예요.',
      mn: 'Үйлдэл хийгдэж буй газрыг заана.',
      ru: 'Указывает место, где происходит действие.',
      vi: 'Chỉ nơi hành động diễn ra.'
    },
    pattern: '명사 + 에서',
    examples: [
      { korean: '학교에서 공부해요.', translation: { ko: '학교에서 공부해요.', mn: 'Сургуульд хичээл хийнэ.', ru: 'Учусь в школе.', vi: 'Tôi học ở trường.' } },
      { korean: '식당에서 밥을 먹어요.', translation: { ko: '식당에서 밥을 먹어요.', mn: 'Зоогийн газарт хоол идэж байна.', ru: 'Ем в ресторане.', vi: 'Tôi ăn ở nhà hàng.' } }
    ],
    level: 1
  },
  {
    id: 'g1-006',
    unitId: 'topik1-unit4',
    korean: '이에요/예요',
    name: { ko: '서술격 조사', mn: 'Өгүүлэгч нөхцөл', ru: 'Связка "быть"', vi: 'Động từ "là"' },
    description: {
      ko: '"~이다"의 해요체. 받침 있으면 "이에요", 없으면 "예요"를 써요.',
      mn: '"~이다"-ийн хүндэтгэлийн хэлбэр. Төгсгөлд хамаарч "이에요" эсвэл "예요" хэрэглэнэ.',
      ru: 'Вежливая форма "быть". После согласного "이에요", после гласного "예요".',
      vi: 'Dạng lịch sự của "là". Sau phụ âm cuối "이에요", sau nguyên âm "예요".'
    },
    pattern: '명사 + 이에요/예요',
    examples: [
      { korean: '학생이에요.', translation: { ko: '학생이에요.', mn: 'Оюутан байна.', ru: 'Я студент.', vi: 'Là sinh viên.' } },
      { korean: '커피예요.', translation: { ko: '커피예요.', mn: 'Кофе байна.', ru: 'Это кофе.', vi: 'Là cà phê.' } }
    ],
    level: 1
  },
  // Additional grammar points
  {
    id: 'g1-007',
    unitId: 'topik1-unit2',
    korean: '~아요/어요',
    name: { ko: '해요체 현재형', mn: 'Одоо цагийн хэлбэр', ru: 'Настоящее время', vi: 'Thì hiện tại' },
    description: {
      ko: '동사의 현재형. 어간 마지막 모음이 ㅏ/ㅗ면 "아요", 그 외면 "어요"를 써요.',
      mn: 'Үйл үгийн одоо цаг. Үндсийн эцсийн эгшиг ㅏ/ㅗ бол "아요", бусад үед "어요" хэрэглэнэ.',
      ru: 'Настоящее время глагола. Если последняя гласная основы ㅏ/ㅗ - "아요", иначе "어요".',
      vi: 'Thì hiện tại. Nếu nguyên âm cuối gốc là ㅏ/ㅗ dùng "아요", còn lại "어요".'
    },
    pattern: '동사 어간 + 아요/어요',
    examples: [
      { korean: '가요.', translation: { ko: '가요.', mn: 'Явдаг.', ru: 'Иду.', vi: 'Đi.' } },
      { korean: '먹어요.', translation: { ko: '먹어요.', mn: 'Иддэг.', ru: 'Ем.', vi: 'Ăn.' } }
    ],
    level: 1
  },
  {
    id: 'g1-008',
    unitId: 'topik1-unit2',
    korean: '~았/었어요',
    name: { ko: '해요체 과거형', mn: 'Өнгөрсөн цагийн хэлбэр', ru: 'Прошедшее время', vi: 'Thì quá khứ' },
    description: {
      ko: '동사의 과거형. 어간 마지막 모음이 ㅏ/ㅗ면 "았어요", 그 외면 "었어요"를 써요.',
      mn: 'Үйл үгийн өнгөрсөн цаг. Үндсийн эцсийн эгшиг ㅏ/ㅗ бол "았어요", бусад үед "었어요" хэрэглэнэ.',
      ru: 'Прошедшее время. Если последняя гласная основы ㅏ/ㅗ - "았어요", иначе "었어요".',
      vi: 'Thì quá khứ. Nếu nguyên âm cuối gốc là ㅏ/ㅗ dùng "았어요", còn lại "었어요".'
    },
    pattern: '동사 어간 + 았/었어요',
    examples: [
      { korean: '갔어요.', translation: { ko: '갔어요.', mn: 'Явсан.', ru: 'Ходил.', vi: 'Đã đi.' } },
      { korean: '먹었어요.', translation: { ko: '먹었어요.', mn: 'Идсэн.', ru: 'Ел.', vi: 'Đã ăn.' } }
    ],
    level: 1
  },
  {
    id: 'g1-009',
    unitId: 'topik1-unit3',
    korean: '~(으)로',
    name: { ko: '수단/방향 조사', mn: 'Арга хэрэгсэл/чиглэлийн нөхцөл', ru: 'Частица способа/направления', vi: 'Trợ từ phương tiện' },
    description: {
      ko: '수단이나 방향을 나타내요. 받침 있으면 "으로", 없으면 "로"를 써요.',
      mn: 'Арга хэрэгсэл эсвэл чиглэлийг заана. Төгсгөлд хамаарч "으로" эсвэл "로" хэрэглэнэ.',
      ru: 'Указывает способ или направление. После согласного "으로", после гласного "로".',
      vi: 'Chỉ phương tiện hoặc hướng. Sau phụ âm cuối "으로", sau nguyên âm "로".'
    },
    pattern: '명사 + (으)로',
    examples: [
      { korean: '버스로 가요.', translation: { ko: '버스로 가요.', mn: 'Автобусаар явдаг.', ru: 'Еду на автобусе.', vi: 'Đi bằng xe buýt.' } },
      { korean: '왼쪽으로 가세요.', translation: { ko: '왼쪽으로 가세요.', mn: 'Зүүн тийш явна уу.', ru: 'Идите налево.', vi: 'Đi về phía trái.' } }
    ],
    level: 1
  },
  {
    id: 'g1-010',
    unitId: 'topik1-unit4',
    korean: '~고 싶다',
    name: { ko: '희망 표현', mn: 'Хүсэл илэрхийлэх', ru: 'Выражение желания', vi: 'Diễn đạt mong muốn' },
    description: {
      ko: '하고 싶은 것을 말할 때 써요. 동사 어간에 "고 싶어요"를 붙여요.',
      mn: 'Хийхийг хүссэн зүйлийг хэлэхэд хэрэглэнэ. Үйл үгийн үндэст "고 싶어요" нэмнэ.',
      ru: 'Используется для выражения желания. К основе глагола добавляется "고 싶어요".',
      vi: 'Dùng để nói điều muốn làm. Thêm "고 싶어요" vào gốc động từ.'
    },
    pattern: '동사 어간 + 고 싶어요',
    examples: [
      { korean: '한국에 가고 싶어요.', translation: { ko: '한국에 가고 싶어요.', mn: 'Солонгос руу явмаар байна.', ru: 'Хочу поехать в Корею.', vi: 'Tôi muốn đi Hàn Quốc.' } },
      { korean: '커피 마시고 싶어요.', translation: { ko: '커피 마시고 싶어요.', mn: 'Кофе уумаар байна.', ru: 'Хочу выпить кофе.', vi: 'Tôi muốn uống cà phê.' } }
    ],
    level: 1
  },
  {
    id: 'g1-011',
    unitId: 'topik1-unit5',
    korean: '~(으)세요',
    name: { ko: '존칭 명령/청유', mn: 'Хүндэтгэлийн тушаал', ru: 'Вежливый императив', vi: 'Mệnh lệnh lịch sự' },
    description: {
      ko: '공손하게 부탁하거나 명령할 때 써요. 받침 있으면 "으세요", 없으면 "세요".',
      mn: 'Эелдгээр хүсэлт гаргах эсвэл тушаахад хэрэглэнэ.',
      ru: 'Вежливая просьба или приказ. После согласного "으세요", после гласного "세요".',
      vi: 'Dùng để yêu cầu hoặc ra lệnh lịch sự. Sau phụ âm cuối "으세요", sau nguyên âm "세요".'
    },
    pattern: '동사 어간 + (으)세요',
    examples: [
      { korean: '앉으세요.', translation: { ko: '앉으세요.', mn: 'Суугаарай.', ru: 'Садитесь.', vi: 'Xin mời ngồi.' } },
      { korean: '드세요.', translation: { ko: '드세요.', mn: 'Аваарай.', ru: 'Кушайте.', vi: 'Xin mời dùng.' } }
    ],
    level: 1
  },
  {
    id: 'g1-012',
    unitId: 'topik1-unit4',
    korean: '~(으)ㄹ게요',
    name: { ko: '의지 표현', mn: 'Санаа зорилго илэрхийлэх', ru: 'Выражение намерения', vi: 'Diễn đạt ý định' },
    description: {
      ko: '자신의 의지나 약속을 말할 때 써요.',
      mn: 'Өөрийн санаа зорилго эсвэл амлалтыг хэлэхэд хэрэглэнэ.',
      ru: 'Выражает намерение или обещание.',
      vi: 'Dùng để nói về ý định hoặc lời hứa của bản thân.'
    },
    pattern: '동사 어간 + (으)ㄹ게요',
    examples: [
      { korean: '내일 갈게요.', translation: { ko: '내일 갈게요.', mn: 'Маргааш очно.', ru: 'Приду завтра.', vi: 'Ngày mai tôi sẽ đi.' } },
      { korean: '전화할게요.', translation: { ko: '전화할게요.', mn: 'Утасдана.', ru: 'Позвоню.', vi: 'Tôi sẽ gọi điện.' } }
    ],
    level: 1
  },
  {
    id: 'g1-013',
    unitId: 'topik1-unit3',
    korean: '안',
    name: { ko: '부정 표현', mn: 'Үгүйсгэх хэлбэр', ru: 'Отрицание', vi: 'Phủ định' },
    description: {
      ko: '동사나 형용사 앞에 "안"을 붙여 부정을 표현해요.',
      mn: 'Үйл үг эсвэл тэмдэг нэрийн өмнө "안" нэмж үгүйсгэл илэрхийлнэ.',
      ru: 'Ставится перед глаголом или прилагательным для отрицания.',
      vi: 'Đặt "안" trước động từ hoặc tính từ để phủ định.'
    },
    pattern: '안 + 동사/형용사',
    examples: [
      { korean: '안 먹어요.', translation: { ko: '안 먹어요.', mn: 'Иддэггүй.', ru: 'Не ем.', vi: 'Không ăn.' } },
      { korean: '안 좋아요.', translation: { ko: '안 좋아요.', mn: 'Сайн биш.', ru: 'Не хорошо.', vi: 'Không tốt.' } }
    ],
    level: 1
  },
  {
    id: 'g1-014',
    unitId: 'topik1-unit3',
    korean: '~지 않다',
    name: { ko: '부정 표현 (길게)', mn: 'Үгүйсгэх хэлбэр (урт)', ru: 'Отрицание (длинная форма)', vi: 'Phủ định (dạng dài)' },
    description: {
      ko: '동사나 형용사 어간에 "지 않아요"를 붙여 부정을 표현해요.',
      mn: 'Үйл үг эсвэл тэмдэг нэрийн үндэст "지 않아요" нэмж үгүйсгэл илэрхийлнэ.',
      ru: 'К основе глагола добавляется "지 않아요" для отрицания.',
      vi: 'Thêm "지 않아요" vào gốc động từ/tính từ để phủ định.'
    },
    pattern: '동사/형용사 어간 + 지 않아요',
    examples: [
      { korean: '먹지 않아요.', translation: { ko: '먹지 않아요.', mn: 'Иддэггүй.', ru: 'Не ем.', vi: 'Không ăn.' } },
      { korean: '비싸지 않아요.', translation: { ko: '비싸지 않아요.', mn: 'Үнэтэй биш.', ru: 'Не дорого.', vi: 'Không đắt.' } }
    ],
    level: 1
  },
  {
    id: 'g1-015',
    unitId: 'topik1-unit5',
    korean: '~(으)ㄹ 수 있다',
    name: { ko: '가능 표현', mn: 'Чадах илэрхийлэл', ru: 'Выражение возможности', vi: 'Diễn đạt khả năng' },
    description: {
      ko: '무엇을 할 수 있는지 말할 때 써요.',
      mn: 'Ямар нэгэн зүйл хийх чадвартай эсэхийг хэлэхэд хэрэглэнэ.',
      ru: 'Используется для выражения возможности сделать что-то.',
      vi: 'Dùng để nói có thể làm được điều gì đó.'
    },
    pattern: '동사 어간 + (으)ㄹ 수 있어요',
    examples: [
      { korean: '한국어를 말할 수 있어요.', translation: { ko: '한국어를 말할 수 있어요.', mn: 'Солонгосоор ярьж чаддаг.', ru: 'Могу говорить по-корейски.', vi: 'Tôi có thể nói tiếng Hàn.' } },
      { korean: '수영할 수 있어요?', translation: { ko: '수영할 수 있어요?', mn: 'Сэлж чадах уу?', ru: 'Умеете плавать?', vi: 'Bạn có biết bơi không?' } }
    ],
    level: 1
  },
  // ============================================
  // Additional Grammar Points (16-35)
  // ============================================
  {
    id: 'g1-016',
    unitId: 'topik1-unit2',
    korean: '~부터 ~까지',
    name: { ko: '범위 표현', mn: 'Хүрээ илэрхийлэл', ru: 'Выражение диапазона', vi: 'Biểu đạt phạm vi' },
    description: {
      ko: '시작점과 끝점을 나타내요. "부터"는 시작, "까지"는 끝을 의미해요.',
      mn: 'Эхлэл ба төгсгөлийн цэгийг заана. "부터" эхлэл, "까지" төгсгөлийг илэрхийлнэ.',
      ru: 'Указывает начальную и конечную точки. "부터" - начало, "까지" - конец.',
      vi: 'Chỉ điểm bắt đầu và kết thúc. "부터" là bắt đầu, "까지" là kết thúc.'
    },
    pattern: '명사 + 부터 + 명사 + 까지',
    examples: [
      { korean: '9시부터 6시까지 일해요.', translation: { ko: '9시부터 6시까지 일해요.', mn: '9 цагаас 6 цаг хүртэл ажилладаг.', ru: 'Работаю с 9 до 6.', vi: 'Tôi làm việc từ 9 giờ đến 6 giờ.' } },
      { korean: '서울부터 부산까지 얼마나 걸려요?', translation: { ko: '서울부터 부산까지 얼마나 걸려요?', mn: 'Сөүлээс Пусан хүртэл хэр удаан явдаг вэ?', ru: 'Сколько времени от Сеула до Пусана?', vi: 'Từ Seoul đến Busan mất bao lâu?' } }
    ],
    level: 1
  },
  {
    id: 'g1-017',
    unitId: 'topik1-unit2',
    korean: '~도',
    name: { ko: '첨가 조사', mn: 'Нэмэлт нөхцөл', ru: 'Частица "тоже"', vi: 'Trợ từ "cũng"' },
    description: {
      ko: '"도"를 붙이면 "~도 마찬가지로"라는 뜻이에요.',
      mn: '"도" нэмвэл "мөн адил" гэсэн утгатай.',
      ru: 'Добавление "도" означает "тоже", "также".',
      vi: 'Thêm "도" có nghĩa là "cũng", "cũng vậy".'
    },
    pattern: '명사 + 도',
    examples: [
      { korean: '저도 학생이에요.', translation: { ko: '저도 학생이에요.', mn: 'Би ч бас оюутан.', ru: 'Я тоже студент.', vi: 'Tôi cũng là sinh viên.' } },
      { korean: '커피도 주세요.', translation: { ko: '커피도 주세요.', mn: 'Кофе ч бас өгнө үү.', ru: 'Кофе тоже, пожалуйста.', vi: 'Cho tôi cà phê nữa.' } }
    ],
    level: 1
  },
  {
    id: 'g1-018',
    unitId: 'topik1-unit2',
    korean: '~만',
    name: { ko: '한정 조사', mn: 'Хязгаарлагч нөхцөл', ru: 'Ограничительная частица', vi: 'Trợ từ hạn định' },
    description: {
      ko: '"만"은 "오직 ~만"이라는 뜻으로 다른 것은 제외해요.',
      mn: '"만" нь "зөвхөн" гэсэн утгатай, бусдыг хасна.',
      ru: '"만" означает "только", исключая другое.',
      vi: '"만" có nghĩa là "chỉ", loại trừ những thứ khác.'
    },
    pattern: '명사 + 만',
    examples: [
      { korean: '물만 마셔요.', translation: { ko: '물만 마셔요.', mn: 'Зөвхөн ус уудаг.', ru: 'Пью только воду.', vi: 'Tôi chỉ uống nước.' } },
      { korean: '한국어만 공부해요.', translation: { ko: '한국어만 공부해요.', mn: 'Зөвхөн солонгос хэл сурдаг.', ru: 'Учу только корейский.', vi: 'Tôi chỉ học tiếng Hàn.' } }
    ],
    level: 1
  },
  {
    id: 'g1-019',
    unitId: 'topik1-unit3',
    korean: '~보다',
    name: { ko: '비교 조사', mn: 'Харьцуулах нөхцөл', ru: 'Сравнительная частица', vi: 'Trợ từ so sánh' },
    description: {
      ko: '두 가지를 비교할 때 기준이 되는 것에 "보다"를 붙여요.',
      mn: 'Хоёр зүйлийг харьцуулахад жишсэн зүйлд "보다" нэмнэ.',
      ru: 'При сравнении "보다" добавляется к эталону сравнения.',
      vi: 'Khi so sánh, thêm "보다" vào đối tượng được so sánh.'
    },
    pattern: '명사 + 보다',
    examples: [
      { korean: '한국어가 영어보다 어려워요.', translation: { ko: '한국어가 영어보다 어려워요.', mn: 'Солонгос хэл англи хэлнээс хэцүү.', ru: 'Корейский сложнее английского.', vi: 'Tiếng Hàn khó hơn tiếng Anh.' } },
      { korean: '오늘이 어제보다 더워요.', translation: { ko: '오늘이 어제보다 더워요.', mn: 'Өнөөдөр өчигдрөөс илүү халуун байна.', ru: 'Сегодня жарче, чем вчера.', vi: 'Hôm nay nóng hơn hôm qua.' } }
    ],
    level: 1
  },
  {
    id: 'g1-020',
    unitId: 'topik1-unit2',
    korean: '~와/과, 하고',
    name: { ko: '접속 조사', mn: 'Холбох нөхцөл', ru: 'Соединительная частица', vi: 'Trợ từ liên kết' },
    description: {
      ko: '명사를 연결할 때 써요. 받침 있으면 "과", 없으면 "와". "하고"는 구어체에서 많이 써요.',
      mn: 'Нэр үгсийг холбоход хэрэглэнэ. Төгсгөлд "과" эсвэл "와" хэрэглэнэ. "하고" ярианы хэлэнд түгээмэл.',
      ru: 'Для соединения существительных. После согласного "과", после гласного "와". "하고" используется в разговорной речи.',
      vi: 'Dùng để nối danh từ. Sau phụ âm cuối "과", sau nguyên âm "와". "하고" dùng trong khẩu ngữ.'
    },
    pattern: '명사 + 와/과/하고 + 명사',
    examples: [
      { korean: '사과와 바나나를 샀어요.', translation: { ko: '사과와 바나나를 샀어요.', mn: 'Алим, гадил авсан.', ru: 'Купил яблоко и банан.', vi: 'Tôi đã mua táo và chuối.' } },
      { korean: '친구하고 영화 봤어요.', translation: { ko: '친구하고 영화 봤어요.', mn: 'Найзтайгаа кино үзсэн.', ru: 'Смотрел фильм с другом.', vi: 'Tôi đã xem phim với bạn.' } }
    ],
    level: 1
  },
  {
    id: 'g1-021',
    unitId: 'topik1-unit3',
    korean: '~(이)나',
    name: { ko: '선택 조사', mn: 'Сонголтын нөхцөл', ru: 'Частица выбора', vi: 'Trợ từ chọn lựa' },
    description: {
      ko: '둘 이상 중에서 선택할 때 써요. 받침 있으면 "이나", 없으면 "나".',
      mn: 'Хоёр болон түүнээс дээш зүйлээс сонгоход хэрэглэнэ.',
      ru: 'При выборе из двух и более. После согласного "이나", после гласного "나".',
      vi: 'Dùng khi chọn từ hai thứ trở lên. Sau phụ âm cuối "이나", sau nguyên âm "나".'
    },
    pattern: '명사 + (이)나',
    examples: [
      { korean: '커피나 차 드릴까요?', translation: { ko: '커피나 차 드릴까요?', mn: 'Кофе эсвэл цай авах уу?', ru: 'Кофе или чай?', vi: 'Bạn dùng cà phê hay trà?' } },
      { korean: '주말에 영화나 봐요.', translation: { ko: '주말에 영화나 봐요.', mn: 'Амралтын өдөр кино үзье.', ru: 'Посмотрим кино в выходные.', vi: 'Cuối tuần xem phim đi.' } }
    ],
    level: 1
  },
  {
    id: 'g1-022',
    unitId: 'topik1-unit4',
    korean: '~(으)면',
    name: { ko: '조건 표현', mn: 'Нөхцөлт илэрхийлэл', ru: 'Условие', vi: 'Điều kiện' },
    description: {
      ko: '"만약 ~라면"이라는 조건을 나타내요. 받침 있으면 "으면", 없으면 "면".',
      mn: '"хэрэв" гэсэн нөхцлийг илэрхийлнэ.',
      ru: 'Выражает условие "если". После согласного "으면", после гласного "면".',
      vi: 'Diễn đạt điều kiện "nếu". Sau phụ âm cuối "으면", sau nguyên âm "면".'
    },
    pattern: '동사/형용사 어간 + (으)면',
    examples: [
      { korean: '시간이 있으면 만나요.', translation: { ko: '시간이 있으면 만나요.', mn: 'Цаг байвал уулзъя.', ru: 'Если будет время, встретимся.', vi: 'Nếu có thời gian thì gặp nhau.' } },
      { korean: '비가 오면 집에 있어요.', translation: { ko: '비가 오면 집에 있어요.', mn: 'Бороо орвол гэртээ байна.', ru: 'Если пойдёт дождь, буду дома.', vi: 'Nếu trời mưa thì tôi ở nhà.' } }
    ],
    level: 1
  },
  {
    id: 'g1-023',
    unitId: 'topik1-unit4',
    korean: '~는데/은데/인데',
    name: { ko: '배경 표현', mn: 'Суурь илэрхийлэл', ru: 'Фоновое выражение', vi: 'Diễn đạt bối cảnh' },
    description: {
      ko: '배경 상황을 설명하거나 대조할 때 써요. 동사에는 "는데", 형용사에는 받침에 따라 "은데/ㄴ데".',
      mn: 'Суурь нөхцөл байдлыг тайлбарлах эсвэл эсрэгцүүлэхэд хэрэглэнэ.',
      ru: 'Для описания фоновой ситуации или контраста.',
      vi: 'Dùng để giải thích tình huống nền hoặc đối chiếu.'
    },
    pattern: '동사 + 는데 / 형용사 + 은데/ㄴ데',
    examples: [
      { korean: '배가 고픈데 뭐 먹을까요?', translation: { ko: '배가 고픈데 뭐 먹을까요?', mn: 'Өлссөн байна, юу идэх вэ?', ru: 'Я голодный, что поесть?', vi: 'Tôi đói, ăn gì đây?' } },
      { korean: '날씨가 좋은데 산책해요.', translation: { ko: '날씨가 좋은데 산책해요.', mn: 'Цаг агаар сайхан байна, алхъя.', ru: 'Погода хорошая, давай прогуляемся.', vi: 'Thời tiết đẹp, đi dạo đi.' } }
    ],
    level: 1
  },
  {
    id: 'g1-024',
    unitId: 'topik1-unit4',
    korean: '~(으)려고',
    name: { ko: '목적 표현', mn: 'Зорилгын илэрхийлэл', ru: 'Выражение цели', vi: 'Diễn đạt mục đích' },
    description: {
      ko: '무엇을 하려는 목적이나 의도를 나타내요.',
      mn: 'Ямар нэгэн зүйл хийх зорилго, санаа зорилгыг илэрхийлнэ.',
      ru: 'Выражает цель или намерение сделать что-то.',
      vi: 'Diễn đạt mục đích hoặc ý định làm gì đó.'
    },
    pattern: '동사 어간 + (으)려고',
    examples: [
      { korean: '한국어를 배우려고 한국에 왔어요.', translation: { ko: '한국어를 배우려고 한국에 왔어요.', mn: 'Солонгос хэл сурахаар Солонгост ирсэн.', ru: 'Приехал в Корею, чтобы учить корейский.', vi: 'Tôi đến Hàn Quốc để học tiếng Hàn.' } },
      { korean: '뭐 사려고 가요?', translation: { ko: '뭐 사려고 가요?', mn: 'Юу авахаар явж байгаа вэ?', ru: 'Что собираешься купить?', vi: 'Bạn đi mua gì vậy?' } }
    ],
    level: 1
  },
  {
    id: 'g1-025',
    unitId: 'topik1-unit4',
    korean: '~기 전에',
    name: { ko: '시간 순서 (전)', mn: 'Цаг хугацааны дараалал (өмнө)', ru: 'Временная последовательность (до)', vi: 'Trình tự thời gian (trước)' },
    description: {
      ko: '어떤 행동을 하기 전의 시간을 나타내요.',
      mn: 'Ямар нэгэн үйлдэл хийхээс өмнөх цагийг илэрхийлнэ.',
      ru: 'Указывает время до какого-то действия.',
      vi: 'Chỉ thời gian trước khi làm hành động nào đó.'
    },
    pattern: '동사 어간 + 기 전에',
    examples: [
      { korean: '자기 전에 이를 닦아요.', translation: { ko: '자기 전에 이를 닦아요.', mn: 'Унтахын өмнө шүд угаана.', ru: 'Чищу зубы перед сном.', vi: 'Tôi đánh răng trước khi ngủ.' } },
      { korean: '밥 먹기 전에 손을 씻어요.', translation: { ko: '밥 먹기 전에 손을 씻어요.', mn: 'Хоол идэхийн өмнө гар угаана.', ru: 'Мою руки перед едой.', vi: 'Tôi rửa tay trước khi ăn.' } }
    ],
    level: 1
  },
  {
    id: 'g1-026',
    unitId: 'topik1-unit4',
    korean: '~(으)ㄴ 후에',
    name: { ko: '시간 순서 (후)', mn: 'Цаг хугацааны дараалал (дараа)', ru: 'Временная последовательность (после)', vi: 'Trình tự thời gian (sau)' },
    description: {
      ko: '어떤 행동을 한 후의 시간을 나타내요.',
      mn: 'Ямар нэгэн үйлдэл хийсний дараах цагийг илэрхийлнэ.',
      ru: 'Указывает время после какого-то действия.',
      vi: 'Chỉ thời gian sau khi làm hành động nào đó.'
    },
    pattern: '동사 어간 + (으)ㄴ 후에',
    examples: [
      { korean: '수업이 끝난 후에 만나요.', translation: { ko: '수업이 끝난 후에 만나요.', mn: 'Хичээл дууссаны дараа уулзъя.', ru: 'Встретимся после занятий.', vi: 'Gặp nhau sau khi hết giờ học.' } },
      { korean: '밥을 먹은 후에 커피 마셔요.', translation: { ko: '밥을 먹은 후에 커피 마셔요.', mn: 'Хоол идсэний дараа кофе уудаг.', ru: 'Пью кофе после еды.', vi: 'Tôi uống cà phê sau khi ăn.' } }
    ],
    level: 1
  },
  {
    id: 'g1-027',
    unitId: 'topik1-unit5',
    korean: '~기 때문에',
    name: { ko: '이유 표현', mn: 'Шалтгааны илэрхийлэл', ru: 'Выражение причины', vi: 'Diễn đạt lý do' },
    description: {
      ko: '어떤 일의 이유나 원인을 말할 때 써요.',
      mn: 'Ямар нэгэн зүйлийн шалтгаан, учир шалтгааныг хэлэхэд хэрэглэнэ.',
      ru: 'Используется для объяснения причины.',
      vi: 'Dùng để nói lý do hoặc nguyên nhân của việc gì đó.'
    },
    pattern: '동사/형용사 어간 + 기 때문에',
    examples: [
      { korean: '바쁘기 때문에 못 가요.', translation: { ko: '바쁘기 때문에 못 가요.', mn: 'Завгүй учраас явж чадахгүй.', ru: 'Не могу пойти, потому что занят.', vi: 'Vì bận nên tôi không thể đi.' } },
      { korean: '비가 오기 때문에 우산이 필요해요.', translation: { ko: '비가 오기 때문에 우산이 필요해요.', mn: 'Бороо орж байгаа учраас шүхэр хэрэгтэй.', ru: 'Нужен зонт, потому что идёт дождь.', vi: 'Vì trời mưa nên cần ô.' } }
    ],
    level: 1
  },
  {
    id: 'g1-028',
    unitId: 'topik1-unit4',
    korean: '~아서/어서',
    name: { ko: '순서/이유 연결', mn: 'Дараалал/шалтгаан холболт', ru: 'Последовательность/причина', vi: 'Nối trình tự/lý do' },
    description: {
      ko: '두 문장을 이유나 순서로 연결해요. 모음에 따라 "아서" 또는 "어서".',
      mn: 'Хоёр өгүүлбэрийг шалтгаан эсвэл дарааллаар холбоно.',
      ru: 'Соединяет два предложения причиной или последовательностью.',
      vi: 'Nối hai câu theo lý do hoặc trình tự.'
    },
    pattern: '동사/형용사 어간 + 아서/어서',
    examples: [
      { korean: '만나서 반가워요.', translation: { ko: '만나서 반가워요.', mn: 'Танилцаж байгаадаа баяртай байна.', ru: 'Рад встрече.', vi: 'Rất vui được gặp.' } },
      { korean: '피곤해서 일찍 잤어요.', translation: { ko: '피곤해서 일찍 잤어요.', mn: 'Ядарсан учраас эрт унтсан.', ru: 'Устал, поэтому рано лёг.', vi: 'Mệt nên ngủ sớm.' } }
    ],
    level: 1
  },
  {
    id: 'g1-029',
    unitId: 'topik1-unit5',
    korean: '~게',
    name: { ko: '부사형 어미', mn: 'Дайвар үгийн төгсгөл', ru: 'Наречная форма', vi: 'Đuôi trạng từ' },
    description: {
      ko: '형용사를 부사처럼 만들어 동사를 꾸며줘요.',
      mn: 'Тэмдэг нэрийг дайвар үг болгож үйл үгийг тодруулна.',
      ru: 'Превращает прилагательное в наречие.',
      vi: 'Biến tính từ thành trạng từ để bổ nghĩa cho động từ.'
    },
    pattern: '형용사 어간 + 게',
    examples: [
      { korean: '크게 말해 주세요.', translation: { ko: '크게 말해 주세요.', mn: 'Чангаар ярина уу.', ru: 'Говорите громче.', vi: 'Xin nói to lên.' } },
      { korean: '맛있게 드세요.', translation: { ko: '맛있게 드세요.', mn: 'Амттай идээрэй.', ru: 'Приятного аппетита.', vi: 'Ăn ngon miệng nhé.' } }
    ],
    level: 1
  },
  {
    id: 'g1-030',
    unitId: 'topik1-unit3',
    korean: '~지 마세요',
    name: { ko: '금지 표현', mn: 'Хориглох илэрхийлэл', ru: 'Запрет', vi: 'Cấm đoán' },
    description: {
      ko: '무엇을 하지 말라고 부탁하거나 금지할 때 써요.',
      mn: 'Ямар нэгэн зүйл хийхгүй байхыг хүсэх эсвэл хориглоход хэрэглэнэ.',
      ru: 'Вежливая просьба не делать что-то.',
      vi: 'Dùng để yêu cầu hoặc cấm không làm điều gì đó.'
    },
    pattern: '동사 어간 + 지 마세요',
    examples: [
      { korean: '여기서 담배 피우지 마세요.', translation: { ko: '여기서 담배 피우지 마세요.', mn: 'Энд тамхи татаж болохгүй.', ru: 'Не курите здесь.', vi: 'Xin đừng hút thuốc ở đây.' } },
      { korean: '걱정하지 마세요.', translation: { ko: '걱정하지 마세요.', mn: 'Санаа зовох хэрэггүй.', ru: 'Не беспокойтесь.', vi: 'Đừng lo lắng.' } }
    ],
    level: 1
  },
  {
    id: 'g1-031',
    unitId: 'topik1-unit4',
    korean: '~(으)ㄹ까요?',
    name: { ko: '제안/추측 의문', mn: 'Санал/таамаглал асуулт', ru: 'Предложение/предположение', vi: 'Đề nghị/suy đoán' },
    description: {
      ko: '함께 할 것을 제안하거나 상대의 의견을 물을 때 써요.',
      mn: 'Хамт хийх зүйлийг санал болгох эсвэл нөгөөдийнхөө санааг асуухад хэрэглэнэ.',
      ru: 'Для предложения сделать что-то вместе или спросить мнение.',
      vi: 'Dùng để đề nghị làm cùng hoặc hỏi ý kiến.'
    },
    pattern: '동사 어간 + (으)ㄹ까요?',
    examples: [
      { korean: '같이 갈까요?', translation: { ko: '같이 갈까요?', mn: 'Хамт явах уу?', ru: 'Пойдём вместе?', vi: 'Đi cùng nhé?' } },
      { korean: '뭐 먹을까요?', translation: { ko: '뭐 먹을까요?', mn: 'Юу идэх вэ?', ru: 'Что будем есть?', vi: 'Ăn gì đây?' } }
    ],
    level: 1
  },
  {
    id: 'g1-032',
    unitId: 'topik1-unit4',
    korean: '~(으)ㅂ시다',
    name: { ko: '청유형', mn: 'Уриалгын хэлбэр', ru: 'Приглашение', vi: 'Thể rủ rê' },
    description: {
      ko: '함께 무엇을 하자고 제안할 때 써요.',
      mn: 'Хамт ямар нэгэн зүйл хийхийг санал болгоход хэрэглэнэ.',
      ru: 'Приглашение сделать что-то вместе.',
      vi: 'Dùng để rủ làm gì đó cùng nhau.'
    },
    pattern: '동사 어간 + (으)ㅂ시다',
    examples: [
      { korean: '같이 점심 먹읍시다.', translation: { ko: '같이 점심 먹읍시다.', mn: 'Хамт өдрийн хоол идье.', ru: 'Давайте вместе пообедаем.', vi: 'Chúng ta cùng ăn trưa đi.' } },
      { korean: '시작합시다!', translation: { ko: '시작합시다!', mn: 'Эхэлцгээе!', ru: 'Давайте начнём!', vi: 'Bắt đầu nào!' } }
    ],
    level: 1
  },
  {
    id: 'g1-033',
    unitId: 'topik1-unit5',
    korean: '~(으)면서',
    name: { ko: '동시 동작', mn: 'Зэрэг үйлдэл', ru: 'Одновременные действия', vi: 'Hành động đồng thời' },
    description: {
      ko: '두 가지 동작을 동시에 할 때 써요.',
      mn: 'Хоёр үйлдэл зэрэг хийхийг илэрхийлнэ.',
      ru: 'Для выражения двух одновременных действий.',
      vi: 'Dùng khi làm hai hành động cùng lúc.'
    },
    pattern: '동사 어간 + (으)면서',
    examples: [
      { korean: '음악을 들으면서 공부해요.', translation: { ko: '음악을 들으면서 공부해요.', mn: 'Хөгжим сонсохын зэрэгцээ хичээлээ хийдэг.', ru: 'Учусь, слушая музыку.', vi: 'Tôi học trong khi nghe nhạc.' } },
      { korean: '걸으면서 이야기해요.', translation: { ko: '걸으면서 이야기해요.', mn: 'Алхаж байхдаа ярилцдаг.', ru: 'Разговариваем во время прогулки.', vi: 'Nói chuyện trong khi đi bộ.' } }
    ],
    level: 1
  },
  {
    id: 'g1-034',
    unitId: 'topik1-unit5',
    korean: '~기',
    name: { ko: '명사화', mn: 'Нэр үгжүүлэлт', ru: 'Номинализация', vi: 'Danh từ hóa' },
    description: {
      ko: '동사나 형용사를 명사처럼 만들어요.',
      mn: 'Үйл үг эсвэл тэмдэг нэрийг нэр үг болгоно.',
      ru: 'Превращает глагол или прилагательное в существительное.',
      vi: 'Biến động từ hoặc tính từ thành danh từ.'
    },
    pattern: '동사/형용사 어간 + 기',
    examples: [
      { korean: '수영하기를 좋아해요.', translation: { ko: '수영하기를 좋아해요.', mn: 'Сэлэхдээ дуртай.', ru: 'Люблю плавать.', vi: 'Tôi thích bơi.' } },
      { korean: '한국어 배우기가 어려워요.', translation: { ko: '한국어 배우기가 어려워요.', mn: 'Солонгос хэл сурах хэцүү байна.', ru: 'Учить корейский сложно.', vi: 'Học tiếng Hàn khó.' } }
    ],
    level: 1
  },
  {
    id: 'g1-035',
    unitId: 'topik1-unit5',
    korean: '~는/은/ㄴ',
    name: { ko: '관형형', mn: 'Тодотгогч хэлбэр', ru: 'Определительная форма', vi: 'Dạng định ngữ' },
    description: {
      ko: '동사나 형용사가 명사를 꾸며줄 때 써요. 동사 현재는 "는", 형용사는 "은/ㄴ".',
      mn: 'Үйл үг эсвэл тэмдэг нэр нэр үгийг тодруулахад хэрэглэнэ.',
      ru: 'Для определения существительного. Глагол наст. вр. "는", прилагательное "은/ㄴ".',
      vi: 'Dùng khi động từ/tính từ bổ nghĩa cho danh từ.'
    },
    pattern: '동사 + 는 / 형용사 + 은/ㄴ + 명사',
    examples: [
      { korean: '지금 읽는 책이 재미있어요.', translation: { ko: '지금 읽는 책이 재미있어요.', mn: 'Одоо уншиж байгаа ном сонирхолтой байна.', ru: 'Книга, которую сейчас читаю, интересная.', vi: 'Cuốn sách tôi đang đọc rất hay.' } },
      { korean: '맛있는 음식을 좋아해요.', translation: { ko: '맛있는 음식을 좋아해요.', mn: 'Амттай хоолд дуртай.', ru: 'Люблю вкусную еду.', vi: 'Tôi thích đồ ăn ngon.' } }
    ],
    level: 1
  }
];

// ============================================
// Helper Functions
// ============================================

export function getVocabularyByUnit(unitId: string): VocabularyWord[] {
  return TOPIK1_VOCABULARY.filter(v => v.unitId === unitId);
}

export function getVocabularyBySection(sectionId: string): VocabularyWord[] {
  return TOPIK1_VOCABULARY.filter(v => v.sectionId === sectionId);
}

export function getVocabularyByLesson(lessonId: string): VocabularyWord[] {
  return TOPIK1_VOCABULARY.filter(v => v.lessonId === lessonId);
}

export function getVocabularyByTags(tags: string[]): VocabularyWord[] {
  return TOPIK1_VOCABULARY.filter(v =>
    tags.some(tag => v.tags.includes(tag))
  );
}

export function getGrammarByUnit(unitId: string): GrammarPoint[] {
  return TOPIK1_GRAMMAR.filter(g => g.unitId === unitId);
}

export function searchVocabulary(query: string): VocabularyWord[] {
  const lowerQuery = query.toLowerCase();
  return TOPIK1_VOCABULARY.filter(v =>
    v.korean.includes(query) ||
    v.pronunciation.toLowerCase().includes(lowerQuery) ||
    v.meaning.ko.includes(query) ||
    v.meaning.mn.toLowerCase().includes(lowerQuery) ||
    v.meaning.ru.toLowerCase().includes(lowerQuery) ||
    v.meaning.vi.toLowerCase().includes(lowerQuery)
  );
}

export function getRandomVocabulary(count: number, excludeIds?: string[]): VocabularyWord[] {
  let pool = TOPIK1_VOCABULARY;
  if (excludeIds) {
    pool = pool.filter(v => !excludeIds.includes(v.id));
  }
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getVocabularyById(id: string): VocabularyWord | undefined {
  return TOPIK1_VOCABULARY.find(v => v.id === id);
}

export function getTotalVocabularyCount(): number {
  return TOPIK1_VOCABULARY.length;
}
