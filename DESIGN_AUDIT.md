# TrimTax Design Audit & Improvements

**Date:** June 7, 2026  
**Status:** IN PROGRESS - Phase 1 Complete

---

## Design System Standards

### Typography
- **Headings:** Playfair Display (700 weight), -0.5px to -1px letter-spacing
- **Body:** IBM Plex Sans (400-500), 14-16px size
- **Labels:** IBM Plex Sans (700), 15px, UPPERCASE, 0.3px letter-spacing

### Colors
- **Primary Text:** #111827 (darkText) - MUST use for body/labels
- **Secondary Text:** #6b7280 (gray) - Only for metadata/timestamps
- **Light Text:** #9ca3af - Only for disabled/inactive states
- **⚠️ AVOID:** #666 - too light, fails WCAG contrast

### Spacing & Sizing
- **Input Padding:** 12px vertical, 14px horizontal
- **Input Font Size:** 16px minimum
- **Input Border:** 2px solid (grayLight) with focus → primary
- **Button Padding:** 14px 20px
- **Border Radius:** 8px (consistency)

### Form Elements
- **Labels:** Bold, uppercase, 15px
- **Placeholders:** Gray (#9ca3af)
- **Borders:** 2px solid grayLight on light backgrounds
- **Focus State:** Border changes to primary green
- **Hover State:** Background or border color changes

---

## Page-by-Page Audit

### ✅ Landing Page (/) - COMPLETE
**Status:** Polished & Production Ready
- ✅ Proper text contrast
- ✅ Modern feature cards
- ✅ Correct typography hierarchy
- ✅ Good spacing

### ✅ Register Page (/register) - COMPLETE
**Status:** Polished & Production Ready
- ✅ Clean form styling
- ✅ Proper contrast
- ✅ Good typography
- ✅ Focus/error states

### ✅ Login Page (/login) - COMPLETE
**Status:** Polished & Production Ready
- ✅ Matches register page
- ✅ Proper typography
- ✅ Good spacing

### ✅ Intake Page (/intake) - Step 3 IMPROVED
**Status:** Step 1-2 need review, Step 3 Complete
- ✅ Step 3 (Contact Info): REDESIGNED - proper contrast
- ⚠️ Step 1 (Search): Light text on results dropdown (#666)
- ⚠️ Step 2 (Estimate): Light text in address display (#666)
- ⏳ TODO: Fix Step 1-2 light text issues

### ⏳ Sign Page (/sign/[id]/client.tsx) - NEEDS REVIEW
**Status:** Functional, Design Needs Polish
- ⚠️ Check button styling
- ⚠️ Check form contrast
- ⏳ TODO: Review signature canvas styling

### ⏳ Confirmation Page (/confirmation/[id]) - NEEDS REVIEW
**Status:** Has nice success illustration, content needs review
- ⚠️ Check text contrast in submission details
- ⚠️ Check "What Happens Next" section
- ⏳ TODO: Review all text colors

### ⏳ Dashboard (/dashboard) - NEEDS REVIEW
**Status:** Has nice card design, needs content review
- ⚠️ Check status badge styling
- ⚠️ Check date/metadata text color
- ⏳ TODO: Verify all text meets contrast standards

### ⏳ Tracker (/tracker/[id]) - NEEDS REVIEW
**Status:** Functional, design needs polish
- ⚠️ Check timeline styling
- ⚠️ Check notes section
- ⏳ TODO: Review form inputs

---

## Common Issues Found

### 1. Light Gray Text (#666)
**Locations:**
- Intake Step 1: Dropdown results (`color: '#666'`)
- Intake Step 2: Address display (`color: '#666'`)
- Estimate savings range (`color: '#666'`)

**Fix:** Replace with colors.darkText (#111827) or colors.gray (#6b7280) where appropriate

### 2. Old Input Styling
**Issue:** Some inputs still have:
- Small padding (10px instead of 12px+14px)
- Small font (14px instead of 16px)
- Thin borders (1px instead of 2px)
- border radius: 4px instead of 8px

**Fix:** Standardize to modern design system

### 3. Button Inconsistency
**Issue:** Different buttons use:
- Different colors (#0066cc vs #059669)
- Different padding/sizing
- No hover states on some

**Fix:** All buttons should use colors.primary with consistent sizing

### 4. Form Label Issues
**Issue:** Not all labels are:
- Uppercase
- Bold (700)
- Properly sized (15px)
- Properly spaced

**Fix:** Standardize all form labels

---

## Improvement Checklist

### Priority 1 (Critical - Accessibility)
- [ ] Fix light text contrast issues across all pages
- [ ] Ensure all form inputs meet WCAG AA standards
- [ ] Test with contrast checker tools

### Priority 2 (High - Consistency)
- [ ] Standardize all form input styling
- [ ] Update button styling across all pages
- [ ] Ensure consistent label formatting

### Priority 3 (Medium - Polish)
- [ ] Review and improve spacing consistency
- [ ] Check all hover/focus states
- [ ] Test typography rendering

### Priority 4 (Low - Refinement)
- [ ] Add micro-interactions where appropriate
- [ ] Test responsive design on all pages
- [ ] Mobile testing

---

## Color Usage Guide

### Text Colors
```typescript
// Primary text (most content)
color: colors.darkText // #111827

// Secondary text (descriptions, metadata)
color: colors.gray // #6b7280

// Disabled/inactive only
color: '#9ca3af'

// NEVER use
color: '#666' // ❌ Too light
color: '#999' // ❌ Too light
```

### Background Colors
```typescript
// Form inputs & cards
backgroundColor: colors.white // #ffffff
border: `2px solid ${colors.grayLight}` // #f3f4f6

// Light backgrounds
backgroundColor: colors.grayLight // #f3f4f6

// Hover states
backgroundColor: colors.primaryDark // #047857
```

### Border Colors
```typescript
// Standard
border: `1px solid ${colors.grayLight}`

// Form inputs & important elements
border: `2px solid ${colors.grayLight}`

// On focus
border: `2px solid ${colors.primary}`
```

---

## Design System Checklist

Use this checklist for each page:

- [ ] All body text is darkText (#111827) or gray (#6b7280)
- [ ] All labels are uppercase, bold, 15px
- [ ] All inputs have 12px+14px padding, 16px font, 2px border
- [ ] All buttons have 14px 20px padding, rounded corners
- [ ] Border radius is consistent (8px minimum)
- [ ] Focus states visible on all interactive elements
- [ ] Proper spacing between sections (16px-32px)
- [ ] Typography hierarchy clear and consistent
- [ ] Color usage follows the palette
- [ ] Meets WCAG AA contrast standards

---

## Testing Tools

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WAVE Accessibility Tool](https://wave.webaim.org/)
- Browser DevTools: Inspect > Accessibility > Check Contrast

---

## Next Steps

1. **Fix Intake Steps 1-2** - Light text in dropdowns and estimate display
2. **Audit Sign Page** - Review all form and button styling
3. **Audit Confirmation Page** - Check text contrast in all sections
4. **Audit Dashboard** - Verify card content contrast
5. **Audit Tracker** - Review timeline and notes styling
6. **Final Pass** - Test all pages for consistency

---

**Priority:** Fix light text issues ASAP for accessibility compliance  
**Timeline:** Complete by end of session  
**Owner:** Design/Frontend team
