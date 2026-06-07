import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, PDFPage, rgb } from 'pdf-lib'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { submission, signature } = body

    const pdfDoc = await PDFDocument.create()
    const page1 = pdfDoc.addPage([8.5 * 72, 11 * 72])

    const form50132 = createForm50132(page1, submission, signature)
    const page2 = pdfDoc.addPage([8.5 * 72, 11 * 72])
    createForm50162(page2, submission, signature)

    const pdfBytes = await pdfDoc.save()
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="protest-forms-${submission.id}.pdf"`,
      },
    })
  } catch (err) {
    console.error('[generate-pdf] Error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

function createForm50132(
  page: PDFPage,
  submission: any,
  signature: string
) {
  const { width, height } = page.getSize()
  const fontSize = 10
  const margin = 40
  const lineHeight = 16

  let y = height - margin

  page.drawText('FORM 50-132 — PROPERTY VALUE PROTEST', {
    x: margin,
    y,
    size: 14,
    color: rgb(0, 0, 0),
  })

  y -= lineHeight * 2

  page.drawText('Texas Tax Code §41.41 — Market Value Challenge', {
    x: margin,
    y,
    size: 10,
    color: rgb(0.4, 0.4, 0.4),
  })

  y -= lineHeight * 2.5

  page.drawText('PROPERTY INFORMATION', {
    x: margin,
    y,
    size: 12,
    color: rgb(0, 0, 0),
  })

  y -= lineHeight

  const info = [
    `Property Address: ${submission.propertyAddress}`,
    `County: ${submission.county}`,
    `Owner Name: ${submission.ownerName}`,
    `CAD Account: ${submission.cad_account_number || 'N/A'}`,
  ]

  info.forEach((line) => {
    page.drawText(line, { x: margin, y, size: fontSize, color: rgb(0, 0, 0) })
    y -= lineHeight
  })

  y -= lineHeight

  page.drawText('VALUATION CHALLENGE', {
    x: margin,
    y,
    size: 12,
    color: rgb(0, 0, 0),
  })

  y -= lineHeight

  const values = [
    `Current CAD Appraised Value: $${submission.cadValue?.toLocaleString() || '0'}`,
    `Argued Market Value: $${submission.arguedValue?.toLocaleString() || '0'}`,
    `Reduction Requested: $${((submission.cadValue || 0) - (submission.arguedValue || 0)).toLocaleString()}`,
  ]

  values.forEach((line) => {
    page.drawText(line, { x: margin, y, size: fontSize, color: rgb(0, 0, 0) })
    y -= lineHeight
  })

  y -= lineHeight * 2

  page.drawText('GROUND FOR CHALLENGE', {
    x: margin,
    y,
    size: 12,
    color: rgb(0, 0, 0),
  })

  y -= lineHeight

  page.drawText(
    'The subject property is valued in excess of market value based on comparable ' +
      'property analysis. Comparable properties in the same neighborhood indicate a lower market value.',
    {
      x: margin,
      y,
      size: fontSize,
      color: rgb(0, 0, 0),
      maxWidth: width - margin * 2,
      lineHeight: lineHeight * 0.8,
    }
  )

  y -= lineHeight * 3.5

  page.drawText('SIGNATURE AUTHORIZATION', {
    x: margin,
    y,
    size: 12,
    color: rgb(0, 0, 0),
  })

  y -= lineHeight * 2

  page.drawText(signature ? '[E-Signature Applied]' : '[Requires Signature]', {
    x: margin,
    y,
    size: 10,
    color: signature ? rgb(0.2, 0.6, 0.2) : rgb(0.6, 0.2, 0.2),
  })

  y -= lineHeight * 3

  page.drawText(`I authorize TrimTax to file this protest on my behalf.`, {
    x: margin,
    y,
    size: 9,
    color: rgb(0.3, 0.3, 0.3),
  })

  y -= lineHeight

  page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
    x: margin,
    y,
    size: 9,
    color: rgb(0.3, 0.3, 0.3),
  })
}

function createForm50162(
  page: PDFPage,
  submission: any,
  signature: string
) {
  const { width, height } = page.getSize()
  const fontSize = 10
  const margin = 40
  const lineHeight = 16

  let y = height - margin

  page.drawText('FORM 50-162 — AGENT AUTHORIZATION', {
    x: margin,
    y,
    size: 14,
    color: rgb(0, 0, 0),
  })

  y -= lineHeight * 2

  page.drawText('Appraiser/Document Preparation Service Authorization', {
    x: margin,
    y,
    size: 10,
    color: rgb(0.4, 0.4, 0.4),
  })

  y -= lineHeight * 2.5

  page.drawText('AUTHORIZATION DETAILS', {
    x: margin,
    y,
    size: 12,
    color: rgb(0, 0, 0),
  })

  y -= lineHeight

  const authInfo = [
    `Property Owner: ${submission.ownerName}`,
    `Property Address: ${submission.propertyAddress}`,
    `Service Provider: TrimTax (Document Preparation Service)`,
    `Email: ${submission.ownerEmail}`,
  ]

  authInfo.forEach((line) => {
    page.drawText(line, { x: margin, y, size: fontSize, color: rgb(0, 0, 0) })
    y -= lineHeight
  })

  y -= lineHeight * 2

  page.drawText('SCOPE OF AUTHORIZATION', {
    x: margin,
    y,
    size: 12,
    color: rgb(0, 0, 0),
  })

  y -= lineHeight

  const scope = [
    '✓ Prepare property value protest documentation',
    '✓ File Form 50-132 with appraisal district',
    '✓ Represent property in informal proceedings',
    '✓ Communicate with appraisal district on my behalf',
    '✓ Attend informal hearing (if necessary)',
  ]

  scope.forEach((line) => {
    page.drawText(line, { x: margin, y, size: fontSize, color: rgb(0, 0, 0) })
    y -= lineHeight
  })

  y -= lineHeight * 2

  page.drawText('COMPENSATION', {
    x: margin,
    y,
    size: 12,
    color: rgb(0, 0, 0),
  })

  y -= lineHeight

  page.drawText(`Contingency Fee: 25% of first-year tax savings (if successful only)`, {
    x: margin,
    y,
    size: fontSize,
    color: rgb(0.2, 0.5, 0.2),
    maxWidth: width - margin * 2,
  })

  y -= lineHeight * 2.5

  page.drawText('SIGNATURE AUTHORIZATION', {
    x: margin,
    y,
    size: 12,
    color: rgb(0, 0, 0),
  })

  y -= lineHeight * 2

  if (signature) {
    page.drawText('[E-Signature Applied]', { x: margin, y, size: 10, color: rgb(0.5, 0.5, 0.5) })
  }

  y -= lineHeight * 3

  page.drawText(
    `I authorize TrimTax to act as my agent for property tax protest services under the terms above.`,
    {
      x: margin,
      y,
      size: 9,
      color: rgb(0.3, 0.3, 0.3),
      maxWidth: width - margin * 2,
      lineHeight: lineHeight * 0.8,
    }
  )

  y -= lineHeight * 2

  page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
    x: margin,
    y,
    size: 9,
    color: rgb(0.3, 0.3, 0.3),
  })

  y -= lineHeight

  page.drawText(
    'TrimTax is a document preparation service, not a licensed law firm or appraisal service.',
    {
      x: margin,
      y,
      size: 8,
      color: rgb(0.5, 0.5, 0.5),
    }
  )
}
