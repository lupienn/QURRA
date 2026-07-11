export const GAME_WIDTH = 960
export const GAME_HEIGHT = 540
export const GAME_ASPECT_RATIO = GAME_WIDTH / GAME_HEIGHT

export interface CanvasSize {
  width: number
  height: number
}

export const calculateCanvasSize = (availableWidth: number): CanvasSize => {
  const width = Math.max(1, Math.min(GAME_WIDTH, Math.floor(availableWidth)))
  return { width, height: Math.round(width / GAME_ASPECT_RATIO) }
}
