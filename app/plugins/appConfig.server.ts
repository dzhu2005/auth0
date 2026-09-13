import { getAppConfig } from '~~/server/utils/appConfig'

/**
 * Populates useAppConfiguration() during SSR. The `.server.ts` suffix keeps
 * this - and everything it imports, including the AWS SDK and file-system
 * access in server/utils/appConfig.ts - out of the client bundle entirely.
 *
 * The value then reaches the browser only as part of that page's normal
 * SSR hydration payload, the same way any other server-fetched page data
 * does - never through a dedicated, independently-fetchable route.
 */
export default defineNuxtPlugin(async () => {
  const appConfig = useAppConfiguration()
  appConfig.value = await getAppConfig()
})
