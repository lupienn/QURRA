import type { Question, QuestionResult } from '~/types/game'

export const getFeedbackContent = (question: Question, result: QuestionResult) =>
  result.isCorrect
    ? {
        title: 'Benar! Luar biasa!',
        explanation: 'Langkahmu makin dekat ke lencana level ini.',
      }
    : {
        title: `Jawaban tepat: ${question.correctAnswer.indonesianName}`,
        explanation: question.correctAnswer.explanation,
      }
