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
