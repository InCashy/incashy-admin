import { NextResponse } from 'next/server'

export async function POST() {
  // Wait 1 second (simulate auth delay)
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Create response and set a cookie "auth=1" that lasts 7 days
  const response = NextResponse.json({ loggedIn: true })

  response.cookies.set('auth', '1', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    sameSite: 'lax',
  })

  return response
}
