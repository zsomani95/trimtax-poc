# Design System Renovation Guide

## Completed Pages ✅

1. **Landing Page** (`/app/page.tsx`) - COMPLETE
2. **Register Page** (`/app/register/page.tsx`) - COMPLETE
3. **Login Page** (`/app/login/page.tsx`) - COMPLETE

## Remaining Pages to Renovate

Follow this guide to complete the remaining 6 pages using the established design system.

---

## Design System Summary

### Colors
```typescript
primary: '#059669'          // Green for actions
primaryDark: '#047857'      // Darker green for hover
dark: '#0f172a'             // Deep navy
darkAlt: '#1e293b'          // Alt navy
darkText: '#111827'         // Text color
white: '#ffffff'
gray: '#6b7280'             // Medium gray
grayLight: '#f3f4f6'        // Light gray background
error: '#dc2626'            // Red for errors
```

### Typography
```
Display: 'Playfair Display', serif (700 weight) - For headings
Body: 'IBM Plex Sans', sans-serif (400-600 weight) - For text
Mono: 'IBM Plex Mono', monospace - For code/technical
```

### Spacing
- xs: 4px
- sm: 8px  
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

### Shadows
```
sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

### Animations
- **fadeIn**: 0.3s ease-in-out
- **slideUp**: 0.4s ease-out
- **hover transitions**: 0.3s ease

---

## Remaining Pages

### 4. Intake Form (`/app/intake/page.tsx`) - NEXT PRIORITY

**Current State:** 584 lines, functional 4-step form
**Style Updates Needed:**
- Update header to match landing/auth pages (Playfair Display, refined)
- Apply color scheme to buttons and form fields
- Use proper spacing (lg/xl gaps instead of current 10/12px)
- Add animations to step transitions
- Style the search dropdown with new colors
- Apply form field styling consistently
- Update error/success message styling
- Use new button hover states (primaryDark)

**Key Components:**
- Step 1: Address search with autocomplete
- Step 2: Estimate review
- Step 3: Contact info
- Step 4: Final review & submission

**Apply Pattern:**
```typescript
const colors = {
  primary: '#059669',
  primaryDark: '#047857',
  // ... rest of colors
}

// In styles:
border: `2px solid ${colors.grayLight}`  // Use 2px borders
background: colors.white
padding: '12px 14px'  // Consistent input padding
borderRadius: '8px'   // Consistent radius
```

---

### 5. E-Signature Page (`/app/sign/[id]/client.tsx`)

**Current State:** Signature canvas + PDF generation
**Style Updates:**
- Update layout to white background with proper shadows
- Apply color scheme to buttons
- Style the review table with new spacing
- Use new typography system
- Add smooth animations to signature capture

---

### 6. Analysis Page (`/app/analysis/[id]/page.tsx`)

**Current State:** Valuation breakdown display
**Style Updates:**
- Update hero section (green for positive savings, gray for neutral)
- Improve typography hierarchy
- Apply consistent spacing
- Better visual breakdown of CAD vs Argued values
- Updated button styling

---

### 7. Confirmation Page (`/app/confirmation/[id]/page.tsx`)

**Current State:** Submission confirmation
**Style Updates:**
- Modern success state design
- Use primary color for positive messaging
- Apply proper spacing and typography
- Clear next steps section

---

### 8. Dashboard (`/app/dashboard/page.tsx`)

**Current State:** User's submission list
**Style Updates:**
- Header matching other pages
- Card-based layout for submissions
- Apply hover states to cards
- Use color scheme for status badges
- Proper spacing in grid layout

---

### 9. Tracker Page (`/app/tracker/[id]/page.tsx`)

**Current State:** Status timeline + notes
**Style Updates:**
- Timeline styling with primary color
- Card-based notes section
- Proper spacing throughout
- Use new input styling for note entry
- Apply consistent button styling

---

## Implementation Steps

For each remaining page:

1. **Add Font Import:**
```typescript
<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;600&display=swap');
  * { font-family: 'IBM Plex Sans', sans-serif; }
  h1, h2, h3 { font-family: 'Playfair Display', serif; }
`}</style>
```

2. **Define Colors at Top:**
```typescript
const colors = {
  primary: '#059669',
  primaryDark: '#047857',
  // ... all colors
}
```

3. **Apply to Components:**
- Use `colors.primary` for buttons
- Use `colors.grayLight` for borders
- Use `colors.darkText` for text
- Use `colors.white` for backgrounds

4. **Update Spacing:**
- Replace `10px` gaps with `16px` (md)
- Replace `20px` padding with `24px` (lg)
- Use consistent `8px` gaps for form fields

5. **Styling Patterns:**
- Buttons: `padding: '12px 20px'`, `fontSize: '15px'`, `fontWeight: 600`
- Inputs: `border: '2px solid'`, `padding: '12px 14px'`
- Cards: `borderRadius: '12px'`, `boxShadow: lg`, `padding: '24px'`
- Text: `letterSpacing: '-0.5px'` for headings, `fontWeight: 500` for labels

---

## Testing

After each page renovation:
1. Check responsive layout
2. Test hover states on interactive elements
3. Verify animations load smoothly
4. Ensure color contrast meets accessibility standards
5. Test on mobile (320px+)

---

## Summary

All pages follow the same design language:
- **Modern**: Playfair Display headings, IBM Plex Sans body
- **Authoritative**: Deep navy with strategic green accents
- **Approachable**: Generous whitespace, smooth animations
- **Cohesive**: Consistent spacing, shadows, colors throughout

The design system is intentional and distinctive - avoiding generic AI aesthetics with thoughtful typography, strategic color use, and refined details.
