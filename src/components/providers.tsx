'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth';
import { LanguageProvider } from '@/lib/language';
import { Sonner } from '@/components/ui/sonner';
import { Toaster } from 'sonner';
import { Navigation } from '@/components/navigation';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Navigation />
        <main className="container mx-auto px-4 py-8">{children}</main>
        <Sonner />
        <Toaster />
      </AuthProvider>
    </LanguageProvider>
  );
}
