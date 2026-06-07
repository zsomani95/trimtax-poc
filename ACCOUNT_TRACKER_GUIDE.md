# Account & Tracker System — Implementation Guide

## Overview

TrimTax now includes a complete user account and submission tracking system, enabling homeowners to:
- Create accounts and log in securely
- Track all their property tax protests in one dashboard
- View detailed status timelines for each property
- Add notes and receive updates
- Get email notifications

## What's Implemented (PoC)

### ✅ User Authentication
- Registration page (`/register`) with form validation
- Login page (`/login`) with success confirmation
- Basic JWT-like token system (mock implementation)
- Session storage in localStorage

### ✅ User Dashboard
- All user submissions displayed in grid view
- Summary stats (total properties, potential savings, resolved count)
- Quick status indicators (pending, signed, submitted, hearing, resolved)
- Click through to individual property tracker

### ✅ Submission Tracker
- 5-stage status timeline (Created → Signed → Submitted → Hearing → Resolved)
- Visual progress indicators for current status
- Estimated vs. actual savings display
- Notes section for updates and user comments
- Add notes directly from the tracker

### ✅ Email Service
- Mock email service (logs to console in PoC)
- Templates for:
  - Submission confirmation
  - Status updates
  - Hearing notices
- Automatically sends confirmation email on submission

### ✅ Database Schema
```sql
-- Users table
users (id, email, password_hash, full_name, created_at, updated_at)

-- Enhanced submissions table with tracker fields
submissions (
  id, user_id, owner_name, owner_email, owner_phone,
  property_address, county, cad_account_number,
  cad_value, argued_value, projected_savings,
  status, signature_image, signed_at, submitted_at,
  hearing_scheduled_at, hearing_date, resulted_at, resulted_savings
)

-- Tracking notes for timeline updates
tracking_notes (id, submission_id, note, note_type, created_at, created_by)
```

## User Flow

```
1. NEW USER
   Register (/register)
      ↓
   Login (/login)
      ↓
   Dashboard (/dashboard)
      ↓
   Submit Property (/intake)
      ↓
   Tracker (/tracker/[id])

2. RETURNING USER
   Login (/login)
      ↓
   Dashboard (/dashboard) — see all properties
      ↓
   Click property → Tracker (/tracker/[id])
      ↓
   View status, add notes, receive email updates
```

## API Endpoints (Implemented)

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/auth/register` | POST | Create account | ✅ Mock |
| `/api/auth/login` | POST | Sign in, get token | ✅ Mock |
| `/api/user/submissions` | GET | List user's properties | ✅ Mock |
| `/api/tracker/[id]` | GET | Single property + notes | ✅ Mock |
| `/api/tracker/[id]/notes` | POST | Add note to property | ✅ Mock |
| `/api/submissions` | POST | Create submission + email | ✅ Real |

## What Needs Implementation for Production

### 1. Database Integration (HIGH PRIORITY)
```typescript
// TODO: Wire up real database calls
// Currently: Mock data returned from API
// Needed: Actual queries to users, submissions, tracking_notes tables

// Example for register:
- Check if email exists in users table
- Hash password with bcrypt
- Insert new user
- Return user.id

// Example for dashboard:
- Get user from token
- Query all submissions WHERE user_id = user.id
- Return with recent notes
```

### 2. Authentication (HIGH PRIORITY)
```typescript
// TODO: Implement real authentication
// Current: Mock token (base64 encoded email)
// Needed: 
- Real JWT tokens with secret key
- Password hashing (bcrypt)
- Token refresh mechanism
- Middleware to protect routes
- Secure HttpOnly cookies (not localStorage)

// Current PoC uses localStorage (insecure for production)
// Production should use:
localStorage.removeItem('authToken')
// Replace with: secure HttpOnly cookie via Set-Cookie header
```

### 3. Email Service (MEDIUM PRIORITY)
```typescript
// TODO: Connect to real email provider
// Current: Logs to console (MOCK_MODE = true)
// Options:
- SendGrid (recommended)
- AWS SES
- Mailgun
- Resend

// Example SendGrid implementation:
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: email,
  from: 'noreply@trimtax.com',
  subject: 'Your TrimTax Submission Confirmed',
  html: emailHtml,
});
```

### 4. Status Updates from CAD (MEDIUM PRIORITY)
```typescript
// TODO: Integrate with CAD APIs to pull actual status
// Current: Hardcoded mock statuses
// Needed:
- Harris CAD API integration
- Fort Bend CAD API integration
- Polling service (cron job or webhook)
- Auto-generate system notes when status changes

// Example flow:
// 1. Daily cron job queries CAD for hearing dates
// 2. If hearing_date changes, update submissions table
// 3. Generate tracking note: "Hearing scheduled for [date]"
// 4. Send email: sendHearingNotice()
```

### 5. User Permissions (LOW PRIORITY)
```typescript
// TODO: Ensure users can only see their own submissions
// Current: Mock data shows same submissions for all users
// Needed:
- Extract user_id from JWT token
- Add WHERE user_id = extracted_id to all queries
- Middleware to validate ownership before returning data

// Example:
const userId = extractUserIdFromToken(token);
const [submission] = await db
  .select()
  .from(submissions)
  .where(eq(submissions.id, submissionId) && eq(submissions.userId, userId));
```

## Testing Checklist

- [ ] User can register with email + password
- [ ] User can login and get token
- [ ] User can view dashboard with their submissions
- [ ] User can click to see individual property tracker
- [ ] User can add notes to a tracker
- [ ] Email confirmation sent on new submission (check console logs)
- [ ] Status timeline shows correct icons and dates
- [ ] Users cannot see other users' submissions
- [ ] Tokens expire after 24 hours
- [ ] Logout clears auth token

## Demo Credentials

For PoC testing:
- Email: `any@email.com`
- Password: `password123` (min 8 chars)

Since DEMO_MODE = true, registration/login accept any valid input.

## Security Notes for Production

1. **Never use localStorage for auth tokens** — use HttpOnly cookies
2. **Hash passwords with bcrypt** — minimum 12 rounds
3. **Validate all inputs** — SQL injection, XSS protection
4. **Rate limit auth endpoints** — prevent brute force
5. **Use HTTPS only** — never transmit tokens over HTTP
6. **Implement CSRF protection** — token in form submissions
7. **Set secure cookie flags** — HttpOnly, Secure, SameSite
8. **Validate JWT signatures** — verify token hasn't been tampered with
9. **Implement password reset** — secure token-based reset flow
10. **Audit logging** — log all account actions for compliance

## File Manifest

| File | Purpose |
|------|---------|
| `/app/register/page.tsx` | Registration UI |
| `/app/login/page.tsx` | Login UI |
| `/app/dashboard/page.tsx` | Dashboard (all user submissions) |
| `/app/tracker/[id]/page.tsx` | Individual property tracker |
| `/app/api/auth/register/route.ts` | Register API |
| `/app/api/auth/login/route.ts` | Login API |
| `/app/api/user/submissions/route.ts` | Get all user submissions |
| `/app/api/tracker/[id]/route.ts` | Get single submission + notes |
| `/app/api/tracker/[id]/notes/route.ts` | Add note to submission |
| `/lib/email.ts` | Email service (mock + templates) |
| `/lib/db/schema.ts` | Database schema (users, submissions, tracking_notes) |

## Next Steps

1. **Phase 4a** — Wire up database integration (real queries)
2. **Phase 4b** — Implement real authentication (JWT + bcrypt)
3. **Phase 4c** — Connect email service (SendGrid or equivalent)
4. **Phase 4d** — Add CAD API integration for status polling
5. **Phase 5** — Deploy to production with security hardening

---

**Current Status:** PoC complete with mock data. All UI and flows working. Ready for database + auth integration.
