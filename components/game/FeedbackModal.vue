<script setup lang="ts">
defineProps<{
  correct: boolean
  message: string
  explanation?: string
}>()
defineEmits<{ continue: [] }>()
</script>

<template>
  <div
    class="fixed inset-0 z-50 grid place-items-center bg-qurra-navy/70 p-4 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="feedback-title"
  >
    <section class="qurra-panel w-full max-w-lg p-6 text-center sm:p-8">
      <div
        class="mx-auto grid size-16 place-items-center rounded-full text-3xl"
        :class="correct ? 'bg-emerald-100 text-qurra-green' : 'bg-amber-100 text-amber-800'"
        aria-hidden="true"
      >
        {{ correct ? '✓' : '↻' }}
      </div>
      <h2 id="feedback-title" class="mt-5 text-2xl font-bold text-qurra-navy">{{ message }}</h2>
      <p v-if="explanation" class="mt-3 leading-7 text-qurra-navy/65">{{ explanation }}</p>
      <button type="button" class="qurra-button mt-6 w-full" @click="$emit('continue')">
        Lanjut
      </button>
    </section>
  </div>
</template>
