'use client';

import SignInForm from '@/components/auth/sign-in-form';
import { useLanguage } from '@/lib/language';
import { t } from '@/lib/translations';

export default function AuthPage() {
  const { language } = useLanguage();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="w-full max-w-md p-6">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold">{t('signIn.welcome', language)}</h1>
          <p className="text-gray-600">{t('signIn.message', language)}</p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
