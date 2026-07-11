/** The five playable levels defined by the product requirements. */
export type LevelId = 1 | 2 | 3 | 4 | 5

/** A complete tajwid rule used as the canonical answer and feedback source. */
export interface TajwidRule {
  id: string
  arabicName: string
  indonesianName: string
  category: string
  explanation: string
}

/** The compact rule representation displayed as a multiple-choice option. */
export type TajwidOption = Pick<TajwidRule, 'id' | 'arabicName' | 'indonesianName'>

export interface Question {
  id: string
  levelId: LevelId
  verseText: string
  verseReference: string
  /** Inclusive start and exclusive end offsets within verseText. */
  highlightRange: readonly [start: number, end: number]
  correctAnswer: TajwidRule
  options: TajwidOption[]
}

export interface QuestionResult {
  questionId: string
  /** Null represents an explicit skip, which is evaluated as incorrect. */
  selectedAnswer: string | null
  correctAnswer: string
  isCorrect: boolean
  pointsAwarded: number
  timestamp: string
}

export interface GameEvents {
  // Vue to Phaser
  'game:start': { levelId: LevelId }
  'game:pause': undefined
  'game:resume': undefined
  'game:reset': undefined
  'game:ready': { levelId: LevelId }
  'game:error': { message: string; recoverable: boolean }

  // Phaser to Vue
  'question:answered': QuestionResult
  'level:completed': { levelId: LevelId; finalScore: number }
  'score:updated': { newScore: number }
  'animation:complete': { animationType: string }
}

export type GameEventName = keyof GameEvents
export type GameEventHandler<Event extends GameEventName> = (payload: GameEvents[Event]) => void

/** Type-safe communication contract shared by the Vue and Phaser layers. */
export interface EventBridge {
  emit<Event extends GameEventName>(event: Event, payload: GameEvents[Event]): void
  on<Event extends GameEventName>(event: Event, handler: GameEventHandler<Event>): void
  off<Event extends GameEventName>(event: Event, handler: GameEventHandler<Event>): void
}
