import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization')
    if (!auth?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const mockSubmissions = [
      {
        id: 1,
        propertyAddress: '101 WESTHEIMER RD A, HOUSTON, TX 77006',
        county: 'Harris',
        cadValue: 431743,
        arguedValue: 461946,
        projectedSavings: 0,
        status: 'pending',
        createdAt: new Date().toISOString(),
        hearingDate: null,
        resultedSavings: null,
      },
      {
        id: 2,
        propertyAddress: '750 110000007, BELLAIRE, TX 77401',
        county: 'Harris',
        cadValue: 803472,
        arguedValue: 1055943,
        projectedSavings: 0,
        status: 'signed',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        hearingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        resultedSavings: null,
      },
    ]

    return NextResponse.json({ submissions: mockSubmissions })
  } catch (err) {
    console.error('[submissions] Error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
