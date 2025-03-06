'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface Card {
  id: string
  content: string
}

export function CreateDeckForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [cards, setCards] = useState<Card[]>([])
  const [newCardContent, setNewCardContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddCard = () => {
    if (!newCardContent.trim()) return

    const newCard: Card = {
      id: Math.random().toString(36).substr(2, 9),
      content: newCardContent.trim(),
    }

    setCards([...cards, newCard, { ...newCard, id: Math.random().toString(36).substr(2, 9) }])
    setNewCardContent('')
  }

  const handleRemoveCard = (id: string) => {
    setCards(cards.filter((card) => card.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cards.length < 2) {
      toast.error('Error', {
        description: 'Please add at least one pair of cards.',
      })
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase.from('decks').insert({
        title,
        description,
        is_public: isPublic,
        user_id: user.id,
        cards,
      })

      if (error) throw error

      toast.success('Success', {
        description: 'Deck created successfully!',
      })

      // Reset form
      setTitle('')
      setDescription('')
      setIsPublic(false)
      setCards([])
      setNewCardContent('')
    } catch (error: unknown) {
      console.error('Create deck error:', error)
      toast.error('Error', {
        description: 'Failed to create deck. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is-public"
          checked={isPublic}
          onCheckedChange={setIsPublic}
        />
        <Label htmlFor="is-public">Make deck public</Label>
      </div>

      <div className="space-y-4">
        <Label>Cards</Label>
        <div className="flex space-x-2">
          <Input
            value={newCardContent}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCardContent(e.target.value)}
            placeholder="Enter card content"
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleAddCard()}
          />
          <Button type="button" onClick={handleAddCard}>
            Add Card
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <span>{card.content}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveCard(card.id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating...' : 'Create Deck'}
      </Button>
    </form>
  )
} 