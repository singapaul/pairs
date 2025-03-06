'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"

export function Navigation() {
  const { user, signOutUser } = useAuth()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Memory Card Game
        </Link>
        <div className="space-x-4">
          <Link href="/decks">
            <Button variant="ghost">Browse Decks</Button>
          </Link>
          {user ? (
            <>
              <Link href="/create">
                <Button variant="ghost">Create Deck</Button>
              </Link>
              <Button
                variant="ghost"
                onClick={signOutUser}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
} 