import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const email = searchParams.get('email')
  
  if (!email) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Redirect to a client-side page that will handle the sign-in
  return NextResponse.redirect(new URL(`/auth/verify?email=${encodeURIComponent(email)}`, request.url))
} 