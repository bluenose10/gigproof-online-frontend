# GigProof MVP Specification v2.4 (Production State)

**Status**: ✅ LIVE IN PRODUCTION | **Date**: Jan 27, 2026 | **Version**: 1.0.3

---

## 1. Core Product Identity

**GigProof** is a browser-based Chrome extension that empowers gig economy workers to self-generate professional "Income Summary" documentation. It bridges the gap between disorganized app dashboards and landlord/lender requirements without acting as a regulated financial intermediary.

### 🌍 Global Strategy (The "Client-Side Model")

By extracting data from user-visible web dashboards within the client's browser, rather than integrating with banking APIs, GigProof operates outside the scope of Open Banking and similar financial data access frameworks.

**Key Benefits:**
- **US / UK / EU Supported**: Works anywhere the gig platform provides a web dashboard
- **Platform-Based Availability**: We support specific platforms (Uber, DoorDash), not specific countries
- **No Regulatory Capital Required**: Avoided £40,000 UK FCA requirement by not using Plaid/Open Banking

---

## 2. Architecture Overview

### A. Chrome Extension (Manifest V3)
**Location:** `/extension/`

**Core Files:**
- `manifest.json` - Extension configuration
- `platforms.js` - Platform detection & extraction config
- `content.js` - Dynamic extractor based on platform config
- `popup.html` - User interface (glassmorphism design)
- `auth-bridge.js` - Syncs authentication between website and extension
- `background.js` - Service worker for persistent sessions

**Status:** ✅ Approved on Chrome Web Store

### B. Website (React + Vite)
**Location:** `/website/`

**Directory Structure:**
```
/website/
  ├── public/         ← Static assets (images, fonts, favicon, etc.)
  ├── src/            ← React components, pages, contexts
  │   ├── components/
  │   ├── pages/
  │   ├── contexts/
  │   ├── App.jsx
  │   └── main.tsx
  ├── index.html      ← Entry point
  └── package.json    ← Dependencies
```

**Tech Stack:**
- React 18 with TypeScript
- Vite for build tooling
- Supabase for authentication & database
- jsPDF for client-side PDF generation
- Tailwind CSS (Fintech Green theme)

**Key Pages:**
- Landing page (gigproof.online)
- Dashboard (authenticated users)
- Download page (PDF generation)
- Pricing page (credit purchase)
- Legal pages (Terms, Privacy)

**Deployment:**
- Platform: Netlify
- URL: https://gigproof.online
- Build command: `npm run build`
- Base directory: `website/`
- Publish directory: `dist`

### C. Backend (Node.js + Supabase)
**Location:** `/backend/` and `/supabase/`

**Components:**
- Stripe Checkout endpoints (Supabase Edge Functions)
- Payment verification webhooks
- User authentication via Supabase Auth
- Credit tracking system in PostgreSQL
- Database: PostgreSQL (via Supabase)

**Important:** No PDF generation on backend - all done client-side

---

## 3. Authentication & Payments

### 🔐 Authentication Flow

**Supabase Auth** manages user sessions across Website and Chrome Extension:

1. User signs up/logs in on website
2. **3 FREE credits automatically granted on signup**
3. Session token stored in Supabase
4. Chrome Extension detects session via `auth-bridge.js`
5. Token synced to extension's local storage
6. Seamless experience across both platforms

### 💳 Payment & Credits System

**Current State:** `PAYMENTS_ENABLED: true`

**Pricing Structure:**
- ✅ **3 FREE credits on signup** (automatic)
- ✅ **$2.99 for 1 additional PDF**
- ✅ **$19.99 for 10 PDFs** (bulk pricing, $1.99 per PDF)

**Credits Flow:**
1. User signs up → Receives 3 free credits
2. User generates PDF → 1 credit deducted
3. When credits = 0 → Purchase required
4. User selects package (1 PDF or 10 PDFs)
5. Redirected to Stripe Checkout
6. After successful payment:
   - Webhook updates Supabase
   - Credits added to user account
   - User can generate more PDFs

**Database Schema:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  credits INTEGER DEFAULT 3,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**PDF Generation:**
- Client-side using jsPDF (no backend storage)
- Each generation costs 1 credit
- Preview available before credit deduction
- Download triggers credit deduction

---

## 4. Platform Support Strategy

### Tier 1 (Active - Feature Complete)
**Fully enabled with reliable extraction:**
- ✅ **Uber / Uber Eats** (Global)
- ✅ **DoorDash** (US/Global)

### Tier 2 (Mapped but Disabled)
**Defined in code but hidden behind feature flags:**
- ⏸️ **Deliveroo** (UK/EU)
- ⏸️ **Just Eat** (UK/EU)  
- ⏸️ **Amazon Flex**

### 🚩 Feature Flag Schema (platforms.js)

Every platform controlled by:
- `enabled`: Master switch (true/false)
- `earningsExtraction`: Can we read the money?
- `dateRangeExtraction`: Can we read the dates?
- `autoDetectPage`: Can we verify correct URL?

---

## 5. PDF Specification (Compliance-First)

### 📄 The "Safe" PDF Design

**Critical Compliance Elements:**
- **Title:** "Personal Income Summary" (NEVER "Verification")
- **Disclaimer:** *"This document is a user-generated income summary provided for informational purposes only. GigProof does not verify, certify, audit, or guarantee..."*
- **Watermark:** "PREVIEW ONLY" before credit deduction (removed after generation)
- **Data Source Statement:** "Generated from user-visible earnings data across gig platforms"

**Why This Matters:**
Avoids classification as regulated consumer reporting or financial verification service under:
- Fair Credit Reporting Act (FCRA)
- Consumer Financial Protection Bureau (CFPB) regulations
- FCA regulations (UK)

---

## 6. User Journey (The "Trust" Flow)

### Step-by-Step Experience:

1. **Discovery** → User lands on gigproof.online
2. **Sign Up** → Creates account (Supabase Auth) → **Gets 3 free credits automatically**
3. **Install Extension** → Downloads from Chrome Web Store
4. **Log In to Platform** → User logs into Uber/DoorDash normally
5. **Extract Data** → Extension detects platform, user clicks "Extract Earnings"
6. **Preview PDF** → User sees preview (watermarked if no credits)
7. **Generate PDF** → 
   - If credits available → PDF generated immediately (1 credit deducted)
   - If no credits → Prompted to purchase more
8. **Purchase More** (if needed) → Select package ($2.99 or $19.99) → Stripe checkout
9. **Download** → PDF downloaded after generation
10. **Use** → Submit to landlord/lender for income verification

**Key Insight:** 3 free credits allow users to test the product before buying

---

## 7. Current Production Status

| Component | Status | Details |
|-----------|--------|---------|
| **Chrome Extension** | ✅ LIVE | Web Store approved, extracting Uber/DoorDash |
| **Website** | ✅ LIVE | Deployed at gigproof.online via Netlify |
| **Authentication** | ✅ LIVE | Supabase Auth, synced to extension |
| **Credits System** | ✅ LIVE | 3 free on signup, tracking in database |
| **Payments** | ✅ LIVE | Stripe Checkout, webhooks working |
| **PDF Generation** | ✅ LIVE | Client-side jsPDF, compliance-focused |
| **Backend API** | ✅ LIVE | Supabase Edge Functions for Stripe |

---

## 8. Marketing & Growth (Current State)

### Active Channels:

**1. Comment Hijacking Strategy (Primary Focus)**
- **UberPeople.net forum:**
  - Username: Mark_GigProof
  - Status: Registered, profile complete
  - Strategy: Post helpful comments on income verification threads
  - Target: 3-5 strategic comments per week
  - Approach: Provide value first, mention GigProof naturally
  
- **Reddit:**
  - Username: ComprehensiveAd3891
  - Age: 5 years old (helps avoid spam filters)
  - Karma: 2 post / 8 comment (building up)
  - Strategy: Warm up with non-promotional comments first
  - Target subreddits: r/uberdrivers, r/doordash, r/gig_economy

**2. SEO Websites (Secondary - Currently Low Traffic)**
- **taxguidehq.com** - Tax guidance for gig workers
- **taxes.taxguidehq.com** - Interactive tax calculators
- **gigproof.online** - Product website

**Known Issues:**
- Traffic dropped after 2 months (Google Sandbox effect)
- Mixed old/new code in repo (being cleaned Jan 27)
- No backlinks yet
- Low domain authority (brand new sites)
- Competing with established giants (TurboTax, Uber, Everlance)

**3. Potential Paid Advertising (Not Yet Launched)**
- Facebook/Instagram ads targeting gig workers
- Google Search ads for "uber income verification" keywords
- Reddit promoted posts in relevant subreddits
- Estimated budget: $300/month for testing

### Marketing Priorities (Next 30 Days):
1. Execute comment hijacking plan on 5+ high-value forum threads
2. Build 10 quality backlinks from relevant sites
3. Create "Reddit-worthy" blog content that gets shared
4. Target long-tail SEO keywords with specific pain points
5. Consider launching small paid ad test ($100-200)

---

## 9. Technical Decisions & Rationale

### Why Chrome Extension Instead of Plaid?

**Original Plan:** Plaid API for bank data  
**Pivot Reason:** UK FCA requires £40,000 capital for Open Banking access  
**New Approach:** Browser extension scrapes visible dashboards  
**Result:** 
- ✅ Works globally
- ✅ No regulatory requirements
- ✅ User controls data (privacy-friendly)
- ✅ No recurring API costs

### Why Client-Side PDF Generation?

**Reason:** Security and privacy  
**Approach:** PDF generated in browser using jsPDF  
**Result:** 
- ✅ No server-side data storage
- ✅ User data stays completely private
- ✅ Faster generation
- ✅ Lower hosting costs
- ✅ No data breach risk

### Why Credits System?

**Reason:** Lower barrier to entry  
**Approach:** 3 free credits on signup  
**Result:**
- ✅ Users can test product before buying
- ✅ Builds trust (see actual results first)
- ✅ Higher conversion potential
- ✅ Reduces customer acquisition friction

---

## 10. Known Issues & Limitations

### Current Limitations:
- ❌ Only 2 platforms supported (Uber, DoorDash)
- ❌ Requires manual extraction (not automatic)
- ❌ Single-language support (English only)
- ❌ No mobile app (Chrome extension only)
- ❌ Chrome browser only (no Firefox, Safari)

### SEO Challenges:
- ❌ Low domain authority (new sites launched 2 months ago)
- ❌ Zero backlinks currently
- ❌ Competing with TurboTax, Uber's own guides, Everlance
- ❌ Traffic dropped after initial spike (Google Sandbox effect)
- ❌ Sites possibly affected by AI-content detection

### Marketing Challenges:
- ⏳ No significant traffic yet (validation pending)
- ⏳ Conversion rate unknown
- ⏳ Customer acquisition cost unknown (organic only so far)
- ⏳ User feedback limited (too early)

---

## 11. Immediate Next Steps

### Product Development:
1. Monitor early user feedback
2. Fix any bugs reported
3. Consider adding Deliveroo/Just Eat (UK market)
4. Explore mobile-friendly alternatives

### Marketing Priorities (Next 7-30 Days):
1. **Week 1:** Post 2-3 warm-up comments on UberPeople forum (build credibility)
2. **Week 2:** Start strategic GigProof mentions in relevant threads
3. **Week 3:** Build first 5 backlinks (directories, partnerships)
4. **Week 4:** Create 2-3 "Reddit-worthy" blog posts, track results

### Growth Experiments:
1. A/B test landing page copy
2. Try different comment strategies (direct vs indirect mention)
3. Test 1-2 paid ad campaigns ($100 each)
4. Reach out to gig economy influencers
5. Submit to Product Hunt

---

## 12. Key Metrics to Track

### Product Metrics (Critical):
- Chrome extension installs (daily/weekly)
- Active users (DAU/MAU)
- PDF generation success rate
- Credits usage patterns
- Payment conversion rate (free → paid)
- Customer support tickets

### Marketing Metrics (Critical):
- Website traffic (organic vs referral vs paid)
- SEO keyword rankings
- Backlink count and quality
- Forum comment engagement rates
- Conversion rate by source

### Financial Metrics:
- MRR (Monthly Recurring Revenue) - if any repeat customers
- Customer acquisition cost (CAC)
- Lifetime value (LTV)
- Churn rate
- Revenue per user

---

## 13. For Future AI Assistants

### Quick Context:
**What:** Chrome extension for gig worker income verification  
**Who:** Solo founder Mark Moran, 14 years web dev, Liverpool/Southport UK  
**Why:** Landlords require income proof, gig workers have messy dashboards  
**How:** Extension scrapes visible data, generates professional PDF  
**Status:** Live, approved, payments working, but low traffic (early stage)  

### Key Facts to Remember:
- **Pricing:** 3 free credits on signup, then $2.99/PDF or $19.99/10 PDFs
- **Folder Structure:** Website code is in `/website/` folder (including `/website/public/` for assets)
- **Deployment:** Netlify deploys ONLY the `/website/` folder
- **Marketing Focus:** Comment hijacking on forums (primary) + SEO (secondary)
- **Current Challenge:** Getting initial traction/customers

### Recent Changes (Jan 27, 2026):
- Removed old Plaid integration code from repo
- Cleaned up mixed website structures
- Updated all documentation to reflect current state
- Confirmed accurate pricing ($2.99/$19.99, not $9.99/$19.99)

### Architecture Key Points:
- Extension extracts from browser (not bank APIs)
- PDF generated client-side (no server storage)
- Works globally wherever platforms have dashboards
- No financial regulatory compliance needed
- User-generated reports (not verification/certification)

---

## 14. Changelog

### v1.0.3 (Jan 27, 2026) - CURRENT
- ✅ Repository cleanup completed (removed old Plaid code)
- ✅ Documentation corrected with accurate pricing
- ✅ Folder structure clarified (`/website/public/` vs root `/public/`)
- ✅ Marketing strategy defined (comment hijacking primary focus)
- ✅ Confirmed production status: fully operational

### v1.0.2 (Jan 23, 2026)
- ✅ Chrome Web Store approval received
- ✅ Stripe payments working in production
- ✅ Credits system implemented (3 free on signup)
- ✅ Website live at gigproof.online

### v1.0.1 (Jan 15, 2026)
- ✅ MVP launched
- ✅ Uber and DoorDash extraction working
- ✅ PDF generation functional
- ✅ Authentication system live

---

*This document reflects the accurate "As-Built" production state of GigProof v1.0 as of January 27, 2026, including correct pricing ($2.99/$19.99) and folder structure.*
