'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { Loader2 } from 'lucide-react'
import { Deck } from '@/types/deck'
import { DeckCard } from '@/components/deck/deck-card'
import { DeckFilters } from '@/components/deck/deck-filters'

interface Filters {
  yearGroup: string | null
  subject: string | null
  topic: string
  pairCount: number | null
}

const initialFilters: Filters = {
  yearGroup: null,
  subject: null,
  topic: '',
  pairCount: null
}

export default function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [filteredDecks, setFilteredDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const { user } = useAuth()

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const q = query(
          collection(db, 'decks'),
          where('isPublic', '==', true),
          orderBy('createdAt', 'desc')
        )
        
        const querySnapshot = await getDocs(q)
        const fetchedDecks = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        })) as Deck[]
        
        setDecks(fetchedDecks)
        setFilteredDecks(fetchedDecks)
      } catch (error) {
        console.error('Error fetching decks:', error)
        setError('Failed to load decks. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    void fetchDecks()
  }, [])

  useEffect(() => {
    let filtered = [...decks]

    if (filters.yearGroup && filters.yearGroup !== 'all') {
      filtered = filtered.filter(deck => deck.yearGroup === filters.yearGroup)
    }

    if (filters.subject && filters.subject !== 'all') {
      filtered = filtered.filter(deck => deck.subject === filters.subject)
    }

    if (filters.topic) {
      const topicLower = filters.topic.toLowerCase()
      filtered = filtered.filter(deck => 
        deck.topic?.toLowerCase().includes(topicLower) ||
        deck.title.toLowerCase().includes(topicLower) ||
        deck.description?.toLowerCase().includes(topicLower)
      )
    }

    if (filters.pairCount) {
      filtered = filtered.filter(deck => deck.cards.length === filters.pairCount! * 2)
    }

    setFilteredDecks(filtered)
  }, [decks, filters])

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters)
  }

  const handleFiltersReset = () => {
    setFilters(initialFilters)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Loading decks...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  if (decks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        {user ? (
          <>
            <p>No decks found. Create your first deck!</p>
            <Button asChild>
              <Link href="/create">Create Deck</Link>
            </Button>
          </>
        ) : (
          <>
            <p>Sign in to create your own decks!</p>
            <Button asChild>
              <Link href="/auth">Sign In</Link>
            </Button>
          </>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Decks</h1>
 
      </div>

      <DeckFilters
        filters={filters}
        onChange={handleFiltersChange}
        onReset={handleFiltersReset}
        totalDecks={filteredDecks.length}
      />

      {filteredDecks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No decks match your filters</p>
          <Button
            variant="link"
            onClick={handleFiltersReset}
            className="mt-2"
          >
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDecks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </div>
      )}
    </div>
  )
} 