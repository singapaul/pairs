'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface NavigationProps {
  onToggleSidebar?: () => void
}

export default function Navigation({ onToggleSidebar }: NavigationProps) {
  const { user, signOutUser } = useAuth()
  const pathname = usePathname()
  const isDecksPage = pathname?.startsWith('/decks')

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        {isDecksPage && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
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
            <Link href="/stats">
              <Button variant="link">My Stats</Button>
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