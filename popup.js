document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleShorts');

  // Get the current state and set the button text
  // Default to true (hidden) if not set
  chrome.storage.sync.get({ shortsHidden: true }, (data) => {
    toggleButton.textContent = data.shortsHidden ? 'Show Shorts' : 'Hide Shorts';
  });

  toggleButton.addEventListener('click', () => {
    // Get the current state, default to true if not set
    chrome.storage.sync.get({ shortsHidden: true }, (data) => {
      const newState = !data.shortsHidden;
      chrome.storage.sync.set({ shortsHidden: newState }, () => {
        toggleButton.textContent = newState ? 'Show Shorts' : 'Hide Shorts';
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          // Ensure a tab is available before sending a message
          if (tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleShorts', hidden: newState });
          }
        });
      });
    });
  });
});