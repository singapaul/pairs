export interface Card {
  id: string
  content: string
  pairId: string
}

export interface Deck {
  id: string
  title: string
  description: string
  cards: Card[]
  userId: string
  createdAt: Date
  isPublic: boolean
  yearGroup: string
  subject: string
  topic: string
  plays: number // Total number of times played
}

export interface CardPair {
  id: string
  question: string
  answer: string
}

export interface DeckMetadata {
  title: string
  description: string
  subject: string
  yearGroup: string
  topic: string
  isPublic: boolean
}

export const SUBJECTS = [
  'Mathematics',
  'English',
  'Science',
  'History',
  'Geography',
  'Languages',
  'Other'
] as const

export const YEAR_GROUPS = [
  'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
  'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11',
  'Year 12', 'Year 13'
] as const 