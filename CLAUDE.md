# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JNFIHS Platform (전남미래국제고 종합 플랫폼) - A multilingual web application for Jeonnam Future International High School. The app serves 50 international students from Mongolia, Kazakhstan, Uzbekistan, and Vietnam, providing student life regulations, AI chatbot consultation, real-time classroom translation, and other school services.

**Supported Languages**: Korean (ko), Mongolian (mn), Russian (ru), Vietnamese (vi)

## Commands

```bash
# Development
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run start        # Start production server (uses PORT env or 3000)
npm run lint         # Run Next.js linting

# Docker
docker build -t jnfihs-app .
docker run -p 3000:3000 -e GEMINI_API_KEY=xxx jnfihs-app
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **i18n**: next-intl for multilingual support
- **AI**: Google Gemini API (@google/generative-ai) for chatbot and translation
- **Icons**: lucide-react
- **Deployment**: Docker on Railway

### Key Architectural Patterns

1. **Locale-based Routing**: All user-facing pages use dynamic `[locale]` segment (e.g., `/ko/chat`, `/mn/regulations`). The locale is extracted from the URL path.

2. **next-intl Integration**:
   - `middleware.ts` - Handles locale detection and routing
   - `i18n.ts` - Loads locale-specific messages
   - `locales/*.json` - Translation files (ko, mn, ru, vi)
   - Server components use `getMessages()`, client components use `NextIntlClientProvider`

3. **API Routes**: Located in `app/api/` without locale prefix
   - `/api/chat` - Gemini-powered chatbot with student regulations context
   - `/api/broadcast` - Real-time classroom translation (POST: teacher audio, GET: student subtitles)
   - `/api/leave` - Leave request management
   - `/api/messages` - Student-teacher messaging
   - `/api/health` - Daily health check
   - `/api/meals` - Meal menu data
   - `/api/booking` - Facility booking

4. **Real-time Translation System** (described in REALTIME-TRANSLATION.md):
   - Teacher broadcasts via Web Speech API (Chrome)
   - Server translates to 4 languages using Gemini API
   - Students receive subtitles via polling (0.5s interval)

### Project Structure

```
app/
├── [locale]/           # Locale-prefixed pages
│   ├── layout.tsx      # Provides NextIntlClientProvider
│   ├── page.tsx        # Home/dashboard
│   ├── chat/           # AI chatbot
│   ├── translation/    # Real-time translation
│   ├── leave/          # Leave requests
│   ├── messenger/      # Student-teacher chat
│   ├── health/         # Health check
│   ├── meals/          # Meal menu
│   └── booking/        # Facility booking
├── api/                # API routes (no locale prefix)
│   ├── chat/route.ts
│   ├── broadcast/route.ts
│   ├── leave/route.ts
│   ├── messages/route.ts
│   ├── health/route.ts
│   ├── meals/route.ts
│   └── booking/route.ts
└── globals.css

locales/               # Translation JSON files
lib/                   # Utilities (regulations.ts, db.ts)
components/            # Shared React components
```

## Environment Variables

```
GEMINI_API_KEY=xxx     # Required for Google Gemini API
DATABASE_URL=xxx       # PostgreSQL connection (optional, has fallback)
```

## Important Notes

- The app uses `output: 'standalone'` in next.config.js for Docker deployment
- Russian (ru) is used as the common language for Kazakhstan and Uzbekistan students (former Soviet Union countries)
- Gemini API responses include the student regulations context for accurate answers
- The platform is designed for Chromebook optimization (PWA support planned)
- All features have in-memory fallback when database is not available
