// Content script for detecting and extracting gig data
// Depends on: platforms.js (loaded first in manifest)

console.log('GigProof content script loaded');

// Listen for extraction requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractData') {
        try {
            const data = executeExtraction();
            sendResponse({ success: true, data });
        } catch (error) {
            console.error('Extraction error:', error);
            sendResponse({ success: false, error: error.message });
        }
        return true;
    }
});

function executeExtraction() {
    const url = window.location.href;
    let currentPlatform = detectPlatform(url); // From platforms.js

    if (currentPlatform && currentPlatform.key === 'test') {
        const urlParams = new URLSearchParams(window.location.search);
        const requestedPlatform = urlParams.get('platform');
        if (requestedPlatform && PLATFORMS[requestedPlatform] && requestedPlatform !== 'test') {
            currentPlatform = { key: requestedPlatform, ...PLATFORMS[requestedPlatform] };
            currentPlatform.name = `${currentPlatform.name} (Test)`;
        }
    }

    if (!currentPlatform) {
        throw new Error('Unsupported platform URL');
    }

    if (!currentPlatform.enabled) {
        throw new Error(`Support for ${currentPlatform.name} is coming soon!`);
    }

    console.log(`Detected Platform: ${currentPlatform.name}`);

    // Feature Flag Check: Auto-Detect Page
    if (currentPlatform.features.autoDetectPage) {
        if (!isEarningsPage(currentPlatform.key)) {
            throw new Error(`Please open your ${currentPlatform.name} earnings page before extracting data.`);
        }
    }

    // Route to specific extractor
    // In a larger app, these would be separate modules. For MVP, we keep them here.
    let data = {};
    if (currentPlatform.key === 'uber') {
        data = extractUberData();
    } else if (currentPlatform.key === 'doordash') {
        data = extractDoorDashData();
    } else {
        data = extractGenericData();
    }

    // Feature Flag Check: Date Range
    if (!currentPlatform.features.dateRangeExtraction && !data.dateRange) {
        data.dateRange = "Period selected by user (Auto-detection disabled)";
    }

    return {
        platform: currentPlatform.name,
        ...data,
        extractedAt: new Date().toISOString(),
        pageUrl: url
    };
}


// --- EXTRACTORS (Keep existing logic, just wrapped) ---

function extractUberData() {
    const earningsSelectors = ['[data-testid="earnings-amount"]', '.earnings-total', '[class*="earnings"]', '[class*="total-amount"]'];
    const dateRangeSelectors = ['[data-testid="date-range"]', '.date-range', '[class*="date-range"]'];

    let grossEarnings = findText(earningsSelectors);
    let dateRange = findText(dateRangeSelectors);

    // Currency Logic
    let currency = detectCurrencyFromAmount(grossEarnings);

    if (!grossEarnings) {
        // Mock fallback check would go here if enabled
        return { grossEarnings: '$0.00', dateRange: 'N/A', currency: 'USD' };
    }

    return { grossEarnings, dateRange: dateRange || 'Date not found', currency };
}

function extractDoorDashData() {
    const earningsSelectors = ['[data-testid="earnings-total"]', '.earnings-amount', '[class*="earnings"]', '[class*="total"]'];
    const dateRangeSelectors = ['[data-testid="earnings-period"]', '.date-range', '[class*="period"]'];

    let grossEarnings = findText(earningsSelectors);
    let dateRange = findText(dateRangeSelectors);

    let currency = detectCurrencyFromAmount(grossEarnings);

    if (!grossEarnings) {
        return { grossEarnings: '$0.00', dateRange: 'N/A', currency: 'USD' };
    }

    return { grossEarnings, dateRange: dateRange || 'Date not found', currency };
}

function extractGenericData() {
    const earningsSelectors = [
        '[data-testid*="earning"]',
        '[data-testid*="payout"]',
        '[class*="earnings"]',
        '[class*="payout"]',
        '[class*="total"]',
        '[class*="income"]',
        '[class*="pay"]'
    ];
    const dateRangeSelectors = [
        '[data-testid*="period"]',
        '[data-testid*="date"]',
        '[class*="date-range"]',
        '[class*="range"]',
        '[class*="period"]',
        '[class*="week"]',
        '[class*="statement"]'
    ];

    let grossEarnings = findText(earningsSelectors);
    let dateRange = findText(dateRangeSelectors);
    let currency = detectCurrencyFromAmount(grossEarnings);

    if (!grossEarnings) {
        return { grossEarnings: '$0.00', dateRange: 'N/A', currency: currency || 'USD' };
    }

    return { grossEarnings, dateRange: dateRange || 'Date not found', currency };
}

function isEarningsPage(platformKey) {
    const url = window.location.href;

    if (platformKey === 'uber') {
        if (url.includes('/earnings') || url.includes('/pay')) return true;
        const earningsSelectors = [
            '[data-testid="earnings-amount"]',
            '.earnings-total',
            '[class*="earnings"]',
            '[class*="total-amount"]'
        ];
        return earningsSelectors.some((selector) => document.querySelector(selector));
    }

    if (platformKey === 'doordash') {
        if (url.includes('/dasher/earnings') || url.includes('/earnings')) return true;
        const earningsSelectors = [
            '[data-testid="earnings-total"]',
            '.earnings-amount',
            '[class*="earnings"]',
            '[class*="total"]'
        ];
        return earningsSelectors.some((selector) => document.querySelector(selector));
    }
     
    if (platformKey === 'test') {
        return true;
    }

    const urlHints = [
        '/earnings',
        '/income',
        '/pay',
        '/payments',
        '/payout',
        '/payouts',
        '/statement',
        '/summary',
        '/wallet',
        '/weekly'
    ];

    if (urlHints.some((hint) => url.includes(hint))) {
        return true;
    }

    const genericSelectors = [
        '[data-testid*="earning"]',
        '[data-testid*="payout"]',
        '[class*="earnings"]',
        '[class*="payout"]',
        '[class*="total"]',
        '[class*="income"]',
        '[class*="pay"]'
    ];

    return genericSelectors.some((selector) => document.querySelector(selector));
}

// Helper
function findText(selectors) {
    for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el) return el.textContent.trim();
    }
    return '';
}

function detectCurrencyFromAmount(amount) {
    if (!amount) return 'USD';
    const symbolMatch = amount.match(/[$£€¥]/);
    if (symbolMatch) {
        const map = { '$': 'USD', '£': 'GBP', '€': 'EUR', '¥': 'JPY' };
        return map[symbolMatch[0]] || 'USD';
    }

    const upper = amount.toUpperCase();
    if (upper.includes('USD')) return 'USD';
    if (upper.includes('GBP')) return 'GBP';
    if (upper.includes('EUR')) return 'EUR';
    if (upper.includes('JPY')) return 'JPY';

    return 'USD';
}
