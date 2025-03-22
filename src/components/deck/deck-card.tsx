'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Deck } from '@/types/deck'
import { FavoriteButton } from './favorite-button'
import { Share2, BookOpen, GraduationCap, Tag, PlayCircle, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface DeckCardProps {
  deck: Deck
  showPlayAgain?: boolean
  showEditOptions?: boolean
  onDeleteClick?: (deck: Deck) => void
}

export function DeckCard({ 
  deck, 
  showPlayAgain = false, 
  showEditOptions = false,
  onDeleteClick
}: DeckCardProps) {
  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/play/${deck.id}`
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      toast.error('Failed to copy link')
    }
  }

  return (
    <div className="relative">
      <div className={cn(
        "p-6 bg-white rounded-lg border shadow-sm",
        showEditOptions && "pb-20"
      )}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg">{deck.title}</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <PlayCircle className="h-4 w-4" />
              <span>{deck.plays || 0}</span>
            </div>
            <FavoriteButton deckId={deck.id} />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
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

        <p className="text-gray-600 mt-3">{deck.description}</p>
        <p className="text-sm text-gray-500 mt-2">
          {deck?.cards?.length} cards
        </p>
        
        <div className="flex gap-2 mt-4">
          <Button asChild className="flex-1">
            <Link href={`/play/${deck.id}`}>
              {showPlayAgain ? 'Play Again' : 'Play'}
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleShare}
            className="flex-1 text-gray-500 hover:text-gray-700"
          >
            Share <Share2 className="h-5 w-5 ml-2" />
          </Button>
        </div>

        {showEditOptions && (
          <div className="absolute bottom-6 left-6 right-6 flex gap-2">
            <Button
              variant="secondary"
              asChild
              className="flex-1"
            >
              <Link href={`/decks/edit/${deck.id}`}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => onDeleteClick?.(deck)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 