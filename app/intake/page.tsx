'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import TrimTaxLogo from '@/components/TrimTaxLogo'

const C = {
  primary: '#1e3a5f', primaryDark: '#152e4d', primaryLight: '#e8eef6',
  dark: '#0f172a', darkAlt: '#1e293b', darkText: '#111827',
  white: '#ffffff', gray: '#6b7280', grayLight: '#f3f4f6',
  grayBorder: '#e5e7eb', error: '#dc2626', accent: '#2563eb', gold: '#d4a853',
}

interface Property {
  acct: string
  site_addr_1: string
  city: string
  zip: string
  owner_name: string
  neighborhood_code: string
  bld_ar: number
  cur_appr_val: number
  prior_appr_val: number | null
  protested: string
  county: string
}

interface Estimate {
  subject: Property
  comps_count: number
  median_ppsf?: number
  argued_value?: number
  savings?: number
  savings_min?: number
  savings_max?: number
  contingency_fee?: number
  confidence?: 'high' | 'medium' | 'low'
  comp_basis?: 'neighborhood' | 'zip'
  no_estimate?: boolean
  error?: string
  annual_tax_savings?: number
  tax_rate?: string
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

const steps = [
  { num: 1, label: 'Find Property' },
  { num: 2, label: 'Review Estimate' },
  { num: 3, label: 'Contact Info' },
  { num: 4, label: 'Authorize' },
]

export default function IntakePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)

  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Property[]>([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [loadingEst, setLoadingEst] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [estimate, setEstimate] = useState<Estimate | null>(null)
  const [estimateError, setEstimateError] = useState('')

  const [ownerName, setOwnerName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [ownerPhone, setOwnerPhone] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 3) { setSuggestions([]); setSearchError(''); return }
    setSearching(true); setSearchError('')
    try {
      const res = await fetch(`/api/properties/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (data.error) { setSearchError(data.error); setSuggestions([]) }
      else { setSuggestions(data.results ?? []) }
    } catch (err) { setSearchError(String(err)) }
    finally { setSearching(false) }
  }, [])

  useEffect(() => {
    const acct = searchParams.get('acct')
    if (acct) {
      setLoadingEst(true); setEstimateError('')
      fetch(`/api/properties/${encodeURIComponent(acct)}/estimate`)
        .then(res => res.json())
        .then((data: Estimate) => {
          if (data.error) { setEstimateError(data.error) }
          else {
            setEstimate(data)
            setQuery(`${data.subject.site_addr_1}, ${data.subject.city}`)
            setOwnerName(data.subject.owner_name ?? '')
            setStep(2)
          }
        })
        .catch(err => setEstimateError(String(err)))
        .finally(() => setLoadingEst(false))
    }
  }, [searchParams])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(query), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, doSearch])

  const selectProperty = async (p: Property) => {
    setSuggestions([])
    setQuery(`${p.site_addr_1}, ${p.city}`)
    setLoadingEst(true); setEstimateError('')
    try {
      const res = await fetch(`/api/properties/${encodeURIComponent(p.acct)}/estimate`)
      const data: Estimate = await res.json()
      if (data.error) { setEstimateError(data.error); setEstimate(null) }
      else { setEstimate(data); setOwnerName(p.owner_name ?? ''); setStep(2) }
    } catch (err) { setEstimateError(String(err)) }
    finally { setLoadingEst(false) }
  }

  const handleSubmit = async () => {
    if (!estimate?.subject) return
    setSubmitting(true); setSubmitError('')
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          owner_name: ownerName,
          owner_email: ownerEmail,
          owner_phone: ownerPhone,
          property_address: `${estimate.subject.site_addr_1}, ${estimate.subject.city}, TX ${estimate.subject.zip}`,
          county: estimate.subject.county,
          cad_account_number: estimate.subject.acct,
          cad_value: estimate.subject.cur_appr_val,
          argued_value: estimate.argued_value ?? 0,
          projected_savings: estimate.annual_tax_savings ?? 0,
          status: 'pending',
        }),
      })
      const result = await res.json()
      if (result.error) { setSubmitError(result.error) }
      else { router.push(`/sign/${result.id}`) }
    } catch (err) { setSubmitError(String(err)) }
    finally { setSubmitting(false) }
  }

  const inputStyle = {
    width: '100%', padding: '14px 16px', fontSize: '16px', fontWeight: 500,
    border: `2px solid ${C.grayBorder}`, borderRadius: '10px', boxSizing: 'border-box' as const,
    color: C.darkText, backgroundColor: C.white, transition: 'all 0.2s ease',
    fontFamily: "'Inter', sans-serif",
  }

  const btnPrimary = (disabled = false) => ({
    flex: 1, padding: '14px 20px', border: 'none', borderRadius: '10px',
    cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '15px',
    transition: 'all 0.2s ease', letterSpacing: '0.3px',
    backgroundColor: disabled ? '#d1d5db' : C.primary,
    color: C.white,
  })

  const btnSecondary = {
    flex: 1, padding: '14px 20px', border: `2px solid ${C.grayBorder}`,
    borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '15px',
    transition: 'all 0.2s ease', backgroundColor: C.white, color: C.darkText,
  }

  return (
    <div style={{ minHeight: '100vh', background: C.grayLight, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
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

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ maxWidth: '640px', width: '100%' }}>
          {/* Step Indicator */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '40px', alignItems: 'center', background: C.white, borderRadius: '16px', padding: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px',
                  borderRadius: '10px', background: step === s.num ? C.primaryLight : 'transparent',
                  transition: 'all 0.3s ease', flex: 1, justifyContent: 'center',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px',
                    background: step > s.num ? C.primary : step === s.num ? C.primary : C.grayBorder,
                    color: step >= s.num ? C.white : C.gray, flexShrink: 0,
                    transition: 'all 0.3s ease',
                  }}>
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span style={{
                    fontSize: '12px', fontWeight: 600, color: step === s.num ? C.primary : step > s.num ? C.primary : C.gray,
                    whiteSpace: 'nowrap', display: i < 4 ? 'inline' : 'none',
                  }}>
                    {s.label}
                  </span>
                </div>
                {i < 3 && (
                  <div style={{
                    width: '20px', height: '2px', background: step > s.num ? C.primary : C.grayBorder,
                    transition: 'all 0.3s ease', flexShrink: 0,
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* STEP 1: ADDRESS SEARCH */}
          {step === 1 && (
            <div style={{
              background: C.white, borderRadius: '16px', padding: '40px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: `1px solid ${C.grayBorder}`,
            }}>
              <div style={{ marginBottom: '28px' }}>
                <h2 style={{
                  fontFamily: "'Merriweather', serif", fontSize: '28px', fontWeight: 900,
                  color: C.primary, margin: '0 0 8px 0', letterSpacing: '-0.5px',
                }}>
                  Find Your Property
                </h2>
                <p style={{ color: C.gray, fontSize: '15px', margin: 0, fontWeight: 500 }}>
                  Search by street address in Harris or Fort Bend County
                </p>
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', gap: '0', alignItems: 'center', border: `2px solid ${C.grayBorder}`, borderRadius: '12px', overflow: 'hidden', transition: 'all 0.2s ease', background: C.white }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '16px', flexShrink: 0 }}>
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="e.g., 1234 Westheimer Rd, Houston"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    autoFocus
                    style={{ ...inputStyle, border: 'none', borderRadius: 0, padding: '16px 12px' }}
                    onFocus={e => { e.currentTarget.parentElement!.style.borderColor = C.primary }}
                    onBlur={e => { e.currentTarget.parentElement!.style.borderColor = C.grayBorder }}
                  />
                </div>

                {searching && (
                  <div style={{ background: C.primaryLight, border: `1px solid ${C.primaryLight}`, borderRadius: '10px', padding: '14px 16px', marginTop: '12px', color: C.primary, fontSize: '14px', fontWeight: 500 }}>
                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', marginRight: '8px' }}>⏳</span>
                    Searching 1.5M properties...
                  </div>
                )}
                {searchError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '14px 16px', marginTop: '12px', color: '#991b1b', fontSize: '14px', fontWeight: 500 }}>
                    Error: {searchError}
                  </div>
                )}

                {suggestions.length > 0 && (
                  <div style={{
                    border: `1px solid ${C.grayBorder}`, borderRadius: '12px', marginTop: '8px',
                    maxHeight: '320px', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  }}>
                    {suggestions.map(p => (
                      <div
                        key={p.acct}
                        onClick={() => selectProperty(p)}
                        style={{
                          padding: '14px 18px', borderBottom: `1px solid ${C.grayLight}`,
                          cursor: 'pointer', transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = C.primaryLight)}
                        onMouseLeave={e => (e.currentTarget.style.background = C.white)}
                      >
                        <div style={{ fontWeight: 600, color: C.darkText, marginBottom: '3px', fontSize: '15px' }}>
                          {p.site_addr_1}
                        </div>
                        <div style={{ color: C.gray, fontSize: '13px' }}>
                          {p.city}, TX {p.zip} · {p.county} County
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {loadingEst && (
                  <div style={{ background: C.primaryLight, border: `1px solid ${C.primaryLight}`, borderRadius: '10px', padding: '14px 16px', marginTop: '12px', color: C.primary, fontSize: '14px', fontWeight: 500 }}>
                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', marginRight: '8px' }}>⏳</span>
                    Analyzing property and finding comparables...
                  </div>
                )}
                {estimateError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '14px 16px', marginTop: '12px', color: '#991b1b', fontSize: '14px', fontWeight: 500 }}>
                    Error: {estimateError}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: SAVINGS ESTIMATE */}
          {step === 2 && estimate && (
            <div style={{
              background: C.white, borderRadius: '16px', padding: '40px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: `1px solid ${C.grayBorder}`,
            }}>
              <div style={{ marginBottom: '28px' }}>
                <h2 style={{
                  fontFamily: "'Merriweather', serif", fontSize: '28px', fontWeight: 900,
                  color: C.primary, margin: '0 0 8px 0', letterSpacing: '-0.5px',
                }}>
                  Your Savings Estimate
                </h2>
                <p style={{ color: C.darkText, fontSize: '16px', fontWeight: 600, margin: 0 }}>
                  {estimate.subject.site_addr_1}
                </p>
                <p style={{ color: C.gray, fontSize: '14px', margin: '4px 0 0 0' }}>
                  {estimate.subject.city}, TX {estimate.subject.zip} · {estimate.subject.county} County
                </p>
              </div>

              {estimate.no_estimate ? (
                <>
                  <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '10px', padding: '16px', color: '#92400e', fontSize: '14px', fontWeight: 500, marginBottom: '20px' }}>
                    Not enough comparable data available. Try another address.
                  </div>
                  <button
                    onClick={() => { setStep(1); setQuery(''); setEstimate(null) }}
                    style={btnSecondary}
                  >
                    Try Another Address
                  </button>
                </>
              ) : (
                <>
                  {/* Savings Highlight */}
                  <div style={{
                    background: `linear-gradient(135deg, ${C.primaryLight} 0%, #dbeafe 100%)`,
                    border: `2px solid #93c5fd`, borderRadius: '16px', padding: '28px',
                    marginBottom: '24px', textAlign: 'center',
                  }}>
                    <p style={{ margin: '0 0 8px 0', color: C.primaryDark, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Potential Tax Savings
                    </p>
                    <h3 style={{
                      fontFamily: "'Merriweather', serif", fontSize: '40px', fontWeight: 900,
                      color: C.primaryDark, margin: '0 0 8px 0', letterSpacing: '-1px',
                    }}>
                      Save up to {fmt(estimate.savings_max ?? 0)}
                    </h3>
                    <p style={{ margin: '0 0 16px 0', color: C.gray, fontSize: '14px', fontWeight: 500 }}>
                      Range: {fmt(estimate.savings_min ?? 0)} – {fmt(estimate.savings_max ?? 0)}
                    </p>
                    <span style={{
                      display: 'inline-block', padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
                      fontWeight: 700, letterSpacing: '0.3px',
                      backgroundColor: estimate.confidence === 'high' ? '#dcfce7' : estimate.confidence === 'medium' ? '#fef3c7' : '#f3f4f6',
                      color: estimate.confidence === 'high' ? '#15803d' : estimate.confidence === 'medium' ? '#92400e' : C.gray,
                    }}>
                      {estimate.confidence?.toUpperCase()} CONFIDENCE · {estimate.comps_count} COMPS
                    </span>
                  </div>

                  {/* Property Details Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    {[
                      { label: 'Current CAD Value', value: fmt(estimate.subject.cur_appr_val), highlight: false },
                      { label: 'Argued Value', value: fmt(estimate.argued_value ?? 0), highlight: true },
                      { label: 'Property Size', value: `${Number(estimate.subject.bld_ar).toLocaleString()} sqft`, highlight: false },
                      { label: 'Annual Tax Savings', value: estimate.annual_tax_savings && estimate.annual_tax_savings > 0 ? fmt(estimate.annual_tax_savings) : '$0', highlight: true },
                    ].map((item, i) => (
                      <div key={i} style={{
                        backgroundColor: item.highlight ? C.primaryLight : C.grayLight,
                        padding: '16px', borderRadius: '10px',
                      }}>
                        <p style={{ margin: '0 0 4px 0', color: C.gray, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {item.label}
                        </p>
                        <p style={{
                          margin: 0, fontWeight: 700, fontSize: '18px',
                          color: item.highlight ? C.primaryDark : C.darkText,
                        }}>
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Method note */}
                  <div style={{
                    background: C.grayLight, borderRadius: '10px', padding: '14px 16px',
                    fontSize: '13px', color: C.gray, lineHeight: 1.6, marginBottom: '24px',
                  }}>
                    <strong style={{ color: C.darkText }}>Method:</strong> {estimate.comps_count} comps from {estimate.comp_basis === 'neighborhood' ? 'CAD neighborhood' : 'zip code'} · Median ${fmt(estimate.median_ppsf ?? 0)}/sqft (Winsorized 10/90, per §41.43)
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => { setStep(1); setQuery(''); setEstimate(null) }}
                      style={btnSecondary}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.grayBorder; e.currentTarget.style.color = C.darkText }}
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      style={btnPrimary()}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.primaryDark)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.primary)}
                    >
                      Continue →
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 3: CONTACT INFO */}
          {step === 3 && (
            <div style={{
              background: C.white, borderRadius: '16px', padding: '40px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: `1px solid ${C.grayBorder}`,
            }}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontFamily: "'Merriweather', serif", fontSize: '28px', fontWeight: 900,
                  color: C.primary, margin: '0 0 8px 0', letterSpacing: '-0.5px',
                }}>
                  Your Contact Info
                </h2>
                <p style={{ color: C.gray, fontSize: '15px', margin: 0, fontWeight: 500 }}>
                  Required to file your protest and send updates
                </p>
              </div>

              {[
                { label: 'Full Name', value: ownerName, setter: setOwnerName, type: 'text', placeholder: 'As it appears on tax records', required: false },
                { label: 'Email', value: ownerEmail, setter: setOwnerEmail, type: 'email', placeholder: 'you@example.com', required: true },
                { label: 'Phone (optional)', value: ownerPhone, setter: setOwnerPhone, type: 'tel', placeholder: '(713) 555-0100', required: false },
              ].map((field, i) => (
                <div key={i} style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '13px',
                    color: C.primary, letterSpacing: '0.5px', textTransform: 'uppercase',
                  }}>
                    {field.label}
                    {field.required && <span style={{ color: C.error, marginLeft: '4px' }}>*</span>}
                  </label>
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={e => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = C.primary)}
                    onBlur={e => (e.currentTarget.style.borderColor = C.grayBorder)}
                  />
                </div>
              ))}

              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button
                  onClick={() => setStep(2)}
                  style={btnSecondary}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.grayBorder; e.currentTarget.style.color = C.darkText }}
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!ownerName.trim() || !ownerEmail.trim()}
                  style={btnPrimary(!ownerName.trim() || !ownerEmail.trim())}
                  onMouseEnter={e => { if (ownerName.trim() && ownerEmail.trim()) e.currentTarget.style.backgroundColor = C.primaryDark }}
                  onMouseLeave={e => { if (ownerName.trim() && ownerEmail.trim()) e.currentTarget.style.backgroundColor = C.primary }}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW */}
          {step === 4 && estimate && (
            <div style={{
              background: C.white, borderRadius: '16px', padding: '40px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: `1px solid ${C.grayBorder}`,
            }}>
              <div style={{ marginBottom: '28px' }}>
                <h2 style={{
                  fontFamily: "'Merriweather', serif", fontSize: '28px', fontWeight: 900,
                  color: C.primary, margin: '0 0 8px 0', letterSpacing: '-0.5px',
                }}>
                  Review & Authorize
                </h2>
                <p style={{ color: C.gray, fontSize: '15px', margin: 0, fontWeight: 500 }}>
                  Please verify all details before filing
                </p>
              </div>

              {/* Review Table */}
              <div style={{ marginBottom: '24px' }}>
                {[
                  { label: 'Property', value: `${estimate.subject.site_addr_1}, ${estimate.subject.city}` },
                  { label: 'CAD Account', value: estimate.subject.acct },
                  { label: 'County', value: `${estimate.subject.county} County` },
                  { label: 'Current CAD Value', value: fmt(estimate.subject.cur_appr_val) },
                  { label: 'Argued Value', value: fmt(estimate.argued_value ?? 0), highlight: true },
                  { label: 'Owner', value: ownerName },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 0', borderBottom: i < 5 ? `1px solid ${C.grayLight}` : 'none',
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

              {/* What Happens Next */}
              <div style={{
                background: C.primaryLight, border: `1px solid ${C.primaryLight}`,
                borderRadius: '12px', padding: '20px', marginBottom: '24px',
              }}>
                <h4 style={{ margin: '0 0 12px 0', color: C.primaryDark, fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  What Happens Next
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: C.primary, lineHeight: 1.6 }}>
                  <div>1. TrimTax generates Forms 50-132 & 50-162</div>
                  <div>2. Files with CAD + attends informal hearing</div>
                  <div>3. You're notified of outcome (no action needed)</div>
                  <div>4. If successful, 25% of first-year savings invoiced</div>
                </div>
              </div>

              {submitError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', color: '#991b1b', fontSize: '14px', fontWeight: 500 }}>
                  ✗ Error: {submitError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setStep(3)}
                  style={btnSecondary}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.grayBorder; e.currentTarget.style.color = C.darkText }}
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={btnPrimary(submitting)}
                  onMouseEnter={e => { if (!submitting) e.currentTarget.style.backgroundColor = C.primaryDark }}
                  onMouseLeave={e => { if (!submitting) e.currentTarget.style.backgroundColor = C.primary }}
                >
                  {submitting ? '⏳ Filing...' : 'File My Protest →'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}