'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const colors = {
  primary: '#059669',
  primaryDark: '#047857',
  dark: '#0f172a',
  darkAlt: '#1e293b',
  darkText: '#111827',
  white: '#ffffff',
  gray: '#6b7280',
  grayLight: '#f3f4f6',
  error: '#dc2626',
  success: '#059669',
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setRegistered(true)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }

      localStorage.setItem('authToken', data.token)
      router.push('/dashboard')
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: `linear-gradient(135deg, ${colors.grayLight} 0%, ${colors.white} 100%)` }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;600&display=swap');
        * { font-family: 'IBM Plex Sans', sans-serif; }
        h1, h2, h3 { font-family: 'Playfair Display', serif; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .form-container { animation: slideUp 0.5s ease-out; }
        input:focus { outline: none; border-color: ${colors.primary} !important; box-shadow: 0 0 0 3px ${colors.primary}20; }
      `}</style>

      {/* Minimal Header */}
      <div style={{ padding: '28px 40px', background: colors.white, borderBottom: `1px solid ${colors.grayLight}` }}>
        <Link href="/" style={{ textDecoration: 'none', color: colors.darkText }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>TrimTax</h1>
        </Link>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div className="form-container" style={{ maxWidth: '420px', width: '100%', background: colors.white, borderRadius: '12px', padding: '48px 40px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: colors.darkText, margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>Sign In</h2>
          <p style={{ color: colors.gray, margin: '0 0 32px 0', fontSize: '15px', fontWeight: 500 }}>Track your property tax protest progress</p>

          {registered && (
            <div style={{ background: '#d1fae5', border: `2px solid ${colors.success}`, borderRadius: '8px', padding: '12px 14px', color: colors.primaryDark, marginBottom: '20px', fontSize: '13px', fontWeight: 600 }}>
              ✓ Account created successfully! Please sign in.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: colors.darkText, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: `2px solid ${colors.grayLight}`,
                  borderRadius: '8px',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  color: colors.darkText,
                  backgroundColor: colors.white,
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: colors.darkText, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: `2px solid ${colors.grayLight}`,
                  borderRadius: '8px',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  color: colors.darkText,
                  backgroundColor: colors.white,
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
              />
            </div>

            {error && (
              <div style={{ background: '#fee2e2', border: `1px solid ${colors.error}`, borderRadius: '8px', padding: '12px 14px', color: colors.error, fontSize: '13px', fontWeight: 500 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '14px 20px',
                background: loading ? '#d1d5db' : colors.primary,
                color: colors.white,
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '15px',
                transition: 'all 0.3s ease',
                marginTop: '8px',
                letterSpacing: '0.3px',
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.primaryDark)}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.primary)}
            >
              {loading ? '⏳ Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Create Account Link */}
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${colors.grayLight}`, textAlign: 'center', fontSize: '14px', color: colors.gray }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: colors.primary, textDecoration: 'none', fontWeight: 600 }}>
              Create one
            </Link>
          </div>

          <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: '#9ca3af', backgroundColor: colors.grayLight, padding: '10px 12px', borderRadius: '6px' }}>
            💡 Demo: use any email/password (min 8 chars)
          </div>
        </div>
      </div>
    </div>
  )
}
