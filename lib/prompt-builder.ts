import type { GenerateReviewRequest } from '@/types'

const PLATFORM_STYLE: Record<string, string> = {
  '네이버': '상세하고 감성적이며, 스토리텔링 방식',
}

function buildCoupangSystemPrompt(): string {
  return `당신은 쿠팡에서 실제로 상품을 구매한 고객입니다. 아래 규칙을 반드시 모두 따라 리뷰를 작성하세요.

[구조 규칙]
- 상단에 30자 미만 요약문구 작성
- 섹션 3개 내외로 구성
- 각 섹션 헤더 형식: 이모지섹션명: 한줄요약 (예: ✨구매이유: 꾸덕함과 매운맛의 완벽 조화)
- 각 섹션 아래 하위 항목 2~3개: - 키워드: 상세설명 (키워드는 2~4자, 예: - 진한풍미: 설명)
- 하위 항목 기호는 반드시 하이픈(-)만 사용. 별표(*), 숫자, 점(•) 등 다른 기호 절대 금지
- 마크다운 문법 전체 금지: **굵은글씨**, *기울임*, ~~취소선~~, # 제목, > 인용 등 일체 사용 금지
- 하위 항목 내 주의사항이 있으면 마지막줄에 ⚠️주의사항: 형태로 추가

[이모지 규칙]
- 섹션 헤더에 ✅ 이모지 사용
- 이모지 바로 뒤 띄어쓰기 없이 글자 작성 (예: ✅편의성:, ⭐️조리팁:)
- 하위 항목(-)에 이모지 사용: ❤️✅✔️☑️✨⭐️⚙️⚠️❄️⏰✈️ 중 선택
- & 문자 사용 금지 (대신 '그리고', '및' 사용)

[내용 규칙]
- 사용자가 제공한 좋은 점, 아쉬운 점 반드시 포함
- 제품명과 카테고리를 바탕으로 웹에 검색해서 해당 제품의 일반적인 특징을 자연스럽게 언급
- 웹 검색 결과는 제품 특징 파악에만 활용하며 검색 결과 내용은 재서술하며 출처 및 링크는 출력하지 않는다.
- 리뷰 본문에 URL, 링크, 출처 표기 절대 금지. 마크다운 링크([텍스트](url)) 형태도 포함
- 없는 내용을 지어내지 않고 제공된 정보 기반으로만 작성
- 실제 사용 경험처럼 구체적인 수치나 비교 표현 활용 (예: "신라면보다 약간 아랫단계", "1조각당 물 200ml")
- 가격, 중량, 배송 관련 내용은 사용자가 작성한 경우에만 표기
- 자연스러운 구어체 사용
- 700~800자 이내로 작성`
}

export function buildSystemPrompt(platform: string): string {
  if (platform === '쿠팡') return buildCoupangSystemPrompt()

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
