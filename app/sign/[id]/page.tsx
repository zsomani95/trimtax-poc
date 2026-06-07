import { db } from '@/lib/db'
import { submissions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import SignPageClient from './client'

export default async function SignPage({
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

  return (
    <SignPageClient
      submission={{
        id: submission.id,
        ownerName: submission.ownerName,
        ownerEmail: submission.ownerEmail,
        propertyAddress: submission.propertyAddress,
        county: submission.county,
        cadValue: submission.cadValue,
        arguedValue: submission.arguedValue,
        projectedSavings: submission.projectedSavings,
      }}
    />
  )
}
