# 작업 요약

## 프로젝트 개요

사용자가 상품 정보와 좋은 점/아쉬운 점을 입력하면 AI가 완성된 쇼핑몰 리뷰를 생성해주는 Next.js 웹 앱.

- **플랫폼**: 쿠팡, 네이버
- **AI 모델**: OpenAI gpt-5-nano-2025-08-07
- **저장**: 로컬스토리지 (최대 20개)

---

## 기술 스택

| 항목 | 선택 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 언어 | TypeScript (strict) |
| 스타일 | Tailwind CSS + shadcn/ui |
| AI | OpenAI SDK v4 |
| 상태 관리 | React useState (서버 상태 없음) |
| 데이터 저장 | localStorage |

---

## 프로젝트 구조

```
review-ai/
├── app/
│   ├── api/generate-review/route.ts   ← OpenAI API 라우트
│   ├── globals.css                    ← shadcn CSS 변수
│   ├── layout.tsx
│   └── page.tsx                       ← 메인 페이지 (상태 관리)
├── components/
│   ├── ui/                            ← shadcn 자동 생성 컴포넌트
│   ├── PlatformSelector.tsx           ← 플랫폼 선택 버튼
│   ├── ProductForm.tsx                ← 상품명/카테고리 입력
│   ├── ReviewInput.tsx                ← 좋은 점/아쉬운 점 입력
│   ├── TagSelector.tsx                ← 태그 멀티 선택
│   ├── ReviewResult.tsx               ← 생성된 리뷰 + 복사 버튼
│   └── ReviewHistory.tsx              ← 이전 리뷰 목록
├── lib/
│   ├── openai.ts                      ← OpenAI 클라이언트 싱글톤
│   ├── prompt-builder.ts              ← 플랫폼별 프롬프트 생성
│   ├── review-history.ts              ← localStorage 유틸리티
│   └── utils.ts                       ← shadcn cn 헬퍼
├── types/
│   └── index.ts                       ← 공통 타입 정의
└── docs/
    ├── project-brief.md
    └── work-summary.md (이 파일)
```

---

## 하네스 구성 (.claude/)

에이전트 4명 + 스킬 4개로 구성된 자동화 빌드 시스템.

### 에이전트

| 에이전트 | 역할 |
|---------|------|
| `scaffolder` | Next.js 프로젝트 초기화, shadcn 설치 |
| `ui-builder` | React 컴포넌트 구현 |
| `ai-builder` | OpenAI API 라우트 + 프롬프트 엔지니어링 |
| `qa-validator` | 경계면 교차 비교 검증 |

### 스킬

| 스킬 | 역할 |
|------|------|
| `orchestrate-review-ai` | 전체 빌드 오케스트레이터 |
| `scaffold-nextjs-project` | 스캐폴딩 가이드 |
| `build-review-form-ui` | UI 컴포넌트 가이드 |
| `build-openai-api` | AI 통합 가이드 |

### 실행 순서 (하이브리드 모드)

```
Phase 1: scaffolder (순차)
Phase 2: ui-builder + ai-builder (병렬)
Phase 3: qa-validator (순차)
```

---

## 주요 작업 이력

### 하네스 구성
- `docs/project-brief.md` 기반으로 에이전트/스킬 설계 및 생성
- shadcn/ui 추가 요청으로 scaffold 스킬, UI 스킬, scaffolder 에이전트 업데이트

### 앱 구현
- 오케스트레이터가 에이전트 3단계로 자동 구현
- TypeScript 타입 검사 통과 (tsc --noEmit 0 errors)

### 버그 수정
- `next.config.ts` → `next.config.mjs` 변경 (Next.js 14는 ts 설정 미지원)
- `max_completion_tokens` 600 → 10000 상향 (gpt-5-nano reasoning 토큰 부족 문제)

### 기타 변경
- `ReviewInput` 라벨 "개선점" → "아쉬운 점" 변경
- `PLATFORMS` 배열을 `types/index.ts`에서 직접 수정 (쿠팡, 네이버만 표시)

---

## 로컬 실행 방법

```bash
cp .env.local.example .env.local
# .env.local에 OPENAI_API_KEY 입력

npm install
npm run dev
# http://localhost:3000
```

---

## 환경 변수

| 변수 | 설명 |
|------|------|
| `OPENAI_API_KEY` | OpenAI API 키 (필수) |
