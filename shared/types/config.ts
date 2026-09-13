/**
 * Shape of the JSON configuration document sourced from AWS Secrets Manager
 * (in ECS environments) or `configurations.local.json` (for local
 * development). See `server/utils/appConfig.ts` for the loader and
 * `app/composables/useAppConfiguration.ts` for app-side access.
 */
export interface AppConfiguration {
  auth0: {
    domain: string
    client_id: string
    /**
     * Identifier of the custom Auth0 API this app requests access tokens
     * for, so that they're JWTs carrying RBAC permissions (rather than
     * opaque tokens for the default /userinfo audience). Must match an API
     * created in the Auth0 dashboard that this client is authorized for.
     * See server/utils/auth.ts.
     */
    audience: string
  }
}
