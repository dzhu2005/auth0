/**
 * Same as the SDK's built-in `/auth/login`, but sends the user straight to
 * the Universal Login signup screen (`screen_hint: 'signup'`) instead of the
 * login screen. The built-in login route doesn't expose that option, so this
 * calls the same official SDK method (`startInteractiveLogin`) directly.
 */
export default defineEventHandler(async (event) => {
  const auth0 = useAuth0(event)
  const { returnTo } = getQuery(event)

  const authorizationUrl = await auth0.startInteractiveLogin({
    authorizationParams: { screen_hint: 'signup' },
    appState: { returnTo: safeReturnTo(returnTo) }
  })

  return sendRedirect(event, authorizationUrl.href)
})
