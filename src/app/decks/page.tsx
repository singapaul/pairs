'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

type Deck = Database['public']['Tables']['decks']['Row']

export default function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDecks()
  }, [])

  const fetchDecks = async () => {
    try {
      const { data, error } = await supabase
        .from('decks')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDecks(data || [])
    } catch (error) {
      console.error('Error fetching decks:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center">Loading decks...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Available Decks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <Card key={deck.id} className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">{deck.title}</h2>
            {deck.description && (
              <p className="text-gray-600">{deck.description}</p>
            )}
            <div className="text-sm text-gray-500">
              {deck.cards.length / 2} pairs
            </div>
            <Link href={`/play/${deck.id}`}>
              <Button className="w-full">Play Deck</Button>
            </Link>
          </Card>
        ))}
      </div>
      {decks.length === 0 && (
        <div className="text-center text-gray-600">
          No public decks available yet.
        </div>
      )}
    </div>
  )
} 