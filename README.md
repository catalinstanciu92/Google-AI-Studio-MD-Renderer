# Google AI Studio MD Renderer

A Chrome extension that renders markdown output from Google AI Studio, converting plain pre-formatted text to properly styled HTML.

## Features

- **Google AI Studio integration**: Specifically designed to render markdown output from Google AI Studio
- **Auto-detection**: Scans for `section.chunk-editor-main` containing divs with class `.very-large-text-container`
- **Markdown rendering**: Converts markdown syntax to styled HTML
- **Smart filtering**: Only renders unrendered content (flagged with `cs-markdown-rendered`)
- **Toggle control**: Enable/disable the renderer via browser action popup
- **Periodic check**: Scans every 5 seconds for new AI response content

## Supported Markdown Syntax

- Headers: `#`, `##`, `###`
- Bold: `**text**` or `__text__`
- Italic: `*text*` or `_text_`
- Strikethrough: `~~text~~`
- Code blocks: ` ```code``` `
- Inline code: `` `code` ``
- Links: `[text](url)`
- Lists: `- item` or `1. item`
- Blockquotes: `> text`
- Horizontal rules: `---`

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `extension` folder from this repository

## Configuration

### Changing the Target Selector

Edit `content.js` to change which elements are monitored:

```javascript
// Current: looks for divs with class 'very-large-text-container'
const divs = section.querySelectorAll('div.very-large-text-container:not(.cs-markdown-rendered)');

// Example: target all divs without specific class
const divs = section.querySelectorAll('div:not(.cs-markdown-rendered)');

// Example: target specific element type
const divs = section.querySelectorAll('p.content-area:not(.cs-markdown-rendered)');
```

### Adjusting Scan Interval

Modify the 5000ms interval in `content.js`:

```javascript
// Check every 10 seconds instead of 5
intervalId = setInterval(renderMarkdown, 10000);
```

## Files

- `manifest.json` - Extension configuration (Manifest V3)
- `content.js` - Main logic for markdown detection and rendering
- `popup.html` - UI for the browser action toggle
- `popup.js` - Toggle state management
- `style.css` - Styling for rendered markdown elements

## Development

1. Make changes to the source files
2. Reload the extension in `chrome://extensions/` (click refresh icon)
3. Test on target pages
4. Check browser console for debug logs (prefixed with `[Google AI Studio MD Renderer]`)

## Debugging

Open DevTools (F12) on any page and check the Console for:
- `[Google AI Studio MD Renderer] Extension loaded` - Extension initialized
- `[Google AI Studio MD Renderer] Found sections: X` - Target sections detected
- `[Google AI Studio MD Renderer] Section X: Found Y unrendered divs` - Content found
- `[Google AI Studio MD Renderer] Successfully rendered div Z` - Content rendered

## License

MIT
