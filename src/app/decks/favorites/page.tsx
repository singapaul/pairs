'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';
import { Deck } from '@/types/deck';
import { DeckCard } from '@/components/deck/deck-card';
import { useLanguage } from '@/lib/language';
import { t } from '@/lib/translations';

export default function FavoriteDecksPage() {
  const { language } = useLanguage();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavoriteDecks = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const favoritesQuery = query(
          collection(getDb(), 'favorites'),
          where('userId', '==', user.uid)
        );
        const favoritesSnapshot = await getDocs(favoritesQuery);
        const deckIds = favoritesSnapshot.docs.map(doc => doc.data().deckId);

        // Fetch the actual decks
        const decksPromises = deckIds.map(async deckId => {
          const deckDoc = await getDoc(doc(getDb(), 'decks', deckId));
          if (deckDoc.exists()) {
            return {
              id: deckDoc.id,
              ...deckDoc.data(),
            } as Deck;
          }
          return null;
        });

        const fetchedDecks = (await Promise.all(decksPromises)).filter(Boolean) as Deck[];
        setDecks(fetchedDecks);
      } catch (error) {
        console.error('Error fetching favorite decks:', error);
        setError('Failed to load favorite decks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    void fetchFavoriteDecks();
  }, [user]);

  if (!user) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p>{t('favorites.signInMessage', language)}</p>
        <Button asChild>
          <Link href="/auth">{t('favorites.signIn', language)}</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>{t('favorites.loading', language)}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()}>{t('favorites.retry', language)}</Button>
      </div>
    );
  }

  if (decks.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p>{t('favorites.noDecks', language)}</p>
        <Button asChild>
          <Link href="/decks">{t('favorites.browseDecks', language)}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{t('favorites.title', language)}</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {decks.map(deck => (
          <DeckCard key={deck.id} deck={deck} />
        ))}
      </div>
    </div>
  );
}
