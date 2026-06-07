import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = request.headers.get('authorization')
    if (!auth?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const mockSubmission = {
      id: parseInt(id),
      propertyAddress: '101 WESTHEIMER RD A, HOUSTON, TX 77006',
      county: 'Harris',
      cadAccountNumber: '0041410000037',
      cadValue: 431743,
      arguedValue: 461946,
      projectedSavings: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
      signedAt: null,
      submittedAt: null,
      hearingScheduledAt: null,
      hearingDate: null,
      resultedAt: null,
      resultedSavings: null,
    }

    const mockNotes = [
      {
        id: 1,
        note: 'Property submitted for valuation analysis',
        noteType: 'status_update',
        createdAt: new Date().toISOString(),
        createdBy: 'system',
      },
      {
        id: 2,
        note: 'Your signature has been received and forms are ready to file',
        noteType: 'status_update',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'system',
      },
    ]

    return NextResponse.json({
      submission: mockSubmission,
      notes: mockNotes,
    })
  } catch (err) {
    console.error('[tracker] Error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
