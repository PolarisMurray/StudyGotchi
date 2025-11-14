# Build Instructions

## Prerequisites

1. Install Node.js and npm
2. Install dependencies:
   ```bash
   npm install
   ```

## Building the Extension

### Development Build

```bash
npm run dev
```

This will start Vite in development mode with hot reloading.

### Production Build

```bash
npm run build
```

This will:
1. Compile Svelte components
2. Bundle all JavaScript files
3. Output to the `dist/` directory

### Live2D Library

The `live2d/live2d.min.js` file is currently a placeholder. To get the actual Live2D library:

1. Clone the live2d-widget repository:
   ```bash
   git clone https://github.com/stevenjoezhang/live2d-widget.git
   cd live2d-widget
   npm install
   npm run build
   ```

2. Copy the built file:
   ```bash
   cp dist/live2d.min.js ../StudyGotchi-3/live2d/live2d.min.js
   ```

Alternatively, you can download a pre-built version or use a CDN.

## Loading the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist/` directory (after building) or the project root (for development)

## Project Structure After Build

```
dist/
├── popup.html
├── popup.js
├── popup.css
├── background.js
├── timer.js
├── gotchi-state.js
└── assets/
    └── icons/
```

The `live2d/` directory should be copied to `dist/` during the build process, or you can manually copy it.

