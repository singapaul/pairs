'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { collection, doc, deleteDoc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/language';
import { t } from '@/lib/translations';

interface FavoriteButtonProps {
  deckId: string;
}

export function FavoriteButton({ deckId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { language } = useLanguage();

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'favorites'),
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

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Please sign in to favorite decks');
      return;
    }

    try {
      if (isFavorite) {
        // Remove from favorites
        const q = query(
          collection(db, 'favorites'),
          where('userId', '==', user.uid),
          where('deckId', '==', deckId)
        );
        const querySnapshot = await getDocs(q);
        const docToDelete = querySnapshot.docs[0];

        if (docToDelete) {
          await deleteDoc(docToDelete.ref);
          setIsFavorite(false);
          toast.success(t('toast.removedFavourites', language));
        }
      } else {
        // Add to favorites
        const favoriteData = {
          userId: user.uid,
          deckId,
          createdAt: new Date(),
        };

        // Create a new document with an auto-generated ID
        const newFavoriteRef = doc(collection(db, 'favorites'));
        await setDoc(newFavoriteRef, favoriteData);

        setIsFavorite(true);
        toast.success(t('toast.addedFavourites', language));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  if (loading) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleFavorite}
      className={isFavorite ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'}
    >
      <Star className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} />
    </Button>
  );
}
