import { describe, expect, it } from 'vitest'
import fc from 'fast-check'

import { calculateProgressPercentage } from '~/composables/useGameProgress'

describe('Property 5: progress percentage calculation', () => {
  it('equals answered questions divided by total questions times 100', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 1_000 }), fc.nat(), (total, rawAnswered) => {
        const answered = rawAnswered % (total + 1)
        expect(calculateProgressPercentage(answered, total)).toBeCloseTo(
          (answered / total) * 100,
          10,
        )
      }),
      { numRuns: 100 },
    )
  })
})
