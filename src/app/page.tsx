'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import PairsLogo from '@/assets/PairsLogo.svg'
import Image from 'next/image'

export default function Home() {
  const { user } = useAuth()
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center px-4 sm:px-20 text-center max-w-4xl mx-auto">
        <Image src={PairsLogo} alt="Pairs Logo" className="w-48 mb-8" priority />
        <p className="text-xl text-gray-600 max-w-2xl">
          Challenge your memory with our fun card matching game. Create your own decks or play with existing ones. Track your progress and compete with others!
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link href="/decks">
            <Button size="lg">Browse Decks</Button>
          </Link>
          {user && (
            <Link href="/create">
              <Button size="lg" variant="outline">Create Deck</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
