import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

const DEMO_MODE = true

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, password } = body

    if (!fullName?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    if (DEMO_MODE) {
      return NextResponse.json({
        message: 'Registration successful (demo mode)',
        email,
      })
    }

    const [existing] = await db.select().from(users).where({ email })

    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const [user] = await db
      .insert(users)
      .values({
        fullName,
        email,
        passwordHash: password,
      })
      .returning()

    return NextResponse.json({ message: 'Registration successful', userId: user.id })
  } catch (err) {
    console.error('[register] Error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
