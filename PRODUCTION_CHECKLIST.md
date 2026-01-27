# Production Readiness Checklist

**Last Updated:** January 23, 2026
**Status:** Live website + packaged Chrome extension | Chrome Web Store review pending

---

## ✅ COMPLETED ITEMS

### 1. Chrome Extension Core
**Status:** ✅ COMPLETE

- ✅ Manifest v3 configured with popup and content scripts
- ✅ Supported platforms: Uber and DoorDash extraction
- ✅ Popup UX for extract, preview, and generate flow
- ✅ Local storage of extracted report data
- ✅ Auth sync bridge between website and extension
- ✅ Background service worker persists auth session

Key files:
- `extension/manifest.json`
- `extension/popup.js`
- `extension/content.js`
- `extension/auth-bridge.js`
- `extension/background.js`

---

### 2. Web App (Download + Auth)
**Status:** ✅ COMPLETE

- ✅ Login + session handling via Supabase
- ✅ Download page generates PDF locally (client-side)
- ✅ Receives report data from extension via postMessage
- ✅ Dashboard instructions for extension install and usage
- ✅ Legal/marketing pages present

Key files:
- `website/src/App.jsx`
- `website/src/AuthContext.jsx`
- `website/src/pages/Download.jsx`
- `website/src/pages/Dashboard.jsx`

---

### 3. Packaging and Deployment
**Status:** ✅ COMPLETE

- ✅ Extension zip packaging script ready
- ✅ Netlify config for website build
 - ✅ Chrome Web Store submission completed

Key files:
- `create_zip.js`
- `netlify.toml`

---

## ⚠️ CONFIG CHECKS

### 1. Production URLs
**CRITICAL:** Before deploying to production:
- ✅ **`extension/config.js`** → `BASE_URL` set to `'https://gigproof.online'`
- `extension/manifest.json` (externally_connectable + host_permissions)

### 2. Payments (Optional)
Payments are currently disabled in the website config.
- `website/src/config.js` → `PAYMENTS_ENABLED: false`

---

## 📌 CURRENT STATE SUMMARY

| Component | Status | Notes |
|-----------|--------|-------|
| Chrome Extension | ✅ Ready | Packaged zip present (`gigproof-extension.zip`) |
| Website | ✅ Live | Netlify build config in `netlify.toml` |
| Backend API | ✅ Optional | Stripe endpoints only, not required for free PDF flow |

---

## ✅ LAUNCH READINESS

**Ready:** Extension + website flow are production-ready for Uber/DoorDash extraction and PDF generation.

**Pending:** Chrome Web Store approval (review in progress).

---

## ⚠️ CURRENT ISSUE (LOCAL TESTING)

- Checkout failing from `http://localhost:5173` with CORS/preflight errors and 404/500 responses from `/functions/v1/stripe-checkout`.
- Edge Function logs show runtime errors and profile fetch failures when running locally.
- Follow up: verify local env values (`VITE_SUPABASE_URL`, `VITE_STRIPE_CHECKOUT_URL`) and confirm Edge Function deployment + secrets.

**Optional Next Steps (if needed):**
- Publish/update Chrome Web Store listing
- Turn on payments by enabling `PAYMENTS_ENABLED`
- Add more platforms in `extension/platforms.js`
