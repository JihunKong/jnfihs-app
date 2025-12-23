# Railway 배포 가이드

## 🚀 배포 순서

### 1단계: GitHub 저장소 생성

```bash
# 로컬에서
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/jnfihs-app.git
git push -u origin main
```

---

### 2단계: Railway 프로젝트 생성

1. [railway.app](https://railway.app) 접속 및 GitHub 로그인
2. **New Project** → **Deploy from GitHub repo**
3. `jnfihs-app` 저장소 선택

---

### 3단계: 환경변수 설정

Railway 대시보드에서:

```
Variables 탭 → Add Variable

ANTHROPIC_API_KEY = sk-ant-api03-xxxxx
```

> Claude API 키는 [console.anthropic.com](https://console.anthropic.com)에서 발급

---

### 4단계: 배포 설정

Railway가 Dockerfile을 자동 감지합니다.

**Settings 탭:**
```
Build Command: (자동 - Dockerfile 사용)
Start Command: (자동)
```

---

### 5단계: 도메인 설정

**Settings → Domains:**

1. **Generate Domain** 클릭 → `jnfihs-app-xxxx.railway.app` 생성
2. 또는 커스텀 도메인 연결: `app.jnfihs.kr`

---

## 📁 필수 파일 체크리스트

```
✅ Dockerfile
✅ package.json
✅ next.config.js (output: 'standalone')
✅ tsconfig.json
✅ tailwind.config.js
✅ postcss.config.js
✅ app/ 디렉토리
✅ locales/ 디렉토리
```

---

## 💰 비용

| 항목 | Railway | 비고 |
|------|---------|------|
| 기본 크레딧 | $5/월 무료 | Hobby Plan |
| 예상 사용량 | ~$2/월 | 50명 학생 기준 |
| Claude API | 종량제 | 월 ~$10 예상 |

---

## 🔧 로컬 개발

```bash
# 설치
npm install

# 개발 서버
npm run dev

# 빌드 테스트
npm run build

# Docker 로컬 테스트
docker build -t jnfihs-app .
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=xxx jnfihs-app
```

---

## 🌐 접속 URL 예시

- 한국어: `https://app.jnfihs.kr/ko`
- 몽골어: `https://app.jnfihs.kr/mn`
- 러시아어: `https://app.jnfihs.kr/ru`
- 베트남어: `https://app.jnfihs.kr/vi`

학생들은 첫 접속 시 언어를 선택하면 해당 언어로 고정됩니다.

---

## 📱 모바일 홈 화면 추가

PWA 지원을 위해 `public/manifest.json` 추가:

```json
{
  "name": "전남미래국제고",
  "short_name": "JNFIHS",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1e40af",
  "theme_color": "#1e40af",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

학생들이 브라우저에서 "홈 화면에 추가"하면 앱처럼 사용 가능합니다.
