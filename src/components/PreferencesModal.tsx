'use client'

import { useState, useEffect } from 'react'
import { UserPreferences } from '@/lib/types'

interface PreferencesModalProps {
  isOpen: boolean
  onClose: () => void
  preferences: UserPreferences
  onSave: (preferences: UserPreferences) => void
}

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-free',
  'Dairy-free',
  'Keto',
  'Low-carb',
  'Paleo',
  'Whole30',
]

const ALLERGY_OPTIONS = [
  'Peanuts',
  'Tree nuts',
  'Milk',
  'Eggs',
  'Wheat',
  'Soy',
  'Fish',
  'Shellfish',
]

const GOAL_OPTIONS = [
  'Weight loss',
  'Muscle gain',
  'More energy',
  'Better digestion',
  'Heart health',
  'Lower sugar',
  'More protein',
]

export default function PreferencesModal({
  isOpen,
  onClose,
  preferences,
  onSave,
}: PreferencesModalProps) {
  const [localPrefs, setLocalPrefs] = useState<UserPreferences>(preferences)

  useEffect(() => {
    setLocalPrefs(preferences)
  }, [preferences])

  if (!isOpen) return null

  const toggleItem = (
    category: keyof UserPreferences,
    item: string
  ) => {
    setLocalPrefs((prev) => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter((i) => i !== item)
        : [...prev[category], item],
    }))
  }

  const handleSave = () => {
    onSave(localPrefs)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Your Preferences
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Dietary Restrictions */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
              Dietary Restrictions
            </h3>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleItem('dietaryRestrictions', option)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    localPrefs.dietaryRestrictions.includes(option)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
              Allergies
            </h3>
            <div className="flex flex-wrap gap-2">
              {ALLERGY_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleItem('allergies', option)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    localPrefs.allergies.includes(option)
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
              Health Goals
            </h3>
            <div className="flex flex-wrap gap-2">
              {GOAL_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleItem('goals', option)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    localPrefs.goals.includes(option)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  )
}
