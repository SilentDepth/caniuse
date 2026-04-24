// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-04-22',

  devtools: {
    enabled: true,
  },

  colorMode: {
    preference: 'system',
  },

  modules: ['@nuxt/ui', '@nuxt/hints', '@nuxt/a11y', '@vueuse/nuxt'],

  css: ['~/assets/css/main.css'],

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes('/node_modules/') &&
              (id.includes('/nuxt/') ||
                id.includes('/vue/') ||
                id.includes('/@vue/') ||
                id.includes('/@vueuse/') ||
                id.includes('/@unhead/'))
            ) {
              return 'framework'
            }
          },
        },
      },
    },
  },
})
