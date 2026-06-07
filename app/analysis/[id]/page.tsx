import { db } from "@/lib/db";
import { submissions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

const fmt = (n: number | null) =>
  n !== null
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
    : '—';

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [submission] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, parseInt(id)));

  if (!submission) notFound();

  if (!submission.cadValue || !submission.arguedValue) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'linear-gradient(to bottom right, #1e293b, #0f172a)' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '40px', maxWidth: '500px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>Processing Your Submission</h1>
          <p style={{ color: '#666', marginBottom: '20px' }}>Our team is analyzing {submission.propertyAddress}. We'll notify you within 24 hours.</p>
          <Link href="/intake" style={{ display: 'inline-block', background: '#047857', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
            Submit Another Property
          </Link>
        </div>
      </main>
    );
  }

  const reduction = submission.cadValue - submission.arguedValue;

  return (
    <main style={{ minHeight: '100vh', padding: '20px 20px 40px 20px', background: 'linear-gradient(to bottom right, #1e293b, #0f172a)' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', display: 'grid', gap: '24px' }}>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>TrimTax</h1>
            <span style={{ background: '#dcfce7', color: '#166534', fontSize: '12px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '20px' }}>Analysis Complete</span>
          </div>
          <p style={{ color: '#666', fontSize: '14px', margin: '0' }}>{submission.propertyAddress}</p>
        </div>

        <div style={{ background: submission.projectedSavings && submission.projectedSavings > 0 ? '#10b981' : '#9ca3af', borderRadius: '12px', padding: '32px', color: '#fff', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: submission.projectedSavings && submission.projectedSavings > 0 ? '#d1fae5' : '#f3f4f6' }}>
            {submission.projectedSavings && submission.projectedSavings > 0 ? 'Potential Tax Reduction' : 'Property Valuation'}
          </p>
          <p style={{ margin: '0 0 15px 0', fontSize: '48px', fontWeight: 'bold' }}>
            {submission.projectedSavings ? fmt(submission.projectedSavings) : '$0'}
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: submission.projectedSavings && submission.projectedSavings > 0 ? '#d1fae5' : '#f3f4f6', fontStyle: 'italic' }}>
            {submission.projectedSavings && submission.projectedSavings > 0
              ? 'Fee: 25% of total taxes saved (if successful)'
              : 'Property appears fairly valued based on market comparables'
            }
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>Valuation Breakdown</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: '#fef2f2', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '11px', color: '#dc2626', fontWeight: 'bold', textTransform: 'uppercase' }}>CAD Value</p>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#991b1b' }}>{fmt(submission.cadValue)}</p>
            </div>
            <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '11px', color: '#16a34a', fontWeight: 'bold', textTransform: 'uppercase' }}>Argued Value</p>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#166534' }}>{fmt(submission.arguedValue)}</p>
            </div>
            <div style={{ background: '#f3f4f6', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '11px', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>Reduction</p>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#374151' }}>{fmt(reduction)}</p>
            </div>
          </div>
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', padding: '12px', fontSize: '13px', color: '#92400e' }}>
            <strong>Method:</strong> Unequal appraisal (§41.43) — your property valued {Math.round(((submission.cadValue - submission.arguedValue) / submission.arguedValue) * 100)}% above comparable market rate.
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '10px' }}>Ready to file your protest?</h2>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>Sign the authorization form and we'll handle everything. You pay nothing unless we win.</p>
          <Link href={`/sign/${submission.id}`} style={{ display: 'inline-block', background: '#10b981', color: '#fff', fontWeight: 'bold', padding: '16px 40px', borderRadius: '8px', fontSize: '16px', textDecoration: 'none' }}>
            Sign & File My Protest →
          </Link>
          <p style={{ fontSize: '12px', color: '#999', marginTop: '16px', margin: '16px 0 0 0' }}>TrimTax is a document preparation service, not a licensed appraisal or legal service.</p>
        </div>

      </div>
    </main>
  );
}