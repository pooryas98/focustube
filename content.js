const hideShorts = () => {
  const shortsElements = document.querySelectorAll('ytd-rich-shelf-renderer[is-shorts], ytd-reel-shelf-renderer');
  shortsElements.forEach(element => {
    element.style.display = 'none';
  });

  const shortsLinks = document.querySelectorAll('a[href^="/shorts/"]');
  shortsLinks.forEach(link => {
    const parentElement = link.closest('ytd-grid-video-renderer') || link.closest('ytd-rich-item-renderer');
    if (parentElement) {
      parentElement.style.display = 'none';
    }
  });
};

// Initial run
hideShorts();

// Use a MutationObserver to handle dynamically loaded content
const observer = new MutationObserver(hideShorts);
observer.observe(document.body, { childList: true, subtree: true });