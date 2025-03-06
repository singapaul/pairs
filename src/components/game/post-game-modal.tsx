'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Share2, Timer, Mouse, Trophy, Star } from 'lucide-react'
import { toast } from 'sonner'

interface PostGameModalProps {
  isOpen: boolean
  onClose: () => void
  onPlayAgain: () => void
  stats: {
    moves: number
    timeElapsed: number
    perfectGame: boolean
  }
  deckTitle: string
  deckId: string
}

// Helper function to format time
function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Helper function to calculate rating based on moves and pairs
function getRating(moves: number, totalPairs: number): number {
  const perfectMoves = totalPairs
  if (moves <= perfectMoves) return 3 // Perfect game
  if (moves <= perfectMoves * 1.5) return 2 // Good game
  return 1 // Completed game
}

export default function PostGameModal({
  isOpen,
  onClose,
  onPlayAgain,
  stats,
  deckTitle,
  deckId,
}: PostGameModalProps) {
  const handleShare = async () => {
    const shareText = `I just completed "${deckTitle}" in ${formatTime(stats.timeElapsed)} with ${stats.moves} moves!`
    const shareUrl = `${window.location.origin}/play/${deckId}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Memory Game Results',
          text: shareText,
          url: shareUrl,
        })
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        toast.success('Copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
      toast.error('Failed to share results')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {stats.perfectGame ? '🎉 Perfect Game! 🎉' : '🎮 Well Done! 🎮'}
          </DialogTitle>
          <DialogDescription className="text-center">
            You completed &quot;{deckTitle}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <Timer className="h-6 w-6 mb-2 text-slate-600" />
              <span className="text-sm text-slate-600">Time</span>
              <span className="text-lg font-bold">{formatTime(stats.timeElapsed)}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <Mouse className="h-6 w-6 mb-2 text-slate-600" />
              <span className="text-sm text-slate-600">Moves</span>
              <span className="text-lg font-bold">{stats.moves}</span>
            </div>
          </div>

          {/* Performance Rating */}
          <div className="flex justify-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Star
                key={i}
                className={`h-8 w-8 ${
                  i < getRating(stats.moves, 8) 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Perfect Game Badge */}
          {stats.perfectGame && (
            <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <Trophy className="h-5 w-5" />
              <span className="font-medium">Perfect Game!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button onClick={onPlayAgain} className="w-full">
              Play Again
            </Button>
            <Button 
              onClick={handleShare} 
              variant="outline" 
              className="w-full"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Result
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 