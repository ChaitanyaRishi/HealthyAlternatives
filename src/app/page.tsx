'use client'

import { useState, useEffect } from 'react'
import CravingInput from '@/components/CravingInput'
import ResultsDisplay from '@/components/ResultsDisplay'
import PreferencesModal from '@/components/PreferencesModal'
import { AlternativesResponse, UserPreferences } from '@/lib/types'

const DEFAULT_PREFERENCES: UserPreferences = {
  dietaryRestrictions: [],
  allergies: [],
  goals: [],
}

export default function Home() {
  const [results, setResults] = useState<AlternativesResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES)

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('healthyAlternativesPrefs')
    if (saved) {
      setPreferences(JSON.parse(saved))
    }
  }, [])

  // Save preferences to localStorage
  const handleSavePreferences = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs)
    localStorage.setItem('healthyAlternativesPrefs', JSON.stringify(newPrefs))
  }

  const handleSearch = async (craving: string) => {
    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/alternatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ craving, preferences }),
      })

      if (!response.ok) {
        throw new Error('Failed to get alternatives')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const hasPreferences =
    preferences.dietaryRestrictions.length > 0 ||
    preferences.allergies.length > 0 ||
    preferences.goals.length > 0

  return (
    <main className="min-h-screen py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
          Healthy Alternatives
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Craving something? Find healthier options that satisfy the same craving.
        </p>
      </div>

      {/* Preferences Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setShowPreferences(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            hasPreferences
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {hasPreferences ? 'Preferences Set' : 'Set Preferences'}
        </button>
      </div>

      {/* Search Input */}
      <CravingInput onSubmit={handleSearch} isLoading={isLoading} />

      {/* Error Display */}
      {error && (
        <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center mt-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Finding healthier alternatives...
          </p>
        </div>
      )}

      {/* Results */}
      {results && <ResultsDisplay results={results} />}

      {/* Preferences Modal */}
      <PreferencesModal
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        preferences={preferences}
        onSave={handleSavePreferences}
      />
    </main>
  )
}
