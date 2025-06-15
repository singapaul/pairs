'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import PairsLogo from '@/assets/PairsLogo.svg';
import Image from 'next/image';
import { useLanguage } from '@/lib/language';
import { t } from '@/lib/translations';
export default function Home() {
  const { user } = useAuth();
  const { language } = useLanguage();
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 text-center sm:px-20">
        <Image src={PairsLogo} alt="Pairs Logo" className="mb-8 w-48" priority />
        <p className="max-w-2xl text-xl text-gray-600">{t('home.title', language)}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/decks">
            <Button size="lg">{t('home.browse', language)}</Button>
          </Link>
          {user && (
            <Link href="/create">
              <Button size="lg" variant="outline">
                {t('home.create', language)}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
