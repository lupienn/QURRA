<script setup lang="ts">
import { computed } from 'vue'

import { getLevelRoute } from '~/game/levels'
import type { LevelProgress } from '~/types/storage'
import type { LevelConfig } from '~/types/tajwid'

const props = defineProps<{
  level: Readonly<LevelConfig>
  progress: LevelProgress
}>()

const route = computed(() => getLevelRoute(props.level.id))

const themeClass = computed(() => {
  const themes: Record<string, string> = {
    'desert-dawn': 'from-amber-100 to-orange-50',
    oasis: 'from-emerald-100 to-cyan-50',
    'night-sky': 'from-indigo-100 to-blue-50',
    'mountain-pass': 'from-stone-200 to-amber-50',
    'golden-city': 'from-yellow-100 to-amber-50',
  }
  return themes[props.level.backgroundTheme] ?? 'from-qurra-sand to-white'
})
</script>

<template>
  <article
    class="group relative overflow-hidden rounded-3xl border border-qurra-gold/20 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lantern motion-reduce:transform-none"
  >
    <div
      class="absolute inset-x-0 top-0 h-28 bg-gradient-to-br opacity-80"
      :class="themeClass"
      aria-hidden="true"
    />
    <div class="relative p-5 sm:p-6">
      <div class="flex items-start justify-between gap-4">
        <div
          class="grid size-14 shrink-0 place-items-center rounded-2xl bg-qurra-navy text-xl font-bold text-qurra-gold-light shadow-lg"
        >
          {{ level.id }}
        </div>
        <span
          class="rounded-full px-3 py-1 text-xs font-bold"
          :class="
            progress.completed ? 'bg-qurra-green text-white' : 'bg-white/80 text-qurra-navy/60'
          "
        >
          {{ progress.completed ? 'Selesai' : 'Dalam perjalanan' }}
        </span>
      </div>

      <h3 class="mt-7 text-xl font-bold text-qurra-navy">{{ level.name }}</h3>
      <p class="mt-2 min-h-12 text-sm leading-6 text-qurra-navy/65">{{ level.description }}</p>

      <ProgressBar class="mt-5" :percentage="progress.completionPercentage" label="Progres" />

      <NuxtLink
        :to="route"
        :data-level-id="level.id"
        class="mt-5 flex min-h-11 w-full items-center justify-between rounded-2xl bg-qurra-navy px-4 py-3 font-bold text-white transition group-hover:bg-qurra-green"
        :aria-label="`Mainkan Level ${level.id}: ${level.name}`"
      >
        <span>{{ progress.completed ? 'Main lagi' : 'Mulai level' }}</span>
        <span aria-hidden="true">→</span>
      </NuxtLink>
    </div>
  </article>
</template>
