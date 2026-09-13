/**
 * Returns the app configuration as JSON - restricted to Auth0 users with
 * the "admin" role (via the "read:admin-config" RBAC permission it grants).
 *
 * Requires an `Authorization: Bearer <access token>` header, where the
 * token was issued for this app's Auth0 API audience (see
 * app/plugins/auth0.client.ts and server/utils/auth.ts).
 */
export default defineEventHandler(async (event) => {
  await requirePermission(event, 'read:admin-config')

  return await getAppConfig()
})
