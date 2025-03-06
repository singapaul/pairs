'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { auth } from '@/lib/firebase'
import { sendSignInLinkToEmail } from 'firebase/auth'
import { toast } from 'sonner'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Store the email in localStorage for verification
      window.localStorage.setItem('emailForSignIn', email)

      const actionCodeSettings = {
        // This URL must be whitelisted in the Firebase Console
        url: `${window.location.origin}/auth/verify`,
        handleCodeInApp: true
      }

      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      toast.success('Check your email for the login link!')
    } catch (error) {
      console.error('Error sending sign-in link:', error)
      toast.error('Failed to send login link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <form onSubmit={handleSignIn} className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending link...' : 'Send magic link'}
        </Button>
      </form>
    </div>
  )
} 