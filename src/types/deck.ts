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

export const SUBJECTS = [
  {
    en: 'Mathematics',
    cy: 'Mathemateg',
    value: 'maths',
  },
  {
    en: 'English',
    cy: 'Saesneg',
    value: 'english',
  },
  {
    en: 'Science',
    cy: 'Gwyddoniaeth',
    value: 'science',
  },
  {
    en: 'History',
    cy: 'Hanes',
    value: 'history',
  },
  {
    en: 'Geography',
    cy: 'Daearyddiaeth',
    value: 'geography',
  },
  {
    en: 'Languages',
    cy: 'Leithoedd',
    value: 'languages',
  },
  {
    en: 'Other',
    cy: 'Arall',
    value: 'other',
  },
] as const;

export const YEAR_GROUPS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
] as const;
