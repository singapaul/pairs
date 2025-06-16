'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';
import { Deck } from '@/types/deck';
import { DeckCard } from '@/components/deck/deck-card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/language';
import { t } from '@/lib/translations';

export default function MyDecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingDeck, setDeletingDeck] = useState<Deck | null>(null);
  const { user } = useAuth();
  const { language } = useLanguage();

  useEffect(() => {
    const fetchMyDecks = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const q = query(
          collection(getDb(), 'decks'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const fetchedDecks = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        })) as Deck[];

        setDecks(fetchedDecks);
      } catch (error) {
        console.error('Error fetching decks:', error);
        setError('Failed to load your decks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    void fetchMyDecks();
  }, [user]);

  const handleDelete = async () => {
    if (!deletingDeck) return;

    try {
      await deleteDoc(doc(getDb(), 'decks', deletingDeck.id));
      setDecks(decks.filter(deck => deck.id !== deletingDeck.id));
      toast.success(t('toast.deckDeleted', language));
    } catch (error) {
      console.error('Error deleting deck:', error);
      toast.error(t('toast.failedToDeleteDeck', language));
    } finally {
      setDeletingDeck(null);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p>{t('myDecks.signInMessage', language)}</p>
        <Button asChild>
          <Link href="/auth">{t('myDecks.signIn', language)}</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>{t('myDecks.loading', language)}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()}>{t('myDecks.retry', language)}</Button>
      </div>
    );
  }

  if (decks.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p>{t('myDecks.noDecks', language)}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('myDecks.title', language)}</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {decks.map(deck => (
          <div key={deck.id}>
            <DeckCard deck={deck} showEditOptions onDeleteClick={setDeletingDeck} />
          </div>
        ))}
      </div>

      <AlertDialog open={!!deletingDeck} onOpenChange={() => setDeletingDeck(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('myDecks.areYouSure', language)}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('myDecks.deleteDeckConfirm', language)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('myDecks.cancel', language)}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              {t('myDecks.delete', language)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
