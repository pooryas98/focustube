const applyShortsVisibility = (hidden) => {
  const displayStyle = hidden ? 'none' : '';

  // More comprehensive selector for Shorts containers
  const shortsSelectors = [
    'ytd-rich-shelf-renderer[is-shorts]',
    'ytd-reel-shelf-renderer',
    'ytd-rich-section-renderer:has([is-shorts])',
    '[data-shorts-shelf]'
  ].join(', ');
  
  const shortsElements = document.querySelectorAll(shortsSelectors);
  shortsElements.forEach(element => {
    element.style.display = displayStyle;
  });

  // Handle Shorts links with better parent detection
  const shortsLinks = document.querySelectorAll('a[href^="/shorts/"]');
  shortsLinks.forEach(link => {
    // Try multiple parent selectors to catch different layouts
    const parentSelectors = [
      'ytd-grid-video-renderer',
      'ytd-rich-item-renderer',
      'ytd-video-renderer',
      'ytd-thumbnail'
    ];
    
    let parentElement = null;
    for (const selector of parentSelectors) {
      parentElement = link.closest(selector);
      if (parentElement) break;
    }
    
    if (parentElement) {
      parentElement.style.display = displayStyle;
    }
  });
};

// Debounced storage listener
let debounceTimer;
const debouncedApply = (hidden) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    applyShortsVisibility(hidden);
  }, 100);
};

chrome.storage.sync.get('shortsHidden', (data) => {
  // If the value is not set, default to true (hidden)
  const isHidden = data.shortsHidden === undefined ? true : data.shortsHidden;
  debouncedApply(isHidden);
});

// More efficient observer with throttling
let observerTimeout;
const observer = new MutationObserver((mutations) => {
  if (observerTimeout) return;
  
  observerTimeout = setTimeout(() => {
    chrome.storage.sync.get('shortsHidden', (data) => {
      applyShortsVisibility(data.shortsHidden);
    });
    observerTimeout = null;
  }, 500); // Throttle to once per 500ms
});

observer.observe(document.body, { 
  childList: true, 
  subtree: true 
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleShorts') {
    applyShortsVisibility(request.hidden);
    sendResponse({ success: true }); // Acknowledge message
  }
  return true; // Keep message channel open for async response
});