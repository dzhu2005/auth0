export default defineNitroPlugin(async () => {
  const { awsSecretId } = useRuntimeConfig()

  try {
    await useAppConfiguration()
    console.log(
      awsSecretId
        ? `[config] Loaded application configuration from AWS Secrets Manager (${awsSecretId})`
        : '[config] Loaded application configuration from configurations.local.json'
    )
  } catch (error) {
    console.error('[config] Failed to load application configuration:', error)
    throw error
  }
})
