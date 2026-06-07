import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // TODO: compare with bcrypt.compare() in production
    if (user.passwordHash !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = Buffer.from(`${user.id}:${user.email}`).toString('base64')
    return NextResponse.json({
      token,
      email: user.email,
      userId: user.id,
    })
  } catch (err) {
    console.error('[login] Error:', err)
    return NextResponse.json({ error: 'Login failed: ' + String(err) }, { status: 500 })
  }
}
