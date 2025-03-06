'use client'

import { useState, useEffect } from 'react'
import Card from './card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface CardType {
  id: string
  content: string
  pairId: string
}

interface CardGameProps {
  cards: CardType[]
  onGameComplete?: () => void
  onRestart?: () => void
}

export default function CardGame({ cards, onGameComplete, onRestart }: CardGameProps) {
  const [flippedCards, setFlippedCards] = useState<string[]>([])
  const [matchedPairs, setMatchedPairs] = useState<string[]>([])
  const [isRevealing, setIsRevealing] = useState(true)
  const [canFlip, setCanFlip] = useState(false)
  const [moves, setMoves] = useState(0)

  // Initial reveal of all cards
  useEffect(() => {
    const revealTimer = setTimeout(() => {
      setFlippedCards([])
      setIsRevealing(false)
      setCanFlip(true)
    }, 3000)

    return () => clearTimeout(revealTimer)
  }, [])

  // Reset game state
  useEffect(() => {
    setFlippedCards(cards.map(card => card.id))
    setMatchedPairs([])
    setMoves(0)
  }, [cards])

  // Check for game completion
  useEffect(() => {
    if (matchedPairs.length === cards.length / 2 && matchedPairs.length > 0) {
      toast.success(`Congratulations! You won in ${moves} moves! 🎉`)
      onGameComplete?.()
    }
  }, [matchedPairs, cards.length, moves, onGameComplete])

  const handleCardClick = (cardId: string) => {
    if (!canFlip || flippedCards.includes(cardId)) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1)
      setCanFlip(false)

      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find(card => card.id === firstId)
      const secondCard = cards.find(card => card.id === secondId)

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        setMatchedPairs(prev => [...prev, firstCard.pairId])
        setFlippedCards([])
        setCanFlip(true)
      } else {
        setTimeout(() => {
          setFlippedCards([])
          setCanFlip(true)
        }, 1000)
      }
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="text-lg font-medium">
          Moves: {moves}
        </div>
        {isRevealing && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Memorize the cards...</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
        {cards.map((card) => (
          <Card
            key={card.id}
            content={card.content}
            isFlipped={flippedCards.includes(card.id) || matchedPairs.includes(card.pairId)}
            onClick={() => handleCardClick(card.id)}
            disabled={isRevealing || !canFlip || matchedPairs.includes(card.pairId)}
            matched={matchedPairs.includes(card.pairId)}
          />
        ))}
      </div>
    </div>
  )
} 