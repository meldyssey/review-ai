---
name: build-openai-api
description: review-ai의 OpenAI API 통합을 구현한다. Next.js API 라우트(/api/generate-review), OpenAI 클라이언트 싱글톤, 플랫폼별 프롬프트 빌더, localStorage 히스토리 유틸리티를 포함한다.
---

# OpenAI API 통합 구현

## 생성할 파일

```
app/api/generate-review/route.ts
lib/openai.ts
lib/prompt-builder.ts
lib/review-history.ts
```

## lib/openai.ts — 클라이언트 싱글톤

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default openai
```

## lib/prompt-builder.ts — 플랫폼별 프롬프트 구성

```typescript
import type { GenerateReviewRequest } from '@/types'

const PLATFORM_STYLE: Record<string, string> = {
  '쿠팡': '간결하고 핵심 위주로, 별점과 함께 쓰기 좋은 스타일',
  '네이버': '상세하고 감성적이며, 스토리텔링 방식',
  '11번가': '솔직하고 직관적인 스타일',
  'G마켓': '실용적이고 정보 중심적인 스타일',
  '올리브영': '트렌디하고 감성적인 뷰티/라이프스타일 스타일',
}

export function buildSystemPrompt(platform: string): string {
  const style = PLATFORM_STYLE[platform] ?? '자연스럽고 솔직한 스타일'
  return `당신은 ${platform}에서 실제로 상품을 구매한 고객입니다. 
${style}로 리뷰를 작성하세요.
- 200~400자 이내로 작성합니다
- 사용자가 제공한 정보만 바탕으로 작성하고, 없는 내용을 지어내지 않습니다
- 자연스러운 구어체를 사용합니다
- 이모지는 1~2개만 적절히 사용합니다`
}

export function buildUserPrompt(data: GenerateReviewRequest): string {
  const parts: string[] = []

  parts.push(`상품: ${data.productName}`)
  if (data.category) parts.push(`카테고리: ${data.category}`)
  if (data.pros) parts.push(`좋은 점: ${data.pros}`)
  if (data.cons) parts.push(`아쉬운 점: ${data.cons}`)
  if (data.tags.length > 0) parts.push(`태그: ${data.tags.join(', ')}`)

  return `다음 정보를 바탕으로 ${data.platform} 리뷰를 작성해주세요:\n\n${parts.join('\n')}`
}
```

## app/api/generate-review/route.ts — API 라우트

```typescript
import { NextRequest, NextResponse } from 'next/server'
import openai from '@/lib/openai'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompt-builder'
import type { GenerateReviewRequest, GenerateReviewResponse } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body: GenerateReviewRequest = await req.json()

    if (!body.platform || !body.productName) {
      return NextResponse.json(
        { error: '플랫폼과 상품명은 필수입니다' },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: buildSystemPrompt(body.platform) },
        { role: 'user', content: buildUserPrompt(body) },
      ],
      max_tokens: 600,
      temperature: 0.8,
    })

    const review = completion.choices[0]?.message?.content?.trim()

    if (!review) {
      return NextResponse.json({ error: '리뷰를 생성할 수 없습니다' }, { status: 500 })
    }

    const response: GenerateReviewResponse = { review }
    return NextResponse.json(response)
  } catch (err) {
    console.error('Review generation error:', err)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
```

## lib/review-history.ts — localStorage 유틸리티

```typescript
import type { ReviewHistoryItem, Platform } from '@/types'

const STORAGE_KEY = 'review-ai-history'
const MAX_ITEMS = 20

export function getReviewHistory(): ReviewHistoryItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveReviewToHistory(data: {
  platform: Platform
  productName: string
  review: string
}): ReviewHistoryItem[] {
  const history = getReviewHistory()
  const newItem: ReviewHistoryItem = {
    id: Date.now().toString(),
    createdAt: new Date().toLocaleDateString('ko-KR'),
    platform: data.platform,
    productName: data.productName,
    review: data.review,
  }

  const updated = [newItem, ...history].slice(0, MAX_ITEMS)

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // localStorage 용량 초과 등 무시
  }

  return updated
}
```

## 환경 변수

`.env.local` 파일에 반드시 추가:
```
OPENAI_API_KEY=sk-...
```

## 주의 사항
- `lib/openai.ts`는 서버 전용이다 — 클라이언트 컴포넌트에서 import하지 않는다
- `lib/review-history.ts`는 클라이언트 전용이다 (`typeof window === 'undefined'` 가드 포함)
- API 라우트는 `OPENAI_API_KEY`가 없으면 OpenAI 초기화 시 에러가 발생한다
