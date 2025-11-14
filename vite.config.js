import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export default defineConfig({
  plugins: [
    svelte(),
    {
      name: 'copy-files',
      closeBundle() {
        // Copy manifest.json
        if (existsSync('manifest.json')) {
          copyFileSync('manifest.json', 'dist/manifest.json');
        }
        
        // Copy background.js
        if (existsSync('src/background.js')) {
          copyFileSync('src/background.js', 'dist/background.js');
        }
        
        // Copy timer.js and gotchi-state.js
        if (existsSync('src/timer.js')) {
          copyFileSync('src/timer.js', 'dist/timer.js');
        }
        if (existsSync('src/gotchi-state.js')) {
          copyFileSync('src/gotchi-state.js', 'dist/gotchi-state.js');
        }
        
        // Copy live2d directory
        const live2dSrc = 'live2d';
        const live2dDest = 'dist/live2d';
        if (existsSync(live2dSrc)) {
          if (!existsSync(live2dDest)) {
            mkdirSync(live2dDest, { recursive: true });
          }
          ['autoload.js', 'waifu.css', 'waifu-tips.json', 'live2d.min.js'].forEach(file => {
            const srcPath = join(live2dSrc, file);
            const destPath = join(live2dDest, file);
            if (existsSync(srcPath)) {
              copyFileSync(srcPath, destPath);
            }
          });
        }
        
        // Copy assets directory
        const assetsSrc = 'assets';
        const assetsDest = 'dist/assets';
        if (existsSync(assetsSrc)) {
          if (!existsSync(assetsDest)) {
            mkdirSync(assetsDest, { recursive: true });
          }
          // This is a simple copy - for production, use a proper copy plugin
          console.log('Note: Please manually copy assets/ directory to dist/assets/ or use a copy plugin');
        }
      }
    }
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'src/popup.html'
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
});

