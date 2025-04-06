'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import pairsLogo from '@/assets/PairsLogo.svg';

interface CardProps {
  content: string;
  onClick: () => void;
  disabled?: boolean;
  matched?: boolean;
  selected?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  className?: string;
  imageUrl?: string;
  shouldFlip?: boolean;
}

export default function CardComponent({
  content,
  onClick,
  disabled = false,
  matched = false,
  selected = false,
  isCorrect = false,
  isWrong = false,
  className,
  imageUrl,
  shouldFlip = false,
}: CardProps) {
  const [imageError, setImageError] = useState(false);
  const [flipped, setFlipped] = useState(false);

  // Handle flip animation when shouldFlip changes
  useEffect(() => {
    if (shouldFlip) {
      setFlipped(true);
    }
  }, [shouldFlip]);

  return (
    <div
      className={cn(
        'perspective-1000 relative aspect-square h-full w-full cursor-pointer',
        disabled && 'cursor-not-allowed',
        className
      )}
      onClick={disabled ? undefined : onClick}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className={cn(
          'relative h-full w-full rounded-lg transition-transform [transform-style:preserve-3d]',
          matched && 'border-2 border-green-500 bg-green-50',
          !matched && selected && 'border-2 border-blue-500',
          !matched && isCorrect && 'border-2 border-green-500',
          !matched && isWrong && 'border-2 border-red-500'
          // disabled && 'opacity-50'
        )}
      >
        {/* Front of card (logo) */}
        <div className="absolute inset-0 flex h-full w-full items-center justify-center rounded-lg border bg-white p-4 shadow-sm [backface-visibility:hidden]">
          <div className="relative h-16 w-16">
            <Image src={pairsLogo} alt="Pairs Logo" fill className="object-contain" priority />
          </div>
        </div>

        {/* Back of card (content) */}
        <div className="absolute inset-0 flex h-full w-full [transform:rotateY(180deg)] items-center justify-center rounded-lg border bg-white p-4 shadow-sm [backface-visibility:hidden]">
          {imageUrl && !imageError ? (
            <div className="relative h-full w-full">
              <Image
                src={imageUrl}
                alt={content}
                fill
                className="rounded-lg object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => setImageError(true)}
                priority
              />
            </div>
          ) : (
            <p className="text-center text-lg font-medium">{content}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
