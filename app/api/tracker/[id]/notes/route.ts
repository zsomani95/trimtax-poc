import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { submissions, trackingNotes } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = request.headers.get('authorization')
    if (!auth?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extract userId from token
    let userId: number | null = null
    let userEmail = 'unknown'
    try {
      const decoded = Buffer.from(auth.replace('Bearer ', ''), 'base64').toString('utf-8')
      const [id, email] = decoded.split(':')
      userId = parseInt(id)
      userEmail = email || 'unknown'
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { note } = body

    if (!note?.trim()) {
      return NextResponse.json({ error: 'Note cannot be empty' }, { status: 400 })
    }

    // Verify user owns this submission
    const [submission] = await db
      .select()
      .from(submissions)
      .where(and(
        eq(submissions.id, parseInt(id)),
        eq(submissions.userId, userId)
      ))

    if (!submission) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Insert note
    const [newNote] = await db
      .insert(trackingNotes)
      .values({
        submissionId: parseInt(id),
        note: note.trim(),
        noteType: 'user_note',
        createdBy: userEmail,
      })
      .returning()

    return NextResponse.json({ note: newNote })
  } catch (err) {
    console.error('[tracker notes] Error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
