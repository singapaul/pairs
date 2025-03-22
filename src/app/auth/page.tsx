'use client'

import SignInForm from '@/components/auth/sign-in-form'

export default function AuthPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="w-full max-w-md p-6">
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