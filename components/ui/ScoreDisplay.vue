<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ score: number; compact?: boolean }>()
const formattedScore = computed(() => Math.max(0, Math.trunc(props.score)).toLocaleString('id-ID'))
</script>

<template>
  <div
    class="inline-flex min-h-11 items-center gap-3 rounded-2xl border border-qurra-gold/30 bg-qurra-gold-light/40 px-4 py-2 text-qurra-navy"
    aria-label="Total skor"
  >
    <span
      class="grid size-8 place-items-center rounded-full bg-qurra-gold text-lg shadow-lantern"
      aria-hidden="true"
      >★</span
    >
    <span v-if="!compact" class="text-xs font-bold uppercase tracking-wider text-qurra-navy/60"
      >Skor</span
    >
    <strong data-testid="score-value" class="text-xl tabular-nums">{{ formattedScore }}</strong>
  </div>
</template>
