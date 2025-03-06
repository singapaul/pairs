export interface GameResult {
  id: string
  userId: string
  deckId: string
  deckTitle: string
  moves: number
  timeElapsed: number
  completedAt: Date
  perfectGame: boolean
}

export interface UserStats {
  userId: string
  totalGamesPlayed: number
  perfectGames: number
  currentStreak: number
  bestStreak: number
  lastPlayedAt: Date
  bestTime: number
  bestMoves: number
  daysPlayed: string[] // Array of dates played (YYYY-MM-DD format)
} 