import { describe, expect, it } from 'vitest'
import fc from 'fast-check'

import level1 from '~/content/questions/level-1-nun-sukun.json'
import level2 from '~/content/questions/level-2-mim-sukun.json'
import level3 from '~/content/questions/level-3-mad.json'
import level4 from '~/content/questions/level-4-qalqalah.json'
import level5 from '~/content/questions/level-5-review.json'
import { getHighlightedText, isQuestionSet } from '~/content/questions'
import type { Question } from '~/types/game'

const rawQuestionSets: unknown[] = [level1, level2, level3, level4, level5]
const questions = rawQuestionSets.flatMap((set) => (isQuestionSet(set) ? set.questions : []))

describe('question content correctness properties', () => {
  it('Property 18: every file conforms to QuestionSet and contains ten questions', () => {
    expect(rawQuestionSets).toHaveLength(5)
    for (const questionSet of rawQuestionSets) {
      expect(isQuestionSet(questionSet)).toBe(true)
      if (isQuestionSet(questionSet)) expect(questionSet.questions).toHaveLength(10)
    }
  })

  it('Property 15: every question exposes between three and five options', () => {
    fc.assert(
      fc.property(fc.constantFrom(...questions), (question) => {
        expect(question.options.length).toBeGreaterThanOrEqual(3)
        expect(question.options.length).toBeLessThanOrEqual(5)
      }),
      { numRuns: 100 },
    )
  })

  it('Property 17: every highlight range selects non-empty source text', () => {
    fc.assert(
      fc.property(fc.constantFrom(...questions), (question) => {
        const highlighted = getHighlightedText(question as Question)
        expect(highlighted.length).toBeGreaterThan(0)
        expect(question.verseText).toContain(highlighted)
      }),
      { numRuns: 100 },
    )
  })

  it('Property 19: every explanation contains at most three sentences', () => {
    fc.assert(
      fc.property(fc.constantFrom(...questions), (question) => {
        const sentenceCount = question.correctAnswer.explanation
          .split(/[.!?]+/u)
          .filter((sentence) => sentence.trim().length > 0).length
        expect(sentenceCount).toBeLessThanOrEqual(3)
      }),
      { numRuns: 100 },
    )
  })
})
