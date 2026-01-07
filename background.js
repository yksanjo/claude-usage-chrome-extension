// Background service worker for Claude Usage Tracker

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Claude Usage Tracker installed!');
    // Open welcome page or settings on first install
    chrome.tabs.create({ url: 'https://claude.ai/settings/usage' });
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateBadge') {
    updateBadge(request.percentage);
    sendResponse({ success: true });
  }
  return true;
});

// Update extension badge with usage percentage
function updateBadge(percentage) {
  if (typeof percentage !== 'number' || isNaN(percentage)) {
    chrome.action.setBadgeText({ text: '' });
    return;
  }

  // Set badge text
  const badgeText = `${Math.round(percentage)}%`;
  chrome.action.setBadgeText({ text: badgeText });

  // Set badge color based on percentage
  let color;
  if (percentage >= 90) {
    color = '#ef4444'; // Red
  } else if (percentage >= 70) {
    color = '#f59e0b'; // Orange
  } else {
    color = '#10b981'; // Green
  }

  chrome.action.setBadgeBackgroundColor({ color });
}

// Listen for storage changes and update badge
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.usageData) {
    const newData = changes.usageData.newValue;
    if (newData && newData.messagesUsed !== undefined && newData.messagesLimit) {
      const percentage = (newData.messagesUsed / newData.messagesLimit) * 100;
      updateBadge(percentage);
    }
  }
});

// Initialize badge on startup
chrome.storage.local.get(['usageData'], (data) => {
  if (data.usageData) {
    const { messagesUsed, messagesLimit } = data.usageData;
    if (messagesLimit > 0) {
      const percentage = (messagesUsed / messagesLimit) * 100;
      updateBadge(percentage);
    }
  }
});
