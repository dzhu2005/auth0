import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager'
import type { AppConfiguration } from '#shared/types/config'

const LOCAL_CONFIG_FILE = 'configurations.local.json'

/**
 * ECS injects this env var into every task's containers so they can reach
 * the metadata endpoint. Its presence is a reliable signal that we're
 * running on ECS (dev or production) with a task role attached, as opposed
 * to a developer's own machine.
 */
function isRunningOnEcs() {
  return Boolean(
    process.env.ECS_CONTAINER_METADATA_URI_V4 || process.env.ECS_CONTAINER_METADATA_URI
  )
}

async function loadFromLocalFile(): Promise<AppConfiguration> {
  const path = resolve(process.cwd(), LOCAL_CONFIG_FILE)

  let raw: string
  try {
    raw = await readFile(path, 'utf-8')
  } catch (error) {
    throw new Error(
      `Could not read local configuration file at "${path}". Create it (see ${LOCAL_CONFIG_FILE}.example if present) for local development.`,
      { cause: error }
    )
  }

  return JSON.parse(raw) as AppConfiguration
}

async function loadFromSecretsManager(): Promise<AppConfiguration> {
  const { secretsManager } = useRuntimeConfig()

  if (!secretsManager.secretId) {
    throw new Error(
      'NUXT_SECRETS_MANAGER_SECRET_ID is not set. It must point to the AWS Secrets Manager secret holding the app configuration.'
    )
  }

  // No explicit credentials: on ECS the default provider chain picks up the
  // task role automatically via AWS_CONTAINER_CREDENTIALS_RELATIVE_URI.
  const client = new SecretsManagerClient({ region: secretsManager.region })
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: secretsManager.secretId })
  )

  if (!response.SecretString) {
    throw new Error(`Secret "${secretsManager.secretId}" does not contain a string value.`)
  }

  return JSON.parse(response.SecretString) as AppConfiguration
}

let configPromise: Promise<AppConfiguration> | undefined

/**
 * Loads the app configuration once and caches it for the lifetime of the
 * server process:
 * - On ECS (dev and production), from AWS Secrets Manager via the task role.
 * - Everywhere else (local development), from `configurations.local.json`.
 */
export function getAppConfig(): Promise<AppConfiguration> {
  if (!configPromise) {
    configPromise = (isRunningOnEcs() ? loadFromSecretsManager() : loadFromLocalFile()).catch(
      (error: unknown) => {
        // Allow a subsequent call (e.g. a later request) to retry instead of
        // permanently caching a failure.
        configPromise = undefined
        throw error
      }
    )
  }

  return configPromise
}

export function isAppConfigSourcedFromSecretsManager() {
  return isRunningOnEcs()
}
