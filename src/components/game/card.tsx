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
            'absolute flex h-full w-full items-center justify-center rounded-lg text-2xl shadow-md [backface-visibility:hidden]',
            'bg-gradient-to-br from-slate-700 to-slate-800 text-white'
          )}
        >
          {type === 'question' ? 'Q' : 'A'}
        </div>

        {/* Front of card */}
        <div
          className={cn(
            'absolute flex h-full w-full [transform:rotateY(180deg)] items-center justify-center rounded-lg text-2xl shadow-md [backface-visibility:hidden]',
            matched
              ? 'border-2 border-green-500 bg-green-100'
              : 'border-2 border-slate-200 bg-white'
          )}
        >
          {content}
        </div>
      </motion.div>
    </div>
  );
}
