/**
 * Namespaced custom claim Auth0 adds the user's roles under.
 *
 * Auth0 doesn't include RBAC roles in the ID/access token by default — a
 * Post-Login Action on the tenant must add them under this claim. Until that
 * Action exists, `getUserRoles()` always returns `[]`.
 *
 * Matching Action code (Auth0 Dashboard → Actions → Library → Post Login):
 *
 * ```js
 * exports.onExecutePostLogin = async (event, api) => {
 *   const roles = event.authorization?.roles ?? []
 *   api.idToken.setCustomClaim('https://axiominnovations.com/roles', roles)
 *   api.accessToken.setCustomClaim('https://axiominnovations.com/roles', roles)
 * }
 * ```
 *
 * Shared between client (`useUser()`) and server (`useAuth0(event).getUser()`)
 * so both sides read roles the same way — see `server/utils/roles.ts` for the
 * server-only auth guards built on top of this.
 */

export function getUserRoles(user: Record<string, unknown> | null | undefined): string[] {
  const roles = user?.user_roles
  return Array.isArray(roles) ? roles.filter(role => typeof role === 'string') : []
}

/* sample user payload
{ 
  user_roles: [ 'admin', 'uw' ],                                                                                2:34:07 p.m.
  nickname: 'test1',
  name: 'test1@test.com',
  picture:
   'https://s.gravatar.com/avatar/94fba03762323f286d7c3ca9e001c541?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png',
  updated_at: '2026-09-13T18:28:24.784Z',
  email: 'test1@test.com',
  email_verified: false,
  iss: 'https://dev-ktorvhwabg24xrv2.ca.auth0.com/',
  aud: 'mIrvVsF4Q6lczXSiEdPTJCCTRkPj1vSc',
  sub: 'auth0|6aa5e9cb46f5c99f70400b15',
  iat: 1789324105,
  exp: 1789360105,
  sid: '5dT-IB8lQ5xMnYndCbqc4_VfBGTSfZXp' }
*/
