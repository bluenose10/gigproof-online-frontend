/**
 * GigProof Platform Configuration
 * Canonical Schema - MVP Safe
 */
const PLATFORMS = {
    uber: {
        name: "Uber",
        domains: ["drivers.uber.com"],
        dashboardUrl: "https://drivers.uber.com",
        countries: ["US", "UK", "EU"],
        enabled: true,
        features: {
            earningsExtraction: true,
            dateRangeExtraction: true,
            autoDetectPage: true,
            logoInPdf: true
        },
    },

    doordash: {
        name: "DoorDash",
        domains: ["driver.doordash.com"],
        dashboardUrl: "https://driver.doordash.com",
        countries: ["US"],
        enabled: true,
        features: {
            earningsExtraction: true,
            dateRangeExtraction: true,
            autoDetectPage: true,
            logoInPdf: true
        },
    },

    lyft: {
        name: "Lyft",
        domains: ["driver.lyft.com"],
        dashboardUrl: "https://driver.lyft.com",
        countries: ["US"],
        enabled: true,
        features: {
            earningsExtraction: true,
            dateRangeExtraction: true,
            autoDetectPage: true,
            logoInPdf: true
        },
    },

    grubhub: {
        name: "Grubhub",
        domains: ["driver.grubhub.com"],
        dashboardUrl: "https://driver.grubhub.com",
        countries: ["US"],
        enabled: true,
        features: {
            earningsExtraction: true,
            dateRangeExtraction: true,
            autoDetectPage: true,
            logoInPdf: true
        },
    },

    instacart: {
        name: "Instacart",
        domains: ["shoppers.instacart.com"],
        dashboardUrl: "https://shoppers.instacart.com",
        countries: ["US", "CA"],
        enabled: true,
        features: {
            earningsExtraction: true,
            dateRangeExtraction: true,
            autoDetectPage: true,
            logoInPdf: true
        },
    },

    amazonflex: {
        name: "Amazon Flex",
        domains: ["flex.amazon.com"],
        dashboardUrl: "https://flex.amazon.com",
        countries: ["US", "UK", "EU"],
        enabled: true,
        features: {
            earningsExtraction: true,
            dateRangeExtraction: true,
            autoDetectPage: true,
            logoInPdf: true
        },
    },

    shipt: {
        name: "Shipt",
        domains: ["shopper.shipt.com"],
        dashboardUrl: "https://shopper.shipt.com",
        countries: ["US"],
        enabled: true,
        features: {
            earningsExtraction: true,
            dateRangeExtraction: true,
            autoDetectPage: true,
            logoInPdf: true
        },
    },

    gopuff: {
        name: "Gopuff",
        domains: ["driver.gopuff.com"],
        dashboardUrl: "https://driver.gopuff.com",
        countries: ["US"],
        enabled: true,
        features: {
            earningsExtraction: true,
            dateRangeExtraction: true,
            autoDetectPage: true,
            logoInPdf: true
        },
    },

    deliveroo: {
        name: "Deliveroo",
        domains: ["deliveroo.co.uk", "deliveroo.fr", "riders.deliveroo.com"],
        dashboardUrl: "https://riders.deliveroo.com",
        countries: ["UK", "EU"],
        enabled: true,
        features: {
            earningsExtraction: true,
            dateRangeExtraction: true,
            autoDetectPage: true,
            logoInPdf: true
        },
    },

    justeat: {
        name: "Just Eat",
        domains: ["couriers.just-eat.com"],
        dashboardUrl: "https://couriers.just-eat.com",
        countries: ["UK", "EU"],
        enabled: true,
        features: {
            earningsExtraction: true,
            dateRangeExtraction: true,
            autoDetectPage: true,
            logoInPdf: true
        },
    },

    // TEST MODE PLATFORM
    test: {
        name: "Test Platform",
        domains: ["test-page.html"],
        countries: ["Global"],
        enabled: true,
        features: {
            earningsExtraction: true,
            dateRangeExtraction: true,
            autoDetectPage: true,
            logoInPdf: false
        }
    }
};

// Helper to detect current platform from URL
function detectPlatform(url) {
    for (const key in PLATFORMS) {
        const platform = PLATFORMS[key];
        if (platform.domains.some(domain => url.includes(domain))) {
            return { key, ...platform }; // Return the config object
        }
    }
    return null;
}
