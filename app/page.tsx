'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Property {
  acct: string
  site_addr_1: string
  city: string
  zip: string
}

const colors = {
  primary: '#059669',
  primaryDark: '#047857',
  dark: '#0f172a',
  darkAlt: '#1e293b',
  darkText: '#111827',
  white: '#ffffff',
  gray: '#6b7280',
  grayLight: '#f3f4f6',
}

export default function HomePage() {
  const router = useRouter()
  const [address, setAddress] = useState('')
  const [results, setResults] = useState<Property[]>([])
  const [searching, setSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleInputChange = async (value: string) => {
    setAddress(value)

    if (!value.trim()) {
      setResults([])
      setShowDropdown(false)
      return
    }

    setSearching(true)
    try {
      const res = await fetch(`/api/properties/search?q=${encodeURIComponent(value)}`)
      const data = await res.json()
      setResults(data.results || [])
      setShowDropdown(true)
    } catch (err) {
      console.error(err)
      setResults([])
    } finally {
      setSearching(false)
    }
  }

  const handleSelectProperty = (property: Property) => {
    router.push(`/intake?acct=${encodeURIComponent(property.acct)}`)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: colors.white, display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;600&display=swap');

        * { font-family: 'IBM Plex Sans', sans-serif; }
        h1, h2, h3 { font-family: 'Playfair Display', serif; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .hero-section { animation: fadeIn 0.6s ease-out; }
        .search-box { animation: slideUp 0.6s ease-out 0.2s both; }
        .feature { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .feature:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }

        input::placeholder { color: '#9ca3af'; }
        input:focus { outline: none; border-color: ${colors.primary} !important; box-shadow: 0 0 0 3px ${colors.primary}20; }
      `}
      </style>

      {/* Header */}
      <header style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${colors.grayLight}`, background: colors.white }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: colors.darkText, margin: 0, letterSpacing: '-0.5px' }}>TrimTax</h1>
          <p style={{ color: colors.gray, fontSize: '13px', margin: '4px 0 0 0', fontWeight: 500 }}>Automated Property Tax Protests</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            href="/login"
            style={{
              color: colors.primary,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '14px',
              padding: '11px 24px',
              border: `2px solid ${colors.primary}`,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary
              e.currentTarget.style.color = colors.white
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = colors.primary
            }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            style={{
              background: colors.primary,
              color: colors.white,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '14px',
              padding: '11px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryDark)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="hero-section" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', background: `linear-gradient(135deg, ${colors.grayLight} 0%, ${colors.white} 100%)`, position: 'relative', overflow: 'hidden' }}>
        {/* Decorative background element */}
        <div style={{ position: 'absolute', width: '600px', height: '600px', background: `radial-gradient(circle, ${colors.primary}08 0%, transparent 70%)`, borderRadius: '50%', top: '-200px', right: '-200px', zIndex: 0 }} />

        <div style={{ maxWidth: '680px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '56px', fontWeight: 700, color: colors.darkText, margin: '0 0 20px 0', lineHeight: 1.2, letterSpacing: '-1px' }}>
            Lower Your Property Tax
          </h2>
          <p style={{ fontSize: '18px', color: colors.gray, margin: '0 0 48px 0', lineHeight: 1.7, fontWeight: 500 }}>
            TrimTax automates your property tax protest. We analyze your property, find comparable sales, and handle everything from filing to resolution. Pay nothing unless we win.
          </p>

          {/* Search Box */}
          <div className="search-box" style={{ position: 'relative', marginBottom: '80px', zIndex: 50 }} ref={dropdownRef}>
            <div style={{
              background: colors.white,
              borderRadius: '12px',
              padding: '28px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
              display: 'grid',
              gap: '14px',
              position: 'relative',
            }}>
              <label style={{ textAlign: 'left', fontWeight: 600, color: colors.darkText, fontSize: '15px', letterSpacing: '0.3px' }}>
                Enter your property address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => address.trim() && setShowDropdown(true)}
                placeholder="e.g., 123 Westheimer Rd, Houston, TX"
                autoFocus
                style={{
                  padding: '16px',
                  border: `2px solid ${colors.grayLight}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  color: colors.darkText,
                  backgroundColor: colors.white,
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                }}
              />

              {/* Autocomplete Dropdown */}
              {showDropdown && results.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  right: 0,
                  background: colors.white,
                  border: `1px solid ${colors.grayLight}`,
                  borderRadius: '8px',
                  maxHeight: '320px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                }}>
                  {results.map((property, idx) => (
                    <div
                      key={property.acct}
                      onClick={() => {
                        handleSelectProperty(property)
                        setShowDropdown(false)
                      }}
                      style={{
                        padding: '14px 16px',
                        borderBottom: idx < results.length - 1 ? `1px solid ${colors.grayLight}` : 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: colors.darkText,
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.grayLight)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div style={{ fontWeight: 600, marginBottom: '3px' }}>{property.site_addr_1}</div>
                      <div style={{ fontSize: '13px', color: colors.gray }}>
                        {property.city}, {property.zip}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showDropdown && searching && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  right: 0,
                  background: colors.white,
                  border: `1px solid ${colors.grayLight}`,
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                  color: colors.gray,
                  fontSize: '14px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                  zIndex: 1000,
                }}>
                  ⏳ Searching properties...
                </div>
              )}

              {showDropdown && !searching && results.length === 0 && address.trim() && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  right: 0,
                  background: colors.white,
                  border: `1px solid ${colors.grayLight}`,
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                  color: '#9ca3af',
                  fontSize: '14px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                  zIndex: 1000,
                }}>
                  No properties found
                </div>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
            <div className="feature" style={{
              padding: '28px 24px',
              background: colors.white,
              borderRadius: '12px',
              border: `1px solid ${colors.grayLight}`,
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '80px',
                height: '80px',
                background: `radial-gradient(circle, ${colors.primary}15 0%, transparent 70%)`,
                borderRadius: '50%',
                zIndex: 0
              }} />
              <div style={{ fontSize: '48px', marginTop: '20px', marginBottom: '12px', zIndex: 1, position: 'relative' }}>📊</div>
              <p style={{ fontWeight: 700, margin: '0 0 8px 0', color: colors.darkText, fontSize: '16px', letterSpacing: '-0.3px' }}>Real Data</p>
              <p style={{ color: colors.gray, fontSize: '14px', margin: 0, lineHeight: 1.5 }}>1.5M verified properties</p>
            </div>

            <div className="feature" style={{
              padding: '28px 24px',
              background: colors.white,
              borderRadius: '12px',
              border: `1px solid ${colors.grayLight}`,
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '80px',
                height: '80px',
                background: `radial-gradient(circle, ${colors.primary}15 0%, transparent 70%)`,
                borderRadius: '50%',
                zIndex: 0
              }} />
              <div style={{ fontSize: '48px', marginTop: '20px', marginBottom: '12px', zIndex: 1, position: 'relative' }}>🎯</div>
              <p style={{ fontWeight: 700, margin: '0 0 8px 0', color: colors.darkText, fontSize: '16px', letterSpacing: '-0.3px' }}>Smart Analysis</p>
              <p style={{ color: colors.gray, fontSize: '14px', margin: 0, lineHeight: 1.5 }}>Instant accurate estimates</p>
            </div>

            <div className="feature" style={{
              padding: '28px 24px',
              background: colors.white,
              borderRadius: '12px',
              border: `1px solid ${colors.grayLight}`,
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '80px',
                height: '80px',
                background: `radial-gradient(circle, ${colors.primary}15 0%, transparent 70%)`,
                borderRadius: '50%',
                zIndex: 0
              }} />
              <div style={{ fontSize: '48px', marginTop: '20px', marginBottom: '12px', zIndex: 1, position: 'relative' }}>✍️</div>
              <p style={{ fontWeight: 700, margin: '0 0 8px 0', color: colors.darkText, fontSize: '16px', letterSpacing: '-0.3px' }}>E-Signature</p>
              <p style={{ color: colors.gray, fontSize: '14px', margin: 0, lineHeight: 1.5 }}>Sign in minutes</p>
            </div>

            <div className="feature" style={{
              padding: '28px 24px',
              background: colors.white,
              borderRadius: '12px',
              border: `1px solid ${colors.grayLight}`,
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '80px',
                height: '80px',
                background: `radial-gradient(circle, ${colors.primary}15 0%, transparent 70%)`,
                borderRadius: '50%',
                zIndex: 0
              }} />
              <div style={{ fontSize: '48px', marginTop: '20px', marginBottom: '12px', zIndex: 1, position: 'relative' }}>💰</div>
              <p style={{ fontWeight: 700, margin: '0 0 8px 0', color: colors.darkText, fontSize: '16px', letterSpacing: '-0.3px' }}>Contingency</p>
              <p style={{ color: colors.gray, fontSize: '14px', margin: 0, lineHeight: 1.5 }}>25% only if we win</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: '32px 40px', background: colors.darkAlt, color: '#a0aec0', fontSize: '13px', textAlign: 'center', borderTop: `1px solid ${colors.dark}20` }}>
        <p style={{ margin: 0, fontWeight: 500 }}>TrimTax is a document preparation service, not a licensed appraisal or legal service.</p>
        <p style={{ margin: '8px 0 0 0', color: '#64748b' }}>© 2026 TrimTax. All rights reserved.</p>
      </footer>
    </div>
  )
}
