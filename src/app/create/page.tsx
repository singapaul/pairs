'use client'

import { CreateDeckForm } from '@/components/deck/create-deck-form'

export default function CreateDeckPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Create New Deck</h1>
      <p className="text-gray-600">
        Create a new deck of cards for the memory game. Add pairs of cards that players will need to match.
      </p>
      <CreateDeckForm />
    </div>
  )
} 