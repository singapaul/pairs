'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps {
  content: string
  isFlipped: boolean
  onClick: () => void
  disabled?: boolean
  matched?: boolean
}

export default function Card({ content, isFlipped, onClick, disabled, matched }: CardProps) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full",
        !disabled && "cursor-pointer",
        disabled && "cursor-default"
      )}
      onClick={() => !disabled && onClick()}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="w-full h-full [transform-style:preserve-3d]"
      >
        {/* Back of card */}
        <div 
          className={cn(
            "absolute w-full h-full [backface-visibility:hidden] rounded-lg flex items-center justify-center text-2xl shadow-md",
            "bg-gradient-to-br from-slate-700 to-slate-800 text-white"
          )}
        >
          ?
        </div>
        
        {/* Front of card */}
        <div 
          className={cn(
            "absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-lg flex items-center justify-center text-2xl shadow-md",
            matched ? "bg-green-100 border-2 border-green-500" : "bg-white border-2 border-slate-200",
          )}
        >
          {content}
        </div>
      </motion.div>
    </div>
  )
} 