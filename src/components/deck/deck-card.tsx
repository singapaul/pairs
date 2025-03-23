'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Deck } from '@/types/deck';
import { FavoriteButton } from './favorite-button';
import { Share2, BookOpen, GraduationCap, Tag, PlayCircle, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DeckCardProps {
  deck: Deck;
  showPlayAgain?: boolean;
  showEditOptions?: boolean;
  onDeleteClick?: (deck: Deck) => void;
}

export function DeckCard({
  deck,
  showPlayAgain = false,
  showEditOptions = false,
  onDeleteClick,
}: DeckCardProps) {
  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/play/${deck.id}`;
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="relative">
      <div className={cn('rounded-lg border bg-white p-6 shadow-sm', showEditOptions && 'pb-20')}>
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-lg font-semibold">{deck.title}</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <PlayCircle className="h-4 w-4" />
              <span>{deck.plays || 0}</span>
            </div>
            <FavoriteButton deckId={deck.id} />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {deck.subject && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {deck.subject}
            </Badge>
          )}
          {deck.yearGroup && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />
              {deck.yearGroup}
            </Badge>
          )}
          {deck.topic && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {deck.topic}
            </Badge>
          )}
        </div>

        <p className="mt-3 text-gray-600">{deck.description}</p>
        <p className="mt-2 text-sm text-gray-500">{deck?.cards?.length} cards</p>

        <div className="mt-4 flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/play/${deck.id}`}>{showPlayAgain ? 'Play Again' : 'Play'}</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleShare}
            className="flex-1 text-gray-500 hover:text-gray-700"
          >
            Share <Share2 className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {showEditOptions && (
          <div className="absolute right-6 bottom-6 left-6 flex gap-2">
            <Button variant="secondary" asChild className="flex-1">
              <Link href={`/decks/edit/${deck.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive" className="flex-1" onClick={() => onDeleteClick?.(deck)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
