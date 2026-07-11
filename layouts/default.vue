<template>
  <div class="flex min-h-screen flex-col bg-qurra-cream text-qurra-ink">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
