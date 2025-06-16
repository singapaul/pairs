'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { useLanguage } from '@/lib/language';
import { t } from '@/lib/translations';
import { Menu } from 'lucide-react';
import PairsLogo from '@/assets/PairsLogo.svg';
import Image from 'next/image';

interface NavigationProps {
  onToggleSidebar?: () => void;
}

export function Navigation({ onToggleSidebar }: NavigationProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { language } = useLanguage();
  const isDecksPage = pathname?.startsWith('/decks');

  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          {isDecksPage && (
            <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          )}

          <Link href="/decks" className="flex items-center">
            <Image src={PairsLogo} alt="Pairs Logo" className="h-6 w-auto" priority />
          </Link>

          {user && (
            <>
              <Link
                href="/create"
                className={cn(
                  'hover:text-primary text-sm font-medium transition-colors',
                  pathname === '/create' ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {t('nav.create', language)}
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <LanguageToggle />
          {user ? (
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              {t('nav.signOut', language)}
            </Button>
          ) : (
            <Link href="/auth">
              <Button variant="ghost" size="sm">
                {t('nav.signIn', language)}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
