'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';
import { Deck } from '@/types/deck';
import { DeckCard } from '@/components/deck/deck-card';
import { DeckFilters } from '@/components/deck/deck-filters';
import { useLanguage } from '@/lib/language';
import { t } from '@/lib/translations';

interface Filters {
  yearGroup: string | null;
  subject: string | null;
  topic: string;
  pairCount: number | null;
}

const initialFilters: Filters = {
  yearGroup: null,
  subject: null,
  topic: '',
  pairCount: null,
};

export default function DecksPage() {
  const { language } = useLanguage();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [filteredDecks, setFilteredDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        setLoading(true);
        setError(null);

        const q = query(
          collection(getDb(), 'decks'),
          where('isPublic', '==', true),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const fetchedDecks = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        })) as Deck[];

        setDecks(fetchedDecks);
        setFilteredDecks(fetchedDecks);
      } catch (error) {
        console.error('Error fetching decks:', error);
        setError('Failed to load decks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    void fetchDecks();
  }, []);

  useEffect(() => {
    let filtered = [...decks];

    if (filters.yearGroup && filters.yearGroup !== 'all') {
      filtered = filtered.filter(deck => deck.yearGroup === filters.yearGroup);
    }

    if (filters.subject && filters.subject !== 'all') {
      filtered = filtered.filter(deck => deck.subject === filters.subject);
    }

    if (filters.topic) {
      const topicLower = filters.topic.toLowerCase();
      filtered = filtered.filter(
        deck =>
          deck.topic?.toLowerCase().includes(topicLower) ||
          deck.title.toLowerCase().includes(topicLower) ||
          deck.description?.toLowerCase().includes(topicLower)
      );
    }

    if (filters.pairCount) {
      filtered = filtered.filter(deck => deck.cards.length === filters.pairCount! * 2);
    }

    setFilteredDecks(filtered);
  }, [decks, filters]);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleFiltersReset = () => {
    setFilters(initialFilters);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>{t('browse.loadingDecks', language)}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()}>{t('browse.retry', language)}</Button>
      </div>
    );
  }

  if (decks.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        {user ? (
          <>
            <p>{t('decks.empty', language)}</p>
            <Button asChild>
              <Link href="/create">{t('home.create', language)}</Link>
            </Button>
          </>
        ) : (
          <>
            <p>{t('auth.signInCreate', language)}</p>
            <Button asChild>
              <Link href="/auth">{t('auth.signIn', language)}</Link>
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('browse.allDecks', language)}</h1>
      </div>

      <DeckFilters
        filters={filters}
        onChange={handleFiltersChange}
        onReset={handleFiltersReset}
        totalDecks={filteredDecks.length}
      />

      {filteredDecks.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">{t('browse.noDecks', language)}</p>
          <Button variant="link" onClick={handleFiltersReset} className="mt-2">
            {t('browse.clearFilters', language)}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDecks.map(deck => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </div>
      )}
    </div>
  );
}
