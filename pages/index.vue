<script setup lang="ts">
useSeoMeta({
  title: 'QURRA — Petualangan Belajar Tajwid',
  description: 'Pelajari hukum bacaan Al-Qur’an melalui lima level petualangan interaktif.',
})
</script>

<template>
  <div>
    <LandingHero />

    <section id="cara-belajar" class="px-4 py-20 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="mx-auto max-w-2xl text-center">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-qurra-green">Cara belajar</p>
          <h2 class="mt-3 text-3xl font-bold text-qurra-navy sm:text-4xl">
            Satu langkah kecil di setiap ayat
          </h2>
          <p class="mt-4 leading-7 text-qurra-navy/65">
            QURRA memadukan latihan singkat, umpan balik langsung, dan progres yang tersimpan di
            perangkatmu.
          </p>
        </div>

        <div class="mt-12 grid gap-5 md:grid-cols-3">
          <article
            v-for="(item, index) in [
              {
                icon: '🗺️',
                title: 'Pilih jalur',
                text: 'Mulai dari level mana pun sesuai materi yang ingin kamu kuasai.',
              },
              {
                icon: '🔎',
                title: 'Temukan hukumnya',
                text: 'Baca potongan ayat, amati tanda bacaan, lalu pilih hukum tajwidnya.',
              },
              {
                icon: '🏅',
                title: 'Kumpulkan lencana',
                text: 'Pelajari penjelasan, tuntaskan level, dan lihat perjalananmu berkembang.',
              },
            ]"
            :key="item.title"
            class="qurra-panel p-6"
          >
            <div class="flex items-center justify-between">
              <span
                class="grid size-12 place-items-center rounded-2xl bg-qurra-sand text-2xl"
                aria-hidden="true"
                >{{ item.icon }}</span
              >
              <span class="text-sm font-bold text-qurra-gold">0{{ index + 1 }}</span>
            </div>
            <h3 class="mt-6 text-xl font-bold text-qurra-navy">{{ item.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-qurra-navy/65">{{ item.text }}</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>
