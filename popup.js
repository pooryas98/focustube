document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleShorts');

  chrome.storage.sync.get('shortsHidden', (data) => {
    toggleButton.textContent = data.shortsHidden ? 'Show Shorts' : 'Hide Shorts';
  });

  toggleButton.addEventListener('click', () => {
    chrome.storage.sync.get('shortsHidden', (data) => {
      const newState = !data.shortsHidden;
      chrome.storage.sync.set({ shortsHidden: newState }, () => {
        toggleButton.textContent = newState ? 'Show Shorts' : 'Hide Shorts';
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleShorts', hidden: newState });
        });
      });
    });
  });
});