let phaserModule: Promise<typeof import('phaser')> | undefined

export default defineNuxtPlugin(() => ({
  provide: {
    loadPhaser: () => {
      phaserModule ??= import('phaser')
      return phaserModule
    },
  },
}))
