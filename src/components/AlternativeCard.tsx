'use client'

import { useState } from 'react'
import { Alternative } from '@/lib/types'

interface AlternativeCardProps {
  alternative: Alternative
  originalCalories: number
}

export default function AlternativeCard({ alternative, originalCalories }: AlternativeCardProps) {
  const [showRecipe, setShowRecipe] = useState(false)
  const caloriesSaved = originalCalories - alternative.nutrition.calories
  const percentSaved = Math.round((caloriesSaved / originalCalories) * 100)
  const isRecipe = alternative.type === 'recipe'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            {alternative.name}
          </h3>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            isRecipe
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
          }`}>
            {isRecipe ? 'Recipe' : 'Product'}
          </span>
        </div>
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

      {/* Recipe Section */}
      {isRecipe && alternative.ingredients && alternative.instructions && (
        <div className="mb-4">
          <button
            onClick={() => setShowRecipe(!showRecipe)}
            className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showRecipe ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {showRecipe ? 'Hide Recipe' : 'View Recipe'}
          </button>

          {showRecipe && (
            <div className="mt-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              {/* Ingredients */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Ingredients</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  {alternative.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-purple-600 dark:text-purple-400">{ing.amount}</span>
                      <span>{ing.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Instructions</h4>
                <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  {alternative.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="font-medium text-purple-600 dark:text-purple-400">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Buy Links */}
      {isRecipe ? (
        // Recipe: Buy ingredients link
        alternative.ingredientsBuyLink && (
          <a
            href={alternative.ingredientsBuyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white text-sm font-medium rounded-full hover:bg-purple-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Buy Ingredients on Instacart
          </a>
        )
      ) : (
        // Product: Direct buy links
        alternative.buyLinks && (
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
        )
      )}
    </div>
  )
}
