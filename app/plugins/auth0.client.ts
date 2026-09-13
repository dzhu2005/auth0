import { createAuth0 } from '@auth0/auth0-vue'

/**
 * Auth0 is set up client-side only: this is a server-rendered Nuxt app, and
 * the Auth0 SPA SDK relies on browser APIs (window, localStorage) that
 * aren't available during SSR. `.client.ts` keeps it out of the server
 * bundle entirely.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const appConfig = useAppConfiguration()

  if (!appConfig.value) {
    throw new Error(
      'App configuration is not available. It should have been loaded during SSR by app/plugins/appConfig.server.ts.'
    )
  }

  nuxtApp.vueApp.use(
    createAuth0({
      domain: appConfig.value.auth0.domain,
      clientId: appConfig.value.auth0.client_id,
      authorizationParams: {
        redirect_uri: window.location.origin,
        // Requests a JWT access token (carrying RBAC permissions) for our
        // own API instead of an opaque /userinfo-only token - required for
        // server/api/admin/* routes to verify the caller's role.
        audience: appConfig.value.auth0.audience
      }
    })
  )
})
