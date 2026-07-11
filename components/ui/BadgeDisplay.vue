<script setup lang="ts">
import type { Badge } from '~/types/storage'

defineProps<{ badges: readonly Badge[] }>()
</script>

<template>
  <section aria-labelledby="badge-heading">
    <div class="mb-4 flex items-end justify-between gap-4">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-qurra-green">Koleksi</p>
        <h2 id="badge-heading" class="mt-1 text-2xl font-bold text-qurra-navy">
          Lencana Perjalanan
        </h2>
      </div>
      <span class="rounded-full bg-qurra-sand px-3 py-1 text-sm font-bold text-qurra-navy/70"
        >{{ badges.length }}/5</span
      >
    </div>

    <div v-if="badges.length" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <article
        v-for="badge in badges"
        :key="badge.id"
        :data-badge-id="badge.id"
        class="group relative rounded-2xl border border-qurra-gold/25 bg-qurra-cream p-3 text-center transition hover:-translate-y-1 hover:shadow-lantern focus-within:-translate-y-1"
        tabindex="0"
      >
        <img
          :src="badge.iconUrl"
          :alt="`Lencana ${badge.name}`"
          class="mx-auto size-16"
          width="64"
          height="64"
          loading="lazy"
        />
        <h3 class="mt-2 text-sm font-bold text-qurra-navy">{{ badge.name }}</h3>
        <p
          class="mt-1 text-xs leading-5 text-qurra-navy/60 opacity-100 sm:absolute sm:inset-x-2 sm:top-full sm:z-10 sm:rounded-xl sm:bg-qurra-navy sm:p-2 sm:text-white sm:opacity-0 sm:shadow-xl sm:transition sm:group-hover:opacity-100 sm:group-focus:opacity-100"
        >
          {{ badge.description }}
        </p>
      </article>
    </div>

    <div
      v-else
      class="rounded-2xl border border-dashed border-qurra-gold/50 bg-qurra-cream/70 p-6 text-center text-sm text-qurra-navy/60"
    >
      Lencana pertamamu menunggu di ujung Level 1.
    </div>
  </section>
</template>
