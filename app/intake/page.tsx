'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const colors = {
  primary: '#059669', primaryDark: '#047857', dark: '#0f172a',
  darkText: '#111827', white: '#ffffff', gray: '#6b7280',
  grayLight: '#f3f4f6', error: '#dc2626',
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
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

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
    if (q.length < 3) {
      setSuggestions([])
      setSearchError('')
      return
    }
    setSearching(true)
    setSearchError('')
    try {
      const res = await fetch(`/api/properties/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (data.error) {
        setSearchError(data.error)
        setSuggestions([])
      } else {
        setSuggestions(data.results ?? [])
      }
    } catch (err) {
      setSearchError(String(err))
    } finally {
      setSearching(false)
    }
  }, [])

  // Load pre-selected property from URL params
  useEffect(() => {
    const acct = searchParams.get('acct')
    if (acct) {
      setLoadingEst(true)
      setEstimateError('')
      fetch(`/api/properties/${encodeURIComponent(acct)}/estimate`)
        .then(res => res.json())
        .then((data: Estimate) => {
          if (data.error) {
            setEstimateError(data.error)
          } else {
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
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, doSearch])

  const selectProperty = async (p: Property) => {
    setSuggestions([])
    setQuery(`${p.site_addr_1}, ${p.city}`)
    setLoadingEst(true)
    setEstimateError('')
    try {
      const res = await fetch(`/api/properties/${encodeURIComponent(p.acct)}/estimate`)
      const data: Estimate = await res.json()
      if (data.error) {
        setEstimateError(data.error)
        setEstimate(null)
      } else {
        setEstimate(data)
        setOwnerName(p.owner_name ?? '')
        setStep(2)
      }
    } catch (err) {
      setEstimateError(String(err))
    } finally {
      setLoadingEst(false)
    }
  }

  const handleSubmit = async () => {
    if (!estimate?.subject) return
    setSubmitting(true)
    setSubmitError('')
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
      if (result.error) {
        setSubmitError(result.error)
      } else {
        router.push(`/sign/${result.id}`)
      }
    } catch (err) {
      setSubmitError(String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        [style*="animation: spin"] {
          display: inline-block;
        }
      `}</style>

      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#111827' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>← TrimTax</h1>
        </Link>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '0 20px 20px 20px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '8px', fontSize: '28px', fontWeight: 700, color: colors.darkText }}>
            {step === 1 ? 'Find Your Property' : step === 2 ? 'Review Estimate' : step === 3 ? 'Your Contact Info' : 'Review & Authorize'}
          </h2>
          <p style={{ color: colors.gray, marginTop: 0, marginBottom: 0, fontSize: '15px', fontWeight: 500 }}>Step {step} of 4</p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', alignItems: 'center' }}>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '13px',
                background: step > s ? colors.primary : step === s ? colors.white : colors.grayLight,
                color: step > s ? colors.white : step === s ? colors.primary : '#9ca3af',
                border: step === s ? `2px solid ${colors.primary}` : 'none',
                flexShrink: 0,
                transition: 'all 0.3s ease'
              }}>
                {step > s ? '✓' : s}
              </div>
              {s < 4 && (
                <div style={{
                  flex: 1,
                  height: '2px',
                  background: step > s ? colors.primary : colors.grayLight,
                  marginLeft: '8px',
                  transition: 'all 0.3s ease'
                }} />
              )}
            </div>
          ))}
        </div>

      {/* STEP 1: ADDRESS SEARCH */}
      {step === 1 && (
        <div style={{ border: '1px solid #ddd', padding: '24px', borderRadius: '8px', backgroundColor: '#fff' }}>
          <h2 style={{ marginTop: 0 }}>Find Your Property</h2>
          <p style={{ color: '#666' }}>Type your street address (Harris or Fort Bend County)</p>

          <input
            type="text"
            placeholder="e.g., 1234 Westheimer Rd"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #999',
              color: '#1f2937',
              borderRadius: '4px',
              boxSizing: 'border-box',
              marginBottom: '10px',
            }}
          />

          {searching && (
            <div style={{ background: '#e0f2fe', border: '1px solid #0284c7', borderRadius: '4px', padding: '12px', margin: '10px 0', color: '#0369a1' }}>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', marginRight: '8px' }}>⏳</span>
              Searching properties...
            </div>
          )}
          {searchError && <div style={{ background: '#fee2e2', border: '1px solid #dc2626', borderRadius: '4px', padding: '12px', margin: '10px 0', color: '#991b1b' }}>Error: {searchError}</div>}

          {suggestions.length > 0 && (
            <ul style={{ border: '1px solid #ddd', maxHeight: '300px', overflowY: 'auto', margin: '10px 0', padding: 0, listStyle: 'none', borderRadius: '4px' }}>
              {suggestions.map(p => (
                <li
                  key={p.acct}
                  onClick={() => selectProperty(p)}
                  style={{
                    padding: '12px',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    backgroundColor: '#fff',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0fdf4')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
                >
                  <strong style={{ display: 'block' }}>{p.site_addr_1}</strong>
                  <span style={{ color: '#666', fontSize: '13px' }}>
                    {p.city}, TX {p.zip} · {p.county} County
                  </span>
                </li>
              ))}
            </ul>
          )}

          {loadingEst && (
            <div style={{ background: '#dbeafe', border: '1px solid #0284c7', borderRadius: '4px', padding: '12px', margin: '10px 0', color: '#0369a1' }}>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', marginRight: '8px' }}>⏳</span>
              Analyzing property and finding comparables...
            </div>
          )}
          {estimateError && <div style={{ background: '#fee2e2', border: '1px solid #dc2626', borderRadius: '4px', padding: '12px', margin: '10px 0', color: '#991b1b' }}>Error: {estimateError}</div>}
        </div>
      )}

      {/* STEP 2: SAVINGS ESTIMATE */}
      {step === 2 && estimate && (
        <div style={{ border: '1px solid #ddd', padding: '24px', borderRadius: '8px', backgroundColor: '#fff' }}>
          <h2 style={{ marginTop: 0 }}>Your Savings Estimate</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            <strong>{estimate.subject.site_addr_1}</strong><br />
            {estimate.subject.city}, TX {estimate.subject.zip} · {estimate.subject.county} County
          </p>

          {estimate.no_estimate ? (
            <>
              <p style={{ color: '#d97706', backgroundColor: '#fffbeb', padding: '12px', borderRadius: '4px' }}>
                Not enough comparable data. Try another address.
              </p>
              <button
                onClick={() => {
                  setStep(1)
                  setQuery('')
                  setEstimate(null)
                }}
                style={{
                  marginTop: '15px',
                  padding: '10px 20px',
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Try Another Address
              </button>
            </>
          ) : (
            <>
              <div style={{
                backgroundColor: '#d1fae5',
                border: '1px solid #6ee7b7',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center',
              }}>
                <p style={{ margin: '0 0 10px 0', color: '#059669', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Potential Tax Savings
                </p>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '32px', color: '#047857' }}>
                  Save up to {fmt(estimate.savings_max ?? 0)}
                </h3>
                <p style={{ margin: '5px 0 15px 0', color: '#666', fontSize: '13px' }}>
                  Range: {fmt(estimate.savings_min ?? 0)} – {fmt(estimate.savings_max ?? 0)}
                </p>
                <span style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: estimate.confidence === 'high' ? '#dcfce7' : estimate.confidence === 'medium' ? '#fef3c7' : '#f3f4f6',
                  color: estimate.confidence === 'high' ? '#15803d' : estimate.confidence === 'medium' ? '#92400e' : '#666',
                }}>
                  {estimate.confidence} confidence · {estimate.comps_count} comps
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '4px', fontSize: '13px' }}>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>Current CAD Value</p>
                  <p style={{ margin: '0', fontWeight: 'bold' }}>{fmt(estimate.subject.cur_appr_val)}</p>
                </div>
                <div style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '4px', fontSize: '13px' }}>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>Argued Value</p>
                  <p style={{ margin: '0', fontWeight: 'bold', color: '#047857' }}>{fmt(estimate.argued_value ?? 0)}</p>
                </div>
                <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '4px', fontSize: '13px' }}>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>Size</p>
                  <p style={{ margin: '0', fontWeight: 'bold' }}>{Number(estimate.subject.bld_ar).toLocaleString()} sqft</p>
                </div>
                <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '4px', fontSize: '13px' }}>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>Annual Tax Savings</p>
                  <p style={{ margin: '0', fontWeight: 'bold', color: estimate.annual_tax_savings && estimate.annual_tax_savings > 0 ? '#047857' : '#999' }}>
                    {estimate.annual_tax_savings !== undefined ? (estimate.annual_tax_savings > 0 ? fmt(estimate.annual_tax_savings) : '$0') : '—'}
                  </p>
                  {estimate.tax_rate && <p style={{ margin: '4px 0 0 0', color: '#999', fontSize: '11px' }}>@ {estimate.tax_rate}</p>}
                </div>
              </div>

              <p style={{
                backgroundColor: '#f3f4f6',
                padding: '12px',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#666',
                margin: '20px 0',
                lineHeight: '1.5',
              }}>
                <strong>Method:</strong> {estimate.comps_count} comps from {estimate.comp_basis === 'neighborhood' ? 'CAD neighborhood' : 'zip code'} ·
                Median $/sqft: {fmt(estimate.median_ppsf ?? 0)}/sqft (Winsorized 10/90, per §41.43)
              </p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    setStep(1)
                    setQuery('')
                    setEstimate(null)
                  }}
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
                  onClick={() => setStep(3)}
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
                  Continue
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* STEP 3: CONTACT INFO */}
      {step === 3 && (
        <div style={{ border: '1px solid #ddd', padding: '24px', borderRadius: '8px', backgroundColor: '#fff' }}>
          <h2 style={{ marginTop: 0 }}>Your Contact Info</h2>
          <p style={{ color: '#666' }}>Needed to file and send results</p>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
              Full Name
            </label>
            <input
              type="text"
              value={ownerName}
              onChange={e => setOwnerName(e.target.value)}
              placeholder="As it appears on tax records"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
              Email <span style={{ color: '#d32f2f' }}>*</span>
            </label>
            <input
              type="email"
              value={ownerEmail}
              onChange={e => setOwnerEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
              Phone (optional)
            </label>
            <input
              type="tel"
              value={ownerPhone}
              onChange={e => setOwnerPhone(e.target.value)}
              placeholder="(713) 555-0100"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
              }}
            />
          </div>

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
              onClick={() => setStep(4)}
              disabled={!ownerName.trim() || !ownerEmail.trim()}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: !ownerName.trim() || !ownerEmail.trim() ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                opacity: !ownerName.trim() || !ownerEmail.trim() ? 0.5 : 1,
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW */}
      {step === 4 && estimate && (
        <div style={{ border: '1px solid #ddd', padding: '24px', borderRadius: '8px', backgroundColor: '#fff' }}>
          <h2 style={{ marginTop: 0 }}>Review & Authorize</h2>

          <table style={{ width: '100%', marginBottom: '20px', fontSize: '14px', borderCollapse: 'collapse' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>Property</td>
                <td style={{ textAlign: 'right', padding: '10px' }}>{estimate.subject.site_addr_1}, {estimate.subject.city}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>CAD Account</td>
                <td style={{ textAlign: 'right', padding: '10px' }}>{estimate.subject.acct}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>County</td>
                <td style={{ textAlign: 'right', padding: '10px' }}>{estimate.subject.county} County</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>Current Value</td>
                <td style={{ textAlign: 'right', padding: '10px' }}>{fmt(estimate.subject.cur_appr_val)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee', backgroundColor: '#f0fdf4' }}>
                <td style={{ padding: '10px', fontWeight: 'bold', color: '#047857' }}>Argued Value</td>
                <td style={{ textAlign: 'right', padding: '10px', fontWeight: 'bold', color: '#047857' }}>{fmt(estimate.argued_value ?? 0)}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>Owner</td>
                <td style={{ textAlign: 'right', padding: '10px' }}>{ownerName}</td>
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
            <strong>What happens next:</strong><br />
            1. TrimTax generates Forms 50-132 &amp; 50-162<br />
            2. Files with CAD + attends informal hearing<br />
            3. You're notified of outcome (no action needed)<br />
            4. If successful, 25% of first-year savings invoiced
          </div>

          {submitError && <p style={{ color: '#d32f2f', marginBottom: '15px' }}>Error: {submitError}</p>}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setStep(3)}
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
              disabled={submitting}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: submitting ? '#ccc' : '#047857',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
              }}
            >
              {submitting ? '⏳ Filing...' : 'File My Protest →'}
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}