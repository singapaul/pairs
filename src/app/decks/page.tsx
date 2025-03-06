'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { Loader2 } from 'lucide-react'

interface Deck {
  id: string
  title: string
  description: string
  cards: { id: string; content: string }[]
  userId: string
  createdAt: string
  isPublic: boolean
}

export default function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
      } catch (error) {
        console.error('Error fetching decks:', error)
        setError('Failed to load decks. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    void fetchDecks()
  }, [])

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {decks.map((deck) => (
        <div key={deck.id} className="border p-4 rounded-lg">
          <h2 className="text-xl font-bold">{deck.title}</h2>
          <p className="text-gray-600">{deck.description}</p>
          <p className="text-sm text-gray-500 mt-2">
            {deck.cards.length} cards
          </p>
          <Button asChild className="mt-4">
            <Link href={`/play/${deck.id}`}>Play</Link>
          </Button>
        </div>
      ))}
    </div>
  )
} 