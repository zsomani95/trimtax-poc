# CLAUDE.md — TrimTax PoC Project Handoff

> **Purpose of this file:** Drop this into a new Claude chat (or your project root) to resume the TrimTax build exactly where it left off. It captures every decision made, everything already built, and the prioritized list of what's left.
>
> **Last updated:** June 7, 2026
> **Current phase:** Real CAD data import COMPLETE for both counties. Next up: Phase 3 (PDF + e-signature).

---

## 1. What TrimTax Is

A fully automated Texas property tax protest platform targeting homeowners. A homeowner types their address, sees their current appraised value vs. what it should be (with comps), and authorizes TrimTax to file a protest on their behalf. TrimTax takes a contingency fee on the savings.

**Positioning:** "Fully automated full-service" — occupying the lane between done-for-you services (Ownwell, O'Connor) and DIY flat-fee tools (TaxLasso, AppealDesk).

---

## 2. Business Decisions (LOCKED — do not relitigate)

| Decision | Value |
|---|---|
| **Pricing** | 25% contingency on first-year savings (matches Ownwell) |
| **ARB handling** | Fully automated — aggressive informal settlement only. No human agents, no ARB escalation for PoC. Target 70%+ of argued reduction at informal stage. |
| **Coverage (PoC)** | Harris County (HCAD) + Fort Bend County (FBCAD) |
| **Savings display** | "Save up to $X" hero number; range shown below in subscript/opaque text — not highlighted first |
| **Owner actions** | Limited to: address entry, payment authorization, one e-signature |
| **Legal scope** | Document preparation & filing service (NOT licensed appraisal/legal). Always checks BOTH protest grounds: market value (§41.41) and unequal appraisal (§41.43). |
| **Comp algorithm** | CAD neighborhood codes as primary filter; median assessed price-per-sqft (not mean, per §41.43); Winsorized at 10th/90th percentile; confidence scoring via comp count, ppsf overage, coefficient of variation |
| **High-value/commercial** | Attorney referral partnerships (out of scope for automated PoC) |

---

## 3. Tech Stack (FINAL)

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind v4, shadcn/ui |
| Backend | Next.js API Routes |
| Database | NeonDB (Postgres, free tier 0.5GB / 512MB) + Drizzle ORM |
| Map | OpenStreetMap + Leaflet (free, no API key) |
| PDF | pdf-lib + react-signature-canvas |
| Hosting | Vercel free tier |
| Domain | trimtax.vercel.app (live target); trimtax.net identified as available |

### Critical environment notes (Windows ARM64)
- **Dev server:** ALWAYS run `npm run dev -- --webpack` (Turbopack is unsupported on ARM64 Windows)
- **Terminal:** Use **Command Prompt**, NOT PowerShell (PowerShell scripts are disabled on this machine). PowerShell is only invoked inline via `powershell -command "..."` for one-off file peeks.
- **Node version:** node-v24.16.0-arm64
- **Python:** NOT installed (don't write Python scripts — use Node.js)
- **Stray node_modules:** `C:\Users\adver\node_modules` exists from stray global installs — can cause drizzle-kit to pick the wrong node_modules. Not blocking UI build.

### Key paths
- **Project root:** `C:\Users\adver\OneDrive\Documents\trimtax-poc`
- **Dev URL:** http://localhost:3000/intake
- **Neon console:** https://console.neon.tech (account: zsomani95@gmail.com, project: TrimTax, free tier)

### NeonDB connection string
```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```
**SENSITIVE:** Never commit actual credentials to git. Use `.env.local` for real connection string (not tracked by git).

---

## 4. Database — CURRENT STATE (live, working)

### `properties` table (the big one — real CAD data)
Created directly via Neon SQL Editor. **Contains 1,516,324 real properties across both counties, 308 MB total (well under 512 MB cap).**

```sql
CREATE TABLE IF NOT EXISTS properties (
  acct TEXT PRIMARY KEY,
  site_addr_1 TEXT,
  city TEXT,
  zip TEXT,
  owner_name TEXT,
  neighborhood_code TEXT,
  bld_ar INTEGER,
  cur_appr_val INTEGER,
  prior_appr_val INTEGER,
  protested TEXT,
  county TEXT
);
CREATE INDEX IF NOT EXISTS idx_properties_addr ON properties (site_addr_1);
```

| County | Row count | Notes |
|---|---|---|
| **Harris** | 1,111,467 | Has `prior_appr_val` (prior-year value) + real `protested` flag + `neighborhood_code`. Full data. |
| **Fort Bend** | 404,857 | `prior_appr_val` = NULL, `protested` = "N", `neighborhood_code` = "" (FBCAD export didn't include these). Has address, owner, current value, sqft. |
| **TOTAL** | **1,516,324** | Live, indexed, queryable |

### `submissions` table (from earlier session — user intake records)
```sql
-- columns: id, created_at, owner_name, owner_email, owner_phone,
-- property_address, county, cad_account_number, cad_value, argued_value,
-- projected_savings, status, signature_image, signed_at
```

### Known DB gotchas
- **drizzle-kit push is BROKEN** (driver conflict). Workaround used throughout: create/alter tables manually via Neon SQL Editor. Do NOT try to fix drizzle-kit — just use the SQL Editor.
- DB connection in app uses `@neondatabase/serverless` + `drizzle-orm/neon-http`.

---

## 5. Project File Structure (current)

```
trimtax-poc/
├── app/
│   ├── intake/
│   │   └── page.tsx          ✅ 4-step intake form (address search → estimate → contact → review)
│   ├── analysis/[id]/
│   │   └── page.tsx          ✅ Basic analysis page
│   └── api/submissions/
│       └── route.ts          ✅ Saves submissions to DB
├── components/
│   └── PropertyMap.tsx       ✅ Leaflet map (⚠️ coordinates bug — see Known Issues)
├── data/
│   └── mockProperties.ts     ✅ 3 demo properties (NOW SUPERSEDED by real data — see note)
├── lib/db/
│   ├── index.ts              ✅ @neondatabase/serverless + drizzle-orm/neon-http
│   └── schema.ts             ✅ submissions table schema
├── scripts/                  ✅ NEW THIS SESSION — data import tooling
│   ├── filter-hcad.js        ✅ Filters Harris real_acct.txt → hcad_filtered.csv
│   ├── import-to-neon.js     ✅ Imports hcad_filtered.csv → Neon properties table
│   ├── filter-fbcad.js       ✅ Joins FBCAD Property+Owner files → fbcad_filtered.csv
│   ├── import-fbcad-to-neon.js ✅ Imports fbcad_filtered.csv → Neon
│   ├── hcad_filtered.csv     (106 MB, generated)
│   └── fbcad_filtered.csv    (~36 MB, generated)
├── drizzle.config.json       ✅ schema: "./lib/db/schema.ts"
└── .env.local                ✅ DATABASE_URL set
```

**IMPORTANT:** The intake flow still reads from `data/mockProperties.ts` (3 hardcoded demo properties). The real 1.5M-property database is imported but **the UI is not yet wired to query it.** This is the #1 next task (see Phase 2.5 below).

---

## 6. What We Did THIS Session (Real CAD Data Import)

Went from 3 mock properties → **1.5M real properties** across both counties.

### Harris County (HCAD)
1. Downloaded HCAD 2026 Preliminary bulk files to `C:\Users\adver\Downloads\Real_acct_owner\`. Main file: `real_acct.txt` (867 MB, tab-delimited, HAS header row).
2. Confirmed column layout by peeking at header — key cols: `acct`, `site_addr_1/2/3`, `mailto` (owner), `Neighborhood_Code`, `bld_ar` (sqft), `tot_appr_val`, `prior_tot_appr_val`, `state_class`, `protested`.
3. Wrote `scripts/filter-hcad.js` — streams the 867MB file line-by-line (never loads into memory), keeps only residential (`state_class` starts with "A") + appraised value under $1M, extracts ~10 columns. **Result: 1,111,467 homes → 106 MB CSV.**
4. Created `properties` table + address index in Neon SQL Editor.
5. Wrote `scripts/import-to-neon.js` — streams CSV, bulk-inserts in batches of 500 via `@neondatabase/serverless`. **Result: 1,111,467 rows imported, 227 MB in Neon.**
   - **Bug fixed:** initial env-var regex grabbed a placeholder → "password authentication failed for user 'username'". Replaced with line-by-line `.env.local` parser. Now prints `Connecting with user: neondb_owner` to confirm.

### Fort Bend County (FBCAD)
1. FBCAD uses the **Orion system** — data is at https://www.fbcad.org/data-files/ under **2026 Preliminary**. Downloaded the **6-2-2026 Property Data Export** (modular zips: Property, Owner, Land, Improvement, Segment, Sales).
2. Extracted `Property.zip` → `PropertyDataExport4645043.txt` (210 MB) and `Owner.zip` → `PropertyDataExport4645044.txt` (72 MB).
   - **FBCAD format differs from HCAD:** comma-delimited, quoted fields. Property file cols: `PropertyID`, `CurrAssessedValue`, `SquareFootage`, `SitusStreetNumber/Name/Suffix`, `SitusCity`, `SitusZip`, `NbhdCode` — but **NO owner name** (that's in the separate Owner file). Owner file cols: `PropertyID`, `OwnerName`, `Address1`, etc.
3. Wrote `scripts/filter-fbcad.js` — loads Owner file into an in-memory `PropertyID → OwnerName` Map, then streams Property file, filters (value > 0 and < $1M, **AND non-empty street address** to exclude utility/commercial), joins owner name. **Result: 404,857 homes → 36 MB CSV.**
   - **Bug fixed:** first pass let utility/pipeline/telecom properties through (empty addresses, e.g. "Houston Pipeline Company"). Added `if (!siteAddr || siteAddr.trim().length < 3) continue;` to drop them. 412,228 → 404,857.
4. Wrote `scripts/import-fbcad-to-neon.js` — same batched import. FBCAD-specific mappings: `prior_appr_val` = null, `protested` = "N", `neighborhood_code` = "", `county` = "Fort Bend".
5. Cleared bad first import (`DELETE FROM properties WHERE county = 'Fort Bend';`) then re-imported clean data.

### Verified end state
- `SELECT county, COUNT(*) ... GROUP BY county` → Harris 1,111,467 / Fort Bend 404,857
- Total relation size: 308 MB
- Real address lookups return real homes with real owners and values in both counties.

---

## 7. Known Issues (active, need fixing)

1. **UI not wired to real data** — intake flow still uses `data/mockProperties.ts`. Must build an API route + query against the `properties` table. THIS IS THE TOP PRIORITY.
2. **PropertyMap.tsx coordinates bug** — map pin is hardcoded to downtown Houston instead of the actual property location. Fix: geocode the real address (Nominatim/OpenStreetMap) and pass lat/lng per property.
3. **Leaflet SSR issue** — `leaflet/dist/leaflet.css` import can break SSR; currently using a dynamic-import workaround.
4. **Fort Bend data gaps** — no prior-year value, no protested flag, no neighborhood code. For the comp algorithm (§41.43 unequal-appraisal) Fort Bend will need neighborhood codes eventually — they're in the FBCAD data but weren't in the Property export we used. May need the Land/Segment files or a different FBCAD export.
5. **drizzle-kit push broken** — use Neon SQL Editor for all schema changes (documented above).
6. **Dev server occasionally crashes** — restart with `npm run dev -- --webpack` from project folder.

---

## 8. Build Roadmap — Status & Next Steps

| Phase | Description | Status |
|---|---|---|
| Phase 0 | DB setup (submissions table) | ✅ Complete |
| Phase 1 | 4-step intake form | ✅ Built |
| Phase 2 | Analysis page | ✅ Basic version built |
| **Phase 2.5** | **Wire UI to real `properties` data (NEW — top priority)** | ❌ Not started |
| Phase 3 | PDF generation (Forms 50-132 & 50-162) + e-signature capture | ❌ Not started |
| Phase 4 | Confirmation page + submission tracking | ❌ Not started |
| Phase 5 | Vercel deploy | ❌ Not started |
| Phase 6 | HCAD + FBCAD data import | ✅ COMPLETE this session |

### Prioritized next steps (in order)
1. **Phase 2.5 — Connect UI to real data.** Build a `/api/properties/search` route that queries the `properties` table by address (use the `idx_properties_addr` index, `ILIKE` for fuzzy match). Replace `mockProperties.ts` lookups in `app/intake/page.tsx` with calls to this route. Add address autocomplete (Nominatim geocoding for typed addresses, fuzzy-matched against CAD data).
2. **Fix PropertyMap coordinates** — geocode real address → correct lat/lng pin.
3. **Phase 3 — PDF + signature.** Generate Forms 50-132 (market value protest) and 50-162 (agent authorization) with pdf-lib, capture e-signature with react-signature-canvas, store signature in `submissions.signature_image`.
4. **Phase 4 — Confirmation page** showing submission status.
5. **Phase 5 — Deploy to Vercel** at trimtax.vercel.app.

### Two open strategic questions (still unresolved)
- How exactly to handle ARB hearings without human agents (current plan: aggressive informal settlement only, no escalation — but needs validation).
- Final pricing model confirmation (currently 25% contingency for PoC).

---

## 9. How to Resume in a New Chat

Paste this file (or point Claude to it) and say something like:
> "Here's my TrimTax project handoff (CLAUDE.md). We just finished importing 1.5M real properties into Neon across Harris + Fort Bend. Let's start Phase 2.5 — wiring the intake UI to query the real `properties` table instead of mockProperties.ts."

Claude should read this file, confirm the current state, and pick up at Phase 2.5.

### Quick reference — re-running data refresh (e.g. January 2026 pull)
- HCAD: re-download `real_acct.txt`, re-run `node scripts\filter-hcad.js` then `node scripts\import-to-neon.js`. (Import uses `ON CONFLICT (acct) DO NOTHING` — to fully refresh, `TRUNCATE properties` or `DELETE WHERE county='Harris'` first.)
- FBCAD: re-download latest Property Data Export, re-extract Property + Owner zips, update the file paths at the top of `scripts/filter-fbcad.js`, re-run filter + import.

---

## 10. Deliverable Docs from Earlier Sessions
A 9-file build packet exists at `/mnt/user-data/outputs/trimtax-poc/` (00_BUILD_GUIDE.md through 08_FAQ_AND_KNOWN_ISSUES.md) — covers business strategy, legal framework, hourly milestones, mock data, paste-ready code, demo script with Q&A, and phased roadmap through multi-state expansion. Reference these for deeper context on decisions summarized above.