# YouTube Shorts Hider

An enhanced, feature-rich Chrome extension to hide YouTube Shorts for a cleaner, more focused browsing experience.

## ✨ Features

### Core Functionality
- **🛡️ Advanced Hiding:** Robust CSS selectors that work across different YouTube page layouts
- **⚡ Real-time Processing:** Uses MutationObserver to hide Shorts as they load dynamically
- **📊 Live Statistics:** Real-time counter showing how many Shorts are currently hidden
- **🔄 Smart Refresh:** Refresh YouTube pages directly from the extension popup

### Enhanced User Experience
- **🎨 Modern UI:** Beautiful, responsive popup interface with smooth animations
- **📱 Visual Feedback:** Status indicators and notifications for better user feedback
- **⚙️ Customizable Options:** Toggle auto-hide and notification preferences
- **🎯 Precise Control:** Enhanced toggle system with immediate visual feedback

### Performance & Reliability
- **🚀 Performance Optimized:** Reduced layout thrashing and memory-efficient element tracking
- **🛠️ Error Handling:** Comprehensive error handling and graceful degradation
- **🔧 Auto-cleanup:** Automatic cleanup of detached DOM elements to prevent memory leaks
- **📈 Robust Selectors:** Multiple fallback selectors to handle YouTube's changing DOM structure

## 🚀 Installation

### From the Chrome Web Store (Recommended)
*(Coming Soon!)*

### Manual Installation (for Developers)

1. **Download the Code:** Clone or download the project files to your computer
2. **Open Chrome Extensions:** Navigate to `chrome://extensions`
3. **Enable Developer Mode:** Toggle "Developer mode" in the top-right corner
4. **Load the Extension:** Click "Load unpacked" and select the project folder

## 📖 Usage

### Basic Usage
1. Click the extension icon in your Chrome toolbar
2. Use the main toggle button to show/hide YouTube Shorts
3. The extension works automatically across all YouTube pages

### Advanced Features
- **Statistics Panel:** View real-time count of hidden Shorts
- **Options Menu:** Customize auto-hide and notification settings
- **Refresh Button:** Quickly refresh YouTube pages when needed
- **Status Indicator:** Visual confirmation of the extension's current state

## 🔧 How It Works

The extension uses multiple sophisticated techniques:

1. **CSS Selectors:** Comprehensive selectors target various Shorts elements across YouTube's DOM
2. **MutationObserver:** Monitors DOM changes to catch dynamically loaded content
3. **Element Tracking:** Maintains a Set of hidden elements for efficient management
4. **Performance Optimization:** Uses hardware acceleration and efficient DOM manipulation

## 📋 Technical Details

### Architecture
- **Content Script:** Handles DOM manipulation and real-time hiding
- **Popup Interface:** Provides user controls and displays statistics
- **Background Service:** Manages extension lifecycle and settings
- **CSS Styling:** Enhanced selectors with performance optimizations

### Browser Compatibility
- **Chrome:** Full support (Manifest V3)
- **Edge:** Compatible (Chromium-based)
- **Opera:** Compatible (Chromium-based)
- **Firefox:** Not supported (Manifest V3 not fully supported)

## 🔒 Privacy & Security

- **No Data Collection:** Extension doesn't collect or transmit personal data
- **Local Storage Only:** All settings stored locally using Chrome's sync storage
- **Minimal Permissions:** Only requests necessary permissions for core functionality
- **Open Source:** Code is publicly available for security review

## 🛠️ Development

### Project Structure
```
├── manifest.json      # Extension configuration
├── background.js      # Background service worker
├── content.js         # Main content script
├── popup.html         # Popup interface
├── popup.js           # Popup functionality
├── popup.css          # Popup styling
├── hider.css          # YouTube page styling
├── icons/             # Extension icons
└── README.md          # Documentation
```

### Key Improvements in v1.2
- ✅ Enhanced CSS selectors for better reliability
- ✅ Modern, responsive popup UI with animations
- ✅ Real-time statistics and monitoring
- ✅ Advanced error handling and performance optimizations
- ✅ Improved DOM manipulation with MutationObserver
- ✅ Memory leak prevention with automatic cleanup
- ✅ Better user feedback with notifications
- ✅ Comprehensive documentation updates

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Bug Reports:** Open an issue with detailed reproduction steps
2. **Feature Requests:** Suggest new features or improvements
3. **Code Contributions:** Submit pull requests with improvements
4. **Testing:** Help test across different YouTube layouts and scenarios

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Extension not working on some pages:**
- Ensure you're on a YouTube page (youtube.com)
- Try refreshing the page
- Check if Shorts are in a new format not covered by current selectors

**High memory usage:**
- The extension includes automatic cleanup that runs every 30 seconds
- If issues persist, try restarting your browser

**Popup not showing:**
- Ensure the extension is properly loaded in `chrome://extensions`
- Try reloading the extension

### Getting Help
- Check the browser console for error messages
- Open an issue on GitHub with:
  - Browser version
  - Extension version
  - Steps to reproduce the issue
  - Screenshots if applicable

---

**Made with ❤️ for a cleaner YouTube experience**
