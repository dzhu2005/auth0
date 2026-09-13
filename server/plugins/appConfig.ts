export default defineNitroPlugin(async () => {
  // Load and cache the app configuration once at startup so misconfiguration
  // (missing secret, bad JSON, no ECS task role, ...) fails fast instead of
  // surfacing on the first request that needs it.
  await getAppConfig()

  console.log(
    `[app-config] loaded from ${isAppConfigSourcedFromSecretsManager() ? 'AWS Secrets Manager' : 'configurations.local.json'}`
  )
})
