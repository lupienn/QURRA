import { readonly, shallowRef } from 'vue'
import type Phaser from 'phaser'

import { gameEventBridge } from '~/game/bridge/EventBridge'
import type { GameEventHandler, GameEventName, GameEvents } from '~/types/game'

const connectedGame = shallowRef<Phaser.Game | null>(null)

export const usePhaserBridge = () => {
  const connectToGame = (game: Phaser.Game) => {
    connectedGame.value = game
  }

  const disconnect = () => {
    connectedGame.value = null
    gameEventBridge.clear()
  }

  const emit = <Event extends GameEventName>(event: Event, payload: GameEvents[Event]) =>
    gameEventBridge.emit(event, payload)

  const on = <Event extends GameEventName>(event: Event, handler: GameEventHandler<Event>) => {
    gameEventBridge.on(event, handler)
    return () => gameEventBridge.off(event, handler)
  }

  const off = <Event extends GameEventName>(event: Event, handler: GameEventHandler<Event>) =>
    gameEventBridge.off(event, handler)

  return {
    connectedGame: readonly(connectedGame),
    connectToGame,
    disconnect,
    emit,
    on,
    off,
  }
}
