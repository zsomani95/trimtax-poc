# Implementation Checklist — Phase 4 (Critical Items)

## ✅ Completed This Session

### UI & UX
- ✅ Landing page with address search (`/page.tsx`)
- ✅ Login button in corner (all pages)
- ✅ Input validation library (`lib/validation.ts`)
- ✅ Field-level error display in registration
- ✅ Auth middleware (`lib/auth-middleware.ts`)

### Database Schema
- ✅ `users` table added to schema
- ✅ `tracking_notes` table added
- ✅ `submissions` enhanced with user tracking fields
- ✅ All submissions ready for `user_id` linking

### Email Service
- ✅ Email service created (`lib/email.ts`)
- ✅ Templates for confirmation, status updates, hearing notices
- ✅ Auto-sends confirmation email on submission
- ✅ Mock mode for PoC (logs to console)

---

## 🔴 Critical Tasks (MUST FIX BEFORE NEXT PHASE)

### 1. Wire Real CAD Data Files
**Status:** DATA EXISTS, NEED TO WIRE UP

You have real property files downloaded. The data is already in Neon, but the import scripts are in `/scripts/`:

```bash
# Harris County (already done)
node scripts/filter-hcad.js          # Filters 867MB real_acct.txt → CSV
node scripts/import-to-neon.js        # Imports to Neon

# Fort Bend County (already done)
node scripts/filter-fbcad.js          # Filters Property/Owner files → CSV
node scripts/import-fbcad-to-neon.js  # Imports to Neon
```

**For updating with new data:**
1. Place HCAD file at: `downloads/Real_acct.txt` (or update path in filter-hcad.js line 3)
2. Place FBCAD files at: specific paths in filter-fbcad.js (lines 3-4)
3. Run filter scripts
4. Run import scripts
5. Verify: `SELECT county, COUNT(*) FROM properties GROUP BY county;`

**Current state:** 1,516,324 properties live in Neon ✓

---

### 2. Link Submissions to User Accounts
**Effort:** 30 min | **Impact:** HIGH

**What to do:**

A. Update `/app/api/submissions/route.ts`:
```typescript
// Add user_id when creating submission
const auth = request.headers.get('authorization')
const user = extractUserFromToken(auth) // Use auth-middleware
const [submission] = await db.insert(submissions).values({
  ...otherFields,
  userId: getUserIdFromEmail(user.email), // TODO: get real user.id from DB
})
```

B. Update `/app/intake/page.tsx`:
```typescript
// Send auth token with submission request
const token = localStorage.getItem('authToken')
const res = await fetch('/api/submissions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, // NEW
  },
  body: JSON.stringify({...})
})
```

C. Update `/app/api/user/submissions/route.ts`:
```typescript
// Filter by user_id, not mock data
const user = requireAuth(request)
const [submissions] = await db
  .select()
  .from(submissions)
  .where(eq(submissions.userId, user.id))
```

---

### 3. Protect Tracker Routes (Prevent Cross-User Access)
**Effort:** 20 min | **Impact:** HIGH

Update `/app/api/tracker/[id]/route.ts`:
```typescript
const user = requireAuth(request)
const { id } = await params

// Verify this submission belongs to the user
const [submission] = await db
  .select()
  .from(submissions)
  .where(
    and(
      eq(submissions.id, parseInt(id)),
      eq(submissions.userId, user.id)  // NEW: prevent cross-user access
    )
  )

if (!submission) {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
```

---

### 4. Real Database Queries (Currently Mock)
**Effort:** 1.5 hours | **Impact:** CRITICAL

**Current state:** All account/tracker APIs return mock data
**Needed:** Real database queries

#### 4a. `/api/auth/register` 
- Check if email exists in `users` table
- Hash password (currently plain text)
- Insert new user
- Return user.id

#### 4b. `/api/auth/login`
- Query `users` by email
- Compare password hash
- Return JWT token

#### 4c. `/api/user/submissions`
- Extract user from token
- Query all submissions WHERE user_id = user.id
- Include related tracking_notes

#### 4d. `/api/tracker/[id]`
- Verify user owns this submission
- Return submission + notes (already implemented, just needs DB wiring)

---

### 5. Password Hashing (Security)
**Effort:** 30 min | **Impact:** HIGH

Currently passwords stored in plaintext. Need bcrypt:

```bash
npm install bcrypt @types/bcrypt
```

In `/api/auth/register`:
```typescript
import bcrypt from 'bcrypt'

const hashedPassword = await bcrypt.hash(password, 12)
await db.insert(users).values({
  ...data,
  passwordHash: hashedPassword,
})
```

In `/api/auth/login`:
```typescript
const isValid = await bcrypt.compare(password, user.passwordHash)
if (!isValid) return NextResponse.json({ error: 'Invalid credentials' })
```

---

### 6. Real JWT Tokens
**Effort:** 30 min | **Impact:** HIGH

Currently tokens are just base64(email). Should be proper JWT:

```bash
npm install jsonwebtoken
```

In `/api/auth/login`:
```typescript
import jwt from 'jsonwebtoken'

const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
)
```

Update `/lib/auth-middleware.ts`:
```typescript
import jwt from 'jsonwebtoken'

const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)
return { userId: decoded.userId, email: decoded.email }
```

---

## 🟡 Important Items (Can Do in Phase 4b)

### Account Creation Prompts in Flow
- After e-signature: "Save progress - Create Account"
- After confirmation: "Track updates - Sign In / Create Account"
- Pre-fill email from intake form

### Real Email Service
- Connect SendGrid / SES / Resend
- Test sending actual emails
- HTML templates for each notification type

### Input Validation Across All Forms
- Intake page Step 2 (contact info)
- Login page
- Tracker notes (optional)
- Add error messages like registration page

---

## 📝 Notes on CAD Data Files

### File Paths
**Harris County:**
- Downloaded to: `C:\Users\adver\Downloads\Real_acct_owner\`
- Main file: `real_acct.txt` (867 MB, tab-delimited)
- Script reference: `scripts/filter-hcad.js` (line 3)

**Fort Bend County:**
- Downloaded from: https://www.fbcad.org/data-files/
- Files: Property + Owner exports (comma-delimited)
- Script reference: `scripts/filter-fbcad.js` (lines 3-4)

### Update Process
If you download fresh CAD data:
1. Update file paths in filter scripts
2. Run filter scripts (generates CSV)
3. Run import scripts (uploads to Neon)
4. Verify row counts match expected

### Database Verification
```sql
SELECT county, COUNT(*) FROM properties GROUP BY county;
-- Should show:
-- Harris:    1,111,467
-- Fort Bend:   404,857
-- Total:     1,516,324
```

---

## Testing Checklist

- [ ] Register with valid email/password
- [ ] Register with invalid inputs (field errors show)
- [ ] Login with correct credentials
- [ ] Login with wrong password (fails gracefully)
- [ ] Create submission while logged out
- [ ] Submission appears in dashboard
- [ ] Click submission → shows tracker (not someone else's)
- [ ] Try to access another user's submission (403 Forbidden)
- [ ] Add note to tracker
- [ ] Logout and login again → submissions still there

---

## Environment Variables Needed

```bash
# .env.local (already set)
DATABASE_URL=postgresql://...

# TODO: Add these
JWT_SECRET=your-secret-key-here-min-32-chars
SENDGRID_API_KEY=sg_... (optional, for real email)
```

---

## File Manifest (New Files This Session)

| File | Purpose |
|------|---------|
| `/app/page.tsx` | Landing page with address search |
| `/lib/validation.ts` | Input validation utilities |
| `/lib/auth-middleware.ts` | Token extraction & auth checking |
| `/lib/email.ts` | Email service (mock + templates) |
| `/ACCOUNT_TRACKER_GUIDE.md` | Account system documentation |
| `/IMPLEMENTATION_CHECKLIST.md` | This file |

---

## Priority Order for Phase 4

1. **Wire real database queries (1.5 hrs)** — submissions linked to users
2. **Link submissions to user_id (30 min)** — on creation & retrieval
3. **Protect tracker routes (20 min)** — prevent cross-user access
4. **Add password hashing (30 min)** — bcrypt
5. **Implement real JWT (30 min)** — jsonwebtoken
6. **Add account creation prompts (1 hr)** — in flow
7. **Real email service (1 hr)** — SendGrid or equivalent

**Estimated time:** 4.5 hours for fully functional, production-ready auth system.

---

**Status:** ✅ Structure complete. Ready to wire up real database queries.
