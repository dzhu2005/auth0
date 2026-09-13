<template>
  <div v-if="isLoading">
    Loading...
  </div>

  <div v-else-if="isAuthenticated && user">
    <p>Logged in as {{ user.email }}</p>

    <h2>User Profile</h2>

    <pre>{{ JSON.stringify(user, null, 2) }}</pre>

    <button @click="logout">
      Logout
    </button>

    <h2>Admin Config</h2>

    <button @click="fetchAdminConfig">
      Fetch Admin Config
    </button>

    <p v-if="adminConfigError">
      Error: {{ adminConfigError }}
    </p>

    <pre v-if="adminConfig">{{ JSON.stringify(adminConfig, null, 2) }}</pre>
  </div>

  <div v-else>
    <p v-if="error">
      Error: {{ error.message }}
    </p>

    <button @click="signup">
      Signup
    </button>

    <button @click="login">
      Login
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import type { AppConfiguration } from '#shared/types/config'

const {
  isLoading,
  isAuthenticated,
  error,
  loginWithRedirect,
  logout: auth0Logout,
  user,
  getAccessTokenSilently
} = useAuth0()

const signup = () =>
  loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })

const login = () => loginWithRedirect()

const logout = () =>
  auth0Logout({ logoutParams: { returnTo: window.location.origin } })

const adminConfig = ref<AppConfiguration | null>(null)
const adminConfigError = ref<string | null>(null)

// Requires the "admin" role in Auth0 (via the read:admin-config RBAC
// permission) - see server/api/admin/config.get.ts.
async function fetchAdminConfig() {
  adminConfig.value = null
  adminConfigError.value = null

  try {
    const token = await getAccessTokenSilently()
    adminConfig.value = await $fetch<AppConfiguration>('/api/admin/config', {
      headers: { Authorization: `Bearer ${token}` }
    })
  } catch (fetchError) {
    adminConfigError.value
      = fetchError instanceof Error ? fetchError.message : String(fetchError)
  }
}
</script>

<style scoped>
button { border: 1px solid #ccc; background: #fff; padding: 0.5rem 1rem; margin: 0.5rem; cursor: pointer; }
</style>
