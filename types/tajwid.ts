import type { LevelId, Question } from './game'

export type TajwidCategory = 'nun_sukun_tanwin' | 'mim_sukun' | 'mad' | 'qalqalah' | 'review'

export interface QuestionSet {
  levelId: LevelId
  levelName: string
  questions: Question[]
}

export type BadgeConditionType = 'level_completion' | 'score_threshold' | 'streak' | 'perfect_score'

export interface BadgeCondition {
  type: BadgeConditionType
  levelId?: LevelId
  scoreRequired?: number
  streakRequired?: number
}

export interface BadgeConfig {
  id: string
  name: string
  description: string
  iconUrl: string
  unlockCondition: BadgeCondition
}

export interface LevelConfig {
  id: LevelId
  name: string
  description: string
  tajwidCategory: TajwidCategory
  backgroundTheme: string
  questionCount: number
  pointsPerQuestion: number
  badgeReward: BadgeConfig
}

/** Human review metadata used before educational content is released. */
export interface ContentReview {
  reviewerName: string
  reviewedAt: string
  approved: boolean
  notes?: string
}
