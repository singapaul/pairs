'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

interface Card {
  id: string
  content: string
  pairId: string // Added pairId for matching
}

export default function CreateDeckPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [cards, setCards] = useState<Card[]>([])
  const [newCard, setNewCard] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const addCard = () => {
    if (!newCard.trim()) return

    // Generate a pairId for matching
    const pairId = uuidv4()
    
    // Add two cards with the same pairId
    setCards(prev => [
      ...prev,
      { id: uuidv4(), content: newCard.trim(), pairId },
      { id: uuidv4(), content: newCard.trim(), pairId }
    ])
    setNewCard('')
  }

  const removeCard = (pairId: string) => {
    setCards(prev => prev.filter(card => card.pairId !== pairId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('You must be signed in to create a deck')
      return
    }

    // Get unique pairs (just one card from each pair for validation)
    const uniquePairs = cards.reduce((acc, card) => {
      if (!acc.some(c => c.pairId === card.pairId)) {
        acc.push(card)
      }
      return acc
    }, [] as Card[])

    if (uniquePairs.length < 2) {
      toast.error('Add at least 2 pairs of cards')
      return
    }

    try {
      setLoading(true)

      // Shuffle the cards array
      const shuffledCards = [...cards].sort(() => Math.random() - 0.5)

      const deck = {
        title,
        description,
        cards: shuffledCards,
        userId: user.uid,
        createdAt: new Date(),
        isPublic: true,
      }

      await addDoc(collection(db, 'decks'), deck)
      toast.success('Deck created successfully!')
      router.push('/decks')
    } catch (error) {
      console.error('Error creating deck:', error)
      toast.error('Failed to create deck')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          minLength={3}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          minLength={10}
        />
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newCard}
            onChange={(e) => setNewCard(e.target.value)}
            placeholder="Enter card content"
          />
          <Button type="button" onClick={addCard}>
            Add Pair
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Group cards by pairId and show only one instance of each pair */}
          {cards.reduce((acc, card) => {
            if (!acc.some(c => c.pairId === card.pairId)) {
              acc.push(card)
            }
            return acc
          }, [] as Card[]).map((card) => (
            <div key={card.pairId} className="flex items-center gap-2 p-2 border rounded">
              <span>{card.content}</span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeCard(card.pairId)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating...' : 'Create Deck'}
      </Button>
    </form>
  )
} 