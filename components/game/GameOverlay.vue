<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ score: number; levelName: string }>()
const emit = defineEmits<{ pause: [paused: boolean] }>()
const paused = ref(false)

const togglePause = () => {
  paused.value = !paused.value
  emit('pause', paused.value)
}
</script>

<template>
  <div
    class="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 p-3 sm:p-4"
  >
    <div
      class="pointer-events-auto rounded-xl bg-qurra-navy/80 px-3 py-2 text-xs font-bold text-white backdrop-blur sm:text-sm"
    >
      {{ levelName }}
    </div>
    <div class="flex items-center gap-2">
      <ScoreDisplay class="pointer-events-auto" :score="score" compact />
      <button
        type="button"
        class="pointer-events-auto grid min-h-11 min-w-11 place-items-center rounded-xl bg-qurra-navy/80 text-white backdrop-blur transition hover:bg-qurra-green"
        :aria-label="paused ? 'Lanjutkan game' : 'Jeda game'"
        @click="togglePause"
      >
        <span aria-hidden="true">{{ paused ? '▶' : 'Ⅱ' }}</span>
      </button>
    </div>
  </div>
</template>
