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
      model: 'gpt-5-nano-2025-08-07',
      messages: [
        { role: 'system', content: buildSystemPrompt(body.platform) },
        { role: 'user', content: buildUserPrompt(body) },
      ],
      max_completion_tokens: 4000,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      console.error('Empty content from OpenAI:', JSON.stringify(completion.choices[0]))
      return NextResponse.json({ error: '리뷰를 생성할 수 없습니다' }, { status: 500 })
    }
    const review = content.trim()

    const response: GenerateReviewResponse = { review }
    return NextResponse.json(response)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Review generation error:', message)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
