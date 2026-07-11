import Phaser from 'phaser'

import { GAME_ASSETS, getAssetLoadErrorMessage } from '~/game/assets'
import { gameEventBridge } from '~/game/bridge/EventBridge'

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload(): void {
    const { width, height } = this.scale
    const track = this.add.rectangle(width / 2, height / 2, 360, 16, 0xffffff, 0.18)
    const bar = this.add.rectangle(width / 2 - 180, height / 2, 0, 16, 0xd6a84b)
    bar.setOrigin(0, 0.5)

    const label = this.add
      .text(width / 2, height / 2 - 42, 'Menyiapkan petualangan…', {
        color: '#FFF8E7',
        fontFamily: 'Nunito, sans-serif',
        fontSize: '22px',
      })
      .setOrigin(0.5)

    this.load.on(Phaser.Loader.Events.PROGRESS, (progress: number) => {
      bar.width = 360 * progress
    })

    this.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, (file: Phaser.Loader.File) => {
      const message = getAssetLoadErrorMessage(file.key)
      console.error(message)
      this.registry.set('assetLoadError', message)
      gameEventBridge.emit('game:error', { message, recoverable: true })
    })

    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      track.destroy()
      bar.destroy()
      label.destroy()
    })

    for (const asset of GAME_ASSETS) this.load.svg(asset.key, asset.url)
  }

  create(): void {
    this.scene.start('GameScene')
  }
}
