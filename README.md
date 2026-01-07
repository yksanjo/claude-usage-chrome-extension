# Claude Usage Tracker - Chrome Extension

A Chrome extension to track your Claude.ai usage right from your browser toolbar. Works on any platform (Windows, Mac, Linux) and all Chromium-based browsers (Chrome, Edge, Brave, Arc).

## Features

- **Auto-Fetch Usage**: Automatically scrapes your usage from claude.ai
- **Real-Time Display**: Shows usage percentage in the extension popup
- **Color-Coded Badge**: Extension icon badge changes color based on usage (green → orange → red)
- **Manual Entry**: Option to manually input usage data
- **Persistent Storage**: Remembers your usage data
- **Cross-Platform**: Works on any OS with Chrome/Chromium browsers

## Installation

### Method 1: Load Unpacked Extension (Recommended for now)

1. **Download/Clone this repository**
   ```bash
   git clone https://github.com/yksanjo/claude-usage-chrome-extension.git
   cd claude-usage-chrome-extension
   ```

2. **Add Icons** (Required before loading)
   - Create three icon files in the `icons/` folder:
     - `icon16.png` (16x16 pixels)
     - `icon48.png` (48x48 pixels)
     - `icon128.png` (128x128 pixels)
   - You can use any image editor or online tool to create these
   - Suggested design: Claude logo or a simple chart/graph icon

3. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Or click the puzzle icon → "Manage Extensions"

4. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

5. **Load the Extension**
   - Click "Load unpacked"
   - Select the `claude-usage-chrome-extension` folder
   - The extension should now appear in your extensions list

6. **Pin the Extension** (Optional but recommended)
   - Click the puzzle icon in Chrome toolbar
   - Find "Claude Usage Tracker"
   - Click the pin icon to keep it visible in toolbar

### Method 2: Chrome Web Store (Coming Soon)

Once published, you'll be able to install directly from the Chrome Web Store.

## How to Use

### Auto-Fetch Usage

1. **Navigate to Claude.ai**
   - Go to [claude.ai/settings/usage](https://claude.ai/settings/usage)
   - Make sure you're logged in

2. **Click the Extension Icon**
   - Click "Claude Usage Tracker" in your toolbar
   - Click **"Auto-Fetch from Claude.ai"** button

3. **Usage Updates**
   - The extension will scrape your usage data
   - Your stats will be displayed in the popup
   - The icon badge will show your usage percentage

### Manual Entry

If auto-fetch doesn't work or you prefer manual updates:

1. **Open the Extension**
   - Click the extension icon

2. **Click "Manual Entry"**
   - Enter your messages used
   - Enter your monthly limit
   - Click "Save"

3. **Your Data is Stored**
   - The extension remembers your data
   - Updates persist across browser sessions

## Understanding the Display

### Color Coding

- **Green (0-69%)**: Healthy usage, plenty of messages remaining
- **Orange (70-89%)**: Getting high, monitor your usage
- **Red (90-100%)**: Nearly exhausted, use sparingly

### Badge

The extension icon shows a colored badge with your usage percentage:
- Example: A green "45%" badge means you've used 45% of your monthly limit

## Troubleshooting

### "Could not find usage data on this page"

- **Solution**: Make sure you're on `claude.ai/settings/usage`
- Click "Open Claude.ai Usage" button in the extension to go there directly

### Auto-fetch not working

- **Try manual entry** as a workaround
- Make sure you're logged into Claude.ai
- Refresh the usage page and try again
- Check browser console for errors (F12 → Console tab)

### Extension not appearing

- Make sure you loaded the extension correctly
- Check that icons are added to the `icons/` folder
- Reload the extension: Go to `chrome://extensions/` → Click reload icon

### Data not persisting

- Check that Chrome has storage permissions
- Try manually saving data again

## Privacy & Security

- **All data is stored locally** in your browser (Chrome's local storage)
- **No data is sent to any server** (except when you visit Claude.ai)
- **No tracking or analytics**
- **Open source** - you can review all the code

## Browser Compatibility

Tested and working on:
- Google Chrome (v120+)
- Microsoft Edge (v120+)
- Brave Browser
- Arc Browser
- Any Chromium-based browser with Manifest V3 support

## Development

### File Structure

```
claude-usage-chrome-extension/
├── manifest.json        # Extension configuration
├── popup.html          # Popup UI
├── popup.js            # Popup logic
├── styles.css          # Popup styles
├── content.js          # Content script (scrapes Claude.ai)
├── background.js       # Background service worker
├── icons/              # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

### Making Changes

1. Edit the relevant files
2. Go to `chrome://extensions/`
3. Click the reload icon on the extension card
4. Test your changes

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Known Issues

- Auto-fetch relies on DOM scraping, which may break if Claude.ai changes their UI
- Some users may need to use manual entry if the page structure changes
- Badge percentage may not update until you open the popup

## Roadmap

- [ ] Publish to Chrome Web Store
- [ ] Add API integration (when Anthropic provides usage API endpoint)
- [ ] Usage history and trends
- [ ] Notifications when approaching limit
- [ ] Support for multiple Claude accounts
- [ ] Firefox extension version

## License

MIT License - Feel free to use, modify, and distribute

## Support

- **Issues**: [GitHub Issues](https://github.com/yksanjo/claude-usage-chrome-extension/issues)
- **Questions**: Open a discussion on GitHub

---

Built with ❤️ for the Claude community
