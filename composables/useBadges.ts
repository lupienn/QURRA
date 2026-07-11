import { computed, readonly } from 'vue'

import { LEVEL_CONFIGS } from '~/game/levels'
import type { LevelId } from '~/types/game'
import type { Badge } from '~/types/storage'
import type { BadgeConfig } from '~/types/tajwid'

export const BADGE_DEFINITIONS: readonly BadgeConfig[] = LEVEL_CONFIGS.map(
  (level) => level.badgeReward,
)

export const getBadgeDefinition = (levelId: LevelId): BadgeConfig | undefined =>
  BADGE_DEFINITIONS.find((badge) => badge.unlockCondition.levelId === levelId)

export const createLevelBadge = (
  levelId: LevelId,
  unlockedAt = new Date().toISOString(),
): Badge | null => {
  const definition = getBadgeDefinition(levelId)
  if (!definition) return null

  return {
    id: definition.id,
    levelId,
    name: definition.name,
    description: definition.description,
    iconUrl: definition.iconUrl,
    unlockedAt,
  }
}

export const useBadges = () => {
  const { progress, addBadge } = useGameProgress()
  const lastUnlockedBadge = useState<Badge | null>('qurra:last-unlocked-badge', () => null)
  const earnedBadges = computed(() => progress.value.badges)

  const awardBadge = (levelId: LevelId): Badge | null => {
    const existing = progress.value.badges.find((badge) => badge.levelId === levelId)
    if (existing) return existing

    const badge = createLevelBadge(levelId)
    if (!badge || !addBadge(badge)) return null

    lastUnlockedBadge.value = badge
    return badge
  }

  const getEarnedBadges = (): readonly Badge[] => progress.value.badges

  const clearBadgeNotification = () => {
    lastUnlockedBadge.value = null
  }

  return {
    earnedBadges,
    lastUnlockedBadge: readonly(lastUnlockedBadge),
    awardBadge,
    getEarnedBadges,
    clearBadgeNotification,
  }
}
