'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { getUserStats, getRecentGames, UserStats, GameResult } from '@/lib/stats'
import { Loader2 } from 'lucide-react'
import ProtectedRoute from '@/components/auth/protected-route'

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export default function StatsPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [recentGames, setRecentGames] = useState<GameResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      if (!user) return

      try {
        const [userStats, games] = await Promise.all([
          getUserStats(user.uid),
          getRecentGames(user.uid)
        ])

        setStats(userStats)
        setRecentGames(games)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    void fetchStats()
  }, [user])

  return (
    <ProtectedRoute>
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : !stats ? (
        <div className="text-center py-8">
          <p>Play some games to see your stats!</p>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">Your Stats</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-semibold mb-2">Total Games</h2>
              <p className="text-2xl">{stats.totalGamesPlayed}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-semibold mb-2">Perfect Games</h2>
              <p className="text-2xl">{stats.perfectGames}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-semibold mb-2">Best Time</h2>
              <p className="text-2xl">{formatTime(stats.bestTime)}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-semibold mb-2">Best Moves</h2>
              <p className="text-2xl">{stats.bestMoves}</p>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4">Recent Games</h2>
          {recentGames.length > 0 ? (
            <div className="space-y-4">
              {recentGames.map((game, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold">{game.deckTitle}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>Moves: {game.moves}</p>
                    <p>Time: {formatTime(game.timeElapsed)}</p>
                    {game.perfectGame && (
                      <p className="text-green-600 font-medium">Perfect Game! 🎉</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No recent games found</p>
          )}
        </>
      )}
    </ProtectedRoute>
  )
} 