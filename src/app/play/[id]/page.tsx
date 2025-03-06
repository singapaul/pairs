import { use } from 'react'
import { GameUI } from '@/components/game/game-ui'

export default function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  return <GameUI deckId={id} />
} 