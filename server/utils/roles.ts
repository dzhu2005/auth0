import type { H3Event } from 'h3'

/**
 * Server-only auth guards for API routes, built on `getUserRoles()` /
 * `ROLES_CLAIM` from `shared/utils/roles.ts`.
 */

/** Requires a signed-in session; throws 401 otherwise. */
export async function requireAuth(event: H3Event) {
  const session = await useAuth0(event).getSession()

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  return session
}

/** Requires a signed-in user carrying `role`; throws 401/403 otherwise. */
export async function requireRole(event: H3Event, role: string) {
  const user = await useAuth0(event).getUser()

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  if (!getUserRoles(user).includes(role)) {
    throw createError({ statusCode: 403, statusMessage: `Forbidden: missing role '${role}'` })
  }

  return user
}
