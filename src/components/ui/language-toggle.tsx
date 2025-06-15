'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'cy' : 'en')}
      className="w-16"
    >
      {language === 'en' ? 'Cymraeg' : 'English'}
    </Button>
  );
}
