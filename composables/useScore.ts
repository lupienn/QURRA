import { computed, readonly } from 'vue'

import type { LevelId } from '~/types/game'

export const POINTS_PER_CORRECT_ANSWER = 10

export const scoreAnswer = (currentScore: number, isCorrect: boolean): number =>
  Math.max(0, Math.trunc(currentScore)) + (isCorrect ? POINTS_PER_CORRECT_ANSWER : 0)

export const aggregateScores = (scores: readonly number[]): number =>
  scores.reduce((total, score) => total + Math.max(0, Math.trunc(score)), 0)

export const useScore = () => {
  const { progress, setTotalScore } = useGameProgress()
  const levelAttemptScores = useState<Partial<Record<LevelId, number>>>(
    'qurra:level-attempt-scores',
    () => ({}),
  )

  const score = computed(() => progress.value.totalScore)

  const incrementScore = (levelId?: LevelId): number => {
    const nextScore = scoreAnswer(progress.value.totalScore, true)
    setTotalScore(nextScore)

    if (levelId !== undefined) {
      levelAttemptScores.value = {
        ...levelAttemptScores.value,
        [levelId]: scoreAnswer(levelAttemptScores.value[levelId] ?? 0, true),
      }
    }

    return nextScore
  }

  const applyAnswerScore = (isCorrect: boolean, levelId?: LevelId): number =>
    isCorrect ? incrementScore(levelId) : progress.value.totalScore

  const getTotalScore = (): number => progress.value.totalScore
  const getLevelAttemptScore = (levelId: LevelId): number => levelAttemptScores.value[levelId] ?? 0

  const resetLevelAttemptScore = (levelId: LevelId) => {
    levelAttemptScores.value = { ...levelAttemptScores.value, [levelId]: 0 }
  }

  return {
    score,
    levelAttemptScores: readonly(levelAttemptScores),
    incrementScore,
    applyAnswerScore,
    getTotalScore,
    getLevelAttemptScore,
    resetLevelAttemptScore,
  }
}
