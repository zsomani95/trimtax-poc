import { db } from '@/lib/db'
import { submissions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [submission] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, parseInt(id)))

  if (!submission) notFound()

  const fmt = (n: number | null) =>
    n !== null
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
      : '—'

  return (
    <main style={{ minHeight: '100vh', padding: '20px', background: 'linear-gradient(to bottom right, #1e293b, #0f172a)', display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '40px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', marginBottom: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '0 0 12px 0' }}>Protest Filed!</h1>
            <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>Your property tax protest has been successfully submitted.</p>
          </div>

          <div style={{
            background: '#dcfce7',
            border: '1px solid #6ee7b7',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px',
          }}>
            <p style={{ margin: '0 0 12px 0', fontWeight: 'bold', color: '#047857' }}>Submission Details</p>
            <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#166534' }}>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Submission ID:</strong> #{submission.id}
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Property:</strong> {submission.propertyAddress}
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>County:</strong> {submission.county}
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Estimated Savings:</strong> {fmt(submission.projectedSavings)}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Status:</strong> <span style={{ backgroundColor: '#d1fae5', padding: '2px 8px', borderRadius: '4px' }}>Signed & Filed</span>
              </p>
            </div>
          </div>

          <div style={{
            background: '#f3f4f6',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px',
          }}>
            <p style={{ margin: '0 0 12px 0', fontWeight: 'bold', color: '#1f2937' }}>What Happens Next?</p>
            <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8', color: '#4b5563' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Forms sent to {submission.county} CAD</strong> — Your Forms 50-132 & 50-162 are immediately filed with the appraisal district
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Informal hearing scheduled</strong> — The appraisal district will schedule an informal hearing (usually within 30-60 days)
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>You'll receive hearing notice</strong> — Details sent to <strong>{submission.ownerEmail}</strong>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>No action needed from you</strong> — TrimTax handles the hearing and negotiation
              </li>
              <li>
                <strong>Pay fee only if successful</strong> — If we win, 25% of first-year savings is invoiced
              </li>
            </ol>
          </div>

          <div style={{
            background: '#dbeafe',
            border: '1px solid #93c5fd',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '30px',
            fontSize: '13px',
            color: '#0369a1',
            lineHeight: '1.6',
          }}>
            <strong>📧 Check your email:</strong> We've sent confirmation & hearing details to {submission.ownerEmail}. Add us to your contacts so notices don't get missed.
          </div>

          <div style={{ display: 'grid', gap: '12px', marginBottom: '30px' }}>
            <Link
              href="/intake"
              style={{
                display: 'block',
                background: '#0066cc',
                color: '#fff',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              Submit Another Property
            </Link>
            <Link
              href="/"
              style={{
                display: 'block',
                background: '#f3f4f6',
                color: '#111827',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
                textDecoration: 'none',
                fontWeight: 'bold',
                border: '1px solid #ccc',
              }}
            >
              Return Home
            </Link>
          </div>

          <div style={{
            textAlign: 'center',
            paddingTop: '20px',
            borderTop: '1px solid #eee',
            fontSize: '12px',
            color: '#999',
          }}>
            <p style={{ margin: 0 }}>
              TrimTax is a document preparation service, not a licensed appraisal or legal service.
            </p>
            <p style={{ margin: '8px 0 0 0' }}>
              Questions? Email us at support@trimtax.local
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}
