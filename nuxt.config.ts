import tailwindcss from "@tailwindcss/vite";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
// https://nuxt.com/docs/api/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-10',
    css: ['~/assets/css/main.css'],
    devtools: { enabled: true },
    ssr: false,
    app: {
      baseURL: process.env.NODE_ENV === 'production' ? '/captain/' : '/',
      head: {
        title: 'Captain - Modern Release Management Dashboard',
        meta: [
          { charset: 'utf-8' },
          { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          { hid: 'description', name: 'description', content: 'Modern Nuxt 3 dashboard to manage releases, status, and deployed versions of multiple applications across environments. Open source and extensible.' },
          { name: 'theme-color', content: '#3b82f6' },
          { property: 'og:title', content: 'Captain - Modern Release Management Dashboard' },
          { property: 'og:description', content: 'Modern Nuxt 3 dashboard to manage releases, status, and deployed versions of multiple applications across environments. Open source and extensible.' },
          { property: 'og:type', content: 'website' },
          { property: 'og:url', content: 'https://ludoo0d0a.github.io/captain/' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: 'Captain - Modern Release Management Dashboard' },
          { name: 'twitter:description', content: 'Modern Nuxt 3 dashboard to manage releases, status, and deployed versions of multiple applications across environments. Open source and extensible.' }
        ],
        link: [
          { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
          { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
          { rel: 'canonical', href: 'https://ludoo0d0a.github.io/captain/' }
        ]
      }
    },
    vite: {
      plugins: [
        tailwindcss(),
      ],
    },
    nitro: {
      prerender: {
        routes: [
          '/', 
          '/applications', 
          '/environments', 
          '/connectors', 
          '/features', 
          '/deploy',
          '/promote',
          '/manage-applications',
          '/manage-environments'
        ]
      }
    },
    modules: [
      '@pinia/nuxt',
      '@nuxt/icon'
    ],
    // Generate static site for GitHub Pages
    generate: {
      fallback: true
    }
  })