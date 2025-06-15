import type { Metadata } from 'next';
import './globals.css';
import { ClientLayout } from '@/components/client-layout';

export const metadata: Metadata = {
  title: 'Pairs',
  description: 'A fun memory card matching game with custom decks',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
