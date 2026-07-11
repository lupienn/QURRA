import { describe, expect, it, vi } from 'vitest'

import { EventBridge } from '~/game/bridge/EventBridge'

describe('Phaser-Vue EventBridge integration', () => {
  it('delivers Phaser events to Vue listeners', () => {
    const bridge = new EventBridge()
    const listener = vi.fn()
    bridge.on('question:answered', listener)

    bridge.emit('question:answered', {
      questionId: 'q1',
      selectedAnswer: 'ikhfa',
      correctAnswer: 'ikhfa',
      isCorrect: true,
      pointsAwarded: 10,
      timestamp: new Date(0).toISOString(),
    })

    expect(listener).toHaveBeenCalledOnce()
  })

  it('delivers Vue commands to Phaser listeners', () => {
    const bridge = new EventBridge()
    const listener = vi.fn()
    bridge.on('game:start', listener)
    bridge.emit('game:start', { levelId: 3 })
    expect(listener).toHaveBeenCalledWith({ levelId: 3 })
  })

  it('removes subscriptions and clears all listeners on disconnect', () => {
    const bridge = new EventBridge()
    const listener = vi.fn()
    bridge.on('game:ready', listener)
    bridge.off('game:ready', listener)
    bridge.emit('game:ready', { levelId: 1 })
    expect(listener).not.toHaveBeenCalled()

    bridge.on('game:ready', listener)
    bridge.clear()
    expect(bridge.listenerCount('game:ready')).toBe(0)
  })
})
