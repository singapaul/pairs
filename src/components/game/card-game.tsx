'use client';

import { useState, useEffect, useRef } from 'react';
import Card from './card';
import { toast } from 'sonner';
import PostGameModal from './post-game-modal';
import { useAuth } from '@/lib/auth';
import { saveGameResult } from '@/lib/stats';
import { cn } from '@/lib/utils';

interface CardType {
  id: string;
  content: string;
  pairId: string;
  type: 'question' | 'answer';
}

interface CardGameProps {
  cards: CardType[];
  deckTitle: string;
  deckId: string;
  onRestart?: () => void;
  shouldStartAnimation?: boolean;
}

export default function CardGame({
  cards,
  deckTitle,
  deckId,
  onRestart,
  shouldStartAnimation = false,
}: CardGameProps) {
  const { user } = useAuth();
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [canFlip, setCanFlip] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showPostGame, setShowPostGame] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [shuffledCards, setShuffledCards] = useState<CardType[]>([]);
  const gameStartTime = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout>(null);

  // Fisher-Yates shuffle algorithm
  const shuffleCards = (cards: CardType[]) => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize game
  useEffect(() => {
    // Shuffle cards
    setShuffledCards(shuffleCards(cards));
    setMatchedPairs([]);
    setMoves(0);
    setTimeElapsed(0);
    setCanFlip(false);
    gameStartTime.current = Date.now();

    // Start timer
    timerRef.current = setInterval(() => {
      if (gameStartTime.current) {
        setTimeElapsed(Date.now() - gameStartTime.current);
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [cards]);

  // Handle initial flip animation
  useEffect(() => {
    if (shouldStartAnimation && shuffledCards.length > 0) {
      const initialFlip = async () => {
        // Flip all cards
        setFlippedCards(shuffledCards.map(card => card.id));

        // Wait 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Unflip all cards
        setFlippedCards([]);

        // Enable card flipping
        setCanFlip(true);
      };

      initialFlip();
    }
  }, [shouldStartAnimation, shuffledCards]);

  // Handle game completion
  useEffect(() => {
    if (matchedPairs.length === shuffledCards.length / 2 && matchedPairs.length > 0) {
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Save game result if user is logged in
      if (user) {
        const finalTime = Date.now() - (gameStartTime.current || Date.now());
        const result = {
          userId: user.uid,
          deckId,
          deckTitle,
          moves,
          timeElapsed: finalTime,
          completedAt: new Date(),
          perfectGame: moves === shuffledCards.length / 2,
        };

        saveGameResult(result)
          .then(() => {
            toast.success('Game completed!');
          })
          .catch(error => {
            console.error('Error saving game result:', error);
            toast.error('Failed to save game result');
          });
      }

      setShowPostGame(true);
      setCanFlip(false);
    }
  }, [matchedPairs, shuffledCards.length, moves, user, deckId, deckTitle]);

  const handleCardClick = (cardId: string) => {
    if (!canFlip || flippedCards.includes(cardId)) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      setCanFlip(false);

      const [firstId, secondId] = newFlippedCards;
      const firstCard = shuffledCards.find(card => card.id === firstId);
      const secondCard = shuffledCards.find(card => card.id === secondId);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match found
        setMatchedPairs(prev => [...prev, firstCard.pairId]);
        setFlippedCards([]);
        setCanFlip(true);
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([]);
          setCanFlip(true);
        }, 1000);
      }
    }
  };

  const handlePlayAgain = () => {
    setShowPostGame(false);
    if (onRestart) {
      onRestart();
    }
  };

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate the number of pairs
  const numPairs = cards.length / 2;

  return (
    <>
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-4 flex items-center justify-between px-4">
          <div className="text-lg font-medium">Moves: {moves}</div>
          <div className="text-lg font-medium">Time: {formatTime(timeElapsed)}</div>
        </div>
        <div
          className={cn(
            'grid gap-4 p-4',
            // Mobile: smaller cards
            'grid-cols-[repeat(auto-fit,minmax(120px,1fr))]',
            // Tablet: medium cards
            'sm:grid-cols-[repeat(auto-fit,minmax(140px,1fr))]',
            // Desktop: larger cards
            'md:grid-cols-[repeat(auto-fit,minmax(160px,1fr))]',
            // Desktop layouts based on number of pairs
            numPairs === 16 && 'md:grid-cols-4 lg:grid-cols-6',
            numPairs === 24 && 'md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8',
            numPairs === 32 && 'md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8',
            numPairs === 40 && 'md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8'
          )}
        >
          {shuffledCards.map(card => (
            <Card
              key={card.id}
              content={card.content}
              isFlipped={flippedCards.includes(card.id) || matchedPairs.includes(card.pairId)}
              onClick={() => handleCardClick(card.id)}
              disabled={!canFlip || matchedPairs.includes(card.pairId)}
              matched={matchedPairs.includes(card.pairId)}
              type={card.type}
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
          perfectGame: moves === shuffledCards.length / 2,
        }}
        deckTitle={deckTitle}
        deckId={deckId}
      />
    </>
  );
}
