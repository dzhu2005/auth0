import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager'
import type { AppConfiguration } from '../shared/types/app-configuration'

async function readFromSecretsManager(secretId: string, region?: string): Promise<AppConfiguration> {
  // No explicit credentials: in dev/production this runs on ECS, where the AWS SDK
  // picks up the task role automatically via the container credentials provider.
  const client = new SecretsManagerClient(region ? { region } : {})
  const response = await client.send(new GetSecretValueCommand({ SecretId: secretId }))

  if (!response.SecretString) {
    throw new Error(`AWS Secrets Manager secret "${secretId}" has no SecretString value`)
  }

  return JSON.parse(response.SecretString) as AppConfiguration
}

async function readFromLocalFile(): Promise<AppConfiguration> {
  const path = resolve(process.cwd(), 'configurations.local.json')

  try {
    const raw = await readFile(path, 'utf-8')
    return JSON.parse(raw) as AppConfiguration
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(
        `Local configuration file not found at "${path}". Create it for local development, `
        + 'or set NUXT_AWS_SECRET_ID to load configuration from AWS Secrets Manager instead.',
        { cause: error }
      )
    }
    throw error
  }
}

/**
 * Loads the app's configuration/secrets, framework-agnostic (no Nitro/Nuxt
 * auto-imports) so it can be called both from `server/utils/app-configuration.ts`
 * (via `useRuntimeConfig()`, at request time) and from `nuxt.config.ts` itself
 * (via `process.env`, at config-resolution time — see its `auth0` block, which
 * needs real values before the Nitro server / `@auth0/auth0-nuxt` boot up).
 *
 * - When `awsSecretId` is set (dev/production, running on ECS), configuration
 *   is fetched from AWS Secrets Manager using the task's IAM role.
 * - Otherwise (local development), configuration is read from `configurations.local.json`
 *   at the project root (gitignored).
 */
export function loadAppConfiguration(options: { awsSecretId?: string, awsRegion?: string }): Promise<AppConfiguration> {
  return options.awsSecretId
    ? readFromSecretsManager(options.awsSecretId, options.awsRegion || undefined)
    : readFromLocalFile()
}
