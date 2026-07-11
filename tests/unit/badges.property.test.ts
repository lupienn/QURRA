import { describe, expect, it } from 'vitest'
import fc from 'fast-check'

import { createLevelBadge } from '~/composables/useBadges'
import type { LevelId } from '~/types/game'

describe('Property 4: level-badge mapping consistency', () => {
  it('maps every playable level to a badge with the same level id', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 5 }), (rawLevelId) => {
        const levelId = rawLevelId as LevelId
        expect(createLevelBadge(levelId)?.levelId).toBe(levelId)
      }),
      { numRuns: 100 },
    )
  })
})
