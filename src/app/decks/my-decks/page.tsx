'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { Loader2 } from 'lucide-react'
import { Deck } from '@/types/deck'
import { DeckCard } from '@/components/deck/deck-card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner'

export default function MyDecksPage() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingDeck, setDeletingDeck] = useState<Deck | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchMyDecks = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const q = query(
          collection(db, 'decks'),
          where('userId', '==', user.uid),
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
        setError('Failed to load your decks. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    void fetchMyDecks()
  }, [user])

  const handleDelete = async () => {
    if (!deletingDeck) return

    try {
      await deleteDoc(doc(db, 'decks', deletingDeck.id))
      setDecks(decks.filter(deck => deck.id !== deletingDeck.id))
      toast.success('Deck deleted successfully')
    } catch (error) {
      console.error('Error deleting deck:', error)
      toast.error('Failed to delete deck')
    } finally {
      setDeletingDeck(null)
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p>Sign in to see your decks!</p>
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
        <p>Loading your decks...</p>
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
        <p>You haven&apos;t created any decks yet!</p>
  
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Decks</h1>
 
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map((deck) => (
          <div key={deck.id}>
            <DeckCard 
              deck={deck} 
              showEditOptions 
              onDeleteClick={setDeletingDeck}
            />
          </div>
        ))}
      </div>

      <AlertDialog open={!!deletingDeck} onOpenChange={() => setDeletingDeck(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the deck &quot;{deletingDeck?.title}&quot;. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 