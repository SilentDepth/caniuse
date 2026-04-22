// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-04-22',

  devtools: {
    enabled: true,
  },

  modules: ['@nuxt/ui', '@nuxt/hints', '@nuxt/a11y', '@vueuse/nuxt'],

  css: ['~/assets/css/main.css'],
})
