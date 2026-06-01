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
