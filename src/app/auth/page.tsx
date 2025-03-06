'use client'

import { SignInForm } from '@/components/auth/sign-in-form'

export default function AuthPage() {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Sign In</h1>
      <p className="text-gray-600 text-center">
        Enter your email to receive a magic link for signing in.
      </p>
      <SignInForm />
    </div>
  )
} 