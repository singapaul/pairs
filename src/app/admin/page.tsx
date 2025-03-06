'use client'

import { useRequireAdmin } from '@/lib/auth'

export default function AdminPage() {
  const { user, loading, isAdmin } = useRequireAdmin()

  if (loading) {
    return <div>Loading...</div>
  }

  // Only rendered if user is authenticated and is an admin
  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Your admin content */}
    </div>
  )
} 