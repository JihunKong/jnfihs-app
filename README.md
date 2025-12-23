# 전남미래국제고 학생생활규정 앱

## 📋 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | JNFIHS Student Life App |
| **목적** | 다국어 학생생활규정 열람, AI 챗봇 상담, 불편사항 접수 |
| **대상** | 몽골, 카자흐스탄, 우즈베키스탄, 베트남 출신 학생 50명 |
| **지원 언어** | 한국어, 몽골어, 러시아어(카자흐/우즈벡 공용), 베트남어 |

---

## 🛠️ 기술 스택

```
Frontend:   Next.js 14 (App Router) + TypeScript + Tailwind CSS
AI:         Claude API (Anthropic)
다국어:     next-intl
배포:       Docker + Railway
```

---

## 📁 프로젝트 구조

```
jnfihs-app/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx        # 다국어 레이아웃
│   │   ├── page.tsx          # 메인 페이지
│   │   ├── regulations/
│   │   │   └── page.tsx      # 학생생활규정 열람
│   │   ├── chat/
│   │   │   └── page.tsx      # AI 챗봇 상담
│   │   └── complaints/
│   │       └── page.tsx      # 불편사항 접수
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts      # Claude API 연동
│   │   └── complaints/
│   │       └── route.ts      # 불편사항 저장
│   └── globals.css
├── components/
│   ├── Header.tsx
│   ├── LanguageSelector.tsx
│   ├── ChatMessage.tsx
│   └── ComplaintForm.tsx
├── lib/
│   ├── regulations.ts        # 학생생활규정 데이터
│   └── claude.ts             # Claude API 클라이언트
├── locales/
│   ├── ko.json               # 한국어
│   ├── mn.json               # 몽골어
│   ├── ru.json               # 러시아어
│   └── vi.json               # 베트남어
├── Dockerfile
├── docker-compose.yml
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🎯 주요 기능

### 1. 학생생활규정 열람
- 전체 규정 목차 및 본문 열람
- 장/조별 검색
- 모국어로 자동 번역된 버전 제공

### 2. AI 챗봇 상담
- Claude API 기반
- 학생생활규정에 대해 모국어로 질문/답변
- 예: "기숙사에서 휴대폰 언제 쓸 수 있어요?" → 규정 기반 답변

### 3. 불편사항 접수
- 카테고리: 기숙사, 급식, 수업, 교우관계, 기타
- 익명/실명 선택
- 접수 현황 확인

### 4. 교사-학생 소통
- 공지사항 게시
- 1:1 메시지 (추후 확장)

---

## 🌐 다국어 지원

| 언어 | 코드 | 대상 국가 |
|------|------|----------|
| 한국어 | `ko` | 기본 |
| 몽골어 | `mn` | 몽골 |
| 러시아어 | `ru` | 카자흐스탄, 우즈베키스탄 |
| 베트남어 | `vi` | 베트남 |

> 카자흐어/우즈베크어 대신 러시아어를 공용어로 사용 (구소련권 학생들이 러시아어에 익숙)

---

## 🔑 환경변수

```env
# .env.local
ANTHROPIC_API_KEY=sk-ant-xxxxx
DATABASE_URL=postgresql://...  # (선택: Railway PostgreSQL)
```

---

## 🚀 Railway 배포

1. GitHub 저장소 연결
2. 환경변수 설정 (ANTHROPIC_API_KEY)
3. 자동 빌드 및 배포

Railway 무료 티어: 월 $5 크레딧 (소규모 학교 앱에 충분)
