import { readonly } from 'vue'

import type { LevelId } from '~/types/game'
import type { Badge, GameProgress, LevelProgress, StorageError } from '~/types/storage'

export const GAME_PROGRESS_STORAGE_KEY = 'qurra_game_progress'
export const GAME_PROGRESS_VERSION = '1.0.0'

const EMPTY_PROGRESS_DATE = new Date(0).toISOString()
const LEVEL_IDS: readonly LevelId[] = [1, 2, 3, 4, 5]

export const createEmptyProgress = (): GameProgress => ({
  version: GAME_PROGRESS_VERSION,
  levels: [],
  totalScore: 0,
  badges: [],
  lastPlayed: EMPTY_PROGRESS_DATE,
})

const cloneProgress = (progress: GameProgress): GameProgress => ({
  ...progress,
  levels: progress.levels.map((level) => ({ ...level })),
  badges: progress.badges.map((badge) => ({ ...badge })),
})

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isLevelId = (value: unknown): value is LevelId =>
  typeof value === 'number' && LEVEL_IDS.includes(value as LevelId)

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const isLevelProgress = (value: unknown): value is LevelProgress => {
  if (!isRecord(value)) return false

  return (
    isLevelId(value.levelId) &&
    typeof value.levelName === 'string' &&
    typeof value.completed === 'boolean' &&
    isFiniteNumber(value.completionPercentage) &&
    isFiniteNumber(value.questionsAnswered) &&
    isFiniteNumber(value.totalQuestions) &&
    isFiniteNumber(value.bestScore)
  )
}

const isBadge = (value: unknown): value is Badge => {
  if (!isRecord(value)) return false

  return (
    typeof value.id === 'string' &&
    isLevelId(value.levelId) &&
    typeof value.name === 'string' &&
    typeof value.description === 'string' &&
    typeof value.iconUrl === 'string' &&
    typeof value.unlockedAt === 'string'
  )
}

export const isGameProgress = (value: unknown): value is GameProgress => {
  if (!isRecord(value)) return false

  return (
    typeof value.version === 'string' &&
    Array.isArray(value.levels) &&
    value.levels.every(isLevelProgress) &&
    isFiniteNumber(value.totalScore) &&
    Array.isArray(value.badges) &&
    value.badges.every(isBadge) &&
    typeof value.lastPlayed === 'string'
  )
}

const isDomException = (error: unknown): error is DOMException =>
  typeof DOMException !== 'undefined' && error instanceof DOMException

const createStorageError = (error: unknown): StorageError => {
  if (
    isDomException(error) &&
    (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  ) {
    return {
      type: 'storage_failure',
      cause: 'quota_exceeded',
      message: 'Penyimpanan browser penuh. Hapus sebagian data browser lalu coba lagi.',
      recoverable: true,
    }
  }

  if (isDomException(error) && error.name === 'SecurityError') {
    return {
      type: 'storage_failure',
      cause: 'access_denied',
      message: 'Browser menolak akses penyimpanan. Progres hanya tersimpan untuk sesi ini.',
      recoverable: true,
    }
  }

  return {
    type: 'storage_failure',
    cause: 'not_available',
    message: 'Penyimpanan browser tidak tersedia. Progres hanya tersimpan untuk sesi ini.',
    recoverable: true,
  }
}

const createInvalidDataError = (): StorageError => ({
  type: 'storage_failure',
  cause: 'invalid_data',
  message: 'Data progres tersimpan tidak valid dan diabaikan.',
  recoverable: true,
})

export class InvalidProgressDataError extends Error {
  constructor() {
    super('Stored game progress does not match the expected schema.')
    this.name = 'InvalidProgressDataError'
  }
}

export const loadProgressFromStorage = (
  storage: Pick<Storage, 'getItem'>,
  fallback: GameProgress = createEmptyProgress(),
): GameProgress => {
  const serialized = storage.getItem(GAME_PROGRESS_STORAGE_KEY)
  if (serialized === null) return cloneProgress(fallback)

  const parsed: unknown = JSON.parse(serialized)
  if (!isGameProgress(parsed)) throw new InvalidProgressDataError()

  return cloneProgress(parsed)
}

export const saveProgressToStorage = (
  storage: Pick<Storage, 'setItem'>,
  progress: GameProgress,
): void => {
  storage.setItem(GAME_PROGRESS_STORAGE_KEY, JSON.stringify(progress))
}

export const useLocalStorage = () => {
  const memoryProgress = useState<GameProgress | null>('qurra:memory-progress', () => null)
  const storageError = useState<StorageError | null>('qurra:storage-error', () => null)

  const setMemoryProgress = (progress: GameProgress): GameProgress => {
    memoryProgress.value = cloneProgress(progress)
    return cloneProgress(progress)
  }

  const getBrowserStorage = (): Storage | null => {
    if (import.meta.server) return null

    try {
      return window.localStorage
    } catch (error) {
      storageError.value = createStorageError(error)
      return null
    }
  }

  const loadProgress = (): GameProgress => {
    const fallback = memoryProgress.value ?? createEmptyProgress()
    const storage = getBrowserStorage()

    // Server rendering intentionally uses request-scoped memory without a warning.
    if (!storage) {
      if (import.meta.client && !storageError.value) {
        storageError.value = createStorageError(null)
      }

      return setMemoryProgress(fallback)
    }

    try {
      const parsed = loadProgressFromStorage(storage, fallback)
      storageError.value = null
      return setMemoryProgress(parsed)
    } catch (error) {
      storageError.value =
        error instanceof SyntaxError || error instanceof InvalidProgressDataError
          ? createInvalidDataError()
          : createStorageError(error)
      return setMemoryProgress(fallback)
    }
  }

  const saveProgress = (progress: GameProgress): boolean => {
    setMemoryProgress(progress)
    const storage = getBrowserStorage()

    if (!storage) {
      if (import.meta.client && !storageError.value) {
        storageError.value = createStorageError(null)
      }
      return false
    }

    try {
      saveProgressToStorage(storage, progress)
      storageError.value = null
      return true
    } catch (error) {
      storageError.value = createStorageError(error)
      return false
    }
  }

  const clearStorageError = () => {
    storageError.value = null
  }

  return {
    storageError: readonly(storageError),
    loadProgress,
    saveProgress,
    clearStorageError,
  }
}
