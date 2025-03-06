'use client'

// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";
import { AuthProvider } from "@/lib/auth";
import { Sonner } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Memory Card Game",
//   description: "A fun memory card matching game with custom decks",
// };

  

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <Sonner />
        </AuthProvider>
      </body>
    </html>
  );
}
