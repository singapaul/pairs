'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/types/deck'

interface PreGameModalProps {
  isOpen: boolean
  onClose: () => void
  onStart: () => void
  cards: Card[]
}

export default function PreGameModal({ isOpen, onClose, onStart, cards }: PreGameModalProps) {
  const [showingCards, setShowingCards] = useState(true)

  const handleStart = () => {
    if (showingCards) {
      setShowingCards(false)
    } else {
      onStart()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        {showingCards ? (
          <>
            <DialogHeader>
              <DialogTitle>Preview Cards</DialogTitle>
              <DialogDescription>
                Take a moment to review all the cards before starting. They will be shuffled when the game begins.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto p-4">
              {/* Show unique cards (one from each pair) */}
              {cards.reduce((acc, card) => {
                if (!acc.some(c => c.pairId === card.pairId)) {
                  acc.push(card)
                }
                return acc
              }, [] as Card[]).map((card) => (
                <div
                  key={card.id}
                  className="bg-white shadow rounded-lg p-4 flex items-center justify-center min-h-[100px] text-center"
                >
                  {card.content}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleStart}>
                Continue to Instructions
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>How to Play</DialogTitle>
              <DialogDescription>
                Match pairs of identical cards to win the game!
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Rules:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Click on any card to reveal it</li>
                  <li>Click on a second card to find its match</li>
                  <li>If the cards match, they stay face up</li>
                  <li>If they don&apos;t match, both cards will flip face down</li>
                  <li>Remember the cards you&apos;ve seen to find matches faster</li>
                  <li>Match all pairs to win the game!</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Tips:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Try to remember the position of cards you&apos;ve seen</li>
                  <li>Take your time - there&apos;s no time limit</li>
                  <li>Focus on finding one pair at a time</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setShowingCards(true)}>
                Back to Preview
              </Button>
              <Button onClick={handleStart}>
                Start Game
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
} 