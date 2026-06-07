'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { validateRegistration } from '@/lib/validation'

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
}

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const validationErrors = validateRegistration({
      fullName,
      email,
      password,
      confirmPassword,
    })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrors({ submit: data.error || 'Registration failed' })
        return
      }

      router.push('/login?registered=true')
    } catch (err) {
      setErrors({ submit: 'An error occurred. Please try again.' })
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
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: colors.darkText, margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>Create Account</h2>
          <p style={{ color: colors.gray, margin: '0 0 32px 0', fontSize: '15px', fontWeight: 500 }}>Join TrimTax to track your property tax protest</p>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: colors.darkText, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: errors.fullName ? `2px solid ${colors.error}` : `2px solid ${colors.grayLight}`,
                  borderRadius: '8px',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  color: colors.darkText,
                  backgroundColor: colors.white,
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
              />
              {errors.fullName && <p style={{ color: colors.error, fontSize: '13px', margin: '6px 0 0 0', fontWeight: 500 }}>✗ {errors.fullName}</p>}
            </div>

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
                  border: errors.email ? `2px solid ${colors.error}` : `2px solid ${colors.grayLight}`,
                  borderRadius: '8px',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  color: colors.darkText,
                  backgroundColor: colors.white,
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
              />
              {errors.email && <p style={{ color: colors.error, fontSize: '13px', margin: '6px 0 0 0', fontWeight: 500 }}>✗ {errors.email}</p>}
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
                  border: errors.password ? `2px solid ${colors.error}` : `2px solid ${colors.grayLight}`,
                  borderRadius: '8px',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  color: colors.darkText,
                  backgroundColor: colors.white,
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
              />
              {errors.password && <p style={{ color: colors.error, fontSize: '13px', margin: '6px 0 0 0', fontWeight: 500 }}>✗ {errors.password}</p>}
              <p style={{ color: colors.gray, fontSize: '12px', margin: '6px 0 0 0' }}>Min 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: colors.darkText, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: errors.confirmPassword ? `2px solid ${colors.error}` : `2px solid ${colors.grayLight}`,
                  borderRadius: '8px',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  color: colors.darkText,
                  backgroundColor: colors.white,
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
              />
              {errors.confirmPassword && <p style={{ color: colors.error, fontSize: '13px', margin: '6px 0 0 0', fontWeight: 500 }}>✗ {errors.confirmPassword}</p>}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div style={{ background: '#fee2e2', border: `1px solid ${colors.error}`, borderRadius: '8px', padding: '12px 14px', color: colors.error, fontSize: '13px', fontWeight: 500 }}>
                ⚠️ {errors.submit}
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
              {loading ? '⏳ Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Sign In Link */}
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${colors.grayLight}`, textAlign: 'center', fontSize: '14px', color: colors.gray }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: colors.primary, textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
