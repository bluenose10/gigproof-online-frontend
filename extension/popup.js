// DOM Elements
const extractBtn = document.getElementById('extractBtn');
const generateBtn = document.getElementById('generateBtn');
const statusText = document.getElementById('statusText');
const statusIndicator = document.getElementById('statusIndicator');
const platformInfo = document.getElementById('platformInfo');
const platformName = document.getElementById('platformName');
const dataPreview = document.getElementById('dataPreview');
const loadingOverlay = document.getElementById('loadingOverlay');
const clearBtn = document.getElementById('clearBtn');

// Data storage
let extractedData = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  const { supabaseSession } = await chrome.storage.local.get(['supabaseSession']);
  const sessionExpired = supabaseSession?.expires_at
    ? supabaseSession.expires_at * 1000 <= Date.now()
    : false;
  const hasValidSession = Boolean(
    supabaseSession?.access_token &&
    supabaseSession?.user?.email &&
    !sessionExpired
  );

  if (!hasValidSession) {
    if (supabaseSession) {
      await chrome.storage.local.remove(['supabaseSession', 'userEmail']);
    }
    updateStatus('Login required to extract data', 'warning');
    document.getElementById('authRequiredMsg').style.display = 'block';
    extractBtn.disabled = true;
    return;
  }

  // Check if we're on a supported platform
  // Note: detectPlatform is available because it's loaded in popup.html before this script
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab && tab.url) {
    const platform = detectPlatform(tab.url);

    if (platform) {
      if (platform.enabled) {
        showPlatform(platform.name);
        extractBtn.disabled = false;
      } else {
        // Found platform but disabled (Tier 2/3)
        updateStatus(`${platform.name} support coming soon!`, 'warning');
        extractBtn.disabled = true;
      }
    } else {
      // No platform detected
      updateStatus('Please navigate to a supported driver dashboard', 'info');
      document.getElementById('unsupportedMsg').style.display = 'block';
      extractBtn.disabled = true;
    }
  }

  // Load saved data if exists
  const saved = await chrome.storage.local.get(['extractedData']);
  if (saved.extractedData) {
    extractedData = saved.extractedData;
    showDataPreview(extractedData);
    generateBtn.disabled = false;
    if (clearBtn) {
      clearBtn.disabled = false;
    }
  } else {
    if (clearBtn) {
      clearBtn.disabled = true;
    }
  }
});

// Extract button click
extractBtn.addEventListener('click', async () => {
  try {
    showLoading(true);
    updateStatus('Extracting earnings data...', 'processing');

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Send message to content script
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractData' });

    if (response.success) {
      extractedData = response.data;

      // Save to storage
      await chrome.storage.local.set({ extractedData });

      // Show preview
      showDataPreview(extractedData);
      generateBtn.disabled = false;
      if (clearBtn) {
        clearBtn.disabled = false;
      }
      updateStatus('Data extracted successfully!', 'success');
    } else {
      throw new Error(response.error || 'Failed to extract data');
    }
  } catch (error) {
    console.error('Extract error:', error);
    updateStatus('Error: ' + error.message, 'error');
  } finally {
    showLoading(false);
  }
});

// Login button click
document.getElementById('loginBtn')?.addEventListener('click', () => {
  // PRODUCTION TODO: Replace with production URL (e.g., 'https://gigproof.online/login')
  // For production, create a config file or use environment variable during build
  chrome.tabs.create({ url: `${BASE_URL}/login` });
});

// Generate PDF button click
generateBtn.addEventListener('click', async () => {
  if (!extractedData) {
    updateStatus('No data to generate PDF', 'error');
    return;
  }

  try {
    showLoading(true);
    updateStatus('Opening PDF options...', 'processing');

    const { supabaseSession } = await chrome.storage.local.get(['supabaseSession']);

    if (!supabaseSession) {
      updateStatus('Please log in first', 'warning');
      showLoading(false);
      return;
    }

  // PRODUCTION TODO: Replace with production URL (e.g., 'https://gigproof.online')
    // For production, create a config file or use environment variable during build
  const WEBSITE_URL = BASE_URL;

    await chrome.storage.local.set({ extractedData });

    const downloadUrl = `${WEBSITE_URL}/download`;

    const sendReportDataToTab = (tabId, attempt = 0) => {
      chrome.tabs.sendMessage(tabId, {
        action: 'deliverReportData',
        data: extractedData
      }, (response) => {
        if (chrome.runtime.lastError || !response?.success) {
          if (attempt < 5) {
            setTimeout(() => sendReportDataToTab(tabId, attempt + 1), 500);
          }
        }
      });
    };

    // Open in new tab (not replacing current tab) so user can preview and return
    chrome.tabs.create({ url: downloadUrl, active: true }, (tab) => {
      const onUpdated = (tabId, info) => {
        if (tabId === tab.id && info.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(onUpdated);
          setTimeout(() => sendReportDataToTab(tabId), 300);
        }
      };

      chrome.tabs.onUpdated.addListener(onUpdated);
    });

    updateStatus('PDF options page opened', 'success');
  } catch (error) {
    console.error('Generate error:', error);
    updateStatus('Error: ' + error.message, 'error');
  } finally {
    showLoading(false);
  }
});

// Clear saved report button click
clearBtn?.addEventListener('click', async () => {
  try {
    clearBtn.disabled = true;
    extractedData = null;
    await chrome.storage.local.remove(['extractedData']);
    dataPreview.style.display = 'none';
    generateBtn.disabled = true;
    clearBtn.disabled = true;
    updateStatus('Saved report cleared', 'info');
  } catch (error) {
    console.error('Clear report error:', error);
    updateStatus('Error clearing saved report', 'error');
  } finally {
    clearBtn.disabled = false;
  }
});


// Helper Functions
function showPlatform(platform) {
  platformName.textContent = platform;
  platformInfo.style.display = 'block';
  updateStatus(`Connected to ${platform}`, 'success');
}

function showDataPreview(data) {
  document.getElementById('previewPlatform').textContent = data.platform || '-';
  document.getElementById('previewDateRange').textContent = data.dateRange || '-';
  document.getElementById('previewEarnings').textContent = data.grossEarnings || '-';
  document.getElementById('previewCurrency').textContent = data.currency || '-';
  dataPreview.style.display = 'block';
}

function updateStatus(message, type = 'info') {
  statusText.textContent = message;

  const pulse = statusIndicator.querySelector('.pulse');
  pulse.style.background = getStatusColor(type);
}

function getStatusColor(type) {
  const colors = {
    success: '#4ade80',
    error: '#f87171',
    warning: '#fbbf24',
    processing: '#60a5fa',
    info: '#4ade80'
  };
  return colors[type] || colors.info;
}

function showLoading(show) {
  loadingOverlay.style.display = show ? 'flex' : 'none';
}
