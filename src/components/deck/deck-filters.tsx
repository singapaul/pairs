'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SUBJECTS, YEAR_GROUPS } from '@/types/deck';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { t } from '@/lib/translations';

import { useLanguage } from '@/lib/language';
const PAIR_COUNTS = [8, 12, 16, 20];

interface DeckFilters {
  yearGroup: string | null;
  subject: string | null;
  topic: string;
  pairCount: number | null;
}

interface DeckFiltersProps {
  filters: DeckFilters;
  onChange: (filters: DeckFilters) => void;
  onReset: () => void;
  totalDecks: number;
}

export function DeckFilters({ filters, onChange, onReset, totalDecks }: DeckFiltersProps) {
  const { language } = useLanguage();

  const handleChange = (key: keyof DeckFilters, value: string | number | null) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('browse.filters', language)}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {totalDecks} {t('browse.decksFound', language)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="mr-1 h-4 w-4" />
            {t('browse.reset', language)}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <div className="w-full space-y-2 md:w-auto">
          <Label>{t('browse.yearGroup', language)}</Label>
          <Select
            value={filters.yearGroup || undefined}
            onValueChange={value => handleChange('yearGroup', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('browse.yearGroups', language)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('browse.yearGroups', language)}</SelectItem>
              {YEAR_GROUPS.map(year => (
                <SelectItem key={year} value={year}>
                  {t('filters.year', language)} {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full space-y-2 md:w-auto">
          <Label>{t('browse.subject', language)}</Label>
          <Select
            value={filters.subject || undefined}
            onValueChange={value => handleChange('subject', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('browse.allSubjects', language)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('browse.allSubjects', language)}</SelectItem>
              {SUBJECTS.map(subject => (
                <SelectItem key={subject.value} value={subject.value}>
                  {subject[language]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full space-y-2 md:w-auto">
          <Label>{t('browse.topic', language)}</Label>
          <Input
            placeholder={t('browse.topicFilter', language)}
            value={filters.topic}
            onChange={e => handleChange('topic', e.target.value)}
            className="w-full"
          />
        </div>

        <div className="w-full space-y-2 md:w-auto">
          <Label>{t('browse.numberOfPairs', language)}</Label>
          <Select
            value={filters.pairCount?.toString() || undefined}
            onValueChange={value =>
              handleChange('pairCount', value === 'all' ? null : parseInt(value))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('browse.anyNumber', language)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('browse.anyNumber', language)}</SelectItem>
              {PAIR_COUNTS.map(count => (
                <SelectItem key={count} value={count.toString()}>
                  {count} {t('browse.pairs', language)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
