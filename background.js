chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('shortsHidden', (data) => {
    if (data.shortsHidden === undefined) {
      chrome.storage.sync.set({ shortsHidden: true });
    }
  });
});
