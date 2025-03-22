'use client'

import { useEffect, useState, useCallback } from 'react'
import CardGame from '@/components/game/card-game'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Deck = Database['public']['Tables']['decks']['Row']
interface CardType {
  id: string
  content: string
  pairId: string
}

export function GameUI({ deckId }: { deckId: string }) {
  const [deck, setDeck] = useState<Deck | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDeck = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('decks')
        .select('*')
        .eq('id', deckId)
        .single()

      if (error) throw error
      setDeck(data)
    } catch (error) {
      console.error('Error fetching deck:', error)
      setError('Failed to load deck')
    } finally {
      setLoading(false)
    }
  }, [deckId])

  useEffect(() => {
    void fetchDeck()
  }, [fetchDeck])

  if (loading) {
    return <div className="text-center">Loading deck...</div>
  }

  if (error || !deck) {
    return (
      <div className="text-center space-y-4">
        <p className="text-red-600">{error || 'Deck not found'}</p>
        <Link href="/decks">
          <Button>Browse Decks</Button>
        </Link>
      </div>
    )
  }

  // Transform cards to match CardType interface
  const transformedCards: CardType[] = deck.cards.map((card) => ({
    ...card,
    pairId: card.id.split('-')[0] // Assuming pairs share the same prefix before the hyphen
  }))

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{deck.title}</h1>
        <Link href="/decks">
          <Button variant="outline">Back to Decks</Button>
        </Link>
      </div>
      {deck.description && (
        <p className="text-gray-600">{deck.description}</p>
      )}
      <CardGame 
        deckId={deck.id} 
        deckTitle={deck.title}
        cards={transformedCards} 
      />
    </div>
  )
} 