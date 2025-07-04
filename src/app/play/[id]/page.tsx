'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import PreGameModal from '@/components/game/pre-game-modal';
import CardGame from '@/components/game/card-game';
import { use } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language';
import { t } from '@/lib/translations';

interface Deck {
  id: string;
  title: string;
  description: string;
  cards: {
    id: string;
    content: string;
    pairId: string;
    type: 'question' | 'answer';
  }[];
}

export default function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { language } = useLanguage();
  const router = useRouter();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPreGameModal, setShowPreGameModal] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [previewTime, setPreviewTime] = useState(0);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        setLoading(true);
        setError(null);

        const deckRef = doc(getDb(), 'decks', id);
        const deckSnap = await getDoc(deckRef);

        if (!deckSnap.exists()) {
          setError('Deck not found');
          return;
        }

        const deckData = deckSnap.data();
        if (!deckData.cards || deckData.cards.length === 0) {
          setError('This deck has no cards');
          return;
        }

        setDeck({
          id: deckSnap.id,
          ...deckData,
        } as Deck);
      } catch (error) {
        console.error('Error fetching deck:', error);
        setError('Failed to load deck');
      } finally {
        setLoading(false);
      }
    };

    void fetchDeck();
  }, [id]);

  const handleStartGame = (previewTime: number) => {
    setShowPreGameModal(false);
    setGameStarted(true);
    setPreviewTime(previewTime);
  };

  const handleRestartGame = () => {
    setGameStarted(false);
    setShowPreGameModal(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Loading deck...</p>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error || 'Deck not found'}</p>
        <Button onClick={() => router.push('/decks')}>Back to Decks</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 px-4 py-12">
      <PreGameModal
        isOpen={showPreGameModal}
        onClose={() => router.push('/decks')}
        onStart={handleStartGame}
        cards={deck.cards}
      />

      {gameStarted ? (
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold">{deck.title}</h1>
            <p className="text-gray-600">{deck.description}</p>
          </div>
          <CardGame
            cards={deck.cards}
            deckTitle={deck.title}
            deckId={deck.id}
            onRestart={handleRestartGame}
            previewTime={previewTime}
          />
          <Button variant="outline" onClick={handleRestartGame}>
            {t('gamePage.restartGame', language)}
          </Button>
        </div>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">{deck.title}</h1>
          <p className="text-gray-600">{deck.description}</p>
          <Button onClick={() => setShowPreGameModal(true)}>Start Game</Button>
        </div>
      )}
    </div>
  );
}
