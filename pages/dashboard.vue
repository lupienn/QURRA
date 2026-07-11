<script setup lang="ts">
import { computed } from 'vue'

import { LEVEL_CONFIGS } from '~/game/levels'
import type { LevelId } from '~/types/game'

useSeoMeta({
  title: 'Peta Belajar — QURRA',
  description: 'Pilih level tajwid, lihat progres, skor, dan lencana perjalananmu.',
})

const { progress, storageError, getLevelProgress } = useGameProgress()

const completedLevels = computed(
  () => progress.value.levels.filter((level) => level.completed).length,
)

const levelProgress = (levelId: LevelId) => {
  const value = getLevelProgress(levelId)
  if (!value) throw new Error(`Progress Level ${levelId} tidak tersedia.`)
  return value
}
</script>

<template>
  <div class="relative overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
    <div
      class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-qurra-sand/80 to-transparent"
      aria-hidden="true"
    />
    <div class="mx-auto max-w-7xl">
      <header class="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-qurra-green">Peta Belajar</p>
          <h1 class="mt-3 max-w-3xl text-4xl font-bold leading-tight text-qurra-navy sm:text-5xl">
            Ke mana langkahmu hari ini?
          </h1>
          <p class="mt-4 max-w-2xl text-base leading-7 text-qurra-navy/65">
            Semua level terbuka. Pilih materi yang ingin kamu latih, lalu kembali kapan
            saja—progresmu tersimpan di perangkat ini.
          </p>
        </div>
        <ScoreDisplay :score="progress.totalScore" />
      </header>

      <aside
        v-if="storageError"
        class="mt-7 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"
        role="status"
      >
        <span aria-hidden="true">⚠️</span>
        <div>
          <strong class="block">Progres berjalan dalam mode sementara</strong>
          <span>{{ storageError.message }}</span>
        </div>
      </aside>

      <section class="mt-10 grid gap-6 xl:grid-cols-[1fr_280px]">
        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-2">
          <LevelCard
            v-for="level in LEVEL_CONFIGS"
            :key="level.id"
            :level="level"
            :progress="levelProgress(level.id)"
          />
        </div>

        <aside class="space-y-5">
          <div class="qurra-panel sticky top-24 overflow-hidden p-5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-[0.16em] text-qurra-green"
                >Jejakmu</span
              >
              <span class="text-2xl text-qurra-gold" aria-hidden="true">✦</span>
            </div>
            <p class="mt-4 text-4xl font-bold text-qurra-navy">
              {{ completedLevels }}<span class="text-lg text-qurra-navy/40">/5</span>
            </p>
            <p class="mt-1 text-sm text-qurra-navy/60">level telah dituntaskan</p>
            <ProgressBar
              class="mt-5"
              :percentage="(completedLevels / 5) * 100"
              label="Perjalanan utama"
            />

            <div class="my-6 h-px bg-qurra-gold/20" />
            <BadgeDisplay :badges="progress.badges" />
          </div>
        </aside>
      </section>
    </div>
  </div>
</template>
