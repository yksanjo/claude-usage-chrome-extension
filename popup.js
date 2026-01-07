// DOM Elements
const messagesUsedEl = document.getElementById('messagesUsed');
const messagesLimitEl = document.getElementById('messagesLimit');
const usagePercentageEl = document.getElementById('usagePercentage');
const progressBarEl = document.getElementById('progressBar');
const lastUpdatedEl = document.getElementById('lastUpdated');
const refreshBtn = document.getElementById('refreshBtn');
const manualBtn = document.getElementById('manualBtn');
const openSettingsBtn = document.getElementById('openSettingsBtn');
const manualInputDiv = document.getElementById('manualInput');
const actionsDiv = document.getElementById('actions');
const statsDiv = document.getElementById('stats');
const inputUsed = document.getElementById('inputUsed');
const inputLimit = document.getElementById('inputLimit');
const saveManualBtn = document.getElementById('saveManual');
const cancelManualBtn = document.getElementById('cancelManual');
const infoMessageEl = document.getElementById('infoMessage');

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  loadUsageData();
  setupEventListeners();
});

// Load usage data from storage
async function loadUsageData() {
  try {
    const data = await chrome.storage.local.get(['usageData']);
    if (data.usageData) {
      updateUI(data.usageData);
    } else {
      showMessage('No usage data yet. Click "Auto-Fetch" or use manual entry.', 'info');
    }
  } catch (error) {
    console.error('Error loading usage data:', error);
    showMessage('Error loading data', 'error');
  }
}

// Update UI with usage data
function updateUI(data) {
  const { messagesUsed, messagesLimit, lastUpdated } = data;

  // Update values
  messagesUsedEl.textContent = messagesUsed || '--';
  messagesLimitEl.textContent = messagesLimit || '--';

  // Calculate percentage
  const percentage = messagesLimit > 0 ? (messagesUsed / messagesLimit) * 100 : 0;
  usagePercentageEl.textContent = `${percentage.toFixed(1)}%`;

  // Update progress bar
  progressBarEl.style.width = `${percentage}%`;
  progressBarEl.className = 'progress-bar';

  if (percentage >= 90) {
    progressBarEl.classList.add('danger');
    usagePercentageEl.style.color = '#ef4444';
  } else if (percentage >= 70) {
    progressBarEl.classList.add('warning');
    usagePercentageEl.style.color = '#f59e0b';
  } else {
    usagePercentageEl.style.color = '#10b981';
  }

  // Update last updated time
  if (lastUpdated) {
    const date = new Date(lastUpdated);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    let timeText;
    if (diffMins < 1) {
      timeText = 'just now';
    } else if (diffMins < 60) {
      timeText = `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else {
      const diffHours = Math.floor(diffMins / 60);
      timeText = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }

    lastUpdatedEl.textContent = `Last updated: ${timeText}`;
  }
}

// Setup event listeners
function setupEventListeners() {
  refreshBtn.addEventListener('click', handleAutoFetch);
  manualBtn.addEventListener('click', showManualInput);
  openSettingsBtn.addEventListener('click', openClaudeSettings);
  saveManualBtn.addEventListener('click', saveManualInput);
  cancelManualBtn.addEventListener('click', hideManualInput);
}

// Auto-fetch usage from Claude.ai
async function handleAutoFetch() {
  try {
    refreshBtn.disabled = true;
    refreshBtn.textContent = 'Fetching...';

    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Check if we're on Claude.ai
    if (!tab.url || !tab.url.includes('claude.ai')) {
      showMessage('Please navigate to claude.ai to auto-fetch usage', 'info');
      openClaudeSettings();
      refreshBtn.disabled = false;
      refreshBtn.innerHTML = `
        <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
        </svg>
        Auto-Fetch from Claude.ai
      `;
      return;
    }

    // Send message to content script
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'fetchUsage' });

    if (response && response.success) {
      const usageData = {
        messagesUsed: response.data.messagesUsed,
        messagesLimit: response.data.messagesLimit,
        lastUpdated: new Date().toISOString()
      };

      await chrome.storage.local.set({ usageData });
      updateUI(usageData);
      showMessage('Usage data updated successfully!', 'success');
    } else {
      showMessage(response?.error || 'Could not fetch usage. Try manual entry.', 'error');
    }
  } catch (error) {
    console.error('Error auto-fetching:', error);
    showMessage('Error fetching data. Try navigating to claude.ai/settings/usage', 'error');
  } finally {
    refreshBtn.disabled = false;
    refreshBtn.innerHTML = `
      <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
      </svg>
      Auto-Fetch from Claude.ai
    `;
  }
}

// Show manual input form
function showManualInput() {
  manualInputDiv.style.display = 'block';
  actionsDiv.style.display = 'none';
  statsDiv.style.display = 'none';

  // Pre-fill with current values
  chrome.storage.local.get(['usageData'], (data) => {
    if (data.usageData) {
      inputUsed.value = data.usageData.messagesUsed || '';
      inputLimit.value = data.usageData.messagesLimit || '';
    }
  });
}

// Hide manual input form
function hideManualInput() {
  manualInputDiv.style.display = 'none';
  actionsDiv.style.display = 'flex';
  statsDiv.style.display = 'block';
}

// Save manual input
async function saveManualInput() {
  const used = parseInt(inputUsed.value);
  const limit = parseInt(inputLimit.value);

  if (isNaN(used) || isNaN(limit) || used < 0 || limit <= 0) {
    showMessage('Please enter valid numbers', 'error');
    return;
  }

  const usageData = {
    messagesUsed: used,
    messagesLimit: limit,
    lastUpdated: new Date().toISOString()
  };

  await chrome.storage.local.set({ usageData });
  updateUI(usageData);
  hideManualInput();
  showMessage('Usage data saved!', 'success');
}

// Open Claude.ai settings page
function openClaudeSettings() {
  chrome.tabs.create({ url: 'https://claude.ai/settings/usage' });
}

// Show message to user
function showMessage(message, type = 'info') {
  infoMessageEl.textContent = message;
  infoMessageEl.className = `info-message ${type}`;
  infoMessageEl.style.display = 'block';

  setTimeout(() => {
    infoMessageEl.style.display = 'none';
  }, 5000);
}
