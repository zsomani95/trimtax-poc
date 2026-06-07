import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { step, estimate, ownerName, ownerEmail, ownerPhone } = await request.json()

    const prompt = `You are a UI expert. Generate a clean, minimal HTML5 form for a property tax protest intake flow.

Current step: ${step}
Estimate data: ${JSON.stringify(estimate, null, 2)}
Owner name: ${ownerName}
Owner email: ${ownerEmail}
Owner phone: ${ownerPhone}

Requirements:
- Use inline styles only (no <style> tag)
- Use standard HTML form elements (input, button, select, textarea)
- Color scheme: blues, greens, whites. No dark backgrounds.
- Font: system fonts (sans-serif)
- Responsive to 600px width
- Include clear labels and placeholder text
- Make buttons obvious and clickable
- NO external CSS or JavaScript
- Return ONLY the HTML body content (no <html>, <head>, or <body> tags)

Generate the form HTML now:`

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json({ error: `Groq API error: ${errText}` }, { status: 500 })
    }

    const data = await res.json()
    const htmlContent = data.choices?.[0]?.message?.content ?? ''

    return NextResponse.json({ html: htmlContent })
  } catch (err) {
    console.error('[ui-generate]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}