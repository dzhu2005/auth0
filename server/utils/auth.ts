import type { H3Event } from 'h3'
import { createRemoteJWKSet, jwtVerify } from 'jose'

let jwks: ReturnType<typeof createRemoteJWKSet> | undefined
let jwksDomain: string | undefined

function getJwks(domain: string) {
  // Recreate only if the domain changes (it won't at runtime, but keeps this
  // safe if getAppConfig() is ever reloaded with a different value).
  if (!jwks || jwksDomain !== domain) {
    jwks = createRemoteJWKSet(new URL(`https://${domain}/.well-known/jwks.json`))
    jwksDomain = domain
  }
  return jwks
}

/**
 * Verifies the request's `Authorization: Bearer <token>` header as an Auth0
 * access token (RS256 JWT, signed by this tenant, issued for our API's
 * audience), and requires the given RBAC permission to be present in it.
 *
 * Throws (via h3's createError) a 401 if the token is missing, invalid, or
 * expired, or a 403 if it's valid but lacks the required permission.
 */
export async function requirePermission(event: H3Event, permission: string) {
  const authorization = getRequestHeader(event, 'authorization')
  const token = authorization?.match(/^Bearer (.+)$/i)?.[1]

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Missing bearer token.' })
  }

  const { auth0 } = await getAppConfig()

  let payload
  try {
    ;({ payload } = await jwtVerify(token, getJwks(auth0.domain), {
      issuer: `https://${auth0.domain}/`,
      audience: auth0.audience
    }))
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or expired access token.' })
  }

  const permissions = Array.isArray(payload.permissions) ? payload.permissions : []

  if (!permissions.includes(permission)) {
    throw createError({
      statusCode: 403,
      statusMessage: `Missing required permission "${permission}".`
    })
  }

  return payload
}
