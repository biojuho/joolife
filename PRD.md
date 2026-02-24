# JooLife PRD (Product Requirements Document)

> **문서 버전**: v1.0
> **작성일**: 2026-02-13
> **작성자**: JooLife 개발팀
> **상태**: 초안 (Draft)

---

## 목차

1. [제품 개요](#1-제품-개요)
2. [사용자 페르소나 & 유저 스토리](#2-사용자-페르소나--유저-스토리)
3. [기능 명세](#3-기능-명세)
4. [정보 아키텍처 & 페이지 구조](#4-정보-아키텍처--페이지-구조)
5. [기술 아키텍처](#5-기술-아키텍처)
6. [데이터베이스 스키마](#6-데이터베이스-스키마)
7. [API 설계](#7-api-설계)
8. [AI 통합 전략](#8-ai-통합-전략)
9. [Web3 통합 로드맵](#9-web3-통합-로드맵)
10. [개발 로드맵](#10-개발-로드맵)
11. [UI/UX 주요 화면 설명](#11-uiux-주요-화면-설명)
12. [보안 & 컴플라이언스](#12-보안--컴플라이언스)
13. [모니터링 & 분석](#13-모니터링--분석)
14. [경쟁사 분석 & 차별화](#14-경쟁사-분석--차별화)

---

## 1. 제품 개요

### 1.1 비전

**"데이터 주권 기반 AI 라이프스타일 플랫폼"**

JooLife는 사용자가 자신의 데이터를 직접 소유하고 관리하면서, AI를 통해 개인화된 라이프스타일 인사이트와 자동화된 서비스를 제공받는 차세대 플랫폼입니다.

### 1.2 핵심 가치

| 가치 | 설명 |
|------|------|
| **데이터 주권** | 사용자가 자신의 데이터를 완전히 소유하고 관리. 동의 기반 데이터 활용 |
| **개인화** | AI가 사용자의 맥락을 이해하고 맞춤형 정보와 추천 제공 |
| **자동화** | 반복적인 정보 수집, 콘텐츠 저장, 스케줄 관리를 자동으로 처리 |
| **보안** | 엔드투엔드 암호화, RLS(Row Level Security), 향후 블록체인 기반 데이터 증명 |

### 1.3 타겟 사용자

- **주 타겟**: 디지털 라이프스타일 관리에 관심 있는 25-40세 (2030 세대)
- **부 타겟**: 개인 데이터 주권에 관심 있는 기술 얼리어답터
- **확장 타겟**: 콘텐츠 크리에이터, 프리랜서, 지식 노동자

### 1.4 비즈니스 모델

| 티어 | 가격 | 주요 기능 |
|------|------|-----------|
| **Free** | 무료 | 기본 대시보드, 콘텐츠 저장 (100개), 기본 AI 추천 |
| **Pro** | 월 9,900원 | 무제한 저장, 고급 AI 추천, 자동화 5개, 데이터 내보내기 |
| **Premium** | 월 19,900원 | 무제한 자동화, 고급 분석, Web3 기능, 우선 지원 |

### 1.5 현재 상태

현재 JooLife는 정적 HTML/CSS/JS 홈페이지로 운영 중이며, 다음 요소가 구현되어 있습니다:

- 반응형 랜딩 페이지 (히어로, 소개, 팀 섹션)
- 디자인 시스템 (CSS 변수 87개: 색상, 폰트, 간격, 그림자)
- 스크롤 애니메이션, 모바일 메뉴
- 회사 정보: 쥬라프(JooLife), 대표 박주호, 사업자등록번호 266-31-02086

---

## 2. 사용자 페르소나 & 유저 스토리

### 2.1 페르소나

#### 페르소나 A: 민지 (일반 사용자)
- **나이**: 28세, 직장인
- **특징**: 다양한 앱과 서비스를 사용하지만, 정보가 분산되어 관리가 어려움
- **니즈**: 하나의 공간에서 관심 콘텐츠를 모아보고, 유용한 추천을 받고 싶음
- **기술 수준**: 중간 (앱 사용 능숙, 기술적 설정은 어려워함)

#### 페르소나 B: 준혁 (데이터 의식 사용자)
- **나이**: 34세, IT 개발자
- **특징**: 개인 데이터 보호에 관심이 높고, 중앙화된 서비스에 회의적
- **니즈**: 자신의 데이터를 직접 제어하면서도 AI 혜택을 누리고 싶음
- **기술 수준**: 높음 (Web3 지갑 사용 경험, API 이해)

#### 페르소나 C: 서연 (크리에이터)
- **나이**: 31세, 콘텐츠 크리에이터
- **특징**: 다양한 플랫폼에서 활동하며, 트렌드 파악과 콘텐츠 관리가 중요
- **니즈**: 자동으로 트렌드를 수집하고, 콘텐츠 아이디어를 정리하고 싶음
- **기술 수준**: 중간-높음 (다양한 도구 사용, 효율성 중시)

### 2.2 핵심 유저 스토리

#### 인증 & 온보딩
| ID | 유저 스토리 | 우선순위 |
|----|------------|---------|
| US-01 | 사용자로서, 이메일 또는 소셜 로그인(Google/Kakao)으로 간편하게 가입할 수 있다 | P0 |
| US-02 | 사용자로서, 가입 시 관심사를 선택하여 초기 추천을 받을 수 있다 | P1 |
| US-03 | 사용자로서, 데이터 활용 동의를 세밀하게 설정할 수 있다 | P0 |

#### 대시보드
| ID | 유저 스토리 | 우선순위 |
|----|------------|---------|
| US-04 | 사용자로서, 로그인하면 개인 대시보드에서 오늘의 요약 정보를 볼 수 있다 | P0 |
| US-05 | 사용자로서, 대시보드 위젯을 추가/제거/재배열하여 나만의 레이아웃을 만들 수 있다 | P1 |
| US-06 | 사용자로서, 대시보드에서 최근 저장한 콘텐츠와 AI 추천을 한눈에 볼 수 있다 | P0 |

#### 콘텐츠 관리
| ID | 유저 스토리 | 우선순위 |
|----|------------|---------|
| US-07 | 사용자로서, URL을 입력하면 콘텐츠가 자동으로 저장되고 메타데이터가 추출된다 | P0 |
| US-08 | 사용자로서, 저장된 콘텐츠에 태그와 메모를 추가할 수 있다 | P0 |
| US-09 | 사용자로서, 카테고리별로 콘텐츠를 분류하고 검색할 수 있다 | P1 |
| US-10 | 사용자로서, 저장된 모든 데이터를 JSON/CSV로 내보내기할 수 있다 | P1 |

#### AI 추천
| ID | 유저 스토리 | 우선순위 |
|----|------------|---------|
| US-11 | 사용자로서, 저장한 콘텐츠를 기반으로 관련 정보를 추천받을 수 있다 | P1 |
| US-12 | 사용자로서, AI가 요약한 일일/주간 인사이트 리포트를 받을 수 있다 | P2 |
| US-13 | 사용자로서, 추천의 이유를 확인하고 피드백을 줄 수 있다 | P2 |

#### 자동화
| ID | 유저 스토리 | 우선순위 |
|----|------------|---------|
| US-14 | 사용자로서, 특정 키워드의 뉴스를 자동으로 수집하는 규칙을 만들 수 있다 | P2 |
| US-15 | 사용자로서, 자동화 규칙의 실행 결과를 대시보드에서 확인할 수 있다 | P2 |

#### Web3
| ID | 유저 스토리 | 우선순위 |
|----|------------|---------|
| US-16 | 사용자로서, Web3 지갑을 연결하는 UI를 볼 수 있다 (Phase 1: UI만) | P2 |
| US-17 | 사용자로서, 내 데이터의 소유권 상태를 시각적으로 확인할 수 있다 (Phase 1: 목업) | P2 |

---

## 3. 기능 명세

### 3.1 인증 시스템

**구현 기술**: Supabase Auth

| 기능 | 설명 | 우선순위 |
|------|------|---------|
| 이메일 회원가입/로그인 | 이메일 + 비밀번호 기반 인증 | P0 |
| Google OAuth | Google 계정으로 소셜 로그인 | P0 |
| Kakao OAuth | 카카오 계정으로 소셜 로그인 (한국 사용자 주력) | P0 |
| 비밀번호 재설정 | 이메일 기반 비밀번호 복구 | P0 |
| 세션 관리 | 쿠키 기반 세션, 자동 갱신 | P0 |
| 온보딩 플로우 | 가입 후 관심사 선택, 데이터 동의 설정 | P1 |

**인증 플로우**:
```
[랜딩] → [회원가입/로그인] → [온보딩 (최초 1회)]
  ↓            ↓                    ↓
이메일     Google/Kakao        관심사 선택
  ↓            ↓               데이터 동의
  → → → [대시보드] ← ← ← ← ← ← ←
```

### 3.2 개인 대시보드

**레이아웃**: 사이드바 + 상단바 + 메인 콘텐츠 영역

| 위젯 | 설명 | 우선순위 |
|------|------|---------|
| 오늘의 요약 | 날씨, 일정, 저장 콘텐츠 수, AI 추천 수 | P0 |
| 최근 저장 | 최근 저장한 콘텐츠 미리보기 (5개) | P0 |
| AI 추천 | AI가 추천하는 콘텐츠/정보 카드 | P1 |
| 빠른 저장 | URL 입력으로 즉시 콘텐츠 저장 | P0 |
| 자동화 상태 | 실행 중인 자동화 규칙 상태 | P2 |
| 데이터 인사이트 | 저장 패턴, 관심사 분석 차트 | P2 |

**위젯 시스템**:
- 기본 레이아웃 제공 (2열 그리드)
- 위젯 추가/제거/순서 변경 가능 (P1)
- 위젯 설정은 `user_preferences` 테이블에 JSONB로 저장

### 3.3 데이터 관리

#### 콘텐츠 저장
| 기능 | 설명 | 우선순위 |
|------|------|---------|
| URL 저장 | URL 입력 시 제목, 설명, 이미지 자동 추출 (Open Graph) | P0 |
| 메모 저장 | 텍스트 메모 직접 작성 | P0 |
| 태그 관리 | 콘텐츠에 태그 추가/수정/삭제 | P0 |
| 카테고리 분류 | 사용자 정의 카테고리로 분류 | P1 |
| 전체 검색 | 제목, 설명, 메모, 태그 기반 검색 | P1 |
| 데이터 내보내기 | JSON, CSV 형식 다운로드 | P1 |
| 일괄 작업 | 다중 선택 후 태그 추가, 카테고리 변경, 삭제 | P2 |

#### 데이터 동의 관리
| 기능 | 설명 | 우선순위 |
|------|------|---------|
| 동의 항목 관리 | AI 학습, 추천, 분석 등 항목별 동의/철회 | P0 |
| 데이터 열람 | 수집된 데이터 목록 확인 | P1 |
| 데이터 삭제 요청 | 특정 데이터 또는 전체 삭제 요청 | P1 |
| 동의 이력 | 동의/철회 이력 타임라인 | P2 |

### 3.4 AI 추천

| 기능 | 설명 | 우선순위 |
|------|------|---------|
| 콘텐츠 기반 추천 | 저장된 콘텐츠 분석 후 관련 정보 추천 | P1 |
| 일일 인사이트 | 매일 아침 맞춤형 정보 요약 제공 | P2 |
| 주간 리포트 | 주간 활동 분석 및 트렌드 리포트 | P2 |
| 추천 피드백 | 좋아요/싫어요로 추천 정확도 개선 | P2 |
| 상황 인식 알림 | 시간/요일/활동 패턴 기반 적시 알림 | P3 |

### 3.5 자동화

| 기능 | 설명 | 우선순위 |
|------|------|---------|
| 뉴스 수집 규칙 | 키워드 기반 뉴스 자동 수집 | P2 |
| 콘텐츠 알림 | 관심 주제 새 콘텐츠 발행 시 알림 | P2 |
| 스케줄 트리거 | 정해진 시간에 자동 실행 | P2 |
| 실행 로그 | 자동화 실행 결과 이력 확인 | P2 |

**구현**: Supabase Edge Functions + pg_cron (스케줄링)

### 3.6 Web3 UI (Phase 1: UI 플레이스홀더)

> Phase 1에서는 UI만 구현하고, 실제 블록체인 연동은 Phase 2-3에서 진행

| 기능 | Phase 1 (UI) | Phase 2 (연동) |
|------|-------------|---------------|
| 지갑 연결 | "지갑 연결" 버튼 + 연결 모달 UI | MetaMask, WalletConnect 실제 연동 |
| 데이터 소유권 | 소유권 시각화 페이지 (목업 데이터) | 온체인 데이터 증명 |
| 데이터 마켓 | "출시 예정" 안내 페이지 | P2P 데이터 공유/거래 |

### 3.7 설정

| 기능 | 설명 | 우선순위 |
|------|------|---------|
| 프로필 편집 | 이름, 프로필 사진, 소개 | P0 |
| 알림 설정 | 이메일 알림, 푸시 알림 on/off | P1 |
| 개인정보 설정 | 데이터 동의, 계정 삭제 | P0 |
| 테마 설정 | 라이트/다크 모드 | P2 |
| 언어 설정 | 한국어/영어 (i18n) | P3 |

---

## 4. 정보 아키텍처 & 페이지 구조

### 4.1 사이트맵

```
JooLife
├── / (랜딩 페이지 - 기존 홈페이지 마이그레이션)
│   ├── #hero (히어로 섹션)
│   ├── #about (소개 섹션)
│   └── #team (팀 섹션)
│
├── /auth
│   ├── /login (로그인)
│   ├── /signup (회원가입)
│   ├── /forgot-password (비밀번호 찾기)
│   └── /onboarding (온보딩 - 최초 1회)
│
├── /dashboard (인증 필요)
│   ├── / (메인 대시보드 - 위젯 그리드)
│   ├── /saved (저장된 콘텐츠)
│   │   ├── / (전체 목록)
│   │   └── /[id] (콘텐츠 상세)
│   ├── /recommendations (AI 추천)
│   ├── /automation (자동화)
│   │   ├── / (규칙 목록)
│   │   └── /new (새 규칙 만들기)
│   └── /wallet (Web3 - UI 플레이스홀더)
│
└── /settings (인증 필요)
    ├── /profile (프로필)
    ├── /privacy (개인정보)
    └── /notifications (알림)
```

### 4.2 네비게이션 구조

**비인증 상태**: 랜딩 페이지 → 로그인/회원가입
**인증 상태**: 대시보드 (기본) → 사이드바 네비게이션

**사이드바 메뉴**:
```
🏠 대시보드
📁 저장한 콘텐츠
🤖 AI 추천
⚡ 자동화
🔗 Web3 지갑
──────────
⚙️ 설정
```

### 4.3 Next.js App Router 구조

```
app/
├── layout.tsx              (루트 레이아웃 - 폰트, 메타데이터)
├── page.tsx                (랜딩 페이지)
├── globals.css             (Tailwind + 글로벌 스타일)
│
├── (auth)/
│   ├── layout.tsx          (인증 레이아웃 - 중앙 정렬)
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── forgot-password/page.tsx
│   └── onboarding/page.tsx
│
├── (dashboard)/
│   ├── layout.tsx          (대시보드 레이아웃 - 사이드바 + 상단바)
│   ├── dashboard/
│   │   └── page.tsx        (메인 대시보드)
│   ├── saved/
│   │   ├── page.tsx        (콘텐츠 목록)
│   │   └── [id]/page.tsx   (콘텐츠 상세)
│   ├── recommendations/
│   │   └── page.tsx        (AI 추천)
│   ├── automation/
│   │   ├── page.tsx        (규칙 목록)
│   │   └── new/page.tsx    (새 규칙)
│   └── wallet/
│       └── page.tsx        (Web3 UI)
│
├── settings/
│   ├── layout.tsx          (설정 레이아웃)
│   ├── profile/page.tsx
│   ├── privacy/page.tsx
│   └── notifications/page.tsx
│
└── api/                    (필요 시 API Routes)
    └── ...
```

---

## 5. 기술 아키텍처

### 5.1 기술 스택 개요

```
┌──────────────────────────────────────────────────────────────┐
│                        프론트엔드                              │
│  Next.js 14+ (App Router) · Tailwind CSS · Framer Motion     │
│  TypeScript · React 18+                                       │
├──────────────────────────────────────────────────────────────┤
│                          배포                                  │
│                        Vercel                                  │
├──────────────────────────────────────────────────────────────┤
│                        백엔드 (Supabase)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │   Auth   │ │ Database │ │ Storage  │ │  Edge Functions  │ │
│  │  (인증)  │ │(PostgreSQL)│ │ (파일)  │ │ (서버리스 함수)   │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘ │
│  ┌──────────┐ ┌──────────┐                                    │
│  │ Realtime │ │   RLS    │                                    │
│  │ (실시간) │ │ (보안)   │                                    │
│  └──────────┘ └──────────┘                                    │
├──────────────────────────────────────────────────────────────┤
│                      외부 서비스                               │
│  OpenAI/Anthropic API (AI) · Web3 (ethers.js/wagmi, Phase 2) │
└──────────────────────────────────────────────────────────────┘
```

### 5.2 프론트엔드 상세

| 기술 | 버전 | 용도 |
|------|------|------|
| **Next.js** | 14+ | App Router, Server Components, API Routes |
| **React** | 18+ | UI 컴포넌트 |
| **TypeScript** | 5+ | 타입 안전성 |
| **Tailwind CSS** | 3+ | 유틸리티 기반 스타일링 |
| **Framer Motion** | 10+ | 애니메이션 (기존 CSS 애니메이션 대체) |
| **@supabase/ssr** | latest | Supabase 서버사이드 클라이언트 |
| **React Hook Form** | latest | 폼 관리 |
| **Zod** | latest | 스키마 유효성 검증 |
| **Lucide React** | latest | 아이콘 (기존 인라인 SVG 대체) |

### 5.3 기존 디자인 시스템 → Tailwind CSS 마이그레이션

기존 `css/styles.css`의 CSS 변수를 Tailwind config에 매핑합니다:

```javascript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Primary
        black: '#1A1A1A',        // --color-black
        white: '#FFFFFF',        // --color-white
        'off-white': '#FAFAF8',  // --color-off-white

        // Accent (브랜드 컬러)
        accent: {
          DEFAULT: '#FF6B35',    // --color-accent
          light: '#FF8F65',      // --color-accent-light
          dark: '#E55A2B',       // --color-accent-dark
          bg: '#FFF4EF',         // --color-accent-bg
        },

        // Secondary
        secondary: '#2EC4B6',    // --color-secondary

        // Grays
        gray: {
          100: '#F5F5F3',
          200: '#E8E8E4',
          300: '#D1D1CC',
          400: '#A3A39E',
          500: '#6B6B66',
          600: '#4A4A46',
          700: '#333330',
        },

        // Functional
        success: '#27AE60',
        error: '#E74C3C',
      },

      fontFamily: {
        heading: ['Noto Serif KR', 'Georgia', 'serif'],
        body: ['Pretendard Variable', 'Pretendard', '-apple-system', 'sans-serif'],
      },

      fontSize: {
        // 기존 clamp() 값 유지
        xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.8rem)',
        sm: 'clamp(0.8rem, 0.75rem + 0.3vw, 0.9rem)',
        base: 'clamp(0.95rem, 0.9rem + 0.3vw, 1.05rem)',
        lg: 'clamp(1.1rem, 1rem + 0.5vw, 1.25rem)',
        xl: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        '2xl': 'clamp(1.5rem, 1.2rem + 1.5vw, 2rem)',
        '3xl': 'clamp(2rem, 1.5rem + 2.5vw, 3rem)',
        '4xl': 'clamp(2.5rem, 1.8rem + 3.5vw, 4rem)',
        hero: 'clamp(3rem, 2rem + 5vw, 5.5rem)',
      },

      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
      },

      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.08)',
        md: '0 4px 12px rgba(0,0,0,0.1)',
        lg: '0 8px 30px rgba(0,0,0,0.12)',
        xl: '0 16px 50px rgba(0,0,0,0.15)',
      },

      maxWidth: {
        container: '1200px',
      },
    },
  },
};
```

### 5.4 백엔드 (Supabase) 상세

| 서비스 | 용도 |
|--------|------|
| **Supabase Auth** | 이메일/소셜 인증, 세션 관리, JWT 토큰 |
| **PostgreSQL** | 핵심 데이터 저장, JSONB로 유연한 스키마 |
| **Row Level Security** | 테이블별 사용자 접근 제어 |
| **Supabase Storage** | 프로필 이미지, 콘텐츠 첨부 파일 |
| **Edge Functions** | AI API 호출, 자동화 실행, 외부 API 연동 |
| **Realtime** | 대시보드 실시간 업데이트 (저장, 추천 알림) |
| **pg_cron** | 자동화 스케줄 트리거 |

### 5.5 인증 아키텍처

```
[브라우저] ←→ [Next.js Middleware] ←→ [Supabase Auth]
                    │
                    ├── 인증 필요 라우트: /dashboard/*, /settings/*
                    ├── 공개 라우트: /, /auth/*
                    └── 세션 쿠키 자동 갱신
```

**Supabase SSR 설정**:
```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* cookie handlers */ } }
  )
}
```

### 5.6 배포 아키텍처

```
[GitHub Repository]
        │
        ↓ (push)
[Vercel] ← 자동 배포
  ├── Preview (PR별 프리뷰)
  ├── Production (main 브랜치)
  └── Environment Variables
       ├── NEXT_PUBLIC_SUPABASE_URL
       ├── NEXT_PUBLIC_SUPABASE_ANON_KEY
       ├── SUPABASE_SERVICE_ROLE_KEY
       └── OPENAI_API_KEY (또는 ANTHROPIC_API_KEY)
```

---

## 6. 데이터베이스 스키마

### 6.1 ER 다이어그램 (텍스트)

```
auth.users (Supabase 내장)
    │
    ├── 1:1 ── profiles
    ├── 1:N ── saved_contents ── N:M ── content_tags
    ├── 1:N ── categories
    ├── 1:N ── recommendations
    ├── 1:N ── automations ── 1:N ── automation_logs
    ├── 1:N ── activity_logs
    ├── 1:1 ── user_preferences
    ├── 1:N ── data_consents
    └── 1:N ── wallet_connections
```

### 6.2 테이블 정의

#### profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  interests TEXT[] DEFAULT '{}',  -- 관심사 태그 배열
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
```

#### saved_contents
```sql
CREATE TABLE saved_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('url', 'memo', 'image')),
  title TEXT,
  description TEXT,
  url TEXT,
  image_url TEXT,
  memo TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',  -- Open Graph 데이터, 추가 메타정보
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_saved_contents_user ON saved_contents(user_id);
CREATE INDEX idx_saved_contents_category ON saved_contents(category_id);
CREATE INDEX idx_saved_contents_created ON saved_contents(created_at DESC);

-- RLS
ALTER TABLE saved_contents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own contents"
  ON saved_contents FOR ALL USING (auth.uid() = user_id);
```

#### content_tags (다대다 관계)
```sql
CREATE TABLE content_tags (
  content_id UUID REFERENCES saved_contents(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  PRIMARY KEY (content_id, tag)
);

-- RLS
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage tags on own contents"
  ON content_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM saved_contents
      WHERE id = content_tags.content_id AND user_id = auth.uid()
    )
  );
```

#### categories
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#FF6B35',  -- 브랜드 색상 기본값
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own categories"
  ON categories FOR ALL USING (auth.uid() = user_id);
```

#### recommendations
```sql
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('content', 'insight', 'action')),
  title TEXT NOT NULL,
  description TEXT,
  source_url TEXT,
  reasoning TEXT,             -- AI가 추천한 이유
  relevance_score REAL,       -- 0.0 ~ 1.0
  feedback TEXT CHECK (feedback IN ('liked', 'disliked', NULL)),
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recommendations_user ON recommendations(user_id);
CREATE INDEX idx_recommendations_created ON recommendations(created_at DESC);

-- RLS
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read/update own recommendations"
  ON recommendations FOR ALL USING (auth.uid() = user_id);
```

#### automations
```sql
CREATE TABLE automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('news_collect', 'content_alert', 'schedule')),
  config JSONB NOT NULL DEFAULT '{}',  -- 키워드, 소스, 필터 등
  schedule TEXT,                        -- cron 표현식 (예: '0 9 * * *')
  is_active BOOLEAN DEFAULT TRUE,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own automations"
  ON automations FOR ALL USING (auth.uid() = user_id);
```

#### automation_logs
```sql
CREATE TABLE automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID REFERENCES automations(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'partial')),
  result JSONB DEFAULT '{}',    -- 수집된 아이템 수, 에러 내용 등
  items_count INTEGER DEFAULT 0,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (automations 소유자 기반)
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own automation logs"
  ON automation_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM automations
      WHERE id = automation_logs.automation_id AND user_id = auth.uid()
    )
  );
```

#### activity_logs
```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,          -- 'save_content', 'view_recommendation', 'search', 등
  entity_type TEXT,              -- 'content', 'recommendation', 'automation'
  entity_id UUID,
  metadata JSONB DEFAULT '{}',   -- 검색 키워드, 체류 시간 등
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);

-- RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own activity"
  ON activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert activity"
  ON activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### user_preferences
```sql
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  dashboard_layout JSONB DEFAULT '{"widgets": ["summary", "recent_saved", "quick_save"]}',
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT DEFAULT 'ko' CHECK (language IN ('ko', 'en')),
  notification_settings JSONB DEFAULT '{"email": true, "push": false}',
  ai_settings JSONB DEFAULT '{"enabled": true, "daily_insight": true}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own preferences"
  ON user_preferences FOR ALL USING (auth.uid() = user_id);
```

#### data_consents
```sql
CREATE TABLE data_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  consent_type TEXT NOT NULL,   -- 'ai_learning', 'recommendation', 'analytics', 'marketing'
  is_granted BOOLEAN NOT NULL,
  granted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_data_consents_user ON data_consents(user_id);

-- RLS
ALTER TABLE data_consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own consents"
  ON data_consents FOR ALL USING (auth.uid() = user_id);
```

#### wallet_connections
```sql
CREATE TABLE wallet_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  wallet_address TEXT NOT NULL,
  chain_id INTEGER NOT NULL,     -- 1: Ethereum, 137: Polygon, etc.
  wallet_type TEXT,               -- 'metamask', 'walletconnect'
  is_primary BOOLEAN DEFAULT FALSE,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_verified_at TIMESTAMPTZ
);

-- RLS
ALTER TABLE wallet_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own wallets"
  ON wallet_connections FOR ALL USING (auth.uid() = user_id);
```

### 6.3 Supabase Realtime 구독

실시간 업데이트가 필요한 테이블:

| 테이블 | 이벤트 | 용도 |
|--------|--------|------|
| `saved_contents` | INSERT | 새 콘텐츠 저장 시 대시보드 즉시 반영 |
| `recommendations` | INSERT | 새 AI 추천 도착 시 알림 |
| `automation_logs` | INSERT | 자동화 실행 결과 실시간 표시 |

---

## 7. API 설계

### 7.1 API 구조

Supabase는 PostgreSQL 테이블에 대해 자동으로 REST API와 GraphQL API를 생성합니다. 추가로 Edge Functions를 사용하여 커스텀 로직을 구현합니다.

```
API 구조:
├── Supabase Auto-generated REST API (CRUD 기본 작업)
│   └── /rest/v1/{table_name}
├── Supabase Edge Functions (커스텀 로직)
│   ├── /functions/v1/ai-recommend
│   ├── /functions/v1/extract-metadata
│   ├── /functions/v1/run-automation
│   └── /functions/v1/export-data
└── Next.js API Routes (프론트엔드 전용 프록시, 필요 시)
    └── /api/...
```

### 7.2 Edge Functions 상세

#### `ai-recommend` - AI 추천 생성

```
POST /functions/v1/ai-recommend

Request:
{
  "type": "content" | "insight",
  "limit": 5
}

Response:
{
  "recommendations": [
    {
      "title": "...",
      "description": "...",
      "source_url": "...",
      "reasoning": "저장된 콘텐츠 분석 결과...",
      "relevance_score": 0.85
    }
  ]
}

내부 동작:
1. 사용자의 최근 saved_contents 조회 (최근 50개)
2. 활동 로그에서 관심 패턴 분석
3. OpenAI/Anthropic API로 추천 생성
4. recommendations 테이블에 저장
5. 응답 반환
```

#### `extract-metadata` - URL 메타데이터 추출

```
POST /functions/v1/extract-metadata

Request:
{
  "url": "https://example.com/article"
}

Response:
{
  "title": "페이지 제목",
  "description": "페이지 설명",
  "image_url": "https://...",
  "site_name": "Example",
  "metadata": { /* Open Graph 데이터 */ }
}

내부 동작:
1. URL fetch
2. Open Graph 태그 파싱
3. 메타데이터 반환
```

#### `run-automation` - 자동화 규칙 실행

```
POST /functions/v1/run-automation

Request:
{
  "automation_id": "uuid"
}

Response:
{
  "status": "success",
  "items_collected": 3,
  "log_id": "uuid"
}

내부 동작:
1. automation 규칙 조회
2. 규칙 타입에 따라 실행 (뉴스 API 호출 등)
3. 수집된 콘텐츠를 saved_contents에 저장
4. automation_logs에 결과 기록
5. automation의 last_run_at 업데이트
```

#### `export-data` - 데이터 내보내기

```
POST /functions/v1/export-data

Request:
{
  "format": "json" | "csv",
  "tables": ["saved_contents", "categories"]
}

Response:
{
  "download_url": "https://storage.supabase.co/...",
  "expires_at": "2026-02-14T..."
}

내부 동작:
1. 사용자 데이터 조회 (RLS 적용)
2. 요청 형식으로 변환
3. Supabase Storage에 임시 파일 업로드
4. 서명된 다운로드 URL 반환 (24시간 유효)
```

### 7.3 Supabase REST API 사용 패턴

```typescript
// 클라이언트 사이드 데이터 조회 예시

// 저장된 콘텐츠 목록 (페이지네이션)
const { data, count } = await supabase
  .from('saved_contents')
  .select('*, content_tags(tag)', { count: 'exact' })
  .eq('is_archived', false)
  .order('created_at', { ascending: false })
  .range(0, 19)  // 20개씩

// 콘텐츠 저장
const { data } = await supabase
  .from('saved_contents')
  .insert({
    type: 'url',
    title: metadata.title,
    url: inputUrl,
    metadata: metadata,
  })
  .select()
  .single()

// 실시간 구독
supabase
  .channel('new-recommendations')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'recommendations',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // 새 추천 도착 처리
  })
  .subscribe()
```

---

## 8. AI 통합 전략

### 8.1 단계별 AI 전략

```
Phase 1 (MVP)          Phase 2 (고도화)         Phase 3 (자체 모델)
┌─────────────┐      ┌──────────────────┐     ┌──────────────────┐
│ API 기반     │      │ 임베딩 + 벡터 검색 │     │ 커스텀 모델      │
│ OpenAI /     │  →   │ pgvector          │  →  │ Fine-tuning      │
│ Anthropic    │      │ 유사도 추천        │     │ 행동 기반 개인화  │
└─────────────┘      └──────────────────┘     └──────────────────┘
```

### 8.2 Phase 1: API 기반 추천

**사용 API**: OpenAI GPT-4 또는 Anthropic Claude

**프롬프트 아키텍처**:

```
시스템 프롬프트:
"당신은 JooLife의 AI 어시스턴트입니다. 사용자의 저장된 콘텐츠와 활동 패턴을
분석하여 관련성 높은 정보를 추천합니다. 한국어로 응답하며, 추천 이유를
간결하게 설명합니다."

사용자 컨텍스트:
- 최근 저장 콘텐츠 (제목, 설명, 태그) 50개
- 관심사 태그
- 활동 패턴 요약

요청:
"위 사용자의 관심사와 최근 활동을 기반으로 관련 콘텐츠 5개를 추천해주세요.
각 추천에 대해 제목, 설명, 추천 이유를 JSON 형식으로 제공하세요."
```

**비용 관리**:

| 전략 | 설명 |
|------|------|
| 캐싱 | 동일 컨텍스트에 대한 추천 결과를 24시간 캐싱 |
| Rate Limiting | 사용자당 일 10회 (Free), 50회 (Pro), 무제한 (Premium) |
| 토큰 최적화 | 컨텍스트 요약본 사용, 불필요한 메타데이터 제거 |
| 배치 처리 | 개별 호출 대신 일일 1회 배치 추천 생성 (Free 티어) |
| 모니터링 | 월별 API 비용 대시보드, 비용 임계값 알림 |

**예상 비용** (GPT-4 기준):
- 사용자 1,000명, 일 평균 5회 추천: 약 월 $150-300
- 사용자 10,000명: 약 월 $1,500-3,000

### 8.3 Phase 2: pgvector 임베딩 (6개월 후)

```sql
-- pgvector 확장 활성화
CREATE EXTENSION vector;

-- 콘텐츠 임베딩 컬럼 추가
ALTER TABLE saved_contents ADD COLUMN embedding vector(1536);

-- 유사도 검색 인덱스
CREATE INDEX ON saved_contents
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```

**동작 흐름**:
1. 콘텐츠 저장 시 텍스트를 임베딩 벡터로 변환
2. 유사 콘텐츠 검색: `ORDER BY embedding <=> query_embedding LIMIT 5`
3. API 호출 없이 빠른 유사도 기반 추천 가능

### 8.4 Phase 3: 개인화 모델 (12개월 후)

- 사용자 행동 데이터 (`activity_logs`) 기반 학습
- 클릭률, 저장률, 체류 시간 등을 피처로 활용
- 콘텐츠 추천 정확도 지속 개선
- 사용자 동의 하에만 학습 데이터 활용

---

## 9. Web3 통합 로드맵

### 9.1 전체 로드맵

```
Phase 1 (MVP)          Phase 2 (6개월)         Phase 3 (12개월)
┌─────────────┐      ┌──────────────────┐     ┌──────────────────┐
│ UI 플레이스홀더│      │ 지갑 연결         │     │ 온체인 데이터     │
│ 목업 데이터   │  →   │ MetaMask         │  →  │ 데이터 증명       │
│ "출시 예정"   │      │ WalletConnect    │     │ 데이터 마켓       │
└─────────────┘      └──────────────────┘     └──────────────────┘
```

### 9.2 Phase 1: UI 플레이스홀더 (MVP)

**목표**: Web3 기능의 UI/UX를 미리 설계하여 사용자 피드백 수집

**구현 내용**:

1. **지갑 연결 페이지** (`/dashboard/wallet`)
   - "지갑 연결" 버튼 (클릭 시 "출시 예정" 모달)
   - 지원 예정 지갑 목록 (MetaMask, WalletConnect 로고)
   - Web3 기능 소개 텍스트

2. **데이터 소유권 시각화**
   - 사용자 데이터 현황 대시보드 (목업)
   - "데이터 소유권 증명" 카드 (목업)
   - "블록체인에 기록된 데이터" 타임라인 (목업)

3. **관심 등록 CTA**
   - "Web3 기능 출시 알림 받기" 이메일 수집
   - 사용자 관심도 측정용 데이터 수집

### 9.3 Phase 2: 지갑 연결 (6개월 후)

**기술**: ethers.js + wagmi + RainbowKit

```typescript
// 예시 구조
import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'

const config = createConfig({
  chains: [mainnet, polygon],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
  },
})
```

**기능**:
- MetaMask, WalletConnect, Coinbase Wallet 지원
- 지갑 주소 → `wallet_connections` 테이블 저장
- 지갑 서명으로 데이터 소유권 증명

### 9.4 Phase 3: 온체인 데이터 증명 (12개월 후)

**체인 선택**: Polygon (낮은 가스비, 빠른 트랜잭션)

**기능**:
- 데이터 해시를 온체인에 기록하여 소유권 증명
- 사용자가 선택한 데이터만 온체인 기록 (동의 기반)
- P2P 데이터 공유 마켓플레이스 (향후)

---

## 10. 개발 로드맵

### 10.1 Phase 0: 프로젝트 셋업 (2주)

| 주차 | 작업 | 산출물 |
|------|------|--------|
| 1주 | Next.js 프로젝트 생성, Tailwind CSS 설정, TypeScript 설정 | 프로젝트 보일러플레이트 |
| 1주 | Supabase 프로젝트 생성, 환경변수 설정 | Supabase 연결 완료 |
| 1주 | Vercel 배포 설정, GitHub Actions CI/CD | 자동 배포 파이프라인 |
| 2주 | DB 마이그레이션 스크립트 작성, 테이블 생성 | 데이터베이스 스키마 |
| 2주 | 디자인 시스템 마이그레이션 (CSS 변수 → Tailwind) | tailwind.config.ts |
| 2주 | 공통 컴포넌트 (Button, Input, Card, Modal) | UI 컴포넌트 라이브러리 |

**마일스톤**: 빈 대시보드에 "Hello, JooLife!" 표시, Vercel 배포 확인

### 10.2 Phase 1: 랜딩 + 인증 (4주)

| 주차 | 작업 | 산출물 |
|------|------|--------|
| 3주 | 기존 랜딩 페이지 → Next.js 컴포넌트 마이그레이션 | 랜딩 페이지 |
| 3주 | Framer Motion 애니메이션 (기존 CSS 애니메이션 대체) | 애니메이션 |
| 4주 | Supabase Auth 설정 (이메일, Google, Kakao) | 인증 시스템 |
| 4주 | 로그인/회원가입 페이지 | 인증 UI |
| 5주 | 비밀번호 재설정, 세션 관리, Middleware | 인증 완성 |
| 5주 | 온보딩 플로우 (관심사 선택, 동의 설정) | 온보딩 |
| 6주 | 프로필 설정 페이지, 개인정보 설정 | 설정 페이지 |
| 6주 | 테스트 및 버그 수정 | QA 완료 |

**마일스톤**: 회원가입 → 로그인 → 온보딩 → 대시보드 진입 플로우 완성

### 10.3 Phase 2: 대시보드 + 콘텐츠 관리 (6주)

| 주차 | 작업 | 산출물 |
|------|------|--------|
| 7주 | 대시보드 레이아웃 (사이드바 + 상단바) | 대시보드 쉘 |
| 7주 | 위젯 시스템 기본 구조 | 위젯 프레임워크 |
| 8주 | 콘텐츠 저장 기능 (URL 입력 → 메타데이터 추출) | 콘텐츠 저장 |
| 8주 | extract-metadata Edge Function | URL 파싱 API |
| 9주 | 저장된 콘텐츠 목록/상세 페이지 | 콘텐츠 CRUD UI |
| 9주 | 태그 관리, 카테고리 분류 | 분류 시스템 |
| 10주 | 검색 기능 (Full-text search) | 검색 |
| 10주 | 데이터 내보내기 (JSON/CSV) | 내보내기 기능 |
| 11주 | 대시보드 위젯 (오늘의 요약, 최근 저장, 빠른 저장) | 대시보드 위젯 |
| 11주 | Realtime 구독 (새 콘텐츠 실시간 반영) | 실시간 업데이트 |
| 12주 | 데이터 동의 관리 UI | 동의 관리 |
| 12주 | 테스트 및 버그 수정 | QA 완료 |

**마일스톤**: URL 저장 → 태그/카테고리 분류 → 검색 → 내보내기 플로우 완성

### 10.4 Phase 3: AI 추천 (4주)

| 주차 | 작업 | 산출물 |
|------|------|--------|
| 13주 | ai-recommend Edge Function | AI 추천 API |
| 13주 | 프롬프트 엔지니어링 및 테스트 | 프롬프트 최적화 |
| 14주 | AI 추천 페이지 UI | 추천 UI |
| 14주 | 추천 피드백 (좋아요/싫어요) | 피드백 시스템 |
| 15주 | 대시보드 AI 추천 위젯 | 위젯 통합 |
| 15주 | 비용 관리 (캐싱, Rate limiting) | 비용 최적화 |
| 16주 | 활동 로깅 시스템 | activity_logs |
| 16주 | 테스트 및 버그 수정 | QA 완료 |

**마일스톤**: AI가 사용자 콘텐츠 기반 추천 제공, 피드백 반영

### 10.5 Phase 4: 자동화 + Web3 UI (4주)

| 주차 | 작업 | 산출물 |
|------|------|--------|
| 17주 | 자동화 규칙 관리 UI | 자동화 페이지 |
| 17주 | run-automation Edge Function | 자동화 실행 API |
| 18주 | 뉴스 수집 자동화 (외부 뉴스 API 연동) | 뉴스 수집 |
| 18주 | 자동화 실행 로그, 스케줄 관리 | 로그 시스템 |
| 19주 | Web3 지갑 페이지 (UI 플레이스홀더) | Web3 UI |
| 19주 | 데이터 소유권 시각화 (목업) | 소유권 UI |
| 20주 | 전체 통합 테스트, 성능 최적화 | QA 완료 |
| 20주 | 프로덕션 배포 준비 | 런칭 준비 |

**마일스톤**: MVP 완성, 프로덕션 배포

### 10.6 Phase 5: 확장 (이후)

| 기간 | 작업 |
|------|------|
| 6개월 후 | Web3 지갑 실제 연결 (MetaMask, WalletConnect) |
| 6개월 후 | pgvector 임베딩 기반 추천 고도화 |
| 8개월 후 | 다크 모드, i18n (영어 지원) |
| 12개월 후 | 모바일 앱 (React Native 또는 PWA) |
| 12개월 후 | 온체인 데이터 증명, 데이터 마켓플레이스 |
| 12개월 후 | 개인화 AI 모델 학습 |

### 10.7 전체 타임라인

```
Week  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20
      ├──────┤                                                      Phase 0: 셋업
               ├─────────────────┤                                  Phase 1: 랜딩+인증
                                    ├──────────────────────────┤    Phase 2: 대시보드
                                                                  ├────────────────┤ Phase 3: AI
                                                                                    ├────────────────┤ Phase 4: 자동화+Web3
      ▲                          ▲                              ▲                  ▲
   프로젝트 시작            인증 완성                    콘텐츠 관리 완성        MVP 런칭
```

---

## 11. UI/UX 주요 화면 설명

### 11.1 디자인 원칙

| 원칙 | 설명 |
|------|------|
| **브랜드 계승** | 기존 랜딩 디자인 시스템 유지 (색상 #FF6B35, Pretendard, Noto Serif KR) |
| **최소 인지 부하** | 한 화면에 핵심 정보만 표시, 계층적 정보 구조 |
| **일관성** | 동일한 컴포넌트와 패턴 반복 사용 |
| **접근성** | WCAG 2.1 AA 준수, 키보드 네비게이션, 스크린 리더 지원 |
| **반응형** | 모바일 우선 (Mobile First) 접근 |

### 11.2 랜딩 페이지 (마이그레이션)

기존 `index.html`의 구조를 Next.js 컴포넌트로 변환:

```
기존                    →  Next.js
index.html              →  app/page.tsx
├── header              →  components/landing/Header.tsx
├── hero                →  components/landing/Hero.tsx
├── about               →  components/landing/About.tsx
├── team                →  components/landing/Team.tsx
└── footer              →  components/landing/Footer.tsx
```

**변경 사항**:
- IntersectionObserver 기반 애니메이션 → Framer Motion `whileInView`
- 인라인 SVG → Lucide React 아이콘
- 모바일 메뉴 → React 상태 관리
- "로그인" 버튼 추가 (헤더 우측)
- 기존 한국어 카피 100% 유지

### 11.3 대시보드

```
┌─────────────────────────────────────────────────────┐
│  ☰  JooLife                    🔔  👤 프로필       │  ← 상단바
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│  🏠 홈    │  ┌─────────────┐  ┌─────────────────┐  │
│  📁 저장  │  │ 오늘의 요약  │  │   빠른 저장     │  │
│  🤖 추천  │  │             │  │  [URL 입력...]   │  │
│  ⚡ 자동화│  │ 저장: 42개   │  │                 │  │
│  🔗 지갑  │  │ 추천: 5개    │  └─────────────────┘  │
│          │  └─────────────┘                         │
│ ─────── │                                          │
│  ⚙️ 설정 │  ┌──────────────────────────────────────┐│
│          │  │        최근 저장한 콘텐츠              ││
│          │  │  ┌──────┐ ┌──────┐ ┌──────┐          ││
│          │  │  │카드 1 │ │카드 2 │ │카드 3 │          ││
│          │  │  └──────┘ └──────┘ └──────┘          ││
│          │  └──────────────────────────────────────┘│
│          │                                          │
│          │  ┌──────────────────────────────────────┐│
│          │  │         AI 추천                       ││
│          │  │  💡 "당신의 관심사 기반 추천..."       ││
│          │  └──────────────────────────────────────┘│
└──────────┴──────────────────────────────────────────┘
```

**레이아웃 사양**:
- 사이드바: 고정 240px (데스크톱), 오버레이 (모바일)
- 상단바: 고정 64px, 검색바 + 알림 + 프로필
- 메인 영역: 2열 그리드, max-width 1200px, 패딩 24px

### 11.4 콘텐츠 저장 목록

```
┌──────────────────────────────────────────────────────┐
│  저장한 콘텐츠                     [+ 새 콘텐츠]     │
│                                                      │
│  [전체] [URL] [메모]   🔍 검색...   정렬: 최신순 ▼   │
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │ □ 📄 기사 제목...                                ││
│  │   example.com · #태그1 #태그2 · 2분 전           ││
│  ├──────────────────────────────────────────────────┤│
│  │ □ 📝 메모 제목...                                ││
│  │   #태그3 · 1시간 전                              ││
│  ├──────────────────────────────────────────────────┤│
│  │ □ 📄 다른 기사...                                ││
│  │   other-site.com · #태그1 · 어제                 ││
│  └──────────────────────────────────────────────────┘│
│                                                      │
│  ← 1 2 3 ... 10 →                                   │
└──────────────────────────────────────────────────────┘
```

### 11.5 AI 추천 페이지

```
┌──────────────────────────────────────────────────────┐
│  AI 추천                          [🔄 새로고침]      │
│                                                      │
│  "당신의 최근 관심사를 분석한 맞춤 추천입니다"         │
│                                                      │
│  ┌────────────────────────────────────────────┐      │
│  │  💡 추천 1: 기사 제목                       │      │
│  │  "저장한 AI 관련 콘텐츠와 유사한..."        │      │
│  │  relevance: ████████░░ 85%                  │      │
│  │                              [👍] [👎] [📁]│      │
│  └────────────────────────────────────────────┘      │
│                                                      │
│  ┌────────────────────────────────────────────┐      │
│  │  💡 추천 2: ...                             │      │
│  └────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────┘
```

### 11.6 Web3 지갑 페이지 (Phase 1 UI)

```
┌──────────────────────────────────────────────────────┐
│  Web3 지갑                                           │
│                                                      │
│  ┌────────────────────────────────────────────┐      │
│  │        🔗 블록체인으로 데이터를 보호하세요       │      │
│  │                                            │      │
│  │  JooLife는 블록체인 기술을 활용하여         │      │
│  │  당신의 데이터 소유권을 보장합니다.          │      │
│  │                                            │      │
│  │        [지갑 연결하기]  ← 클릭 시 모달      │      │
│  └────────────────────────────────────────────┘      │
│                                                      │
│  지원 예정 지갑:                                      │
│  ┌──────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ 🦊   │  │ 🔗           │  │ 🔵           │       │
│  │Meta  │  │ WalletConnect│  │ Coinbase     │       │
│  │Mask  │  │              │  │              │       │
│  │출시예정│  │  출시 예정   │  │  출시 예정    │       │
│  └──────┘  └──────────────┘  └──────────────┘       │
│                                                      │
│  ┌────────────────────────────────────────────┐      │
│  │  📧 Web3 기능 출시 알림 받기                │      │
│  │  [이메일 입력...]        [알림 신청]        │      │
│  └────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────┘
```

### 11.7 컴포넌트 라이브러리

| 컴포넌트 | 설명 | variants |
|----------|------|----------|
| Button | 기본 버튼 | primary, secondary, outline, ghost, danger |
| Input | 입력 필드 | text, email, password, url, textarea |
| Card | 콘텐츠 카드 | default, elevated, interactive |
| Modal | 모달/다이얼로그 | default, confirm, alert |
| Badge | 태그/상태 표시 | default, accent, success, error |
| Avatar | 프로필 이미지 | sm, md, lg |
| Sidebar | 사이드바 내비게이션 | - |
| TopBar | 상단바 | - |
| Widget | 대시보드 위젯 | summary, list, chart, input |
| Skeleton | 로딩 스켈레톤 | text, card, avatar |

---

## 12. 보안 & 컴플라이언스

### 12.1 법적 요구사항

#### 한국 개인정보보호법 (PIPA) 준수

| 조항 | 요구사항 | JooLife 대응 |
|------|---------|-------------|
| 제15조 (수집·이용) | 개인정보 수집 시 동의 필수 | `data_consents` 테이블로 항목별 동의 관리 |
| 제17조 (제3자 제공) | 제3자 제공 시 별도 동의 | AI API 호출 시 데이터 익명화, 동의 확인 |
| 제21조 (파기) | 목적 달성 후 파기 | 계정 삭제 시 전체 데이터 CASCADE 삭제 |
| 제35조 (열람) | 본인 정보 열람권 | 설정 > 개인정보에서 수집 데이터 목록 확인 |
| 제36조 (정정·삭제) | 정정/삭제 요청권 | 데이터 내보내기 + 선택적 삭제 기능 |
| 제37조 (처리정지) | 처리 정지 요청권 | 동의 철회 시 해당 데이터 처리 즉시 중단 |

#### 데이터 동의 플로우

```
[회원가입] → [필수 동의] → [선택 동의] → [서비스 이용]
                │              │
          서비스 이용약관    AI 학습 동의
          개인정보처리방침    추천 서비스 동의
                            분석 동의
                            마케팅 동의
                              │
                    [설정에서 언제든 철회 가능]
```

### 12.2 보안 아키텍처

#### 계층별 보안

```
┌─────────────────────────────────────────┐
│  WAF / DDoS 방어 (Vercel Edge Network)  │
├─────────────────────────────────────────┤
│  TLS 1.3 (전송 암호화)                    │
├─────────────────────────────────────────┤
│  Next.js Middleware (인증 검증)           │
├─────────────────────────────────────────┤
│  Supabase Auth (JWT + 세션 관리)         │
├─────────────────────────────────────────┤
│  Row Level Security (행 단위 접근 제어)   │
├─────────────────────────────────────────┤
│  AES-256 (저장 데이터 암호화, Supabase)   │
└─────────────────────────────────────────┘
```

#### 데이터 암호화

| 구분 | 방식 | 적용 대상 |
|------|------|-----------|
| 전송 중 (In Transit) | TLS 1.3 | 모든 HTTP 통신 (Vercel + Supabase) |
| 저장 시 (At Rest) | AES-256 | PostgreSQL 데이터, Storage 파일 |
| 토큰 | JWT (RS256) | 인증 토큰 (Supabase Auth 기본) |
| API 키 | 환경변수 암호화 | OpenAI/Anthropic 키 (Vercel Encrypted) |

### 12.3 OWASP Top 10 대응

| 위협 | 대응 방안 |
|------|-----------|
| **A01: 접근 제어 실패** | Supabase RLS로 모든 테이블에 행 단위 접근 제어 적용 |
| **A02: 암호화 실패** | TLS 1.3 + AES-256 + JWT RS256, 민감 정보 환경변수 관리 |
| **A03: 인젝션** | Supabase SDK의 Parameterized Query 사용, 사용자 입력 검증 (Zod) |
| **A04: 불안전한 설계** | 서버사이드 유효성 검증, API Rate Limiting |
| **A05: 보안 설정 오류** | Vercel 보안 헤더 (CSP, HSTS, X-Frame-Options), Supabase 기본 보안 설정 |
| **A06: 취약 컴포넌트** | npm audit, Dependabot 자동 업데이트, 정기 보안 패치 |
| **A07: 인증 실패** | Supabase Auth (검증된 인증 시스템), 비밀번호 정책, Rate Limiting |
| **A08: 데이터 무결성** | CI/CD 파이프라인 보안, Vercel 배포 보호, 종속성 잠금 (lockfile) |
| **A09: 로깅 실패** | Sentry 오류 추적, 활동 로그, Supabase 감사 로그 |
| **A10: SSRF** | Edge Functions에서 URL 화이트리스트, 내부 네트워크 접근 차단 |

### 12.4 보안 위협 모델

| 위협 | 공격 시나리오 | 심각도 | 대응 |
|------|-------------|--------|------|
| 인증 공격 | 무차별 대입, 자격 증명 도용 | 높음 | Rate Limiting, 계정 잠금, MFA (Phase 2) |
| XSS | 저장된 콘텐츠에 악성 스크립트 삽입 | 높음 | CSP 헤더, HTML Sanitize, React 자동 이스케이프 |
| CSRF | 인증된 세션으로 악의적 요청 | 중간 | SameSite 쿠키, CSRF 토큰 |
| API 남용 | AI API 과다 호출로 비용 폭증 | 중간 | 사용자별 Rate Limit, 일일 쿼터, 비용 알림 |
| 데이터 유출 | DB 접근 권한 탈취 | 높음 | RLS, 서비스 키 서버 전용, 최소 권한 원칙 |
| 공급망 공격 | 악성 npm 패키지 | 중간 | lockfile 고정, Dependabot, npm audit |

### 12.5 Phase별 보안 체크리스트

| Phase | 보안 작업 |
|-------|-----------|
| Phase 0 | 환경변수 관리 설정, Vercel 보안 헤더, RLS 정책 작성 |
| Phase 1 | Supabase Auth 설정, CSRF 방어, 입력 검증 (Zod) |
| Phase 2 | CSP 헤더 강화, Rate Limiting, Sentry 연동 |
| Phase 3 | AI API 비용 알림, 프롬프트 인젝션 방어 |
| Phase 4 | Web3 보안 감사 (Phase 2 연동 시), 침투 테스트 |

---

## 13. 모니터링 & 분석

### 13.1 모니터링 스택

```
┌──────────────────────────────────────────────────┐
│                 모니터링 레이어                      │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Vercel   │  │  Sentry  │  │   PostHog     │  │
│  │Analytics │  │  오류추적  │  │  사용자 분석   │  │
│  │성능 모니터│  │          │  │  (셀프호스팅)  │  │
│  └──────────┘  └──────────┘  └───────────────┘  │
│                                                  │
│  ┌──────────────────┐  ┌─────────────────────┐  │
│  │ Supabase Dashboard│  │  커스텀 KPI 대시보드 │  │
│  │ DB/Auth 모니터링   │  │  (대시보드 내장)     │  │
│  └──────────────────┘  └─────────────────────┘  │
└──────────────────────────────────────────────────┘
```

### 13.2 성능 모니터링

**도구**: Vercel Analytics (내장)

#### Core Web Vitals 목표값

| 지표 | 설명 | 목표 | 측정 |
|------|------|------|------|
| **LCP** | Largest Contentful Paint | < 2.5초 | 가장 큰 콘텐츠 렌더링 시간 |
| **INP** | Interaction to Next Paint | < 200ms | 사용자 인터랙션 응답 속도 |
| **CLS** | Cumulative Layout Shift | < 0.1 | 레이아웃 안정성 |
| **TTFB** | Time to First Byte | < 800ms | 서버 응답 시간 |
| **FCP** | First Contentful Paint | < 1.8초 | 첫 콘텐츠 렌더링 시간 |

#### 성능 최적화 전략

| 전략 | 적용 |
|------|------|
| Server Components | 대시보드 초기 로딩 최적화 (클라이언트 JS 최소화) |
| Image Optimization | `next/image`로 자동 최적화, WebP/AVIF 변환 |
| Code Splitting | 페이지별 자동 분할, 동적 import |
| Edge Caching | Vercel Edge Network 활용 |
| DB Query 최적화 | Supabase 인덱스 활용, 페이지네이션 |

### 13.3 오류 추적

**도구**: Sentry

**설정**:
```typescript
// sentry.client.config.ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,       // 성능 10% 샘플링
  replaysSessionSampleRate: 0,  // 세션 리플레이 비활성화 (프라이버시)
  environment: process.env.NODE_ENV,
});
```

**추적 대상**:

| 유형 | 설명 | 알림 조건 |
|------|------|-----------|
| 프론트엔드 오류 | React 렌더링 에러, 네트워크 에러 | 에러율 > 1% |
| Edge Function 오류 | AI API 실패, 자동화 실패 | 에러율 > 5% |
| Auth 오류 | 로그인 실패 급증 | 5분 내 50회 이상 |
| API 응답 지연 | Supabase 쿼리 지연 | P95 > 3초 |

### 13.4 사용자 분석

**도구**: PostHog (프라이버시 우선, 셀프호스팅 옵션)

> PostHog 선택 이유: GDPR/PIPA 준수, 셀프호스팅 가능, 쿠키리스 추적 지원, 오픈소스

**추적 이벤트**:

| 이벤트 | 설명 | 속성 |
|--------|------|------|
| `signup_completed` | 회원가입 완료 | method (email/google/kakao) |
| `content_saved` | 콘텐츠 저장 | type (url/memo), has_tags |
| `recommendation_viewed` | AI 추천 확인 | recommendation_id |
| `recommendation_feedback` | 추천 피드백 | feedback (liked/disliked) |
| `automation_created` | 자동화 규칙 생성 | type |
| `export_requested` | 데이터 내보내기 | format (json/csv) |
| `wallet_interest` | Web3 관심 등록 | - |

**주의**: 모든 분석 데이터는 `data_consents`의 `analytics` 동의가 있는 사용자만 수집

### 13.5 KPI 대시보드

#### 핵심 KPI

| 카테고리 | KPI | 목표 (런칭 3개월) | 측정 주기 |
|----------|-----|-------------------|-----------|
| **성장** | MAU (월 활성 사용자) | 1,000명 | 주간 |
| **성장** | 회원가입 전환율 | > 5% (방문→가입) | 주간 |
| **참여** | DAU/MAU 비율 | > 20% | 주간 |
| **참여** | 일 평균 콘텐츠 저장 수 | 3개/사용자 | 일간 |
| **AI** | AI 추천 클릭률 (CTR) | > 15% | 주간 |
| **AI** | 추천 긍정 피드백 비율 | > 60% | 주간 |
| **자동화** | 자동화 규칙 생성률 | > 10% (사용자 중) | 월간 |
| **리텐션** | 7일 리텐션 | > 40% | 주간 |
| **리텐션** | 30일 리텐션 | > 20% | 월간 |
| **기술** | 업타임 | > 99.5% | 실시간 |
| **기술** | P95 응답시간 | < 500ms | 일간 |
| **비용** | AI API 비용/사용자 | < $0.30/월 | 월간 |

#### 퍼널 분석

```
방문 → 회원가입 → 온보딩 완료 → 첫 콘텐츠 저장 → 7일 재방문 → 유료 전환
100%    5%         80%           60%              40%           5%
```

### 13.6 알림 체계

| 알림 유형 | 조건 | 채널 | 담당 |
|-----------|------|------|------|
| 긴급 (P0) | 서비스 다운, 데이터 유출 의심 | Slack + SMS | 전체 |
| 높음 (P1) | 에러율 급증, 인증 실패 폭증 | Slack | 백엔드 |
| 보통 (P2) | 성능 저하, API 비용 80% 도달 | Slack | 담당자 |
| 낮음 (P3) | 주간 리포트, 트렌드 변화 | 이메일 | PM |

---

## 14. 경쟁사 분석 & 차별화

### 14.1 경쟁 환경 개요

JooLife가 진입하는 시장은 "개인 지식 관리 + AI 큐레이션 + 데이터 주권" 교차점에 위치합니다. 기존 서비스들은 각각 특정 영역에 특화되어 있으나, 이를 통합적으로 제공하는 플랫폼은 부재합니다.

### 14.2 주요 경쟁 서비스 분석

#### Notion
- **분류**: 올인원 워크스페이스
- **가격**: Free / Plus $10/월 / Business $20/월
- **강점**: 강력한 데이터베이스, 협업, 성숙한 생태계
- **약점**: AI 기능 유료 (Business 이상), 데이터 중앙화, 개인 맞춤 추천 없음
- **Web3/AI**: AI 기능 제한적 (유료), Web3 없음

#### Readwise Reader
- **분류**: 읽기/지식 관리
- **가격**: $11.99/월 (연 $8.99/월)
- **강점**: 하이라이팅, Ghostreader AI, 스페이스드 리피티션, 다양한 내보내기
- **약점**: 읽기 중심 (라이프스타일 관리 아님), 자동 수집 없음, 데이터 주권 미지원
- **Web3/AI**: AI 있음 (Ghostreader), Web3 없음

#### Raindrop.io
- **분류**: 북마크 관리
- **가격**: Free / Pro $3/월
- **강점**: 저렴한 가격, AI 시맨틱 검색, 영구 아카이빙
- **약점**: 북마크 전용 (좁은 범위), 개인화 추천 없음, 자동 수집 없음
- **Web3/AI**: 기본 AI 검색만, Web3 없음

#### Feedly
- **분류**: 뉴스/RSS 큐레이션
- **가격**: Free / Pro $8/월 / Pro+ $13/월
- **강점**: Leo AI 필터링, 트렌드 감지, 대량 소스 처리
- **약점**: 뉴스/정보 전용, 개인 데이터 통합 없음, 한국 시장 부재, 고가
- **Web3/AI**: 강력한 AI (Leo), Web3 없음

#### Obsidian
- **분류**: 로컬 노트 / 지식 그래프
- **가격**: 무료 (Sync $8/월 옵션)
- **강점**: 완전 무료, 로컬 데이터 소유, 강력한 플러그인, 프라이버시
- **약점**: 수동 입력 필수, 자동 수집/추천 없음, 높은 학습 곡선
- **Web3/AI**: AI 플러그인 (서드파티), Web3 없음

> **참고**: Pocket은 2025년 7월 서비스 종료됨 (Mozilla)

### 14.3 경쟁 포지셔닝 매트릭스

| 기능 | Notion | Readwise | Raindrop | Feedly | Obsidian | **JooLife** |
|------|--------|----------|----------|--------|----------|-------------|
| 데이터 주권 | ❌ | ⚠️ | ⚠️ | ❌ | ✅ | ✅✅ |
| AI 개인화 추천 | ⚠️ | ✅ | ⚠️ | ✅ | ⚠️ | ✅✅ |
| 자동 콘텐츠 수집 | ❌ | ❌ | ⚠️ | ✅ | ❌ | ✅ |
| 한국 시장 최적화 | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Web3 통합 | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| 라이프스타일 통합 | ⚠️ | ❌ | ❌ | ❌ | ⚠️ | ✅ |
| 무료 티어 | ✅ | 체험판 | ✅ | ✅ | ✅ | ✅ |

> ✅✅ = 핵심 차별화 요소, ✅ = 지원, ⚠️ = 부분 지원, ❌ = 미지원

### 14.4 JooLife 6대 차별화 포인트

#### 1. 블록체인 기반 데이터 소유권 증명
- **경쟁사 현황**: 어떤 경쟁사도 블록체인 통합 없음
- **JooLife**: Phase 2-3에서 온체인 데이터 해시 기록, 암호학적 소유권 증명
- **가치**: "내 데이터는 내 것"이라는 증명 가능한 데이터 주권

#### 2. 라이프스타일 맥락 AI
- **경쟁사 현황**: Feedly(뉴스 AI), Readwise(읽기 AI), Notion(작성 AI) - 모두 단일 영역
- **JooLife**: 저장 패턴, 관심사 변화, 활동 시간대 등 라이프스타일 맥락을 종합 분석
- **가치**: "콘텐츠"가 아닌 "생활"을 이해하는 AI

#### 3. 규칙 기반 자동 콘텐츠 수집
- **경쟁사 현황**: Feedly(RSS만), Raindrop(IFTTT 외부 의존), 나머지 수동
- **JooLife**: 키워드, 소스, 시간 조건을 조합한 유연한 자동화 규칙
- **가치**: "설정하고 잊으세요" - 관심사에 맞는 콘텐츠가 자동으로 모임

#### 4. 한국 시장 퍼스트
- **경쟁사 현황**: 모두 글로벌 서비스, 한국어 지원 제한적
- **JooLife**: 카카오 로그인, Pretendard 폰트, 한국 UX 패턴, 한국어 AI 응답
- **가치**: 한국 사용자를 위해 처음부터 설계된 플랫폼

#### 5. 통합 라이프스타일 플랫폼
- **경쟁사 현황**: Notion(워크스페이스), Raindrop(북마크), Feedly(뉴스) - 분산
- **JooLife**: 콘텐츠 저장 + AI 추천 + 자동화 + 데이터 관리를 하나로 통합
- **가치**: 여러 앱을 오갈 필요 없이 하나의 대시보드에서 디지털 라이프 관리

#### 6. Web3 네이티브 로드맵
- **경쟁사 현황**: 블록체인 통합 계획이 있는 경쟁사 전무
- **JooLife**: MVP부터 Web3 UI를 포함하고, 단계적으로 실제 연동
- **가치**: Web3 시대에 맞는 데이터 소유권과 투명성 확보

### 14.5 포지셔닝 요약

> **JooLife**는 한국 시장에 최적화된 유일한 **데이터 주권 기반 AI 라이프스타일 관리 플랫폼**입니다.
>
> 분산된 도구들(Notion, Feedly, Raindrop)을 하나로 통합하고,
> 콘텐츠 AI를 넘어 **라이프스타일 맥락**을 이해하며,
> **블록체인 기반 데이터 소유권 증명**이라는 경쟁사가 제공하지 못하는 가치를 제공합니다.

---

## 부록

### A. 환경 변수

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# AI
OPENAI_API_KEY=xxxxx
# 또는
ANTHROPIC_API_KEY=xxxxx

# Web3 (Phase 2)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=xxxxx
NEXT_PUBLIC_ALCHEMY_API_KEY=xxxxx
```

### B. 회사 정보 (기존 홈페이지 기준)

| 항목 | 내용 |
|------|------|
| 회사명 | 쥬라프 (JooLife) |
| 대표 | 박주호 |
| 사업자등록번호 | 266-31-02086 |
| 주소 | 경기 안양시 동안구 관평로212번길 21 공작부영아파트 309동 1312호 |
| 전화 | 010-3159-3708 |
| 이메일 | joolife@joolife.io.kr |
| 도메인 | joolife.io.kr |
| 설립일 | 2026년 |

### C. 기존 코드 마이그레이션 참조

| 기존 파일 | 마이그레이션 대상 | 비고 |
|-----------|-----------------|------|
| `index.html` (237줄) | `app/page.tsx` + 5개 Landing 컴포넌트 | 한국어 카피 100% 유지 |
| `css/styles.css` (1,433줄) | `tailwind.config.ts` + `globals.css` | CSS 변수 87개 → Tailwind 토큰 |
| `js/main.js` (177줄) | React hooks + Framer Motion | IntersectionObserver → whileInView |

---

> **다음 단계**: 이 PRD를 기반으로 Phase 0 (프로젝트 셋업)부터 개발을 시작합니다.
