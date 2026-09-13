export interface Auth0AppConfiguration {
  domain: string
  client_id: string
  client_secret: string
  audience: string
  callback_url: string
}

export interface SessionAppConfiguration {
  password: string
}

/**
 * Shape of the app's runtime secrets, sourced from AWS Secrets Manager
 * (dev/production) or `configurations.local.json` (local development).
 */
export interface AppConfiguration {
  auth0: Auth0AppConfiguration
  session: SessionAppConfiguration
}
