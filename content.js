const setShortsVisible = (visible) => {
  document.body.classList.toggle('hide-shorts', !visible);
};

chrome.storage.sync.get({ shortsHidden: true }, (data) => {
  setShortsVisible(!data.shortsHidden);
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.shortsHidden) {
    setShortsVisible(!changes.shortsHidden.newValue);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleShorts') {
    setShortsVisible(request.hidden);
    sendResponse({ success: true });
  }
  return true;
});