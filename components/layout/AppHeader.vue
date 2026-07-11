<script setup lang="ts">
const route = useRoute()

const links = [
  { label: 'Beranda', to: '/' },
  { label: 'Peta Belajar', to: '/dashboard' },
]
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-white/10 bg-qurra-navy/95 text-white backdrop-blur"
  >
    <div
      class="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
    >
      <NuxtLink
        to="/"
        class="group flex min-h-11 items-center gap-3 rounded-xl"
        aria-label="QURRA — kembali ke beranda"
      >
        <span
          class="grid size-10 place-items-center rounded-2xl bg-qurra-gold text-qurra-navy shadow-lantern transition group-hover:rotate-6"
        >
          <svg viewBox="0 0 40 40" class="size-7" aria-hidden="true">
            <path
              fill="currentColor"
              d="M24.8 7.5a13 13 0 1 0 7.7 20.9A14.5 14.5 0 1 1 24.8 7.5Z"
            />
            <path
              fill="currentColor"
              d="m29.7 11.6 1.4 2.9 3.2.5-2.3 2.2.5 3.2-2.8-1.5-2.9 1.5.6-3.2-2.4-2.2 3.2-.5 1.5-2.9Z"
            />
          </svg>
        </span>
        <span>
          <strong class="block text-lg leading-none tracking-[0.14em]">QURRA</strong>
          <span class="hidden text-[10px] text-qurra-gold-light sm:block"
            >Reading Rules Adventure</span
          >
        </span>
      </NuxtLink>

      <nav aria-label="Navigasi utama" class="flex items-center gap-1 sm:gap-2">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="flex min-h-11 items-center rounded-xl px-3 text-sm font-bold transition hover:bg-white/10 sm:px-4"
          :class="route.path === link.to ? 'bg-white/10 text-qurra-gold-light' : 'text-white/80'"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
