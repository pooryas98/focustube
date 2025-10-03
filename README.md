# YouTube Shorts Hider - Chrome Extension

This is a simple, lightweight Chrome extension that hides YouTube Shorts from your feed, allowing for a more focused browsing experience.

## Features

- Hides the "Shorts" shelf on the YouTube homepage.
- Removes individual Shorts videos from your subscriptions and other feeds.
- Works automatically in the background.

## Installation

You can install this extension in two ways:

### 1. Install from Source (Developer Mode)

1.  **Download:** Download the repository as a ZIP file and unzip it, or clone the repository to your local machine.
2.  **Open Chrome Extensions:** Open Google Chrome and navigate to `chrome://extensions`.
3.  **Enable Developer Mode:** Turn on the "Developer mode" toggle in the top-right corner.
4.  **Load the Extension:** Click on the "Load unpacked" button and select the folder where you saved the extension files.

The extension will now be active.

## How It Works

This extension uses a content script (`content.js`) that runs on all YouTube pages. The script identifies and hides elements related to YouTube Shorts. It uses a `MutationObserver` to watch for new content being loaded dynamically (e.g., when you scroll down) and hides any new Shorts that appear.

## Contributing

Feel free to open an issue or submit a pull request if you have any suggestions or find any bugs.