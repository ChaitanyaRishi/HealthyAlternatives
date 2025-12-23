'use client'

import { Alternative } from '@/lib/types'

interface AlternativeCardProps {
  alternative: Alternative
  originalCalories: number
}

export default function AlternativeCard({ alternative, originalCalories }: AlternativeCardProps) {
  const caloriesSaved = originalCalories - alternative.nutrition.calories
  const percentSaved = Math.round((caloriesSaved / originalCalories) * 100)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          {alternative.name}
        </h3>
        {caloriesSaved > 0 && (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full dark:bg-green-900 dark:text-green-300">
            -{percentSaved}% cal
          </span>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-3">
        {alternative.description}
      </p>

      <p className="text-green-600 dark:text-green-400 text-sm mb-4">
        {alternative.whyHealthier}
      </p>

      {/* Nutrition Grid */}
      <div className="grid grid-cols-5 gap-2 mb-4 text-center">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
          <div className="text-lg font-bold text-gray-800 dark:text-white">
            {alternative.nutrition.calories}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">cal</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
          <div className="text-lg font-bold text-blue-600">{alternative.nutrition.protein}g</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">protein</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
          <div className="text-lg font-bold text-orange-600">{alternative.nutrition.carbs}g</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">carbs</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
          <div className="text-lg font-bold text-yellow-600">{alternative.nutrition.fat}g</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">fat</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
          <div className="text-lg font-bold text-green-600">{alternative.nutrition.fiber}g</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">fiber</div>
        </div>
      </div>

      {/* Buy Links */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-sm text-gray-500 dark:text-gray-400">Buy:</span>
        <a
          href={alternative.buyLinks.amazon}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          Amazon
        </a>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <a
          href={alternative.buyLinks.walmart}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          Walmart
        </a>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <a
          href={alternative.buyLinks.instacart}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          Instacart
        </a>
      </div>
    </div>
  )
}
