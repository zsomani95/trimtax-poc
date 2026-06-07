interface EmailOptions {
  to: string
  subject: string
  html: string
}

const MOCK_MODE = true

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (MOCK_MODE) {
      console.log('[EMAIL - MOCK MODE]')
      console.log(`To: ${options.to}`)
      console.log(`Subject: ${options.subject}`)
      console.log(`Body: ${options.html.substring(0, 200)}...`)
      return true
    }

    return true
  } catch (err) {
    console.error('[email] Error:', err)
    return false
  }
}

export async function sendSubmissionConfirmation(email: string, submission: {
  id: number
  propertyAddress: string
  arguedValue: number | null
  projectedSavings: number | null
}): Promise<boolean> {
  const html = `
    <h2>Your TrimTax Submission Confirmed</h2>
    <p>Thank you for submitting your property tax protest with TrimTax.</p>
    <h3>Submission Details</h3>
    <ul>
      <li><strong>Property:</strong> ${submission.propertyAddress}</li>
      <li><strong>Submission ID:</strong> #${submission.id}</li>
      <li><strong>Argued Value:</strong> $${submission.arguedValue?.toLocaleString()}</li>
      <li><strong>Estimated Savings:</strong> $${submission.projectedSavings?.toLocaleString()}</li>
    </ul>
    <h3>What's Next?</h3>
    <ol>
      <li>Your forms are being prepared for filing</li>
      <li>We'll submit them to your appraisal district</li>
      <li>You'll receive a hearing notice (typically in 30-60 days)</li>
      <li>TrimTax handles the hearing - no action needed from you</li>
    </ol>
    <p><strong>Track your progress:</strong> <a href="http://localhost:3000/tracker/${submission.id}">View Status</a></p>
    <p>Questions? Reply to this email or contact support@trimtax.local</p>
  `

  return sendEmail({
    to: email,
    subject: `TrimTax: Submission Confirmed for ${submission.propertyAddress}`,
    html,
  })
}

export async function sendStatusUpdate(email: string, submission: {
  id: number
  propertyAddress: string
  status: string
}, message: string): Promise<boolean> {
  const html = `
    <h2>TrimTax Status Update</h2>
    <p>Your property tax protest for <strong>${submission.propertyAddress}</strong> has been updated.</p>
    <p><strong>Status:</strong> ${submission.status.replace('_', ' ').toUpperCase()}</p>
    <p>${message}</p>
    <p><a href="http://localhost:3000/tracker/${submission.id}">View Full Status</a></p>
  `

  return sendEmail({
    to: email,
    subject: `TrimTax: Status Update - ${submission.propertyAddress}`,
    html,
  })
}

export async function sendHearingNotice(email: string, submission: {
  id: number
  propertyAddress: string
  hearingDate: string
}, hearingDetails: string): Promise<boolean> {
  const html = `
    <h2>Your Hearing Has Been Scheduled</h2>
    <p>Good news! Your property tax protest hearing has been scheduled.</p>
    <h3>Hearing Details</h3>
    <p><strong>Property:</strong> ${submission.propertyAddress}</p>
    <p><strong>Date:</strong> ${new Date(submission.hearingDate).toLocaleDateString()}</p>
    <p><strong>Details:</strong></p>
    <p>${hearingDetails}</p>
    <p><strong>Important:</strong> TrimTax will represent you at this hearing. You don't need to attend unless you want to.</p>
    <p><a href="http://localhost:3000/tracker/${submission.id}">View Full Details</a></p>
  `

  return sendEmail({
    to: email,
    subject: `TrimTax: Hearing Scheduled - ${submission.propertyAddress}`,
    html,
  })
}
