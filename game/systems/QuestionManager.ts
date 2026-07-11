import { loadQuestionSet } from '~/content/questions'
import type { LevelId, Question, QuestionResult } from '~/types/game'

export class AnswerAlreadySubmittedError extends Error {
  constructor(questionId: string) {
    super(`Question ${questionId} already has a submitted answer.`)
    this.name = 'AnswerAlreadySubmittedError'
  }
}

export class QuestionManager {
  private currentIndex = 0
  private submitted = false
  private correctAnswers = 0

  constructor(private readonly questions: readonly Question[]) {
    if (questions.length === 0) throw new Error('QuestionManager requires at least one question.')
  }

  static async create(levelId: LevelId): Promise<QuestionManager> {
    const questionSet = await loadQuestionSet(levelId)
    return new QuestionManager(questionSet.questions)
  }

  getCurrentQuestion(): Question {
    const question = this.questions[this.currentIndex]
    if (!question) throw new Error('Current question is outside the available sequence.')
    return question
  }

  getCurrentIndex(): number {
    return this.currentIndex
  }

  getQuestionNumber(): number {
    return this.currentIndex + 1
  }

  getQuestionCount(): number {
    return this.questions.length
  }

  isLastQuestion(): boolean {
    return this.currentIndex === this.questions.length - 1
  }

  hasSubmittedAnswer(): boolean {
    return this.submitted
  }

  evaluateAnswer(selectedAnswer: string | null): QuestionResult {
    const question = this.getCurrentQuestion()
    if (this.submitted) throw new AnswerAlreadySubmittedError(question.id)

    this.submitted = true
    const isCorrect = selectedAnswer !== null && selectedAnswer === question.correctAnswer.id
    if (isCorrect) this.correctAnswers += 1

    return {
      questionId: question.id,
      selectedAnswer,
      correctAnswer: question.correctAnswer.id,
      isCorrect,
      pointsAwarded: isCorrect ? 10 : 0,
      timestamp: new Date().toISOString(),
    }
  }

  getNextQuestion(): Question | null {
    if (this.currentIndex >= this.questions.length - 1) return null

    this.currentIndex += 1
    this.submitted = false
    return this.getCurrentQuestion()
  }

  getScore(): number {
    return this.correctAnswers * 10
  }

  reset(): void {
    this.currentIndex = 0
    this.submitted = false
    this.correctAnswers = 0
  }
}
