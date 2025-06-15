'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/types/deck';
import CardComponent from './card';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/lib/language';
import { t } from '@/lib/translations';
interface PreGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (previewTime: number) => void;
  cards: Card[];
}

export default function PreGameModal({ isOpen, onClose, onStart, cards }: PreGameModalProps) {
  const [demoCards, setDemoCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPair, setMatchedPair] = useState<string | null>(null);
  const [previewTime, setPreviewTime] = useState(5);
  const { language } = useLanguage();
  // Select two random pairs for the demo
  useEffect(() => {
    if (cards.length > 0) {
      const uniquePairs = cards.reduce((acc, card) => {
        if (!acc.some(c => c.pairId === card.pairId)) {
          acc.push(card);
        }
        return acc;
      }, [] as Card[]);

      // Shuffle and take two pairs
      const shuffled = [...uniquePairs].sort(() => Math.random() - 0.5);
      const selectedPairs = shuffled.slice(0, 2);

      // Get both cards for each pair
      const demoCards = selectedPairs.flatMap(pair =>
        cards.filter(card => card.pairId === pair.pairId)
      );

      setDemoCards(demoCards);
    }
  }, [cards]);

  // Demo animation sequence
  useEffect(() => {
    if (demoCards.length > 0) {
      let isMounted = true;
      let animationTimeout: NodeJS.Timeout;

      const startDemo = async () => {
        try {
          // Wait 1 second before starting
          await new Promise(resolve => {
            animationTimeout = setTimeout(resolve, 1000);
          });
          if (!isMounted) return;

          // Flip first card
          setFlippedCards([demoCards[0].id]);
          await new Promise(resolve => {
            animationTimeout = setTimeout(resolve, 1000);
          });
          if (!isMounted) return;

          // Flip second card
          setFlippedCards([demoCards[0].id, demoCards[2].id]);
          await new Promise(resolve => {
            animationTimeout = setTimeout(resolve, 1000);
          });
          if (!isMounted) return;

          // Unflip cards
          setFlippedCards([]);
          await new Promise(resolve => {
            animationTimeout = setTimeout(resolve, 1000);
          });
          if (!isMounted) return;

          // Flip first card of second pair
          setFlippedCards([demoCards[2].id]);
          await new Promise(resolve => {
            animationTimeout = setTimeout(resolve, 1000);
          });
          if (!isMounted) return;

          // Flip second card of second pair
          setFlippedCards([demoCards[2].id, demoCards[3].id]);
          await new Promise(resolve => {
            animationTimeout = setTimeout(resolve, 1000);
          });
          if (!isMounted) return;

          // Match the pair
          setMatchedPair(demoCards[2].pairId);
          await new Promise(resolve => {
            animationTimeout = setTimeout(resolve, 1000);
          });
          if (!isMounted) return;

          // Reset for next demo
          setMatchedPair(null);
          setFlippedCards([]);
        } catch (error) {
          console.error('Animation error:', error);
        }
      };

      void startDemo();

      return () => {
        isMounted = false;
        if (animationTimeout) {
          clearTimeout(animationTimeout);
        }
      };
    }
  }, [demoCards]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg sm:text-xl">{t('pregame.title', language)}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {t('pregame.description', language)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Demo Cards */}
          <div className="mx-auto grid max-w-[250px] grid-cols-2 gap-2 p-1">
            {demoCards.map(card => (
              <CardComponent
                key={card.id}
                content={card.content}
                shouldFlip={flippedCards.includes(card.id)}
                onClick={() => {}}
                disabled={true}
                matched={matchedPair === card.pairId}
              />
            ))}
          </div>

          {/* Preview Time Selection */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold sm:text-sm">
              {t('pregame.previewTime', language)}
            </h3>
            <div className="space-y-2 p-3">
              <Slider
                value={[previewTime]}
                onValueChange={([value]) => setPreviewTime(value)}
                min={0}
                max={15}
                step={5}
                className="w-full"
              />
              <div className="text-muted-foreground text-center text-xs">
                {previewTime === 0
                  ? t('pregame.alwaysShowCards', language)
                  : `${previewTime} ${t('pregame.previewSeconds', language)}`}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <div className="space-y-1">
              <h3 className="text-xs font-semibold sm:text-sm">
                {t('pregame.rules.title', language)}
              </h3>
              <ul className="list-disc space-y-0.5 pl-3 text-xs sm:text-sm">
                {t('pregame.rules.list', language)
                  .split('\n')
                  .map(line => (
                    <li key={line}>{line}</li>
                  ))}
              </ul>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-semibold sm:text-sm">
                {t('pregame.tips.title', language)}
              </h3>
              <ul className="list-disc space-y-0.5 pl-3 text-xs sm:text-sm">
                {t('pregame.tips.list', language)
                  .split('\n')
                  .map(line => (
                    <li key={line}>{line}</li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              {t('pregame.cancel', language)}
            </Button>
            <Button size="sm" onClick={() => onStart(previewTime)}>
              {t('pregame.start', language)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
