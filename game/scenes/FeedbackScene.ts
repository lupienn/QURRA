import Phaser from 'phaser'

import { getHighlightedText } from '~/content/questions'
import { gameEventBridge } from '~/game/bridge/EventBridge'
import { getFeedbackContent } from '~/game/feedback'
import type { QuestionManager } from '~/game/systems/QuestionManager'
import type { Question, QuestionResult } from '~/types/game'

interface FeedbackSceneData {
  manager: QuestionManager
  question: Question
  result: QuestionResult
}

export class FeedbackScene extends Phaser.Scene {
  private manager!: QuestionManager
  private question!: Question
  private result!: QuestionResult
  private advancing = false

  constructor() {
    super('FeedbackScene')
  }

  init(data: FeedbackSceneData): void {
    this.manager = data.manager
    this.question = data.question
    this.result = data.result
    this.advancing = false
  }

  create(): void {
    const { width, height } = this.scale
    const content = getFeedbackContent(this.question, this.result)
    const accent = this.result.isCorrect ? 0x2e8b67 : 0xd6a84b

    this.add
      .image(width / 2, height / 2, 'desert-background')
      .setDisplaySize(width, height)
      .setTint(0x6c7f8a)
    this.add.rectangle(width / 2, height / 2, width, height, 0x102a43, 0.58)
    this.add.rectangle(width / 2, height / 2, 700, 390, 0xfff8e7, 0.98).setStrokeStyle(4, accent)

    const player = this.add.image(190, height / 2 + 60, 'qurra-player').setDisplaySize(105, 140)
    if (this.result.isCorrect) {
      this.tweens.add({
        targets: player,
        y: player.y - 42,
        angle: { from: -5, to: 5 },
        duration: 360,
        yoyo: true,
        repeat: 2,
        onComplete: () =>
          gameEventBridge.emit('animation:complete', { animationType: 'player-celebration' }),
      })
      this.createSparkles(width / 2 + 120, 125)
    }

    this.add
      .text(width / 2 + 85, 115, content.title, {
        align: 'center',
        color: this.result.isCorrect ? '#176B4D' : '#8A4F2A',
        fontFamily: 'Nunito, sans-serif',
        fontSize: '30px',
        fontStyle: 'bold',
        wordWrap: { width: 440 },
      })
      .setOrigin(0.5)

    this.add
      .text(width / 2 + 85, 180, getHighlightedText(this.question), {
        align: 'center',
        backgroundColor: '#F2D48A66',
        color: '#102A43',
        fontFamily: 'Noto Naskh Arabic, serif',
        fontSize: '34px',
        padding: { x: 18, y: 8 },
        rtl: true,
        wordWrap: { width: 430 },
      })
      .setOrigin(0.5)

    this.add
      .text(width / 2 + 85, 260, content.explanation, {
        align: 'center',
        color: '#31485A',
        fontFamily: 'Nunito, sans-serif',
        fontSize: '18px',
        lineSpacing: 7,
        wordWrap: { width: 430 },
      })
      .setOrigin(0.5)

    if (this.result.isCorrect) {
      this.add
        .text(width / 2 + 85, 350, '+10 poin • lanjut otomatis…', {
          color: '#176B4D',
          fontFamily: 'Nunito, sans-serif',
          fontSize: '16px',
          fontStyle: 'bold',
        })
        .setOrigin(0.5)
      this.time.delayedCall(2500, () => this.advance())
    } else {
      this.add
        .text(width / 2 + 85, 360, 'Lanjut', {
          align: 'center',
          backgroundColor: '#176B4D',
          color: '#FFFFFF',
          fixedWidth: 220,
          fontFamily: 'Nunito, sans-serif',
          fontSize: '18px',
          fontStyle: 'bold',
          padding: { y: 12 },
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on(Phaser.Input.Events.POINTER_DOWN, () => this.advance())
    }
  }

  private createSparkles(x: number, y: number): void {
    for (let index = 0; index < 7; index += 1) {
      const star = this.add.image(x + (index - 3) * 46, y + (index % 2) * 35, 'reward-star')
      star.setDisplaySize(30, 30).setAlpha(0)
      this.tweens.add({
        targets: star,
        alpha: 1,
        scale: { from: 0.3, to: 1 },
        duration: 300,
        delay: index * 80,
        yoyo: true,
        hold: 500,
      })
    }
  }

  private advance(): void {
    if (this.advancing) return
    this.advancing = true

    const nextQuestion = this.manager.getNextQuestion()
    if (nextQuestion) {
      this.scene.start('QuestionScene', { manager: this.manager })
      return
    }

    const levelId = this.question.levelId
    gameEventBridge.emit('level:completed', {
      levelId,
      finalScore: this.manager.getScore(),
    })
  }
}
