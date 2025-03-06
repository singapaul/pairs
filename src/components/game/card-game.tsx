'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Database } from '@/types/database'

type CardType = Database['public']['Tables']['decks']['Row']['cards'][0] & {
  isFlipped: boolean
  isMatched: boolean
}

interface CardGameProps {
  deckId: string
  cards: Database['public']['Tables']['decks']['Row']['cards']
}

export function CardGame({ deckId, cards: initialCards }: CardGameProps) {
  const [cards, setCards] = useState<CardType[]>([])
  const [flippedCards, setFlippedCards] = useState<CardType[]>([])
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)

  useEffect(() => {
    // Shuffle and initialize cards
    const shuffledCards = [...initialCards]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({
        ...card,
        isFlipped: false,
        isMatched: false,
      }))
    setCards(shuffledCards)
  }, [initialCards])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying && !isGameOver) {
      timer = setInterval(() => {
        setTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isPlaying, isGameOver])

  const handleCardClick = (clickedCard: CardType) => {
    if (!isPlaying) {
      setIsPlaying(true)
    }

    if (flippedCards.length === 2 || clickedCard.isFlipped || clickedCard.isMatched) {
      return
    }

    const newCards = cards.map((card) =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    )
    setCards(newCards)

    const newFlippedCards = [...flippedCards, clickedCard]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1)
      checkMatch(newFlippedCards)
    }
  }

  const checkMatch = (flippedCards: CardType[]) => {
    const [card1, card2] = flippedCards
    if (card1.content === card2.content) {
      // Match found
      const newCards = cards.map((card) =>
        card.id === card1.id || card.id === card2.id
          ? { ...card, isMatched: true }
          : card
      )
      setCards(newCards)
      setFlippedCards([])

      // Check if game is over
      if (newCards.every((card) => card.isMatched)) {
        setIsGameOver(true)
        saveScore()
      }
    } else {
      // No match
      setTimeout(() => {
        const newCards = cards.map((card) =>
          card.id === card1.id || card.id === card2.id
            ? { ...card, isFlipped: false }
            : card
        )
        setCards(newCards)
        setFlippedCards([])
      }, 1000)
    }
  }

  const saveScore = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('scores').insert({
          user_id: user.id,
          deck_id: deckId,
          time,
          moves,
        })
        toast.success('Game Over!', {
          description: `You completed the game in ${time} seconds with ${moves} moves!`,
        })
      }
    } catch (error: unknown) {
      console.error('Error saving score:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>Time: {formatTime(time)}</div>
        <div>Moves: {moves}</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card
            key={card.id}
            className={`aspect-square cursor-pointer transition-all duration-300 ${
              card.isFlipped || card.isMatched ? 'bg-blue-500' : 'bg-gray-200'
            }`}
            onClick={() => handleCardClick(card)}
          >
            <div className="h-full flex items-center justify-center text-white text-xl">
              {card.isFlipped || card.isMatched ? card.content : '?'}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 