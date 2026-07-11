import type { LevelConfig } from '~/types/tajwid'

export const LEVEL_CONFIGS = [
  {
    id: 1,
    name: 'Nun Sukun & Tanwin',
    description: 'Kenali Izhar, Idgham, Iqlab, dan Ikhfa melalui contoh ayat.',
    tajwidCategory: 'nun_sukun_tanwin',
    backgroundTheme: 'desert-dawn',
    questionCount: 10,
    pointsPerQuestion: 10,
    badgeReward: {
      id: 'badge-level-1',
      name: 'Penjelajah Nun',
      description: 'Menuntaskan petualangan Nun Sukun dan Tanwin.',
      iconUrl: '/badges/nun-sukun.svg',
      unlockCondition: { type: 'level_completion', levelId: 1 },
    },
  },
  {
    id: 2,
    name: 'Mim Sukun',
    description: 'Latih Izhar Syafawi, Ikhfa Syafawi, dan Idgham Mimi.',
    tajwidCategory: 'mim_sukun',
    backgroundTheme: 'oasis',
    questionCount: 10,
    pointsPerQuestion: 10,
    badgeReward: {
      id: 'badge-level-2',
      name: 'Sahabat Mim',
      description: 'Menuntaskan petualangan Mim Sukun.',
      iconUrl: '/badges/mim-sukun.svg',
      unlockCondition: { type: 'level_completion', levelId: 2 },
    },
  },
  {
    id: 3,
    name: 'Mad',
    description: 'Bedakan panjang bacaan Mad Thabi’i dan berbagai cabangnya.',
    tajwidCategory: 'mad',
    backgroundTheme: 'night-sky',
    questionCount: 10,
    pointsPerQuestion: 10,
    badgeReward: {
      id: 'badge-level-3',
      name: 'Penjaga Mad',
      description: 'Menuntaskan petualangan panjang bacaan Mad.',
      iconUrl: '/badges/mad.svg',
      unlockCondition: { type: 'level_completion', levelId: 3 },
    },
  },
  {
    id: 4,
    name: 'Qalqalah',
    description: 'Temukan pantulan bunyi pada huruf ق ط ب ج د.',
    tajwidCategory: 'qalqalah',
    backgroundTheme: 'mountain-pass',
    questionCount: 10,
    pointsPerQuestion: 10,
    badgeReward: {
      id: 'badge-level-4',
      name: 'Gema Qalqalah',
      description: 'Menuntaskan petualangan Qalqalah.',
      iconUrl: '/badges/qalqalah.svg',
      unlockCondition: { type: 'level_completion', levelId: 4 },
    },
  },
  {
    id: 5,
    name: 'Review Tajwid',
    description: 'Uji pemahamanmu melalui campuran seluruh materi sebelumnya.',
    tajwidCategory: 'review',
    backgroundTheme: 'golden-city',
    questionCount: 10,
    pointsPerQuestion: 10,
    badgeReward: {
      id: 'badge-level-5',
      name: 'Bintang QURRA',
      description: 'Menuntaskan seluruh rangkaian review tajwid.',
      iconUrl: '/badges/review.svg',
      unlockCondition: { type: 'level_completion', levelId: 5 },
    },
  },
] as const satisfies readonly LevelConfig[]

export const getLevelConfig = (levelId: number) =>
  LEVEL_CONFIGS.find((level) => level.id === levelId)

export const getLevelRoute = (levelId: number): string => `/game/${levelId}`
