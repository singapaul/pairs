'use client';

import { useEffect, useState, use } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Loader2, Plus, Trash2, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardPair } from '@/types/deck';
import { v4 as uuidv4 } from 'uuid';

interface DeckFormData {
  title: string;
  description: string;
  subject: string;
  yearGroup: string;
  topic: string;
  isPublic: boolean;
  cards: Card[];
  plays: number;
}

const SUBJECTS = ['Mathematics', 'English', 'Science', 'History', 'Geography'];
const YEAR_GROUPS = ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'];

interface CardPairFormData extends CardPair {
  isNew?: boolean;
}

export default function EditDeckPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [formData, setFormData] = useState<DeckFormData>({
    title: '',
    description: '',
    subject: '',
    yearGroup: '',
    topic: '',
    isPublic: false,
    cards: [],
    plays: 0,
  });
  const [cardPairs, setCardPairs] = useState<CardPairFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchDeck = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const deckRef = doc(db, 'decks', resolvedParams.id);
        const deckSnap = await getDoc(deckRef);

        if (!deckSnap.exists()) {
          setError('Deck not found');
          return;
        }

        const deckData = deckSnap.data();
        if (deckData.userId !== user.uid) {
          setError('You do not have permission to edit this deck');
          return;
        }

        // Convert cards array to card pairs
        const pairs: { [key: string]: CardPair } = {};
        deckData.cards.forEach((card: Card) => {
          if (!pairs[card.pairId]) {
            pairs[card.pairId] = {
              id: card.pairId,
              question: '',
              answer: '',
            };
          }
          // Remove "Q: " and "A: " prefixes when setting the content
          const content = card.content.replace(/^(Q|A): /, '');
          if (card.content.startsWith('Q:')) {
            pairs[card.pairId].question = content;
          } else if (card.content.startsWith('A:')) {
            pairs[card.pairId].answer = content;
          }
        });

        setCardPairs(Object.values(pairs));
        setFormData({
          title: deckData.title || '',
          description: deckData.description || '',
          subject: deckData.subject || '',
          yearGroup: deckData.yearGroup || '',
          topic: deckData.topic || '',
          isPublic: deckData.isPublic || false,
          cards: deckData.cards || [],
          plays: deckData.plays || 0,
        });
      } catch (error) {
        console.error('Error fetching deck:', error);
        setError('Failed to load deck. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    void fetchDeck();
  }, [resolvedParams.id, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate all pairs are filled
    const isValid = cardPairs.every(pair => pair.question.trim() && pair.answer.trim());
    if (!isValid) {
      toast.error('Please fill in all question-answer pairs');
      return;
    }

    try {
      setSaving(true);

      // Convert card pairs to cards array
      const cards: Card[] = cardPairs.flatMap(pair => [
        {
          id: uuidv4(),
          pairId: pair.id,
          content: `Q: ${pair.question}`,
          type: 'question' as const,
        },
        { id: uuidv4(), pairId: pair.id, content: `A: ${pair.answer}`, type: 'answer' as const },
      ]);

      const deckRef = doc(db, 'decks', resolvedParams.id);
      await updateDoc(deckRef, {
        ...formData,
        cards: cards.sort(() => Math.random() - 0.5), // Shuffle cards
        updatedAt: new Date(),
      });
      toast.success('Deck updated successfully');
      router.push('/decks/my-decks');
    } catch (error) {
      console.error('Error updating deck:', error);
      toast.error('Failed to update deck');
    } finally {
      setSaving(false);
    }
  };

  const addCardPair = () => {
    setCardPairs(prev => [
      ...prev,
      {
        id: uuidv4(),
        question: '',
        answer: '',
        isNew: true,
      },
    ]);
  };

  const updateCardPair = (id: string, field: 'question' | 'answer', value: string) => {
    setCardPairs(prev => prev.map(pair => (pair.id === id ? { ...pair, [field]: value } : pair)));
  };

  const removeCardPair = (index: number) => {
    setCardPairs(prev => prev.filter((_, i) => i !== index));
  };

  if (!user) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p>Sign in to edit decks!</p>
        <Button asChild>
          <Link href="/auth">Sign In</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Loading deck...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-16 max-w-3xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Deck</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <PlayCircle className="h-4 w-4" />
          <span>Played {formData.plays} times</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={formData.subject}
                onValueChange={value => setFormData(prev => ({ ...prev, subject: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearGroup">Year Group</Label>
              <Select
                value={formData.yearGroup}
                onValueChange={value => setFormData(prev => ({ ...prev, yearGroup: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year group" />
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
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={formData.topic}
              onChange={e => setFormData(prev => ({ ...prev, topic: e.target.value }))}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={checked => setFormData(prev => ({ ...prev, isPublic: checked }))}
            />
            <Label htmlFor="isPublic">Make deck public</Label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Cards</h2>
            <Button type="button" onClick={addCardPair} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Card Pair
            </Button>
          </div>

          <div className="space-y-4">
            {cardPairs.map((pair, index) => (
              <div
                key={pair.id}
                className="relative flex items-start gap-4 rounded-lg bg-gray-50 p-4"
              >
                <div className="w-6 flex-none font-medium text-gray-400">{index + 1}.</div>
                <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    value={pair.question}
                    onChange={e => updateCardPair(pair.id, 'question', e.target.value)}
                    placeholder="Question"
                    className="bg-white"
                  />
                  <Input
                    value={pair.answer}
                    onChange={e => updateCardPair(pair.id, 'answer', e.target.value)}
                    placeholder="Answer"
                    className="bg-white"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2"
                  onClick={() => removeCardPair(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-x-4 pt-4">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
