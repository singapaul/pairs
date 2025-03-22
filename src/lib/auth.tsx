'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged, signOut, sendSignInLinkToEmail, signInAnonymously } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOutUser: () => Promise<void>
  isAdmin: boolean
  signInWithEmail: (email: string) => Promise<void>
  signInAnonymously: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOutUser: async () => {},
  isAdmin: false,
  signInWithEmail: async () => {},
  signInAnonymously: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      // Check if user is admin (you can customize this based on your needs)
      if (user) {
        const token = await user.getIdTokenResult()
        setIsAdmin(token.claims.admin === true)
      } else {
        setIsAdmin(false)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signOutUser = async () => {
    try {
      await signOut(auth)
      toast.success('Signed out successfully')
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out')
    }
  }

  const signInWithEmail = async (email: string) => {
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/auth/verify`,
        handleCodeInApp: true
      }

      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      window.localStorage.setItem('emailForSignIn', email)
      toast.success('Check your email for the sign in link!')
    } catch (error) {
      console.error('Error sending sign in link:', error)
      toast.error('Failed to send sign in link')
    }
  }

  const handleAnonymousSignIn = async () => {
    try {
      await signInAnonymously(auth)
      toast.success('Signed in as guest')
    } catch (error) {
      console.error('Error signing in anonymously:', error)
      toast.error('Failed to sign in as guest')
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        signOutUser, 
        isAdmin,
        signInWithEmail,
        signInAnonymously: handleAnonymousSignIn
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Custom hook for protected routes
export function useRequireAuth() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  return { user, loading }
}

// Custom hook for admin routes
export function useRequireAdmin() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/')
      toast.error('You do not have permission to access this page')
    }
  }, [user, loading, isAdmin, router])

  return { user, loading, isAdmin }
} 