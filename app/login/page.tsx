'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'linear-gradient(to bottom right, #1e293b, #0f172a)' }}>
      <div style={{ maxWidth: '400px', width: '100%', background: '#fff', borderRadius: '12px', padding: '40px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Sign In</h1>
        <p style={{ color: '#666', margin: '0 0 30px 0', fontSize: '14px' }}>Track your property tax protest progress</p>

        {registered && (
          <div style={{ background: '#dcfce7', border: '1px solid #6ee7b7', borderRadius: '6px', padding: '12px', color: '#166534', marginBottom: '20px', fontSize: '14px' }}>
            ✓ Account created successfully! Please sign in.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
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
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#1f2937' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #dc2626', borderRadius: '6px', padding: '12px', color: '#991b1b', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              background: loading ? '#ccc' : '#0066cc',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
            }}
          >
            {loading ? '⏳ Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee', textAlign: 'center', fontSize: '14px', color: '#666' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: 'bold' }}>
            Create one
          </Link>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#999' }}>
          Demo: use any email/password (min 8 chars)
        </div>
      </div>
    </div>
  )
}
