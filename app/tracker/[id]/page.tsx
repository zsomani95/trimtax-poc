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
  resultedSavings: number | null
  ownerName: string
  ownerEmail: string
  ownerPhone: string
}

const timelineSteps = [
  { key: 'pending', label: 'Submission Received', desc: 'Your protest has been received and is being processed.', icon: '📋' },
  { key: 'signed', label: 'E-Signed', desc: 'Your authorization has been signed and verified.', icon: '✍️' },
  { key: 'submitted', label: 'Filed with CAD', desc: 'Forms 50-132 & 50-162 have been submitted to the county appraisal district.', icon: '📤' },
  { key: 'hearing_scheduled', label: 'Hearing Scheduled', desc: 'An informal hearing has been scheduled with the appraisal review board.', icon: '📅' },
  { key: 'resolved', label: 'Resolved', desc: 'Your protest has been resolved. Check your savings below.', icon: '✅' },
]

const statusOrder = ['pending', 'signed', 'submitted', 'hearing_scheduled', 'resolved']

export default function TrackerPage() {
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

  const currentStepIndex = statusOrder.indexOf(submission?.status || 'pending')

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

      <div style={{ flex: 1, padding: '40px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        {/* Property Info Card */}
        <div style={{
          background: C.white, borderRadius: '16px', padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: `1px solid ${C.grayBorder}`,
          marginBottom: '32px',
        }}>
          <h2 style={{
            fontFamily: "'Merriweather', serif", fontSize: '24px', fontWeight: 900,
            color: C.primary, margin: '0 0 8px 0', letterSpacing: '-0.5px',
          }}>
            {submission.propertyAddress}
          </h2>
          <p style={{ color: C.gray, fontSize: '14px', margin: '0 0 16px 0' }}>
            {submission.county} County · Filed {new Date(submission.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            {[
              { label: 'CAD Value', value: submission.cadValue ? fmt(submission.cadValue) : 'N/A' },
              { label: 'Argued Value', value: submission.arguedValue ? fmt(submission.arguedValue) : 'N/A', highlight: true },
              { label: 'Projected Savings', value: submission.projectedSavings && submission.projectedSavings > 0 ? fmt(submission.projectedSavings) : '$0', highlight: true },
            ].map((item, i) => (
              <div key={i} style={{
                background: item.highlight ? C.primaryLight : C.grayLight,
                padding: '16px', borderRadius: '10px',
              }}>
                <p style={{ margin: '0 0 4px 0', color: C.gray, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {item.label}
                </p>
                <p style={{
                  margin: 0, fontWeight: 700, fontSize: '18px',
                  color: item.highlight ? C.primaryDark : C.darkText,
                }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div style={{
          background: C.white, borderRadius: '16px', padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: `1px solid ${C.grayBorder}`,
        }}>
          <h3 style={{ fontFamily: "'Merriweather', serif", fontSize: '20px', fontWeight: 900, color: C.primary, margin: '0 0 24px 0' }}>
            Protest Timeline
          </h3>

          <div style={{ position: 'relative', paddingLeft: '32px' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: '11px', top: '8px', bottom: '8px',
              width: '2px', background: C.grayBorder,
            }} />

            {timelineSteps.map((step, i) => {
              const isCompleted = i <= currentStepIndex
              const isCurrent = i === currentStepIndex
              return (
                <div key={step.key} style={{
                  position: 'relative', marginBottom: i < timelineSteps.length - 1 ? '24px' : '0',
                  opacity: isCompleted ? 1 : 0.5,
                }}>
                  <div style={{
                    position: 'absolute', left: '-32px', top: '4px',
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: isCompleted ? C.primary : C.grayBorder,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: C.white, fontSize: '12px', fontWeight: 700,
                    border: isCurrent ? `3px solid ${C.primaryDark}` : 'none',
                    boxShadow: isCurrent ? '0 0 0 4px rgba(30,58,95,0.15)' : 'none',
                  }}>
                    {isCompleted ? '✓' : i + 1}
                  </div>
                  <div style={{
                    background: isCurrent ? C.primaryLight : 'transparent',
                    padding: '12px 16px', borderRadius: '10px',
                    transition: 'all 0.3s ease',
                  }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: isCompleted ? C.primary : C.gray, margin: '0 0 4px 0' }}>
                      {step.label}
                    </h4>
                    <p style={{ color: C.gray, fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Notes Section */}
        <div style={{
          background: C.white, borderRadius: '16px', padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: `1px solid ${C.grayBorder}`,
          marginTop: '24px',
        }}>
          <h4 style={{ fontFamily: "'Merriweather', serif", fontSize: '16px', fontWeight: 900, color: C.primary, margin: '0 0 12px 0' }}>
            Important Notes
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: C.gray, fontSize: '14px', lineHeight: 1.8 }}>
            <li>You will receive email updates at each stage of the process.</li>
            <li>No action is required from you unless we request additional information.</li>
            <li>Hearings are typically scheduled within 30-60 days of filing.</li>
            <li>If your protest is successful, our 25% contingency fee applies only to the first year's tax savings.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}