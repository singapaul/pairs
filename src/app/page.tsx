'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
export default function Home() {

  const { user } = useAuth()
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center space-y-8">
      <h1 className="text-4xl font-bold">Welcome to Memory Card Game</h1>
      <p className="text-xl text-gray-600 max-w-2xl">
        Challenge your memory with our fun card matching game. Create your own decks or play with existing ones. Track your progress and compete with others!
      </p>
      <div className="space-x-4">
        <Link href="/decks">
          <Button size="lg">Browse Decks</Button>
        </Link>
       { user && <Link href="/create">
          <Button size="lg" variant="outline">Create Deck</Button>
        </Link>}
      </div>
    </div>
  )
}
