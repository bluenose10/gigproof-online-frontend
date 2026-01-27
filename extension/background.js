chrome.runtime.onMessageExternal.addListener(
    (request, sender, sendResponse) => {
        if (request.type === 'GIGPROOF_AUTH') {
            chrome.storage.local.set({
                supabaseSession: request.session,
                userEmail: request.session?.user?.email
            }, () => {
                console.log('GigProof: Auth session saved in extension storage');
                sendResponse({ success: true });
            });
            return true; // Keep channel open for async callback
        }
    }
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'syncAuth') {
        chrome.storage.local.set({
            supabaseSession: request.session,
            userEmail: request.session?.user?.email
        }, () => {
            sendResponse({ success: true });
        });
        return true;
    }

    if (request.action === 'checkAuth') {
        chrome.storage.local.get(['supabaseSession'], (result) => {
            sendResponse({ authenticated: !!result.supabaseSession });
        });
        return true;
    }
});
