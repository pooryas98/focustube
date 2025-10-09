/**
 * Enhanced YouTube Shorts Hider Popup Script
 * Provides advanced functionality and improved user experience
 */

class ShortsHiderPopup {
  constructor() {
    this.elements = {
      toggleButton: document.getElementById('toggleShorts'),
      buttonText: document.getElementById('buttonText'),
      buttonIcon: document.getElementById('buttonIcon'),
      statusIndicator: document.getElementById('statusIndicator'),
      currentStatus: document.getElementById('currentStatus'),
      hiddenCount: document.getElementById('hiddenCount'),
      autoHide: document.getElementById('autoHide'),
      showNotifications: document.getElementById('showNotifications'),
      refreshPage: document.getElementById('refreshPage')
    };

    this.state = {
      isHiding: true,
      hiddenElementsCount: 0,
      isLoading: true
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadSettings();
    this.updateUI();
    this.startStatsMonitoring();
  }

  setupEventListeners() {
    // Main toggle button
    this.elements.toggleButton.addEventListener('click', () => {
      this.toggleShorts();
    });

    // Options checkboxes
    this.elements.autoHide.addEventListener('change', (e) => {
      this.saveSetting('autoHide', e.target.checked);
    });

    this.elements.showNotifications.addEventListener('change', (e) => {
      this.saveSetting('showNotifications', e.target.checked);
    });

    // Refresh button
    this.elements.refreshPage.addEventListener('click', () => {
      this.refreshYouTubePage();
    });
  }

  async loadSettings() {
    try {
      const data = await this.getStorageData(['shortsHidden', 'autoHide', 'showNotifications']);

      this.state.isHiding = data.shortsHidden !== false; // Default to true
      this.elements.autoHide.checked = data.autoHide !== false; // Default to true
      this.elements.showNotifications.checked = data.showNotifications !== false; // Default to true

      this.state.isLoading = false;
      this.updateUI();
    } catch (error) {
      console.error('Error loading settings:', error);
      this.showNotification('Error loading settings', 'error');
    }
  }

  async toggleShorts() {
    try {
      this.state.isHiding = !this.state.isHiding;

      // Save to storage
      await this.setStorageData({ shortsHidden: this.state.isHiding });

      // Update UI immediately for better UX
      this.updateUI();

      // Send message to content script
      const tabs = await this.getActiveYouTubeTabs();
      if (tabs.length > 0) {
        await this.sendMessageToTabs(tabs, {
          action: 'toggleShorts',
          hidden: this.state.isHiding
        });
      }

      // Show notification if enabled
      if (this.elements.showNotifications.checked) {
        this.showNotification(
          `Shorts ${this.state.isHiding ? 'hidden' : 'shown'}`,
          'success'
        );
      }

    } catch (error) {
      console.error('Error toggling shorts:', error);
      this.showNotification('Error toggling shorts', 'error');
      // Revert state on error
      this.state.isHiding = !this.state.isHiding;
      this.updateUI();
    }
  }

  updateUI() {
    if (this.state.isLoading) {
      this.elements.buttonText.textContent = 'Loading...';
      this.elements.currentStatus.textContent = 'Loading...';
      return;
    }

    // Update button
    this.elements.buttonText.textContent = this.state.isHiding ? 'Show Shorts' : 'Hide Shorts';
    this.elements.buttonIcon.textContent = this.state.isHiding ? '▶' : '⏸';

    // Update status
    this.elements.currentStatus.textContent = this.state.isHiding ? 'Active' : 'Inactive';
    this.elements.currentStatus.className = `stat-value ${this.state.isHiding ? 'active' : 'inactive'}`;

    // Update status indicator
    this.elements.statusIndicator.className = `status-indicator ${this.state.isHiding ? '' : 'inactive'}`;

    // Update hidden count
    this.elements.hiddenCount.textContent = this.state.hiddenElementsCount;

    // Update button style
    this.elements.toggleButton.className = `toggle-button ${this.state.isHiding ? 'hiding' : 'showing'}`;
  }

  startStatsMonitoring() {
    // Update stats every 2 seconds
    setInterval(async () => {
      try {
        const tabs = await this.getActiveYouTubeTabs();
        if (tabs.length > 0) {
          const response = await this.sendMessageToTabs(tabs, { action: 'getStats' });
          if (response && response.count !== undefined) {
            this.state.hiddenElementsCount = response.count;
            this.elements.hiddenCount.textContent = this.state.hiddenElementsCount;
          }
        }
      } catch (error) {
        // Silently handle errors for stats
      }
    }, 2000);
  }

  async refreshYouTubePage() {
    try {
      const tabs = await this.getActiveYouTubeTabs();
      if (tabs.length > 0) {
        await chrome.tabs.reload(tabs[0].id);
        this.showNotification('YouTube page refreshed', 'success');
      } else {
        this.showNotification('No active YouTube tab found', 'warning');
      }
    } catch (error) {
      console.error('Error refreshing page:', error);
      this.showNotification('Error refreshing page', 'error');
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '10px',
      right: '10px',
      padding: '10px 15px',
      borderRadius: '5px',
      color: 'white',
      fontSize: '12px',
      fontWeight: '500',
      zIndex: '1000',
      opacity: '0',
      transform: 'translateY(-10px)',
      transition: 'all 0.3s ease'
    });

    // Set background color based on type
    const colors = {
      success: '#28a745',
      error: '#dc3545',
      warning: '#ffc107',
      info: '#007bff'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Utility methods for Chrome API promisification
  getStorageData(keys) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(keys, (data) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(data);
        }
      });
    });
  }

  setStorageData(data) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set(data, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  getActiveYouTubeTabs() {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const youtubeTabs = tabs.filter(tab =>
          tab.url && tab.url.includes('youtube.com')
        );
        resolve(youtubeTabs);
      });
    });
  }

  sendMessageToTabs(tabs, message) {
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
        resolve(response);
      });
    });
  }

  saveSetting(key, value) {
    const data = { [key]: value };
    chrome.storage.sync.set(data);
  }
}

// Initialize the popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ShortsHiderPopup();
});
