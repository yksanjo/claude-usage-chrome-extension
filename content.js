// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchUsage') {
    fetchUsageFromPage()
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }
});

// Fetch usage data from the current Claude.ai page
async function fetchUsageFromPage() {
  // Wait for page to be fully loaded
  await waitForPageLoad();

  // Try different methods to extract usage data
  const usageData =
    tryExtractFromUsagePage() ||
    tryExtractFromAPI() ||
    tryExtractFromDOM();

  if (!usageData) {
    throw new Error('Could not find usage data on this page. Please navigate to claude.ai/settings/usage');
  }

  return usageData;
}

// Wait for page to be fully loaded
function waitForPageLoad() {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      setTimeout(resolve, 500); // Small delay to ensure dynamic content loads
    } else {
      window.addEventListener('load', () => {
        setTimeout(resolve, 500);
      });
    }
  });
}

// Method 1: Extract from usage/settings page structure
function tryExtractFromUsagePage() {
  try {
    // Look for usage text patterns like "45 of 100 messages used"
    const bodyText = document.body.innerText;

    // Pattern 1: "X of Y messages used"
    const pattern1 = /(\d+)\s+of\s+(\d+)\s+messages/i;
    const match1 = bodyText.match(pattern1);
    if (match1) {
      return {
        messagesUsed: parseInt(match1[1]),
        messagesLimit: parseInt(match1[2])
      };
    }

    // Pattern 2: "X / Y messages"
    const pattern2 = /(\d+)\s*\/\s*(\d+)\s+messages/i;
    const match2 = bodyText.match(pattern2);
    if (match2) {
      return {
        messagesUsed: parseInt(match2[1]),
        messagesLimit: parseInt(match2[2])
      };
    }

    // Pattern 3: Look for numbers near "usage" or "limit"
    const usageSection = findUsageSection();
    if (usageSection) {
      const numbers = extractNumbersFromElement(usageSection);
      if (numbers.length >= 2) {
        return {
          messagesUsed: numbers[0],
          messagesLimit: numbers[1]
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error in tryExtractFromUsagePage:', error);
    return null;
  }
}

// Find the section containing usage information
function findUsageSection() {
  // Look for elements containing keywords
  const keywords = ['usage', 'messages', 'limit', 'monthly'];
  const allElements = document.querySelectorAll('div, section, article, p, span');

  for (const el of allElements) {
    const text = el.textContent.toLowerCase();
    if (keywords.some(keyword => text.includes(keyword)) && text.includes('message')) {
      return el;
    }
  }

  return null;
}

// Extract numbers from an element
function extractNumbersFromElement(element) {
  const text = element.textContent;
  const numbers = text.match(/\d+/g);
  return numbers ? numbers.map(n => parseInt(n)) : [];
}

// Method 2: Try to extract from API calls (if available)
function tryExtractFromAPI() {
  // This would require intercepting API calls
  // For now, we'll return null and rely on DOM parsing
  return null;
}

// Method 3: Generic DOM extraction
function tryExtractFromDOM() {
  try {
    // Look for any numeric patterns in the page
    const allText = document.body.innerText;

    // Search for patterns that might indicate usage
    const patterns = [
      /messages?\s*used[:\s]*(\d+)/i,
      /(\d+)\s*messages?\s*used/i,
      /usage[:\s]*(\d+)\s*\/\s*(\d+)/i,
      /limit[:\s]*(\d+)/i
    ];

    for (const pattern of patterns) {
      const match = allText.match(pattern);
      if (match) {
        // Found something, but might need more context
        console.log('Found potential usage data:', match);
      }
    }

    return null;
  } catch (error) {
    console.error('Error in tryExtractFromDOM:', error);
    return null;
  }
}

// Auto-fetch and update when on usage page
function autoUpdateIfOnUsagePage() {
  if (window.location.pathname.includes('settings') ||
      window.location.pathname.includes('usage')) {

    setTimeout(() => {
      fetchUsageFromPage()
        .then(data => {
          // Store in chrome.storage
          const usageData = {
            ...data,
            lastUpdated: new Date().toISOString()
          };
          chrome.storage.local.set({ usageData });
          console.log('Auto-updated usage data:', usageData);
        })
        .catch(error => {
          console.log('Could not auto-update:', error.message);
        });
    }, 2000); // Wait 2 seconds for page to fully load
  }
}

// Run auto-update check
autoUpdateIfOnUsagePage();

// Listen for URL changes (for SPAs like Claude.ai)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    autoUpdateIfOnUsagePage();
  }
}).observe(document, { subtree: true, childList: true });
