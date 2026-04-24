const kvNamespaceId = import.meta.env.KV_NAMESPACE_ID

if (import.meta.env.PROD && !kvNamespaceId) {
  throw new Error('KV_NAMESPACE_ID is required to generate the Cloudflare KV binding.')
}

export default defineNuxtConfig({
  compatibilityDate: '2026-04-22',

  devtools: {
    enabled: true,
  },

  colorMode: {
    preference: 'system',
  },

  modules: ['@nuxt/ui', '@nuxt/hints', '@nuxt/a11y', '@nuxt/eslint', '@vueuse/nuxt'],

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

  nitro: {
    preset: 'cloudflare_module',
    experimental: {
      tasks: true,
    },
    storage: {
      kv: {
        driver: 'cloudflare-kv-binding',
        binding: 'KV',
      },
    },
    devStorage: {
      kv: {
        driver: 'memory',
      },
    },
    scheduledTasks: {
      '0 0 * * *': ['web-features:update'],
    },
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        kv_namespaces: [
          {
            binding: 'KV',
            id: kvNamespaceId,
          },
        ],
        triggers: {
          crons: ['0 0 * * *'],
        },
      },
    },
  },
})
