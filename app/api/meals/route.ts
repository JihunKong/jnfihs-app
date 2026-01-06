import { NextRequest, NextResponse } from 'next/server';

type Meal = {
  date: string;
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  allergens: string[];
};

// NEIS API configuration
const NEIS_API_KEY = process.env.NEIS_API_KEY;
const ATPT_OFCDC_SC_CODE = 'Q10'; // 전남교육청
const SD_SCHUL_CODE = '8000074'; // 전남미래국제고 (실제 코드로 교체 필요)

// Parse NEIS meal data
function parseNeisMeal(dishName: string): string[] {
  // Remove allergen info (numbers in parentheses) and split
  return dishName
    .split('<br/>')
    .map(item => item.replace(/\([0-9.,]+\)/g, '').trim())
    .filter(item => item.length > 0);
}

// Extract allergen info from NEIS data
function parseAllergens(dishName: string): string[] {
  const allergenMap: Record<string, string> = {
    '1': '난류', '2': '우유', '3': '메밀', '4': '땅콩',
    '5': '대두', '6': '밀', '7': '고등어', '8': '게',
    '9': '새우', '10': '돼지고기', '11': '복숭아', '12': '토마토',
    '13': '아황산류', '14': '호두', '15': '닭고기', '16': '쇠고기',
    '17': '오징어', '18': '조개류', '19': '잣',
  };

  const allergenNumbers = new Set<string>();
  const regex = /\(([0-9.,]+)\)/g;
  let match;

  while ((match = regex.exec(dishName)) !== null) {
    match[1].split('.').forEach(num => allergenNumbers.add(num));
  }

  return Array.from(allergenNumbers)
    .map(num => allergenMap[num])
    .filter(Boolean);
}

// Fetch meals from NEIS API
async function fetchNeisWeekMeals(): Promise<Meal[] | null> {
  if (!NEIS_API_KEY) {
    console.log('NEIS_API_KEY not configured, using demo data');
    return null;
  }

  try {
    const today = new Date();
    const meals: Meal[] = [];

    // Get meals for the current week (Monday to Sunday)
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');

      const url = `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${NEIS_API_KEY}&Type=json&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SD_SCHUL_CODE}&MLSV_YMD=${dateStr}`;

      const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
      const data = await response.json();

      const mealInfo = data?.mealServiceDietInfo?.[1]?.row;

      if (mealInfo && mealInfo.length > 0) {
        const meal: Meal = {
          date: date.toISOString().split('T')[0],
          breakfast: [],
          lunch: [],
          dinner: [],
          allergens: [],
        };

        const allAllergens = new Set<string>();

        for (const row of mealInfo) {
          const items = parseNeisMeal(row.DDISH_NM || '');
          const allergens = parseAllergens(row.DDISH_NM || '');
          allergens.forEach(a => allAllergens.add(a));

          switch (row.MMEAL_SC_NM) {
            case '조식':
              meal.breakfast = items;
              break;
            case '중식':
              meal.lunch = items;
              break;
            case '석식':
              meal.dinner = items;
              break;
          }
        }

        meal.allergens = Array.from(allAllergens);
        meals.push(meal);
      } else {
        // No meal data for this day
        meals.push({
          date: date.toISOString().split('T')[0],
          breakfast: [],
          lunch: [],
          dinner: [],
          allergens: [],
        });
      }
    }

    return meals;
  } catch (error) {
    console.error('Failed to fetch NEIS meals:', error);
    return null;
  }
}

// Demo meal data fallback
function generateDemoMeals(): Meal[] {
  const meals: Meal[] = [];
  const today = new Date();

  const mealData = [
    {
      breakfast: ['흰쌀밥', '미역국', '계란말이', '김치', '우유'],
      lunch: ['잡곡밥', '된장찌개', '제육볶음', '시금치나물', '깍두기'],
      dinner: ['현미밥', '김치찌개', '고등어구이', '콩나물무침', '배추김치'],
      allergens: ['계란', '우유', '대두', '밀'],
    },
    {
      breakfast: ['잡곡밥', '콩나물국', '멸치볶음', '김치', '주스'],
      lunch: ['흰쌀밥', '순두부찌개', '닭볶음탕', '오이생채', '총각김치'],
      dinner: ['현미밥', '떡국', '불고기', '숙주나물', '배추김치'],
      allergens: ['대두', '닭고기', '밀', '쇠고기'],
    },
    {
      breakfast: ['현미밥', '북어국', '두부조림', '김치', '요거트'],
      lunch: ['비빔밥', '유부장국', '탕수육', '단무지', '깍두기'],
      dinner: ['잡곡밥', '청국장', '삼치구이', '미나리무침', '배추김치'],
      allergens: ['대두', '우유', '돼지고기', '밀'],
    },
    {
      breakfast: ['식빵', '스크램블에그', '샐러드', '우유', '사과'],
      lunch: ['카레라이스', '미소국', '돈까스', '양배추샐러드', '단무지'],
      dinner: ['흰쌀밥', '미역국', '오징어볶음', '무생채', '배추김치'],
      allergens: ['계란', '우유', '밀', '돼지고기', '오징어'],
    },
    {
      breakfast: ['흰쌀밥', '감자국', '장조림', '김치', '바나나'],
      lunch: ['잡곡밥', '부대찌개', '생선까스', '콩나물무침', '깍두기'],
      dinner: ['비빔밥', '계란국', '갈비찜', '도라지무침', '배추김치'],
      allergens: ['계란', '대두', '밀', '쇠고기', '새우'],
    },
    {
      breakfast: ['토스트', '콘플레이크', '우유', '포도'],
      lunch: ['짜장밥', '계란국', '군만두', '오이무침', '배추김치'],
      dinner: ['흰쌀밥', '갈비탕', '계란찜', '시금치나물', '깍두기'],
      allergens: ['계란', '우유', '밀', '대두', '돼지고기'],
    },
    {
      breakfast: ['죽', '김', '젓갈', '김치'],
      lunch: ['흰쌀밥', '설렁탕', '잡채', '무생채', '깍두기'],
      dinner: ['잡곡밥', '김치찌개', '닭강정', '미역줄기볶음', '배추김치'],
      allergens: ['대두', '쇠고기', '밀', '닭고기'],
    },
  ];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + i);

    meals.push({
      date: date.toISOString().split('T')[0],
      ...mealData[i % mealData.length],
    });
  }

  return meals;
}

// Cache for NEIS meals
let cachedMeals: Meal[] | null = null;
let cacheTime: number = 0;
const CACHE_DURATION = 3600000; // 1 hour

async function getWeekMeals(): Promise<Meal[]> {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedMeals && (now - cacheTime) < CACHE_DURATION) {
    return cachedMeals;
  }

  // Try to fetch from NEIS
  const neisMeals = await fetchNeisWeekMeals();

  if (neisMeals) {
    cachedMeals = neisMeals;
    cacheTime = now;
    return neisMeals;
  }

  // Fallback to demo data
  return generateDemoMeals();
}

// GET: Fetch meals
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  const week = req.nextUrl.searchParams.get('week');

  const weekMeals = await getWeekMeals();

  if (date) {
    const meal = weekMeals.find((m) => m.date === date);
    return NextResponse.json({ meal: meal || null });
  }

  if (week === 'current') {
    return NextResponse.json({ meals: weekMeals });
  }

  // Return today's meal by default
  const today = new Date().toISOString().split('T')[0];
  const todayMeal = weekMeals.find((m) => m.date === today);
  return NextResponse.json({ meal: todayMeal || weekMeals[0] });
}
