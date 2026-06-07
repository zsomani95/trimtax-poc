# TrimTax Security Guidelines

## Overview

This document outlines security best practices for the TrimTax project. All developers MUST follow these guidelines to prevent credential leaks and protect sensitive data.

---

## 🚨 Critical Rule

**NEVER commit sensitive data to git.**

Examples of sensitive data:
- Database passwords & connection strings
- API keys (Stripe, SendGrid, AWS, etc.)
- JWT secrets
- Private keys
- OAuth tokens
- Environment variables with real values
- Email credentials

---

## Setup (First Time)

### For Windows Users:
```bash
.\setup-security-hooks.bat
```

### For Mac/Linux Users:
```bash
bash setup-security-hooks.sh
```

This installs a **pre-commit hook** that automatically blocks commits containing secrets.

---

## File Structure

### ✅ Safe Files (Committed to Git)
```
.env.example          # Template only - NO real values
.gitignore            # Specifies what NOT to commit
SECURITY.md           # This file
```

### ❌ Secret Files (Never Committed)
```
.env.local            # Local environment variables
.env.production       # Production secrets
.env.staging          # Staging secrets
.env.development      # Development secrets
```

---

## Workflow

### 1. Initial Setup
```bash
# Copy the template
cp .env.example .env.local

# Add your REAL credentials to .env.local
# This file is gitignored - it stays local only
```

### 2. Making Changes
```bash
# Edit .env.local with real values
nano .env.local

# Development uses these values at runtime
npm run dev

# Credentials are loaded from .env.local, not from git
```

### 3. Committing Code
```bash
# Make code changes (safe)
git add app/api/my-endpoint.ts

# Try to commit
git commit -m "Add new API endpoint"

# ✓ Pre-commit hook verifies safety
# ✓ If safe, commit proceeds
# ✗ If risky, commit is blocked with helpful message
```

---

## Pre-Commit Hook Features

The hook automatically prevents commits if:

| Check | Blocks | Example |
|-------|--------|---------|
| `.env` files | Yes | `DATABASE_URL=postgres://...` |
| Neon API keys | Yes | `npg_3rF2zojLEumM...` |
| Stripe keys | Yes | `sk_live_...` or `sk_test_...` |
| AWS secrets | Yes | `AKIA...` or `AWS_SECRET_...` |
| Database passwords | Yes | `password=...` in code |
| API tokens | Yes | `token=...` or `api_key=...` |
| Firebase configs | Yes | `apiKey: "..."` |
| JWT secrets | Yes | `JWT_SECRET=...` |

---

## If the Hook Blocks Your Commit

### ✓ Correct Solution:
```bash
# 1. See what was flagged
git diff --cached

# 2. Remove the sensitive data
git restore --staged file-with-secrets.ts

# 3. Fix the issue (put value in .env.local, not code)
git add fixed-file.ts

# 4. Commit safely
git commit -m "Fix: move secrets to .env.local"
```

### ✗ Wrong Solution (Don't Do This):
```bash
# This bypasses security - only for genuine emergencies
git commit --no-verify
```

**Only use `--no-verify` if you 100% know what you're doing. Preference: fix the issue instead.**

---

## Common Mistakes

### ❌ Don't: Hardcode in Code
```typescript
// BAD - Never do this
const DATABASE_URL = 'postgresql://user:password@host/db'
const API_KEY = 'sk_live_51234567890...'
const JWT_SECRET = 'super-secret-key'
```

### ✅ Do: Use Environment Variables
```typescript
// GOOD - Safe
const DATABASE_URL = process.env.DATABASE_URL
const API_KEY = process.env.STRIPE_API_KEY
const JWT_SECRET = process.env.JWT_SECRET
```

### ❌ Don't: Commit .env Files
```bash
git add .env.local      # WRONG - blocks by hook
git add .env.production # WRONG - blocks by hook
```

### ✅ Do: Commit Template Only
```bash
git add .env.example    # GOOD - safe template
git commit -m "Update .env template"
```

### ❌ Don't: Paste Secrets in Comments
```typescript
// Bad API key: sk_live_51234567890...
// Database: postgres://user:password@host
```

### ✅ Do: Reference Environment Variable Names
```typescript
// Good - just mentions the variable name
// Uses DATABASE_URL from environment
// Uses STRIPE_API_KEY from environment
```

---

## Environment Variables Reference

### Development (.env.local)
```bash
# Database
DATABASE_URL=postgresql://neondb_owner:your_password@host/neondb?sslmode=require

# Email Service (future)
SENDGRID_API_KEY=SG.xxxxx...
SENDGRID_FROM_EMAIL=noreply@trimtax.com

# Authentication (future)
JWT_SECRET=your-random-secret-key-here
NEXTAUTH_SECRET=another-random-secret

# Google Maps (future, optional)
GOOGLE_MAPS_API_KEY=AIzaSyD...

# Environment
NODE_ENV=development
```

### When Rotating Credentials
1. Change secret in external service (Neon, Stripe, etc.)
2. Update `.env.local` locally
3. Verify app still works: `npm run dev`
4. Commit code changes only (not .env.local)
5. Document in team chat what was rotated

---

## For Team Members

### When Joining the Project:
```bash
# 1. Clone repo
git clone https://github.com/...

# 2. Install security hooks
./setup-security-hooks.bat          # Windows
bash setup-security-hooks.sh        # Mac/Linux

# 3. Copy template
cp .env.example .env.local

# 4. Ask team lead for real credentials
# Never share credentials in Slack/email - use password manager
```

### When Leaving the Project:
- All credentials in external services are rotated by team lead
- No action needed from you
- Your access to services is revoked

---

## Incident Response

### If You Accidentally Commit Secrets:

**Step 1: Stop Using That Secret**
```bash
# Immediately rotate in the source system
# Example: Change Neon database password at https://console.neon.tech
```

**Step 2: Remove from Git History**
```bash
# Use git-filter-branch (careful operation)
# Or manually rewrite history
# See: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
```

**Step 3: Notify Team**
- Tell your team lead immediately
- Ensure new credentials are in place
- Verify no access from outside

**Step 4: Verify Safety**
```bash
# Confirm secret is no longer in git
git log -p | grep "your-secret-key"   # Should return nothing
```

---

## References

- [GitHub: Removing Sensitive Data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Git Hooks Documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [12-Factor App: Store Config in Environment](https://12factor.net/config)

---

## Questions?

If you have security concerns or questions:
1. Check this SECURITY.md file first
2. Ask your team lead
3. Document the answer and update this file

---

**Last Updated:** June 2026  
**Maintained By:** TrimTax Development Team
