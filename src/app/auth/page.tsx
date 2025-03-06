'use client'

import SignInForm from '@/components/auth/sign-in-form'

export default function AuthPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome to Memory Game</h1>
          <p className="text-gray-600">
            Sign in to track your progress and save your scores
          </p>
        </div>

        <SignInForm />
      </div>
    </div>
  )
} 