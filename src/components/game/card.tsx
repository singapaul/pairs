'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  content: string;
  isFlipped: boolean;
  onClick: () => void;
  disabled?: boolean;
  matched?: boolean;
  type?: 'question' | 'answer';
}

export default function Card({ content, isFlipped, onClick, disabled, matched, type }: CardProps) {
  return (
    <div
      className={cn(
        'relative aspect-square w-full',
        !disabled && 'cursor-pointer',
        disabled && 'cursor-default'
      )}
      onClick={() => !disabled && onClick()}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="h-full w-full [transform-style:preserve-3d]"
      >
        {/* Back of card */}
        <div
          className={cn(
            'absolute flex h-full w-full items-center justify-center rounded-lg text-base shadow-md [backface-visibility:hidden] sm:text-lg md:text-xl lg:text-2xl',
            'bg-gradient-to-br from-slate-700 to-slate-800 text-white'
          )}
        >
          {type === 'question' ? 'Q' : 'A'}
        </div>

        {/* Front of card */}
        <div
          className={cn(
            'absolute flex h-full w-full [transform:rotateY(180deg)] items-center justify-center rounded-lg shadow-md [backface-visibility:hidden] sm:text-sm md:text-base',
            matched
              ? 'border-2 border-green-500 bg-green-100'
              : 'border-2 border-slate-200 bg-white'
          )}
        >
          <div className="flex h-full w-full items-center justify-center p-2">
            <div className="line-clamp-5 w-full text-center leading-tight break-words hyphens-auto">
              {content}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
