import { NextRequest, NextResponse } from 'next/server'
import ai from '@/lib/gemini'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompt-builder'
import type { GenerateReviewRequest, GenerateReviewResponse } from '@/types'

const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite']

function isFallbackError(err: unknown): boolean {
  const message = (err instanceof Error ? err.message : String(err)) ?? ''
  return (
    message.includes('429') ||
    message.includes('503') ||
    message.toLowerCase().includes('quota') ||
    message.toLowerCase().includes('resource has been exhausted') ||
    message.toLowerCase().includes('unavailable')
  )
}

async function generateWithFallback(body: GenerateReviewRequest): Promise<string> {
  let lastError: unknown

  for (const model of FALLBACK_MODELS) {
    try {
      const result = await ai.models.generateContent({
        model,
        contents: buildUserPrompt(body),
        config: {
          systemInstruction: buildSystemPrompt(body.platform),
          tools: [{ googleSearch: {} }],
          maxOutputTokens: 8192,
        },
      })

      const review = result.text?.trim()
      if (!review) throw new Error('Empty response')

      if (model !== FALLBACK_MODELS[0]) {
        console.info(`Fallback succeeded with model: ${model}`)
      }
      return review
    } catch (err) {
      console.warn(`Model ${model} failed:`, err instanceof Error ? err.message : String(err))
      lastError = err
      // quota 에러가 아니면 다른 모델로 시도해도 의미없으므로 즉시 throw
      if (!isFallbackError(err)) throw err
    }
  }

  throw lastError ?? new Error('모든 AI 모델에서 리뷰 생성에 실패했습니다')
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateReviewRequest = await req.json()

    if (!body.platform || !body.productName) {
      return NextResponse.json(
        { error: '플랫폼과 상품명은 필수입니다' },
        { status: 400 }
      )
    }

    const review = await generateWithFallback(body)
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
