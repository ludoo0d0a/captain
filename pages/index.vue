<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <!-- Navigation -->
    <nav class="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">C</span>
            </div>
            <span class="text-xl font-bold text-gray-900">Captain</span>
          </div>
          <div class="flex items-center space-x-4">
            <a href="https://github.com/ludoo0d0a/captain" target="_blank" class="text-gray-600 hover:text-gray-900 transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <button @click="navigateTo('/applications')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Open Dashboard
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Modern Deployment
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Management
            </span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Manage releases, track deployments, and orchestrate versions across multiple environments 
            with Captain's intuitive dashboard. Open, extensible, and built for modern DevOps workflows.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button @click="navigateTo('/applications')" class="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105">
              Try Live Demo
            </button>
            <a href="https://github.com/ludoo0d0a/captain" target="_blank" class="bg-white text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all">
              View on GitHub
            </a>
          </div>
        </div>
      </div>
      
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 -z-10 overflow-hidden">
        <div class="absolute top-20 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div class="absolute top-40 right-1/4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div class="absolute bottom-20 left-1/3 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Modern Deployments
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Captain provides a comprehensive suite of tools to manage your deployment pipeline
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Multi-Environment Management</h3>
            <p class="text-gray-600">Manage applications across development, staging, and production environments with ease.</p>
          </div>
          
          <!-- Feature 2 -->
          <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Version Control & Promotion</h3>
            <p class="text-gray-600">Deploy and promote versions between environments with built-in rollback capabilities.</p>
          </div>
          
          <!-- Feature 3 -->
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Universal Connectors</h3>
            <p class="text-gray-600">Integrate with GitHub Actions, Jenkins, SSH, HTTP APIs, and more through our connector system.</p>
          </div>
          
          <!-- Feature 4 -->
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Real-time Monitoring</h3>
            <p class="text-gray-600">Track deployment status, monitor application health, and get instant notifications.</p>
          </div>
          
          <!-- Feature 5 -->
          <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Smart Tagging & Filtering</h3>
            <p class="text-gray-600">Organize deployments with color-coded tags and powerful filtering capabilities.</p>
          </div>
          
          <!-- Feature 6 -->
          <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Open & Extensible</h3>
            <p class="text-gray-600">Built with modern web technologies and designed to be easily customized and extended.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Built with Modern Technologies
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Captain leverages cutting-edge web technologies for performance and reliability
          </p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm-1.173 18.616L6.239 17.04l-.866 1.5 3.464 2c.866.5 1.961.5 2.827 0l3.464-2-.866-1.5-4.588 1.576z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900">Nuxt 3</h3>
            <p class="text-sm text-gray-600">Vue.js Framework</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900">Tailwind CSS</h3>
            <p class="text-sm text-gray-600">Utility-first CSS</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 13.8h-.568c0 2.016-1.284 3.432-3.36 3.432-1.908 0-3.168-1.224-3.168-2.88 0-.48.12-.912.36-1.296l.36-.48c.24-.24.48-.432.72-.576.24-.144.48-.24.72-.288.24-.048.48-.048.72 0 .24.048.48.144.72.288.24.144.48.336.72.576l.36.48c.24.384.36.816.36 1.296 0 1.656-1.26 2.88-3.168 2.88-2.076 0-3.36-1.416-3.36-3.432h-.568c0 2.496 1.656 4.32 3.928 4.32 2.448 0 4.488-1.416 4.488-4.32z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900">TypeScript</h3>
            <p class="text-sm text-gray-600">Type Safety</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5.017 12s.265-4.736 1.541-4.892c2.099-.144 6.781-.144 8.883 0C16.718 7.264 16.983 8.378 16.983 12s-.265 4.736-1.542 4.892z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900">Pinia</h3>
            <p class="text-sm text-gray-600">State Management</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Streamline Your Deployments?
        </h2>
        <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join developers who are already using Captain to manage their deployment workflows
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button @click="navigateTo('/applications')" class="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
            Try Live Demo
          </button>
          <a href="https://github.com/ludoo0d0a/captain" target="_blank" class="bg-transparent text-white px-8 py-3 rounded-lg text-lg font-semibold border-2 border-white hover:bg-white hover:text-blue-600 transition-all">
            Star on GitHub
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">C</span>
              </div>
              <span class="text-xl font-bold">Captain</span>
            </div>
            <p class="text-gray-400 mb-4">
              Modern deployment management dashboard for DevOps teams. 
              Open source, extensible, and built with modern web technologies.
            </p>
            <div class="flex space-x-4">
              <a href="https://github.com/ludoo0d0a/captain" target="_blank" class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 class="font-semibold mb-4">Product</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" @click="navigateTo('/applications')" class="hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="#" @click="navigateTo('/connectors')" class="hover:text-white transition-colors">Connectors</a></li>
              <li><a href="#" @click="navigateTo('/environments')" class="hover:text-white transition-colors">Environments</a></li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-semibold mb-4">Resources</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="https://github.com/ludoo0d0a/captain" target="_blank" class="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="https://github.com/ludoo0d0a/captain/issues" target="_blank" class="hover:text-white transition-colors">Support</a></li>
              <li><a href="https://github.com/ludoo0d0a/captain/blob/main/README.md" target="_blank" class="hover:text-white transition-colors">Getting Started</a></li>
            </ul>
          </div>
        </div>
        
        <div class="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 Captain. Open source under MIT License.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports'

// SEO Meta tags
useHead({
  title: 'Captain - Modern Deployment Management Dashboard',
  meta: [
    {
      name: 'description',
      content: 'Captain is a modern deployment management dashboard for DevOps teams. Manage releases, track deployments, and orchestrate versions across multiple environments.'
    },
    {
      name: 'keywords',
      content: 'deployment, devops, dashboard, release management, version control, continuous deployment, ci/cd, nuxt, vue'
    },
    {
      property: 'og:title',
      content: 'Captain - Modern Deployment Management Dashboard'
    },
    {
      property: 'og:description',
      content: 'Manage releases, track deployments, and orchestrate versions across multiple environments with Captain\'s intuitive dashboard.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: 'https://ludoo0d0a.github.io/captain/'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: 'Captain - Modern Deployment Management Dashboard'
    },
    {
      name: 'twitter:description',
      content: 'Manage releases, track deployments, and orchestrate versions across multiple environments.'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://ludoo0d0a.github.io/captain/'
    }
  ]
})

// Define the page layout to not use the default app layout
definePageMeta({
  layout: false
})
</script>

<style scoped>
.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.3;
  }
}

.animate-pulse {
  animation: pulse 4s ease-in-out infinite;
}
</style> 