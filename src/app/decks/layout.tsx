'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Library,
  Clock,
  Star,
  FolderEdit,
  BarChart2,
  MessageSquare,
  ExternalLink,
  LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { t } from '@/lib/translations';

import { useLanguage } from '@/lib/language';
interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
}

export default function DecksLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();

  const sidebarItems: SidebarItem[] = [
    {
      title: t('sidebar.library', language),
      href: '/decks',
      icon: Library,
    },
    {
      title: t('sidebar.recentlyPlayed', language),
      href: '/decks/recent',
      icon: Clock,
    },
    {
      title: t('sidebar.favourites', language),
      href: '/decks/favorites',
      icon: Star,
    },
  ];

  const authenticatedItems: SidebarItem[] = [
    {
      title: t('sidebar.myDecks', language),
      href: '/decks/my-decks',
      icon: FolderEdit,
    },
    {
      title: t('sidebar.myStats', language),
      href: '/decks/stats',
      icon: BarChart2,
    },
  ];

  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const allSidebarItems = [
    ...sidebarItems,
    ...(user ? authenticatedItems : []),
    {
      title: t('sidebar.feedback', language),
      href: 'https://docs.google.com/forms/d/1qj9At1Q7msgXO_x_1RXs7dLVtBnRSLxFZjRSs63c698/viewform?edit_requested=true',
      icon: MessageSquare,
      external: true,
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="flex">
        {/* Sidebar */}
        <div
          className={cn(
            'bg-background fixed top-16 bottom-0 left-0 z-40 w-64 transform border-r transition-transform duration-200 ease-in-out lg:static lg:inset-auto lg:translate-x-0 lg:transform-none',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <nav className="space-y-2 p-4">
            {allSidebarItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-gray-100 font-medium text-gray-900'
                      : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                  {item.external && <ExternalLink className="ml-auto h-3 w-3" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
