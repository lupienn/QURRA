import Phaser from 'phaser'

import { isLevelId } from '~/content/questions'
import { gameEventBridge } from '~/game/bridge/EventBridge'
import { QuestionManager } from '~/game/systems/QuestionManager'
import type { GameEventHandler } from '~/types/game'

export class GameScene extends Phaser.Scene {
  private player?: Phaser.GameObjects.Image

  private readonly handleGameStart: GameEventHandler<'game:start'> = ({ levelId }) => {
    void this.startLevel(levelId)
  }

  private readonly handlePause: GameEventHandler<'game:pause'> = () => {
    this.scene.pause()
  }

  private readonly handleResume: GameEventHandler<'game:resume'> = () => {
    this.scene.resume()
  }

  constructor() {
    super('GameScene')
  }

  create(): void {
    const { width, height } = this.scale
    this.add.image(width / 2, height / 2, 'desert-background').setDisplaySize(width, height)

    this.player = this.add.image(115, height - 118, 'qurra-player').setDisplaySize(90, 120)
    this.tweens.add({
      targets: this.player,
      y: this.player.y - 7,
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    })

    this.add
      .text(width / 2, 58, 'Petualangan Tajwid', {
        color: '#FFF8E7',
        fontFamily: 'Nunito, sans-serif',
        fontSize: '30px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    gameEventBridge.on('game:start', this.handleGameStart)
    gameEventBridge.on('game:pause', this.handlePause)
    gameEventBridge.on('game:resume', this.handleResume)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      gameEventBridge.off('game:start', this.handleGameStart)
      gameEventBridge.off('game:pause', this.handlePause)
      gameEventBridge.off('game:resume', this.handleResume)
    })

    const requestedLevel = this.registry.get('requestedLevelId') as unknown
    if (isLevelId(requestedLevel)) void this.startLevel(requestedLevel)
  }

  private async startLevel(levelId: 1 | 2 | 3 | 4 | 5): Promise<void> {
    try {
      const manager = await QuestionManager.create(levelId)
      if (!this.scene.isActive()) return

      this.registry.set('questionManager', manager)
      this.registry.set('requestedLevelId', levelId)
      gameEventBridge.emit('game:ready', { levelId })
      this.scene.start('QuestionScene', { manager })
    } catch (error) {
      console.error('Unable to initialize game level:', error)
      gameEventBridge.emit('game:error', {
        message: 'Soal level tidak dapat dimuat. Coba lagi atau kembali ke peta belajar.',
        recoverable: true,
      })
    }
  }
}
