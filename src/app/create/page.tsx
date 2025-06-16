'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { collection, addDoc } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { CardPair, DeckMetadata, SUBJECTS, YEAR_GROUPS } from '@/types/deck';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/types/deck';
import { useLanguage } from '@/lib/language';
import { t } from '@/lib/translations';

export default function CreateDeckPage() {
  const { language } = useLanguage();
  const PAIR_OPTIONS = [8, 12, 16, 20];

  const [step, setStep] = useState(1);
  const [numPairs, setNumPairs] = useState<(typeof PAIR_OPTIONS)[number]>(8);
  const [pairs, setPairs] = useState<CardPair[]>([]);
  const [metadata, setMetadata] = useState<DeckMetadata>({
    title: '',
    description: '',
    subject: '',
    yearGroup: '',
    topic: '',
    isPublic: true,
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const updatePair = (id: string, field: 'question' | 'answer', value: string) => {
    setPairs(prev => prev.map(pair => (pair.id === id ? { ...pair, [field]: value } : pair)));
  };

  const initializePairs = (count: number) => {
    const newPairs = Array.from({ length: count }, () => ({
      id: uuidv4(),
      question: '',
      answer: '',
    }));
    setPairs(newPairs);
  };

  const handleNext = () => {
    if (step === 1) {
      initializePairs(numPairs);
      setStep(2);
    } else if (step === 2) {
      // Validate all pairs are filled
      const isValid = pairs.every(pair => pair.question.trim() && pair.answer.trim());
      if (!isValid) {
        toast.error(t('create.fillInAllFields', language));
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error(t('create.signInToCreate', language));
      router.push('/auth');
      return;
    }

    if (!metadata.title.trim() || !metadata.description.trim()) {
      toast.error(t('create.fillInRequiredFields', language));
      return;
    }

    try {
      setLoading(true);

      // Convert pairs to cards array
      const cards: Card[] = pairs.flatMap(pair => [
        { id: uuidv4(), content: `Q: ${pair.question}`, pairId: pair.id, type: 'question' },
        { id: uuidv4(), content: `A: ${pair.answer}`, pairId: pair.id, type: 'answer' },
      ]);

      const deck = {
        ...metadata,
        cards: cards.sort(() => Math.random() - 0.5), // Shuffle cards
        userId: user.uid,
        createdAt: new Date(),
        plays: 0, // Initialize plays count
      };

      await addDoc(collection(getDb(), 'decks'), deck);
      toast.success(t('create.deckCreatedSuccessfully', language));
      router.push('/decks');
    } catch (error) {
      console.error('Error creating deck:', error);
      toast.error(t('create.failedToCreateDeck', language));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-3xl p-4">
      <div className="mb-8">
        <Progress value={step * 33.33} className="h-2" />
        <p className="mt-2 text-sm text-gray-500">
          {t('create.step', language)} {step} {t('create.of', language)} 3
        </p>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">{t('create.howManyPairs', language)}</h1>
          <RadioGroup
            value={numPairs.toString()}
            onValueChange={value => setNumPairs(Number(value) as (typeof PAIR_OPTIONS)[number])}
            className="grid grid-cols-2 gap-4"
          >
            {PAIR_OPTIONS.map(num => (
              <div key={num}>
                <RadioGroupItem
                  value={num.toString()}
                  id={`pairs-${num}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`pairs-${num}`}
                  className="border-muted hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex flex-col items-center justify-center rounded-lg border-2 p-4"
                >
                  <span className="text-2xl font-bold">{num}</span>
                  <span className="text-muted-foreground text-sm">
                    {t('create.pairs', language)}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">{t('create.enterCardPairs', language)}</h1>
          <div className="space-y-4">
            {pairs.map((pair, index) => (
              <div key={pair.id} className="flex items-start gap-4 rounded-lg bg-gray-50 p-4">
                <div className="w-6 flex-none font-medium text-gray-400">{index + 1}.</div>
                <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    value={pair.question}
                    onChange={e => updatePair(pair.id, 'question', e.target.value)}
                    placeholder={t('create.question', language)}
                    className="bg-white"
                  />
                  <Input
                    value={pair.answer}
                    onChange={e => updatePair(pair.id, 'answer', e.target.value)}
                    placeholder={t('create.answer', language)}
                    className="bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-2xl font-bold">{t('create.deckDetails', language)}</h1>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t('create.deckTitle', language)}</Label>
              <Input
                id="title"
                value={metadata.title}
                onChange={e => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                placeholder={t('create.enterDeckTitle', language)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('create.deckDescription', language)}</Label>
              <Textarea
                id="description"
                value={metadata.description}
                onChange={e => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t('create.enterDeckDescription', language)}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="subject">{t('create.subject', language)}</Label>
                <Select
                  value={metadata.subject}
                  onValueChange={value => setMetadata(prev => ({ ...prev, subject: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('create.selectSubject', language)} />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map(subject => (
                      <SelectItem key={subject.value} value={subject.value}>
                        {language === 'en' ? subject.en : subject.cy}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearGroup">{t('create.yearGroup', language)}</Label>
                <Select
                  value={metadata.yearGroup}
                  onValueChange={value => setMetadata(prev => ({ ...prev, yearGroup: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('create.selectYearGroup', language)} />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_GROUPS.map(year => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">{t('create.deckTopic', language)}</Label>
              <Input
                id="topic"
                value={metadata.topic}
                onChange={e => setMetadata(prev => ({ ...prev, topic: e.target.value }))}
                placeholder={t('create.enterDeckTopic', language)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="public"
                checked={metadata.isPublic}
                onCheckedChange={checked => setMetadata(prev => ({ ...prev, isPublic: checked }))}
              />
              <Label htmlFor="public">{t('create.public', language)}</Label>
            </div>
          </div>
        </form>
      )}

      <div className="mt-8 flex justify-between">
        {step > 1 ? (
          <Button type="button" variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('create.back', language)}
          </Button>
        ) : (
          <div></div>
        )}

        {step < 3 ? (
          <Button onClick={handleNext}>
            {t('create.next', language)}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('create.creating', language)}
              </>
            ) : (
              t('create.createDeck', language)
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
