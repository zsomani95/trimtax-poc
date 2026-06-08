'use client'

interface TrimTaxLogoProps {
  size?: number
  className?: string
}

export default function TrimTaxLogo({ size = 200, className = '' }: TrimTaxLogoProps) {
  const scale = size / 200

  return (
    <svg
      width={size}
      height={size * 0.45}
      viewBox="0 0 200 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
    >
      <defs>
        {/* Textured gradient for TAX block letters */}
        <linearGradient id="taxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Slash gradient - vibrant red/orange */}
        <linearGradient id="slashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>

        {/* TRIM text gradient */}
        <linearGradient id="trimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        {/* Shadow filter */}
        <filter id="shadow" x="-5%" y="-5%" width="115%" height="120%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#00000030" />
        </filter>

        {/* Texture pattern for block letters */}
        <pattern id="texture" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill="transparent" />
          <circle cx="1" cy="1" r="0.5" fill="#ffffff08" />
          <circle cx="3" cy="3" r="0.5" fill="#00000010" />
        </pattern>
      </defs>

      {/* T - Block letter */}
      <g filter="url(#shadow)">
        <rect x="2" y="4" width="28" height="8" rx="2" fill="url(#taxGrad)" />
        <rect x="2" y="4" width="28" height="8" rx="2" fill="url(#texture)" />
        <rect x="12" y="4" width="8" height="52" rx="2" fill="url(#taxGrad)" />
        <rect x="12" y="4" width="8" height="52" rx="2" fill="url(#texture)" />
      </g>

      {/* A - Block letter */}
      <g filter="url(#shadow)">
        <rect x="34" y="4" width="28" height="8" rx="2" fill="url(#taxGrad)" />
        <rect x="34" y="4" width="28" height="8" rx="2" fill="url(#texture)" />
        <rect x="34" y="4" width="8" height="52" rx="2" fill="url(#taxGrad)" />
        <rect x="34" y="4" width="8" height="52" rx="2" fill="url(#texture)" />
        <rect x="54" y="4" width="8" height="52" rx="2" fill="url(#taxGrad)" />
        <rect x="54" y="4" width="8" height="52" rx="2" fill="url(#texture)" />
        <rect x="34" y="24" width="28" height="8" rx="2" fill="url(#taxGrad)" />
        <rect x="34" y="24" width="28" height="8" rx="2" fill="url(#texture)" />
      </g>

      {/* X - Block letter */}
      <g filter="url(#shadow)">
        <rect x="66" y="4" width="8" height="16" rx="2" fill="url(#taxGrad)" />
        <rect x="66" y="4" width="8" height="16" rx="2" fill="url(#texture)" />
        <rect x="86" y="4" width="8" height="16" rx="2" fill="url(#taxGrad)" />
        <rect x="86" y="4" width="8" height="16" rx="2" fill="url(#texture)" />
        <rect x="74" y="20" width="12" height="8" rx="2" fill="url(#taxGrad)" />
        <rect x="74" y="20" width="12" height="8" rx="2" fill="url(#texture)" />
        <rect x="66" y="28" width="8" height="16" rx="2" fill="url(#taxGrad)" />
        <rect x="66" y="28" width="8" height="16" rx="2" fill="url(#texture)" />
        <rect x="86" y="28" width="8" height="16" rx="2" fill="url(#taxGrad)" />
        <rect x="86" y="28" width="8" height="16" rx="2" fill="url(#texture)" />
        <rect x="66" y="40" width="8" height="16" rx="2" fill="url(#taxGrad)" />
        <rect x="66" y="40" width="8" height="16" rx="2" fill="url(#texture)" />
        <rect x="86" y="40" width="8" height="16" rx="2" fill="url(#taxGrad)" />
        <rect x="86" y="40" width="8" height="16" rx="2" fill="url(#texture)" />
      </g>

      {/* Slash through TAX */}
      <g filter="url(#shadow)">
        <line
          x1="0"
          y1="58"
          x2="100"
          y2="2"
          stroke="url(#slashGrad)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Slash highlight */}
        <line
          x1="0"
          y1="56"
          x2="100"
          y2="0"
          stroke="#ffffff40"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* TRIM text - flowing from the slash */}
      <g filter="url(#shadow)">
        <text
          x="98"
          y="62"
          fontFamily="'Playfair Display', 'Georgia', serif"
          fontSize="36"
          fontWeight="900"
          fill="url(#trimGrad)"
          letterSpacing="1"
        >
          TRIM
        </text>
      </g>

      {/* Small tagline */}
      <text
        x="98"
        y="82"
        fontFamily="'IBM Plex Sans', 'Arial', sans-serif"
        fontSize="10"
        fontWeight="600"
        fill="#64748b"
        letterSpacing="2"
      >
        PROPERTY TAX RELIEF
      </text>
    </svg>
  )
}