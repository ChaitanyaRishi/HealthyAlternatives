'use client'

import { AlternativesResponse } from '@/lib/types'
import AlternativeCard from './AlternativeCard'

interface ResultsDisplayProps {
  results: AlternativesResponse
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      {/* Original Food Info */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300">
              Your craving
            </h2>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {results.original}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-red-500">
              {results.originalNutrition.calories}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              calories/serving
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Protein: {results.originalNutrition.protein}g</span>
          <span>Carbs: {results.originalNutrition.carbs}g</span>
          <span>Fat: {results.originalNutrition.fat}g</span>
          <span>Fiber: {results.originalNutrition.fiber}g</span>
        </div>
      </div>

      {/* Alternatives Header */}
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Healthier Alternatives
      </h2>

      {/* Alternatives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.alternatives.map((alternative, index) => (
          <AlternativeCard
            key={index}
            alternative={alternative}
            originalCalories={results.originalNutrition.calories}
          />
        ))}
      </div>
    </div>
  )
}
