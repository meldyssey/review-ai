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

type HistoryData = {
  platform: Platform
  productName: string
  category: string
  pros: string
  cons: string
  tags: string[]
  review: string
}

function persist(items: ReviewHistoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // localStorage 용량 초과 등 무시
  }
}

export function saveReviewToHistory(data: HistoryData): ReviewHistoryItem[] {
  const history = getReviewHistory()
  const newItem: ReviewHistoryItem = {
    id: Date.now().toString(),
    createdAt: new Date().toLocaleDateString('ko-KR'),
    ...data,
  }
  const updated = [newItem, ...history].slice(0, MAX_ITEMS)
  persist(updated)
  return updated
}

export function updateReviewTextInHistory(id: string, review: string): ReviewHistoryItem[] {
  const history = getReviewHistory()
  const updated = history.map(item => item.id === id ? { ...item, review } : item)
  persist(updated)
  return updated
}
