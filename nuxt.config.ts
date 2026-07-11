export default defineNuxtConfig({
  compatibilityDate: '2026-06-30',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint'],
  css: [
    '@fontsource/nunito/400.css',
    '@fontsource/nunito/600.css',
    '@fontsource/nunito/700.css',
    '@fontsource/noto-naskh-arabic/400.css',
    '@fontsource/noto-naskh-arabic/700.css',
    '~/assets/css/main.css',
  ],
  typescript: {
    strict: true,
    typeCheck: true,
  },
  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'QURRA',
      meta: [
        {
          name: 'description',
          content: 'QURRA',
        },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
})
