'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import TrimTaxLogo from '@/components/TrimTaxLogo'

const C = {
  primary: '#1e3a5f', primaryDark: '#152e4d', primaryLight: '#e8eef6',
  dark: '#0f172a', darkAlt: '#1e293b', darkText: '#111827',
  white: '#ffffff', gray: '#6b7280', grayLight: '#f3f4f6',
  grayBorder: '#e5e7eb', error: '#dc2626', accent: '#2563eb',
}

interface Submission {
  id: number
  propertyAddress: string
  county: string
  cadValue: number | null
  arguedValue: number | null
  projectedSavings: number | null
  status: string
  createdAt: string
  hearingDate: string | null
}

export default function ConfirmationPage() {
  const params = useParams()
  const id = params.id as string

  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadSubmission()
  }, [id])

  const loadSubmission = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const res = await fetch(`/api/submissions/${id}`, {
        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) },
      })
      const data = await res.json()
      if (data.error) { setError(data.error) }
      else { setSubmission(data) }
    } catch { setError('Failed to load submission.') }
    finally { setLoading(false) }
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: C.grayLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: C.gray, fontSize: '16px' }}>
          <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', marginRight: '8px' }}>⏳</span>
          Loading...
        </div>
      </div>
    )
  }

  if (error || !submission) {
    return (
      <div style={{ minHeight: '100vh', background: C.grayLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#991b1b', fontSize: '16px', fontWeight: 500 }}>
          Error: {error || 'Submission not found'}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: C.grayLight, display: 'flex', flexDirection: 'column' }}>
      <header style={{
        padding: '16px 40px', background: C.white, borderBottom: `1px solid ${C.grayBorder}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <TrimTaxLogo size={140} />
        </Link>
        <Link
          href="/dashboard"
          style={{ color: C.primary, textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}
        >
          Dashboard →
        </Link>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>
          {/* Success Icon */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', fontSize: '40px',
          }}>
            ✅
          </div>

          <h2 style={{
            fontFamily: "'Merriweather', serif", fontSize: '32px', fontWeight: 900,
            color: C.primary, margin: '0 0 12px 0', letterSpacing: '-0.5px',
          }}>
            Protest Filed Successfully!
          </h2>
          <p style={{ color: C.gray, fontSize: '16px', margin: '0 0 32px 0', lineHeight: 1.6 }}>
            Your protest has been submitted to the {submission.county} County Appraisal District.
            We'll handle everything from here.
          </p>

          {/* Details Card */}
          <div style={{
            background: C.white, borderRadius: '16px', padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: `1px solid ${C.grayBorder}`,
            marginBottom: '24px', textAlign: 'left',
          }}>
            <h3 style={{ fontFamily: "'Merriweather', serif", fontSize: '18px', fontWeight: 900, color: C.primary, margin: '0 0 20px 0' }}>
              Submission Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Property', value: submission.propertyAddress },
                { label: 'County', value: `${submission.county} County` },
                { label: 'CAD Value', value: submission.cadValue ? fmt(submission.cadValue) : 'N/A' },
                { label: 'Argued Value', value: submission.arguedValue ? fmt(submission.arguedValue) : 'N/A', highlight: true },
                { label: 'Projected Savings', value: submission.projectedSavings && submission.projectedSavings > 0 ? fmt(submission.projectedSavings) : '$0', highlight: true },
                { label: 'Filed On', value: new Date(submission.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
              ].map((row, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: i < 5 ? `1px solid ${C.grayLight}` : 'none',
                  background: row.highlight ? C.primaryLight : 'transparent',
                  margin: row.highlight ? '0 -16px' : '0', paddingLeft: row.highlight ? '16px' : '0', paddingRight: row.highlight ? '16px' : '0',
                  borderRadius: row.highlight ? '8px' : '0',
                }}>
                  <span style={{ fontWeight: 600, color: C.primary, fontSize: '14px' }}>{row.label}</span>
                  <span style={{
                    fontWeight: row.highlight ? 700 : 500, color: row.highlight ? C.primaryDark : C.darkText,
                    fontSize: '14px',
                  }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div style={{
            background: C.primaryLight, border: `1px solid ${C.primaryLight}`,
            borderRadius: '12px', padding: '24px', marginBottom: '24px', textAlign: 'left',
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: C.primaryDark, fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              What Happens Next
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: C.primary, lineHeight: 1.6 }}>
              <div>1. TrimTax generates Forms 50-132 & 50-162</div>
              <div>2. Files with CAD + attends informal hearing</div>
              <div>3. You're notified of outcome (no action needed)</div>
              <div>4. If successful, 25% of first-year savings invoiced</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link
              href={`/tracker/${id}`}
              style={{
                display: 'inline-block', background: C.primary, color: C.white, textDecoration: 'none',
                fontWeight: 700, fontSize: '15px', padding: '14px 32px', borderRadius: '10px',
                transition: 'all 0.2s ease',
              }}
            >
              Track Your Protest →
            </Link>
            <Link
              href="/dashboard"
              style={{
                display: 'inline-block', background: C.white, color: C.primary, textDecoration: 'none',
                fontWeight: 700, fontSize: '15px', padding: '14px 32px', borderRadius: '10px',
                border: `2px solid ${C.grayBorder}`, transition: 'all 0.2s ease',
              }}
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}