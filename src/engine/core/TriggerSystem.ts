import type { Trigger, ConditionalTrigger } from '../types';
import { useGameStateStore } from './GameStateStore';

class TriggerSystem {
  private static instance: TriggerSystem;

  private constructor() {}

  static getInstance(): TriggerSystem {
    if (!TriggerSystem.instance) {
      TriggerSystem.instance = new TriggerSystem();
    }
    return TriggerSystem.instance;
  }

  dispatch(trigger: Trigger): void {
    if (trigger.type === 'composite') {
      trigger.sequence.forEach((t) => this.dispatch(t));
      return;
    }

    useGameStateStore.getState().set((prev) => {
      switch (trigger.type) {
        case 'navigate-scene':
          return { currentSceneId: trigger.sceneId };
        case 'navigate-dialogue':
          return { activeDialogueId: trigger.dialogueId };
        case 'set-flag':
          return {
            flags: {
              ...prev.flags,
              [trigger.key]: trigger.value,
            },
          };
        case 'play-animation':
        case 'play-audio':
        case 'stop-audio':
          return {};
        default:
          return {};
      }
    });
  }

  dispatchConditional(conditional: ConditionalTrigger): void {
    const state = useGameStateStore.getState();

    if (conditional.condition && !conditional.condition(state)) {
      return;
    }

    this.dispatch(conditional.trigger);
  }
}

export const triggerSystem = TriggerSystem.getInstance();