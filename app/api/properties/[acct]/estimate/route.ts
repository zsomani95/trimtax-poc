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

function winsorize(arr: number[], lo = 0.1, hi = 0.9): number[] {
  if (arr.length === 0) return arr
  const s = [...arr].sort((a, b) => a - b)
  const loVal = s[Math.floor(s.length * lo)]
  const hiVal = s[Math.ceil(s.length * hi) - 1]
  return arr.map(v => Math.min(Math.max(v, loVal), hiVal))
}

function median(arr: number[]): number {
  const s = [...arr].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

function stdDev(arr: number[]): number {
  const avg = arr.reduce((a, b) => a + b, 0) / arr.length
  return Math.sqrt(arr.reduce((a, b) => a + (b - avg) ** 2, 0) / arr.length)
}

// Texas county tax rates (effective rate including school district, city, county)
function getTaxRate(county: string): number {
  const rates: Record<string, number> = {
    'Harris': 0.0175,      // ~1.75% effective rate
    'Fort Bend': 0.0170,   // ~1.70% effective rate
  }
  return rates[county] || 0.0172  // Default to 1.72% if county not found
}

function calculateTaxSavings(appraisalReduction: number, taxRate: number): number {
  // Annual tax savings = appraisal reduction × tax rate
  return Math.round(appraisalReduction * taxRate)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ acct: string }> }
) {
  try {
    const { acct } = await params
    const db = getPool()

    // 1. Get subject property
    const subjectResult = await db.query(
      `SELECT acct, site_addr_1, city, zip, owner_name, neighborhood_code, bld_ar,
              cur_appr_val, prior_appr_val, protested, county
       FROM properties
       WHERE acct = $1`,
      [acct]
    )

    const subject = subjectResult.rows[0]
    if (!subject) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // 2. Get comps (ordered for deterministic results)
    const hasNbhd = (subject.neighborhood_code ?? '').trim().length > 0
    const compsQuery = hasNbhd
      ? `SELECT cur_appr_val, bld_ar FROM properties
         WHERE neighborhood_code = $1 AND county = $2 AND acct != $3 AND bld_ar > 200 AND cur_appr_val > 10000
         ORDER BY acct ASC
         LIMIT 500`
      : `SELECT cur_appr_val, bld_ar FROM properties
         WHERE zip = $1 AND county = $2 AND acct != $3 AND bld_ar > 200 AND cur_appr_val > 10000
         ORDER BY acct ASC
         LIMIT 500`

    const compsResult = await db.query(
      compsQuery,
      hasNbhd
        ? [subject.neighborhood_code, subject.county, acct]
        : [subject.zip, subject.county, acct]
    )

    const ppsfs = compsResult.rows
      .filter(c => Number(c.bld_ar) > 0)
      .map(c => Number(c.cur_appr_val) / Number(c.bld_ar))

    if (ppsfs.length < 5 || !subject.bld_ar) {
      return NextResponse.json({
        subject,
        comps_count: ppsfs.length,
        no_estimate: true,
      })
    }

    const w = winsorize(ppsfs)
    const medPpsf = median(w)
    const argued = Math.round(medPpsf * Number(subject.bld_ar))
    const savings = Number(subject.cur_appr_val) - argued

    // Only return estimate if property is OVERVALUED (CAD > argued)
    if (savings <= 0) {
      return NextResponse.json({
        subject,
        comps_count: ppsfs.length,
        median_ppsf: Math.round(medPpsf * 100) / 100,
        argued_value: argued,
        appraisal_reduction: savings,
        no_opportunity: true,
        message: `Property appears fairly valued. Market rate: $${argued.toLocaleString()}, CAD value: $${Number(subject.cur_appr_val).toLocaleString()}`
      })
    }

    const cv = stdDev(w) / medPpsf
    const overage = (Number(subject.cur_appr_val) / Number(subject.bld_ar)) / medPpsf - 1
    const confidence =
      ppsfs.length >= 30 && cv < 0.25 && overage > 0.05 ? 'high'
        : ppsfs.length >= 10 ? 'medium'
          : 'low'

    const appraisalReduction = savings
    const taxRate = getTaxRate(subject.county)
    const annualTaxSavings = calculateTaxSavings(appraisalReduction, taxRate)
    const savingsMin = Math.round(annualTaxSavings * 0.7)
    const savingsMax = annualTaxSavings

    return NextResponse.json({
      subject,
      comps_count: ppsfs.length,
      median_ppsf: Math.round(medPpsf * 100) / 100,
      argued_value: argued,
      appraisal_reduction: savings,
      annual_tax_savings: annualTaxSavings,
      tax_rate: (taxRate * 100).toFixed(2) + '%',
      savings_min: savingsMin,
      savings_max: savingsMax,
      confidence,
      comp_basis: hasNbhd ? 'neighborhood' : 'zip',
    })
  } catch (err) {
    console.error('[estimate] Error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}