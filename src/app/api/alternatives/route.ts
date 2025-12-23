import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { AlternativesResponse, Alternative, UserPreferences } from '@/lib/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

function generateProductBuyLinks(productName: string) {
  const encoded = encodeURIComponent(productName)
  return {
    amazon: `https://www.amazon.com/s?k=${encoded}`,
    walmart: `https://www.walmart.com/search?q=${encoded}`,
    instacart: `https://www.instacart.com/store/search/${encoded}`,
  }
}

function generateIngredientsBuyLink(ingredients: { name: string; amount: string }[]) {
  // Create a grocery list search query
  const ingredientNames = ingredients.map(i => i.name).join(', ')
  const encoded = encodeURIComponent(ingredientNames)
  return `https://www.instacart.com/store/search/${encoded}`
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

IMPORTANT: Each alternative should be categorized as either:
- "product": Something they can buy ready-made (e.g., "Quest Protein Chips", "Halo Top Ice Cream")
- "recipe": Something they need to cook themselves (e.g., "Cauliflower Rice Biryani")

For RECIPES, include ingredients and simple instructions.
For PRODUCTS, just include the name and description.

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
      "name": "specific product or recipe name",
      "description": "brief description",
      "whyHealthier": "why this satisfies the craving AND is healthier",
      "type": "product" or "recipe",
      "nutrition": {
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number,
        "fiber": number
      },
      "ingredients": [{"name": "ingredient", "amount": "1 cup"}],
      "instructions": ["Step 1...", "Step 2..."]
    }
  ]
}

Notes:
- Only include "ingredients" and "instructions" for type="recipe"
- For products, make them specific brands/items that are actually purchasable
- Mix of 2 products and 2 recipes is ideal
- Nutrition values should be realistic estimates per typical serving size.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
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

    // Add appropriate buy links based on type
    data.alternatives = data.alternatives.map((alt: Alternative) => {
      if (alt.type === 'product') {
        return {
          ...alt,
          buyLinks: generateProductBuyLinks(alt.name),
        }
      } else {
        // Recipe - generate ingredients buy link
        return {
          ...alt,
          ingredientsBuyLink: alt.ingredients
            ? generateIngredientsBuyLink(alt.ingredients)
            : undefined,
        }
      }
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to get alternatives' },
      { status: 500 }
    )
  }
}
