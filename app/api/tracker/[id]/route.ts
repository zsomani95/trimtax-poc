import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { submissions, trackingNotes } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(
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
    try {
      const decoded = Buffer.from(auth.replace('Bearer ', ''), 'base64').toString('utf-8')
      const [id] = decoded.split(':')
      userId = parseInt(id)
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { id } = await params
    const submissionId = parseInt(id)

    // Get submission and verify ownership
    const [submission] = await db
      .select()
      .from(submissions)
      .where(and(
        eq(submissions.id, submissionId),
        eq(submissions.userId, userId)
      ))

    if (!submission) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Get notes for this submission
    const notes = await db
      .select()
      .from(trackingNotes)
      .where(eq(trackingNotes.submissionId, submissionId))

    return NextResponse.json({
      submission,
      notes: notes || [],
    })
  } catch (err) {
    console.error('[tracker] Error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
