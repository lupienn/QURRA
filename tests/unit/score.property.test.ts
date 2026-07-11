import { describe, expect, it } from 'vitest'
import fc from 'fast-check'

import { POINTS_PER_CORRECT_ANSWER, aggregateScores, scoreAnswer } from '~/composables/useScore'

describe('score correctness properties', () => {
  it('Property 1: adds exactly ten points for every correct answer', () => {
    fc.assert(
      fc.property(fc.nat({ max: 1_000_000 }), (initialScore) => {
        expect(scoreAnswer(initialScore, true)).toBe(initialScore + POINTS_PER_CORRECT_ANSWER)
      }),
      { numRuns: 100 },
    )
  })

  it('Property 2: leaves score unchanged for every incorrect answer', () => {
    fc.assert(
      fc.property(fc.nat({ max: 1_000_000 }), (initialScore) => {
        expect(scoreAnswer(initialScore, false)).toBe(initialScore)
      }),
      { numRuns: 100 },
    )
  })

  it('Property 12: aggregates every level score into the displayed total', () => {
    fc.assert(
      fc.property(fc.array(fc.nat({ max: 10_000 }), { maxLength: 5 }), (scores) => {
        expect(aggregateScores(scores)).toBe(scores.reduce((total, score) => total + score, 0))
      }),
      { numRuns: 100 },
    )
  })
})
