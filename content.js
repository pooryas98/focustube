/**
 * Enhanced YouTube Shorts Hider Content Script
 * Provides robust hiding functionality with performance optimizations
 */

class YouTubeShortsHider {
  constructor() {
    this.isHiding = true;
    this.hiddenElements = new Set();
    this.observer = null;
    this.stats = {
      totalHidden: 0,
      lastUpdate: Date.now()
    };

    this.init();
  }

  init() {
    this.loadSettings();
    this.setupObserver();
    this.setupMessageListener();
    this.startPeriodicCleanup();
  }

  async loadSettings() {
    try {
      const data = await this.getStorageData(['shortsHidden', 'autoHide', 'showNotifications']);
      this.isHiding = data.shortsHidden !== false;

      if (this.isHiding) {
        this.hideShorts();
      }

      // Ensure DOM is ready before updating visibility
      if (document.body) {
        this.updatePageVisibility();
      } else {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            this.updatePageVisibility();
          });
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  setupObserver() {
    // Use MutationObserver to watch for dynamically loaded Shorts
    this.observer = new MutationObserver((mutations) => {
      this.handleMutations(mutations);
    });

    // Start observing when DOM is ready
    if (document.body) {
      this.startObserving();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        this.startObserving();
      });
    }
  }

  startObserving() {
    if (this.observer && document.body) {
      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['href', 'class']
      });
    }
  }

  handleMutations(mutations) {
    let shouldUpdate = false;

    mutations.forEach(mutation => {
      // Check for new nodes
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const hiddenCount = this.processElement(node);
            if (hiddenCount > 0) {
              shouldUpdate = true;
            }
          }
        });
      }

      // Check for attribute changes
      if (mutation.type === 'attributes') {
        const element = mutation.target;
        if (this.isShortsElement(element)) {
          this.hideElement(element);
          shouldUpdate = true;
        }
      }
    });

    if (shouldUpdate) {
      this.updateStats();
    }
  }

  processElement(element) {
    let hiddenCount = 0;

    if (this.isHiding) {
      // Hide individual elements
      if (this.isShortsElement(element)) {
        this.hideElement(element);
        hiddenCount++;
      }

      // Process child elements
      const shortsElements = element.querySelectorAll ?
        element.querySelectorAll(this.getShortsSelectors().join(', ')) : [];

      shortsElements.forEach(child => {
        if (this.isShortsElement(child) && !this.hiddenElements.has(child)) {
          this.hideElement(child);
          hiddenCount++;
        }
      });
    }

    return hiddenCount;
  }

  isShortsElement(element) {
    if (!element || !element.tagName) return false;

    try {
      // Must be a specific element type that could contain Shorts
      const validElementNames = ['A', 'YTD-RICH-SHELF-RENDERER', 'YTD-REEL-SHELF-RENDERER', 'YTD-RICH-SECTION-RENDERER', 'YTD-COMPACT-VIDEO-RENDERER', 'YTD-VIDEO-RENDERER', 'YTD-GRID-VIDEO-RENDERER'];

      if (!validElementNames.includes(element.tagName)) {
        return false;
      }

      // Check for specific Shorts indicators
      const isShortsShelf = element.hasAttribute && (
        element.hasAttribute('is-shorts') ||
        element.getAttribute('is-shorts') === ''
      );

      const isShortsLink = element.href && element.href.includes('/shorts/');

      const hasShortsAttribute = element.hasAttribute && element.hasAttribute('data-shorts-shelf');

      const isShortsContainer = element.querySelector && element.querySelector('a[href^="/shorts/"]');

      // Element must have at least one Shorts-specific indicator
      if (isShortsShelf || isShortsLink || hasShortsAttribute || isShortsContainer) {
        return true;
      }

      return false;
    } catch (e) {
      return false;
    }
  }

  getShortsSelectors() {
    return [
      // Primary Shorts containers
      'ytd-rich-shelf-renderer[is-shorts]',
      'ytd-reel-shelf-renderer',
      'ytd-rich-section-renderer:has([is-shorts])',
      '[data-shorts-shelf]',

      // Individual Shorts links (must be exact match)
      'a[href^="/shorts/"][href$="/"]',

      // Shorts within video renderers (more specific)
      'ytd-compact-video-renderer a[href^="/shorts/"]',
      'ytd-video-renderer a[href^="/shorts/"]',
      'ytd-grid-video-renderer a[href^="/shorts/"]',

      // Container elements that contain Shorts (must have Shorts links)
      'ytd-compact-video-renderer:has(a[href^="/shorts/"])',
      'ytd-video-renderer:has(a[href^="/shorts/"])',
      'ytd-grid-video-renderer:has(a[href^="/shorts/"])',

      // Shorts shelf sections
      'ytd-rich-shelf-renderer:has([is-shorts])',
      'ytd-reel-shelf-renderer[is-shorts]'
    ];
  }

  hideElement(element) {
    if (!element || this.hiddenElements.has(element)) return;

    try {
      element.style.display = 'none';
      element.setAttribute('data-shorts-hidden', 'true');
      this.hiddenElements.add(element);
      this.stats.totalHidden++;
    } catch (error) {
      console.warn('Error hiding element:', error);
    }
  }

  hideShorts() {
    // Hide existing Shorts elements
    const selectors = this.getShortsSelectors();
    selectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          this.hideElement(element);
        });
      } catch (error) {
        // Silently handle invalid selectors
      }
    });

    this.updatePageVisibility();
    this.updateStats();
  }

  showShorts() {
    // Show hidden Shorts elements
    this.hiddenElements.forEach(element => {
      try {
        element.style.display = '';
        element.removeAttribute('data-shorts-hidden');
      } catch (error) {
        console.warn('Error showing element:', error);
      }
    });

    this.hiddenElements.clear();
    this.stats.totalHidden = 0;
    this.updatePageVisibility();
  }

  updatePageVisibility() {
    if (document.body) {
      document.body.classList.toggle('hide-shorts', this.isHiding);
    }
  }

  updateStats() {
    this.stats.lastUpdate = Date.now();
    // Stats will be read by popup script
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      try {
        this.handleMessage(request, sendResponse);
      } catch (error) {
        console.error('Error handling message:', error);
        sendResponse({ success: false, error: error.message });
      }
      return true;
    });
  }

  handleMessage(request, sendResponse) {
    switch (request.action) {
      case 'toggleShorts':
        this.isHiding = request.hidden;
        if (this.isHiding) {
          this.hideShorts();
        } else {
          this.showShorts();
        }
        sendResponse({ success: true });
        break;

      case 'getStats':
        sendResponse({
          success: true,
          count: this.stats.totalHidden,
          isHiding: this.isHiding,
          timestamp: this.stats.lastUpdate
        });
        break;

      case 'refresh':
        this.refresh();
        sendResponse({ success: true });
        break;

      default:
        sendResponse({ success: false, error: 'Unknown action' });
    }
  }

  refresh() {
    // Clear hidden elements and reprocess
    this.hiddenElements.clear();
    this.stats.totalHidden = 0;

    if (this.isHiding) {
      this.hideShorts();
    }
  }

  startPeriodicCleanup() {
    // Clean up dead references every 30 seconds
    setInterval(() => {
      this.cleanup();
    }, 30000);
  }

  cleanup() {
    try {
      // Remove references to detached DOM elements
      for (const element of this.hiddenElements) {
        if (!document.body || !document.body.contains(element)) {
          this.hiddenElements.delete(element);
        }
      }

      // Update stats if count changed
      const currentCount = this.hiddenElements.size;
      if (currentCount !== this.stats.totalHidden) {
        this.stats.totalHidden = currentCount;
        this.updateStats();
      }
    } catch (error) {
      console.warn('Error during cleanup:', error);
    }
  }

  // Utility method for Chrome storage
  getStorageData(keys) {
    return new Promise((resolve) => {
      chrome.storage.sync.get(keys, (data) => {
        resolve(data);
      });
    });
  }
}

// Storage change listener for settings updates
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.shortsHidden && window.youtubeShortsHider) {
    const isHiding = !changes.shortsHidden.newValue;
    window.youtubeShortsHider.isHiding = isHiding;

    if (isHiding) {
      window.youtubeShortsHider.hideShorts();
    } else {
      window.youtubeShortsHider.showShorts();
    }
  }
});

// Initialize the hider
if (!window.youtubeShortsHider) {
  window.youtubeShortsHider = new YouTubeShortsHider();
}
