export interface Ingredient {
  name: string
  amount: string
}

export interface Alternative {
  name: string
  description: string
  whyHealthier: string
  type: 'product' | 'recipe'
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
  // For products - direct buy links
  buyLinks?: {
    amazon: string
    walmart: string
    instacart: string
  }
  // For recipes - ingredients and instructions
  ingredients?: Ingredient[]
  instructions?: string[]
  ingredientsBuyLink?: string
}

export interface AlternativesResponse {
  original: string
  originalNutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
  alternatives: Alternative[]
}

export interface UserPreferences {
  dietaryRestrictions: string[]
  allergies: string[]
  goals: string[]
}
