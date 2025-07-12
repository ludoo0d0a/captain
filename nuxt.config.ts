import tailwindcss from "@tailwindcss/vite";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
// https://nuxt.com/docs/api/nuxt-config
const isStatic = process.env.NUXT_STATIC === 'true'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-10',
    css: ['~/assets/css/main.css'],
    devtools: { enabled: true },
    ssr: true,
    app: {
      baseURL: '/captain/',
      head: {
        link: [
          { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
          { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
      }
    },
    vite: {
      plugins: [
        tailwindcss(),
      ],
    },
    ...(isStatic ? {} : {
      hub: {
        database: true,
      },
    }),
    nitro: {
      experimental: {
        // Enable Server API documentation within NuxtHub
        openAPI: true
      },
      prerender: {
        routes: ['/']
      }
    },
    modules: [
      '@pinia/nuxt', 
      ...(isStatic ? [] : ['@nuxthub/core']),
      '@nuxt/icon'
    ],
  })