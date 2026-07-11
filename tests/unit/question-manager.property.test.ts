import { describe, expect, it } from 'vitest'
import fc from 'fast-check'

import level1 from '~/content/questions/level-1-nun-sukun.json'
import { isQuestionSet } from '~/content/questions'
import { AnswerAlreadySubmittedError, QuestionManager } from '~/game/systems/QuestionManager'
import type { Question } from '~/types/game'

if (!isQuestionSet(level1)) throw new Error('Level 1 fixture is invalid.')

const questions = level1.questions

describe('QuestionManager correctness properties', () => {
  it('Property 7: answer is correct iff selected id matches the correct id', () => {
    fc.assert(
      fc.property(fc.constantFrom(...questions), fc.string(), (question, answerId) => {
        const manager = new QuestionManager([question])
        expect(manager.evaluateAnswer(answerId).isCorrect).toBe(
          answerId === question.correctAnswer.id,
        )
      }),
      { numRuns: 100 },
    )
  })

  it('Property 8: rejects every submission after the first', () => {
    fc.assert(
      fc.property(fc.constantFrom(...questions), (question) => {
        const manager = new QuestionManager([question])
        manager.evaluateAnswer(null)
        expect(() => manager.evaluateAnswer(question.correctAnswer.id)).toThrow(
          AnswerAlreadySubmittedError,
        )
      }),
      { numRuns: 100 },
    )
  })

  it('Property 6 and 16: preserves sequence and exact verse text', () => {
    const manager = new QuestionManager(questions as Question[])
    const visited = [manager.getCurrentQuestion().verseText]
    while (manager.getNextQuestion()) visited.push(manager.getCurrentQuestion().verseText)

    expect(visited).toEqual(questions.map((question) => question.verseText))
  })

  it('Property 10: progresses to the next question until the final item', () => {
    const manager = new QuestionManager(questions as Question[])
    for (let index = 0; index < questions.length; index += 1) {
      expect(manager.getCurrentIndex()).toBe(index)
      manager.evaluateAnswer(null)
      const next = manager.getNextQuestion()
      expect(next === null).toBe(index === questions.length - 1)
    }
  })
})
