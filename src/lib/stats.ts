import { db } from '@/lib/firebase'
import { 
  doc, 
  collection, 
  updateDoc, 
  increment, 
  getDoc, 
  setDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs,
  serverTimestamp
} from 'firebase/firestore'

export interface GameResult {
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
  bestTime: number
  bestMoves: number
  lastPlayedAt: Date
}

export async function saveGameResult(result: GameResult) {
  try {
    // Save the game result
    const gameRef = doc(collection(db, 'gameResults'))
    await setDoc(gameRef, {
      ...result,
      completedAt: serverTimestamp()
    })

    // Update or create user stats
    const statsRef = doc(db, 'userStats', result.userId)
    const statsDoc = await getDoc(statsRef)

    if (!statsDoc.exists()) {
      // Create new stats document
      await setDoc(statsRef, {
        userId: result.userId,
        totalGamesPlayed: 1,
        perfectGames: result.perfectGame ? 1 : 0,
        bestTime: result.timeElapsed,
        bestMoves: result.moves,
        lastPlayedAt: serverTimestamp()
      })
    } else {
      // Update existing stats
      const currentStats = statsDoc.data() as UserStats
      await updateDoc(statsRef, {
        totalGamesPlayed: increment(1),
        perfectGames: increment(result.perfectGame ? 1 : 0),
        bestTime: Math.min(result.timeElapsed, currentStats.bestTime || Infinity),
        bestMoves: Math.min(result.moves, currentStats.bestMoves || Infinity),
        lastPlayedAt: serverTimestamp()
      })
    }
  } catch (error) {
    console.error('Error saving game stats:', error)
  }
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
  try {
    const statsRef = doc(db, 'userStats', userId)
    const statsDoc = await getDoc(statsRef)
    
    if (!statsDoc.exists()) {
      return null
    }

    return statsDoc.data() as UserStats
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return null
  }
}

export async function getRecentGames(userId: string): Promise<GameResult[]> {
  try {
    const q = query(
      collection(db, 'gameResults'),
      where('userId', '==', userId),
      orderBy('completedAt', 'desc'),  
      limit(5)
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      ...doc.data()
    })) as GameResult[]
  } catch (error) {
    console.error('Error fetching recent games:', error)
    return []
  }
} 