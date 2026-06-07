// TrimTax SVG Icons & Illustrations
// Consistent design system with color support

export const svgIcons = {
  // Property illustration (for landing/cards)
  propertyHome: (color = '#059669', opacity = 0.1) => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="opacity: ${opacity}">
      <defs>
        <linearGradient id="homeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.3" />
        </linearGradient>
      </defs>
      <path d="M 100 20 L 180 80 L 180 160 Q 180 170 170 170 L 30 170 Q 20 170 20 160 L 20 80 Z" fill="url(#homeGradient)" stroke="${color}" stroke-width="2"/>
      <path d="M 100 40 L 60 70 L 60 150 L 140 150 L 140 70 Z" fill="none" stroke="${color}" stroke-width="1.5"/>
      <rect x="75" y="85" width="25" height="30" fill="none" stroke="${color}" stroke-width="1.5"/>
      <polygon points="100,20 120,35 120,45 80,45 80,35" fill="${color}"/>
    </svg>
  `,

  // Check/Success icon
  checkmark: (color = '#059669', size = 24) => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 5 13 L 9 17 L 19 7" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // Arrow/Next icon
  arrow: (color = '#059669', direction = 'right') => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 5 12 L 19 12 M 15 8 L 19 12 L 15 16" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // Document/Form icon
  document: (color = '#059669') => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="2" width="16" height="20" rx="2" fill="none" stroke="${color}" stroke-width="1.5"/>
      <line x1="8" y1="7" x2="16" y2="7" stroke="${color}" stroke-width="1"/>
      <line x1="8" y1="12" x2="16" y2="12" stroke="${color}" stroke-width="1"/>
      <line x1="8" y1="17" x2="14" y2="17" stroke="${color}" stroke-width="1"/>
    </svg>
  `,

  // Lock/Security icon
  lock: (color = '#059669') => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="11" width="14" height="9" rx="1" fill="none" stroke="${color}" stroke-width="1.5"/>
      <path d="M 7 11 V 7 Q 7 3 12 3 Q 17 3 17 7 V 11" fill="none" stroke="${color}" stroke-width="1.5"/>
      <circle cx="12" cy="15" r="1.5" fill="${color}"/>
    </svg>
  `,

  // Chart/Analytics icon
  chart: (color = '#059669') => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="14" width="4" height="7" fill="${color}" opacity="0.4"/>
      <rect x="10" y="8" width="4" height="13" fill="${color}" opacity="0.7"/>
      <rect x="17" y="3" width="4" height="18" fill="${color}"/>
    </svg>
  `,

  // Success celebration (confetti style)
  success: (color = '#059669') => `
    <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" fill="none" stroke="${color}" stroke-width="2" opacity="0.2"/>
      <circle cx="60" cy="60" r="45" fill="${color}" opacity="0.05"/>
      <path d="M 35 60 L 50 75 L 85 40" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="25" cy="25" r="3" fill="${color}" opacity="0.6"/>
      <circle cx="95" cy="30" r="3" fill="${color}" opacity="0.6"/>
      <circle cx="100" cy="90" r="3" fill="${color}" opacity="0.6"/>
    </svg>
  `,

  // Signature icon
  pen: (color = '#059669') => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 3 17.25 V 21 H 6.75 L 17 10.75 L 13.25 7 Z" fill="none" stroke="${color}" stroke-width="1.5"/>
      <path d="M 15.25 8.75 L 18.75 5.25" stroke="${color}" stroke-width="1.5"/>
    </svg>
  `,

  // Dashboard icon
  dashboard: (color = '#059669') => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="8" height="8" fill="none" stroke="${color}" stroke-width="1.5" rx="1"/>
      <rect x="13" y="3" width="8" height="8" fill="none" stroke="${color}" stroke-width="1.5" rx="1"/>
      <rect x="3" y="13" width="8" height="8" fill="none" stroke="${color}" stroke-width="1.5" rx="1"/>
      <rect x="13" y="13" width="8" height="8" fill="none" stroke="${color}" stroke-width="1.5" rx="1"/>
    </svg>
  `,

  // Step indicator (completed)
  stepCompleted: (color = '#059669') => `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="${color}"/>
      <path d="M 10 16 L 14 20 L 22 12" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // Step indicator (current)
  stepCurrent: (color = '#059669') => `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="none" stroke="${color}" stroke-width="2"/>
      <circle cx="16" cy="16" r="8" fill="${color}"/>
    </svg>
  `,

  // Step indicator (pending)
  stepPending: (color = '#d1d5db') => `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="none" stroke="${color}" stroke-width="2"/>
    </svg>
  `,
}

// Helper to render SVG as data URL
export function svgToDataUrl(svgString: string): string {
  const encoded = encodeURIComponent(svgString.trim())
  return `data:image/svg+xml,${encoded}`
}

// Color palette for consistent usage
export const colorPalette = {
  primary: '#059669',
  primaryDark: '#047857',
  success: '#059669',
  warning: '#f59e0b',
  error: '#dc2626',
  info: '#0066cc',
  dark: '#0f172a',
  darkText: '#111827',
  gray: '#6b7280',
  grayLight: '#f3f4f6',
  white: '#ffffff',
}

// Opacity values for backgrounds
export const opacityLevels = {
  veryLight: 0.05,
  light: 0.1,
  medium: 0.2,
  dark: 0.3,
}
