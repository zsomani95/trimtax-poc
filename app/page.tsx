'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()
  const [address, setAddress] = useState('')
  const [searching, setSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address.trim()) return

    setSearching(true)
    try {
      const res = await fetch(`/api/properties/search?q=${encodeURIComponent(address)}`)
      const data = await res.json()

      if (data.results?.length > 0) {
        router.push(`/intake?address=${encodeURIComponent(address)}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSearching(false)
    }
  }

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
          <form onSubmit={handleSearch} style={{ display: 'grid', gap: '16px', marginBottom: '40px' }}>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              display: 'grid',
              gap: '12px',
            }}>
              <label style={{ textAlign: 'left', fontWeight: 'bold', color: '#111827', fontSize: '14px' }}>
                Enter your property address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
              <button
                type="submit"
                disabled={searching || !address.trim()}
                style={{
                  background: searching || !address.trim() ? '#ccc' : '#047857',
                  color: '#fff',
                  padding: '14px',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: searching || !address.trim() ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                {searching ? '⏳ Searching...' : 'Get My Estimate →'}
              </button>
            </div>
          </form>

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
