import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { AlternativesResponse, UserPreferences } from '@/lib/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

function generateBuyLinks(productName: string) {
  const encoded = encodeURIComponent(productName)
  return {
    amazon: `https://www.amazon.com/s?k=${encoded}`,
    walmart: `https://www.walmart.com/search?q=${encoded}`,
    instacart: `https://www.instacart.com/store/search/${encoded}`,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { craving, preferences } = await request.json() as {
      craving: string
      preferences?: UserPreferences
    }

    if (!craving) {
      return NextResponse.json({ error: 'Craving is required' }, { status: 400 })
    }

    const preferencesContext = preferences
      ? `
User's dietary preferences:
- Dietary restrictions: ${preferences.dietaryRestrictions.join(', ') || 'None'}
- Allergies: ${preferences.allergies.join(', ') || 'None'}
- Health goals: ${preferences.goals.join(', ') || 'General health'}
`
      : ''

    const prompt = `You are a nutrition expert helping someone find healthier alternatives to their food cravings.

The user is craving: "${craving}"
${preferencesContext}

Provide 4 healthier alternatives that satisfy the same craving (similar taste, texture, or experience).

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks, just the raw JSON object.

Return this exact JSON structure:
{
  "original": "the food they're craving",
  "originalNutrition": {
    "calories": number (per typical serving),
    "protein": number (grams),
    "carbs": number (grams),
    "fat": number (grams),
    "fiber": number (grams)
  },
  "alternatives": [
    {
      "name": "specific product or food name",
      "description": "brief description of what it is",
      "whyHealthier": "why this satisfies the craving AND is healthier",
      "nutrition": {
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number,
        "fiber": number
      }
    }
  ]
}

Make alternatives specific and purchasable (e.g., "Baked kale chips" not just "vegetables").
Nutrition values should be realistic estimates per typical serving size.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : ''

    // Parse the JSON response
    const data = JSON.parse(responseText) as AlternativesResponse

    // Add buy links to each alternative
    data.alternatives = data.alternatives.map(alt => ({
      ...alt,
      buyLinks: generateBuyLinks(alt.name),
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to get alternatives' },
      { status: 500 }
    )
  }
}
