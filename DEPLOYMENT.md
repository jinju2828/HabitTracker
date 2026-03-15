# Habit Tracker 프로덕션 배포 가이드 (무료)

로컬에서 잘 돌아가는 앱을 **무료**로 프로덕션에 배포하는 방법입니다.  
Database → Backend → Frontend 순서로 배포하는 것을 권장합니다.

---

## 1. 아키텍처 요약

| 구성요소 | 기술 스택 | 무료 배포 추천 |
|----------|-----------|----------------|
| **Database** | PostgreSQL (Kysely + pg) | Neon 또는 Supabase |
| **Backend** | NestJS (port 3000 → 배포 시 `PORT` env 사용) | Render 또는 Railway |
| **Frontend** | React + Vite | Vercel 또는 Netlify |

배포 후 **백엔드 URL**이 바뀌므로, 프론트엔드 빌드 시 `VITE_API_URL` 환경 변수로 그 주소를 넣어줘야 합니다. (이미 코드 반영됨)

---

## 2. Database 배포 (PostgreSQL)

### 옵션 A: Neon (추천)

- **사이트**: https://neon.tech
- **특징**: 서버리스 Postgres, 무료 티어 넉넉함 (0.5GB 스토리지, 월 100 compute hours 등), 카드 없이 가입 가능
- **절차**:
  1. 가입 후 새 프로젝트 생성
  2. 프로젝트에서 **Connection string** 복사 (예: `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`)
  3. 호스트/DB명/유저/비밀번호/포트는 URL에서 파싱하거나, Neon 대시보드에서 개별 값 확인

### 옵션 B: Supabase

- **사이트**: https://supabase.com
- **특징**: Postgres + 대시보드, 500MB 무료, 인증/스토리지 등 추가 기능
- **절차**: 프로젝트 생성 → Settings → Database → Connection string (URI) 또는 Connection params 확인

### 옵션 C: ElephantSQL

- **사이트**: https://www.elephantsql.com
- **특징**: 20MB 무료, 소규모 프로젝트에 적합
- **절차**: 인스턴스 생성 후 URL 복사

### DB 연결 정보 → 백엔드 환경 변수

Neon/Supabase 등에서 받은 connection string을 다음처럼 나눠서 백엔드에 넣습니다.

- `DB_HOST`: 호스트 (예: `ep-xxx.region.aws.neon.tech`)
- `DB_NAME`: 데이터베이스 이름 (예: `neondb`)
- `DB_USER`: 사용자명
- `DB_PASSWORD`: 비밀번호
- `DB_PORT`: 보통 `5432` (Neon/Supabase는 5432)

**로컬에서 쓰는 스키마**가 이미 있다면, 배포 DB에도 동일한 테이블(`users`, `habits`, `habit_logs` 등)을 만들어야 합니다.  
로컬에서 마이그레이션 스크립트나 SQL 덤프가 있다면 그걸 배포 DB에 적용하세요. 없으면 테이블 생성 SQL을 직접 실행하면 됩니다.

---

## 3. Backend 배포 (NestJS)

백엔드는 이미 **`process.env.PORT`**를 사용하도록 수정되어 있어, Render/Railway 등에서 주입하는 포트를 그대로 씁니다.

### 옵션 A: Render (무료 Web Service)

- **사이트**: https://render.com
- **특징**: 무료 티어는 15분 비활성 시 슬립 → 첫 요청 시 콜드 스타트 (수십 초 걸릴 수 있음)
- **절차**:
  1. GitHub 연동 후 이 리포지토리 연결
  2. **New → Web Service** 선택
  3. **Root Directory**: `backend` 지정
  4. **Build Command**: `npm install && npm run build`
  5. **Start Command**: `npm run start` (또는 `node dist/main.js`)
  6. **Environment**에 다음 추가:
     - `PORT`: Render가 자동으로 넣어줌 (비워둬도 됨)
     - `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_PORT` (2번에서 만든 DB 값)
     - `JWT_SECRET`: 로그인 토큰 서명용 비밀 문자열 (예: 랜덤 32자 이상, 프로덕션에서는 반드시 설정)
  7. Deploy 후 **서비스 URL** 확인 (예: `https://habit-tracker-api.onrender.com`) → 이걸 프론트엔드 `VITE_API_URL`로 사용

### 옵션 B: Railway

- **사이트**: https://railway.app
- **특징**: 무료 크레딧 제공, NestJS 가이드 많음
- **절차**:
  1. GitHub 연동 후 프로젝트 생성
  2. **Add Service** → **GitHub Repo** → 루트 디렉터리 선택 후 **Root Directory**를 `backend`로 설정
  3. **Variables**에 `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_PORT`, `JWT_SECRET` 설정
  4. **Settings**에서 Build Command: `npm run build`, Start Command: `npm run start` (또는 `node dist/main.js`)
  5. Deploy 후 생성된 **Public URL**을 프론트엔드 `VITE_API_URL`로 사용

### CORS

백엔드에서 이미 `app.enableCors()`를 호출하고 있어서, 프론트 도메인만 쓰는 경우 대부분 동작합니다.  
나중에 프론트를 Vercel/Netlify 등 특정 도메인으로 고정하면, 필요 시 `main.ts`에서 `app.enableCors({ origin: 'https://your-frontend.vercel.app' })` 처럼 제한할 수 있습니다.

---

## 4. Frontend 배포 (Vite + React)

프론트엔드는 **빌드 시점**에 `VITE_API_URL`로 백엔드 주소가 들어가도록 되어 있습니다.  
배포 플랫폼에서 이 환경 변수를 꼭 설정하세요.

### 옵션 A: Vercel (추천)

- **사이트**: https://vercel.com
- **절차**:
  1. GitHub 연동 후 이 리포지토리 임포트
  2. **Root Directory**: `frontend` 지정
  3. **Framework Preset**: Vite
  4. **Environment Variables**에 추가:
     - `VITE_API_URL` = `https://your-backend.onrender.com` (또는 Railway 등 백엔드 URL, 끝에 슬래시 없이)
  5. Deploy 후 `https://xxx.vercel.app` 같은 URL로 접속

### 옵션 B: Netlify

- **사이트**: https://netlify.com
- **절차**:
  1. GitHub 연동 후 **Add new site** → 리포지토리 선택
  2. **Base directory**: `frontend`
  3. **Build command**: `npm run build`
  4. **Publish directory**: `frontend/dist`
  5. **Environment variables**에 `VITE_API_URL` 설정
  6. Deploy

### 옵션 C: Cloudflare Pages

- **사이트**: https://pages.cloudflare.com
- **절차**: 프로젝트 연결 후 Base directory = `frontend`, Build = `npm run build`, Output = `dist`, 환경 변수에 `VITE_API_URL` 추가

---

## 5. 배포 후 체크리스트

1. **DB**: Neon/Supabase 대시보드에서 테이블이 있고, 백엔드에서 접속되는지 확인
2. **Backend**: 브라우저에서 `https://your-backend.onrender.com/auth/login` 등으로 health 체크 (또는 간단한 GET 엔드포인트)
3. **Frontend**: 
   - 로그인/회원가입이 배포된 백엔드로 요청하는지 (개발자 도구 Network 탭)
   - `VITE_API_URL`을 바꾼 뒤 **다시 빌드**했는지 확인 (캐시된 빌드면 옛 주소가 들어갈 수 있음)

---

## 6. 로컬 vs 프로덕션 정리

| 항목 | 로컬 | 프로덕션 |
|------|------|----------|
| 백엔드 주소 | `http://localhost:3000` | `VITE_API_URL`에 넣은 URL (예: Render/Railway URL) |
| 백엔드 포트 | 3000 | `PORT` 환경 변수 (Render/Railway가 자동 설정) |
| DB | 로컬 PostgreSQL 또는 로컬 .env | Neon/Supabase 등 URL → `DB_*` 환경 변수 |
| 프론트 빌드 | `npm run build` (기본값으로 localhost 사용) | `VITE_API_URL=https://... npm run build` 또는 배포 서비스에서 설정 |

이제 다른 유저들도 배포된 프론트 주소로 접속해서 회원가입/로그인 후 Habit Tracker를 사용할 수 있습니다.
