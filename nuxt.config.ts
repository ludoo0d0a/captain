import tailwindcss from "@tailwindcss/vite";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
// https://nuxt.com/docs/api/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-10',
    css: ['~/assets/css/main.css'],
    devtools: { enabled: true },
    vite: {
      plugins: [
        tailwindcss(),
      ],
    },
    hub: {
      database: true,
    },
    nitro: {
      experimental: {
        // Enable Server API documentation within NuxtHub
        openAPI: true
      }
    },
    modules: [
      '@pinia/nuxt', 
      '@nuxthub/core'
    ],
  })