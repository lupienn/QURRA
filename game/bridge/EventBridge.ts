import type {
  EventBridge as EventBridgeContract,
  GameEventHandler,
  GameEventName,
  GameEvents,
} from '~/types/game'

type UntypedHandler = (payload: unknown) => void

export class EventBridge implements EventBridgeContract {
  private readonly handlers = new Map<GameEventName, Set<UntypedHandler>>()

  emit<Event extends GameEventName>(event: Event, payload: GameEvents[Event]): void {
    const listeners = this.handlers.get(event)
    if (!listeners) return

    for (const listener of [...listeners]) listener(payload)
  }

  on<Event extends GameEventName>(event: Event, handler: GameEventHandler<Event>): void {
    const listeners = this.handlers.get(event) ?? new Set<UntypedHandler>()
    listeners.add(handler as UntypedHandler)
    this.handlers.set(event, listeners)
  }

  off<Event extends GameEventName>(event: Event, handler: GameEventHandler<Event>): void {
    const listeners = this.handlers.get(event)
    listeners?.delete(handler as UntypedHandler)
    if (listeners?.size === 0) this.handlers.delete(event)
  }

  clear(): void {
    this.handlers.clear()
  }

  listenerCount(event: GameEventName): number {
    return this.handlers.get(event)?.size ?? 0
  }
}

export const gameEventBridge = new EventBridge()
