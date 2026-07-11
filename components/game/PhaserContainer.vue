<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import type Phaser from 'phaser'

import { GAME_HEIGHT, GAME_WIDTH } from '~/game/dimensions'
import type { LevelId } from '~/types/game'

const props = defineProps<{ levelId: LevelId }>()
const emit = defineEmits<{
  ready: []
  error: [message: string]
}>()

const gameContainer = ref<HTMLDivElement | null>(null)
const loading = ref(true)
const initializationError = ref<string | null>(null)

const { $loadPhaser } = useNuxtApp()
const bridge = usePhaserBridge()

let game: Phaser.Game | null = null
let resizeObserver: ResizeObserver | null = null
let removeGameErrorListener: (() => void) | null = null

const resizeGame = () => {
  if (!game || !gameContainer.value) return
  // Keep a stable logical coordinate system; Scale.FIT handles the visual size.
  game.scale.resize(GAME_WIDTH, GAME_HEIGHT)
  game.scale.refresh()
}

const destroyGame = () => {
  resizeObserver?.disconnect()
  resizeObserver = null
  removeGameErrorListener?.()
  removeGameErrorListener = null
  bridge.disconnect()
  game?.destroy(true)
  game = null
}

const initializeGame = async () => {
  destroyGame()
  loading.value = true
  initializationError.value = null
  await nextTick()

  if (!gameContainer.value) return

  try {
    const [phaserModule, configModule] = await Promise.all([$loadPhaser(), import('~/game/config')])
    const PhaserNamespace = phaserModule
    const createdGame = new PhaserNamespace.Game(
      configModule.createGameConfig(gameContainer.value, props.levelId),
    )
    game = createdGame
    bridge.connectToGame(createdGame)

    removeGameErrorListener = bridge.on('game:error', ({ message }) => {
      initializationError.value = message
      loading.value = false
      emit('error', message)
    })

    createdGame.events.once(PhaserNamespace.Core.Events.READY, () => {
      createdGame.registry.set('requestedLevelId', props.levelId)
      bridge.emit('game:start', { levelId: props.levelId })
      loading.value = false
      emit('ready')
      resizeGame()
    })

    resizeObserver = new ResizeObserver(resizeGame)
    resizeObserver.observe(gameContainer.value)
  } catch (error) {
    console.error('Phaser initialization failed:', error)
    initializationError.value = 'Game tidak dapat dijalankan pada perangkat ini.'
    loading.value = false
    emit('error', initializationError.value)
  }
}

onMounted(() => void initializeGame())
onBeforeUnmount(destroyGame)
</script>

<template>
  <section
    class="relative mx-auto aspect-video w-full max-w-[960px] overflow-hidden rounded-3xl border border-white/10 bg-qurra-navy shadow-2xl"
    aria-label="Area permainan QURRA"
  >
    <div ref="gameContainer" class="h-full w-full [&>canvas]:!h-full [&>canvas]:!w-full" />

    <div
      v-if="loading"
      class="absolute inset-0 grid place-items-center bg-qurra-navy text-center text-white"
      role="status"
    >
      <div>
        <div
          class="mx-auto size-12 animate-spin rounded-full border-4 border-white/20 border-t-qurra-gold motion-reduce:animate-none"
        />
        <p class="mt-4 font-bold">Menyiapkan dunia tajwid…</p>
      </div>
    </div>

    <div
      v-if="initializationError"
      class="absolute inset-0 grid place-items-center bg-qurra-navy/95 p-6 text-center text-white"
      role="alert"
    >
      <div class="max-w-md">
        <span class="text-4xl" aria-hidden="true">⚠️</span>
        <h2 class="mt-4 text-2xl font-bold">Petualangan tertunda</h2>
        <p class="mt-3 text-white/70">{{ initializationError }}</p>
        <div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" class="qurra-button" @click="initializeGame">Coba lagi</button>
          <NuxtLink
            to="/dashboard"
            class="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/30 px-5 py-3 font-bold"
            >Kembali ke dashboard</NuxtLink
          >
        </div>
      </div>
    </div>
  </section>
</template>
