import { NextRequest, NextResponse } from 'next/server'
import ai from '@/lib/gemini'
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

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: buildUserPrompt(body),
      config: {
        systemInstruction: buildSystemPrompt(body.platform),
        tools: [{ googleSearch: {} }],
        maxOutputTokens: 8192,
      },
    })

    const review = result.text?.trim()
    if (!review) {
      console.error('Empty content from Gemini:', JSON.stringify(result))
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
