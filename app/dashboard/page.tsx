'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  resultedSavings: number | null
}

const statusColors: Record<string, { bg: string; text: string; label: string; icon: string }> = {
  pending: { bg: '#e8eef6', text: '#1e3a5f', label: 'Pending', icon: '📋' },
  signed: { bg: '#e8eef6', text: '#1e3a5f', label: 'Signed', icon: '✍️' },
  submitted: { bg: '#fef3c7', text: '#92400e', label: 'Submitted to CAD', icon: '📤' },
  hearing_scheduled: { bg: '#ede9fe', text: '#6d28d9', label: 'Hearing Scheduled', icon: '📅' },
  resolved: { bg: '#dcfce7', text: '#166534', label: 'Resolved', icon: '✅' },
}

export default function DashboardPage() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) { router.push('/login'); return }
    loadSubmissions()
  }, [router])

  const loadSubmissions = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const res = await fetch('/api/submissions', {
        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) },
      })
      const data = await res.json()
      if (data.error) { setError(data.error) }
      else { setSubmissions(data.submissions || []) }
    } catch { setError('Failed to load submissions.') }
    finally { setLoading(false) }
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  return (
    <div style={{ minHeight: '100vh', background: C.grayLight, display: 'flex', flexDirection: 'column' }}>
      <header style={{
        padding: '16px 40px', background: C.white, borderBottom: `1px solid ${C.grayBorder}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <TrimTaxLogo size={140} />
        </Link>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link
            href="/intake"
            style={{
              background: C.primary, color: C.white, textDecoration: 'none',
              fontWeight: 600, fontSize: '14px', padding: '10px 24px', borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
          >
            New Protest
          </Link>
        </div>
      </header>

      <div style={{ flex: 1, padding: '40px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontFamily: "'Merriweather', serif", fontSize: '32px', fontWeight: 900,
            color: C.primary, margin: '0 0 8px 0', letterSpacing: '-0.5px',
          }}>
            Your Protests
          </h2>
          <p style={{ color: C.gray, fontSize: '15px', margin: 0, fontWeight: 500 }}>
            Track the status of your property tax protests
          </p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: C.gray, fontSize: '16px' }}>
            <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', marginRight: '8px' }}>⏳</span>
            Loading your submissions...
          </div>
        )}

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '16px', color: '#991b1b', fontSize: '14px', fontWeight: 500, marginBottom: '20px' }}>
            Error: {error}
          </div>
        )}

        {!loading && !error && submissions.length === 0 && (
          <div style={{
            background: C.white, borderRadius: '16px', padding: '60px 40px', textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: `1px solid ${C.grayBorder}`,
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
            <h3 style={{ fontFamily: "'Merriweather', serif", fontSize: '22px', fontWeight: 900, color: C.primary, margin: '0 0 8px 0' }}>
              No protests yet
            </h3>
            <p style={{ color: C.gray, fontSize: '15px', margin: '0 0 24px 0' }}>
              Start by searching for your property to file a protest.
            </p>
            <Link
              href="/intake"
              style={{
                display: 'inline-block', background: C.primary, color: C.white, textDecoration: 'none',
                fontWeight: 700, fontSize: '15px', padding: '14px 32px', borderRadius: '10px',
                transition: 'all 0.2s ease',
              }}
            >
              File Your First Protest →
            </Link>
          </div>
        )}

        {!loading && submissions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {submissions.map(sub => {
              const status = statusColors[sub.status] || statusColors.pending
              return (
                <div key={sub.id} style={{
                  background: C.white, borderRadius: '16px', padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: `1px solid ${C.grayBorder}`,
                  transition: 'all 0.2s ease', cursor: 'pointer',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)' }}
                  onClick={() => router.push(`/tracker/${sub.id}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '17px', fontWeight: 700, color: C.primary, margin: '0 0 4px 0' }}>
                        {sub.propertyAddress}
                      </h3>
                      <p style={{ color: C.gray, fontSize: '13px', margin: '2px 0 0 0' }}>
                        {sub.county} County · Filed {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                        background: status.bg, color: status.text,
                      }}>
                        {status.icon} {status.label}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>

                  {sub.cadValue && sub.arguedValue && (
                    <div style={{ display: 'flex', gap: '24px', marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${C.grayLight}` }}>
                      <div>
                        <p style={{ margin: '0 0 4px 0', color: C.gray, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>CAD Value</p>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '16px', color: C.darkText }}>{fmt(sub.cadValue)}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', color: C.gray, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Argued Value</p>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '16px', color: C.primary }}>{fmt(sub.arguedValue)}</p>
                      </div>
                      {sub.projectedSavings && sub.projectedSavings > 0 && (
                        <div>
                          <p style={{ margin: '0 0 4px 0', color: C.gray, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Projected Savings</p>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '16px', color: '#16a34a' }}>{fmt(sub.projectedSavings)}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}