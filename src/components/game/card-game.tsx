'use client';

import { useState, useEffect, useRef } from 'react';
import Card from './card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import PostGameModal from './post-game-modal';
import { useAuth } from '@/lib/auth';
import { saveGameResult } from '@/lib/stats';

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
}

export default function CardGame({ cards, deckTitle, deckId, onRestart }: CardGameProps) {
  const { user } = useAuth();
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [isRevealing, setIsRevealing] = useState(true);
  const [canFlip, setCanFlip] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showPostGame, setShowPostGame] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const gameStartTime = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout>(null);

  // Initialize game
  useEffect(() => {
    // Show all cards initially
    setFlippedCards(cards.map(card => card.id));
    setMatchedPairs([]);
    setMoves(0);
    setTimeElapsed(0);
    setIsRevealing(true);
    setCanFlip(false);
    gameStartTime.current = null;

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // After 3 seconds, hide cards and start game
    const revealTimer = setTimeout(() => {
      setFlippedCards([]);
      setIsRevealing(false);
      setCanFlip(true);
      gameStartTime.current = Date.now();

      // Start timer
      timerRef.current = setInterval(() => {
        if (gameStartTime.current) {
          setTimeElapsed(Date.now() - gameStartTime.current);
        }
      }, 1000);
    }, 3000);

    return () => {
      clearTimeout(revealTimer);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [cards]);

  // Handle game completion
  useEffect(() => {
    if (matchedPairs.length === cards.length / 2 && matchedPairs.length > 0) {
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
          perfectGame: moves === cards.length / 2,
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
  }, [matchedPairs, cards.length, moves, user, deckId, deckTitle]);

  const handleCardClick = (cardId: string) => {
    if (!canFlip || flippedCards.includes(cardId)) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      setCanFlip(false);

      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

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

  return (
    <>
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-4 flex items-center justify-between px-4">
          <div className="text-lg font-medium">Moves: {moves}</div>
          {!isRevealing && (
            <div className="text-lg font-medium">Time: {formatTime(timeElapsed)}</div>
          )}
          {isRevealing && (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Memorize the cards...</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4">
          {cards.map(card => (
            <Card
              key={card.id}
              content={card.content}
              isFlipped={flippedCards.includes(card.id) || matchedPairs.includes(card.pairId)}
              onClick={() => handleCardClick(card.id)}
              disabled={isRevealing || !canFlip || matchedPairs.includes(card.pairId)}
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
          perfectGame: moves === cards.length / 2,
        }}
        deckTitle={deckTitle}
        deckId={deckId}
      />
    </>
  );
}
