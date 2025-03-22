'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth'
import { Loader2 } from 'lucide-react'

export default function SignInForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [guestLoading, setGuestLoading] = useState(false)
  const { signInWithEmail, signInAnonymously } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signInWithEmail(email)
    } finally {
      setLoading(false)
    }
  }

  const handleGuestSignIn = async () => {
    setGuestLoading(true)
    try {
      await signInAnonymously()
    } finally {
      setGuestLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending link...
            </>
          ) : (
            'Sign in with Email Magic Link'
          )}
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or</span>
        </div>
      </div>

      <Button
        onClick={handleGuestSignIn}
        className="w-full"
        variant="outline"
        disabled={guestLoading}
      >
        {guestLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Continue as Guest'
        )}
      </Button>

      {process.env.NODE_ENV === 'development' && (
        <p className="mt-4 text-xs text-center text-gray-500">
          Guest accounts are for testing purposes only and may be deleted periodically.
        </p>
      )}
    </div>
  )
} 