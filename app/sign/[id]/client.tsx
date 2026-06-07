'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import SignatureCanvas from 'react-signature-canvas'

interface SignPageClientProps {
  submission: {
    id: number
    ownerName: string
    ownerEmail: string
    propertyAddress: string
    county: string
    cadValue: number | null
    arguedValue: number | null
    projectedSavings: number | null
  }
}

export default function SignPageClient({
  submission,
}: SignPageClientProps) {
  const router = useRouter()
  const sigCanvasRef = useRef<SignatureCanvas>(null)
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [signatureEmpty, setSignatureEmpty] = useState(true)

  const handleClearSignature = () => {
    sigCanvasRef.current?.clear()
    setSignatureEmpty(true)
  }

  const handleGeneratePDF = async () => {
    if (signatureEmpty) {
      setError('Please sign before generating documents')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const signatureData = sigCanvasRef.current?.toDataURL('image/png')

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: submission.id,
          signature: signatureData,
          submission,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `protest-forms-${submission.id}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)

      setStep(3)
    } catch (err) {
      setError(String(err))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      const signatureData = sigCanvasRef.current?.toDataURL('image/png')

      const response = await fetch(`/api/submissions/${submission.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signatureImage: signatureData,
          signedAt: new Date().toISOString(),
          status: 'signed',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save signature')
      }

      router.push(`/confirmation/${submission.id}`)
    } catch (err) {
      setError(String(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const fmt = (n: number | null) =>
    n !== null
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
      : '—'

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', fontFamily: 'system-ui', padding: '20px' }}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .loading { animation: pulse 1s infinite; }
      `}</style>

      <h1 style={{ marginTop: 0, marginBottom: '8px' }}>TrimTax</h1>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '30px' }}>File your property tax protest</p>

      {/* STEP 1: REVIEW */}
      {step === 1 && (
        <div style={{ border: '1px solid #ddd', padding: '24px', borderRadius: '8px', backgroundColor: '#fff' }}>
          <h2 style={{ marginTop: 0 }}>Review Your Submission</h2>

          <table style={{ width: '100%', marginBottom: '20px', fontSize: '14px', borderCollapse: 'collapse' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', fontWeight: 'bold', width: '40%' }}>Property</td>
                <td style={{ padding: '10px' }}>{submission.propertyAddress}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>County</td>
                <td style={{ padding: '10px' }}>{submission.county}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>Owner</td>
                <td style={{ padding: '10px' }}>{submission.ownerName}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>CAD Value</td>
                <td style={{ padding: '10px' }}>{fmt(submission.cadValue)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee', backgroundColor: '#f0fdf4' }}>
                <td style={{ padding: '10px', fontWeight: 'bold', color: '#047857' }}>Argued Value</td>
                <td style={{ padding: '10px', fontWeight: 'bold', color: '#047857' }}>{fmt(submission.arguedValue)}</td>
              </tr>
              <tr style={{ backgroundColor: '#f0fdf4' }}>
                <td style={{ padding: '10px', fontWeight: 'bold', color: '#047857' }}>Est. Savings</td>
                <td style={{ padding: '10px', fontWeight: 'bold', color: '#047857' }}>{fmt(submission.projectedSavings)}</td>
              </tr>
            </tbody>
          </table>

          <div style={{
            backgroundColor: '#dbeafe',
            border: '1px solid #93c5fd',
            padding: '15px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '13px',
            lineHeight: '1.6',
          }}>
            <strong>Documents to sign:</strong><br />
            • <strong>Form 50-132:</strong> Property Value Protest (§41.41 market value challenge)<br />
            • <strong>Form 50-162:</strong> Agent Authorization (TrimTax document preparation service)
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => router.back()}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Back
            </button>
            <button
              onClick={() => setStep(2)}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Continue to Signature
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SIGN */}
      {step === 2 && (
        <div style={{ border: '1px solid #ddd', padding: '24px', borderRadius: '8px', backgroundColor: '#fff' }}>
          <h2 style={{ marginTop: 0 }}>E-Signature</h2>
          <p style={{ color: '#666' }}>Sign above. Your signature authorizes TrimTax to file your protest.</p>

          <div style={{
            border: '2px dashed #ccc',
            borderRadius: '8px',
            height: '200px',
            marginBottom: '12px',
            backgroundColor: '#fafafa',
            cursor: 'crosshair',
            overflow: 'hidden',
          }}>
            <SignatureCanvas
              ref={sigCanvasRef}
              canvasProps={{
                style: { width: '100%', height: '100%' },
              }}
              onEnd={() => setSignatureEmpty(sigCanvasRef.current?.isEmpty() ?? true)}
            />
          </div>

          <button
            onClick={handleClearSignature}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: '#666',
            }}
          >
            Clear Signature
          </button>

          {error && <div style={{ color: '#d32f2f', marginBottom: '15px', fontSize: '14px' }}>Error: {error}</div>}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setStep(1)}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Back
            </button>
            <button
              onClick={handleGeneratePDF}
              disabled={isGenerating || signatureEmpty}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: isGenerating || signatureEmpty ? '#ccc' : '#047857',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isGenerating || signatureEmpty ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                opacity: isGenerating || signatureEmpty ? 0.6 : 1,
              }}
            >
              {isGenerating ? '⏳ Generating...' : 'Generate PDFs'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CONFIRMATION */}
      {step === 3 && (
        <div style={{ border: '1px solid #ddd', padding: '24px', borderRadius: '8px', backgroundColor: '#f0fdf4' }}>
          <h2 style={{ marginTop: 0, color: '#047857' }}>✓ Documents Generated</h2>
          <p style={{ color: '#666' }}>
            Your protest forms have been downloaded. Now submit your signature to complete filing.
          </p>

          <div style={{
            backgroundColor: '#dcfce7',
            border: '1px solid #6ee7b7',
            padding: '15px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '13px',
          }}>
            <strong>What happens next:</strong><br />
            1. Your signature is securely stored<br />
            2. Forms are submitted to {submission.county} CAD<br />
            3. Informal hearing scheduled automatically<br />
            4. You receive hearing details via email
          </div>

          {error && <div style={{ color: '#d32f2f', marginBottom: '15px', fontSize: '14px' }}>Error: {error}</div>}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setStep(2)}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: isSubmitting ? '#ccc' : '#047857',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              {isSubmitting ? '⏳ Submitting...' : 'File My Protest →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
