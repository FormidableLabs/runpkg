import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      // registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      workbox: {
        swDest: 'workbox.fuck.js',
      },
      injectManifest: {
        swSrc: 'src/sw.js',
        swDest: 'dist/sw.js',
      },
    }),
    // viteStaticCopy({
    //   targets: [
    //     {
    //       src: 'src/utils/parseUrl.js',
    //       dest: 'utils',
    //     },
    //   ],
    // }),
    // react(),
  ],
});
