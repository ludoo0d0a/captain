<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">C</span>
              </div>
              <span class="ml-2 text-xl font-bold text-gray-900">Captain</span>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <a href="#features" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Features</a>
              <a href="#demo" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Demo</a>
              <a href="#tech" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Tech Stack</a>
              <a href="https://github.com/ludoo0d0a/captain" target="_blank" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">GitHub</a>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button @click="navigateTo('/applications')" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
              Try Captain
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <div class="mb-8">
            <div class="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
              <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Open Source & Extensible
            </div>
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Modern Release Management
            <span class="block text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Captain is a modern Nuxt 3 dashboard to manage releases, status, and deployed versions of multiple applications across environments. Similar to Cloudfresh, but open and extensible.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button @click="navigateTo('/applications')" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
              Launch Dashboard
            </button>
            <a href="https://github.com/ludoo0d0a/captain" target="_blank" class="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all border border-gray-200 shadow-lg">
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p class="text-xl text-gray-600">Everything you need to manage your releases and deployments</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl hover:shadow-lg transition-all transform hover:scale-105">
            <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Environment-Centric Dashboard</h3>
            <p class="text-gray-600">Manage multiple applications across different environments with a unified interface.</p>
          </div>
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl hover:shadow-lg transition-all transform hover:scale-105">
            <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Version Deployment</h3>
            <p class="text-gray-600">Deploy and promote versions between environments with confidence and control.</p>
          </div>
          <div class="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl hover:shadow-lg transition-all transform hover:scale-105">
            <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Smart Tagging</h3>
            <p class="text-gray-600">Multi-tag, color-coded system with quick filtering across all features.</p>
          </div>
          <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl hover:shadow-lg transition-all transform hover:scale-105">
            <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Unified Connectors</h3>
            <p class="text-gray-600">Integrate with GitHub Actions, Jenkins, SSH, HTTP, XL Deploy, and more.</p>
          </div>
          <div class="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl hover:shadow-lg transition-all transform hover:scale-105">
            <div class="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Extensible Settings</h3>
            <p class="text-gray-600">Configure connectors, credentials, and endpoints with a user-friendly interface.</p>
          </div>
          <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-xl hover:shadow-lg transition-all transform hover:scale-105">
            <div class="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Modern Responsive UI</h3>
            <p class="text-gray-600">Built with Tailwind CSS, fully responsive and optimized for all devices.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Section -->
    <section id="demo" class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">See It In Action</h2>
          <p class="text-xl text-gray-600">Experience the power of Captain with our live demo</p>
        </div>
        <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white text-center">
            <svg class="w-16 h-16 mx-auto mb-4 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <h3 class="text-2xl font-bold mb-2">Ready to explore?</h3>
            <p class="text-blue-100 mb-6">Jump into the full dashboard experience and see how Captain can streamline your deployment workflow.</p>
            <button @click="navigateTo('/applications')" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all transform hover:scale-105">
              Launch Dashboard
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section id="tech" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Built With Modern Tech</h2>
          <p class="text-xl text-gray-600">Powered by industry-leading technologies</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L22 6v12l-10 6L2 18V6l10-6z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900">Nuxt 3</h3>
            <p class="text-sm text-gray-600">Vue 3 + Vite</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.5 9.51a4.22 4.22 0 0 1-1.91-1.34A5.77 5.77 0 0 0 12 6a4.72 4.72 0 0 0-5 4 3.23 3.23 0 0 1 3.5-1.49 4.32 4.32 0 0 1 1.91 1.35A5.77 5.77 0 0 0 17 12a4.72 4.72 0 0 0 5-4 3.2 3.2 0 0 1-3.5 1.51zm-13 4.98a4.22 4.22 0 0 1 1.91 1.34A5.77 5.77 0 0 0 12 18a4.72 4.72 0 0 0 5-4 3.23 3.23 0 0 1-3.5 1.49 4.32 4.32 0 0 1-1.91-1.35A5.8 5.8 0 0 0 7 12a4.72 4.72 0 0 0-5 4 3.2 3.2 0 0 1 3.5-1.51z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900">Tailwind CSS</h3>
            <p class="text-sm text-gray-600">Utility-first CSS</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900">Pinia</h3>
            <p class="text-sm text-gray-600">State Management</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900">GitHub Actions</h3>
            <p class="text-sm text-gray-600">CI/CD</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Ready to Transform Your Deployments?</h2>
        <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join developers who are already using Captain to streamline their release management workflow.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button @click="navigateTo('/applications')" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all transform hover:scale-105">
            Get Started Now
          </button>
          <a href="https://github.com/ludoo0d0a/captain" target="_blank" class="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-all">
            Star on GitHub
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">C</span>
              </div>
              <span class="ml-2 text-xl font-bold">Captain</span>
            </div>
            <p class="text-gray-400">
              Modern release management dashboard built with Nuxt 3. Open source and extensible.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Resources</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="https://github.com/ludoo0d0a/captain" class="hover:text-white transition-colors">GitHub Repository</a></li>
              <li><a href="https://github.com/ludoo0d0a/captain/issues" class="hover:text-white transition-colors">Issues & Bug Reports</a></li>
              <li><a href="https://github.com/ludoo0d0a/captain/blob/main/README.md" class="hover:text-white transition-colors">Documentation</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Technology</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="https://nuxt.com/" class="hover:text-white transition-colors">Nuxt 3</a></li>
              <li><a href="https://tailwindcss.com/" class="hover:text-white transition-colors">Tailwind CSS</a></li>
              <li><a href="https://pinia.vuejs.org/" class="hover:text-white transition-colors">Pinia</a></li>
              <li><a href="https://github.com/features/actions" class="hover:text-white transition-colors">GitHub Actions</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Captain. Open source under MIT License.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Landing page - no redirect, this is the new homepage
useHead({
  title: 'Captain - Modern Release Management Dashboard',
  meta: [
    { name: 'description', content: 'Modern Nuxt 3 dashboard to manage releases, status, and deployed versions of multiple applications across environments. Open source and extensible.' },
    { property: 'og:title', content: 'Captain - Modern Release Management Dashboard' },
    { property: 'og:description', content: 'Modern Nuxt 3 dashboard to manage releases, status, and deployed versions of multiple applications across environments. Open source and extensible.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Captain - Modern Release Management Dashboard' },
    { name: 'twitter:description', content: 'Modern Nuxt 3 dashboard to manage releases, status, and deployed versions of multiple applications across environments. Open source and extensible.' }
  ]
})

// Define page as landing page layout
definePageMeta({
  layout: false
})
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style> 