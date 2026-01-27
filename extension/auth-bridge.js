window.__gigproofBridgeLoaded = true;
console.log('GigProof Bridge: Auth bridge loaded');

const deliverStoredReport = () => {
    chrome.storage.local.get(['extractedData'], (result) => {
        if (!result.extractedData) return;
        try {
            localStorage.setItem('pendingReport', JSON.stringify(result.extractedData));
        } catch (error) {
            console.warn('GigProof Bridge: Failed to persist stored report', error);
        }
        window.postMessage({
            type: 'GIGPROOF_REPORT_DATA',
            data: result.extractedData
        }, '*');
    });
};

deliverStoredReport();

window.addEventListener('message', (event) => {
    // Only accept messages from the same window
    if (event.source !== window) return;

    if (event.data.type === 'GIGPROOF_AUTH_SYNC') {
        console.log('GigProof Bridge: Syncing auth with extension...');
        chrome.runtime.sendMessage({
            action: 'syncAuth',
            session: event.data.session
        }, (response) => {
            console.log('GigProof Bridge: Auth synced:', response);
        });
    }

    if (event.data.type === 'GIGPROOF_REQUEST_REPORT') {
        deliverStoredReport();
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'deliverReportData') {
        try {
            localStorage.setItem('pendingReport', JSON.stringify(message.data));
        } catch (error) {
            console.warn('GigProof Bridge: Failed to persist report data', error);
        }
        window.postMessage({
            type: 'GIGPROOF_REPORT_DATA',
            data: message.data
        }, '*');
        chrome.storage.local.set({ extractedData: message.data });
        sendResponse({ success: true });
    }
});
