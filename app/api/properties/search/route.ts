import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

let pool: Pool

function getPool() {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) throw new Error('DATABASE_URL not set')
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    })
  }
  return pool
}

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''
    if (q.length < 3) {
      return NextResponse.json({ results: [] })
    }

    const result = await getPool().query(
      `SELECT acct, site_addr_1, city, zip, owner_name, neighborhood_code, bld_ar,
              cur_appr_val, prior_appr_val, protested, county
       FROM properties
       WHERE site_addr_1 ILIKE $1
       ORDER BY site_addr_1
       LIMIT 10`,
      [`%${q}%`]
    )

    return NextResponse.json({ results: result.rows })
  } catch (err) {
    console.error('[search] Error:', err)
    return NextResponse.json({ error: String(err), results: [] }, { status: 500 })
  }
}