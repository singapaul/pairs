// Database Types
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      decks: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string | null;
          user_id: string;
          is_public: boolean;
          cards: Card[];
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          description?: string | null;
          user_id: string;
          is_public?: boolean;
          cards: Card[];
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string | null;
          user_id?: string;
          is_public?: boolean;
          cards?: Card[];
        };
      };
      scores: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          deck_id: string;
          time: number;
          moves: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          deck_id: string;
          time: number;
          moves: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          deck_id?: string;
          time?: number;
          moves?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Deck Types
export interface Card {
  id: string;
  content: string;
  pairId: string;
  type: 'question' | 'answer';
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  cards: Card[];
  userId: string;
  createdAt: Date;
  isPublic: boolean;
  yearGroup: string;
  subject: string;
  topic: string;
  plays: number; // Total number of times played
}

export interface CardPair {
  id: string;
  question: string;
  answer: string;
}

export interface DeckMetadata {
  title: string;
  description: string;
  subject: string;
  yearGroup: string;
  topic: string;
  isPublic: boolean;
}

// Game Types
export interface GameResult {
  id: string;
  userId: string;
  deckId: string;
  deckTitle: string;
  moves: number;
  timeElapsed: number;
  completedAt: Date;
  perfectGame: boolean;
}

export interface UserStats {
  userId: string;
  totalGamesPlayed: number;
  perfectGames: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayedAt: Date;
  bestTime: number;
  bestMoves: number;
  daysPlayed: string[]; // Array of dates played (YYYY-MM-DD format)
}

// Component Props Types
export interface DeckCardProps {
  deck: Deck;
  showPlayAgain?: boolean;
  showEditOptions?: boolean;
  onDeleteClick?: (deck: Deck) => void;
}

export interface CardGameProps {
  cards: Card[];
  deckTitle: string;
  deckId: string;
  onRestart?: () => void;
  shouldStartAnimation?: boolean;
}

export interface DeckFiltersProps {
  filters: DeckFilters;
  onChange: (filters: DeckFilters) => void;
  onReset: () => void;
  totalDecks: number;
}

// Filter Types
export interface DeckFilters {
  yearGroup: string | null;
  subject: string | null;
  topic: string;
  pairCount: number | null;
}

// Constants
export const SUBJECTS = [
  'Mathematics',
  'English',
  'Science',
  'History',
  'Geography',
  'Languages',
  'Other',
] as const;

export const YEAR_GROUPS = [
  'Year 1',
  'Year 2',
  'Year 3',
  'Year 4',
  'Year 5',
  'Year 6',
  'Year 7',
  'Year 8',
  'Year 9',
  'Year 10',
  'Year 11',
  'Year 12',
  'Year 13',
] as const;
