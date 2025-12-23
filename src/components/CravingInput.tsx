'use client'

import { useState } from 'react'

interface CravingInputProps {
  onSubmit: (craving: string) => void
  isLoading: boolean
}

export default function CravingInput({ onSubmit, isLoading }: CravingInputProps) {
  const [craving, setCraving] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (craving.trim()) {
      onSubmit(craving.trim())
    }
  }

  const suggestions = [
    'Lays chips',
    'Ice cream',
    'Soda',
    'French fries',
    'Chocolate bar',
    'Pizza',
  ]

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={craving}
          onChange={(e) => setCraving(e.target.value)}
          placeholder="What are you craving? (e.g., Lays chips, ice cream...)"
          className="w-full px-6 py-4 text-lg rounded-full border-2 border-green-200 focus:border-green-500 focus:outline-none shadow-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !craving.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Finding...' : 'Find Alternatives'}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">Try:</span>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setCraving(suggestion)}
            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors dark:bg-green-900 dark:text-green-300"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
