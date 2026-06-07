// TrimTax Design System
// Modern, Authoritative, Approachable

export const colors = {
  // Primary
  primary: '#059669',      // Distinctive green (action/success)
  primaryLight: '#d1fae5',
  primaryDark: '#047857',

  // Authority
  dark: '#0f172a',         // Deep navy
  darkAlt: '#1e293b',
  darkText: '#111827',

  // Accents
  accent: '#7c3aed',       // Purple for secondary actions
  warning: '#f59e0b',      // Amber for caution
  error: '#dc2626',        // Red for errors

  // Neutrals
  white: '#ffffff',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }
}

export const typography = {
  // Display: Playfair Display for distinctive headings
  display: {
    fontFamily: "'Playfair Display', serif",
    weight: 700,
    lineHeight: 1.2,
  },
  // Body: IBM Plex Sans for refined, readable body text
  body: {
    fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    weight: 400,
    lineHeight: 1.6,
  },
  // Mono: IBM Plex Mono for code/technical
  mono: {
    fontFamily: "'IBM Plex Mono', monospace",
    weight: 400,
    lineHeight: 1.5,
  }
}

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
}

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
}

export const animations = {
  fadeIn: 'fadeIn 0.3s ease-in-out',
  slideUp: 'slideUp 0.4s ease-out',
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
}
