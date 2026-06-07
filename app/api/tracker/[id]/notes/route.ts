import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = request.headers.get('authorization')
    if (!auth?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { note } = body

    if (!note?.trim()) {
      return NextResponse.json({ error: 'Note cannot be empty' }, { status: 400 })
    }

    const newNote = {
      id: Math.floor(Math.random() * 10000),
      submissionId: parseInt(id),
      note: note.trim(),
      noteType: 'user_note',
      createdAt: new Date().toISOString(),
      createdBy: 'user@example.com',
    }

    return NextResponse.json({ note: newNote })
  } catch (err) {
    console.error('[tracker notes] Error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
