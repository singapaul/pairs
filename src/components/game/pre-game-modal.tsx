'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/types/deck';
import CardComponent from './card';

interface PreGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (shouldAnimate: boolean) => void;
  cards: Card[];
}

export default function PreGameModal({ isOpen, onClose, onStart, cards }: PreGameModalProps) {
  const [demoCards, setDemoCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPair, setMatchedPair] = useState<string | null>(null);

  // Select two random pairs for the demo
  useEffect(() => {
    if (cards.length > 0) {
      const uniquePairs = cards.reduce((acc, card) => {
        if (!acc.some(c => c.pairId === card.pairId)) {
          acc.push(card);
        }
        return acc;
      }, [] as Card[]);

      // Shuffle and take two pairs
      const shuffled = [...uniquePairs].sort(() => Math.random() - 0.5);
      const selectedPairs = shuffled.slice(0, 2);

      // Get both cards for each pair
      const demoCards = selectedPairs.flatMap(pair =>
        cards.filter(card => card.pairId === pair.pairId)
      );

      setDemoCards(demoCards);
    }
  }, [cards]);

  // Demo animation sequence
  useEffect(() => {
    if (demoCards.length > 0) {
      const startDemo = async () => {
        // Wait 1 second before starting
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Flip first card
        setFlippedCards([demoCards[0].id]);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Flip second card
        setFlippedCards([demoCards[0].id, demoCards[2].id]);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Unflip cards
        setFlippedCards([]);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Flip first card of second pair
        setFlippedCards([demoCards[2].id]);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Flip second card of second pair
        setFlippedCards([demoCards[2].id, demoCards[3].id]);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Match the pair
        setMatchedPair(demoCards[2].pairId);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Reset for next demo
        setMatchedPair(null);
        setFlippedCards([]);
      };

      startDemo();
    }
  }, [demoCards]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl">How to Play</DialogTitle>
          <DialogDescription className="text-sm">
            Match pairs of identical cards to win the game!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Demo Cards */}
          <div className="mx-auto grid max-w-[300px] grid-cols-2 gap-3 p-2">
            {demoCards.map(card => (
              <CardComponent
                key={card.id}
                content={card.content}
                isFlipped={flippedCards.includes(card.id)}
                onClick={() => {}}
                disabled={true}
                matched={matchedPair === card.pairId}
                type={card.type}
              />
            ))}
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold">Rules:</h3>
              <ul className="list-disc space-y-1 pl-4 text-sm">
                <li>Click on any card to reveal it</li>
                <li>Click on a second card to find its match</li>
                <li>If the cards match, they stay face up</li>
                <li>If they don&apos;t match, both cards will flip face down</li>
                <li>Remember the cards you&apos;ve seen to find matches faster</li>
                <li>Match all pairs to win the game!</li>
              </ul>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold">Tips:</h3>
              <ul className="list-disc space-y-1 pl-4 text-sm">
                <li>Try to remember the position of cards you&apos;ve seen</li>
                <li>Take your time - there&apos;s no time limit</li>
                <li>Focus on finding one pair at a time</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => onStart(true)}>
              Start Game
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
