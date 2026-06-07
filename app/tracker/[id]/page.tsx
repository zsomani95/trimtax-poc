'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const colors = {
  primary: '#059669', primaryDark: '#047857', dark: '#0f172a',
  darkText: '#111827', white: '#fff', gray: '#6b7280',
  grayLight: '#f3f4f6',
}

interface TrackingNote {
  id: number
  note: string
  noteType: string
  createdAt: string
  createdBy: string
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
  signedAt: string | null
  submittedAt: string | null
  hearingScheduledAt: string | null
  hearingDate: string | null
  resultedAt: string | null
  resultedSavings: number | null
}

const statusTimeline = [
  { key: 'pending', label: 'Created', icon: '📝' },
  { key: 'signed', label: 'Signed', icon: '✍️' },
  { key: 'submitted', label: 'Submitted', icon: '📤' },
  { key: 'hearing_scheduled', label: 'Hearing', icon: '📅' },
  { key: 'resolved', label: 'Resolved', icon: '✅' },
]

export default function TrackerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [id, setId] = useState<string>('')
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [notes, setNotes] = useState<TrackingNote[]>([])
  const [newNote, setNewNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    params.then(({ id }) => {
      setId(id)
      loadData(id)
    })
  }, [params])

  const loadData = async (submissionId: string) => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch(`/api/tracker/${submissionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error('Not found')
      }

      const data = await response.json()
      setSubmission(data.submission)
      setNotes(data.notes || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return

    setPosting(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`/api/tracker/${id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ note: newNote }),
      })

      if (response.ok) {
        const data = await response.json()
        setNotes([data.note, ...notes])
        setNewNote('')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setPosting(false)
    }
  }

  const fmt = (n: number | null) =>
    n !== null
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
      : '—'

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #1e293b, #0f172a)' }}>
        <p style={{ color: '#aaa' }}>Loading tracker...</p>
      </div>
    )
  }

  if (!submission) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #1e293b, #0f172a)' }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <p>Property not found</p>
          <Link href="/dashboard" style={{ color: '#0066cc', textDecoration: 'none' }}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const statusIndex = statusTimeline.findIndex((s) => s.key === submission.status)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #1e293b, #0f172a)', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#0066cc', textDecoration: 'none' }}>
            ← Home
          </Link>
          <Link href="/dashboard" style={{ color: '#0066cc', textDecoration: 'none' }}>
            Dashboard
          </Link>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '30px', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 12px 0' }}>
            {submission.propertyAddress}
          </h1>
          <p style={{ color: '#666', margin: '0 0 20px 0' }}>
            {submission.county} County • Account: {submission.cad_account_number}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <p style={{ color: '#666', fontSize: '13px', margin: '0 0 4px 0' }}>Current CAD Value</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{fmt(submission.cadValue)}</p>
            </div>
            <div>
              <p style={{ color: '#666', fontSize: '13px', margin: '0 0 4px 0' }}>Argued Value</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#047857', margin: 0 }}>{fmt(submission.arguedValue)}</p>
            </div>
            <div>
              <p style={{ color: '#666', fontSize: '13px', margin: '0 0 4px 0' }}>Est. Savings</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#0066cc', margin: 0 }}>
                {fmt(submission.projectedSavings)}
              </p>
            </div>
            {submission.resultedSavings && (
              <div>
                <p style={{ color: '#666', fontSize: '13px', margin: '0 0 4px 0' }}>Actual Savings</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#059669', margin: 0 }}>
                  {fmt(submission.resultedSavings)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Status Timeline */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '30px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>Status Timeline</h2>

          <div style={{ display: 'grid', gap: '16px' }}>
            {statusTimeline.map((step, idx) => (
              <div key={step.key} style={{ display: 'flex', gap: '16px' }}>
                <div style={{ textAlign: 'center', minWidth: '60px' }}>
                  <div
                    style={{
                      fontSize: '24px',
                      marginBottom: '8px',
                      opacity: idx <= statusIndex ? 1 : 0.3,
                    }}
                  >
                    {step.icon}
                  </div>
                  {idx < statusTimeline.length - 1 && (
                    <div
                      style={{
                        width: '2px',
                        height: '40px',
                        background: idx < statusIndex ? '#047857' : '#ddd',
                        margin: '0 auto',
                      }}
                    />
                  )}
                </div>
                <div style={{ paddingTop: '4px' }}>
                  <p style={{ fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>
                    {step.label}
                    {idx <= statusIndex && <span style={{ color: '#047857' }}> ✓</span>}
                  </p>
                  <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>
                    {step.key === 'pending' && submission.createdAt && new Date(submission.createdAt).toLocaleDateString()}
                    {step.key === 'signed' && submission.signedAt && new Date(submission.signedAt).toLocaleDateString()}
                    {step.key === 'submitted' && submission.submittedAt && new Date(submission.submittedAt).toLocaleDateString()}
                    {step.key === 'hearing_scheduled' && submission.hearingDate && new Date(submission.hearingDate).toLocaleDateString()}
                    {step.key === 'resolved' && submission.resultedAt && new Date(submission.resultedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '30px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>Updates & Notes</h2>

          <form onSubmit={handleAddNote} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note or update..."
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
                marginBottom: '12px',
                boxSizing: 'border-box',
                minHeight: '80px',
              }}
            />
            <button
              type="submit"
              disabled={posting || !newNote.trim()}
              style={{
                background: posting || !newNote.trim() ? '#ccc' : '#0066cc',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: posting || !newNote.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {posting ? 'Adding...' : 'Add Note'}
            </button>
          </form>

          <div style={{ display: 'grid', gap: '12px' }}>
            {notes.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No notes yet</p>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    background: '#f9fafb',
                    padding: '12px',
                    borderRadius: '6px',
                    borderLeft: '4px solid #0066cc',
                  }}
                >
                  <p style={{ fontSize: '12px', color: '#666', margin: '0 0 4px 0' }}>
                    {note.createdBy} • {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                  <p style={{ color: '#111827', margin: 0 }}>{note.note}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
