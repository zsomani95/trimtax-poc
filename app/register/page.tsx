'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TrimTaxLogo from '@/components/TrimTaxLogo'

const C = {
  primary: '#1e3a5f', primaryDark: '#152e4d', primaryLight: '#e8eef6',
  dark: '#0f172a', darkAlt: '#1e293b', darkText: '#111827',
  white: '#ffffff', gray: '#6b7280', grayLight: '#f3f4f6',
  grayBorder: '#e5e7eb', error: '#dc2626', accent: '#2563eb',
}

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else if (data.token) {
        localStorage.setItem('authToken', data.token)
        router.push('/dashboard')
      }
    } catch {
      setError('Connection failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '14px 16px', fontSize: '16px', fontWeight: 500,
    border: `2px solid ${C.grayBorder}`, borderRadius: '10px', boxSizing: 'border-box' as const,
    color: C.darkText, backgroundColor: C.white, transition: 'all 0.2s ease',
    fontFamily: "'Inter', sans-serif",
  }

  return (
    <div style={{ minHeight: '100vh', background: C.grayLight, display: 'flex', flexDirection: 'column' }}>
      <header style={{
        padding: '16px 40px', background: C.white, borderBottom: `1px solid ${C.grayBorder}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <TrimTaxLogo size={140} />
        </Link>
        <Link
          href="/login"
          style={{ color: C.primary, textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}
        >
          Sign In
        </Link>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{
          background: C.white, borderRadius: '16px', padding: '48px', maxWidth: '440px', width: '100%',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: `1px solid ${C.grayBorder}`,
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{
              fontFamily: "'Merriweather', serif", fontSize: '28px', fontWeight: 900,
              color: C.primary, margin: '0 0 8px 0', letterSpacing: '-0.5px',
            }}>
              Create Your Account
            </h2>
            <p style={{ color: C.gray, fontSize: '15px', margin: 0, fontWeight: 500 }}>
              Start tracking your property tax protests
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '13px', color: C.primary, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Smith"
                required
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = C.primary)}
                onBlur={e => (e.currentTarget.style.borderColor = C.grayBorder)}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '13px', color: C.primary, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = C.primary)}
                onBlur={e => (e.currentTarget.style.borderColor = C.grayBorder)}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '13px', color: C.primary, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = C.primary)}
                  onBlur={e => (e.currentTarget.style.borderColor = C.grayBorder)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: C.gray,
                    fontSize: '12px', fontWeight: 600,
                  }}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '13px', color: C.primary, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = C.primary)}
                onBlur={e => (e.currentTarget.style.borderColor = C.grayBorder)}
              />
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '14px 16px', color: '#991b1b', fontSize: '14px', fontWeight: 500 }}>
                ✗ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', background: loading ? '#d1d5db' : C.primary,
                color: C.white, border: 'none', borderRadius: '10px', fontWeight: 700,
                fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease', letterSpacing: '0.3px',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = C.primaryDark }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = C.primary }}
            >
              {loading ? '⏳ Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', color: C.gray, fontSize: '14px' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: C.accent, textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}