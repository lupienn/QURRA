import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import PhaserContainer from '~/components/game/PhaserContainer.vue'

vi.mock('~/game/config', () => ({
  createGameConfig: vi.fn(() => ({ scene: [] })),
}))

const gameInstances: FakeGame[] = []

class FakeGame {
  readonly registry = { set: vi.fn() }
  readonly scale = { resize: vi.fn(), refresh: vi.fn() }
  readonly destroy = vi.fn()
  readonly events = {
    once: vi.fn((_event: string, callback: () => void) => queueMicrotask(callback)),
  }

  constructor(_config: unknown) {
    gameInstances.push(this)
  }
}

class FakeResizeObserver {
  observe = vi.fn()
  disconnect = vi.fn()
}

const bridge = {
  connectToGame: vi.fn(),
  disconnect: vi.fn(),
  emit: vi.fn(),
  on: vi.fn(() => vi.fn()),
}

describe('PhaserContainer lifecycle', () => {
  beforeEach(() => {
    gameInstances.length = 0
    vi.clearAllMocks()
    vi.stubGlobal('ResizeObserver', FakeResizeObserver)
    vi.stubGlobal('usePhaserBridge', () => bridge)
    vi.stubGlobal('useNuxtApp', () => ({
      $loadPhaser: vi.fn(async () => ({
        Game: FakeGame,
        Core: { Events: { READY: 'ready' } },
      })),
    }))
  })

  it('initializes Phaser on mount and destroys it on unmount', async () => {
    const wrapper = mount(PhaserContainer, {
      props: { levelId: 1 },
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } },
    })
    await flushPromises()

    expect(gameInstances).toHaveLength(1)
    expect(bridge.connectToGame).toHaveBeenCalledOnce()
    expect(wrapper.emitted('ready')).toHaveLength(1)

    const instance = gameInstances[0]
    wrapper.unmount()
    expect(instance?.destroy).toHaveBeenCalledWith(true)
    expect(bridge.disconnect).toHaveBeenCalled()
  })

  it('shows fallback UI when initialization fails', async () => {
    vi.stubGlobal('useNuxtApp', () => ({
      $loadPhaser: vi.fn(async () => Promise.reject(new Error('WebGL unavailable'))),
    }))

    const wrapper = mount(PhaserContainer, {
      props: { levelId: 1 },
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } },
    })
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toContain('Game tidak dapat dijalankan')
  })
})
