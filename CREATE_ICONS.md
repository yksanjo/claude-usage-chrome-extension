# How to Create Icons for the Extension

The extension requires three icon files before it can be loaded in Chrome:

## Required Icons

- `icons/icon16.png` - 16x16 pixels
- `icons/icon48.png` - 48x48 pixels
- `icons/icon128.png` - 128x128 pixels

## Option 1: Quick Placeholder Icons

### Using Online Tools (Easiest)

1. Go to [favicon.io/favicon-generator/](https://favicon.io/favicon-generator/)
2. Use these settings:
   - **Text**: "C" or "Claude"
   - **Background**: #2563EB (blue)
   - **Font**: Choose any
   - **Font Color**: #FFFFFF (white)
3. Click "Download"
4. Extract the downloaded ZIP
5. Rename and copy the files:
   - Rename `favicon-16x16.png` → `icon16.png`
   - Rename `favicon-32x32.png` → `icon48.png` (resize to 48x48)
   - Rename `android-chrome-192x192.png` → `icon128.png` (resize to 128x128)
6. Move all three to the `icons/` folder

### Using Figma/Canva/Photoshop

1. Create three square canvases: 16x16, 48x48, 128x128
2. Design a simple icon (e.g., letter "C", chart icon, or Claude logo)
3. Export as PNG
4. Save to `icons/` folder with correct names

## Option 2: Use ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
# Navigate to the extension directory
cd ~/claude-usage-chrome-extension/icons

# Create simple colored icons with "C"
convert -size 128x128 xc:#2563EB -fill white -pointsize 96 -gravity center -annotate +0+0 "C" icon128.png
convert -size 48x48 xc:#2563EB -fill white -pointsize 36 -gravity center -annotate +0+0 "C" icon48.png
convert -size 16x16 xc:#2563EB -fill white -pointsize 12 -gravity center -annotate +0+0 "C" icon16.png
```

## Option 3: Download from Icon Libraries

1. Visit icon libraries:
   - [icons8.com](https://icons8.com)
   - [flaticon.com](https://flaticon.com)
   - [iconmonstr.com](https://iconmonstr.com)

2. Search for: "chart", "analytics", "usage", or "Claude"

3. Download in PNG format at different sizes

4. Rename and save to `icons/` folder

## Option 4: Use the Claude Logo

If you have the official Claude logo:

1. Resize to 128x128, 48x48, and 16x16 pixels
2. Save as PNG with transparency
3. Move to `icons/` folder

## Verify Icons

After creating icons, verify the files exist:

```bash
ls -la ~/claude-usage-chrome-extension/icons/
```

You should see:
```
icon16.png
icon48.png
icon128.png
```

Then you can load the extension in Chrome!

## Recommended Design

For best results:
- **Simple design** that's recognizable at small sizes
- **High contrast** (e.g., white on blue background)
- **Square format** (1:1 aspect ratio)
- **PNG format** with transparency if possible
- **Consistent style** across all three sizes

---

Once icons are created, return to the main README.md for installation instructions.
