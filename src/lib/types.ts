export interface Alternative {
  name: string
  description: string
  whyHealthier: string
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
  buyLinks: {
    amazon: string
    walmart: string
    instacart: string
  }
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
