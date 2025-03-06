export interface Deck {
  id: string
  title: string
  description: string
  cards: Card[]
  userId: string
  createdAt: Date
  isPublic: boolean
  plays: number // Total number of times played
} 