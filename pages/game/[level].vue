<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { isLevelId } from '~/content/questions'
import { getLevelConfig } from '~/game/levels'
import type { LevelId } from '~/types/game'

definePageMeta({ layout: 'default' })

const route = useRoute()
const parsedLevel = Number(
  Array.isArray(route.params.level) ? route.params.level[0] : route.params.level,
)
const levelId = isLevelId(parsedLevel) ? (parsedLevel as LevelId) : null
const levelConfig = levelId === null ? undefined : getLevelConfig(levelId)

useSeoMeta({
  title: levelConfig ? `${levelConfig.name} — QURRA` : 'Level tidak ditemukan — QURRA',
})

const bridge = usePhaserBridge()
const { recordQuestionAnswered, markLevelComplete } = useGameProgress()
const { applyAnswerScore, getLevelAttemptScore, resetLevelAttemptScore } = useScore()
const { awardBadge } = useBadges()

const displayedScore = ref(levelId === null ? 0 : getLevelAttemptScore(levelId))
const gameError = ref<string | null>(null)
const completed = ref(false)
const cleanupListeners: Array<() => void> = []
let navigationTimer: ReturnType<typeof setTimeout> | null = null

const gameTitle = computed(() => levelConfig?.name ?? 'Level tidak ditemukan')

const handlePause = (paused: boolean) => {
  bridge.emit(paused ? 'game:pause' : 'game:resume', undefined)
}

onMounted(() => {
  if (levelId === null) return
  resetLevelAttemptScore(levelId)
  displayedScore.value = 0

  cleanupListeners.push(
    bridge.on('question:answered', (result) => {
      const totalScore = applyAnswerScore(result.isCorrect, levelId)
      recordQuestionAnswered(levelId)
      displayedScore.value = getLevelAttemptScore(levelId)
      bridge.emit('score:updated', { newScore: totalScore })
    }),
    bridge.on('score:updated', () => {
      displayedScore.value = getLevelAttemptScore(levelId)
    }),
    bridge.on('level:completed', ({ levelId: completedLevel, finalScore }) => {
      if (completedLevel !== levelId) return
      markLevelComplete(levelId, finalScore)
      awardBadge(levelId)
      completed.value = true
      navigationTimer = setTimeout(() => void navigateTo('/dashboard'), 1800)
    }),
    bridge.on('game:error', ({ message }) => {
      gameError.value = message
    }),
  )
})

onBeforeUnmount(() => {
  for (const cleanup of cleanupListeners) cleanup()
  if (navigationTimer) clearTimeout(navigationTimer)
})
</script>

<template>
  <div
    class="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-qurra-navy px-3 py-6 sm:px-6 sm:py-10"
  >
    <div class="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
      <div class="absolute left-8 top-20 size-32 rotate-45 border border-qurra-gold" />
      <div class="absolute bottom-10 right-8 size-52 rotate-12 border border-qurra-gold" />
    </div>

    <div v-if="levelId && levelConfig" class="relative mx-auto max-w-6xl">
      <div class="mb-5 flex items-center justify-between gap-4 text-white">
        <NuxtLink
          to="/dashboard"
          class="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-bold transition hover:bg-white/10"
          >← Peta belajar</NuxtLink
        >
        <p class="hidden text-sm text-white/60 sm:block">Level {{ levelId }} dari 5</p>
      </div>

      <div class="relative">
        <PhaserContainer :level-id="levelId" @error="gameError = $event" />
        <GameOverlay :score="displayedScore" :level-name="gameTitle" @pause="handlePause" />
      </div>

      <p class="mx-auto mt-5 max-w-2xl text-center text-sm leading-6 text-white/55">
        Pilih satu jawaban lalu tekan “Periksa jawaban”. Kamu juga dapat melewati soal; soal yang
        dilewati dihitung salah.
      </p>

      <div
        v-if="completed"
        class="fixed inset-0 z-50 grid place-items-center bg-qurra-navy/80 p-4 text-center text-white backdrop-blur"
        role="status"
      >
        <div class="qurra-panel max-w-md p-8 text-qurra-navy">
          <span class="text-5xl" aria-hidden="true">🏅</span>
          <h2 class="mt-5 text-3xl font-bold">Level selesai!</h2>
          <p class="mt-3 text-qurra-navy/65">
            Lencana baru masuk ke koleksimu. Membuka peta perjalanan…
          </p>
        </div>
      </div>
    </div>

    <div
      v-else
      class="relative mx-auto grid min-h-[60vh] max-w-xl place-items-center text-center text-white"
    >
      <div>
        <span class="text-5xl" aria-hidden="true">🧭</span>
        <h1 class="mt-5 text-3xl font-bold">Level tidak ditemukan</h1>
        <p class="mt-3 text-white/65">Pilih salah satu dari lima level yang tersedia.</p>
        <NuxtLink to="/dashboard" class="qurra-button mt-7">Kembali ke peta</NuxtLink>
      </div>
    </div>
  </div>
</template>
