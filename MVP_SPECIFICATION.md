# GigProof MVP Specification v2.2 (Integrated)

**Status**: PRE-LAUNCH / AUTH & STRIPE INTEGRATED | **Date**: Jan 22, 2026 | **Version**: 1.0.2

## 1. Core Product Identity
**GigProof** is a browser-based utility that empowers gig economy workers to self-generate professional "Income Summary" documentation. It bridges the gap between disorganized app dashboards and landlord/lender requirements without acting as a regulated financial intermediary.

### 🌍 Global Strategy (The "Client-Side Model")
By extracting data from user-visible web dashboards within the client’s browser, rather than integrating with banking APIs, GigProof operates outside the scope of Open Banking and similar financial data access frameworks.
-   **US / UK / EU Supported**: Works anywhere the gig platform provides a web dashboard.
-   **Platform-Based Availability**: We support specific platforms (Uber), not specific countries.
### 🔐 Authentication & Stripe Toggle
We use **Supabase Auth** to manage user sessions across the Website and Chrome Extension.

- **Unified Auth**: Users sign up on the website. The Chrome Extension detects the session and syncs the auth token to local storage via a content bridge (`auth-bridge.js`).
- **Payments Toggle**: A global flag `PAYMENTS_ENABLED` (default `false`) controls the monetization flow.
  - **OFF**: PDFs are generated without watermarks immediately. Stripe is bypassed.
  - **ON**: Users are redirected to Stripe Checkout. PDFs are unlocked only after successful payment.
- **Zero Data Backend**: Reports are associated with `userEmail`, but no raw income data is stored in the database.

---

## 2. Platform Support Strategy (Feature Flags)
We utilize a **Config-Driven Architecture** (`platforms.js`) to manage global rollout safely.

### Tier 1 (Launch - Active)
These platforms are fully enabled with reliable extraction:
-   **Uber / Uber Eats** (Global)
-   **DoorDash** (US/Global)

### Tier 2 (Defined but Disabled)
These are mapped in the system but hidden behind Feature Flags until validation:
-   **Deliveroo** (UK/EU)
-   **Just Eat** (UK/EU)
-   **Amazon Flex**

### 🚩 Feature Flag Schema
Every platform is controlled by:
-   `enabled`: Master switch (true/false).
-   `earningsExtraction`: Can we read the money?
-   `dateRangeExtraction`: Can we read the dates?
-   `autoDetectPage`: Can we verify they are on the right URL?

---

## 3. Compliance & PDF Specification
To avoid classification as a regulated consumer reporting or financial verification service, the generated PDF strictly adheres to **"User-Generated Summary"** language.

### 📄 The "Safe" PDF Spec
-   **Title**: "Personal Income Summary" (NEVER "Verification").
-   **Disclaimer**: *("This document is a user-generated income summary provided for informational purposes only. GigProof does not verify, certify, audit, or guarantee...").*
-   **Watermarking**: Before payment, the PDF is watermarked "PREVIEW ONLY".
-   **Data Source**: Clearly states "Generated from user-visible earnings data across gig platforms".

---

## 4. User Journey (The "Trust" Flow)
1.  **Discovery**: User lands on "Fintech Green" specific landing page ("Global Support").
2.  **Extraction**:
    -   User logs into Uber/DoorDash normally.
    -   Extension detects platform (via `platforms.js`).
    -   Clicks "Extract Earnings" -> Extension reads DOM.
3.  **Preview**:
    -   User sees a **Watermarked Preview** PDF immediately.
    -   This builds trust ("The numbers are right").
4.  **Payment**:
    -   User pays fee via Stripe.
5.  **Unlock**:
    -   Backend **regenerates** the PDF without the watermark.
    -   User downloads the **finalized, non-watermarked Income Summary PDF**.

---

## 5. Technical Architecture
### A. Chrome Extension (Manifest V3)
-   **`platforms.js`**: Central config file.
-   **`content.js`**: Dynamic extractor based on config.
-   **`popup.html`**: Glassmorphism UI with "Connected to [Platform]" status.

### B. Website (React + Vite)
-   **Theme**: Clean Fintech (Emerald Green / White).
-   **Positioning**: "Global Availability", "No Credentials Stored".
-   **PDF Generation**: Client-side only (jsPDF). No server-side PDF generation in MVP.

### C. Backend (Node.js)
-   **Payments Only**: Stripe checkout endpoints and payment status APIs.
-   **No PDF Service**: The backend does not generate or store PDF files in the MVP.

---

## 6. Current Status
| Component | Status | Notes |
| :--- | :--- | :--- |
| **Extension Core** | ✅ READY | Extracting Uber/DoorDash + Test Mode |
| **Feature Flags** | ✅ READY | `platforms.js` implemented |
| **PDF Engine** | ✅ READY | Compliance Wording + Watermark Preview |
| **Website** | ✅ READY | "Fintech Green" Redesign Implemented |
| **Submission** | ✅ READY | `gigproof-extension.zip` ready for Web Store |

## 7. Immediate Next Steps
1.  **Submit Extension**: Upload ZIP to Chrome Web Store Dashboard.
2.  **Deploy Backend**: Host Node.js app (Render/Heroku/DigitalOcean).
3.  **Deploy Website**: Host React app (Vercel/Netlify).
4.  **Switch Keys**: Update Stripe Keys to Live Mode.

## 8. Payments Enable Checklist
1.  **Replace Stripe Price ID**: Update placeholder in `website/src/pages/Download.jsx`.
2.  **Replace Stripe Publishable Key**: Update placeholder in `website/src/pages/Checkout.jsx`.
3.  **Confirm API Base URL**: Ensure `VITE_API_URL` matches the production API (`https://gigproof.online`).
4.  **Webhook Raw Body**: Mount Stripe webhook route before `express.json()` in `backend/server.js`.
5.  **Env Hygiene**: Keep `.env` files out of git via `.gitignore`.

---
*This document reflects the finalized "As-Built" state of GigProof v1.0.*
