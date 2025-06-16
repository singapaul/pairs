'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { collection, doc, deleteDoc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/language';
import { t } from '@/lib/translations';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
  deckId: string;
}

export function FavoriteButton({ deckId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(getDb(), 'favorites'),
          where('userId', '==', user.uid),
          where('deckId', '==', deckId)
        );
        const querySnapshot = await getDocs(q);
        setIsFavorite(!querySnapshot.empty);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      } finally {
        setLoading(false);
      }
    };

    void checkIfFavorite();
  }, [deckId, user]);

  const handleFavorite = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }

    try {
      const favoritesQuery = query(
        collection(getDb(), 'favorites'),
        where('userId', '==', user.uid),
        where('deckId', '==', deckId)
      );

      const querySnapshot = await getDocs(favoritesQuery);

      if (querySnapshot.empty) {
        // Add to favorites
        const newFavoriteRef = doc(collection(getDb(), 'favorites'));
        await setDoc(newFavoriteRef, {
          userId: user.uid,
          deckId,
          createdAt: new Date(),
        });
        setIsFavorite(true);
        toast.success(t('toast.addedToFavorites', language));
      } else {
        // Remove from favorites
        const favoriteDoc = querySnapshot.docs[0];
        await deleteDoc(doc(getDb(), 'favorites', favoriteDoc.id));
        setIsFavorite(false);
        toast.success(t('toast.removedFromFavorites', language));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(t('toast.errorTogglingFavorite', language));
    }
  };

  if (loading) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleFavorite}
      className={isFavorite ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'}
    >
      <Star className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} />
    </Button>
  );
}
