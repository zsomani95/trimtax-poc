'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TrimTaxLogo from '@/components/TrimTaxLogo'

interface Property {
  acct: string
  site_addr_1: string
  city: string
  zip: string
  county: string
}

const C = {
  primary: '#1e3a5f',
  primaryDark: '#152e4d',
  primaryLight: '#e8eef6',
  accent: '#2563eb',
  gold: '#d4a853',
  goldLight: '#fef9f0',
  dark: '#0f172a',
  darkAlt: '#1e293b',
  darkText: '#111827',
  white: '#ffffff',
  gray: '#6b7280',
  grayLight: '#f3f4f6',
  grayBorder: '#e5e7eb',
}

const processSteps = [
  { step: '1', title: 'Find Property', desc: 'Enter your address and instantly pull up your property from our database of 1.5M+ records.', icon: '🔍' },
  { step: '2', title: 'Review Estimate', desc: 'Our algorithm analyzes comparable sales and calculates your potential tax savings in seconds.', icon: '📊' },
  { step: '3', title: 'E-Sign & Authorize', desc: 'Review your estimate, provide your contact info, and sign electronically — all online.', icon: '✍️' },
  { step: '4', title: 'We File & Track', desc: 'TrimTax files the protest, attends hearings, and notifies you of the outcome. You save money.', icon: '📁' },
]

const testimonials = [
  {
    quote: 'TrimTax saved me $2,400 on my property taxes. The process was completely hands-off.',
    name: 'Sarah M.',
    role: 'Homeowner, Houston',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  },
  {
    quote: 'I was skeptical at first, but they handled everything. Got my hearing notice and a check in the mail.',
    name: 'James R.',
    role: 'Property Owner, Katy',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
  {
    quote: 'The dashboard makes it so easy to track progress. Highly recommend for any Texas homeowner.',
    name: 'Maria G.',
    role: 'Homeowner, Sugar Land',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  },
]

export default function HomePage() {
  const router = useRouter()
  const [address, setAddress] = useState('')
  const [results, setResults] = useState<Property[]>([])
  const [searching, setSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleInputChange = async (value: string) => {
    setAddress(value)
    if (!value.trim()) { setResults([]); setShowDropdown(false); return }
    setSearching(true)
    try {
      const res = await fetch(`/api/properties/search?q=${encodeURIComponent(value)}`)
      const data = await res.json()
      setResults(data.results || [])
      setShowDropdown(true)
    } catch { setResults([]) }
    finally { setSearching(false) }
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
    <div style={{ minHeight: '100vh', background: C.white, display: 'flex', flexDirection: 'column' }}>
      {/* ===== HEADER ===== */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? '12px 40px' : '20px 40px',
        background: scrolled ? 'rgba(255,255,255,0.97)' : C.white,
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.grayBorder}` : '1px solid transparent',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        transition: 'all 0.3s ease', boxShadow: scrolled ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrimTaxLogo size={160} />
        </Link>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link
            href="/login"
            style={{
              color: C.primary, textDecoration: 'none', fontWeight: 600, fontSize: '14px',
              padding: '10px 20px', borderRadius: '8px', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.primaryLight }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            style={{
              background: C.primary, color: C.white, textDecoration: 'none', fontWeight: 600,
              fontSize: '14px', padding: '10px 24px', borderRadius: '8px', transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(30,58,95,0.25)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.primaryDark; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,58,95,0.35)' }}
            onMouseLeave={e => { e.currentTarget.style.background = C.primary; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(30,58,95,0.25)' }}
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: '160px 40px 100px',
        background: `linear-gradient(170deg, ${C.primaryDark} 0%, ${C.primary} 40%, #1e3a5f 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)', borderRadius: '50%', top: '-100px', right: '-100px' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)', borderRadius: '50%', bottom: '-50px', left: '-50px' }} />

        <div style={{ maxWidth: '720px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)',
            borderRadius: '50px', padding: '6px 18px', marginBottom: '28px',
            color: '#93c5fd', fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60a5fa', boxShadow: '0 0 8px #60a5fa' }} />
            Now serving Harris & Fort Bend Counties
          </div>

          <h1 style={{
            fontFamily: "'Merriweather', serif", fontSize: 'clamp(36px, 5.5vw, 58px)',
            fontWeight: 900, color: C.white, margin: '0 0 20px 0', lineHeight: 1.15,
            letterSpacing: '-1px',
          }}>
            Stop Overpaying Your{' '}
            <span style={{ color: C.gold }}>
              Property Taxes
            </span>
          </h1>
          <p style={{
            fontSize: '18px', color: '#94a3b8', margin: '0 0 48px 0', lineHeight: 1.7,
            fontWeight: 400, maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto',
          }}>
            TrimTax automates your property tax protest from start to finish.
            We analyze comparables, file the paperwork, and attend hearings —
            so you save money without lifting a finger.
          </p>

          {/* Search Box */}
          <div className="search-box" style={{ position: 'relative', marginBottom: '0', zIndex: 50 }} ref={dropdownRef}>
            <div style={{
              background: C.white, borderRadius: '16px', padding: '8px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              display: 'flex', gap: '0', alignItems: 'center', position: 'relative',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '16px', flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text" value={address}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => address.trim() && setShowDropdown(true)}
                placeholder="Enter your property address..."
                autoFocus
                style={{ flex: 1, padding: '16px 12px', border: 'none', fontSize: '16px', color: C.darkText, background: 'transparent', fontWeight: 500, outline: 'none', fontFamily: "'Inter', sans-serif" }}
              />
              <button
                onClick={() => address.trim() && handleSelectProperty(results[0] || { acct: address } as Property)}
                style={{ padding: '14px 28px', background: C.primary, color: C.white, border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s ease', marginRight: '4px', whiteSpace: 'nowrap' }}
                onMouseEnter={e => (e.currentTarget.style.background = C.primaryDark)}
                onMouseLeave={e => (e.currentTarget.style.background = C.primary)}
              >
                Search →
              </button>
            </div>

            {showDropdown && results.length > 0 && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: C.white, border: `1px solid ${C.grayBorder}`, borderRadius: '12px', maxHeight: '320px', overflowY: 'auto', zIndex: 1000, boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
                {results.map((property, idx) => (
                  <div key={property.acct} onClick={() => { handleSelectProperty(property); setShowDropdown(false) }}
                    style={{ padding: '14px 18px', borderBottom: idx < results.length - 1 ? `1px solid ${C.grayLight}` : 'none', cursor: 'pointer', transition: 'all 0.15s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.background = C.primaryLight)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ fontWeight: 600, color: C.darkText, marginBottom: '3px', fontSize: '15px' }}>{property.site_addr_1}</div>
                    <div style={{ fontSize: '13px', color: C.gray }}>{property.city}, TX {property.zip} · {property.county} County</div>
                  </div>
                ))}
              </div>
            )}

            {showDropdown && searching && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: C.white, border: `1px solid ${C.grayBorder}`, borderRadius: '12px', padding: '20px', textAlign: 'center', color: C.gray, fontSize: '14px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', zIndex: 1000 }}>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', marginRight: '8px' }}>⏳</span>
                Searching 1.5M properties...
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginTop: '32px', flexWrap: 'wrap' }}>
            {['1.5M+ Properties', '2 Counties', 'No Upfront Cost'].map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px', fontWeight: 500 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section style={{ padding: '100px 40px', background: C.white }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ color: C.primary, fontWeight: 700, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
              How It Works
            </p>
            <h2 style={{
              fontFamily: "'Merriweather', serif", fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 900, color: C.primary, margin: '0 0 16px 0', letterSpacing: '-0.5px',
            }}>
              Four simple steps to lower your tax bill
            </h2>
            <p style={{ color: C.gray, fontSize: '16px', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
              Our automated system handles the entire protest process — you just enter your address.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
            {processSteps.map((item, i) => (
              <div key={i} style={{
                padding: '36px 28px', borderRadius: '16px', border: `1px solid ${C.grayBorder}`,
                background: C.white, transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
                textAlign: 'center',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = C.primary }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = C.grayBorder }}
              >
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%', background: C.primaryLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', fontSize: '28px',
                }}>
                  {item.icon}
                </div>
                <div style={{
                  display: 'inline-block', background: C.primary, color: C.white,
                  width: '28px', height: '28px', borderRadius: '50%', fontSize: '13px',
                  fontWeight: 700, lineHeight: '28px', marginBottom: '12px',
                }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.primary, margin: '0 0 8px 0' }}>{item.title}</h3>
                <p style={{ color: C.gray, fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section style={{ padding: '100px 40px', background: C.primaryLight }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ color: C.accent, fontWeight: 700, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
              Why TrimTax
            </p>
            <h2 style={{
              fontFamily: "'Merriweather', serif", fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 900, color: C.primary, margin: '0 0 16px 0', letterSpacing: '-0.5px',
            }}>
              Everything you need to fight your tax assessment
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {[
              { title: 'Real Property Data', desc: '1.5M verified properties across Harris & Fort Bend counties', icon: '🏠' },
              { title: 'Smart Analysis', desc: 'AI-powered comp algorithm with Winsorized confidence scoring', icon: '📈' },
              { title: 'E-Sign & File', desc: 'Legally binding e-signatures. Forms 50-132 & 50-162 auto-generated', icon: '📝' },
              { title: 'No Win, No Fee', desc: '25% contingency — you pay only when your taxes are reduced', icon: '💰' },
            ].map((f, i) => (
              <div key={i} style={{
                padding: '36px 28px', borderRadius: '16px', background: C.white,
                border: `1px solid ${C.grayBorder}`, transition: 'all 0.3s ease', textAlign: 'center',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: C.primary, margin: '0 0 8px 0' }}>{f.title}</h3>
                <p style={{ color: C.gray, fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF / TESTIMONIALS ===== */}
      <section style={{
        padding: '100px 40px', background: C.primary, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ color: C.gold, fontWeight: 700, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
              Testimonials
            </p>
            <h2 style={{
              fontFamily: "'Merriweather', serif", fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 900, color: C.white, margin: '0 0 16px 0', letterSpacing: '-0.5px',
            }}>
              Trusted by Texas homeowners
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                padding: '32px', borderRadius: '16px', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
              }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill={C.gold} stroke={C.gold} strokeWidth="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: 1.7, margin: '0 0 20px 0', fontStyle: 'italic' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={t.image} alt={t.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)' }} />
                  <div>
                    <p style={{ color: C.white, fontWeight: 600, fontSize: '14px', margin: 0 }}>{t.name}</p>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: '2px 0 0 0' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section style={{
        padding: '100px 40px', background: `linear-gradient(135deg, ${C.accent} 0%, ${C.primary} 100%)`,
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'url(https://images.unsplash.com/photo-1559762717-99c81ac85459?w=1920&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontFamily: "'Merriweather', serif", fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 900, color: C.white, margin: '0 0 16px 0', letterSpacing: '-0.5px',
          }}>
            Ready to lower your property taxes?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '17px', lineHeight: 1.7, margin: '0 0 36px 0' }}>
            Enter your address above to get started. It takes less than 5 minutes, and you pay nothing unless we reduce your tax bill.
          </p>
          <Link href="/intake" style={{
            display: 'inline-block', background: C.white, color: C.primary, textDecoration: 'none',
            fontWeight: 700, fontSize: '16px', padding: '16px 40px', borderRadius: '12px',
            transition: 'all 0.2s ease', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)' }}
          >
            Start Your Protest →
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{
        padding: '48px 40px 32px', background: C.dark, color: '#94a3b8',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          <div>
            <TrimTaxLogo size={140} />
            <p style={{ fontSize: '13px', lineHeight: 1.6, marginTop: '12px', color: '#64748b' }}>
              Automated property tax protests for Texas homeowners.
            </p>
          </div>
          <div>
            <h4 style={{ color: C.white, fontWeight: 700, fontSize: '14px', margin: '0 0 16px 0', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Services</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <Link href="/intake" style={{ color: '#94a3b8', textDecoration: 'none' }}>File a Protest</Link>
              <Link href="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>Track Status</Link>
              <Link href="/register" style={{ color: '#94a3b8', textDecoration: 'none' }}>Create Account</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: C.white, fontWeight: 700, fontSize: '14px', margin: '0 0 16px 0', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Coverage</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <span style={{ color: '#94a3b8' }}>Harris County</span>
              <span style={{ color: '#94a3b8' }}>Fort Bend County</span>
              <span style={{ color: '#64748b', fontSize: '12px' }}>More counties coming soon</span>
            </div>
          </div>
          <div>
            <h4 style={{ color: C.white, fontWeight: 700, fontSize: '14px', margin: '0 0 16px 0', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <span style={{ color: '#94a3b8' }}>Privacy Policy</span>
              <span style={{ color: '#94a3b8' }}>Terms of Service</span>
              <span style={{ color: '#64748b', fontSize: '12px' }}>Not a licensed appraisal service</span>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1100px', margin: '40px auto 0', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
          <p style={{ margin: 0 }}>© 2026 TrimTax. All rights reserved. TrimTax is a document preparation service, not a licensed appraisal or legal service.</p>
        </div>
      </footer>
    </div>
  )
}