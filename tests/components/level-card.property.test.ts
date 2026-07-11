import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import fc from 'fast-check'

import LevelCard from '~/components/ui/LevelCard.vue'
import { LEVEL_CONFIGS, getLevelRoute } from '~/game/levels'
import type { LevelId } from '~/types/game'
import type { LevelProgress } from '~/types/storage'

const progress: LevelProgress = {
  levelId: 1,
  levelName: 'Nun Sukun & Tanwin',
  completed: false,
  completionPercentage: 0,
  questionsAnswered: 0,
  totalQuestions: 10,
  bestScore: 0,
}

describe('LevelCard correctness properties', () => {
  it('Property 21: exposes a minimum 44px touch target utility', () => {
    const wrapper = mount(LevelCard, {
      props: { level: LEVEL_CONFIGS[0], progress },
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          ProgressBar: true,
        },
      },
    })

    expect(wrapper.get('[data-level-id="1"]').classes()).toContain('min-h-11')
  })

  it('Property 14: maps every level id to its game route', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 5 }), (value) => {
        const levelId = value as LevelId
        expect(getLevelRoute(levelId)).toBe(`/game/${levelId}`)
      }),
      { numRuns: 100 },
    )
  })
})
