import type { LevelId, Question, TajwidOption, TajwidRule } from '~/types/game'
import type { QuestionSet } from '~/types/tajwid'

const QUESTION_LOADERS: Record<LevelId, () => Promise<{ default: unknown }>> = {
  1: () => import('./level-1-nun-sukun.json'),
  2: () => import('./level-2-mim-sukun.json'),
  3: () => import('./level-3-mad.json'),
  4: () => import('./level-4-qalqalah.json'),
  5: () => import('./level-5-review.json'),
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

export const isLevelId = (value: unknown): value is LevelId =>
  typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 5

const isTajwidOption = (value: unknown): value is TajwidOption =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.arabicName === 'string' &&
  typeof value.indonesianName === 'string'

const isTajwidRule = (value: unknown): value is TajwidRule => {
  if (!isRecord(value) || !isTajwidOption(value)) return false
  const record = value as unknown as Record<string, unknown>
  return typeof record.category === 'string' && typeof record.explanation === 'string'
}

export const isQuestion = (value: unknown): value is Question => {
  if (!isRecord(value) || !Array.isArray(value.highlightRange)) return false

  const [start, end] = value.highlightRange
  const correctAnswer = value.correctAnswer
  if (!isTajwidRule(correctAnswer)) return false

  return (
    typeof value.id === 'string' &&
    isLevelId(value.levelId) &&
    typeof value.verseText === 'string' &&
    typeof value.verseReference === 'string' &&
    value.highlightRange.length === 2 &&
    typeof start === 'number' &&
    typeof end === 'number' &&
    Number.isInteger(start) &&
    Number.isInteger(end) &&
    start >= 0 &&
    end > start &&
    end <= value.verseText.length &&
    Array.isArray(value.options) &&
    value.options.length >= 3 &&
    value.options.length <= 5 &&
    value.options.every(isTajwidOption) &&
    value.options.some((option) => option.id === correctAnswer.id)
  )
}

export const isQuestionSet = (value: unknown): value is QuestionSet =>
  isRecord(value) &&
  isLevelId(value.levelId) &&
  typeof value.levelName === 'string' &&
  Array.isArray(value.questions) &&
  value.questions.length >= 5 &&
  value.questions.every((question) => isQuestion(question) && question.levelId === value.levelId)

export class QuestionDataError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'QuestionDataError'
  }
}

export const loadQuestionSet = async (levelId: LevelId): Promise<QuestionSet> => {
  try {
    const module = await QUESTION_LOADERS[levelId]()
    if (!isQuestionSet(module.default)) {
      throw new QuestionDataError(`Question data for level ${levelId} is invalid.`)
    }
    return module.default
  } catch (error) {
    if (error instanceof QuestionDataError) throw error
    throw new QuestionDataError(`Unable to load question data for level ${levelId}.`, {
      cause: error,
    })
  }
}

export const getHighlightedText = (question: Question): string =>
  question.verseText.slice(question.highlightRange[0], question.highlightRange[1])
