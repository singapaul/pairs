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
import { Loader2 } from 'lucide-react'
import ProtectedRoute from '@/components/auth/protected-route'

interface Card {
  id: string
  content: string
  pairId: string
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
    if (!newCard.trim()) {
      toast.error('Please enter card content')
      return
    }

    const pairId = uuidv4()
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
      router.push('/auth')
      return
    }

    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }

    if (!description.trim()) {
      toast.error('Please enter a description')
      return
    }

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

      const shuffledCards = [...cards].sort(() => Math.random() - 0.5)

      const deck = {
        title: title.trim(),
        description: description.trim(),
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
      toast.error('Failed to create deck. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Create New Deck</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter deck title"
              required
              minLength={3}
              disabled={loading}
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
              placeholder="Enter deck description"
              required
              minLength={10}
              disabled={loading}
            />
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newCard}
                onChange={(e) => setNewCard(e.target.value)}
                placeholder="Enter card content"
                disabled={loading}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addCard()
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={addCard}
                disabled={loading || !newCard.trim()}
              >
                Add Pair
              </Button>
            </div>

            {cards.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {cards.reduce((acc, card) => {
                  if (!acc.some(c => c.pairId === card.pairId)) {
                    acc.push(card)
                  }
                  return acc
                }, [] as Card[]).map((card) => (
                  <div 
                    key={card.pairId} 
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <span className="truncate">{card.content}</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeCard(card.pairId)}
                      disabled={loading}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {cards.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Add some cards to your deck
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || cards.length < 4}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              'Create Deck'
            )}
          </Button>
        </form>
      </div>
    </ProtectedRoute>
  )
} 