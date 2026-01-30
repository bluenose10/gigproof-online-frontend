# GigProof Chrome Extension

A Chrome extension that converts gig worker earnings into professional PDF documents using **Secure Client-Side Extraction**.

👉 **[Read the MVP Specification](./MVP_SPECIFICATION.md)** for detailed architecture and extraction logic.

## 🎯 Features

- **Modern Glassmorphism UI** - Premium design with frosted glass effects and smooth animations
- **10 Platform Support** - Uber, DoorDash, Lyft, Grubhub, Instacart, Amazon Flex, Shipt, Gopuff, Deliveroo, Just Eat
- **PDF Generation** - Client-side income summary documents
- **Stripe Integration** - Secure payment processing
- **Legal Compliance** - Mandatory disclaimers on all documents

## MVP Constraints

- PDFs are generated client-side only (no server-side PDF generation in MVP)
- No backend storage of raw earnings data
- Webhooks and paid unlock flows are optional and UI-gated for MVP

## Pre-Launch Checklist

Last updated: Jan 23, 2026

- [ ] Replace the Stripe price ID placeholder in `website/src/pages/Download.jsx`
- [ ] Replace the Stripe publishable key placeholder in `website/src/pages/Checkout.jsx`
- [ ] Set production `VITE_API_URL` (currently `https://gigproof.online` in `netlify.toml`)
- [ ] Enable payments flag in `website/src/config.js`
- [ ] Configure Stripe webhooks to use a raw body handler before `express.json()` in `backend/server.js`
- [x] Ensure `.env` files are excluded from git (`.gitignore`)

## 📁 Project Structure

```
Chrome-Exstension-Gigproof/
├── extension/              # Chrome extension files
│   ├── manifest.json      # Extension configuration
│   ├── popup.html         # Popup UI
│   ├── popup.js           # Popup logic
│   ├── content.js         # Data extraction script
│   ├── styles.css         # Glassmorphism styles
│   └── icons/             # Extension icons
└── backend/               # Node.js API server
    ├── server.js          # Express server
    ├── routes/
    │   └── payment.js     # Stripe integration
```

## 🚀 Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from template:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=3000
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

5. Start the server:
```bash
npm run dev
```

The API will be available at `https://gigproof.online`

### Chrome Extension Setup

1. Open Chrome and navigate to `chrome://extensions/`

2. Enable "Developer mode" (toggle in top right)

3. Click "Load unpacked"

4. Select the `extension` folder from this project

5. The GigProof extension icon should appear in your toolbar

## 🎨 Usage

1. **Navigate to Platform**: Go to any supported gig platform driver dashboard (Uber, DoorDash, Lyft, Grubhub, Instacart, Amazon Flex, Shipt, Gopuff, Deliveroo, or Just Eat)

2. **Open Extension**: Click the GigProof icon in your toolbar

3. **Extract Data**: Click "Extract Earnings" to scrape your earnings data

4. **Generate PDF**: Review the extracted data and click "Generate PDF"

5. **Download**: Your professional income document will open in a new tab

## 🔧 Development

### Testing with Mock Data

The extension includes mock data fallback for testing without accessing real driver dashboards. The content script will automatically use mock data if it cannot find earnings elements on the page.

### Updating Platform Selectors

To update the DOM selectors for any platform:

1. Open `extension/content.js`
2. Modify the selector arrays for the relevant platform extraction function
3. Platform configuration is in `extension/platforms.js`
4. Test on the actual platform dashboard

### API Endpoints

- `GET /health` - Health check
- `POST /api/create-payment-intent` - Create Stripe payment
- `GET /api/payment-status/:id` - Check payment status

## ⚠️ Legal Compliance

All generated PDFs include the mandatory disclaimer:

> "This is a user-generated income summary. GigProof does not guarantee its accuracy. This document is created based on data visible to the user at the time of extraction. GigProof does not verify, certify, or authenticate the information contained herein."

**Forbidden terms**: The system never uses "Verified", "Official", "Certified", or "Guaranteed" to avoid legal liability.

## 🔐 Security

- **No Credential Storage**: The extension never asks for or stores login credentials
- **CORS Protection**: Backend configured for Chrome extension origins only
- **Data Privacy**: Earnings data is only stored temporarily in local storage

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `PDF_STORAGE_PATH` | Path for generated PDFs | No (default: ./generated-pdfs) |

## 🛠️ Technologies

- **Frontend**: HTML, CSS (Glassmorphism), Vanilla JavaScript
- **Extension**: Chrome Manifest V3
- **Backend**: Node.js, Express
- **PDF Generation**: jsPDF (client-side)
- **Payments**: Stripe
- **CORS**: Configured for Chrome extensions

## 📄 License

MIT

## 🤝 Support

For issues or questions, please open an issue on GitHub.
