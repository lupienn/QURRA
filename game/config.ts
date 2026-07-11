import Phaser from 'phaser'

import type { LevelId } from '~/types/game'

import { GAME_HEIGHT, GAME_WIDTH } from './dimensions'
import { BootScene } from './scenes/BootScene'
import { FeedbackScene } from './scenes/FeedbackScene'
import { GameScene } from './scenes/GameScene'
import { QuestionScene } from './scenes/QuestionScene'

export const createGameConfig = (
  parent: HTMLElement,
  levelId: LevelId,
): Phaser.Types.Core.GameConfig => ({
  type: Phaser.AUTO,
  parent,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#102A43',
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: false,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  scene: [BootScene, GameScene, QuestionScene, FeedbackScene],
  callbacks: {
    postBoot: (game) => {
      game.registry.set('requestedLevelId', levelId)
    },
  },
})
