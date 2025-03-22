'use client'

import { useAuth } from '@/lib/auth'

export default function AdminPage() {
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      {/* Add admin features here */}
    </div>
  )
} 