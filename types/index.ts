export type Platform = '쿠팡' | '네이버' | '11번가' | 'G마켓' | '올리브영'

export interface ReviewFormData {
  platform: Platform
  productName: string
  category: string
  pros: string
  cons: string
  tags: string[]
}

export interface GenerateReviewRequest extends ReviewFormData {}

export interface GenerateReviewResponse {
  review: string
}

export interface ReviewHistoryItem {
  id: string
  createdAt: string
  platform: Platform
  productName: string
  category: string
  pros: string
  cons: string
  tags: string[]
  review: string
}

export const PLATFORMS: Platform[] = ['쿠팡', '네이버']

export const REVIEW_TAGS: string[] = [
  '가성비 좋은', '배송 빠른', '품질 우수한', '디자인 예쁜',
  '내구성 좋은', '사용하기 편한', '가격 대비 만족', '재구매 의사 있는',
  '포장 꼼꼼한', '사이즈 정확한',
]
