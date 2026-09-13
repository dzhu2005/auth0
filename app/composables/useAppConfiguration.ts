import type { AppConfiguration } from '#shared/types/config'

/**
 * The app configuration (from AWS Secrets Manager on ECS, or
 * `configurations.local.json` locally - see `server/utils/appConfig.ts`),
 * loaded server-side only by `app/plugins/appConfig.server.ts` and carried
 * to the client as part of the normal SSR hydration payload.
 *
 * There is no API route serving this - it's never independently fetchable
 * over the network, only ever embedded in a page the app itself renders.
 */
export function useAppConfiguration() {
  return useState<AppConfiguration | null>('app-config', () => null)
}
