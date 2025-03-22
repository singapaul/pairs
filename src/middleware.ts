 
import { NextResponse } from 'next/server'
 
export async function middleware( ) {
  const res = NextResponse.next()
 

  // Refresh session if it exists
 

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 