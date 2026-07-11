import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import fc from 'fast-check'

import BadgeDisplay from '~/components/ui/BadgeDisplay.vue'
import type { LevelId } from '~/types/game'
import type { Badge } from '~/types/storage'

const badgeArbitrary: fc.Arbitrary<Badge> = fc.record({
  id: fc.uuid(),
  levelId: fc.integer({ min: 1, max: 5 }).map((value) => value as LevelId),
  name: fc.string({ minLength: 1, maxLength: 30 }),
  description: fc.string({ minLength: 1, maxLength: 80 }),
  iconUrl: fc.constant('/badges/review.svg'),
  unlockedAt: fc.constant(new Date(0).toISOString()),
})

describe('Property 11: badge display completeness', () => {
  it('renders every earned badge exactly once', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(badgeArbitrary, { selector: (badge) => badge.id, maxLength: 5 }),
        (badges) => {
          const wrapper = mount(BadgeDisplay, { props: { badges } })
          expect(wrapper.findAll('[data-badge-id]')).toHaveLength(badges.length)
          for (const badge of badges) {
            expect(wrapper.findAll(`[data-badge-id="${badge.id}"]`)).toHaveLength(1)
          }
          wrapper.unmount()
        },
      ),
      { numRuns: 100 },
    )
  })
})
