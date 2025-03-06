'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast.error('Please sign in to access this page')
        router.push('/auth')
      }
      setIsChecking(false)
    }
  }, [user, loading, router])

  if (loading || isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Checking authentication...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
} 