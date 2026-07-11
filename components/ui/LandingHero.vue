<template>
  <section
    class="relative isolate overflow-hidden bg-qurra-navy px-4 pb-20 pt-14 text-white sm:px-6 sm:pb-28 sm:pt-20 lg:px-8"
  >
    <div class="absolute inset-0 -z-10" aria-hidden="true">
      <div
        class="absolute -right-24 -top-32 size-96 rounded-full border-[48px] border-qurra-gold/10"
      />
      <div
        class="absolute -left-20 bottom-0 size-72 rotate-45 rounded-[4rem] border border-qurra-gold/20"
      />
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(214,168,75,.16),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(46,139,103,.24),transparent_30%)]"
      />
    </div>

    <div class="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
      <div>
        <div
          class="inline-flex items-center gap-2 rounded-full border border-qurra-gold/30 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-qurra-gold-light"
        >
          <span aria-hidden="true">✦</span>
          Belajar • Bermain • Bertumbuh
        </div>
        <h1 class="mt-7 text-5xl font-bold leading-[.98] tracking-tight sm:text-6xl lg:text-7xl">
          QURRA
          <span
            class="mt-4 block max-w-3xl text-xl font-semibold leading-8 text-white/75 sm:text-2xl"
          >
            Quranic Understanding: Reading Rules Adventure
          </span>
        </h1>
        <p class="mt-6 max-w-2xl text-lg leading-8 text-white/70">
          Jelajahi lima dunia tajwid, jawab tantangan ayat, dan kumpulkan lencana dalam petualangan
          belajar yang terasa ringan namun bermakna.
        </p>
        <div class="mt-9 flex flex-col gap-3 sm:flex-row">
          <NuxtLink
            to="/dashboard"
            class="qurra-button bg-qurra-gold text-qurra-navy hover:bg-qurra-gold-light"
          >
            Mulai petualangan
            <span aria-hidden="true">→</span>
          </NuxtLink>
          <a
            href="#cara-belajar"
            class="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/20 px-5 py-3 font-bold text-white/80 transition hover:bg-white/10"
          >
            Lihat cara belajar
          </a>
        </div>
      </div>

      <div class="relative mx-auto w-full max-w-lg" aria-label="Ilustrasi peta petualangan QURRA">
        <div
          class="qurra-panel relative aspect-square overflow-hidden border-white/10 bg-qurra-cream p-6 text-qurra-navy shadow-2xl sm:p-9"
        >
          <div class="absolute inset-0 opacity-40" aria-hidden="true">
            <div
              class="absolute left-[15%] top-[20%] size-20 rotate-45 border border-qurra-gold/30"
            />
            <div
              class="absolute bottom-[12%] right-[8%] size-32 rotate-12 border border-qurra-green/20"
            />
          </div>
          <div class="relative flex h-full flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="rounded-full bg-qurra-green px-3 py-1 text-xs font-bold text-white"
                >Peta Tajwid</span
              >
              <span class="text-2xl text-qurra-gold" aria-hidden="true">☾</span>
            </div>

            <div class="relative my-4 flex-1">
              <svg viewBox="0 0 360 300" class="absolute inset-0 h-full w-full" aria-hidden="true">
                <path
                  d="M44 252C87 230 71 187 123 171s31-63 88-76 67-28 100-62"
                  fill="none"
                  stroke="#D6A84B"
                  stroke-width="8"
                  stroke-linecap="round"
                  stroke-dasharray="2 18"
                />
              </svg>
              <div
                class="absolute bottom-[8%] left-[4%] grid size-14 place-items-center rounded-full bg-qurra-green text-lg font-bold text-white shadow-lg"
              >
                1
              </div>
              <div
                class="absolute bottom-[36%] left-[30%] grid size-12 place-items-center rounded-full bg-qurra-green-light font-bold text-white shadow-lg"
              >
                2
              </div>
              <div
                class="absolute left-[50%] top-[34%] grid size-12 place-items-center rounded-full bg-qurra-navy font-bold text-qurra-gold-light shadow-lg"
              >
                3
              </div>
              <div
                class="absolute right-[22%] top-[20%] grid size-12 place-items-center rounded-full bg-qurra-navy-light font-bold text-white shadow-lg"
              >
                4
              </div>
              <div
                class="absolute right-[2%] top-[2%] grid size-16 place-items-center rounded-[1.4rem] bg-qurra-gold text-xl font-bold text-qurra-navy shadow-lantern"
              >
                ★
              </div>
            </div>

            <div class="flex items-center gap-3 rounded-2xl bg-qurra-sand/70 p-3">
              <span
                class="grid size-10 place-items-center rounded-xl bg-white text-xl"
                aria-hidden="true"
                >📖</span
              >
              <p class="text-sm font-bold">Lima level. Lima lencana. Satu perjalanan.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
