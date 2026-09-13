<script setup lang="ts">
const user = useUser()
const route = useRoute()

const roles = computed(() => getUserRoles(user.value))

const returnToQuery = computed(() => `?returnTo=${encodeURIComponent(route.fullPath)}`)
</script>

<template>
  <div class="mx-auto max-w-lg p-6 space-y-6">
    <h1 class="text-xl font-semibold">
      Home
    </h1>

    <UCard v-if="user">
      <div class="flex items-center gap-3">
        <UAvatar
          :src="user.picture"
          :alt="user.name"
          size="lg"
        />
        <div>
          <p class="font-medium">
            {{ user.name }}
          </p>
          <p class="text-sm text-muted">
            {{ user.email }}
          </p>
        </div>
      </div>

      <div
        v-if="roles.length"
        class="mt-4 flex flex-wrap gap-1"
      >
        <UBadge
          v-for="role in roles"
          :key="role"
          color="neutral"
          variant="subtle"
        >
          {{ role }}
        </UBadge>
      </div>
      <p
        v-else
        class="mt-4 text-sm text-muted"
      >
        No roles on this account yet.
      </p>

      <a
        href="/auth/logout"
        class="mt-4 inline-flex items-center gap-1.5 rounded-md bg-default px-3 py-1.5 text-sm font-medium ring ring-default hover:bg-elevated"
      >
        <UIcon name="i-lucide-log-out" />
        Log out
      </a>
    </UCard>

    <div
      v-else
      class="flex gap-3"
    >
      <a
        :href="`/auth/login${returnToQuery}`"
        class="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-inverted hover:bg-primary/90"
      >
        <UIcon name="i-lucide-log-in" />
        Log in
      </a>
      <a
        :href="`/auth/signup${returnToQuery}`"
        class="inline-flex items-center gap-1.5 rounded-md bg-default px-3 py-1.5 text-sm font-medium ring ring-default hover:bg-elevated"
      >
        <UIcon name="i-lucide-user-plus" />
        Sign up
      </a>
    </div>
  </div>
</template>
