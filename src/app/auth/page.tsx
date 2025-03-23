'use client';

import SignInForm from '@/components/auth/sign-in-form';

export default function AuthPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="w-full max-w-md p-6">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold">Welcome to Memory Game</h1>
          <p className="text-gray-600">Sign in to track your progress and save your scores</p>
        </div>

        <SignInForm />
      </div>
    </div>
  );
}
