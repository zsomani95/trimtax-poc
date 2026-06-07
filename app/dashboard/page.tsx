'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const colors = {
  primary: '#059669', primaryDark: '#047857', dark: '#0f172a',
  darkText: '#111827', white: '#fff', gray: '#6b7280',
  grayLight: '#f3f4f6',
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

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: '#dbeafe', text: '#0369a1', label: '📋 Pending' },
  signed: { bg: '#dbeafe', text: '#0369a1', label: '✍️ Signed' },
  submitted: { bg: '#fef3c7', text: '#92400e', label: '📤 Submitted to CAD' },
  hearing_scheduled: { bg: '#ede9fe', text: '#6d28d9', label: '📅 Hearing Scheduled' },
  resolved: { bg: '#dcfce7', text: '#166534', label: '✅ Resolved' },
}

export default function DashboardPage() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      router.push('/login')
      return
    }

    loadSubmissions()
  }, [router])

  const loadSubmissions = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')

      const response = await fetch('/api/user/submissions', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Failed to load submissions')
      }

      const data = await response.json()
      setSubmissions(data.submissions || [])
    } catch (err) {
      setError('Could not load submissions')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    router.push('/login')
  }

  const fmt = (n: number | null) =>
    n !== null
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
      : '—'

  const getStatusInfo = (status: string) => statusColors[status] || statusColors.pending

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #1e293b, #0f172a)', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff', margin: '0 0 8px 0' }}>TrimTax Dashboard</h1>
            <p style={{ color: '#aaa', margin: 0, fontSize: '14px' }}>Track all your property tax protests</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              href="/intake"
              style={{
                background: '#0066cc',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              + New Property
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: '#374151',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '30px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px' }}>
            <p style={{ color: '#666', fontSize: '13px', margin: '0 0 8px 0' }}>Total Properties</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{submissions.length}</p>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px' }}>
            <p style={{ color: '#666', fontSize: '13px', margin: '0 0 8px 0' }}>Total Potential Savings</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#047857', margin: 0 }}>
              {fmt(submissions.reduce((sum, s) => sum + (s.projectedSavings || 0), 0))}
            </p>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px' }}>
            <p style={{ color: '#666', fontSize: '13px', margin: '0 0 8px 0' }}>Resolved</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#0066cc', margin: 0 }}>
              {submissions.filter(s => s.status === 'resolved').length}
            </p>
          </div>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#aaa', padding: '40px' }}>Loading submissions...</div>
        ) : error ? (
          <div style={{ background: '#fee2e2', border: '1px solid #dc2626', color: '#991b1b', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            {error}
          </div>
        ) : submissions.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
            <p style={{ color: '#666', marginBottom: '20px' }}>No properties yet. Start a new submission to see it here.</p>
            <Link
              href="/intake"
              style={{
                display: 'inline-block',
                background: '#0066cc',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              Submit Your First Property
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {submissions.map((sub) => {
              const statusInfo = getStatusInfo(sub.status)
              return (
                <Link
                  key={sub.id}
                  href={`/tracker/${sub.id}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto',
                    gap: '20px',
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '16px',
                    textDecoration: 'none',
                    color: '#111827',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)')}
                >
                  <div>
                    <p style={{ fontWeight: 'bold', margin: '0 0 6px 0' }}>{sub.propertyAddress}</p>
                    <p style={{ color: '#666', fontSize: '13px', margin: '0 0 8px 0' }}>
                      {sub.county} County • CAD: {fmt(sub.cadValue)} → {fmt(sub.arguedValue)}
                    </p>
                    <p style={{ color: '#047857', fontWeight: 'bold', fontSize: '13px', margin: 0 }}>
                      Est. Savings: {fmt(sub.projectedSavings)}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        display: 'inline-block',
                        background: statusInfo.bg,
                        color: statusInfo.text,
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      {statusInfo.label}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '120px' }}>
                    <p style={{ color: '#999', fontSize: '12px', margin: '0 0 4px 0' }}>Submitted</p>
                    <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
