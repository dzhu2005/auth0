/**
 * Guards against open-redirect via a `returnTo` query param: only a same-app
 * relative path is allowed (e.g. `/dashboard`), never an absolute URL or a
 * protocol-relative one (`//evil.com`), which browsers still treat as a
 * cross-origin redirect.
 */
export function safeReturnTo(value: unknown, fallback = '/'): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
    return fallback
  }
  return value
}
