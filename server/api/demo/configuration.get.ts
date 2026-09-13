/**
 * Returns the app's runtime configuration for display purposes.
 *
 * Secret values (client secrets, session password, ...) are masked before
 * leaving the server — `useAppConfiguration()` can hold real credentials
 * and must never be sent to the client as-is.
 */
export default defineEventHandler(async (): Promise<SafeAppConfiguration> => {
  const config = await useAppConfiguration()

  return {
    auth0: {
      domain: config.auth0.domain,
      client_id: config.auth0.client_id,
      client_secret: maskSecret(config.auth0.client_secret),
      audience: config.auth0.audience,
      callback_url: config.auth0.callback_url
    },
    session: {
      password: maskSecret(config.session.password)
    }
  }
})

function maskSecret(value: string): string {
  return value ? '•'.repeat(12) : '(not set)'
}
