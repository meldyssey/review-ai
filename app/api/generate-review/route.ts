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

    const completion = await openai.responses.create({
      model: 'gpt-5-nano-2025-08-07',
      instructions: buildSystemPrompt(body.platform),
      input: buildUserPrompt(body),
      max_output_tokens: 20000,
      tools: [{ type: 'web_search_preview' }],
    })

    const review = completion.output_text?.trim()
    if (!review) {
      console.error('Empty content from OpenAI:', JSON.stringify(completion.output))
      return NextResponse.json({ error: '리뷰를 생성할 수 없습니다' }, { status: 500 })
    }

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
