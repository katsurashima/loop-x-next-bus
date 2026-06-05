import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages project site is served from https://<user>.github.io/<repo>/,
// so the build must use the repo name as the base path.
export default defineConfig({
  base: '/loop-x-next-bus/',
  plugins: [
    VitePWA({
      // The service worker updates itself whenever a new build is deployed.
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'LOOP-X 無料シャトルバス',
        short_name: 'LOOP-X バス',
        description: '田町駅 ⇔ LOOP-X 無料シャトルバスの次のバスまでの待ち時間。',
        lang: 'ja',
        dir: 'ltr',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/loop-x-next-bus/',
        scope: '/loop-x-next-bus/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache the built shell + assets so the app works fully offline.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
})
