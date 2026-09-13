// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@nuxt/icon',
    '@vueuse/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Server-only: set via NUXT_AWS_SECRET_ID / NUXT_AWS_REGION.
    // When awsSecretId is set (dev/production, running on ECS), configuration is
    // fetched from AWS Secrets Manager using the task role. Otherwise (local
    // development), it's read from configurations.local.json at the project root.
    awsSecretId: '',
    awsRegion: ''
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-06-30',
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    defaultLocale: 'en'
  }

})
