'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { Loader2 } from 'lucide-react'
import { Deck } from '@/types/deck'
import { DeckCard } from '@/components/deck/deck-card'

export default function FavoriteDecksPage() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchFavoriteDecks = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        // Get user's favorite deck IDs
        const favoritesQuery = query(
          collection(db, 'favorites'),
          where('userId', '==', user.uid)
        )
        
        const favoritesSnapshot = await getDocs(favoritesQuery)
        const deckIds = favoritesSnapshot.docs.map(doc => doc.data().deckId)
        
        // Fetch the actual decks
        const decksPromises = deckIds.map(async (deckId) => {
          const deckDoc = await getDoc(doc(db, 'decks', deckId))
          if (deckDoc.exists()) {
            return {
              id: deckDoc.id,
              ...deckDoc.data()
            } as Deck
          }
          return null
        })
        
        const fetchedDecks = (await Promise.all(decksPromises)).filter(Boolean) as Deck[]
        setDecks(fetchedDecks)
      } catch (error) {
        console.error('Error fetching favorite decks:', error)
        setError('Failed to load favorite decks. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    void fetchFavoriteDecks()
  }, [user])

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p>Sign in to see your favorite decks!</p>
        <Button asChild>
          <Link href="/auth">Sign In</Link>
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Loading favorite decks...</p>
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
        <p>You haven&apos;t favorited any decks yet!</p>
        <Button asChild>
          <Link href="/decks">Browse Decks</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Favorite Decks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map((deck) => (
          <DeckCard key={deck.id} deck={deck} />
        ))}
      </div>
    </div>
  )
} 