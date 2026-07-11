import type { LevelId } from './game'

export interface Badge {
  id: string
  levelId: LevelId
  name: string
  description: string
  iconUrl: string
  /** ISO 8601 timestamp indicating when the badge was first earned. */
  unlockedAt: string
}

export interface LevelProgress {
  levelId: LevelId
  levelName: string
  completed: boolean
  completionPercentage: number
  questionsAnswered: number
  totalQuestions: number
  bestScore: number
}

export interface GameProgress {
  version: string
  levels: LevelProgress[]
  totalScore: number
  badges: Badge[]
  /** ISO 8601 timestamp for the player's most recent activity. */
  lastPlayed: string
}

export type StorageFailureCause =
  'quota_exceeded' | 'access_denied' | 'not_available' | 'invalid_data'

export interface StorageError {
  type: 'storage_failure'
  cause: StorageFailureCause
  message: string
  recoverable: boolean
}
