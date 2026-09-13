<script setup lang="ts">
const { data, status, error, refresh } = await useFetch('/api/demo/configuration')

const sections = computed(() => {
  if (!data.value) return []

  return [
    {
      title: 'Auth0',
      rows: [
        { key: 'Domain', value: data.value.auth0.domain },
        { key: 'Client ID', value: data.value.auth0.client_id },
        { key: 'Client secret', value: data.value.auth0.client_secret },
        { key: 'Audience', value: data.value.auth0.audience },
        { key: 'Callback URL', value: data.value.auth0.callback_url }
      ]
    },
    {
      title: 'Session',
      rows: [
        { key: 'Password', value: data.value.session.password }
      ]
    }
  ]
})
</script>

<template>
  <div class="mx-auto max-w-2xl p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">
        Configuration
      </h1>
      <UButton
        icon="i-lucide-refresh-cw"
        color="neutral"
        variant="ghost"
        :loading="status === 'pending'"
        @click="refresh()"
      >
        Refresh
      </UButton>
    </div>

    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      title="Failed to load configuration"
      :description="error.statusMessage || error.message"
    />

    <UCard
      v-for="section in sections"
      :key="section.title"
    >
      <template #header>
        <span class="font-medium">{{ section.title }}</span>
      </template>

      <dl class="divide-y divide-default">
        <div
          v-for="row in section.rows"
          :key="row.key"
          class="grid grid-cols-3 gap-4 py-2 text-sm"
        >
          <dt class="text-muted">
            {{ row.key }}
          </dt>
          <dd class="col-span-2 break-all font-mono">
            {{ row.value }}
          </dd>
        </div>
      </dl>
    </UCard>

    <p class="text-xs text-muted">
      Secret values are masked server-side and never sent to the browser in plain text.
    </p>
  </div>
</template>
