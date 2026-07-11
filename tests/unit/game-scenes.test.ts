import { describe, expect, it } from 'vitest'
import fc from 'fast-check'

import level1 from '~/content/questions/level-1-nun-sukun.json'
import { isQuestionSet } from '~/content/questions'
import { GAME_ASSETS, getAssetLoadErrorMessage } from '~/game/assets'
import { calculateCanvasSize, GAME_ASPECT_RATIO } from '~/game/dimensions'
import { getFeedbackContent } from '~/game/feedback'
import { QuestionManager } from '~/game/systems/QuestionManager'
import type { Question } from '~/types/game'

if (!isQuestionSet(level1)) throw new Error('Level 1 fixture is invalid.')
const questions = level1.questions as unknown as Question[]

describe('game scene support behavior', () => {
  it('BootScene declares every required visual asset', () => {
    expect(GAME_ASSETS.map((asset) => asset.key)).toEqual([
      'qurra-player',
      'desert-background',
      'reward-star',
      'lantern',
    ])
  })

  it('BootScene produces a recoverable asset-specific error message', () => {
    expect(getAssetLoadErrorMessage('qurra-player')).toContain('qurra-player')
  })

  it('GameScene input can initialize a manager with level data', async () => {
    const manager = await QuestionManager.create(1)
    expect(manager.getQuestionCount()).toBe(10)
    expect(manager.getCurrentQuestion().levelId).toBe(1)
  })

  it('Property 9: every answer receives appropriate feedback content', () => {
    fc.assert(
      fc.property(fc.constantFrom(...questions), fc.boolean(), (question, isCorrect) => {
        const feedback = getFeedbackContent(question, {
          questionId: question.id,
          selectedAnswer: isCorrect ? question.correctAnswer.id : null,
          correctAnswer: question.correctAnswer.id,
          isCorrect,
          pointsAwarded: isCorrect ? 10 : 0,
          timestamp: new Date(0).toISOString(),
        })
        expect(feedback.title.length).toBeGreaterThan(0)
        expect(feedback.explanation.length).toBeGreaterThan(0)
      }),
      { numRuns: 100 },
    )
  })

  it('Property 20: canvas scaling preserves the 16:9 aspect ratio', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 4_000 }), (availableWidth) => {
        const size = calculateCanvasSize(availableWidth)
        expect(size.width / size.height).toBeCloseTo(GAME_ASPECT_RATIO, 2)
      }),
      { numRuns: 100 },
    )
  })
})
