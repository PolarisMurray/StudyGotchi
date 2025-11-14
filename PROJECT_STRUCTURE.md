# Project Structure

```
StudyGotchi-3/
│
├── manifest.json              # Chrome extension manifest (Manifest V3)
├── package.json               # Node.js dependencies and scripts
├── vite.config.js            # Vite build configuration
├── svelte.config.js           # Svelte configuration
├── .gitignore                 # Git ignore rules
│
├── src/                       # Source files
│   ├── popup.html            # Popup HTML entry point
│   ├── popup.js              # Popup JavaScript entry (imports Svelte app)
│   ├── popup.svelte          # Main popup UI component (Svelte)
│   ├── popup.css             # Global popup styles
│   ├── background.js         # Background service worker
│   ├── timer.js              # Timer functionality module
│   └── gotchi-state.js       # Character state management module
│
├── live2d/                    # Live2D widget files
│   ├── autoload.js           # Live2D autoloader script
│   ├── waifu.css             # Live2D widget styles
│   ├── waifu-tips.json       # Live2D tips/triggers configuration
│   └── live2d.min.js         # Live2D library (placeholder - needs to be built)
│
└── assets/                    # Static assets
    ├── icons/                 # Extension icons
    │   ├── icon16.png        # 16x16 icon (needs to be created)
    │   ├── icon48.png        # 48x48 icon (needs to be created)
    │   └── icon128.png       # 128x128 icon (needs to be created)
    └── models/                # Live2D model files
        └── (model directories) # Each model in its own directory
```

## File Descriptions

### Core Extension Files

- **manifest.json**: Chrome extension configuration file. Defines permissions, background script, popup, and icons.

- **src/popup.svelte**: Main UI component built with Svelte. Displays:
  - Live2D character widget
  - Timer display and controls
  - Study statistics (streak, total time)
  - Character level and mood

- **src/popup.js**: Entry point that initializes the Svelte app in the popup.

- **src/background.js**: Background service worker that:
  - Handles timer updates
  - Manages study session completion
  - Updates character state (level, streak, experience)
  - Sends notifications for achievements
  - Monitors streak maintenance

- **src/timer.js**: Timer module with:
  - Start/pause/reset functionality
  - Persistent state (saved to Chrome storage)
  - Listener pattern for reactive updates
  - Session completion handling

- **src/gotchi-state.js**: Character state management:
  - Level and experience tracking
  - Streak calculation
  - Mood calculation based on progress
  - Persistent state management

### Live2D Integration

- **live2d/autoload.js**: Automatically loads Live2D widget and dependencies
- **live2d/waifu.css**: Styles for the Live2D widget container
- **live2d/waifu-tips.json**: Configuration for tips and interactions
- **live2d/live2d.min.js**: Live2D library (currently placeholder - needs to be built from [live2d-widget](https://github.com/stevenjoezhang/live2d-widget))

### Build Output

After running `npm run build`, files are output to `dist/` directory:
- Compiled and bundled JavaScript
- Processed HTML and CSS
- Copied manifest.json, background.js, and live2d files
- Assets directory (icons, models)

## Next Steps

1. **Create extension icons**: Add 16x16, 48x48, and 128x128 PNG icons to `assets/icons/`
2. **Build Live2D library**: Follow instructions in `BUILD.md` to get `live2d.min.js`
3. **Add Live2D models**: Place model files in `assets/models/` (see README in that directory)
4. **Install dependencies**: Run `npm install`
5. **Build extension**: Run `npm run build`
6. **Load in Chrome**: Load the `dist/` directory as an unpacked extension

