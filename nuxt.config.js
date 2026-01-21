// nuxt.config.js
export default defineNuxtConfig({
  ssr: false,
  nitro: {
    preset: 'static'
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vite-pwa/nuxt'
  ],
  css: [
    '~/assets/css/main.css'
  ],
  app: {
    head: {
       title: 'IronHabit: KB Planner',
       meta: [
         { name: 'description', content: 'Minimalist Kettlebell Training Planner' },
         { name: 'theme-color', content: '#ea580c' }
       ]
    }
  },
  pwa: {
    manifest: {
      name: 'IronHabit Kettlebell Planner',
      short_name: 'IronHabit',
      description: 'The minimalist kettlebell training assistant for guided progress.',
      theme_color: '#ea580c',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
    }
  },
  future: {
    compatibilityVersion: 4
  }
})
