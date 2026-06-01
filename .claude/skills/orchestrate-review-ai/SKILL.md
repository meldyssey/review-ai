---
name: orchestrate-review-ai
description: review-ai Next.js 앱을 처음부터 완성까지 구현한다. "앱 만들어줘", "구현 시작", "개발 시작", "review-ai 개발", "리뷰 앱 만들어줘", "처음부터 구현", "다시 실행", "재실행", "업데이트", "특정 부분만 다시 구현" 요청 시 이 스킬을 사용하라. scaffolder → ui-builder + ai-builder 병렬 → qa-validator 순서로 에이전트를 조율한다.
---

# Review AI 앱 오케스트레이터

## 실행 모드: 하이브리드
- Phase 1 (스캐폴딩): 단일 서브 에이전트 (scaffolder)
- Phase 2 (구현): ui-builder + ai-builder 병렬 서브 에이전트
- Phase 3 (QA): 단일 서브 에이전트 (qa-validator)

## Phase 0: 컨텍스트 확인

워크플로우 시작 전 기존 구현 상태를 확인한다:

1. `package.json` 존재 여부 확인
2. `app/`, `components/`, `lib/` 디렉토리 존재 여부 확인
3. 사용자 요청 유형 파악:
   - **초기 실행**: 파일이 없거나 "처음부터" 요청 → Phase 1부터 전체 실행
   - **부분 수정**: "UI만", "API만", "특정 컴포넌트만" 요청 → 해당 Phase만 실행
   - **재실행**: "다시", "업데이트" 요청 + 기존 파일 있음 → 사용자에게 전체/부분 재실행 확인

## Phase 1: 스캐폴딩
**실행 모드:** 단일 서브 에이전트

scaffolder 에이전트를 호출한다:

```
Agent(
  subagent_type: "general-purpose",
  model: "opus",
  prompt: """
    .claude/agents/scaffolder.md 에이전트 정의와
    .claude/skills/scaffold-nextjs-project/SKILL.md 스킬을 읽고,
    /Users/jeongyun/Projects/review-ai 디렉토리에
    Next.js 프로젝트 파일들을 생성하라.
    완료 후 생성한 파일 목록을 보고하라.
  """
)
```

scaffolder 완료 확인 후 Phase 2로 진행.

## Phase 2: 병렬 구현
**실행 모드:** 병렬 서브 에이전트

ui-builder와 ai-builder를 동시에 실행한다:

```
# 동시 실행
Agent(
  subagent_type: "general-purpose",
  model: "opus",
  run_in_background: true,
  prompt: """
    .claude/agents/ui-builder.md 에이전트 정의와
    .claude/skills/build-review-form-ui/SKILL.md 스킬을 읽고,
    /Users/jeongyun/Projects/review-ai 에 모든 React 컴포넌트를 구현하라.
    스킬에 정의된 코드를 그대로 사용하되, 필요한 경우 개선하라.
    완료 후 생성한 파일 목록을 보고하라.
  """
)

Agent(
  subagent_type: "general-purpose",
  model: "opus",
  run_in_background: true,
  prompt: """
    .claude/agents/ai-builder.md 에이전트 정의와
    .claude/skills/build-openai-api/SKILL.md 스킬을 읽고,
    /Users/jeongyun/Projects/review-ai 에 OpenAI 통합 파일들을 구현하라.
    스킬에 정의된 코드를 그대로 사용하되, 필요한 경우 개선하라.
    완료 후 생성한 파일 목록을 보고하라.
  """
)
```

두 에이전트가 모두 완료될 때까지 대기 후 Phase 3으로 진행.

## Phase 3: QA 검증
**실행 모드:** 단일 서브 에이전트

```
Agent(
  subagent_type: "general-purpose",
  model: "opus",
  prompt: """
    .claude/agents/qa-validator.md 에이전트 정의를 읽고,
    /Users/jeongyun/Projects/review-ai 의 구현을 검증하라.
    경계면 교차 비교(API 응답 타입 vs UI 타입)를 포함하여 검증하라.
    발견된 문제를 Critical/Warning/Info로 분류하여 보고하라.
  """
)
```

## Phase 4: 완료 보고

사용자에게 다음을 보고한다:
1. 생성된 파일 전체 목록
2. QA 검증 결과 요약
3. 실행 방법:
   ```
   cd /Users/jeongyun/Projects/review-ai
   cp .env.local.example .env.local
   # .env.local에 OPENAI_API_KEY 입력
   npm install
   npm run dev
   ```
4. Critical 문제가 있으면 수정 방법 안내

## 에러 핸들링

- scaffolder 실패 → 실패 이유와 함께 중단, 사용자에게 보고
- ui-builder 실패 → ai-builder 결과는 유지, 실패 부분 명시 후 계속
- ai-builder 실패 → ui-builder 결과는 유지, 실패 부분 명시 후 계속  
- QA에서 Critical 발견 → 수정 제안과 함께 사용자에게 보고 (자동 수정하지 않음)

## 테스트 시나리오

**정상 흐름:**
- "review-ai 앱 만들어줘" → Phase 0에서 신규 확인 → Phase 1~4 순서대로 실행

**에러 흐름:**
- scaffolder가 일부 파일 생성 실패 → 실패 파일 목록 명시 후 Phase 2 진행 여부 사용자 확인

**후속 작업:**
- "UI 컴포넌트만 다시 만들어줘" → Phase 0에서 부분 수정 감지 → Phase 2(ui-builder만) 실행
- "OpenAI 프롬프트 수정해줘" → Phase 2(ai-builder만) 실행
