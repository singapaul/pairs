'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
export default function Navigation() {
  const { user, signOutUser } = useAuth()

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="link">Home</Button>
        </Link>
        <Link href="/decks">
          <Button variant="link">Browse Decks</Button>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link href="/create">
              <Button variant="outline">Create Deck</Button>
            </Link>
            <Button variant="ghost" onClick={() => signOutUser()}>
              Sign Out
            </Button>
          </>
        ) : (
          <Link href="/auth">
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
    </nav>
  )
} 