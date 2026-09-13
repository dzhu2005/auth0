// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/i18n'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // AWS Secrets Manager secret holding the app configuration JSON. Only
    // read on ECS (dev/production) - see server/utils/appConfig.ts.
    secretsManager: {
      secretId: '', // NUXT_SECRETS_MANAGER_SECRET_ID
      region: 'us-east-1' // NUXT_SECRETS_MANAGER_REGION
    }
  },

  routeRules: {
    '/': { prerender: true }
  },

  // Must match the Callback/Logout/Web Origin URLs configured on the Auth0
  // application (http://localhost:8080/) - see app/plugins/auth0.client.ts.
  devServer: {
    port: 3000
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
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' }
    ]
  }
})
