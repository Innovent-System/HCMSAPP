import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel'
import path from 'node:path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()]
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'touchicon.png'],

      manifest: {
        name: 'HrNova',
        short_name: 'HrNova',
        description: 'HR Management System',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/touchicon.png', sizes: '192x192', type: 'image/png' },
          { src: '/touchicon.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' }
        ]
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/index.html',
        // runtimeCaching: [
        //   {
        //     urlPattern: /^https:\/\/.*\.hrnova\.com\/api\//,
        //     handler: 'NetworkFirst',
        //     options: {
        //       cacheName: 'api-cache',
        //       expiration: {
        //         maxEntries: 50,
        //         maxAgeSeconds: 300
        //       }
        //     }
        //   }
        // ]
      },

      devOptions: {
        enabled: true
      }
    })
  ],

  build: {
    rollupOptions: {
      external: [
        "./node_modules/@mui/base/ModalUnstyled",
        "./node_modules/@mui/base/PopperUnstyled"
      ]
    }
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})