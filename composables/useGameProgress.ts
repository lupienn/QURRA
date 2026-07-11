import { readonly } from 'vue'

import { LEVEL_CONFIGS } from '~/game/levels'
import type { LevelId } from '~/types/game'
import type { Badge, GameProgress, LevelProgress } from '~/types/storage'

import { GAME_PROGRESS_VERSION, useLocalStorage } from './useLocalStorage'

export const calculateProgressPercentage = (
  questionsAnswered: number,
  totalQuestions: number,
): number => {
  if (!Number.isFinite(totalQuestions) || totalQuestions <= 0) return 0

  const answered = Number.isFinite(questionsAnswered) ? questionsAnswered : 0
  return Math.min(100, Math.max(0, (answered / totalQuestions) * 100))
}

const createLevelProgress = (levelId: LevelId): LevelProgress => {
  const config = LEVEL_CONFIGS.find((level) => level.id === levelId)
  if (!config) throw new Error(`Unknown level: ${levelId}`)

  return {
    levelId,
    levelName: config.name,
    completed: false,
    completionPercentage: 0,
    questionsAnswered: 0,
    totalQuestions: config.questionCount,
    bestScore: 0,
  }
}

export const createDefaultGameProgress = (): GameProgress => ({
  version: GAME_PROGRESS_VERSION,
  levels: LEVEL_CONFIGS.map((level) => createLevelProgress(level.id)),
  totalScore: 0,
  badges: [],
  lastPlayed: new Date(0).toISOString(),
})

export const normalizeGameProgress = (stored: GameProgress): GameProgress => ({
  version: GAME_PROGRESS_VERSION,
  levels: LEVEL_CONFIGS.map((config) => {
    const fallback = createLevelProgress(config.id)
    const existing = stored.levels.find((level) => level.levelId === config.id)
    if (!existing) return fallback

    const questionsAnswered = Math.min(
      config.questionCount,
      Math.max(0, Math.trunc(existing.questionsAnswered)),
    )

    return {
      ...fallback,
      ...existing,
      levelName: config.name,
      questionsAnswered,
      totalQuestions: config.questionCount,
      completionPercentage: existing.completed
        ? 100
        : calculateProgressPercentage(questionsAnswered, config.questionCount),
      bestScore: Math.max(0, Math.trunc(existing.bestScore)),
    }
  }),
  totalScore: Math.max(0, Math.trunc(stored.totalScore)),
  badges: stored.badges.filter((badge) =>
    LEVEL_CONFIGS.some((level) => level.id === badge.levelId),
  ),
  lastPlayed: stored.lastPlayed,
})

export const useGameProgress = () => {
  const { loadProgress, saveProgress, storageError } = useLocalStorage()
  const progress = useState<GameProgress>('qurra:game-progress', createDefaultGameProgress)
  const initialized = useState<boolean>('qurra:game-progress-initialized', () => false)

  if (import.meta.client && !initialized.value) {
    progress.value = normalizeGameProgress(loadProgress())
    initialized.value = true
  }

  const commit = (next: GameProgress): boolean => {
    progress.value = {
      ...normalizeGameProgress(next),
      lastPlayed: new Date().toISOString(),
    }
    return saveProgress(progress.value)
  }

  const getLevelProgress = (levelId: LevelId) =>
    progress.value.levels.find((level) => level.levelId === levelId)

  const updateLevelProgress = (
    levelId: LevelId,
    updates: Partial<Omit<LevelProgress, 'levelId'>>,
  ): boolean => {
    const levels = progress.value.levels.map((level) =>
      level.levelId === levelId ? { ...level, ...updates, levelId } : level,
    )
    return commit({ ...progress.value, levels })
  }

  const recordQuestionAnswered = (levelId: LevelId): boolean => {
    const level = getLevelProgress(levelId)
    if (!level) return false

    const questionsAnswered = Math.min(level.totalQuestions, level.questionsAnswered + 1)
    return updateLevelProgress(levelId, {
      questionsAnswered,
      completionPercentage: calculateProgressPercentage(questionsAnswered, level.totalQuestions),
    })
  }

  const markLevelComplete = (levelId: LevelId, bestScore?: number): boolean => {
    const level = getLevelProgress(levelId)
    if (!level) return false

    return updateLevelProgress(levelId, {
      completed: true,
      questionsAnswered: level.totalQuestions,
      completionPercentage: 100,
      bestScore: Math.max(level.bestScore, Math.max(0, Math.trunc(bestScore ?? 0))),
    })
  }

  const setTotalScore = (totalScore: number): boolean =>
    commit({ ...progress.value, totalScore: Math.max(0, Math.trunc(totalScore)) })

  const addBadge = (badge: Badge): boolean => {
    if (progress.value.badges.some((earned) => earned.id === badge.id)) return false
    return commit({ ...progress.value, badges: [...progress.value.badges, badge] })
  }

  const resetProgress = (): boolean => commit(createDefaultGameProgress())

  return {
    progress: readonly(progress),
    storageError,
    getLevelProgress,
    updateLevelProgress,
    recordQuestionAnswered,
    markLevelComplete,
    setTotalScore,
    addBadge,
    resetProgress,
  }
}
