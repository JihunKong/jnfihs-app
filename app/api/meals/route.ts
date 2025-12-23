import { NextRequest, NextResponse } from 'next/server';

type Meal = {
  date: string;
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  allergens: string[];
};

// Demo meal data for a week
function generateWeekMeals(): Meal[] {
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

const weekMeals = generateWeekMeals();

// GET: Fetch meals
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  const week = req.nextUrl.searchParams.get('week');

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
