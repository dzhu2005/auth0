import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager'

let configurationPromise: Promise<AppConfiguration> | undefined

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

    configurationPromise = awsSecretId
      ? readFromSecretsManager(awsSecretId, awsRegion || undefined)
      : readFromLocalFile()

    // Don't cache a failed load — let the next caller retry instead of being stuck forever.
    configurationPromise.catch(() => {
      configurationPromise = undefined
    })
  }

  return configurationPromise
}
