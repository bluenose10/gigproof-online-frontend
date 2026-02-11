# GigProof MVP Specification v2.5 (Production State - CORRECTED)

**Status**: ✅ LIVE IN PRODUCTION | **Date**: Feb 11, 2026 | **Version**: 1.0.7

---

## 1. Core Product Identity

**GigProof** is a browser-based Chrome extension that empowers gig economy workers to self-generate professional "Income Summary" documentation. It bridges the gap between disorganized app dashboards and landlord/lender requirements without acting as a regulated financial intermediary.

### 🌍 Global Strategy (The "Client-Side Model")

By extracting data from user-visible web dashboards within the client's browser, rather than integrating with banking APIs, GigProof operates outside the scope of Open Banking and similar financial data access frameworks.

**Key Benefits:**
- **US / UK / EU Supported**: Works anywhere the gig platform provides a web dashboard
- **10 Platforms Supported**: Comprehensive coverage across major gig platforms
- **No Regulatory Capital Required**: Avoided £40,000 UK FCA requirement by not using Plaid/Open Banking

---

## 2. Platform Support (10 PLATFORMS LIVE)

### ✅ CURRENTLY SUPPORTED PLATFORMS:

1. **Uber** (Global)
2. **DoorDash** (US/Global)
3. **Lyft** (US/Canada)
4. **Grubhub** (US)
5. **Instacart** (US/Canada)
6. **Amazon Flex** (US/UK/Global)
7. **Shipt** (US)
8. **Gopuff** (US)
9. **Deliveroo** (UK/EU)
10. **Just Eat** (UK/EU)

**Status:** All 10 platforms have extraction logic implemented and are live in production

---

## 3. Architecture Overview

### A. Chrome Extension (Manifest V3)
**Location:** `/extension/`

**Core Files:**
- `manifest.json` - Extension configuration
- `platforms.js` - Platform detection & extraction config (10 platforms)
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
- For Lenders page (B2B landing)
- Legal pages (Terms, Privacy)
- **Blog section** (`/blog/`) - 67 SEO-optimized articles + 5 city hubs

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

## 4. Authentication & Payments

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
4. **Log In to Platform** → User logs into any of 10 supported platforms
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
| **Chrome Extension** | ✅ LIVE | Web Store approved, 10 platforms supported |
| **Website** | ✅ LIVE | Deployed at gigproof.online via Netlify |
| **Authentication** | ✅ LIVE | Supabase Auth, synced to extension |
| **Credits System** | ✅ LIVE | 3 free on signup, tracking in database |
| **Payments** | ✅ LIVE | Stripe Checkout, webhooks working |
| **PDF Generation** | ✅ LIVE | Client-side jsPDF, compliance-focused |
| **Backend API** | ✅ LIVE | Supabase Edge Functions for Stripe |
| **Platform Coverage** | ✅ LIVE | 10 platforms fully operational |

---

## 8. Marketing & Growth (Current State)

### Active Channels:

**1. Blog / Content Marketing (Primary SEO Focus)**
- **Location:** `/website/public/blog/`
- **Status:** ✅ 67 SEO-optimized articles LIVE + 5 city hubs
- **Full SEO Implementation:** Google Analytics, Open Graph, Twitter Cards, 6 Schema.org blocks per article

### ⚠️ CANONICAL URL RULE (CRITICAL - READ THIS!):
**All blog canonical and og:url tags MUST use trailing slashes. NEVER use .html extension in canonical URLs.**
- ✅ Correct: `https://gigproof.online/blog/phoenix-uber-driver-apartments/`
- ❌ Wrong: `https://gigproof.online/blog/phoenix-uber-driver-apartments.html`
- ❌ Wrong: `https://gigproof.online/blog/phoenix-uber-driver-apartments` (missing trailing slash)

**Why?** Google Search Console flags duplicates when canonical URLs don't match indexed URLs. Fixed 61 articles on Feb 11, 2026.

**City Hubs (5 Live - 51 city-specific articles):**
| City | Articles | Status |
|------|----------|--------|
| Miami | 11 | ✅ LIVE |
| Los Angeles | 10 | ✅ LIVE |
| New York | 10 | ✅ LIVE |
| Chicago | 10 | ✅ LIVE |
| Phoenix | 10 | ✅ LIVE |

**General Guides (11 articles):**
1. How Uber Drivers and DoorDash Dashers Can Show Proof of Income for Apartments
2. Gig Worker Income Verification: Complete Guide for Rentals and Loans
3. What Documents Do Landlords Actually Accept from Self-Employed Workers?
4. Lyft Driver Proof of Income: Complete Guide
5. Instacart Shopper Proof of Income: How to Show Earnings
6. DoorDash Income Statement: How to Get and Use It
7. Uber Driver Tax Documents: Complete 1099 Guide
8. Gig Worker Car Loan: How to Get Approved Without Pay Stubs
9. How to Rent an Apartment Without Pay Stubs
10. How to Combine Income from Multiple Gig Apps
11. Geographic targeting test article (Miami - now part of city hub)

**Geographic Targeting Strategy:**
- ✅ 5 city hubs now LIVE (Miami, LA, NYC, Chicago, Phoenix)
- Each city has hub page + 8-10 neighborhood/topic articles
- Includes geo-coordinates in Schema.org markup
- Next cities to consider: Houston, Atlanta, Dallas, San Francisco

**2. Comment Hijacking Strategy (Secondary Focus)**
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
  - Target subreddits: r/uberdrivers, r/doordash, r/gig_economy, r/lyft, r/instacart

**3. SEO Websites (Supporting)**
- **taxguidehq.com** - Tax guidance for gig workers
- **taxes.taxguidehq.com** - Interactive tax calculators
- **gigproof.online** - Product website with blog

**Known Issues:**
- Traffic dropped after 2 months (Google Sandbox effect)
- No backlinks yet
- Low domain authority (brand new sites)
- Competing with established giants (TurboTax, Uber, Everlance)

**3. Potential Paid Advertising (Not Yet Launched)**
- Facebook/Instagram ads targeting gig workers
- Google Search ads for income verification keywords
- Reddit promoted posts in relevant subreddits
- Estimated budget: $300/month for testing

### Marketing Priorities (Next 30 Days):
1. ✅ COMPLETED: City articles for Miami, LA, NYC, Chicago, Phoenix (51 articles)
2. Monitor city hub performance and conversion rates by geography
3. Execute comment hijacking plan on 5+ high-value forum threads
4. Build 10 quality backlinks from relevant sites (blog posts as link targets)
5. Target long-tail SEO keywords with specific pain points
6. Consider launching small paid ad test ($100-200)
7. Next city expansion: Houston, Atlanta, Dallas, San Francisco

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
- ✅ Can support 10+ platforms easily

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
- ❌ Requires manual extraction (not automatic)
- ❌ Single-language support (English only)
- ❌ No mobile app (Chrome extension only)
- ❌ Chrome browser only (no Firefox, Safari)

### Platform Coverage:
- ✅ **10 platforms supported:** Uber, DoorDash, Lyft, Grubhub, Instacart, Amazon Flex, Shipt, Gopuff, Deliveroo, Just Eat
- ⚠️ Extraction reliability varies by platform (some platforms change UI frequently)
- ⚠️ Users may need to navigate to specific earnings pages for extraction to work

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
1. Monitor early user feedback on all 10 platforms
2. Fix any platform-specific extraction issues
3. Consider adding more platforms based on user requests
4. Explore mobile-friendly alternatives

### Marketing Priorities (Next 7-30 Days):
1. **Week 1:** Post 2-3 warm-up comments on UberPeople forum (build credibility)
2. **Week 2:** Start strategic GigProof mentions in relevant threads
3. **Week 3:** Build first 5 backlinks (directories, partnerships)
4. **Week 4:** Create 2-3 "Reddit-worthy" blog posts, track results

### Growth Experiments:
1. A/B test landing page copy highlighting 10 platform support
2. Try different comment strategies (direct vs indirect mention)
3. Test 1-2 paid ad campaigns ($100 each)
4. Reach out to gig economy influencers
5. Submit to Product Hunt

---

## 12. Key Metrics to Track

### Product Metrics (Critical):
- Chrome extension installs (daily/weekly)
- Active users by platform (which of the 10 platforms are most used)
- PDF generation success rate per platform
- Credits usage patterns
- Payment conversion rate (free → paid)
- Customer support tickets by platform

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
**How:** Extension scrapes visible data from 10 platforms, generates professional PDF  
**Status:** Live, approved, payments working, 10 platforms supported  

### Key Facts to Remember:
- **Pricing:** 3 free credits on signup, then $2.99/PDF or $19.99/10 PDFs
- **Platforms:** 10 live platforms (Uber, DoorDash, Lyft, Grubhub, Instacart, Amazon Flex, Shipt, Gopuff, Deliveroo, Just Eat)
- **Folder Structure:** Website code is in `/website/` folder (including `/website/public/` for assets)
- **Deployment:** Netlify deploys ONLY the `/website/` folder
- **Marketing Focus:** Comment hijacking on forums (primary) + SEO (secondary)
- **Blog:** 67 articles + 5 city hubs (Miami, LA, NYC, Chicago, Phoenix)
- **⚠️ CANONICAL URL RULE:** All blog canonicals must use trailing slash, NEVER .html extension!
- **Current Challenge:** Getting initial traction/customers

### Recent Changes (Feb 11, 2026):
- ✅ **PHOENIX CITY HUB** - Added 10 Phoenix articles completing 5th city hub
- ✅ **CANONICAL URL FIX** - Fixed 61 articles missing trailing slashes (was causing Google duplicates)
- ✅ **5 City Hubs Live:** Miami (11), LA (10), NYC (10), Chicago (10), Phoenix (10) = 51 city articles
- ⚠️ **RULE ESTABLISHED:** All blog canonicals MUST use trailing slash format, NEVER .html

### Previous Changes (Jan 31, 2026):
- Added blog section with initial SEO-optimized articles
- Created geographic targeting test (Miami article)
- Full SEO: Google Analytics, Open Graph, Twitter Cards, Schema.org Article + FAQ markup
- Added For Lenders B2B landing page
- Updated sitemap.xml, llms.txt, robots.txt

### Previous Changes (Jan 27-28, 2026):
- Fixed Stripe webhook RLS issue
- Removed old Plaid integration code from repo
- Confirmed 10 platforms are live
- Updated all documentation to reflect current accurate state

### Architecture Key Points:
- Extension extracts from browser (not bank APIs)
- PDF generated client-side (no server storage)
- Works globally wherever platforms have dashboards
- No financial regulatory compliance needed
- User-generated reports (not verification/certification)
- 10 platforms = comprehensive gig economy coverage

---

## 14. Changelog

### v1.0.7 (Feb 11, 2026) - CURRENT
- ✅ **PHOENIX CITY HUB COMPLETE** - Added 10 Phoenix articles (income verification, gig economy stats, apartments, neighborhoods)
- ✅ **CANONICAL URL FIX** - Fixed 61 article files missing trailing slashes in canonical/og:url tags
- ✅ 5 city hubs now live: Miami (11), LA (10), NYC (10), Chicago (10), Phoenix (10)
- ✅ Total blog content: 67 articles + 5 city hub index pages
- ✅ Updated sitemap.xml with 11 new Phoenix URLs
- ✅ Updated llms.txt with Phoenix hub and article summaries
- ✅ All city hub pages now cross-link to each other
- ⚠️ **CANONICAL URL RULE ESTABLISHED:** All blog articles MUST use trailing slashes. Format: `https://gigproof.online/blog/article-slug/` (NEVER use .html!)

### v1.0.6 (Jan 31, 2026)
- ✅ Added comprehensive blog section with initial SEO-optimized articles
- ✅ Full SEO implementation: Google Analytics, Open Graph, Twitter Cards, Schema.org
- ✅ Added FAQ Schema markup to all blog articles
- ✅ Created geographic targeting test article (Miami Uber Driver Apartments)
- ✅ Added For Lenders landing page
- ✅ Updated sitemap.xml with all blog URLs
- ✅ Updated llms.txt with blog section
- ✅ Custom Vite middleware for serving static blog HTML files

### v1.0.5 (Jan 28, 2026)
- ✅ Fixed Stripe webhook RLS issue - credits now update correctly after payment
- ✅ Added `add_pdf_credits` SQL function with SECURITY DEFINER to bypass RLS
- ✅ Updated stripe-webhook Edge Function to use RPC call
- ✅ Fixed Stripe webhook event type (was `async_payment_succeeded`, now `checkout.session.completed`)
- ✅ Cleaned up old/broken webhook endpoints in Stripe

### v1.0.4 (Jan 27, 2026)
- ✅ Corrected documentation: 10 platforms supported (not 2)
- ✅ Repository restored after accidental deletion
- ✅ Confirmed all systems operational
- ✅ Updated marketing strategy focus

### v1.0.3 (Jan 27, 2026)
- ✅ Repository cleanup completed (removed old Plaid code)
- ✅ Documentation corrected with accurate pricing
- ✅ Folder structure clarified (`/website/public/` vs root `/public/`)
- ✅ Marketing strategy defined (comment hijacking primary focus)

### v1.0.2 (Jan 23, 2026)
- ✅ Chrome Web Store approval received
- ✅ Stripe payments working in production
- ✅ Credits system implemented (3 free on signup)
- ✅ Website live at gigproof.online

### v1.0.1 (Jan 15, 2026)
- ✅ MVP launched
- ✅ Initial platform extraction working
- ✅ PDF generation functional
- ✅ Authentication system live

---

*This document reflects the accurate "As-Built" production state of GigProof v1.0.7 as of February 11, 2026, including correct 10-platform support, accurate pricing ($2.99/$19.99), blog section with 67 articles + 5 city hubs, and canonical URL standards.*
