export const GAME_ASSETS = [
  { type: 'svg', key: 'qurra-player', url: '/game/player.svg' },
  { type: 'svg', key: 'desert-background', url: '/game/desert.svg' },
  { type: 'svg', key: 'reward-star', url: '/game/star.svg' },
  { type: 'svg', key: 'lantern', url: '/game/lantern.svg' },
] as const

export const getAssetLoadErrorMessage = (assetKey: string): string =>
  `Aset ${assetKey} gagal dimuat.`
