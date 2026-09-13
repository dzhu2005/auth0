<template>
  <div>
    <Icon
      name="material-icon-theme:folder-home-open"
      size="48"
    />
    Home

    <ClientOnly>
      <AuthStatus />

      <template #fallback>
        <p>Loading...</p>
      </template>
    </ClientOnly>
  </div>
</template>
