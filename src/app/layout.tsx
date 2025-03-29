import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/navigation';
import { AuthProvider } from '@/lib/auth';
import { Sonner } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pairs',
  description: 'A fun memory card matching game with custom decks',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex h-screen">
            {/* Sidebar - fixed full height */}
            <div className="hidden h-full w-64 border-r md:block">
              <Navigation className="h-full" />
            </div>

            {/* Main content area */}
            <div className="w-full md:w-[calc(100%-16rem)]">
              <div className="md:hidden">
                <Navigation />
              </div>
              {children}
            </div>
          </div>
          <Sonner />
        </AuthProvider>
      </body>
    </html>
  );
}
