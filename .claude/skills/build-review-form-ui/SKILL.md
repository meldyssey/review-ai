---
name: build-review-form-ui
description: review-ai의 React/Next.js UI 컴포넌트를 shadcn/ui 기반으로 구현한다. 플랫폼 선택, 상품 정보 입력, 좋은점/개선점 텍스트에어리어, 태그 선택, AI 리뷰 결과 표시, 복사 버튼, 이전 리뷰 히스토리 컴포넌트를 포함한다.
---

# Review Form UI 구현 (shadcn/ui)

## 전제 조건

scaffolder가 `npx shadcn@latest add button input textarea card badge label`을 실행하여
`components/ui/` 아래에 shadcn 컴포넌트들이 이미 존재한다고 가정한다.

## 컴포넌트 구조

```
app/page.tsx                  ← 모든 상태 관리, 컴포넌트 조합
components/
  PlatformSelector.tsx        ← Button (variant) 기반 플랫폼 선택
  ProductForm.tsx             ← Input + Label 기반 폼
  ReviewInput.tsx             ← Textarea + Label 기반 입력
  TagSelector.tsx             ← Button (toggle) 기반 태그 선택
  ReviewResult.tsx            ← Card + Button(복사) 기반 결과 표시
  ReviewHistory.tsx           ← Card + Badge 기반 히스토리 목록
  ui/                         ← shadcn 자동 생성 (수정 금지)
```

## app/page.tsx — 메인 상태 관리

```typescript
'use client'

import { useState, useEffect } from 'react'
import PlatformSelector from '@/components/PlatformSelector'
import ProductForm from '@/components/ProductForm'
import ReviewInput from '@/components/ReviewInput'
import TagSelector from '@/components/TagSelector'
import ReviewResult from '@/components/ReviewResult'
import ReviewHistory from '@/components/ReviewHistory'
import { Button } from '@/components/ui/button'
import type { Platform, ReviewHistoryItem } from '@/types'
import { PLATFORMS } from '@/types'
import { getReviewHistory, saveReviewToHistory } from '@/lib/review-history'

export default function Home() {
  const [platform, setPlatform] = useState<Platform>('쿠팡')
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [generatedReview, setGeneratedReview] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<ReviewHistoryItem[]>([])

  useEffect(() => {
    setHistory(getReviewHistory())
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productName.trim() || (!pros.trim() && !cons.trim())) return

    setIsLoading(true)
    setGeneratedReview('')

    try {
      const res = await fetch('/api/generate-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, productName, category, pros, cons, tags }),
      })

      if (!res.ok) throw new Error('리뷰 생성에 실패했습니다')

      const data = await res.json()
      setGeneratedReview(data.review)

      const updated = saveReviewToHistory({ platform, productName, review: data.review })
      setHistory(updated)
    } catch (err) {
      alert(err instanceof Error ? err.message : '오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AI 리뷰 작성기</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <PlatformSelector
          platforms={PLATFORMS}
          selected={platform}
          onChange={setPlatform}
        />
        <ProductForm
          productName={productName}
          category={category}
          onProductNameChange={setProductName}
          onCategoryChange={setCategory}
        />
        <ReviewInput
          pros={pros}
          cons={cons}
          onProsChange={setPros}
          onConsChange={setCons}
        />
        <TagSelector selectedTags={tags} onChange={setTags} />
        <Button
          type="submit"
          disabled={isLoading || !productName.trim()}
          className="w-full"
        >
          {isLoading ? '리뷰 생성 중...' : '리뷰 생성하기'}
        </Button>
      </form>

      {generatedReview && (
        <div className="mt-6">
          <ReviewResult review={generatedReview} />
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8">
          <ReviewHistory items={history} />
        </div>
      )}
    </main>
  )
}
```

## PlatformSelector.tsx

```typescript
import { Button } from '@/components/ui/button'
import type { Platform } from '@/types'

interface Props {
  platforms: Platform[]
  selected: Platform
  onChange: (p: Platform) => void
}

export default function PlatformSelector({ platforms, selected, onChange }: Props) {
  return (
    <div>
      <p className="text-sm font-medium mb-2">플랫폼 선택</p>
      <div className="flex flex-wrap gap-2">
        {platforms.map((p) => (
          <Button
            key={p}
            type="button"
            variant={selected === p ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => onChange(p)}
          >
            {p}
          </Button>
        ))}
      </div>
    </div>
  )
}
```

## ProductForm.tsx

```typescript
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  productName: string
  category: string
  onProductNameChange: (v: string) => void
  onCategoryChange: (v: string) => void
}

export default function ProductForm({ productName, category, onProductNameChange, onCategoryChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="productName">상품명 *</Label>
        <Input
          id="productName"
          value={productName}
          onChange={(e) => onProductNameChange(e.target.value)}
          placeholder="예: 삼성 갤럭시 버즈2"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="category">카테고리</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          placeholder="예: 무선이어폰"
        />
      </div>
    </div>
  )
}
```

## ReviewInput.tsx

```typescript
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface Props {
  pros: string
  cons: string
  onProsChange: (v: string) => void
  onConsChange: (v: string) => void
}

export default function ReviewInput({ pros, cons, onProsChange, onConsChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="pros">좋은 점</Label>
        <Textarea
          id="pros"
          value={pros}
          onChange={(e) => onProsChange(e.target.value)}
          placeholder="사용해보면서 좋았던 점을 자유롭게 작성하세요"
          rows={3}
          className="resize-none"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cons">아쉬운 점</Label>
        <Textarea
          id="cons"
          value={cons}
          onChange={(e) => onConsChange(e.target.value)}
          placeholder="아쉬웠던 점이나 개선되었으면 하는 점을 작성하세요"
          rows={3}
          className="resize-none"
        />
      </div>
    </div>
  )
}
```

## TagSelector.tsx

```typescript
import { Button } from '@/components/ui/button'
import { REVIEW_TAGS } from '@/types'

interface Props {
  selectedTags: string[]
  onChange: (tags: string[]) => void
}

export default function TagSelector({ selectedTags, onChange }: Props) {
  const toggle = (tag: string) => {
    onChange(
      selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag]
    )
  }

  return (
    <div>
      <p className="text-sm font-medium mb-2">태그 선택 (선택사항)</p>
      <div className="flex flex-wrap gap-2">
        {REVIEW_TAGS.map((tag) => (
          <Button
            key={tag}
            type="button"
            variant={selectedTags.includes(tag) ? 'secondary' : 'outline'}
            size="sm"
            className="rounded-full text-xs"
            onClick={() => toggle(tag)}
          >
            {tag}
          </Button>
        ))}
      </div>
    </div>
  )
}
```

## ReviewResult.tsx

```typescript
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Props {
  review: string
}

export default function ReviewResult({ review }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(review)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">생성된 리뷰</CardTitle>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? '복사됨 ✓' : '복사'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{review}</p>
      </CardContent>
    </Card>
  )
}
```

## ReviewHistory.tsx

```typescript
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ReviewHistoryItem } from '@/types'

interface Props {
  items: ReviewHistoryItem[]
}

export default function ReviewHistory({ items }: Props) {
  return (
    <div>
      <h2 className="text-base font-semibold mb-3">이전 리뷰</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="secondary">{item.platform}</Badge>
                <span className="text-sm font-medium">{item.productName}</span>
                <span className="text-xs text-muted-foreground ml-auto">{item.createdAt}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.review}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```
