'use client'

import { useState, useEffect, useRef } from 'react'
import Card from './card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import PostGameModal from './post-game-modal'

interface CardType {
  id: string
  content: string
  pairId: string
}

interface CardGameProps {
  cards: CardType[]
  deckTitle: string
  deckId: string
  onRestart?: () => void
}

export default function CardGame({ cards, deckTitle, deckId, onRestart }: CardGameProps) {
  const [flippedCards, setFlippedCards] = useState<string[]>([])
  const [matchedPairs, setMatchedPairs] = useState<string[]>([])
  const [isRevealing, setIsRevealing] = useState(true)
  const [canFlip, setCanFlip] = useState(false)
  const [moves, setMoves] = useState(0)
  const [showPostGame, setShowPostGame] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const gameStartTime = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout>()

  // Reset game state
  useEffect(() => {
    setFlippedCards(cards.map(card => card.id))
    setMatchedPairs([])
    setMoves(0)
    setTimeElapsed(0)
    gameStartTime.current = null
    setIsRevealing(true)
    setCanFlip(false)
    setShowPostGame(false)

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    // Initial reveal timer
    const revealTimer = setTimeout(() => {
      setFlippedCards([])
      setIsRevealing(false)
      setCanFlip(true)
      gameStartTime.current = Date.now()
      
      // Start the game timer
      timerRef.current = setInterval(() => {
        setTimeElapsed(Date.now() - (gameStartTime.current || 0))
      }, 1000)
    }, 3000)

    return () => {
      clearTimeout(revealTimer)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [cards])

  // Check for game completion
  useEffect(() => {
    if (matchedPairs.length === cards.length / 2 && matchedPairs.length > 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      setShowPostGame(true)
      setCanFlip(false)
    }
  }, [matchedPairs, cards.length])

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

  const handlePlayAgain = () => {
    setShowPostGame(false)
    onRestart?.()
  }

  function formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4 px-4">
          <div className="text-lg font-medium">
            Moves: {moves}
          </div>
          {!isRevealing && (
            <div className="text-lg font-medium">
              Time: {formatTime(timeElapsed)}
            </div>
          )}
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

      <PostGameModal
        isOpen={showPostGame}
        onClose={() => setShowPostGame(false)}
        onPlayAgain={handlePlayAgain}
        stats={{
          moves,
          timeElapsed,
          perfectGame: moves === cards.length / 2
        }}
        deckTitle={deckTitle}
        deckId={deckId}
      />
    </>
  )
} 