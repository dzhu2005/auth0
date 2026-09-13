import { loadAppConfiguration } from '../../config/load-app-configuration'

let configurationPromise: Promise<AppConfiguration> | undefined

/**
 * Loads and caches the app's runtime configuration/secrets.
 *
 * - When `NUXT_AWS_SECRET_ID` is set (dev/production, running on ECS), configuration
 *   is fetched from AWS Secrets Manager using the task's IAM role.
 * - Otherwise (local development), configuration is read from `configurations.local.json`
 *   at the project root (gitignored).
 *
 * Server-only — this can contain secrets and must never be exposed to the client.
 */
export function useAppConfiguration(): Promise<AppConfiguration> {
  if (!configurationPromise) {
    const { awsSecretId, awsRegion } = useRuntimeConfig()

    configurationPromise = loadAppConfiguration({ awsSecretId, awsRegion })

    // Don't cache a failed load — let the next caller retry instead of being stuck forever.
    configurationPromise.catch(() => {
      configurationPromise = undefined
    })
  }

  return configurationPromise
}
