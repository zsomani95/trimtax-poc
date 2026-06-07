'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { validateRegistration } from '@/lib/validation'

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'linear-gradient(to bottom right, #1e293b, #0f172a)' }}>
      <div style={{ maxWidth: '400px', width: '100%', background: '#fff', borderRadius: '12px', padding: '40px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Create Account</h1>
        <p style={{ color: '#666', margin: '0 0 30px 0', fontSize: '14px' }}>Join TrimTax to track your property tax protest</p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#1f2937' }}>
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              style={{
                width: '100%',
                padding: '10px',
                border: errors.fullName ? '2px solid #dc2626' : '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
            {errors.fullName && <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0 0' }}>{errors.fullName}</p>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#1f2937' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '10px',
                border: errors.email ? '2px solid #dc2626' : '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
            {errors.email && <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0 0' }}>{errors.email}</p>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#1f2937' }}>
              Password (min 8 characters)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px',
                border: errors.password ? '2px solid #dc2626' : '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
            {errors.password && <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0 0' }}>{errors.password}</p>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#1f2937' }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px',
                border: errors.confirmPassword ? '2px solid #dc2626' : '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
            {errors.confirmPassword && <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0 0' }}>{errors.confirmPassword}</p>}
          </div>

          {errors.submit && (
            <div style={{ background: '#fee2e2', border: '1px solid #dc2626', borderRadius: '6px', padding: '12px', color: '#991b1b', fontSize: '14px' }}>
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              background: loading ? '#ccc' : '#047857',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
            }}
          >
            {loading ? '⏳ Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee', textAlign: 'center', fontSize: '14px', color: '#666' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: 'bold' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
