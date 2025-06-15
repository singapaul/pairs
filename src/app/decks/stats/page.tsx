'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { getUserStats, getRecentGames, UserStats, GameResult } from '@/lib/stats';
import { Loader2 } from 'lucide-react';
import ProtectedRoute from '@/components/auth/protected-route';
import { useLanguage } from '@/lib/language';
import { t } from '@/lib/translations';

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function StatsPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentGames, setRecentGames] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;

      try {
        const [userStats, games] = await Promise.all([
          getUserStats(user.uid),
          getRecentGames(user.uid),
        ]);

        setStats(userStats);
        setRecentGames(games);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    void fetchStats();
  }, [user]);

  return (
    <ProtectedRoute>
      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : !stats ? (
        <div className="py-8 text-center">
          <p>{t('myStats.playSomeGames', language)}</p>
        </div>
      ) : (
        <>
          <h1 className="mb-6 text-2xl font-bold">{t('myStats.title', language)}</h1>

          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-white p-4 shadow">
              <h2 className="mb-2 font-semibold">{t('myStats.totalGames', language)}</h2>
              <p className="text-2xl">{stats.totalGamesPlayed}</p>
            </div>

            <div className="rounded-lg bg-white p-4 shadow">
              <h2 className="mb-2 font-semibold">{t('myStats.perfectGames', language)}</h2>
              <p className="text-2xl">{stats.perfectGames}</p>
            </div>

            <div className="rounded-lg bg-white p-4 shadow">
              <h2 className="mb-2 font-semibold">{t('myStats.bestTime', language)}</h2>
              <p className="text-2xl">{formatTime(stats.bestTime)}</p>
            </div>

            <div className="rounded-lg bg-white p-4 shadow">
              <h2 className="mb-2 font-semibold">{t('myStats.bestMoves', language)}</h2>
              <p className="text-2xl">{stats.bestMoves}</p>
            </div>
          </div>

          <h2 className="mb-4 text-xl font-bold">{t('myStats.recentGames', language)}</h2>
          {recentGames.length > 0 ? (
            <div className="space-y-4">
              {recentGames.map((game, index) => (
                <div key={index} className="rounded-lg bg-white p-4 shadow">
                  <h3 className="font-semibold">{game.deckTitle}</h3>
                  <div className="mt-1 text-sm text-gray-600">
                    <p>Moves: {game.moves}</p>
                    <p>Time: {formatTime(game.timeElapsed)}</p>
                    {game.perfectGame && (
                      <p className="font-medium text-green-600">
                        {t('myStats.perfectGame', language)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">{t('myStats.noRecentGames', language)}</p>
          )}
        </>
      )}
    </ProtectedRoute>
  );
}
