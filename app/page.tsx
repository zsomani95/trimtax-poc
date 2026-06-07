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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', margin: 0 }}>TrimTax</h1>
          <p style={{ color: '#aaa', fontSize: '12px', margin: '4px 0 0 0' }}>Automated Property Tax Protests</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            href="/login"
            style={{
              color: '#0066cc',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              padding: '10px 20px',
              border: '1px solid #0066cc',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0066cc'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#0066cc'
            }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            style={{
              background: '#047857',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ maxWidth: '700px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '48px', fontWeight: 'bold', color: '#fff', margin: '0 0 16px 0', lineHeight: '1.2' }}>
            Lower Your Property Tax
          </h2>
          <p style={{ fontSize: '20px', color: '#aaa', margin: '0 0 40px 0', lineHeight: '1.6' }}>
            TrimTax automates your property tax protest. We handle everything from valuation analysis to filing. Pay nothing unless we win.
          </p>

          {/* Search Box */}
          <div style={{ display: 'grid', gap: '16px', marginBottom: '40px', position: 'relative' }} ref={dropdownRef}>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              display: 'grid',
              gap: '12px',
              position: 'relative',
            }}>
              <label style={{ textAlign: 'left', fontWeight: 'bold', color: '#111827', fontSize: '14px' }}>
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
                  padding: '14px',
                  border: '1px solid #999',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  color: '#1f2937',
                  backgroundColor: '#fff',
                }}
              />

              {/* Autocomplete Dropdown */}
              {showDropdown && results.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: '#fff',
                  border: '1px solid #ddd',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  zIndex: 10,
                  marginTop: '-8px',
                  paddingTop: '8px',
                }}>
                  {results.map((property) => (
                    <button
                      key={property.acct}
                      onClick={() => handleSelectProperty(property)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#1f2937',
                        borderBottom: '1px solid #f3f4f6',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ fontWeight: 'bold' }}>{property.site_addr_1}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {property.city}, {property.zip}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {showDropdown && searching && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: '#fff',
                  border: '1px solid #ddd',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  padding: '12px 14px',
                  textAlign: 'center',
                  color: '#666',
                  fontSize: '14px',
                }}>
                  ⏳ Searching...
                </div>
              )}

              {showDropdown && !searching && results.length === 0 && address.trim() && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: '#fff',
                  border: '1px solid #ddd',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  padding: '12px 14px',
                  textAlign: 'center',
                  color: '#999',
                  fontSize: '14px',
                }}>
                  No properties found
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ color: '#fff' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏠</div>
              <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>Real Data</p>
              <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>1.5M Harris & Fort Bend properties</p>
            </div>
            <div style={{ color: '#fff' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
              <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>Instant Estimate</p>
              <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>Comp algorithm with confidence score</p>
            </div>
            <div style={{ color: '#fff' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>✍️</div>
              <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>E-Signature</p>
              <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>Sign & file in minutes</p>
            </div>
            <div style={{ color: '#fff' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
              <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>25% Contingency</p>
              <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>Pay nothing unless we win</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: '20px 40px', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#aaa', fontSize: '12px', textAlign: 'center' }}>
        <p style={{ margin: 0 }}>TrimTax is a document preparation service, not a licensed appraisal or legal service.</p>
        <p style={{ margin: '8px 0 0 0' }}>© 2026 TrimTax. All rights reserved.</p>
      </footer>
    </div>
  )
}
