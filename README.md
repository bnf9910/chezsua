# CHEZSUA — Editorial Floristry Website

쉐수아(CHEZSUA)의 공식 웹사이트. 패션 매거진 톤의 에디토리얼 플로리스트 사이트.

## ✨ Features

- **다국어** — 영어 / 한국어 / 中文 (Simplified Chinese)
- **반응형** — Desktop · Tablet · Mobile
- **3개 핵심 섹션** — Home (매거진형 LOOKBOOK 5개) · Shop (상품 구매) · Lookbooks (포트폴리오)
- **이커머스** — 카트, 체크아웃 (포트원 v2 결제 — 신용카드/네이버페이/카카오페이/페이팔/알리페이)
- **인증** — 카카오 / 네이버 / 구글 / 애플 / 이메일
- **Admin** — 룩북·상품·주문·고객·메뉴·팝업·리뷰·설정·통계 분석
- **자체 통계** — 페이지뷰, 유입 경로, 디바이스, 국가, 인기 페이지
- **카카오 알림톡** — 결제 완료 시 관리자에게 카톡 알림
- **메뉴 관리** — 대메뉴/소메뉴 추가/숨김/순서 변경
- **SEO/GEO** — 한국·글로벌 검색 최적화

## 🚀 Quick Start

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env.local
# .env.local 편집하여 값 입력

# 3. 로컬 개발
npm run dev
# → http://localhost:3000
```

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS Variables |
| Animation | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (kakao, naver, google, apple) |
| Email | Resend |
| Payment | 포트원(아임포트) v2 |
| 카카오 알림톡 | 솔라피 / 알리고 / NCloud SENS (선택) |
| Analytics | Self-hosted (Supabase) |
| Hosting | Vercel |

## 📁 Project Structure

```
chezsua/
├── src/
│   ├── app/
│   │   ├── [locale]/          # /en, /ko, /zh 다국어 페이지
│   │   │   ├── page.tsx       # Home
│   │   │   ├── shop/
│   │   │   ├── lookbooks/
│   │   │   ├── about/
│   │   │   ├── project/
│   │   │   ├── contact/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── auth/
│   │   │   └── account/
│   │   ├── admin/             # 관리자 (별도 레이아웃)
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── analytics/
│   │   │   ├── lookbooks/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   ├── customers/
│   │   │   ├── menus/
│   │   │   ├── popups/
│   │   │   ├── reviews/
│   │   │   └── settings/
│   │   └── api/               # API routes
│   │       ├── inquiry/       # 협업 문의
│   │       ├── checkout/      # 주문 생성
│   │       ├── track/         # 페이지뷰 추적
│   │       ├── webhooks/      # 결제 웹훅
│   │       └── admin/         # 관리자 API
│   ├── components/
│   │   ├── layout/            # Header, Footer, MenuOverlay, PageTracker
│   │   ├── home/
│   │   ├── shop/
│   │   ├── lookbook/
│   │   ├── project/
│   │   ├── cart/
│   │   ├── auth/
│   │   ├── account/
│   │   ├── admin/
│   │   └── ui/                # SocialIcons 등
│   ├── lib/
│   │   ├── i18n.ts            # next-intl
│   │   ├── supabase/          # client.ts, server.ts
│   │   ├── resend.ts
│   │   ├── kakao-alimtalk.ts
│   │   ├── types.ts
│   │   ├── constants.ts
│   │   ├── utils.ts
│   │   └── sample-data.ts     # 시안 더미 데이터
│   ├── messages/              # en.json, ko.json, zh.json
│   ├── styles/
│   │   └── globals.css
│   └── middleware.ts          # 다국어 라우팅
├── supabase/
│   └── migrations/            # SQL 스키마
├── public/
└── package.json
```

## 🔧 Environment Variables

`.env.example`을 `.env.local`로 복사하고 값 채우세요.

### 필수

```bash
NEXT_PUBLIC_SITE_URL=https://chezsua.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 이메일 (Project 폼)

```bash
RESEND_API_KEY=re_xxx
INQUIRY_TO_EMAIL=chezsuaflower@gmail.com
INQUIRY_FROM_EMAIL=noreply@chezsua.com
```

### 카카오 알림톡 (주문 완료 시)

```bash
KAKAO_BIZ_PROVIDER=solapi   # solapi | aligo | ncloud_sens
KAKAO_BIZ_API_KEY=
KAKAO_BIZ_API_SECRET=
KAKAO_BIZ_PFID=             # 카카오 비즈니스 채널 ID
KAKAO_BIZ_SENDER_PHONE=
KAKAO_BIZ_TEMPLATE_NEW_ORDER=NEW_ORDER
ADMIN_PHONE_NUMBER=01012345678
```

### 결제 (포트원 v2)

```bash
NEXT_PUBLIC_PORTONE_STORE_ID=
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=
PORTONE_API_SECRET=
```

### OAuth (Supabase Auth에서 설정)

Supabase 대시보드 → Authentication → Providers에서 각 프로바이더 활성화 후 client ID/secret 입력.

## 🗄️ Database Setup

```bash
# Supabase CLI 설치
npm install -g supabase

# 프로젝트 연결
supabase link --project-ref your-project-ref

# 마이그레이션 적용
supabase db push
```

또는 Supabase 대시보드 SQL Editor에 `supabase/migrations/*.sql` 내용 붙여넣고 실행.

### 첫 관리자 계정 만들기

```sql
-- 1. 회원가입을 일반 사용자로 진행 (예: chezsuaflower@gmail.com)
-- 2. 그 후 SQL Editor에서:
UPDATE public.users SET role = 'admin' WHERE email = 'chezsuaflower@gmail.com';
```

## 📦 Deploy to Vercel

### 1. GitHub 저장소 생성

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/chezsua.git
git push -u origin main
```

### 2. Vercel 배포

1. [vercel.com](https://vercel.com) 로그인 → "Add New Project"
2. GitHub 저장소 import
3. **Environment Variables** 탭에서 `.env.local` 값들을 모두 추가
4. Region: **icn1 (Seoul)** 선택
5. Deploy

### 3. 도메인 연결

1. Vercel 프로젝트 → Settings → Domains
2. `chezsua.com` 추가 (이미 보유)
3. 도메인 등록업체 DNS에서:
   - A 레코드: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`

### 4. Supabase Auth 콜백 URL 등록

Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `https://chezsua.com`
- Redirect URLs:
  - `https://chezsua.com/en/auth/callback`
  - `https://chezsua.com/ko/auth/callback`
  - `https://chezsua.com/zh/auth/callback`

## 📊 Analytics

내장 분석 페이지 (`/admin/analytics`):
- 일별 페이지뷰 / 방문자 (최근 7/30/90일 선택)
- 인기 페이지 TOP 10
- 유입 경로 (Direct, Google, Naver, Instagram, 샤오홍슈, TikTok, WeChat 등)
- 디바이스 (모바일 / 데스크탑 / 태블릿)
- 국가

데이터는 자체 Supabase에 저장 (광고차단기 영향 없음, GDPR 친화).

## 🎨 Design System

- **Colors**: 옅은 파스텔 그린 (#F1F5EF) + 거의 검정 잉크 (#1A1F1B) + 시그니처 다크 그린 (#2D3F2E)
- **Fonts**: Cormorant Garamond (display) · Inter (body) · Pretendard (한글) · JetBrains Mono (caption)
- **Texture**: SVG noise 종이 질감 — 보일 듯 말 듯한 grain

## 📝 License

© 2026 CHEZSUA. All rights reserved.
