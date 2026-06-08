'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
  ownerName: string
  ownerEmail: string
  ownerPhone: string
}

export default function SignPageClient() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [signature, setSignature] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)

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

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.beginPath()
    const rect = canvas.getBoundingClientRect()
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top
    ctx.moveTo(x, y)
    setHasSignature(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (canvas) {
      setSignature(canvas.toDataURL())
    }
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
    setSignature('')
  }

  const handleSign = async () => {
    if (!signature) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`/api/submissions/${id}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ signature }),
      })
      const data = await res.json()
      if (data.error) { setSubmitError(data.error) }
      else { router.push(`/confirmation/${id}`) }
    } catch { setSubmitError('Connection failed.') }
    finally { setSubmitting(false) }
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

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ maxWidth: '640px', width: '100%' }}>
          {/* Step Indicator */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '40px', alignItems: 'center', background: C.white, borderRadius: '16px', padding: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            {[
              { num: 1, label: 'Find Property', done: true },
              { num: 2, label: 'Review Estimate', done: true },
              { num: 3, label: 'E-Sign', active: true },
            ].map((s, i) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px',
                  borderRadius: '10px', background: s.active ? C.primaryLight : 'transparent',
                  transition: 'all 0.3s ease', flex: 1, justifyContent: 'center',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px',
                    background: s.done ? C.primary : s.active ? C.primary : C.grayBorder,
                    color: s.done || s.active ? C.white : C.gray, flexShrink: 0,
                    transition: 'all 0.3s ease',
                  }}>
                    {s.done ? '✓' : s.num}
                  </div>
                  <span style={{
                    fontSize: '12px', fontWeight: 600, color: s.active ? C.primary : s.done ? C.primary : C.gray,
                    whiteSpace: 'nowrap',
                  }}>
                    {s.label}
                  </span>
                </div>
                {i < 2 && (
                  <div style={{
                    width: '20px', height: '2px', background: s.done ? C.primary : C.grayBorder,
                    transition: 'all 0.3s ease', flexShrink: 0,
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Review Summary */}
          <div style={{
            background: C.white, borderRadius: '16px', padding: '40px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: `1px solid ${C.grayBorder}`,
            marginBottom: '24px',
          }}>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{
                fontFamily: "'Merriweather', serif", fontSize: '28px', fontWeight: 900,
                color: C.primary, margin: '0 0 8px 0', letterSpacing: '-0.5px',
              }}>
                Review & Sign
              </h2>
              <p style={{ color: C.gray, fontSize: '15px', margin: 0, fontWeight: 500 }}>
                Please verify and sign below to authorize your protest
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              {[
                { label: 'Property', value: submission.propertyAddress },
                { label: 'County', value: `${submission.county} County` },
                { label: 'CAD Value', value: submission.cadValue ? fmt(submission.cadValue) : 'N/A' },
                { label: 'Argued Value', value: submission.arguedValue ? fmt(submission.arguedValue) : 'N/A', highlight: true },
                { label: 'Projected Savings', value: submission.projectedSavings && submission.projectedSavings > 0 ? fmt(submission.projectedSavings) : '$0', highlight: true },
              ].map((row, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 0', borderBottom: i < 4 ? `1px solid ${C.grayLight}` : 'none',
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

          {/* Signature Pad */}
          <div style={{
            background: C.white, borderRadius: '16px', padding: '40px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: `1px solid ${C.grayBorder}`,
          }}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontFamily: "'Merriweather', serif", fontSize: '20px', fontWeight: 900, color: C.primary, margin: '0 0 8px 0' }}>
                Your Signature
              </h3>
              <p style={{ color: C.gray, fontSize: '14px', margin: 0 }}>
                Draw your signature below using your mouse or finger
              </p>
            </div>

            <div style={{
              border: `2px solid ${hasSignature ? C.primary : C.grayBorder}`,
              borderRadius: '12px', overflow: 'hidden', marginBottom: '16px',
              transition: 'all 0.2s ease', background: C.white,
            }}>
              <canvas
                ref={canvasRef}
                width={500}
                height={200}
                style={{ width: '100%', height: '200px', cursor: 'crosshair', display: 'block' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button
                onClick={clearSignature}
                style={{
                  padding: '10px 20px', background: C.grayLight, color: C.darkText,
                  border: `1px solid ${C.grayBorder}`, borderRadius: '8px', cursor: 'pointer',
                  fontWeight: 600, fontSize: '13px',
                }}
              >
                Clear
              </button>
              <span style={{ color: C.gray, fontSize: '12px', alignSelf: 'center' }}>
                {hasSignature ? '✓ Signature captured' : 'Draw your signature above'}
              </span>
            </div>

            {submitError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', color: '#991b1b', fontSize: '14px', fontWeight: 500 }}>
                ✗ {submitError}
              </div>
            )}

            <button
              onClick={handleSign}
              disabled={!hasSignature || submitting}
              style={{
                width: '100%', padding: '14px', background: !hasSignature || submitting ? '#d1d5db' : C.primary,
                color: C.white, border: 'none', borderRadius: '10px', fontWeight: 700,
                fontSize: '15px', cursor: !hasSignature || submitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease', letterSpacing: '0.3px',
              }}
              onMouseEnter={e => { if (hasSignature && !submitting) e.currentTarget.style.background = C.primaryDark }}
              onMouseLeave={e => { if (hasSignature && !submitting) e.currentTarget.style.background = C.primary }}
            >
              {submitting ? '⏳ Submitting...' : 'Sign & File My Protest →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}