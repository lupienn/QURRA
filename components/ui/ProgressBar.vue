<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ percentage: number; label?: string }>()

const clampPercentage = (value: number): number => {
  if (!Number.isFinite(value)) return 0
  return Math.min(100, Math.max(0, value))
}

const safePercentage = computed(() => clampPercentage(props.percentage))
const displayPercentage = computed(() => Math.round(safePercentage.value))
</script>

<template>
  <div class="w-full" data-testid="progress-bar">
    <div
      v-if="label"
      class="mb-2 flex items-center justify-between gap-3 text-xs font-bold text-qurra-navy/70"
    >
      <span>{{ label }}</span>
      <span data-testid="progress-label">{{ displayPercentage }}%</span>
    </div>
    <div
      class="h-3 overflow-hidden rounded-full border border-qurra-gold/30 bg-qurra-sand"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="displayPercentage"
      :aria-label="label ?? 'Progres belajar'"
    >
      <div
        data-testid="progress-fill"
        class="h-full rounded-full bg-gradient-to-r from-qurra-green to-qurra-green-light transition-[width] duration-500 motion-reduce:transition-none"
        :style="{ width: `${safePercentage}%` }"
      />
    </div>
  </div>
</template>
