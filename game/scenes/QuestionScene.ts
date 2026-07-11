import Phaser from 'phaser'

import { gameEventBridge } from '~/game/bridge/EventBridge'
import type { QuestionManager } from '~/game/systems/QuestionManager'
import type { Question, TajwidOption } from '~/types/game'

interface QuestionSceneData {
  manager: QuestionManager
}

export class QuestionScene extends Phaser.Scene {
  private manager!: QuestionManager
  private question!: Question
  private selectedAnswer: string | null = null
  private optionButtons: Phaser.GameObjects.Text[] = []
  private submitButton?: Phaser.GameObjects.Text

  constructor() {
    super('QuestionScene')
  }

  init(data: QuestionSceneData): void {
    this.manager = data.manager
    this.question = this.manager.getCurrentQuestion()
    this.selectedAnswer = null
    this.optionButtons = []
  }

  create(): void {
    const { width, height } = this.scale
    this.add
      .image(width / 2, height / 2, 'desert-background')
      .setDisplaySize(width, height)
      .setTint(0x8ca0a8)
    this.add.rectangle(width / 2, height / 2, width, height, 0x102a43, 0.42)

    this.add.text(
      48,
      30,
      `Soal ${this.manager.getQuestionNumber()} dari ${this.manager.getQuestionCount()}`,
      { color: '#F2D48A', fontFamily: 'Nunito, sans-serif', fontSize: '18px', fontStyle: 'bold' },
    )

    this.add
      .text(width / 2, 98, this.question.verseText, {
        align: 'center',
        color: '#102A43',
        backgroundColor: '#FFF8E7',
        fontFamily: 'Noto Naskh Arabic, serif',
        fontSize: '42px',
        padding: { x: 34, y: 18 },
        rtl: true,
        wordWrap: { width: width - 140 },
      })
      .setOrigin(0.5, 0)

    this.add
      .text(width / 2, 195, this.question.verseReference, {
        color: '#FFFFFF',
        fontFamily: 'Nunito, sans-serif',
        fontSize: '15px',
      })
      .setOrigin(0.5)

    this.renderOptions(this.question.options)
    this.renderActions()
  }

  private renderOptions(options: TajwidOption[]): void {
    const { width } = this.scale
    const columns = options.length > 3 ? 2 : 1
    const buttonWidth = columns === 2 ? 380 : 560

    options.forEach((option, index) => {
      const column = index % columns
      const row = Math.floor(index / columns)
      const x = columns === 1 ? width / 2 : width / 2 + (column === 0 ? -205 : 205)
      const y = 245 + row * 76

      const button = this.add
        .text(x, y, `${option.arabicName}  •  ${option.indonesianName}`, {
          align: 'center',
          backgroundColor: '#FFFFFF',
          color: '#102A43',
          fixedWidth: buttonWidth,
          fontFamily: 'Nunito, Noto Naskh Arabic, sans-serif',
          fontSize: '18px',
          padding: { x: 16, y: 13 },
        })
        .setOrigin(0.5, 0)
        .setInteractive({ useHandCursor: true })

      button.on(Phaser.Input.Events.POINTER_DOWN, () => this.selectOption(option.id))
      button.setData('answerId', option.id)
      this.optionButtons.push(button)
    })
  }

  private renderActions(): void {
    const { width, height } = this.scale

    this.add
      .text(width / 2 - 120, height - 54, 'Lewati', {
        backgroundColor: '#FFFFFF33',
        color: '#FFFFFF',
        fixedWidth: 190,
        align: 'center',
        fontFamily: 'Nunito, sans-serif',
        fontSize: '17px',
        padding: { y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_DOWN, () => this.submitAnswer(null))

    this.submitButton = this.add
      .text(width / 2 + 120, height - 54, 'Periksa jawaban', {
        backgroundColor: '#6C7B86',
        color: '#FFFFFF',
        fixedWidth: 220,
        align: 'center',
        fontFamily: 'Nunito, sans-serif',
        fontSize: '17px',
        fontStyle: 'bold',
        padding: { y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        if (this.selectedAnswer !== null) this.submitAnswer(this.selectedAnswer)
      })
  }

  private selectOption(answerId: string): void {
    if (this.manager.hasSubmittedAnswer()) return
    this.selectedAnswer = answerId

    for (const button of this.optionButtons) {
      const selected = button.getData('answerId') === answerId
      button.setBackgroundColor(selected ? '#D6A84B' : '#FFFFFF')
      button.setColor(selected ? '#102A43' : '#102A43')
    }
    this.submitButton?.setBackgroundColor('#176B4D')
  }

  private submitAnswer(selectedAnswer: string | null): void {
    if (this.manager.hasSubmittedAnswer()) return

    const result = this.manager.evaluateAnswer(selectedAnswer)
    gameEventBridge.emit('question:answered', result)
    this.scene.start('FeedbackScene', {
      manager: this.manager,
      question: this.question,
      result,
    })
  }
}
