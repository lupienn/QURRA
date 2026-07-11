import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ProgressBar from '~/components/ui/ProgressBar.vue'

describe('ProgressBar', () => {
  it.each([
    { input: 0, expected: 0 },
    { input: 42.4, expected: 42.4 },
    { input: 100, expected: 100 },
    { input: -20, expected: 0 },
    { input: 140, expected: 100 },
    { input: Number.NaN, expected: 0 },
  ])('renders $input as a clamped $expected percent fill', ({ input, expected }) => {
    const wrapper = mount(ProgressBar, { props: { percentage: input, label: 'Progres' } })

    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuenow')).toBe(
      String(Math.round(expected)),
    )
    expect(wrapper.get('[data-testid="progress-fill"]').attributes('style')).toContain(
      `width: ${expected}%`,
    )
  })
})
