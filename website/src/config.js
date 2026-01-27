import { PDF_COPY } from './utils/pdfCopy';

export const CONFIG = {
    PAYMENTS_ENABLED: true, // Feature flag for payments
    STRIPE_CHECKOUT_URL: import.meta.env.VITE_STRIPE_CHECKOUT_URL || `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
    STRIPE_PRICE_SINGLE: import.meta.env.VITE_STRIPE_PRICE_SINGLE || 'price_1SsoJxCR4lM1NiVB0Tjf381O',
    STRIPE_PRICE_BUNDLE: import.meta.env.VITE_STRIPE_PRICE_BUNDLE || 'price_1SqYG0CR4lM1NiVB3WCxe8tP',
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    EXTENSION_URL: import.meta.env.VITE_EXTENSION_URL || 'https://chromewebstore.google.com/detail/gigproof/bfmolgdhhldfelgfcpbpbadfcokgfkjo',
    PDF_DISCLAIMER: PDF_COPY.disclaimer,
};

