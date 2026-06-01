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
