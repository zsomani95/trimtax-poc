import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { submissions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { signatureImage, signedAt, status } = body

    const [updated] = await db
      .update(submissions)
      .set({
        signatureImage: signatureImage,
        signedAt: signedAt ? new Date(signedAt) : new Date(),
        status: status ?? 'signed',
      })
      .where(eq(submissions.id, parseInt(id)))
      .returning()

    return NextResponse.json({ success: true, id: updated.id })
  } catch (err) {
    console.error('[submissions PATCH] Error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
