import { NextRequest, NextResponse } from 'next/server'

const DEMO_MODE = true

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    if (DEMO_MODE) {
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
      return NextResponse.json({
        token,
        email,
        message: 'Login successful (demo mode)',
      })
    }

    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
    return NextResponse.json({
      token,
      email,
      message: 'Login successful',
    })
  } catch (err) {
    console.error('[login] Error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
