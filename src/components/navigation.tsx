'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import PairsLogo from '@/assets/PairsLogo.svg'
import Image from 'next/image'

interface NavigationProps {
  onToggleSidebar?: () => void
}

export default function Navigation({ onToggleSidebar }: NavigationProps) {
  const { user, signOutUser } = useAuth()
  const pathname = usePathname()
  const isDecksPage = pathname?.startsWith('/decks')

  return (
    <nav className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-white shadow-sm z-50">
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
        <Link href="/decks" className="flex items-center">
          <Image
            src={PairsLogo}
            alt="Pairs Logo"
            className="h-6 w-auto"
            priority
          />
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