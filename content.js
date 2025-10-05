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

  // Handle the "Show Hidden Shorts" button
  const buttonId = 'show-hidden-shorts-button';
  const existingButton = document.getElementById(buttonId);
  
  if (hidden) {
    if (!existingButton) {
      createShowButton(buttonId);
    } else {
      existingButton.style.display = ''; // Ensure button is visible
    }
  } else {
    if (existingButton) {
      existingButton.remove();
    }
  }
};

// Separate function for button creation
const createShowButton = (buttonId) => {
  const showButton = document.createElement('button');
  showButton.id = buttonId;
  showButton.textContent = 'Show Hidden Shorts';
  showButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    padding: 12px 16px;
    background-color: #ff0000;
    color: white;
    border: none;
    border-radius: 24px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transition: all 0.2s ease;
  `;
  
  showButton.addEventListener('click', () => {
    // Reset all hidden elements
    document.querySelectorAll('[style*="display: none"]').forEach(el => {
      if (el.dataset.wasHiddenByShortsBlocker) {
        el.style.display = '';
        delete el.dataset.wasHiddenByShortsBlocker;
      }
    });
    
    showButton.style.display = 'none';
  });
  
  document.body.appendChild(showButton);
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
  debouncedApply(data.shortsHidden);
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