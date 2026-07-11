import { describe, expect, it } from 'vitest'
import fc from 'fast-check'

import { loadProgressFromStorage, saveProgressToStorage } from '~/composables/useLocalStorage'
import type { LevelId } from '~/types/game'
import type { GameProgress } from '~/types/storage'

class MemoryStorage {
  private readonly values = new Map<string, string>()

  getItem(key: string): string | null {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value)
  }
}

const levelIdArbitrary = fc.integer({ min: 1, max: 5 }).map((id) => id as LevelId)
const isoDateArbitrary = fc
  .integer({ min: 0, max: 2_000_000_000 })
  .map((seconds) => new Date(seconds * 1000).toISOString())

const progressArbitrary: fc.Arbitrary<GameProgress> = fc.record({
  version: fc.constant('1.0.0'),
  levels: fc.array(
    fc.record({
      levelId: levelIdArbitrary,
      levelName: fc.string(),
      completed: fc.boolean(),
      completionPercentage: fc.integer({ min: 0, max: 100 }),
      questionsAnswered: fc.integer({ min: 0, max: 10 }),
      totalQuestions: fc.constant(10),
      bestScore: fc.nat({ max: 100 }),
    }),
    { maxLength: 5 },
  ),
  totalScore: fc.nat({ max: 100_000 }),
  badges: fc.array(
    fc.record({
      id: fc.uuid(),
      levelId: levelIdArbitrary,
      name: fc.string(),
      description: fc.string(),
      iconUrl: fc.webPath(),
      unlockedAt: isoDateArbitrary,
    }),
    { maxLength: 5 },
  ),
  lastPlayed: isoDateArbitrary,
})

describe('Property 3: localStorage persistence round-trip', () => {
  it('loads the same valid progress object that was saved', () => {
    fc.assert(
      fc.property(progressArbitrary, (progress) => {
        const storage = new MemoryStorage()
        saveProgressToStorage(storage, progress)

        expect(loadProgressFromStorage(storage)).toEqual(progress)
      }),
      { numRuns: 100 },
    )
  })
})
