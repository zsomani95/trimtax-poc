import { NextRequest, NextResponse } from 'next/server'

export function extractUserFromToken(token: string): { email: string } | null {
  try {
    if (!token.startsWith('Bearer ')) return null

    const decoded = Buffer.from(token.replace('Bearer ', ''), 'base64').toString('utf-8')
    const [email] = decoded.split(':')

    return { email }
  } catch (err) {
    return null
  }
}

export function requireAuth(request: NextRequest): { email: string } | NextResponse {
  const auth = request.headers.get('authorization')

  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = extractUserFromToken(auth)

  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  return user
}
