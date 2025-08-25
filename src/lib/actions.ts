'use server'

import { smartSuggestions } from '@/ai/flows/smart-suggestions'
import type { SmartSuggestionsInput, SmartSuggestionsOutput } from '@/ai/flows/smart-suggestions'
import { z } from 'zod'

const SuggestionsResponseSchema = z.object({
  success: z.boolean(),
  suggestions: z.array(z.string()).optional(),
  error: z.string().optional(),
})

type SuggestionsResponse = z.infer<typeof SuggestionsResponseSchema>

export async function getSmartSuggestions(
  input: SmartSuggestionsInput
): Promise<SuggestionsResponse> {
  try {
    const output: SmartSuggestionsOutput = await smartSuggestions(input)
    return {
      success: true,
      suggestions: output.suggestions,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred.",
    }
  }
}
