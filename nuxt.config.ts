import { loadAppConfiguration } from './config/load-app-configuration'

// https://nuxt.com/docs/api/configuration/nuxt-config
//
// `defineNuxtConfig` itself is just an identity function typed to accept a
// plain config object, not a factory — the async-factory-as-default-export
// support (awaited, then treated as the config) comes from Nuxt's underlying
// config loader (c12), so the function is exported directly here and
// `defineNuxtConfig` is only used inside it, to type-check the object it
// resolves to.
export default async function () {
  // @auth0/auth0-nuxt reads its credentials from `runtimeConfig.auth0` once,
  // when its own Nitro plugin boots — there's no later point at which it
  // re-reads them (mutating `runtimeConfig` afterwards doesn't work: Nuxt
  // freezes the resolved config, and even unfrozen, the module's plugin runs
  // and validates before any of our own server plugins get a chance to set
  // it). So this loads the same app configuration used everywhere else (AWS
  // Secrets Manager / configurations.local.json) here, synchronously with
  // config resolution, before Nitro ever starts.
  const { auth0, session } = await loadAppConfiguration({
    awsSecretId: process.env.NUXT_AWS_SECRET_ID,
    awsRegion: process.env.NUXT_AWS_REGION
  })
  const { origin: appBaseUrl } = new URL(auth0.callback_url)

  return defineNuxtConfig({
    modules: [
      '@nuxt/eslint',
      '@nuxt/ui',
      '@pinia/nuxt',
      '@nuxtjs/i18n',
      '@nuxt/image',
      '@nuxt/icon',
      '@vueuse/nuxt',
      '@auth0/auth0-nuxt'
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
      awsRegion: '',
      auth0: {
        domain: auth0.domain,
        clientId: auth0.client_id,
        clientSecret: auth0.client_secret,
        // NOT passed as `audience`: the configured value ("http://localhost:3000")
        // isn't a registered API/Resource Server on this tenant yet — Auth0
        // rejects the authorize request with "Service not found" when it's
        // sent. Roles don't need it (they come from the ID token via
        // shared/utils/roles.ts); wire it back in once a real API exists.
        appBaseUrl,
        sessionSecret: session.password
      }
    },

    compatibilityDate: '2026-06-30',

    // The callback path must match the "Allowed Callback URL" configured on the
    // Auth0 application (see auth0.callback_url in the app configuration) —
    // its origin becomes `runtimeConfig.auth0.appBaseUrl` above.
    auth0: {
      routes: {
        callback: new URL(auth0.callback_url).pathname
      }
    },
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
}
