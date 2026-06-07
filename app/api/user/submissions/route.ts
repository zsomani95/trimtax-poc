import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { submissions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization')
    if (!auth?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extract userId from token
    let userId: number | null = null
    try {
      const decoded = Buffer.from(auth.replace('Bearer ', ''), 'base64').toString('utf-8')
      const [id] = decoded.split(':')
      userId = parseInt(id)
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userSubmissions = await db
      .select()
      .from(submissions)
      .where(eq(submissions.userId, userId))

    return NextResponse.json({ submissions: userSubmissions || [] })
  } catch (err) {
    console.error('[submissions] Error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
