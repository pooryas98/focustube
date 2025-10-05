# YouTube Shorts Hider - Chrome Extension

This is a simple, lightweight Chrome extension designed to hide YouTube Shorts from your feed, promoting a more focused browsing experience on YouTube.

## Features

*   **Hides Shorts Shelves:** Automatically removes the dedicated "Shorts" shelves from the YouTube homepage and other sections.
*   **Removes Individual Shorts:** Hides individual Shorts videos that might appear interspersed within your regular video feed (e.g., subscriptions, recommended).
*   **Dynamic Content Handling:** Utilizes a `MutationObserver` to detect and hide Shorts that load dynamically as you scroll.
*   **Persistent Settings:** Remembers your preference to hide or show Shorts using Chrome's storage API.
*   **Manual Override Button:** When Shorts are hidden, a small "Show Hidden Shorts" button appears on the page, allowing you to temporarily reveal them.
*   **Easy Toggle:** Control the visibility of Shorts directly from the extension's popup icon in the browser toolbar.

## Installation (Developer Mode)

To install this extension from the source code:

1.  **Obtain the Code:** Download the extension files (manifest.json, content.js, popup.html, popup.js, popup.css, icons folder) and place them in a single folder on your computer.
2.  **Open Chrome Extensions:** Open Google Chrome and navigate to `chrome://extensions`.
3.  **Enable Developer Mode:** Toggle the "Developer mode" switch located in the top-right corner of the extensions page.
4.  **Load the Extension:** Click the "Load unpacked" button and select the folder containing the extension files.

The extension icon will now appear in your browser toolbar, and the Shorts hiding functionality will be active on YouTube pages.

## How It Works

*   **Content Script (`content.js`):** This script runs automatically on `https://www.youtube.com/*` pages. It identifies HTML elements associated with YouTube Shorts (using CSS selectors targeting specific YouTube component tags and links starting with `/shorts/`) and sets their CSS `display` property to `none`.
*   **Popup Interface (`popup.html`, `popup.js`, `popup.css`):** Provides a simple user interface (a button) to toggle the `shortsHidden` preference. When clicked, it saves the new state using `chrome.storage.sync` and sends a message to the content script to update the page immediately.
*   **Storage (`chrome.storage.sync`):** Stores the user's preference (`true` for hidden, `false` for shown) so it persists across browser sessions and tabs.
*   **Messaging:** The extension uses `chrome.runtime.onMessage` and `chrome.tabs.sendMessage` to communicate between the popup and the content script, triggering the visual updates on the page.
*   **MutationObserver:** Monitors the page's DOM for changes (new content loading). When new elements are added, the content script re-runs its hiding logic to ensure any newly loaded Shorts are also hidden.

## Contributing

This is a basic extension, but contributions are welcome! If you find bugs or have suggestions for improvements (e.g., more granular hiding options, different UI), feel free to open an issue or submit a pull request.