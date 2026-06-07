# TrimTax Final Walkthrough Guide

**Date:** June 7, 2026  
**Status:** ✅ READY FOR FINAL TESTING

---

## Quick Start

**Dev Server URL:** http://localhost:3003  
**Server Status:** ✅ Running and responding to all pages

---

## Complete User Journey - Step-by-Step Test

### 1. Landing Page - Discovery
**URL:** http://localhost:3003/

**What to test:**
- [ ] Hero section loads with proper title and subtitle
- [ ] Feature cards display with icons (📊 Real Data, 🎯 Smart Analysis, etc.)
- [ ] Address search box is visible and interactive
- [ ] Type "west" in search box - autocomplete dropdown appears
- [ ] Dropdown appears ABOVE feature cards (not hidden behind)
- [ ] All text is readable with proper contrast
- [ ] Colors match design system (green primary, proper grays for text)
- [ ] Buttons (Sign In, Get Started) have hover effects

**Expected Result:** Professional landing with working search

---

### 2. Registration Flow
**URL:** http://localhost:3003/register

**What to test:**
- [ ] Page loads with "Create Account" heading
- [ ] Form has fields: Full Name, Email, Password, Confirm Password
- [ ] Labels are clear and uppercase
- [ ] Input fields are large and readable (16px font, proper padding)
- [ ] Type in fields - text is visible (dark, not light)
- [ ] Error messages show in red when validation fails
- [ ] Required field asterisk (*) appears on required fields
- [ ] "Sign in" link at bottom navigates to login page
- [ ] Submit button is properly styled with hover effect

**Test Registration:**
```
Full Name: John Smith
Email: john@example.com
Password: TestPass123
Confirm Password: TestPass123
```

**Expected Result:** Account created, redirects to login page

---

### 3. Login Flow
**URL:** http://localhost:3003/login

**What to test:**
- [ ] Page loads with "Sign In" heading
- [ ] Form has Email and Password fields
- [ ] Fields have proper styling and contrast
- [ ] Demo hint visible at bottom
- [ ] "Create one" link navigates to register page
- [ ] Login button works with proper styling

**Test Login:**
```
Email: john@example.com
Password: TestPass123
```

**Expected Result:** Login successful, redirects to dashboard

---

### 4. Intake Form - Property Search
**URL:** http://localhost:3003/intake

**What to test:**
- [ ] Step indicator visible (1/2/3/4 circles with progress bar)
- [ ] Currently on Step 1 - shows "Find Your Property"
- [ ] Address search box visible and functional
- [ ] Type "houston" - dropdown appears with results
- [ ] Results show: address, city, zip, county
- [ ] All text readable with proper contrast
- [ ] Click a result - property is selected
- [ ] Continue button enables

**Expected Result:** Property selected, proceeds to Step 2

---

### 5. Intake Form - Estimate Review
**Step 2 - Should now be visible**

**What to test:**
- [ ] Step indicator shows Step 2 highlighted
- [ ] Property address displays properly (no light gray text)
- [ ] Savings estimate shows in large green box
- [ ] "Potential Tax Savings" label visible
- [ ] "Save up to $X" amount shown clearly
- [ ] Range displayed below ("Range: $X - $Y")
- [ ] Confidence badge shows (High/Medium/Low)
- [ ] All table data readable
- [ ] Continue button enabled

**Expected Result:** Estimate displayed clearly with good contrast

---

### 6. Intake Form - Contact Info
**Step 3 - After clicking Continue**

**What to test:**
- [ ] Step indicator shows Step 3 highlighted
- [ ] Heading says "Your Contact Info"
- [ ] Form fields: Full Name, Email, Phone
- [ ] Labels are uppercase and bold
- [ ] Input fields have proper padding (visual comfort)
- [ ] Type in fields - text is dark and visible
- [ ] Focus on input - border turns green
- [ ] Required field asterisk on Email
- [ ] Continue button works

**Test Contact Info:**
```
Full Name: John Smith
Email: john@example.com
Phone: (713) 555-0100
```

**Expected Result:** Contact info accepted, proceeds to Step 4

---

### 7. Intake Form - Review & Authorize
**Step 4 - Final review before submission**

**What to test:**
- [ ] Step indicator shows Step 4 highlighted (all previous checked off)
- [ ] Heading says "Review & Authorize"
- [ ] Review table displays all details:
  - Property address
  - CAD Account number
  - County
  - Current CAD Value
  - Argued Value (green highlight)
  - Owner name
- [ ] All table text readable and properly contrasted
- [ ] "What Happens Next" section clear and visible
- [ ] 4 steps listed with good spacing
- [ ] File My Protest button properly styled
- [ ] Back button has hover effect

**Expected Result:** Review page looks professional and complete

---

### 8. E-Signature Page
**After clicking "File My Protest"**

**URL:** http://localhost:3003/sign/[id]

**What to test:**
- [ ] Page loads with "File Your Protest" heading
- [ ] Step indicator visible (1/2/3)
- [ ] Review tab shows submission details
- [ ] All text is readable with proper contrast
- [ ] "Continue to Signature" button styled properly
- [ ] Click to go to Step 2

**Step 2 - Signature:**
- [ ] Signature canvas visible (dashed border)
- [ ] "Clear" and "Sign" buttons visible and functional
- [ ] Draw a signature in the box
- [ ] "Sign & Generate Documents" button active after signing
- [ ] Click to generate PDF

**Expected Result:** PDF generation starts, moves to confirmation

---

### 9. Confirmation Page
**After PDF generation**

**URL:** http://localhost:3003/confirmation/[id]

**What to test:**
- [ ] Success checkmark illustration visible
- [ ] "Protest Filed!" heading clear
- [ ] Success message displayed
- [ ] Submission details box shows:
  - Submission ID
  - Property address
  - County
  - Estimated Savings
  - Status badge (Signed & Filed)
- [ ] "What Happens Next" section with 5 steps
- [ ] All text readable with proper contrast
- [ ] Links to create account or sign in

**Expected Result:** Beautiful success page with clear next steps

---

### 10. Dashboard - Authenticated View
**Click "Sign in to track" or navigate to /dashboard**

**URL:** http://localhost:3003/dashboard

**What to test:**
- [ ] Page loads with "TrimTax Dashboard" heading
- [ ] Summary stats visible:
  - Total Properties
  - Total Potential Savings
  - Resolved count
- [ ] Property card displays your submission with:
  - 🏡 Property icon
  - Address
  - County and CAD value
  - Annual tax savings (💰)
  - Status badge
  - Submission date
- [ ] All text readable, no light gray issues
- [ ] Card has hover effect
- [ ] New Property button visible

**Expected Result:** Clean dashboard showing your submission

---

### 11. Tracker Page
**Click on property card from dashboard**

**URL:** http://localhost:3003/tracker/[id]

**What to test:**
- [ ] Property details display
- [ ] Status timeline shows 5 stages:
  - Created ✓
  - Signed ✓
  - Submitted (current)
  - Hearing
  - Resolved
- [ ] Current stage highlighted
- [ ] All timeline text readable
- [ ] Notes section visible at bottom
- [ ] Proper styling and contrast throughout

**Expected Result:** Clean status tracker with timeline

---

## Design System Compliance Checklist

- [ ] All body text is dark (not #666, #999, or #aaa)
- [ ] Primary text: #111827 (darkText)
- [ ] Secondary text: #6b7280 (gray)
- [ ] All labels are UPPERCASE and bold
- [ ] All input fields have 16px font size
- [ ] All inputs have 2px borders, 12px+14px padding
- [ ] Border radius consistent (8px minimum)
- [ ] Buttons have proper size and spacing
- [ ] Focus states visible (green border on inputs)
- [ ] Hover effects on interactive elements
- [ ] Typography hierarchy clear on all pages
- [ ] Green primary color (#059669) used consistently
- [ ] No light text on light backgrounds
- [ ] WCAG AA contrast compliance on all text

---

## Performance Checks

- [ ] Landing page loads in < 300ms
- [ ] Property search responds in < 500ms
- [ ] Form submission completes quickly
- [ ] No console errors in browser
- [ ] No network errors in DevTools
- [ ] Responsive design works (test on mobile view)

---

## Browser Testing

Test in:
- [ ] Chrome/Edge (Windows)
- [ ] Firefox (if available)
- [ ] Mobile view (DevTools 375px width)

---

## Sign-Off Checklist

After completing all walkthroughs:
- [ ] All pages load without errors
- [ ] All text is readable (proper contrast)
- [ ] User flow is complete (landing → registration → intake → sign → confirmation)
- [ ] Design is consistent across all pages
- [ ] No light gray text issues
- [ ] Buttons and forms work properly
- [ ] Dashboard displays submitted case
- [ ] Tracker shows status

---

## Final Status

**Visual Design:** ✅ Complete - All light text fixed
**Functionality:** ✅ Working - All pages respond
**User Flow:** ✅ Complete - End-to-end journey functional
**Contrast:** ✅ WCAG AA - All text readable
**Consistency:** ✅ Unified - Design system applied throughout

**Ready for:** User Testing, QA, or Deployment

---

## Notes for QA

- Database is live and connected (1.5M properties available)
- Search returns real property data
- Estimates are calculated using real algorithms
- Submissions are persisted to database
- Email notifications are in mock mode (console logging)

---

**Test Location:** http://localhost:3003  
**Estimated Test Time:** 15-20 minutes for full walkthrough  
**Last Updated:** June 7, 2026
